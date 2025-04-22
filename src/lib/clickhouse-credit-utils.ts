import { clickhouse } from './clickhouse';
import { v4 as uuidv4 } from 'uuid';

// Get user credits from ClickHouse
export async function getUserCreditsClickHouse(userId: string): Promise<number> {
  try {
    const query = `
      SELECT credits 
      FROM user_credits 
      WHERE user_id = '${userId}'
      ORDER BY updated_at DESC
      LIMIT 1
    `;
    
    const result = await clickhouse.query({
      query,
      format: 'JSONEachRow',
    }).then(res => res.json());
    
    if (result.length === 0) {
      // Initialize credits if they don't exist
      const now = new Date().toISOString();
      await clickhouse.insert({
        table: 'user_credits',
        values: [{
          id: uuidv4(),
          user_id: userId,
          credits: 1000,
          updated_at: now,
        }],
        format: 'JSONEachRow',
      });
      
      return 1000;
    }
    
    return result[0].credits;
  } catch (error) {
    console.error('Error fetching user credits from ClickHouse:', error);
    throw error;
  }
}

// Update user credits in ClickHouse
export async function updateUserCreditsClickHouse(userId: string, newCredits: number): Promise<number> {
  try {
    const now = new Date().toISOString();
    
    // Insert new credit record
    await clickhouse.insert({
      table: 'user_credits',
      values: [{
        id: uuidv4(),
        user_id: userId,
        credits: newCredits,
        updated_at: now,
      }],
      format: 'JSONEachRow',
    });
    
    return newCredits;
  } catch (error) {
    console.error('Error updating user credits in ClickHouse:', error);
    throw error;
  }
}

// Add API usage record in ClickHouse
export async function recordApiUsageClickHouse(
  userId: string, 
  apiName: string, 
  endpoint: string, 
  creditsUsed: number
): Promise<void> {
  try {
    const now = new Date().toISOString();
    
    // Record usage
    await clickhouse.insert({
      table: 'api_usage',
      values: [{
        id: uuidv4(),
        user_id: userId,
        api_name: apiName,
        endpoint: endpoint,
        credits_used: creditsUsed,
        timestamp: now,
      }],
      format: 'JSONEachRow',
    });
    
    // Update credits (by creating a new record with adjusted balance)
    const currentCredits = await getUserCreditsClickHouse(userId);
    await updateUserCreditsClickHouse(userId, currentCredits - creditsUsed);
  } catch (error) {
    console.error('Error recording API usage in ClickHouse:', error);
    throw error;
  }
}

// Get user API usage statistics from ClickHouse
export async function getUserApiUsageClickHouse(userId: string, limit = 10): Promise<any[]> {
  try {
    const query = `
      SELECT 
        api_name,
        endpoint,
        SUM(usage_count) as total_requests,
        SUM(credits_used) as total_credits_used,
        MAX(timestamp) as last_used
      FROM api_usage 
      WHERE user_id = '${userId}'
      GROUP BY api_name, endpoint
      ORDER BY last_used DESC
      LIMIT ${limit}
    `;
    
    const result = await clickhouse.query({
      query,
      format: 'JSONEachRow',
    }).then(res => res.json());
    
    return result;
  } catch (error) {
    console.error('Error fetching user API usage from ClickHouse:', error);
    throw error;
  }
}

// Get monthly API usage count from ClickHouse
export async function getMonthlyApiUsageClickHouse(userId: string): Promise<number> {
  try {
    const query = `
      SELECT COUNT(*) as count
      FROM api_usage 
      WHERE 
        user_id = '${userId}' AND 
        timestamp >= toStartOfMonth(now())
    `;
    
    const result = await clickhouse.query({
      query,
      format: 'JSONEachRow',
    }).then(res => res.json());
    
    return parseInt(result[0].count, 10);
  } catch (error) {
    console.error('Error fetching monthly API usage from ClickHouse:', error);
    return 0;
  }
}
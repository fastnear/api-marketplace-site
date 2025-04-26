import { query } from './db';

// Get user credits from the database
export async function getUserCredits(userId: string): Promise<number> {
  // PostgreSQL implementation
  try {
    const result = await query(
      'SELECT credits FROM user_credits WHERE user_id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      // Initialize credits if they don't exist
      await query(
        'INSERT INTO user_credits (user_id, credits) VALUES ($1, $2) RETURNING credits',
        [userId, 1000]
      );
      return 1000;
    }
    
    return result.rows[0].credits;
  } catch (error) {
    console.error('Error fetching user credits:', error);
    throw error;
  }
}

// Update user credits
export async function updateUserCredits(userId: string, newCredits: number): Promise<number> {
  // PostgreSQL implementation
  try {
    const result = await query(
      'UPDATE user_credits SET credits = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING credits',
      [newCredits, userId]
    );
    
    if (result.rows.length === 0) {
      throw new Error('User credits not found');
    }
    
    return result.rows[0].credits;
  } catch (error) {
    console.error('Error updating user credits:', error);
    throw error;
  }
}

// Add API usage record
export async function recordApiUsage(userId: string, apiName: string, endpoint: string, creditsUsed: number): Promise<void> {
  // PostgreSQL implementation
  try {
    // Record usage
    await query(
      'INSERT INTO api_usage (user_id, api_name, endpoint, credits_used) VALUES ($1, $2, $3, $4)',
      [userId, apiName, endpoint, creditsUsed]
    );
    
    // Deduct credits
    await query(
      'UPDATE user_credits SET credits = credits - $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2',
      [creditsUsed, userId]
    );
  } catch (error) {
    console.error('Error recording API usage:', error);
    throw error;
  }
}

// Get user API usage statistics
export async function getUserApiUsage(userId: string, limit = 10): Promise<any[]> {
  // PostgreSQL implementation
  try {
    const result = await query(
      `SELECT api_name, endpoint, SUM(usage_count) as total_requests, 
       SUM(credits_used) as total_credits_used, 
       MAX(timestamp) as last_used
       FROM api_usage 
       WHERE user_id = $1 
       GROUP BY api_name, endpoint
       ORDER BY last_used DESC
       LIMIT $2`,
      [userId, limit]
    );
    
    return result.rows;
  } catch (error) {
    console.error('Error fetching user API usage:', error);
    throw error;
  }
}

// Get monthly API usage count
export async function getMonthlyApiUsage(userId: string): Promise<number> {
  // PostgreSQL implementation
  try {
    const result = await query(
      `SELECT COUNT(*) as count
       FROM api_usage 
       WHERE user_id = $1 AND timestamp >= date_trunc('month', CURRENT_DATE)`,
      [userId]
    );
    
    return parseInt(result.rows[0].count, 10);
  } catch (error) {
    console.error('Error fetching monthly API usage:', error);
    return 0;
  }
}
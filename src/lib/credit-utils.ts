import { query } from './db';

// Get credits
export async function getUserCredits(userId: string): Promise<number> {
  try {
    const result = await query(
      'SELECT credits FROM user_credits WHERE user_id = $1',
      [userId]
    );

    // If no credits exist for the user, initialize them to a default value (1000).
    // Consider implementing an API endpoint to handle credit initialization or increases in the future.
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

// Update credits
export async function updateUserCredits(userId: string, newCredits: number): Promise<number> {
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

// Mike: I believe these tables are all updated through log streaming and ETL
// This feels like a draft worthy of keeping, and likely update the schema
// Get API usage
export async function getUserApiUsage(userId: string, limit = 10): Promise<any[]> {
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

import { Pool } from 'pg';

// Create a new PostgreSQL connection pool (Neon)
const pool = new Pool({
  connectionString: process.env.NEXT_DATABASE_URL,
  max: 50,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 5000,
  statement_timeout: 30000,
  query_timeout: 30000,
});

// Helper function to execute SQL queries
export async function query(text: string, params: any[] = []) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    return res;
  } catch (error) {
    console.error('[DEBUG] Error executing query', { text, error });
    throw error;
  }
}

export { pool };

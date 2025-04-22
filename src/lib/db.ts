import { Pool } from 'pg';

// Create a new PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.NEXT_DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Helper function to execute SQL queries
export async function query(text: string, params: any[] = []) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
}

// Create the necessary tables for NextAuth.js if they don't exist
export async function createTablesIfNeeded() {
  try {
    // Create NextAuth required tables
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        email_verified TIMESTAMP WITH TIME ZONE,
        image VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(255) NOT NULL,
        provider VARCHAR(255) NOT NULL,
        provider_account_id VARCHAR(255) NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at BIGINT,
        token_type VARCHAR(255),
        scope VARCHAR(255),
        id_token TEXT,
        session_state VARCHAR(255),
        UNIQUE(provider, provider_account_id)
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires TIMESTAMP WITH TIME ZONE NOT NULL,
        session_token VARCHAR(255) UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS verification_tokens (
        identifier VARCHAR(255) NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires TIMESTAMP WITH TIME ZONE NOT NULL,
        UNIQUE(identifier, token)
      );
    `);
    
    // Create API marketplace custom tables
    await query(`
      -- Custom table for user API credits
      CREATE TABLE IF NOT EXISTS user_credits (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        credits INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      );
      
      -- Custom table for API usage tracking
      CREATE TABLE IF NOT EXISTS api_usage (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        api_name VARCHAR(255) NOT NULL,
        endpoint VARCHAR(255) NOT NULL,
        usage_count INTEGER NOT NULL DEFAULT 1,
        credits_used INTEGER NOT NULL DEFAULT 0,
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create trigger for automatically adding credits to new users
    await query(`
      -- Function to initialize user credits on creation
      CREATE OR REPLACE FUNCTION initialize_user_credits()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO user_credits (user_id, credits)
        VALUES (NEW.id, 1000)
        ON CONFLICT (user_id) DO NOTHING;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
      
      -- Drop the trigger if it exists to avoid conflicts when re-creating
      DROP TRIGGER IF EXISTS user_created_trigger ON users;
      
      -- Create the trigger
      CREATE TRIGGER user_created_trigger
      AFTER INSERT ON users
      FOR EACH ROW
      EXECUTE FUNCTION initialize_user_credits();
    `);
    
    console.log('Database tables created or already exist');
  } catch (error) {
    console.error('Error creating database tables', error);
    throw error;
  }
}

// Initialize the database with the required tables
export async function initializeDatabase() {
  try {
    await createTablesIfNeeded();
  } catch (error) {
    console.error('Failed to initialize database', error);
  }
}

export { pool };
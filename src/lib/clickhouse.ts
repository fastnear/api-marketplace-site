import { createClient } from '@clickhouse/client';

// Create a new ClickHouse client
export const clickhouse = createClient({
  host: process.env.CLICKHOUSE_HOST || 'http://localhost:8123',
  username: process.env.CLICKHOUSE_USERNAME || 'default',
  password: process.env.CLICKHOUSE_PASSWORD || '',
  database: process.env.CLICKHOUSE_DATABASE || 'default',
  request_timeout: 30000, // 30 seconds
});

// Helper function to execute queries
export async function query(sql: string, params: Record<string, any> = {}) {
  try {
    const resultSet = await clickhouse.query({
      query: sql,
      format: 'JSONEachRow',
      parameters: params,
    });
    
    const rows = await resultSet.json();
    return rows;
  } catch (error) {
    console.error('ClickHouse query error:', error);
    throw error;
  }
}

// Initialize ClickHouse schema
export async function initializeClickHouseSchema() {
  try {
    // Create database if not exists
    await clickhouse.exec({
      query: `CREATE DATABASE IF NOT EXISTS ${process.env.CLICKHOUSE_DATABASE || 'default'}`,
    });

    // Create users table
    await clickhouse.exec({
      query: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID,
          email String,
          name String,
          image String,
          email_verified DateTime64(3, 'UTC'),
          created_at DateTime64(3, 'UTC') DEFAULT now64(),
          updated_at DateTime64(3, 'UTC') DEFAULT now64(),
          PRIMARY KEY (id)
        )
        ENGINE = MergeTree()
        ORDER BY (id);
      `,
    });

    // Create accounts table
    await clickhouse.exec({
      query: `
        CREATE TABLE IF NOT EXISTS accounts (
          id UUID,
          user_id UUID,
          type String,
          provider String,
          provider_account_id String,
          refresh_token String,
          access_token String,
          expires_at Int64,
          token_type String,
          scope String,
          id_token String,
          session_state String,
          created_at DateTime64(3, 'UTC') DEFAULT now64(),
          PRIMARY KEY (id)
        )
        ENGINE = MergeTree()
        ORDER BY (id, provider, provider_account_id);
      `,
    });

    // Create sessions table
    await clickhouse.exec({
      query: `
        CREATE TABLE IF NOT EXISTS sessions (
          id UUID,
          user_id UUID,
          expires DateTime64(3, 'UTC'),
          session_token String,
          created_at DateTime64(3, 'UTC') DEFAULT now64(),
          PRIMARY KEY (id)
        )
        ENGINE = MergeTree()
        ORDER BY (id, session_token);
      `,
    });

    // Create verification tokens table
    await clickhouse.exec({
      query: `
        CREATE TABLE IF NOT EXISTS verification_tokens (
          identifier String,
          token String,
          expires DateTime64(3, 'UTC'),
          created_at DateTime64(3, 'UTC') DEFAULT now64(),
          PRIMARY KEY (identifier, token)
        )
        ENGINE = MergeTree()
        ORDER BY (identifier, token);
      `,
    });

    // Create user credits table
    await clickhouse.exec({
      query: `
        CREATE TABLE IF NOT EXISTS user_credits (
          id UUID,
          user_id UUID,
          credits Int32 DEFAULT 1000,
          updated_at DateTime64(3, 'UTC') DEFAULT now64(),
          PRIMARY KEY (id)
        )
        ENGINE = MergeTree()
        ORDER BY (id, user_id);
      `,
    });

    // Create API usage table
    await clickhouse.exec({
      query: `
        CREATE TABLE IF NOT EXISTS api_usage (
          id UUID,
          user_id UUID,
          api_name String,
          endpoint String,
          usage_count Int32 DEFAULT 1,
          credits_used Int32 DEFAULT 0,
          timestamp DateTime64(3, 'UTC') DEFAULT now64(),
          PRIMARY KEY (id)
        )
        ENGINE = MergeTree()
        ORDER BY (id, user_id, timestamp);
      `,
    });

    console.log('ClickHouse schema initialized');
  } catch (error) {
    console.error('Error initializing ClickHouse schema:', error);
    throw error;
  }
}

// Initialize the ClickHouse schema when the module is imported in development
if (process.env.NODE_ENV !== 'production' && process.env.USE_CLICKHOUSE === 'true') {
  initializeClickHouseSchema().catch(console.error);
}
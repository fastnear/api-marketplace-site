import type { Adapter } from "next-auth/adapters";
import { v4 as uuidv4 } from 'uuid';
import { clickhouse } from './clickhouse';

/**
 * ClickHouse adapter for NextAuth
 * This is a custom adapter for using ClickHouse with NextAuth.js
 * It's not officially supported by NextAuth, so use with caution
 */
export function ClickHouseAdapter(): Adapter {
  return {
    async createUser(user) {
      const id = uuidv4();
      const now = new Date().toISOString();
      
      await clickhouse.insert({
        table: 'users',
        values: [{
          id,
          name: user.name || '',
          email: user.email,
          image: user.image || '',
          email_verified: user.emailVerified ? user.emailVerified.toISOString() : null,
          created_at: now,
          updated_at: now,
        }],
        format: 'JSONEachRow',
      });
      
      // Initialize user credits
      await clickhouse.insert({
        table: 'user_credits',
        values: [{
          id: uuidv4(),
          user_id: id,
          credits: 1000,
          updated_at: now,
        }],
        format: 'JSONEachRow',
      });
      
      return {
        id,
        ...user,
        emailVerified: user.emailVerified || null,
      };
    },
    
    async getUser(id) {
      const query = `SELECT * FROM users WHERE id = '${id}' LIMIT 1`;
      const rows = await clickhouse.query({
        query,
        format: 'JSONEachRow',
      }).then(res => res.json());
      
      if (!rows.length) return null;
      
      const user = rows[0] as {
        id: string;
        name: string;
        email: string;
        email_verified: string | null;
        image: string;
      };
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.email_verified ? new Date(user.email_verified) : null,
        image: user.image,
      };
    },
    
    async getUserByEmail(email) {
      const query = `SELECT * FROM users WHERE email = '${email}' LIMIT 1`;
      const rows = await clickhouse.query({
        query,
        format: 'JSONEachRow',
      }).then(res => res.json());
      
      if (!rows.length) return null;
      
      const user = rows[0] as {
        id: string;
        name: string;
        email: string;
        email_verified: string | null;
        image: string;
      };
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.email_verified ? new Date(user.email_verified) : null,
        image: user.image,
      };
    },
    
    async getUserByAccount({ provider, providerAccountId }) {
      // Get account
      const accountQuery = `
        SELECT * FROM accounts 
        WHERE provider = '${provider}' AND provider_account_id = '${providerAccountId}'
        LIMIT 1
      `;
      const accountRows = await clickhouse.query({
        query: accountQuery,
        format: 'JSONEachRow',
      }).then(res => res.json());
      
      if (!accountRows.length) return null;
      
      // Get user
      const account = accountRows[0] as { user_id: string };
      const userId = account.user_id;
      const userQuery = `SELECT * FROM users WHERE id = '${userId}' LIMIT 1`;
      const userRows = await clickhouse.query({
        query: userQuery,
        format: 'JSONEachRow',
      }).then(res => res.json());
      
      if (!userRows.length) return null;
      
      const user = userRows[0] as {
        id: string;
        name: string;
        email: string;
        email_verified: string | null;
        image: string;
      };
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.email_verified ? new Date(user.email_verified) : null,
        image: user.image,
      };
    },
    
    async updateUser(user) {
      const now = new Date().toISOString();
      
      await clickhouse.query({
        query: `
          ALTER TABLE users
          UPDATE
            name = '${user.name || ''}',
            email = '${user.email || ''}',
            image = '${user.image || ''}',
            email_verified = ${user.emailVerified ? `'${user.emailVerified.toISOString()}'` : 'NULL'},
            updated_at = '${now}'
          WHERE id = '${user.id}'
        `,
      });
      
      // Get updated user to ensure we return the complete user object
      const query = `SELECT * FROM users WHERE id = '${user.id}' LIMIT 1`;
      const rows = await clickhouse.query({
        query,
        format: 'JSONEachRow',
      }).then(res => res.json());
      
      if (!rows.length) {
        // If we can't find the user, return what we have with required fields
        return {
          id: user.id,
          email: user.email || '',  // Ensure email is not undefined
          emailVerified: user.emailVerified || null,
          name: user.name || null,
          image: user.image || null,
        };
      }
      
      const updatedUser = rows[0] as {
        id: string;
        name: string;
        email: string;
        email_verified: string | null;
        image: string;
      };
      
      return {
        id: updatedUser.id,
        name: updatedUser.name || null,
        email: updatedUser.email,
        emailVerified: updatedUser.email_verified ? new Date(updatedUser.email_verified) : null,
        image: updatedUser.image || null,
      };
    },
    
    async deleteUser(userId) {
      // Delete related records first
      await clickhouse.query({
        query: `ALTER TABLE accounts DELETE WHERE user_id = '${userId}'`,
      });
      
      await clickhouse.query({
        query: `ALTER TABLE sessions DELETE WHERE user_id = '${userId}'`,
      });
      
      await clickhouse.query({
        query: `ALTER TABLE user_credits DELETE WHERE user_id = '${userId}'`,
      });
      
      await clickhouse.query({
        query: `ALTER TABLE api_usage DELETE WHERE user_id = '${userId}'`,
      });
      
      // Delete the user
      await clickhouse.query({
        query: `ALTER TABLE users DELETE WHERE id = '${userId}'`,
      });
    },
    
    async linkAccount(account) {
      const id = uuidv4();
      const now = new Date().toISOString();
      
      await clickhouse.insert({
        table: 'accounts',
        values: [{
          id,
          user_id: account.userId,
          type: account.type,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          refresh_token: account.refresh_token || '',
          access_token: account.access_token || '',
          expires_at: account.expires_at || 0,
          token_type: account.token_type || '',
          scope: account.scope || '',
          id_token: account.id_token || '',
          session_state: account.session_state || '',
          created_at: now,
        }],
        format: 'JSONEachRow',
      });
      
      return {
        ...account,
        id,
      };
    },
    
    async unlinkAccount({ provider, providerAccountId }) {
      await clickhouse.query({
        query: `
          ALTER TABLE accounts DELETE
          WHERE provider = '${provider}' AND provider_account_id = '${providerAccountId}'
        `,
      });
    },
    
    async createSession({ sessionToken, userId, expires }) {
      const id = uuidv4();
      const now = new Date().toISOString();
      
      await clickhouse.insert({
        table: 'sessions',
        values: [{
          id,
          user_id: userId,
          expires: expires.toISOString(),
          session_token: sessionToken,
          created_at: now,
        }],
        format: 'JSONEachRow',
      });
      
      return {
        id,
        sessionToken,
        userId,
        expires,
      };
    },
    
    async getSessionAndUser(sessionToken) {
      // Get session
      const sessionQuery = `
        SELECT * FROM sessions 
        WHERE session_token = '${sessionToken}'
        LIMIT 1
      `;
      const sessionRows = await clickhouse.query({
        query: sessionQuery,
        format: 'JSONEachRow',
      }).then(res => res.json());
      
      if (!sessionRows.length) return null;
      
      const session = sessionRows[0] as {
        id: string;
        user_id: string;
        expires: string;
      };
      const sessionExpires = new Date(session.expires);
      
      // Check if session is expired
      if (sessionExpires < new Date()) return null;
      
      // Get user
      const userQuery = `SELECT * FROM users WHERE id = '${session.user_id}' LIMIT 1`;
      const userRows = await clickhouse.query({
        query: userQuery,
        format: 'JSONEachRow',
      }).then(res => res.json());
      
      if (!userRows.length) return null;
      
      const user = userRows[0] as {
        id: string;
        name: string;
        email: string;
        email_verified: string | null;
        image: string;
      };
      
      return {
        session: {
          id: session.id,
          sessionToken,
          userId: session.user_id,
          expires: sessionExpires,
        },
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.email_verified ? new Date(user.email_verified) : null,
          image: user.image,
        },
      };
    },
    
    async updateSession({ sessionToken, expires, userId }) {
      await clickhouse.query({
        query: `
          ALTER TABLE sessions
          UPDATE
            expires = '${expires.toISOString()}'
            ${userId ? `, user_id = '${userId}'` : ''}
          WHERE session_token = '${sessionToken}'
        `,
      });
      
      const sessionQuery = `
        SELECT * FROM sessions 
        WHERE session_token = '${sessionToken}'
        LIMIT 1
      `;
      const rows = await clickhouse.query({
        query: sessionQuery,
        format: 'JSONEachRow',
      }).then(res => res.json());
      
      if (!rows.length) return null;
      
      const session = rows[0] as {
        id: string;
        user_id: string;
        expires: string;
      };
      
      return {
        id: session.id,
        sessionToken,
        userId: session.user_id,
        expires: new Date(session.expires),
      };
    },
    
    async deleteSession(sessionToken) {
      await clickhouse.query({
        query: `ALTER TABLE sessions DELETE WHERE session_token = '${sessionToken}'`,
      });
    },
    
    async createVerificationToken({ identifier, expires, token }) {
      const now = new Date().toISOString();
      
      await clickhouse.insert({
        table: 'verification_tokens',
        values: [{
          identifier,
          expires: expires.toISOString(),
          token,
          created_at: now,
        }],
        format: 'JSONEachRow',
      });
      
      return {
        identifier,
        token,
        expires,
      };
    },
    
    async useVerificationToken({ identifier, token }) {
      // Get the token
      const tokenQuery = `
        SELECT * FROM verification_tokens 
        WHERE identifier = '${identifier}' AND token = '${token}'
        LIMIT 1
      `;
      const rows = await clickhouse.query({
        query: tokenQuery,
        format: 'JSONEachRow',
      }).then(res => res.json());
      
      if (!rows.length) return null;
      
      const tokenData = rows[0] as {
        identifier: string;
        token: string;
        expires: string;
      };
      const expires = new Date(tokenData.expires);
      
      // Delete the token
      await clickhouse.query({
        query: `
          ALTER TABLE verification_tokens DELETE
          WHERE identifier = '${identifier}' AND token = '${token}'
        `,
      });
      
      return {
        identifier,
        token,
        expires,
      };
    },
  };
}
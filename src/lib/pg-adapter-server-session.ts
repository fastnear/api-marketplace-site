// this is where we're about to connect the session to our db
// https://next-auth.js.org/tutorials/creating-a-database-adapter

import { Pool } from 'pg'
import type { Adapter } from 'next-auth/adapters'

/**
 * Custom PostgreSQL Adapter for NextAuth that uses snake_case column names
 * This extends the official @auth/pg-adapter but uses PostgreSQL's conventional
 * snake_case naming instead of camelCase
 * Mike: it was like, actually trying to force us to have db columns in camel
 */
export default function PgAdapterServerSession(client: Pool): Adapter {
  return {
    async createVerificationToken(verificationToken) {
      const { identifier, expires, token } = verificationToken

      await client.query(
        'INSERT INTO verification_tokens (identifier, expires, token) VALUES ($1, $2, $3)',
        [identifier, expires, token]
      )

      return verificationToken
    },

    async useVerificationToken({ identifier, token }) {
      const result = await client.query(
        'DELETE FROM verification_tokens WHERE identifier = $1 AND token = $2 RETURNING identifier, expires, token',
        [identifier, token]
      )

      if (result.rowCount === 0) return null

      return {
        identifier: result.rows[0].identifier,
        token: result.rows[0].token,
        expires: result.rows[0].expires
      }
    },

    async createUser(user) {
      const { name, email, emailVerified, image } = user

      const result = await client.query(
        'INSERT INTO users (name, email, email_verified, image) VALUES ($1, $2, $3, $4) RETURNING id, name, email, email_verified, image',
        [name, email, emailVerified, image]
      )

      return {
        id: result.rows[0].id.toString(),
        name: result.rows[0].name,
        email: result.rows[0].email,
        emailVerified: result.rows[0].email_verified,
        image: result.rows[0].image
      }
    },

    async getUser(id) {
      const result = await client.query(
        'SELECT id, name, email, email_verified, image FROM users WHERE id = $1',
        [id]
      )

      if (result.rowCount === 0) return null

      return {
        id: result.rows[0].id.toString(),
        name: result.rows[0].name,
        email: result.rows[0].email,
        emailVerified: result.rows[0].email_verified,
        image: result.rows[0].image
      }
    },

    async getUserByEmail(email) {
      const result = await client.query(
        'SELECT id, name, email, email_verified, image FROM users WHERE email = $1',
        [email]
      )

      if (result.rowCount === 0) return null

      return {
        id: result.rows[0].id.toString(),
        name: result.rows[0].name,
        email: result.rows[0].email,
        emailVerified: result.rows[0].email_verified,
        image: result.rows[0].image
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const result = await client.query(
        `SELECT u.id, u.name, u.email, u.email_verified, u.image 
         FROM users u 
         JOIN accounts a ON u.id = a.user_id 
         WHERE a.provider_account_id = $1 AND a.provider = $2`,
        [providerAccountId, provider]
      )

      if (result.rowCount === 0) return null

      return {
        id: result.rows[0].id.toString(),
        name: result.rows[0].name,
        email: result.rows[0].email,
        emailVerified: result.rows[0].email_verified,
        image: result.rows[0].image
      }
    },

    async updateUser(user) {
      const { id, name, email, emailVerified, image } = user

      const result = await client.query(
        `UPDATE users SET 
           name = COALESCE($1, name), 
           email = COALESCE($2, email), 
           email_verified = COALESCE($3, email_verified), 
           image = COALESCE($4, image)
         WHERE id = $5
         RETURNING id, name, email, email_verified, image`,
        [name, email, emailVerified, image, id]
      )

      return {
        id: result.rows[0].id.toString(),
        name: result.rows[0].name,
        email: result.rows[0].email,
        emailVerified: result.rows[0].email_verified,
        image: result.rows[0].image
      }
    },

    async deleteUser(userId) {
      await client.query('DELETE FROM users WHERE id = $1', [userId])
    },

    async linkAccount(account) {
      const {
        userId,
        provider,
        type,
        providerAccountId,
        refresh_token,
        access_token,
        expires_at,
        token_type,
        scope,
        id_token,
        session_state
      } = account

      // Map camelCase properties to snake_case for the database

      // Mike: so I'm not satisfied with part of this, about the snake case.
      // So our schema has snake case, like you're supposed to. NextAuth has its
      // own schema that demanded camel case, like making the column verifyTokens.
      // Suppose we could, but AI seems to agree this against convention and
      // suggests here: https://chatgpt.com/share/68119867-ee98-8004-a3fe-378150253faa
      // Keeping it for now, with this note.
      const refreshToken = account.refresh_token || account.refreshToken;
      const accessToken = account.access_token || account.accessToken;
      const expiresAt = account.expires_at || account.expiresAt;
      const tokenType = account.token_type || account.tokenType;
      const idToken = account.id_token || account.idToken;
      const sessionState = account.session_state || account.sessionState;

      await client.query(
        `INSERT INTO accounts (
           user_id, provider, type, provider_account_id, 
           refresh_token, access_token, expires_at, token_type, 
           scope, id_token, session_state
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          userId,
          provider,
          type,
          providerAccountId,
          refreshToken,
          accessToken,
          expiresAt,
          tokenType,
          scope,
          idToken,
          sessionState
        ]
      )

      return account
    },

    async unlinkAccount({ providerAccountId, provider }) {
      await client.query(
        'DELETE FROM accounts WHERE provider_account_id = $1 AND provider = $2',
        [providerAccountId, provider]
      )
    },

    async createSession(session) {
      const { sessionToken, userId, expires } = session

      await client.query(
        'INSERT INTO sessions (session_token, user_id, expires) VALUES ($1, $2, $3)',
        [sessionToken, userId, expires]
      )

      return session
    },

    async getSessionAndUser(sessionToken) {
      const result = await client.query(
        `SELECT 
           s.session_token, s.user_id, s.expires,
           u.id, u.name, u.email, u.email_verified, u.image
         FROM sessions s
         JOIN users u ON s.user_id = u.id
         WHERE s.session_token = $1`,
        [sessionToken]
      )

      if (result.rowCount === 0) return null

      const { session_token, user_id, expires, id, name, email, email_verified, image } = result.rows[0]

      return {
        session: {
          sessionToken: session_token,
          userId: user_id.toString(),
          expires
        },
        user: {
          id: id.toString(),
          name,
          email,
          emailVerified: email_verified,
          image
        }
      }
    },

    async updateSession(session) {
      const { sessionToken, userId, expires } = session

      // If userId is null or undefined, just update the expires time, not the userId
      if (!userId) {
        const result = await client.query(
          `UPDATE sessions SET expires = $1 WHERE session_token = $2 
           RETURNING session_token, user_id, expires`,
          [expires, sessionToken]
        )

        if (result.rowCount === 0) return null

        return {
          sessionToken: result.rows[0].session_token,
          userId: result.rows[0].user_id?.toString() || null,
          expires: result.rows[0].expires
        }
      }

      // Normal case with userId present
      const result = await client.query(
        `UPDATE sessions SET user_id = $1, expires = $2 WHERE session_token = $3 
         RETURNING session_token, user_id, expires`,
        [userId, expires, sessionToken]
      )

      if (result.rowCount === 0) return null

      return {
        sessionToken: result.rows[0].session_token,
        userId: result.rows[0].user_id.toString(),
        expires: result.rows[0].expires
      }
    },

    async deleteSession(sessionToken) {
      await client.query('DELETE FROM sessions WHERE session_token = $1', [sessionToken])
    }
  }
}

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// commented out until GitHub OAuth makes sense
// import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import type { SendVerificationRequestParams } from "next-auth/providers/email";
import PgAdapterServerSession from "./pg-adapter-server-session";
// see the second approach here:
import { createTransport } from "nodemailer";
import { pool } from "./db";

/**
 * Authentication and User Session Management
 * =========================================
 * This file contains the core authentication logic:
 * - Database connection for session storage
 * - User credit management
 * - OAuth providers configuration
 * - Session mgmt
 */

// Get user credits from database
async function getUserCredits(userId: string): Promise<number | null> {
  if (!pool) return null;

  try {
    const result = await pool.query(
      'SELECT credits FROM user_credits WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length > 0) {
      return result.rows[0].credits;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  // shows more logs
  debug: process.env.NODE_ENV === "development",

  /**
   * Database Adapter Configuration
   * Uses the PostgreSQL adapter exclusively
   * This enables database-backed sessions
   */
  adapter: pool ? PgAdapterServerSession(pool) : undefined,

  providers: [
    // Google OAuth provider - primary authentication method
    // This creates records in the accounts table on successful sign-in
    // Format: {provider: 'google', provider_account_id: 'google-id', ...}
    GoogleProvider({
      clientId: process.env.NEXTAUTH_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.NEXTAUTH_GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "select_account",  // Force account selection screen
          access_type: "offline",    // Get refresh token for long-term access
          response_type: "code"      // Standard OAuth code flow
        }
      }
    }),

    // GitHub provider is commented until needed
    /*
    GitHubProvider({
      clientId: process.env.NEXTAUTH_GITHUB_ID || "",
      clientSecret: process.env.NEXTAUTH_GITHUB_SECRET || "",
    }),
    */

    EmailProvider({
      server: {
        host: process.env.NEXTAUTH_SMTP_SERVER,
        port: parseInt(process.env.NEXTAUTH_SMTP_PORT || '465'),
        auth: {
          user: process.env.NEXTAUTH_SMTP_USER,
          pass: process.env.NEXTAUTH_SMTP_PASSWORD
        },
        secure: true
      },
      from: process.env.NEXTAUTH_EMAIL_FROM,
      maxAge: 60 * 60, // 1 hour

      async sendVerificationRequest(params: SendVerificationRequestParams) {
        const { identifier, url, provider } = params;
        console.log("Sending verification email to:", identifier);
        console.log("Verification URL:", url);

        try {
          // Create transport using configuration above in server
          const transport = createTransport(provider.server);

          // Send email with enhanced template
          const result = await transport.sendMail({
            to: identifier,
            from: process.env.NEXTAUTH_EMAIL_FROM,
            subject: `FastNear Subscriptions Dashboard`,
            text: `Click to access your dashboard: ${url}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <h2>FastNear Subscriptions Dashboard</h2>
                <p>Use the link below to continue:</p>
                <p style="text-align: center;">
                  <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Open Dashboard</a>
                </p>
                <p style="color: #666; font-size: 14px; margin-top: 20px;">If this wasn’t you, feel free to ignore this message.</p>
              </div>`
          });

          console.log("Email transmission result:", {
            messageId: result.messageId,
            accepted: result.accepted,
            rejected: result.rejected
          });
        } catch (error) {
          console.error("Verification email transmission failure:", error);
          throw error;
        }
      }
    }),
  ],

  pages: {
    // page showing login options (src/app/(auth)/login/page.tsx)
    signIn: "/login",
    // used for email verification (src/app/(auth)/verify-request/page.tsx)
    verifyRequest: "/verify-request",
  },

  /**
   * Session Configuration
   * Using database strategy exclusively
   *
   * Session duration is 30 days by default
   */
  session: {
    // see: https://neon.tech
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    /**
     * Session Callback - Enhance session with user data
     * Called whenever session is checked (on page loads, etc.)
     *
     * For database sessions, user object is available
     * We add credits to the session
     */
    async session({ session, user }) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Auth] Session callback invoked', {
          hasUser: !!user,
          sessionUser: session?.user?.email
        });
      }

      if (session.user && user) {
        // For database sessions (user is available)
        session.user.id = user.id;
        if (process.env.NODE_ENV === 'development') {
          console.log('[Auth] Database session for user:', user.email);
        }

        // Add user credits to the session
        try {
          const credits = await getUserCredits(user.id);
          if (credits !== null) {
            session.user.credits = credits;
            if (process.env.NODE_ENV === 'development') {
              console.log('[Auth] Added credits to session:', credits);
            }
          }
        } catch (error) {
          console.error("[Auth] Error adding credits to session:", error);
        }
      }
      return session;
    },

    /**
     * SignIn Callback - Called during authentication
     * Allows rejecting sign-in based on additional checks
     *
     * Here we ensure Google accounts have verified emails
     * No direct database queries are made here
     */
    async signIn({ user, account, profile }) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Auth] SignIn callback called', {
          provider: account?.provider,
          userId: user?.id,
          userEmail: user?.email
        });
      }

      // for Google OAuth, we require email to be marked verified by Google
      if (account?.provider === 'google' && profile) {
        const googleProfile = profile as { email_verified?: boolean };
        if (process.env.NODE_ENV === 'development') {
          console.log('[Auth] Google profile:', {
            emailVerified: googleProfile.email_verified,
            email: profile.email
          });
        }

        if (googleProfile.email_verified === false) {
          // prevent sign in
          console.error('[Auth] Rejecting sign in: Email not verified');
          return false;
        }
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[Auth] Sign in successful');
      }
      return true; // Allow sign in
    }
  },

  /**
   * Events - Lifecycle hooks for authentication
   * Can be used for audit logging, analytics, or additional logic
   *
   * New users automatically get credits via database trigger in schema.sql:
   * CREATE TRIGGER user_created_trigger
   * AFTER INSERT ON users
   * FOR EACH ROW
   * EXECUTE FUNCTION initialize_user_credits();
   */
  events: {
    async createUser({ user }) {
      // Log user creation for auditing
      console.log("[Auth Event] New user created:", user.email);

      // Note: Credits are initialized by database trigger in schema.sql
      // trigger automatically inserts 1000 credits for new users
      // INSERT INTO user_credits (user_id, credits) VALUES (NEW.id, 1000)
      // TODO: mike ^ I don't like that, but can discuss approach
    },

    async signIn({ user, account, isNewUser }) {
      if (process.env.NODE_ENV === 'development') {
        console.log("[Auth Event] User signed in:", user.email);
        console.log("[Auth Event] Provider:", account?.provider);
        console.log("[Auth Event] Account details:", {
          type: account?.type,
          providerAccountId: account?.providerAccountId,
          provider: account?.provider,
          isNewUser
        });
      }

      // Additional tracking or analytics could be added here
      if (isNewUser) {
        console.log("[Auth Event] First time login for user:", user.email);
      }
    },

    async linkAccount({ user, account }) {
      if (process.env.NODE_ENV === 'development') {
        console.log("[Auth Event] Account linked:", {
          user: user.email,
          provider: account.provider,
          providerAccountId: account.providerAccountId
        });
      }
    },

    async session({ session }) {
      if (process.env.NODE_ENV === 'development') {
        console.log("[Auth Event] Session updated:", {
          user: session?.user?.email,
          expires: session?.expires
        });
      }
    }
  },
};

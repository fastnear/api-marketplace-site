import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "@/types/auth";
// import PgAdapter from "@auth/pg-adapter";
import CustomPgAdapter from "./custom-pg-adapter";
import { Pool } from "pg";
import { initializeDatabase } from "./db";

/**
 * Authentication and User Session Management
 * =========================================
 * This file contains the core authentication logic:
 * - Database connection for session storage
 * - User credit management
 * - OAuth providers configuration
 * - Session initialization and enhancement
 * 
 * Database Tables Used:
 * - users: User profile information
 * - accounts: OAuth provider accounts
 * - sessions: Active user sessions
 * - user_credits: User credit balances
 * 
 * Authentication Flow:
 * 1. User signs in with Google OAuth
 * 2. NextAuth creates/updates user in database
 * 3. Session created and stored in database
 * 4. Session enhanced with user credits
 * 5. Session token stored in secure cookie
 */

// Initialize PostgreSQL connection pool if NEXT_DATABASE_URL is set
let pool: Pool | undefined;
if (process.env.NEXT_DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.NEXT_DATABASE_URL
  });

  // Initialize the database schema if it doesn't exist
  if (process.env.NODE_ENV !== 'production') {
    // PostgreSQL initialization
    // This creates all required tables if they don't exist:
    // - users, accounts, sessions, verification_tokens (NextAuth)
    // - user_credits, api_usage (Custom tables)
    // - Also creates trigger to initialize credits for new users
    initializeDatabase().catch(console.error);
  }
} else {
  console.error('ERROR: NEXT_DATABASE_URL environment variable is not set!');
  console.error('Authentication requires a database connection. Please set NEXT_DATABASE_URL.');
}

/**
 * Get user credits from database
 * Called during session creation/validation to include credits in session
 * 
 * Database Query:
 * ```sql
 * SELECT credits FROM user_credits WHERE user_id = $1
 * ```
 * 
 * Returns null if:
 * - Database is not configured
 * - User has no credits record
 * - Database error occurs
 */
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
  debug: process.env.NODE_ENV === "development",
  
  /**
   * Database Adapter Configuration
   * Uses the PostgreSQL adapter exclusively
   * This enables database-backed sessions
   */
  adapter: pool ? CustomPgAdapter(pool) : undefined,

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
    
    // Development-only credential provider
    ...(process.env.NODE_ENV === "development" ? [
      CredentialsProvider({
        id: "credentials",
        name: "Development Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
        },
        async authorize(credentials) {
        // This is a simplified dev version that allows any email to work
          if (credentials?.email) {
            return {
              id: "dev-user-id",
              name: "Development User",
              email: credentials.email,
              image: null,
            };
          }
          return null;
        },
      })
    ] : []),
    
    // GitHub provider is commented until needed
    /*
    GitHubProvider({
      clientId: process.env.NEXTAUTH_GITHUB_ID || "",
      clientSecret: process.env.NEXTAUTH_GITHUB_SECRET || "",
    }),
    */
    
    // Email provider is commented until needed
    /*
    EmailProvider({
      server: process.env.NEXTAUTH_EMAIL_SERVER || "",
      from: process.env.NEXTAUTH_EMAIL_FROM || "noreply@fastnear.com",
      maxAge: 60 * 60, // 1 hour
    }),
    */
  ],
  
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-request", // Used for email verification
  },
  
  /**
   * Session Configuration
   * Using database strategy exclusively
   * 
   * Session duration is 30 days by default
   */
  session: {
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
        console.log('[Auth] Session callback called', {
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
      
      // For Google, ensure email is verified
      if (account?.provider === 'google' && profile) {
        // Type assertion for Google profile which has email_verified
        const googleProfile = profile as { email_verified?: boolean };
        if (process.env.NODE_ENV === 'development') {
          console.log('[Auth] Google profile:', { 
            emailVerified: googleProfile.email_verified,
            email: profile.email
          });
        }
        
        if (googleProfile.email_verified === false) {
          console.error('[Auth] Rejecting sign in: Email not verified');
          return false; // Prevent sign in if email not verified
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

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { User } from "@/types/auth";
import PgAdapter from "@auth/pg-adapter";
import { Pool } from "pg";
import { initializeDatabase } from "./db";

// Initialize PostgreSQL connection pool if NEXT_DATABASE_URL is set
let pool: Pool | undefined;
if (process.env.NEXT_DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.NEXT_DATABASE_URL
  });

  // Initialize the database schema if it doesn't exist
  if (process.env.NODE_ENV !== 'production') {
    // PostgreSQL initialization
    initializeDatabase().catch(console.error);
  }
}

// Check for required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error('ERROR: NEXTAUTH_SECRET environment variable is not set!');
  console.error('Authentication will fail without this. Generate one with: openssl rand -base64 32');
  
  // Generate a temporary secret to avoid crashes in development
  if (process.env.NODE_ENV !== 'production') {
    // This is a fallback for development ONLY 
    // Generate a pseudo-random string that's consistent for the running instance
    const developmentSecret = `DEVELOPMENT_SECRET_${Math.floor(Date.now() / 3600000)}`;
    console.warn(`Using temporary secret for development: ${developmentSecret}`);
    console.warn('This is NOT secure for production use!');
    process.env.NEXTAUTH_SECRET = developmentSecret;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  
  // Choose database adapter based on configuration
  adapter: pool ? PgAdapter(pool) : undefined,

  providers: [
    // For now, just use credentials provider for development
    {
      id: "credentials",
      name: "Credentials",
      type: "credentials",
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
    },
    
    // Commented out auth providers - uncomment as needed when API keys are available
    
    GoogleProvider({
      clientId: process.env.NEXTAUTH_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.NEXTAUTH_GOOGLE_CLIENT_SECRET || "",
    }),
    /*
    GitHubProvider({
      clientId: process.env.NEXTAUTH_GITHUB_ID || "",
      clientSecret: process.env.NEXTAUTH_GITHUB_SECRET || "",
    }),
    EmailProvider({
      server: process.env.NEXTAUTH_EMAIL_SERVER || "",
      from: process.env.NEXTAUTH_EMAIL_FROM || "noreply@fastnear.com",
      // Email magic link settings
      maxAge: 60 * 60, // 1 hour
    }),
    */
  ],
  
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-request", // Used for email verification
  },
  
  // Session configuration
  session: {
    // Use JWT if no database adapter, otherwise use database sessions
    strategy: pool ? "database" : "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  callbacks: {
    // Handle both JWT and database sessions
    async session({ session, user, token }) {
      if (session.user) {
        if (user) {
          // For database sessions (user is available)
          session.user.id = user.id;
          // Add other user data if needed
        } else if (token) {
          // For JWT sessions (token is available)
          session.user.id = token.sub as string;
          if (token.name) session.user.name = token.name as string;
          if (token.email) session.user.email = token.email as string;
          if (token.picture) session.user.image = token.picture as string;
        }
      }
      return session;
    },
    
    // Transform JWT token - only used with JWT strategy
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  
  events: {
    async createUser({ user }) {
      // You can perform actions when a new user is created
      console.log("New user created:", user.email);
    },
    async signIn({ user }) {
      // You can track sign-ins
      console.log("User signed in:", user.email);
    },
  },
};

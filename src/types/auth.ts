import { DefaultSession } from "next-auth";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }
}

// Define custom user type
export type User = {
  id: string;
  name?: string | null;
  email: string;
  // Add any other user properties you need
};

export type AuthCredentials = {
  email: string;
  password: string;
};
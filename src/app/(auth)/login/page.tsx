"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailSending(true);
    setError("");

    try {
      // Use credentials provider for now
      const result = await signIn("credentials", {
        email,
        redirect: false,
        callbackUrl: "/dashboard"
      });

      if (result?.error) {
        setError(result.error);
        setIsEmailSending(false);
        return;
      }

      if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      setIsEmailSending(false);
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    setLoading(true);
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (error) {
      setError("Authentication failed");
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex min-h-[calc(100vh-144px)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-8 text-center">
          <h2 className="text-2xl font-bold">Check your email</h2>
          <p className="text-gray-600 dark:text-gray-300">
            We've sent a magic link to {email}. Click the link to sign in.
          </p>
          <button
            onClick={() => setEmailSent(false)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Use a different method
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-144px)] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md card-themed rounded-xl shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold heading-themed">
            Sign in to FASTNEAR
          </h2>
          <p className="mt-2 text-center text-sm text-themed-secondary">
            Access the NEAR API Marketplace
          </p>
        </div>
        
        <div className="mt-6 flex flex-col gap-4">
          <button
            onClick={() => handleOAuthSignIn("google")}
            disabled={loading}
            className="flex items-center justify-center gap-3 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <button
            onClick={() => handleOAuthSignIn("github")}
            disabled={loading}
            className="flex items-center justify-center gap-3 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
            Continue with GitHub
          </button>
        </div>

        <div className="my-6 flex items-center justify-center">
          <div className="border-t border-gray-300 dark:border-gray-600 w-full"></div>
          <div className="px-4 text-sm text-gray-500 dark:text-gray-400">Or</div>
          <div className="border-t border-gray-300 dark:border-gray-600 w-full"></div>
        </div>
        
        <form className="space-y-4" onSubmit={handleEmailSignIn}>
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-md border-0 p-2 text-gray-900 dark:text-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isEmailSending}
              className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              {isEmailSending ? "Signing in..." : "Sign in with Email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
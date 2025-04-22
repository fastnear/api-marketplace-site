# Authentication System

This directory contains the authentication-related pages and components for the NEAR API Marketplace.

## Quick Start

```bash
# Copy the minimal environment file
cp .env.minimal .env.local

# Generate a secure random secret and add it to .env.local
openssl rand -base64 32
```

⚠️ **IMPORTANT**: Authentication will not work without setting `NEXTAUTH_SECRET` in your .env.local file!

## Features

- Multi-provider authentication using NextAuth.js
- Support for Google OAuth, GitHub OAuth, and Email Magic Links
- Protected routes with middleware
- User session management
- Database integration for user persistence (PostgreSQL with ClickHouse support)

## Implementation Details

The authentication system uses NextAuth.js with the following components:

1. **API Routes**:
   - `/src/app/api/auth/[...nextauth]/route.ts`: NextAuth.js API route handler

2. **Auth Configuration**:
   - `/src/lib/auth.ts`: Configuration for providers and callbacks

3. **Auth Pages**:
   - `/src/app/(auth)/login/page.tsx`: Login page with multi-provider options
   - `/src/app/(auth)/verify-request/page.tsx`: Email verification page

4. **Auth Provider**:
   - `/src/app/_components/providers/auth-provider.tsx`: SessionProvider component

5. **Types**:
   - `/src/types/auth.ts`: TypeScript type definitions for authentication

6. **Middleware**:
   - `/src/middleware.ts`: Route protection for authenticated routes

## Complete Setup Guide

### 1. Environment Configuration (CRITICAL STEP)

1. Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

2. Generate a secure NEXTAUTH_SECRET (this is required for authentication to work):

```bash
openssl rand -base64 32
```

3. Add the generated secret to `.env.local`:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret  # REQUIRED - Authentication will fail without this
```

> **IMPORTANT**: The `NEXTAUTH_SECRET` is required. If not set, NextAuth will throw a 500 error on all authentication endpoints.

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Choose "Web application" as the application type
6. Add "http://localhost:3000" to "Authorized JavaScript origins"
7. Add "http://localhost:3000/api/auth/callback/google" to "Authorized redirect URIs"
8. Create the client ID and client secret
9. Update `.env.local` with the credentials:

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: "NEAR API Marketplace Local"
   - Homepage URL: "http://localhost:3000"
   - Authorization callback URL: "http://localhost:3000/api/auth/callback/github"
4. Register the application
5. Generate a new client secret
6. Update `.env.local` with the credentials:

```
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

### 4. Email Magic Link Setup

For development, you can use a service like [Mailtrap](https://mailtrap.io/) or [Ethereal](https://ethereal.email/) to test email sending without delivering to real addresses.

Using Ethereal (temporary test account):

1. Visit [Ethereal Email](https://ethereal.email/) and click "Create Ethereal Account"
2. Copy the SMTP configuration details
3. Update `.env.local` with the credentials:

```
EMAIL_SERVER=smtp://username:password@smtp.ethereal.email:587
EMAIL_FROM=noreply@fastnear.com
```

For production, use a real email service like SendGrid, Amazon SES, or a custom SMTP server.

### 5. Database Setup

#### PostgreSQL (Default)

The authentication system currently uses PostgreSQL for persistent user data storage. You need to set up a PostgreSQL database:

1. Install PostgreSQL on your local machine or use a PostgreSQL Docker container:
   ```bash
   docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
   ```

2. Create a database for the application:
   ```bash
   docker exec -it postgres psql -U postgres -c "CREATE DATABASE fastnear_api_marketplace;"
   ```

3. Update `.env.local` with the database connection string:
   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/fastnear_api_marketplace
   ```

The application will automatically create the necessary tables for NextAuth when it starts. Additionally, custom tables for user credits and API usage tracking are defined in the `schema.sql` file and are created by the database initialization code.

#### ClickHouse (Alternative)

The system also supports ClickHouse for data storage, which can be used for higher performance with large datasets. This support is currently disabled by default but can be enabled:

1. Set up a ClickHouse server:
   ```bash
   docker run -d --name clickhouse-server -p 8123:8123 -p 9000:9000 \
     -e CLICKHOUSE_USER=default -e CLICKHOUSE_PASSWORD=password \
     clickhouse/clickhouse-server
   ```

2. Update `.env.local` with ClickHouse configuration:
   ```
   USE_CLICKHOUSE=true
   CLICKHOUSE_HOST=http://localhost:8123
   CLICKHOUSE_USERNAME=default
   CLICKHOUSE_PASSWORD=password
   CLICKHOUSE_DATABASE=fastnear_api_marketplace
   ```

When `USE_CLICKHOUSE` is set to `true`, the application will automatically use ClickHouse instead of PostgreSQL. The necessary tables will be created on application startup.

### 6. Testing the Authentication Flow

1. Start the development server:

```bash
yarn dev
```

2. Access the login page at http://localhost:3000/login
3. Test each authentication method:
   - Click "Continue with Google" to test Google OAuth
   - Click "Continue with GitHub" to test GitHub OAuth
   - Enter an email address and click "Sign in with Email" to test the magic link

4. For email magic links:
   - Check the Ethereal Email inbox (if using Ethereal)
   - Click the link in the email to complete sign-in

### 7. Verifying Protected Routes

1. Try accessing http://localhost:3000/dashboard without being logged in
2. You should be redirected to the login page
3. After successful authentication, you should be redirected back to the dashboard

### 8. Customizing the Authentication System

- Modify `/src/lib/auth.ts` to adjust authentication settings
- Update `/src/app/(auth)/login/page.tsx` to change the login UI
- Edit `/src/middleware.ts` to adjust route protection rules

## Troubleshooting

### Common Errors

1. **500 Internal Server Error in auth endpoints**:
   - Most likely cause: Missing `NEXTAUTH_SECRET` in your environment
   - Solution: Set `NEXTAUTH_SECRET` in your `.env.local` file
   - Check debug information at: http://localhost:3000/api/debug

2. **OAuth Errors**:
   - Ensure redirect URIs match exactly in both the OAuth provider settings and your Next.js configuration
   - Redirect URIs should be: `http://localhost:3000/api/auth/callback/google` or `http://localhost:3000/api/auth/callback/github`

3. **Email Send Failures**:
   - Check SMTP settings and credentials
   - Verify proper formatting of the EMAIL_SERVER variable
   - For quick testing, use [Ethereal Email](https://ethereal.email/) which provides test SMTP credentials

4. **Session Issues**:
   - Ensure NEXTAUTH_SECRET is set and doesn't change between server restarts
   - Make sure cookies are being accepted by your browser
   - Check for cross-domain issues if your frontend and API are on different domains

5. **Database Errors**:
   - If using PostgreSQL, verify DATABASE_URL is correctly formatted
   - Ensure the database exists and is accessible
   - The system will fall back to JWT sessions if no database is available

6. **Next.js API Route Errors**:
   - Check the server console for detailed error messages
   - Use the debug endpoint at `/api/debug` to see configuration status

7. **Cross-Origin Problems**:
   - Make sure the NEXTAUTH_URL in `.env.local` matches the actual URL you're using to access the app
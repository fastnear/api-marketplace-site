# NEAR API Marketplace

A modern NextJS 15.2.4 application providing a unified marketplace for NEAR Protocol AI and blockchain APIs. This platform allows developers to purchase credits that can be used across multiple API services through a single dashboard.

## Features

- **Unified Credit System**: Purchase once, use across all available APIs
- **NEAR AI Endpoints**: Access AI-powered text generation and vision analysis
- **Blockchain Data Access**: Query NEAR Protocol blockchain data
- **Responsive Design**: Modern UI that works across all devices

## Technology Stack

- **Framework**: Next.js 15.2.4 with App Router
- **Styling**: Tailwind CSS 3.4.1
- **Theme Management**: next-themes 0.4.6 with system detection
- **React**: 19.1.0
- **TypeScript**: 5.6.2
- **Database**: PostgreSQL (Neon compatible)
- **Authentication**: NextAuth.js with PostgreSQL adapter

## Getting Started

### Prerequisites

- Node.js 20 or later
- Yarn 4.9.1 or later
- PostgreSQL 14+ or Neon account

### Installation

```bash
# Clone the repository
git clone https://github.com/fastnear/api-marketplace.git
cd api-marketplace

# Install dependencies
yarn

# Copy environment file and configure
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Start development server
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── _components/         # Shared components
│   │   ├── fastnear-logo.tsx
│   │   ├── theme-config.ts
│   │   ├── theme-toggle.tsx
│   │   └── providers/       # Context providers
│   ├── (logged-in)/         # Protected routes
│   │   └── dashboard/       # User dashboard
│   ├── pricing/             # Pricing page
│   │   ├── [plan]/          # Plan-specific pages
│   │   └── _logic/          # Business logic
│   │       └── plan-types.ts
│   ├── welcome/             # Welcome page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── middleware.ts            # Next.js middleware
└── types/                   # TypeScript declarations
```

## Theme System

The application uses [next-themes](https://github.com/pacocoursey/next-themes) with a centralized theme configuration in `src/app/_components/theme-config.ts`. See the STYLE_GUIDE.md for detailed theming guidelines.

### Core Theme Classes

- `section-themed`: Container-level styling with theme-aware backgrounds
- `card-themed`: Component containers with elevated styling
- `heading-themed`: Typography for headings with proper contrast
- `text-themed-secondary`: Secondary text with appropriate opacity
- `button-themed-primary`: Primary action buttons with hover states

## External Libraries

The project includes support for loading external JavaScript libraries via the `LibraryLoader` component in `src/app/_components/providers/library-loader.tsx`.

## API Specs

API documentation is available in the `/public/api-specs` directory, with YAML specification files that define the API interfaces.

## Pricing Structure

The pricing structure for the API marketplace is defined in `src/app/pricing/_logic/plan-types.ts`.

## Development Workflow

```bash
# Start development server
yarn dev

# Run linting
yarn lint

# Build for production
yarn build

# Start production server
NODE_ENV=production yarn start
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [next-themes Documentation](https://github.com/pacocoursey/next-themes)

## Database Schema

The application uses a PostgreSQL database for storing user data, API keys, organizations, and usage metrics. Our schema is optimized for Neon PostgreSQL but works with any PostgreSQL 14+ installation.

### Key Features

- **Team Management**: Organizations and member management
- **API Key Generation**: Secure API key creation and validation
- **Usage Tracking**: Partitioned tables for high-volume data
- **Credit System**: Transaction-based credit management

### Documentation

All database schema documentation is now consolidated in a single file:

- [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) - Complete schema documentation
- [api-keys-teams-schema.sql](api-keys-teams-schema.sql) - SQL schema definition

### Schema Validation

We provide a validation script that checks if your schema is compatible with Neon:

```bash
# Set your Neon API key
export NEON_API_KEY=your_api_key_here

# Run validation
./validate-schema.js
```

### Database Connection

The application connects to the database using the `NEXT_DATABASE_URL` environment variable:

```
# For Neon
NEXT_DATABASE_URL=postgresql://user:password@[project-id].endpoint.neon.tech/dbname?sslmode=require

# For self-hosted PostgreSQL
NEXT_DATABASE_URL=postgresql://username:password@hostname:port/database
```

## Authentication

The application uses NextAuth.js for authentication with a custom PostgreSQL adapter to support standard snake_case column naming in the database.

### Authentication Features

- **Google OAuth Integration**: Primary authentication method
- **Custom PostgreSQL Adapter**: Supports snake_case database columns
- **Database Sessions**: Secure HTTP-only cookie-based sessions
- **Client-Side Protection**: Protected routes using the useSession() hook
- **Automatic Credit Initialization**: New users receive 1000 credits automatically

### Session Management

Sessions are stored in the database and referenced by HTTP-only cookies. This provides:

1. Better security against XSS attacks (vs. localStorage)
2. Server-side session verification and revocation
3. Persistent sessions across browser restarts
4. User credit information embedded in session data

### Protected Routes

Routes requiring authentication are:

1. Protected client-side via the `useSession()` hook
2. Redirected to login if the user is not authenticated
3. Located in the `(logged-in)/` directory for organizational clarity

### Authentication Setup

To configure authentication:

1. Set the required environment variables:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_GOOGLE_CLIENT_ID=your-google-client-id
NEXTAUTH_GOOGLE_CLIENT_SECRET=your-google-client-secret
```

2. Configure Google OAuth:
   - Create a project in Google Cloud Console
   - Set up OAuth 2.0 credentials
   - Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

### Custom PostgreSQL Adapter

The application uses a custom adapter (`src/lib/custom-pg-adapter.ts`) that maps between:
- NextAuth's camelCase fields (userId, sessionToken, etc.)
- PostgreSQL's snake_case columns (user_id, session_token, etc.)

This provides better compatibility with PostgreSQL conventions while maintaining NextAuth compatibility.


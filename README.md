# NEAR API Marketplace

A modern NextJS application providing a unified marketplace for NEAR Protocol AI and blockchain APIs. This platform allows developers to purchase credits that can be used across multiple API services through a single dashboard.

## Features

- **Unified Credit System**: Purchase once, use across all available APIs
- **NEAR AI Endpoints**: Access AI-powered text generation and vision analysis
- **Blockchain Data Access**: Query NEAR Protocol blockchain data
- **Responsive Design**: Modern UI that works across all devices

## Technology Stack

- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS
- **Theme Management**: next-themes with system detection
- **React**: React 19
- **TypeScript**: TypeScript
- **Database**: PostgreSQL (Neon compatible)
- **Authentication**: NextAuth.js with PostgreSQL adapter

## Getting Started

### Prerequisites

- Node.js 20 or later
- Yarn
- PostgreSQL or Neon account

### Installation

```bash
# Clone the repository
git clone https://github.com/near/api-marketplace-site.git
cd api-marketplace-site

# Install dependencies
yarn

# Create a .env.local file with the following variables:
# NEXT_DATABASE_URL=postgresql://username:password@hostname:port/database
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_GOOGLE_CLIENT_ID=your-google-client-id
# NEXTAUTH_GOOGLE_CLIENT_SECRET=your-google-client-secret
# (See src/lib/auth.ts and src/lib/db.ts for other required environment variables)

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
│   ├── (auth)/              # Auth routes
│   ├── (logged-in)/         # Protected routes
│   │   └── dashboard/       # User dashboard
│   ├── pricing/             # Pricing page
│   ├── welcome/             # Welcome page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # Global components
├── lib/                     # Utility functions and libraries
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

The application uses a PostgreSQL database for storing user data, API keys, and usage metrics. The schema is defined in `schema.sql` and includes:

### Key Tables

- **users**: Core user information
- **accounts**: OAuth account connections
- **sessions**: Active user sessions
- **verification_tokens**: Email verification
- **user_credits**: Credit balance for API usage
- **api_usage**: Tracks API consumption

### Automatic Credit Initialization

New users automatically receive 1000 credits through a database trigger:

```sql
CREATE OR REPLACE FUNCTION initialize_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_credits (user_id, credits)
  VALUES (NEW.id, 1000);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_created_trigger
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION initialize_user_credits();
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

- **OAuth Integration**: Support for Google authentication
- **Database Sessions**: Secure HTTP-only cookie-based sessions stored in PostgreSQL
- **Email Verification**: Support for email-based verification tokens
- **Automatic Credit Initialization**: New users receive 1000 credits automatically via database trigger

### Email Authentication

The application implements secure email-based authentication using NextAuth's EmailProvider with nodemailer:

```typescript
EmailProvider({
  server: {
    host: process.env.NEXTAUTH_SMTP_SERVER,
    port: parseInt(process.env.NEXTAUTH_SMTP_PORT || '465'),
    auth: {
      user: process.env.NEXTAUTH_SMTP_USER,
      pass: process.env.NEXTAUTH_SMTP_PASSWORD
    },
    secure: true  // Uses TLS for connection security
  },
  from: process.env.NEXTAUTH_EMAIL_FROM,
  // Custom email sending logic with enhanced templates
  async sendVerificationRequest(params) {
    // Create transport using nodemailer
    const transport = createTransport(provider.server);
    // Send email with customized HTML template
    // ...
  }
})
```

This implementation:
1. Uses TLS-secured SMTP connections (port 465 with `secure: true`)
2. Employs the nodemailer `createTransport` method as recommended in NextAuth documentation
3. Provides custom HTML email templates for a branded experience
4. Logs detailed transmission results for debugging

To configure email authentication, add these environment variables:
```
NEXTAUTH_SMTP_SERVER=smtp.example.com
NEXTAUTH_SMTP_PORT=465
NEXTAUTH_SMTP_USER=your-smtp-username
NEXTAUTH_SMTP_PASSWORD=your-smtp-password
NEXTAUTH_EMAIL_FROM=noreply@example.com
```

### Session Management

Sessions are stored in the database and referenced by HTTP-only cookies. This provides:

1. Better security against XSS attacks (vs. localStorage)
2. Server-side session verification and revocation
3. Persistent sessions across browser restarts

### Protected Routes

Routes requiring authentication are:

1. Protected client-side via the `useSession()` hook
2. Located in the `(logged-in)/` directory for organizational clarity

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

The application uses a custom adapter (`src/lib/pg-adapter-server-session.ts`) that bridges the gap between NextAuth.js's camelCase fields and PostgreSQL's snake_case columns:

```
NextAuth (camelCase)      PostgreSQL (snake_case)
-------------------      ----------------------
userId                   user_id
sessionToken             session_token
emailVerified            email_verified
providerAccountId        provider_account_id
refreshToken             refresh_token
accessToken              access_token
```

This approach follows the [NextAuth.js adapter pattern](https://next-auth.js.org/tutorials/creating-a-database-adapter) but modifies it to use PostgreSQL conventions. The adapter:

1. **Translates Field Names**: Maps between NextAuth's JavaScript conventions and SQL conventions
2. **Handles Data Type Conversion**: Ensures proper serialization/deserialization between systems
3. **Provides Fallbacks**: Handles both naming conventions for maximum compatibility

For example, when linking an account:

```typescript
// The adapter handles both naming conventions to ensure compatibility
const refreshToken = account.refresh_token || account.refreshToken;
const accessToken = account.access_token || account.accessToken;
```

This dual-support approach enables easier database maintenance while preserving compatibility with NextAuth's expected interfaces.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.


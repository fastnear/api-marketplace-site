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

## Getting Started

### Prerequisites

- Node.js 20 or later
- Yarn 4.9.1 or later

### Installation

```bash
# Clone the repository
git clone https://github.com/fastnear/api-marketplace.git
cd api-marketplace

# Install dependencies
yarn

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


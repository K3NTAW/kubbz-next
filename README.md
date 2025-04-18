# KubbZ - Next.js Tournament Management System

A modern, full-featured tournament management platform built with Next.js for organizing and participating in Kubb tournaments.

## Features

- **Tournament Management**: Create, view, and register for tournaments
- **User Authentication**: Secure login and registration system
- **Team Management**: Create and manage teams
- **Rankings System**: Track player and team rankings
- **Photo Gallery**: Share memories from tournaments
- **Payment Integration**: Process registration fees with Stripe
- **Responsive Design**: Works seamlessly on all devices
- **Dark Mode Support**: Choose your preferred theme
- **Internationalization**: Multilingual support

## Tech Stack

- **Frontend**:
  - Next.js 14 with App Router
  - TypeScript
  - Tailwind CSS
  - Radix UI Components
  - Zustand for state management
  - React Query for data fetching
  - React Hook Form for form handling

- **Backend**:
  - Next.js API Routes
  - Prisma ORM
  - MySQL/PostgreSQL database
  - NextAuth.js for authentication
  - Stripe for payments
  - UploadThing for image uploads

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Database (MySQL or PostgreSQL)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/kubbz-next.git
   cd kubbz-next
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   ```
   cp .env.example .env.local
   ```
   Then fill in your environment variables in `.env.local`

4. Set up the database
   ```
   npx prisma migrate dev
   ```

5. Start the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser

## Project Structure

- `/src/app` - Next.js application routes
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions and configurations
- `/src/services` - Data services and API clients
- `/src/hooks` - Custom React hooks
- `/src/store` - State management with Zustand
- `/src/types` - TypeScript type definitions
- `/prisma` - Database schema and migrations

## Deployment

### Database Setup

Before deploying, you need to set up your database:

1. Configure your production database URL in your environment variables:
   ```
   DATABASE_URL=postgresql://username:password@host:port/database?schema=public
   ```

2. For a production deployment, you have two options:

   **Option 1: Using Prisma Migrate (Recommended for structured deployments)**
   ```
   # Generate a migration
   npx prisma migrate deploy
   ```

   **Option 2: Using Prisma Push (Quicker for development or simple deployments)**
   ```
   npx prisma db push
   ```

### Deploying to Vercel

This application can be easily deployed on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure your environment variables in the Vercel dashboard:
   - `DATABASE_URL`: Your database connection string
   - `NEXTAUTH_URL`: Your production URL (e.g., https://your-app.vercel.app)
   - `NEXTAUTH_SECRET`: A secure random string for session encryption
   - Any OAuth provider credentials (GitHub, Google, etc.)

3. Deploy the application:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fkubbz-next)

### Deploying to Other Platforms

For other platforms like Railway, Render, or a custom server:

1. Build the application:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm run start
   ```

3. Make sure to set all required environment variables before starting the server.

### Database Migrations in Production

Use the included database deployment script:

```
npm run db:deploy
```

This script will:
1. Apply any pending migrations
2. Generate the Prisma client

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Vercel](https://vercel.com/)
# kubbz-next

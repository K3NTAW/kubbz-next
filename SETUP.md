# Setup Instructions

## Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- PostgreSQL database (local or hosted)
- (Future) Stripe account

## Installation Steps

1. **Install dependencies:**
```bash
npm install
# or
pnpm install
# or
yarn install
```

2. **Set up environment variables:**
Create a `.env.local` file in the root directory with:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/kubbz?schema=public"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# (Future) Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

3. **Set up the database:**
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

4. **Run the development server:**
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Creating the First Admin User

After setting up the database, you'll need to create an admin user. You can do this by:

1. Registering a new user through the `/register` page
2. Then manually updating the user's role in the database:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

Or use Prisma Studio:
```bash
npm run db:studio
```

## Project Structure

- `src/app/` - Next.js App Router pages and routes
- `src/components/` - React components
- `src/lib/` - Utility functions and configurations
- `prisma/` - Prisma schema and migrations
- `public/` - Static assets

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio


# Kubbz Next - Kubb Tournament Management Platform

A modern Next.js web application for managing Kubb tournaments in Zurich, Switzerland. This platform enables a local Kubb community to organize tournaments, manage registrations, and facilitate payments for tournament participation.

## 🎯 What is Kubb?

**Kubb** (also known as **Viking Chess**) is a fascinating outdoor game often played in gardens or parks. Two teams compete against each other by throwing wooden batons to knock down the opponent's kubbs.

### Game Rules & Features:
- **Playing Field**: 5x8 meters
- **The King**: Stands in the middle of the field – the ultimate target at the end of the game
- **Throwing Rules**: Wooden batons must be thrown from bottom to front
- **Objective**: The first team to knock down all kubbs and then hit the king wins

## 📖 Our History

Since 2013, our community has been meeting irregularly to play KUBB and maintain friendships. In 2017, we organized our first tournament, which has since become an annual event held at the end of June.

## ✨ Current Features

### Public Features
- **Homepage** with three main sections:
  - **About Kubb Section**: Explains the game, rules, and features
  - **History Section**: Community history and tournament timeline
  - **Tournaments Section**: Overview of upcoming tournaments
- **Tournament Listings**: View all tournaments with details (date, price, location, max participants)
- **Tournament Details**: Individual tournament pages with full information
- **User Authentication**: 
  - Login/Register functionality
  - User profiles
  - Session management with NextAuth
- **Gallery**: Photo gallery of past tournaments and events
- **Responsive Design**: Mobile-first design with dark mode support

### Admin Features (Current)
- **Admin Dashboard**: Basic tournament and user management
- **Tournament Management**: 
  - Create, edit, and delete tournaments
  - View tournament registrations
  - Manage tournament details (name, date, description, location, price, max participants)
- **User Management**: 
  - View all users
  - Edit user details (name, email, role)
  - Delete users
  - Role-based access control (admin/user)

## 🚀 Planned Features

### 1. Full Admin Interface
We want to build a comprehensive admin interface with enhanced capabilities:

- **Enhanced Dashboard**:
  - Analytics and statistics (tournament participation, revenue, user growth)
  - Quick actions and shortcuts
  - Recent activity feed
  - Tournament status overview

- **Advanced Tournament Management**:
  - Tournament scheduling and calendar view
  - Automated email notifications for tournament updates
  - Tournament templates for recurring events
  - Bulk operations (bulk email, bulk status updates)
  - Tournament brackets and match management
  - Real-time registration tracking

- **Enhanced User Management**:
  - User search and filtering
  - User activity logs
  - User roles and permissions (admin, moderator, user)
  - User communication tools
  - Export user data (CSV, PDF)

- **Content Management**:
  - Gallery management (upload, organize, delete photos)
  - News/blog posts for tournament announcements
  - Email templates management
  - Site settings and configuration

- **Reporting & Analytics**:
  - Financial reports (revenue, refunds, pending payments)
  - Tournament participation reports
  - User engagement metrics
  - Export capabilities for all reports

### 2. Enhanced User Management
- **User Profiles**:
  - Tournament history and participation records
  - Payment history
  - Profile customization
  - Notification preferences

- **User Features**:
  - Tournament registration history
  - Waitlist management
  - Team formation tools
  - Social features (connect with other players)

### 3. Stripe Payment Integration
We want to add Stripe payment processing for tournament registration:

- **Payment Features**:
  - Secure payment processing via Stripe
  - Tournament registration fees
  - Payment confirmation emails
  - Receipt generation

- **Payment Management**:
  - Payment status tracking (pending, completed, refunded)
  - Refund processing
  - Payment history per user
  - Payment analytics in admin dashboard

- **Integration Points**:
  - Checkout flow during tournament registration
  - Webhook handling for payment events
  - Payment status updates in real-time
  - Failed payment handling and retry mechanisms

- **Admin Payment Tools**:
  - View all payments and transactions
  - Process refunds
  - Payment reports and exports
  - Revenue tracking and analytics

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.3.1** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI component library
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **NextAuth.js 4.24.11** - Authentication
- **Xata** - Database (serverless PostgreSQL)
- **bcryptjs** - Password hashing

### Forms & Validation
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **@hookform/resolvers** - Form validation integration

### State Management
- **SWR** - Data fetching and caching
- **TanStack Table** - Table component for admin dashboard

### Future Integrations
- **Stripe** - Payment processing
- **Email Service** (SendGrid/Resend) - Transactional emails

## 📁 Project Structure

```
kubbz-next/
├── src/
│   ├── app/
│   │   ├── AboutKubbSection.tsx      # About Kubb game section
│   │   ├── HistorySection.tsx         # Community history
│   │   ├── TournamentsSection.tsx     # Tournaments overview
│   │   ├── admin/                     # Admin dashboard
│   │   │   ├── AdminDashboard.tsx
│   │   │   └── page.tsx
│   │   ├── api/                       # API routes
│   │   │   ├── auth/                  # Authentication endpoints
│   │   │   ├── tournaments/          # Tournament CRUD operations
│   │   │   ├── users/                 # User management
│   │   │   └── gallery/               # Gallery endpoints
│   │   ├── tournament/                # Tournament pages
│   │   │   ├── [id]/                  # Individual tournament
│   │   │   ├── register/              # Registration flow
│   │   │   └── TournamentsListSection.tsx
│   │   ├── login/                     # Login page
│   │   ├── register/                  # Registration page
│   │   ├── profile/                   # User profile
│   │   ├── gallery/                   # Gallery page
│   │   └── page.tsx                   # Homepage
│   ├── components/
│   │   ├── ui/                        # shadcn/ui components
│   │   ├── Navbar.tsx
│   │   ├── ClientNavbarWrapper.tsx
│   │   └── SessionProviderWrapper.tsx
│   ├── lib/
│   │   └── utils.ts                   # Utility functions
│   └── xata.ts                        # Xata client configuration
├── types/
│   ├── index.d.ts                     # Type definitions
│   └── next-auth.d.ts                 # NextAuth type extensions
└── public/                            # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Xata account and database setup
- (Future) Stripe account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kubbz-next
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
# Database
XATA_API_KEY=your_xata_api_key
XATA_BRANCH=your_branch_name

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# (Future) Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

4. Run the development server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Development Roadmap

### Phase 1: Enhanced Admin Interface
- [ ] Build comprehensive admin dashboard with analytics
- [ ] Implement advanced tournament management features
- [ ] Add content management system (gallery, news)
- [ ] Create reporting and analytics tools
- [ ] Enhance user management capabilities

### Phase 2: Stripe Integration
- [ ] Set up Stripe account and configuration
- [ ] Implement payment checkout flow
- [ ] Create payment confirmation system
- [ ] Build admin payment management interface
- [ ] Add webhook handling for payment events
- [ ] Implement refund processing
- [ ] Add payment analytics and reporting

### Phase 3: Enhanced User Experience
- [ ] Improve user profiles with tournament history
- [ ] Add team formation tools
- [ ] Implement notification system
- [ ] Create user dashboard
- [ ] Add social features

### Phase 4: Polish & Optimization
- [ ] Performance optimization
- [ ] SEO improvements
- [ ] Accessibility enhancements
- [ ] Mobile app considerations
- [ ] Internationalization (i18n) support

## 🔒 Security Considerations

- All user input is validated using Zod schemas
- Passwords are hashed using bcryptjs
- Authentication handled securely via NextAuth.js
- API routes protected with authentication middleware
- Payment data handled securely through Stripe (PCI compliant)
- Environment variables for sensitive data

## 🤝 Contributing

This is a private project for the Zurich Kubb community. For questions or suggestions, please contact the project maintainers.

## 📄 License

Private project - All rights reserved

## 🌐 Language

The website is primarily in German (Deutsch) as it serves the local Zurich community.

---

**Built with ❤️ for the Zurich Kubb Community**

# PCPrime E-Commerce Platform

A modern e-commerce platform built for computer hardware retail, featuring real-time product browsing, AI-powered chat assistance, and B2B company management.

## Overview

This is a full-featured e-commerce application designed for PCPrimeDZ, an Algerian computer hardware retailer. The platform handles both B2C and B2B sales channels with integrated inventory management, order processing, and customer support.

## Features

### Customer Features
- **Product Catalog** - Browse PC components, peripherals, and pre-built systems
- **Advanced Search** - Filter by category, price range, and specifications
- **Shopping Cart** - Persistent cart with real-time price updates
- **Wishlist** - Save items for later purchase
- **Order Tracking** - Real-time order status and history
- **User Profiles** - Manage personal information and addresses
- **AI Chatbot** - Get product recommendations and support (powered by Ollama)

### B2B Portal (Espace Société)
- **Company Registration** - Streamlined onboarding for business customers
- **Bulk Ordering** - Purchase multiple items with volume discounts
- **Invoice Management** - Download and track invoices
- **Custom Pricing** - Negotiated rates for corporate accounts
- **Team Management** - Multi-user access with role permissions

### Additional Features
- **PC Builder** - Custom PC configuration tool with compatibility checking
- **Deals Section** - Special offers and promotions
- **OTP Authentication** - Secure login with email verification
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Dark Mode** - Toggle between light and dark themes

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Query** - Data fetching and caching
- **Embla Carousel** - Touch-enabled product carousels

### UI Components
- **Radix UI** - Accessible component primitives
- **React Icons** - Icon library
- **Lucide React** - Additional icons
- **shadcn/ui** - Pre-built components

### State Management
- **React Context** - Global state (Cart, Wishlist, Theme)
- **Local Storage** - Persistent client-side data

### Development Tools
- **Turbopack** - Fast build system
- **PostCSS** - CSS processing
- **Autoprefixer** - Browser compatibility

## Project Structure

```
next-app/
├── src/
│   └── app/
│       ├── components/       # Reusable UI components
│       ├── context/          # Global state providers
│       ├── hooks/            # Custom React hooks
│       ├── services/         # API integration layer
│       ├── types/            # TypeScript definitions
│       ├── checkout/         # Checkout flow pages
│       ├── contact/          # Contact form
│       ├── espace-society/   # B2B portal
│       ├── pc-builder/       # PC configuration tool
│       ├── product/          # Product detail pages
│       ├── profile/          # User dashboard
│       └── wishlist/         # Saved items
├── public/               # Static assets
└── components.json       # shadcn/ui configuration
```

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd next-app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=https://pcprimedz.onrender.com
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## API Integration

The application connects to a backend REST API with the following endpoints:

- `/products` - Product catalog
- `/categories` - Product categories
- `/orders` - Order management
- `/users` - User authentication and profiles
- `/otp` - Email verification
- `/chat` - AI chatbot (Ollama integration)
- `/companies` - B2B company management

## Key Components

### Shopping Experience
- `Products` - Grid view with filters and pagination
- `ProductDetail` - Full product specifications and reviews
- `Cart` - Dynamic cart with quantity adjustments
- `Checkout` - Multi-step order completion

### User Features
- `LoginModal` - Authentication with OTP support
- `Profile` - Account management dashboard
- `OrderHistory` - Past orders and tracking

### B2B Features
- `CompanyDashboard` - Business account overview
- `BulkOrderForm` - Multi-item order entry
- `CompanyRegistration` - New business onboarding

### Utilities
- `Navbar` - Main navigation with category dropdown
- `Footer` - Links and information
- `Chatbot` - AI-powered customer support
- `ThemeWrapper` - Dark/light mode toggle

## Development Notes

- Uses Turbopack for faster development builds
- Implements progressive enhancement for better SEO
- Follows React Server Components best practices
- Optimized images with Next.js Image component
- Type-safe API calls with TypeScript
- Responsive design with mobile-first approach

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

This is a private commercial project. For bug reports or feature requests, contact the development team.

## Support

For technical support or questions:
- Email: contact@pcprimedz.dz
- Website: https://pcprimedz.onrender.com

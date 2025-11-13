# Stefadash Admin Panel

A modern, bright-colored admin panel built with Next.js 16 for managing Stefanos Spyros Real Estate platform.

## Features

- 🎨 **Bright Color Scheme** - Modern, vibrant UI with bright colors
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🚀 **Next.js 16** - Built with the latest Next.js features
- 🎯 **Multiple Pages** - Comprehensive admin functionality
- 🧩 **Modular Components** - Well-organized, spread across smaller files

## Pages

- **Dashboard** - Overview with stats, charts, and quick actions
- **Users** - User management with filtering and search
- **Properties** - Property management with grid view
- **Bookings** - Booking and reservation management
- **Analytics** - Detailed analytics and insights
- **Reports** - Report generation and viewing
- **Notifications** - Notification center
- **Settings** - Account and system settings
- **Help** - Help and support documentation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the Stefadash directory:
```bash
cd Stefadash
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
Stefadash/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── dashboard/    # Dashboard page
│   │   ├── users/        # Users management
│   │   ├── properties/   # Properties management
│   │   ├── bookings/     # Bookings management
│   │   ├── analytics/    # Analytics page
│   │   ├── reports/      # Reports page
│   │   ├── notifications/# Notifications page
│   │   ├── settings/     # Settings page
│   │   └── help/         # Help page
│   └── components/       # React components
│       ├── layout/       # Layout components (sidebar, header)
│       ├── dashboard/    # Dashboard components
│       ├── users/        # User management components
│       ├── properties/   # Property management components
│       ├── bookings/     # Booking components
│       ├── analytics/    # Analytics components
│       ├── reports/      # Report components
│       ├── notifications/# Notification components
│       ├── settings/     # Settings components
│       └── help/         # Help components
├── public/               # Static assets (logos, images)
└── package.json          # Dependencies and scripts
```

## Technologies Used

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons
- **Space Grotesk** - Font family

## Color Scheme

The admin panel uses a bright color palette:
- **Blue** - Primary actions and accents
- **Green** - Success states
- **Purple** - Properties and special features
- **Orange** - Warnings and bookings
- **Red** - Errors and danger actions
- **Pink** - Analytics and highlights
- **Cyan** - Secondary accents

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Notes

- Logos are copied from Stefanos-frontend
- Styles are based on Stefanos-frontend but with bright colors
- Components are organized in smaller files for better maintainability
- All pages use the AdminLayout wrapper for consistent navigation


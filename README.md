<p align="center">
  <img src="https://smholdings.gr/logoetc.png" alt="SM Holdings" width="300" />
</p>

<h1 align="center">real-estate-admin</h1>

<p align="center">
  <strong>The admin panel that manages the chaos so you don't have to. You still will, though.</strong>
</p>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg" />
  <img alt="Node" src="https://img.shields.io/badge/node-18%2B-green.svg" />
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black.svg" />
  <img alt="React" src="https://img.shields.io/badge/React-19-blue.svg" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-blue.svg" />
  <img alt="TailwindCSS" src="https://img.shields.io/badge/TailwindCSS-4-cyan.svg" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-black.svg" />
</p>

---

## Overview

An admin dashboard for a real estate platform. It lets you manage properties, bookings, users, payments, reviews, maintenance, cleaning schedules, and twenty other things that could each be their own startup. All from one sidebar with twenty navigation items, because scrolling builds character.

Built with Next.js because we wanted a React framework that ships its own router, its own server, its own opinions, and its own existential crisis on every major version bump.

---

## Tech Stack

Because a table of dependencies is the closest thing a frontend project has to a résumé.

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Runtime** | Node.js | 18+ | Running JavaScript where it was never meant to run |
| **Framework** | Next.js | 16.1.6 | A React framework with more features than your app needs |
| **Language** | TypeScript | 5.9.3 | Adding types to a language that actively resists them |
| **UI Library** | React | 19.2.4 | Re-rendering the DOM so you don't have to |
| **Styling** | TailwindCSS | 4.1.18 | Inline styles with extra steps and a build step |
| **Icons** | Lucide React | 0.563.0 | 20 sidebar icons and counting |
| **Utilities** | clsx | 2.1.1 | Conditional classnames, because ternaries in JSX are a war crime |
| **Font** | Space Grotesk | via Google Fonts | Making the admin panel look like it has taste |
| **Linting** | ESLint | 10.0.0 | Telling you what you already know |
| **Formatting** | Prettier | 3.8.1 | Ending formatting debates by making everyone equally unhappy |

---

## Features

All 20 sections of the sidebar, each one a small universe of forms and tables.

- **Dashboard** -- Stats cards, charts, recent activity, top properties, payment status, maintenance alerts, and quick actions. A command center for people who like staring at numbers.
- **User Management** -- CRUD for users with roles: Admin, Property Owner, Manager, User. A hierarchy of access levels and a hierarchy of blame.
- **Property Management** -- Full property CRUD with multilingual titles (Greek/English), pricing, images, videos, geolocation, and eight property types. Because "apartment" was never enough.
- **Bookings** -- Track reservations from PENDING to COMPLETED, or more realistically, to CANCELLED. Includes guest details, pricing breakdowns, and special requests nobody reads.
- **Payments** -- Revenue tracking, platform fees, owner payouts. The numbers that actually matter.
- **Reviews** -- Guest ratings and feedback. A window into the human condition, one star at a time.
- **Maintenance** -- Track what is broken across all properties. The list grows faster than it shrinks.
- **Rooms** -- Room-level management within properties. For when property-level granularity is not granular enough.
- **Property Groups** -- Group properties together. Organizational bliss for the control-obsessed.
- **Cleaning** -- Cleaning schedules and tracking. Someone has to manage the turnover chaos.
- **Messages** -- Communication hub between guests and hosts. Therapy still not included.
- **Content Management** -- Dynamic content and editions. Multilingual, because the admin panel speaks Greek and English.
- **Services** -- Manage additional services offered to guests. Upselling, formalized.
- **Knowledge Base** -- Articles and documentation. For when the help page is not enough and the developer is asleep.
- **Analytics** -- Charts and metrics. Whether they drive decisions or just decorate dashboards is between you and your stakeholders.
- **Reports** -- Generated reports. PDFs that justify your existence to management.
- **Audit Logs** -- Who did what and when. The admin panel's diary.
- **Notifications** -- Alerts and updates. So you know exactly when something needs your attention at 2 AM.
- **Settings** -- General, appearance, security, notifications, permissions, integrations, API keys, webhooks, email templates, billing, data management, and advanced settings. Fourteen tabs. We counted.
- **Help** -- Documentation and support. The last resort before opening a GitHub issue.

---

## Getting Started

### Prerequisites

- **Node.js 18+** -- If your Node version starts with a single digit, we cannot help you.
- **yarn** or **npm** -- Dealer's choice. Just be consistent about it.
- A running instance of the [backend API](../stefanos-backend) on port 3001, or a very vivid imagination.

### Installation

```bash
# Clone the repository. Standard procedure.
git clone <repository-url>
cd stefanos-admin

# Install dependencies. Time enough to make coffee.
yarn install
```

### Running the Dev Server

```bash
# Development (with hot reload, your constant companion)
yarn dev

# Production build (for the optimistic)
yarn build

# Start production server (for the truly optimistic)
yarn start
```

The panel will be available at `http://localhost:3000`. It expects the backend API at `http://localhost:3001/api`. If either is missing, you will be greeted by error messages instead of dashboards.

---

## Scripts

Commands you will use daily, and commands you will forget exist until you need them.

| Command | What It Does |
|---|---|
| `yarn dev` | Starts the Next.js dev server. Your daily driver. |
| `yarn build` | Builds for production. Compiles, optimizes, and hopes for the best. |
| `yarn start` | Runs the production build. Assumes you ran `build` first. |
| `yarn lint` | ESLint. It has opinions about your code and it is not afraid to share them. |
| `yarn type-check` | Runs `tsc --noEmit`. Finds type errors without producing output. All pain, no gain. |

---

## Project Structure

```
src/
  app/
    layout.tsx               # Root layout. Space Grotesk font. AuthProvider. The foundation.
    page.tsx                 # Landing page. Redirects you where you need to go.
    login/                   # Authentication gate. No token, no entry.
    dashboard/               # The command center
    users/                   # User management
    properties/              # Property CRUD
    bookings/                # Reservation tracking
    payments/                # Money in, money out
    reviews/                 # Star ratings and opinions
    maintenance/             # The ever-growing repair list
    rooms/                   # Room-level management
    property-groups/         # Grouping properties together
    cleaning/                # Turnover schedules
    messages/                # Guest-host communication
    content/                 # CMS pages
    services/                # Additional guest services
    knowledge/               # Knowledge base articles
    analytics/               # Charts and graphs
    reports/                 # Generated reports
    audit-logs/              # Activity tracking
    notifications/           # Alert management
    settings/                # Fourteen tabs of configuration
    help/                    # When all else fails

  components/
    layout/                  # AdminLayout, Sidebar, Header, NavigationItems, SidebarFooter
    dashboard/               # StatsCards, ChartsSection, RecentActivity, TopProperties, etc.
    auth/                    # Login form
    users/                   # User tables and forms
    properties/              # Property tables and forms
    bookings/                # Booking management components
    payments/                # Payment tracking components
    reviews/                 # Review display components
    rooms/                   # Room management components
    maintenance/             # Maintenance request components
    analytics/               # Analytics chart components
    reports/                 # Report generation components
    notifications/           # Notification components
    settings/                # 14 settings panels. One for every mood.
    help/                    # Help and documentation components

  lib/
    api/                     # API client layer (18 modules of fetch calls and hope)
      config.ts              # Base URL, headers, token management
      types.ts               # TypeScript interfaces. The contract between frontend and backend.
      stats.ts               # Dashboard statistics
      users.ts               # User API calls
      properties.ts          # Property API calls
      bookings.ts            # Booking API calls
      payments.ts            # Payment API calls
      reviews.ts             # Review API calls
      rooms.ts               # Room API calls
      maintenance.ts         # Maintenance API calls
      cleaning.ts            # Cleaning API calls
      messages.ts            # Message API calls
      content.ts             # Content API calls
      services.ts            # Services API calls
      knowledge.ts           # Knowledge base API calls
      audit-logs.ts          # Audit log API calls
      property-groups.ts     # Property group API calls
      upload.ts              # File upload handler
    auth/                    # Authentication context and API
      AuthContext.tsx         # React context. JWT in localStorage. The usual suspects.
      authApi.ts             # Login, logout, token management.
```

---

## Dependencies

### Production (13 packages, each one a load-bearing pillar)

- **next** `^16.1.6` -- The framework. Router, server, bundler, and life coach.
- **react** + **react-dom** `^19.2.4` -- The UI library. Version 19. Concurrent features nobody fully understands.
- **typescript** `^5.9.3` -- Types. Because `any` is not a personality.
- **tailwindcss** `^4.1.18` -- Utility-first CSS. Your HTML will look like alphabet soup and you will learn to love it.
- **lucide-react** `^0.563.0` -- Icons. Twenty in the sidebar alone.
- **clsx** `^2.1.1` -- Conditional classnames. Small package, big impact.
- **autoprefixer** `^10.4.24` -- CSS vendor prefixes. Because browser compatibility is still a thing in 2026.

### Development (3 packages that keep you honest)

- **eslint** `^10.0.0` -- Linter. Finds problems before your users do.
- **eslint-config-next** `^16.1.6` -- Next.js-specific linting rules. Opinionated by design.
- **prettier** `^3.8.1` -- Code formatter. Consistency enforced by machine.

---

## Environment Variables

The panel needs exactly one environment variable to function:

- `NEXT_PUBLIC_API_URL` -- The backend API URL. Defaults to `http://localhost:3001/api` if not set. If the backend is down, the admin panel becomes a very pretty collection of loading spinners.

---

## Authentication

JWT-based. Tokens are stored in `localStorage` because cookies were too mainstream. The `AuthContext` wraps the entire app, checks for stored tokens on mount, and redirects unauthenticated users to `/login`. Role-based access supports Admin, Property Owner, Manager, and User roles.

If the token expires, you get logged out. If the token leaks, you get a conversation with the security team.

---

## Deployment

Optimized for **Vercel**, because deploying a Next.js app anywhere else feels like swimming upstream.

1. Connect the repository to Vercel.
2. Set `NEXT_PUBLIC_API_URL` to your production backend URL.
3. Deploy.
4. Realize you forgot to set the environment variable.
5. Set it.
6. Redeploy.
7. It works.
8. Celebrate briefly before the next feature request arrives.

---

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Add another section to the sidebar.
4. Write components that actually work.
5. Open a Pull Request.
6. Wait for review.
7. Argue about Tailwind class ordering.
8. Merge.
9. Watch the sidebar grow longer.

---

## License

MIT. Use it, modify it, deploy it. If the sidebar gets too long, that is your problem now.

---

<p align="center"><sub>Built with mass amounts of mass-produced coffee and mass-produced existential dread by the SM Holdings engineering team.</sub></p>

---

<p align="center">
  Created by <a href="https://adinfinity.gr/">adinfinity</a>
</p>

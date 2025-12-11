# Family Home Hub

## Overview

A local-first web application designed for Raspberry Pi 5 with touch displays (800x480 to 1024x600). The app serves as a family dashboard with three main features:

1. **Sleep Ritual Interactive Checklist** - A child-friendly, playful checklist for bedtime routines (teeth brushing, toilet, pajamas)
2. **Monster Detector** - A fun feature to help children with bedtime anxiety by "scanning" for monsters
3. **Family Dashboard** - Displays Google Calendar events, weather information, and Home Assistant smart home status

The UI is optimized for touch interaction with large, finger-friendly controls in landscape orientation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with hot module replacement
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for smooth touch feedback and celebratory effects
- **UI Components**: Radix UI primitives wrapped with shadcn/ui styling

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Build**: ESBuild for production bundling
- **API Pattern**: RESTful endpoints under `/api/*` prefix

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Tables**:
  - `ritual_completions` - Tracks completed sleep ritual steps by date
  - `monster_scans` - Logs monster detector scan history
  - `settings` - Key-value store for app configuration

### Design Patterns
- **Shared Types**: Schema and types defined in `shared/` directory, imported by both client and server
- **Path Aliases**: `@/` for client source, `@shared/` for shared code
- **Touch-First UI**: Minimum 64px touch targets, large typography (18px+ base)
- **Child-Friendly Components**: Custom SVG icons with animations for playful interactions

## External Dependencies

### Google Calendar Integration
- Uses Replit Connectors for OAuth token management
- Fetches upcoming calendar events via Google Calendar API
- Located in `server/integrations/googleCalendar.ts`

### Weather Integration
- Uses Open-Meteo API (no API key required)
- Provides current conditions and 3-day forecast
- Located in `server/integrations/weather.ts`
- Configurable location via environment variables

### Home Assistant Integration
- REST API integration using long-lived access tokens
- Features:
  - Entity state monitoring (lights, sensors, temperatures)
  - Service calls for automation (sleep mode, monster scan effects)
- Environment variables required:
  - `HOME_ASSISTANT_URL` - Base URL of Home Assistant instance
  - `HOME_ASSISTANT_TOKEN` - Long-lived access token
- Located in `server/integrations/homeAssistant.ts`

### Database
- PostgreSQL connection via `DATABASE_URL` environment variable
- Drizzle Kit for schema migrations (`npm run db:push`)

### UI Dependencies
- shadcn/ui components (Radix UI based)
- Framer Motion for animations
- Lucide React for icons
- date-fns for date formatting
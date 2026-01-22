# AgentMapper

A comprehensive workshop application for designing and implementing AI pilots in organizations. Based on NOBL's AI Strategy Workshop framework, this tool guides teams through a structured 5-session process from strategy to execution.

## Project Status

**Current Phase:** Week 1 Complete - Critical Fixes Deployed ✅
**Last Updated:** 2026-01-22
**Version:** 0.2.0

### Recent Updates (Week 1 - Critical Fixes)

**✅ All Critical Issues Fixed:**

1. **Cloud Sync Data Loss Prevention** - Changed from destructive delete+insert to merge-based upsert strategy
2. **Vote Count Race Condition Fixed** - Added isVoting state lock with 300ms debounce
3. **Storage Key Migration** - Renamed from "forge-workshop-storage" to "agentmapper-workshop-storage" with automatic data migration
4. **Form Validation Pattern** - Implemented validation with error messages in Friction Map (pattern ready for rollout to 13 remaining forms)

See [issues.md](./issues.md) for comprehensive audit and fix tracking.

### Next Steps (Week 2 - User Journey Fixes)

- Fix Friction Map navigation bypass (Session 2 → Session 3 skip)
- Add data dependency validation
- Implement delete confirmations
- Complete progress tracking calculation
- Enforce session locking
- Prevent unsaved progress loss
- Add error boundaries

## Tech Stack

- **Framework:** Next.js 16.1.4 (App Router)
- **Language:** TypeScript (strict mode)
- **State:** Zustand 5.0.10 with localStorage persistence
- **Database:** Supabase (optional cloud sync)
- **Styling:** Custom CSS (DXN Swiss Grid Design System)
- **Animation:** Framer Motion 12.27.5
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Optional: Cloud Sync Setup

To enable cloud sync across devices:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the database schema (see `supabase/schema.sql` if available)
3. Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Restart dev server

## Workshop Structure

The application guides teams through 5 sessions:

1. **AI Strategy Foundation** - Icebreakers, working principles, tradeoff navigation
2. **Find the Friction** - Friction mapping, opportunity scoring, priority matrix, dot voting
3. **Organize the Work** - Pattern matching, workflow design, risk assessment, MVP charter
4. **Roadmap & Governance** - 90-day roadmap, RACI matrix, governance framework
5. **Empower Teams** - Scaling checklist, training plan, lessons learned, next opportunities

## Project Structure

```
/src
  /app                  # Next.js App Router pages
    /workshop           # Workshop session pages
      /session-1        # AI Strategy Foundation
      /session-2        # Find the Friction
      /session-3        # Organize the Work
      /session-4        # Roadmap & Governance
      /session-5        # Empower Teams
      layout.tsx        # Workshop navigation & progress
  /components           # Reusable UI components
    /ui                 # Base components (Button, Card, Input, etc.)
    /workshop           # Workshop-specific components
  /store                # Zustand state management
    workshop.ts         # Main workshop store
  /lib                  # Utilities and integrations
    supabase.ts         # Database operations
  /types                # TypeScript type definitions
```

## Development

### Testing Critical Fixes

1. **Cloud Sync Test:**
   ```bash
   # Create data in all sessions, sync to cloud, refresh browser
   # Verify no data loss
   ```

2. **Vote Race Condition Test:**
   ```bash
   # Go to Session 2 > Dot Voting
   # Rapidly click vote button 10+ times
   # Verify vote count is accurate
   ```

3. **Storage Migration Test:**
   ```bash
   # Check localStorage in DevTools
   # Should see "agentmapper-workshop-storage" key
   # Old "forge-workshop-storage" should be removed
   ```

4. **Form Validation Test:**
   ```bash
   # Go to Session 2 > Friction Map
   # Try submitting empty form
   # Verify error messages appear
   ```

### Build for Production

```bash
npm run build
npm start
```

### Linting & Type Checking

```bash
npm run lint
npm run type-check  # If available
```

## Documentation

- [issues.md](./issues.md) - Complete issue audit with 39 documented issues, fixes, and best practices
- [Comprehensive Plan](/.claude/plans/flickering-plotting-breeze.md) - 4-week implementation roadmap

## Contributing

This is a private project. For questions or issues, contact the project maintainer.

## License

Private/Proprietary

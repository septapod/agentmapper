# AgentMapper

A comprehensive workshop application for designing and implementing AI pilots in organizations. Based on NOBL's AI Strategy Workshop framework, this tool guides teams through a structured 5-session process from strategy to execution.

## Project Status

**Current Phase:** Week 2 Priority 2 - AI-Powered Summaries & Polish
**Last Updated:** 2026-01-22
**Version:** 0.3.0

### ✅ Production Readiness: BETA READY

**Progress Update (Jan 22, 2026):**

Major fixes have been implemented addressing the critical issues from QA testing. The application is now in beta-ready state with improved user experience and data visibility.

### ✅ Week 2 Priority 1 - Complete

**All Priority 1 Items Fixed:**

1. ✅ **Activity Dashboards** - Exercise cards now show actual user progress instead of static descriptions
2. ✅ **AI-Powered Summaries** - Claude Haiku integration for intelligent insights on workshop data
3. ✅ **Progress Bar Fixed** - Now calculates from actual exercise completion state
4. ✅ **Last Saved Timestamp** - Displays in sidebar to restore confidence in data persistence
5. ✅ **Cloud Sync Bug Fixed** - impactLevel/frequency defaults satisfy database constraints
6. ✅ Session Summaries - Roll-up summaries at top of each session page
7. ✅ Workshop Progress Summary - Key milestones on main workshop page

### Week 1 Complete - Data Integrity Fixed

1. ✅ **Cloud Sync Data Loss Prevention** - Changed from destructive delete+insert to merge-based upsert strategy
2. ✅ **Vote Count Race Condition Fixed** - Added isVoting state lock with 300ms debounce
3. ✅ **Storage Key Migration** - Renamed from "forge-workshop-storage" to "agentmapper-workshop-storage" with automatic data migration
4. ✅ **Form Validation Pattern** - Implemented validation with error messages in Friction Map (pattern ready for rollout)

### Remaining Items (Week 2 Priority 2)

- 🔄 Test and fix print report feature
- ⏳ Home page simplification (reduce cognitive load)
- ⏳ Onboarding flow improvements
- ⏳ Session context bridges

**QA-Validated Issues:** 53 total issues (39 original + 14 from real user testing)

See [issues.md](./issues.md) for complete audit including all QA findings.

### User Feedback Summary

**Most Valuable:**
- AI principles and governance discussions
- Human-in-the-loop design forcing accountability conversations
- Revealing how many manual processes still exist

**Least Valuable:**
- Lengthy exercises that didn't change outcome (dot voting, pattern matching)
- Many sections inaccessible due to bugs

**What Almost Caused Abandonment:**
- Blank pages during critical Session 3 exercises
- Progress not saving / progress bar stuck at 0%
- Repeatedly encountering disabled buttons

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

### Optional: AI-Powered Summaries

To enable AI-generated insights on workshop data:

1. Get an API key from [Anthropic Console](https://console.anthropic.com/)
2. Add to `.env.local`:

```bash
ANTHROPIC_API_KEY=your-api-key
```

3. Restart dev server

**Features:**
- Intelligent analysis of icebreaker responses, principles, tradeoffs
- Pattern recognition across friction points and opportunities
- Strategic recommendations based on voting and pilot selections
- Cached summaries with 24-hour TTL
- Graceful fallback if API key not configured

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

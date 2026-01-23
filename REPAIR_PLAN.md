# AgentMapper QA Repair Plan

**Created:** January 22, 2026
**Status:** In Progress
**Source:** Test 002 - Chartway QA Report + Code Audit

---

## Overview

This plan addresses all issues from the Chartway QA report plus additional issues discovered during code audit. The goal is to make the existing workshop functionality work perfectly before any restructuring.

---

## Critical Issues (Blocking)

### 1. Session 3 Stub Exercises - BUILD OUT (Evidence-Based Design)
**Status:** 🔴 Not Started
**Files:**
- `/src/app/workshop/session-3/pattern-matching/page.tsx`
- `/src/app/workshop/session-3/future-state-workflow/page.tsx`
- `/src/app/workshop/session-3/risk-governance/page.tsx`
- `/src/app/workshop/session-3/mvp-charter/page.tsx`

**Issue:** These exercises are placeholders showing "Under Development" message with skip links.

**Decision:** Build these exercises based on 2025-2026 best practices research (see below).

---

## Session 3 Exercise Design (Evidence-Based)

Based on research from McKinsey, BCG, Anthropic, NIST, ISO/IEC, and the FORGE methodology, Session 3 should bridge the gap between "identifying friction" and "building an MVP." The key insight: **process redesign must precede technology selection**.

### Exercise 3.1: Workflow Variance Assessment (Pattern Matching)
**Purpose:** Help executives understand which workflows are suitable for agentic AI.

**Research Basis:** McKinsey's 50+ agentic AI deployments show "the biggest insight is that process redesign and data cleanup are most important." Low-variance, high-standardization workflows may NOT benefit from agentic AI.

**Exercise Design:**
- Map selected friction points on a 2x2 matrix:
  - X-axis: Standardization level (low to high)
  - Y-axis: Variance tolerance (low to high)
- Quadrants:
  - **High variance, Low standardization** → Best fit for agentic AI
  - **Low variance, High standardization** → Better for traditional automation/RPA
  - **High variance, High standardization** → Needs hybrid approach
  - **Low variance, Low standardization** → Case-by-case evaluation
- For each friction point, identify:
  - Current decision points (human judgment required)
  - Handoffs between systems/people
  - Exception handling patterns

**Form Fields:**
- Select friction point (from Session 2)
- Standardization level (1-5 scale with descriptions)
- Variance tolerance (1-5 scale with descriptions)
- Key decision points (multi-line list)
- System handoffs (multi-line list)
- Exception types (multi-line list)

---

### Exercise 3.2: Human-AI Collaboration Design (Future State Workflow)
**Purpose:** Design the target workflow with explicit human-AI collaboration patterns.

**Research Basis:** Anthropic's 5 workflow patterns ([Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)) + BCG's Graduated Autonomy Framework ([Dec 2025](https://www.bcg.com/publications/2025/agents-accelerate-next-wave-of-ai-value-creation)).

**Exercise Design:**
- Select one of Anthropic's 5 workflow patterns for primary workflow:
  1. **Prompt Chaining** - Sequential steps where each LLM call processes previous output. Best for fixed subtasks.
  2. **Routing** - Classify inputs and direct to specialized follow-up tasks. Best when distinct categories exist.
  3. **Parallelization** - LLMs work simultaneously with outputs aggregated. Best for independent subtasks.
  4. **Orchestrator-Workers** - Central LLM dynamically delegates to worker LLMs. Best for complex, unpredictable tasks.
  5. **Evaluator-Optimizer** - One LLM generates, another evaluates in iterative loops. Best when clear evaluation criteria exist.

- Note: For fully autonomous workflows, these patterns combine into what Anthropic calls "Agents" - systems where LLMs dynamically direct their own processes. Only appropriate for open-ended problems requiring trust in LLM decision-making.

- Define BCG's Graduated Autonomy levels:
  1. **Shadow Mode (Tier 1)** - Agent suggests, human acts. "Digital whisperer" that drafts options. Training ground to validate agent logic without operational risk.
  2. **Supervised Autonomy (Tier 2)** - Human-in-the-loop. Agent performs tasks with tap-to-approve workflow.
  3. **Monitored Autonomy (Tier 3)** - Human-on-the-loop. Agent acts under policy with monitoring, no active approval required.
  4. **Full Autonomy (Tier 4)** - Human out of the loop. Reserved for mature, low-risk environments where cost of error is negligible.

- Key principle: "Autonomy is a journey of trust, quantified by accuracy." Start at Tier 1 until agent proves alignment with organizational risk appetite.

- Map human oversight requirements:
  - HITL (Human-in-the-loop) checkpoints - active participation required
  - HOTL (Human-on-the-loop) monitoring - supervision without approval
  - Escalation triggers - when to pull human back in

**Form Fields:**
- Primary pattern (select from 5 workflow options with descriptions)
- Starting autonomy level (select from 4 tiers)
- Promotion criteria (what earns higher autonomy)
- HITL checkpoints (list with trigger conditions)
- HOTL monitoring points (list)
- Escalation triggers (list)

---

### Exercise 3.3: Risk & Governance Assessment (Risk Governance)
**Purpose:** Assess AI-specific risks and define governance requirements.

**Research Basis:** NIST AI RMF, ISO/IEC 42001-42006, BCG's Graduated Autonomy Framework ([Dec 2025](https://www.bcg.com/publications/2025/agents-accelerate-next-wave-of-ai-value-creation)), McKinsey's six lessons from 50+ agentic deployments.

**Exercise Design:**
- Assess organizational readiness using BCG's Graduated Autonomy Framework:
  1. **Shadow Mode Ready** - Can support agents that suggest while humans act
  2. **Supervised Autonomy Ready** - Can support HITL workflows with approval gates
  3. **Monitored Autonomy Ready** - Can support HOTL with policy-based agent actions
  4. **Full Autonomy Ready** - Mature governance for independent agent operation

- Evaluate agentic-specific risks (McKinsey's categories):
  - **Decision Boundaries** - Agent making decisions outside scope
  - **Hallucinations** - Incorrect outputs treated as authoritative
  - **Cybersecurity** - New attack vectors via agent interfaces
  - **Chain of Authority** - Unclear accountability for agent actions

- Define governance requirements:
  - Compliance considerations (regulatory, audit)
  - Data privacy requirements
  - Monitoring and logging needs
  - Incident response protocols
  - Update/change management process

**Form Fields:**
- Current autonomy readiness (select from 4 tiers: Shadow → Full)
- Target autonomy level for pilot (select from 4 tiers)
- Risk assessment checklist (toggle each risk, add mitigation)
- Compliance requirements (text list)
- Monitoring requirements (text list)
- Stopping conditions (what would halt the pilot)

---

### Exercise 3.4: Success Criteria Definition (MVP Charter)
**Purpose:** Define measurable success criteria before building.

**Research Basis:** Bain reports 30-50% process acceleration is achievable. 80% of AI pilots fail to scale. Clear criteria prevent scope creep.

**Exercise Design:**
- Define quantitative KPIs:
  - Time savings target (e.g., "reduce from 30 min to 10 min")
  - Error rate target (e.g., "<5% human correction needed")
  - Volume capacity (e.g., "handle 100 cases/day")
  - User satisfaction (e.g., "NPS > 40 from pilot users")

- Set time-to-value milestones:
  - Benchmark: Under 90 days for structured pilots
  - Week 1-2: Sandbox prototype
  - Week 3-8: MVP development
  - Week 9-12: Production pilot

- Define stopping conditions:
  - Error rate threshold
  - User rejection rate
  - Security incidents
  - Compliance violations

- Charter summary:
  - One-line description of what we're building
  - Primary success metric
  - Pilot duration
  - Go/no-go decision date

**Form Fields:**
- MVP scope (one paragraph)
- Primary KPI + target value
- Secondary KPIs (list with targets)
- Milestone timeline (structured dates)
- Stopping conditions (list)
- Pilot users (who will test)
- Go/no-go decision date

---

### Key Statistics to Reference in UI

| Metric | Value | Source |
|--------|-------|--------|
| Organizations scaling agentic AI | 23% | McKinsey 2025 |
| AI pilots that never scale | ~80% | Industry research |
| Expected process acceleration | 30-50% | Bain & Company |
| Organizations requiring human final approval | 47% | Industry surveys |
| Agentic projects predicted to fail by 2027 | 40%+ | Gartner |

---

### Session 3 Flow (Revised)

```
Friction Points (from Session 2)
    ↓
Workflow Variance Assessment (Pattern Matching)
    ↓
Human-AI Collaboration Design (Future State Workflow)
    ↓
Risk & Governance Assessment (Risk Governance)
    ↓
Success Criteria Definition (MVP Charter)
    ↓
MVP Specification (existing, enhanced)
```

Each exercise feeds into the next, building a complete picture before any code is written

---

### 2. Progress Bar Stuck at 0% ✅ PARTIALLY FIXED
**Status:** 🟡 Partially Fixed
**Files:**
- `/src/app/workshop/layout.tsx`

**Issue:** Progress calculation was based on strict completion gates.

**Already Fixed:** Changed to "has data" criteria in previous session.

**Verify:** Test that progress updates when data is added.

---

### 3. Navigation Buttons Disabled Despite Data ✅ FIXED
**Status:** 🟢 Fixed
**Files:**
- `/src/app/workshop/session-1/working-principles/page.tsx`
- `/src/app/workshop/session-1/tradeoff-navigator/page.tsx`

**Already Fixed:** Removed arbitrary completion gates. Continue buttons always enabled with guidance tips.

---

### 4. AI Icebreakers Continue Button Hidden Until 3 Biases Checked
**Status:** 🔴 Not Started
**File:** `/src/app/workshop/session-1/ai-icebreakers/page.tsx`
**Line:** 279

**Issue:** Continue button only shows when `responses.length > 0 && biases.filter(b => b.checked).length >= 3`

**Fix:** Remove bias requirement. Show button when `responses.length > 0` OR always show with guidance tip.

---

### 5. Lessons Learned Continue Button Conditional
**Status:** 🔴 Not Started
**File:** `/src/app/workshop/session-5/lessons-learned/page.tsx`
**Line:** 138

**Issue:** Continue button only shows when `lessonsLearned.length > 0`

**Fix:** Always show Continue button with guidance tip.

---

### 6. Scaling Checklist Continue Button Conditional
**Status:** 🔴 Not Started
**File:** `/src/app/workshop/session-5/scaling-checklist/page.tsx`
**Line:** 322

**Issue:** Continue button only shows when `scalingChecklist.length > 0`

**Fix:** Always show Continue button with guidance tip.

---

## Major Issues (UX Problems)

### 7. Working Principles Enter Key Doesn't Work
**Status:** 🔴 Not Started
**File:** `/src/app/workshop/session-1/working-principles/page.tsx`

**Issue:** Input boxes don't accept Enter key to add items. Users must click "Add Do"/"Add Don't".

**Fix:** Add `onKeyPress` handler to call add function when Enter is pressed.

---

### 8. Working Principles Duplicate/Stuck Blank Boxes
**Status:** 🔴 Not Started
**File:** `/src/app/workshop/session-1/working-principles/page.tsx`

**Issue:** Duplicate blank boxes appear and cannot be removed.

**Fix:** Review state management for do/don't lists. Ensure empty items are filtered and deletion works.

---

### 9. Cognitive Bias Selection - Small Click Targets
**Status:** 🔴 Not Started
**File:** `/src/app/workshop/session-1/ai-icebreakers/page.tsx`

**Issue:** Small click targets make selection difficult; selections sometimes reset.

**Fix:** Increase clickable area; ensure state updates are immediate.

---

### 10. Dot Voting Selection UI Unclear
**Status:** 🔴 Not Started
**File:** `/src/app/workshop/session-2/dot-voting/page.tsx`

**Issue:** Pilot selection requires clicking small unlabeled circles. No confirmation prompt.

**Fix:** Add labels to selection buttons; increase click target size; consider adding confirmation or clearer visual feedback.

---

### 11. MVP Tool Selection Toggle Unclear
**Status:** 🔴 Not Started
**File:** `/src/app/workshop/session-3/mvp-spec/page.tsx`

**Issue:** Tool selection toggles highlight unpredictably; unclear which tools are selected.

**Fix:** Improve visual feedback for selected vs unselected state. Add checkmarks or clearer color contrast.

---

### 12. Votes Remaining Counter Delayed Update
**Status:** 🔴 Not Started
**File:** `/src/app/workshop/session-2/dot-voting/page.tsx`

**Issue:** Counter doesn't update immediately after each click.

**Fix:** Ensure state update triggers immediate re-render. Review React state batching.

---

## Minor Issues (Polish)

### 13. Home Page Auto-Focus
**Status:** 🔴 Not Started
**File:** `/src/app/workshop/page.tsx` or similar

**Issue:** Organization name field doesn't auto-focus.

**Fix:** Add `autoFocus` attribute to input.

---

### 14. Do/Don't Entries Can't Be Edited
**Status:** 🔴 Not Started
**File:** `/src/app/workshop/session-1/working-principles/page.tsx`

**Issue:** Entries truncate and can't be edited or deleted.

**Fix:** Add edit/delete functionality for list items.

---

### 15. Responsive Design Issues
**Status:** 🔴 Not Started
**Files:** Multiple

**Issue:** Text and buttons overflow on smaller screens.

**Fix:** Audit and fix responsive styles.

---

## Implementation Order

### Phase 1: Critical Button Gate Fixes (Quick Wins)
1. [ ] Fix AI Icebreakers continue button gate
2. [ ] Fix Lessons Learned continue button gate
3. [ ] Fix Scaling Checklist continue button gate
4. [ ] Verify progress bar updates correctly

### Phase 2: Build Session 3 Exercises (Major Work)
5. [ ] Build Workflow Variance Assessment (pattern-matching)
6. [ ] Build Human-AI Collaboration Design (future-state-workflow)
7. [ ] Build Risk & Governance Assessment (risk-governance)
8. [ ] Build Success Criteria Definition (mvp-charter)
9. [ ] Update Session 3 navigation and flow
10. [ ] Add Zustand store types/actions for new exercises

### Phase 3: UX Improvements
11. [ ] Add Enter key support to Working Principles
12. [ ] Fix Working Principles duplicate/stuck boxes
13. [ ] Improve Cognitive Bias click targets
14. [ ] Improve Dot Voting selection UI
15. [ ] Improve MVP Tool selection clarity
16. [ ] Fix votes counter immediate update

### Phase 4: Polish
17. [ ] Add auto-focus to home page
18. [ ] Add edit/delete to Do/Don't items
19. [ ] Fix responsive design issues

---

## Verification Plan

After fixes, verify each flow:

1. **Session 1 Flow:**
   - Start workshop → AI Icebreakers → Working Principles → Tradeoff Navigator
   - Verify progress updates at each step
   - Verify navigation works without arbitrary gates

2. **Session 2 Flow:**
   - Friction Mapping → Opportunity Scoring → Priority Matrix → Dot Voting
   - Verify data flows between exercises
   - Verify voting works correctly

3. **Session 3 Flow:**
   - (After stub decision) MVP Specification works
   - Data links to friction points correctly

4. **Session 4 Flow:**
   - Pilot Plan → Roadmap Builder
   - Data links to MVP specs correctly

5. **Session 5 Flow:**
   - Scaling Checklist → Training Plan → Lessons Learned → Next Opportunities
   - All exercises accessible regardless of data

---

## Notes

- All changes should maintain the "guided freedom" principle from previous work
- True data dependencies (where exercise B needs data from A) should show helpful messages
- Arbitrary gates should be removed, replaced with guidance tips
- Forms should allow partial completion with sensible defaults

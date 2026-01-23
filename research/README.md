# AgentMapper Research Library

**Last Updated:** January 22, 2026

---

## Purpose

This folder contains verified research that informs the Session 3 exercise designs. All claims in REPAIR_PLAN.md have been validated against these primary sources.

---

## Folder Structure

```
/research/
├── README.md                          # This file
├── SESSION3_RESEARCH_SYNTHESIS.md     # Analysis and synthesis for implementation
└── /sources/
    ├── anthropic-building-effective-agents.md   # Anthropic's 5 workflow patterns
    ├── bcg-graduated-autonomy-framework.md      # BCG's 4-tier autonomy model
    └── mckinsey-six-lessons-agentic-ai.md       # McKinsey's deployment lessons
```

---

## How to Use This Research

### For Building Session 3 Exercises

1. **Start with:** `SESSION3_RESEARCH_SYNTHESIS.md` - Contains the analysis, framework mappings, and design principles
2. **Reference:** Individual source files when you need exact quotes, statistics, or detailed definitions
3. **Verify:** Check source URLs if information seems outdated

### For Updating Research

1. Fetch current content from source URLs
2. Update the relevant source file in `/sources/`
3. Update `SESSION3_RESEARCH_SYNTHESIS.md` if findings change
4. Update `REPAIR_PLAN.md` if exercise designs need modification

---

## Key Frameworks Summary

### Anthropic: 5 Workflow Patterns
1. Prompt Chaining
2. Routing
3. Parallelization
4. Orchestrator-Workers
5. Evaluator-Optimizer

(Note: "Agents" is a broader concept using these patterns, NOT a 6th pattern)

### BCG: 4-Tier Graduated Autonomy
1. Shadow Mode (Tier 1) - Agent suggests, human acts
2. Supervised Autonomy (Tier 2) - HITL with approval gates
3. Monitored Autonomy (Tier 3) - HOTL with policy-based operation
4. Full Autonomy (Tier 4) - Independent operation

### McKinsey: 6 Lessons from 50+ Deployments
1. Focus on workflow, not the agent
2. Reusability reduces effort (30-50%)
3. Data quality matters
4. Process redesign is essential
5. Humans "above the loop"
6. Start with high-value, bounded workflows

---

## Verification Status

| Framework | Source | Status | Last Verified |
|-----------|--------|--------|---------------|
| Anthropic Patterns | anthropic.com | VERIFIED | Jan 22, 2026 |
| BCG Autonomy | bcg.com | VERIFIED | Jan 22, 2026 |
| McKinsey Lessons | mckinsey.com | VERIFIED | Jan 22, 2026 |
| BCG "FAST" Framework | N/A | DOES NOT EXIST | Jan 22, 2026 |

---

## Important Notes

- **BCG "FAST" Framework:** This was incorrectly cited in earlier documentation. BCG does NOT have a framework called "FAST" with stages Exploratory/Experimental/Operational/Strategic. Use the Graduated Autonomy Framework instead.

- **Anthropic "6 Patterns":** Anthropic describes 5 workflow patterns plus "Agents" as a broader concept. Do not list "Autonomous Agent" as a 6th pattern.

# Session 3 Research Synthesis

**Created:** January 22, 2026
**Purpose:** Synthesize research findings to guide Session 3 exercise development
**Status:** COMPLETE - Ready for implementation

---

## Executive Summary

Session 3 ("Solution Design") bridges the gap between identifying friction points (Session 2) and building an MVP. The research reveals a critical insight: **process redesign must precede technology selection**. Organizations that redesign workflows around AI are 3x more likely to succeed than those who simply add AI to existing processes.

---

## Key Research Findings

### 1. The Workflow-First Principle (McKinsey)

**Finding:** 88% of organizations use AI, but only 6% achieve significant EBIT impact. The differentiator is workflow redesign—55% of high performers redesign workflows vs. 20% of others.

**Implication for Session 3:** Exercises should guide executives to redesign processes BEFORE selecting AI patterns or tools.

### 2. Graduated Trust Model (BCG)

**Finding:** Successful agent deployments follow a "promotion path" where agents earn autonomy through proven performance. Starting with Shadow Mode (Tier 1) allows organizations to validate agent logic without operational risk.

**Implication for Session 3:** Help executives define starting autonomy levels and promotion criteria rather than jumping to full automation.

### 3. Simple Patterns First (Anthropic)

**Finding:** The most successful agent implementations use simple, composable patterns rather than complex frameworks. There are 5 workflow patterns that cover most use cases.

**Implication for Session 3:** Teach executives to match their workflow needs to the simplest appropriate pattern.

---

## Framework Mapping for Session 3 Exercises

### Exercise 3.1: Workflow Variance Assessment
**Research Basis:** McKinsey's finding that workflow focus is critical

**Key Concept:** Not all workflows benefit from agentic AI equally. Map friction points on standardization × variance to identify best fits.

| Quadrant | Characteristics | Recommendation |
|----------|-----------------|----------------|
| High variance, Low standardization | Unpredictable decisions, many exceptions | Best fit for agentic AI |
| Low variance, High standardization | Predictable, rule-based | Better for traditional RPA |
| High variance, High standardization | Standard process with exceptions | Hybrid approach |
| Low variance, Low standardization | Ad-hoc but simple | Case-by-case evaluation |

---

### Exercise 3.2: Human-AI Collaboration Design
**Research Basis:** Anthropic's 5 patterns + BCG's Graduated Autonomy

**Pattern Selection Guide:**

| If the workflow needs... | Use this pattern |
|-------------------------|------------------|
| Sequential processing with verification | Prompt Chaining |
| Input classification and specialized handling | Routing |
| Speed through independent parallel work | Parallelization |
| Dynamic task breakdown | Orchestrator-Workers |
| Quality through iteration | Evaluator-Optimizer |

**Autonomy Selection Guide:**

| Start here if... | Tier |
|------------------|------|
| First agent, high-risk domain, building trust | Tier 1: Shadow Mode |
| Proven agent logic, need human approval | Tier 2: Supervised Autonomy |
| Established guardrails, policy-based operation | Tier 3: Monitored Autonomy |
| Mature environment, low-risk, high volume | Tier 4: Full Autonomy |

---

### Exercise 3.3: Risk & Governance Assessment
**Research Basis:** McKinsey's risk categories + BCG's readiness framework

**Agentic-Specific Risk Categories (McKinsey):**

1. **Decision Boundaries** - Agent making decisions outside defined scope
2. **Hallucinations** - Incorrect outputs treated as authoritative
3. **Cybersecurity** - New attack vectors via agent interfaces
4. **Chain of Authority** - Unclear accountability for agent actions

**Readiness Assessment:**

| Level | Indicators |
|-------|------------|
| Shadow Mode Ready | Can support agents that suggest; humans willing to evaluate |
| Supervised Ready | Approval workflows exist; can implement HITL gates |
| Monitored Ready | Policy frameworks exist; monitoring infrastructure available |
| Full Autonomy Ready | Mature governance; proven track record; low-risk tolerance met |

---

### Exercise 3.4: Success Criteria Definition
**Research Basis:** McKinsey's bounded workflow principle + Bain's acceleration metrics

**Key Metrics to Define:**

| Category | Example Targets |
|----------|-----------------|
| Time savings | 30-50% process acceleration (Bain benchmark) |
| Error rate | <5% requiring human correction |
| Volume capacity | Specific throughput targets |
| User satisfaction | NPS > 40 from pilot users |

**Timeline Benchmarks:**
- Sandbox prototype: Weeks 1-2
- MVP development: Weeks 3-8
- Production pilot: Weeks 9-12
- Total time-to-value: Under 90 days (industry benchmark)

---

## Statistics to Reference in UI

| Statistic | Value | Source | Use In |
|-----------|-------|--------|--------|
| Organizations scaling agentic AI | 23% | McKinsey 2025 | Context setting |
| AI pilots that never scale | ~80% | Industry research | Why criteria matter |
| Expected process acceleration | 30-50% | Bain & Company | Success metrics |
| Organizations requiring human final approval | 47% | Industry surveys | Autonomy discussion |
| High performers redesigning workflows | 55% vs 20% | McKinsey | Workflow importance |
| Companies beyond POC | 22% | BCG | Why rigor matters |
| AI high performers | 6% | McKinsey | Aspiration setting |

---

## Design Principles for Session 3 UI

1. **Workflow-first framing** - Always start with process understanding before technology
2. **Progressive disclosure** - Don't overwhelm; reveal complexity as needed
3. **Evidence-based guidance** - Show statistics to support recommendations
4. **Conservative defaults** - Default to lower autonomy tiers, simpler patterns
5. **Clear dependencies** - Show how each exercise builds on previous
6. **Executive-appropriate language** - Avoid technical jargon

---

## Sources (Full Documents in /research/sources/)

1. `anthropic-building-effective-agents.md` - Pattern definitions and best practices
2. `bcg-graduated-autonomy-framework.md` - Autonomy tiers and statistics
3. `mckinsey-six-lessons-agentic-ai.md` - Deployment lessons and high performer data

---

## Verification Checklist

Before implementation, verify:
- [ ] All 5 Anthropic patterns correctly described (not 6)
- [ ] BCG autonomy tiers match source (Shadow → Supervised → Monitored → Full)
- [ ] McKinsey statistics current and accurate
- [ ] No fabricated frameworks (e.g., "FAST" was incorrect)
- [ ] Source links functional

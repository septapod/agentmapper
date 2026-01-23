# Anthropic: Building Effective Agents

**Source:** https://www.anthropic.com/research/building-effective-agents
**Retrieved:** January 22, 2026
**Status:** VERIFIED

---

## Overview

Over the past year, Anthropic has worked with dozens of teams building large language model (LLM) agents across industries. Consistently, the most successful implementations weren't using complex frameworks or specialized libraries. Instead, they were building with simple, composable patterns.

### Core Philosophy

> "Start with simple prompts, optimize them with comprehensive evaluation, and add multi-step agentic systems only when simpler solutions fall short."

> "You should consider adding complexity only when it demonstrably improves outcomes. Success in the LLM space isn't about building the most sophisticated system. It's about building the right system for your needs."

---

## Building Block: The Augmented LLM

The basic building block of agentic systems is an LLM enhanced with augmentations such as:
- **Retrieval** - Access to external knowledge
- **Tools** - Ability to take actions
- **Memory** - Retention of context across sessions

Current models can actively use these capabilities—generating their own search queries, selecting appropriate tools, and determining what information to retain.

---

## The 5 Workflow Patterns

### 1. Prompt Chaining

**Definition:** Breaks tasks into sequential steps where each LLM call processes the previous output, with programmatic checks at intermediate points.

**When to Use:**
- Tasks that can be decomposed into fixed subtasks
- When trading latency for higher accuracy is acceptable
- When you need verification gates between steps

**Example:** Document processing where extraction → validation → formatting happen in sequence.

---

### 2. Routing

**Definition:** Classifies inputs and directs them to specialized follow-up tasks, enabling separation of concerns.

**When to Use:**
- Complex tasks with distinct categories that can be handled separately
- When accurate classification is possible upfront
- When different inputs require fundamentally different processing

**Example:** Customer support where queries are classified (billing, technical, general) and routed to specialized handlers.

---

### 3. Parallelization

**Definition:** LLMs work simultaneously on tasks with outputs aggregated programmatically. Includes two variations:
- **Sectioning** - Breaking a task into independent parallel subtasks
- **Voting** - Running the same task multiple times for consensus

**When to Use:**
- Subtasks can be parallelized for speed gains
- Multiple perspectives or redundancy needed for confidence
- Large tasks that can be divided without dependencies

**Example:** Analyzing a document where different sections are processed simultaneously, or getting multiple model responses and selecting the best.

---

### 4. Orchestrator-Workers

**Definition:** Central LLM dynamically breaks down tasks, delegates to worker LLMs, and synthesizes their results.

**When to Use:**
- Complex tasks where subtasks cannot be predicted in advance
- Flexibility in task decomposition is needed
- The nature of work varies significantly based on input

**Example:** A coding assistant that dynamically decides which files to read, what changes to make, and how to verify them.

---

### 5. Evaluator-Optimizer

**Definition:** One LLM generates responses while another evaluates and provides feedback in iterative loops.

**When to Use:**
- Clear evaluation criteria exist
- Iterative refinement demonstrably improves outcomes
- Quality can be measured programmatically or by another model

**Example:** Code generation where one model writes code and another reviews it, with iterations until tests pass.

---

## Agents (The Broader Concept)

**Definition:** "Systems where LLMs dynamically direct their own processes and tool usage, maintaining control over how they accomplish tasks."

**When to Use:**
- Open-ended problems where the path isn't clear
- Unpredictable number of steps required
- Environment requires trust in LLM decision-making
- Tasks benefit from autonomous exploration

**Key Distinction:** Agents are not a 6th pattern—they are systems that USE these patterns dynamically. An agent might employ prompt chaining for one subtask, parallelization for another, and routing for a third, all within the same overall task.

---

## Best Practices

1. **Start simple** - Use the simplest pattern that solves your problem
2. **Add complexity incrementally** - Only when demonstrably needed
3. **Evaluate comprehensively** - Test patterns against your specific use cases
4. **Consider latency** - More complex patterns often trade speed for accuracy
5. **Trust appropriately** - More autonomous systems require more trust in model capabilities

---

## Related Anthropic Resources

- [Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
- [Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Effective Context Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Anthropic Cookbook - Agents](https://github.com/anthropics/anthropic-cookbook/tree/main/patterns/agents)

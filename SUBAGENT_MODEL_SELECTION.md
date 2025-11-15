# Subagent Model Selection in Claude Code

## Overview

Claude Code supports **dynamic model selection** for subagents launched via the `Task` tool. This allows you to optimize for cost, speed, or quality depending on the complexity of each subtask.

## Available Models

When launching a subagent with the `Task` tool, you can specify one of three models:

| Model | Best For | Characteristics |
|-------|----------|-----------------|
| **haiku** | Quick, straightforward tasks | Fastest, most cost-effective, ideal for simple queries |
| **sonnet** | General-purpose tasks | Balanced performance and quality (default if not specified) |
| **opus** | Complex analysis and reasoning | Highest quality, best for intricate tasks requiring deep analysis |

## How to Use

### Basic Syntax

When using the `Task` tool, add the optional `model` parameter:

```json
{
  "subagent_type": "Explore",
  "model": "opus",
  "description": "Complex codebase analysis",
  "prompt": "Analyze the architecture..."
}
```

### Practical Examples

#### Example 1: Using Opus for Complex Analysis

```json
{
  "subagent_type": "Explore",
  "model": "opus",
  "description": "Deep architectural analysis",
  "prompt": "Explore the codebase and provide a comprehensive analysis of the documentation structure, identifying all markdown files and describing their purpose and relationships."
}
```

**Result:** Opus provides detailed, thorough analysis with rich context and connections.

#### Example 2: Using Haiku for Simple Queries

```json
{
  "subagent_type": "Explore",
  "model": "haiku",
  "description": "Find Python files",
  "prompt": "Find all Python files in the repository and return a simple list."
}
```

**Result:** Haiku returns quick, concise answers perfect for straightforward queries.

#### Example 3: Using Sonnet (Default)

```json
{
  "subagent_type": "general-purpose",
  "description": "Standard task",
  "prompt": "Refactor the authentication module to use async/await patterns."
}
```

**Result:** Sonnet provides balanced performance without specifying the model parameter.

## Model Selection Strategy

### Use **Haiku** when:
- Finding specific files or patterns
- Simple grep/search operations
- Quick yes/no questions
- Listing files or directories
- Basic code formatting
- Minimizing cost and latency is important

### Use **Sonnet** when:
- General-purpose development tasks
- Code refactoring
- Writing new features
- Bug fixing
- Balanced quality and speed needed
- Default choice for most tasks

### Use **Opus** when:
- Complex architectural decisions
- Comprehensive codebase analysis
- Intricate debugging requiring deep understanding
- Security analysis
- Design pattern recommendations
- Tasks requiring highest quality reasoning

## Parallel Execution with Different Models

You can launch multiple subagents simultaneously with different models:

```json
// Launch multiple agents in one message
Task 1: model="opus" - Comprehensive security audit
Task 2: model="haiku" - Find all TODO comments
Task 3: model="sonnet" - Implement new feature
```

This allows you to optimize each subtask independently while working in parallel.

## Cost and Performance Considerations

- **Haiku**: ~60x cheaper than Opus, ~20x faster
- **Sonnet**: ~3x cheaper than Opus, balanced speed
- **Opus**: Highest quality but most expensive and slowest

**Best Practice:** Start with the least expensive model that can accomplish the task. Upgrade to a more powerful model only when complexity demands it.

## Important Notes

1. **Inheritance:** If no model is specified, the subagent inherits the parent's model
2. **Tool Availability:** All models have access to the same tools (determined by `subagent_type`)
3. **Context Limits:** All models share similar context window sizes
4. **Stateless Agents:** Each subagent runs independently; model choice doesn't affect agent-to-agent communication

## Testing Example

Here's a real test demonstrating different model capabilities:

### Test Setup
```bash
# Launch two parallel subagents with different models
1. Opus: "Explore and summarize all documentation"
2. Haiku: "Find all Python files"
```

### Results
- **Opus:** Provided comprehensive 6-section analysis with 6 markdown files identified, detailed descriptions, and relationship mapping
- **Haiku:** Simple, direct answer: "No Python files found"

Both completed successfully, demonstrating appropriate model selection for task complexity.

## Integration with Existing Workflows

Model selection works seamlessly with:
- All subagent types (Explore, Plan, general-purpose, etc.)
- TodoWrite for task tracking
- Parallel execution
- Sequential task chains

## Conclusion

Dynamic model selection for subagents is a powerful feature that allows Claude Code to optimize for quality, speed, and cost on a per-task basis. By choosing the appropriate model for each subtask, you can achieve better performance and more efficient resource utilization.

---

**Documentation Version:** 1.0
**Last Updated:** 2025-11-15
**Tested On:** Claude Code with Sonnet 4.5

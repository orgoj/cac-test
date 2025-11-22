# MAMA System - Comprehensive Analysis Report

**Repository:** https://github.com/jungjaehoon-lifegamez/MAMA
**Analyzed:** 2025-11-22
**System:** Memory-Augmented MCP Assistant

## Executive Summary

MAMA is a local-first memory system for Claude that tracks decision evolution using SQLite and transformer embeddings. It operates as an MCP (Model Context Protocol) server with a Claude Code plugin, providing session continuity and semantic search capabilities. The system is designed with token efficiency in mind (500-token budget per injection) and maintains complete local data storage.

---

## 1. Architecture & Implementation

### 1.1 System Architecture

**Two-Component Design:**
- **MCP Server Package** (`@jungjaehoon/mama-server`): Core logic, database operations, embeddings
- **Claude Code Plugin Package** (`mama`): Command interface, hooks, and skills

**Technology Stack:**
- Runtime: Node.js ≥18.0.0
- Database: SQLite (better-sqlite3 v11.0.0)
- Vector Storage: sqlite-vec v0.1.0
- Embeddings: @huggingface/transformers v3.0.0
- Testing: Vitest (134 tests with 100% pass rate)
- Language: JavaScript (100%)

### 1.2 Database Schema

**Primary Tables:**

1. **Decisions Table** - Core decision storage:
   ```
   Fields: id, topic, decision, reasoning, confidence, outcome,
           failure_reason, limitation, supersedes, superseded_by,
           refined_from, needs_validation, validation_attempts,
           usage_count, usage_success, usage_failure, time_saved,
           created_at, updated_at, last_validated_at
   ```

2. **Checkpoints Table** - Session continuity:
   ```
   Fields: timestamp, summary, open_files (JSON array),
           next_steps, status (active/archived)
   ```

3. **Decision Edges Table** - Relationship graph:
   ```
   Fields: from_id, to_id, relationship_type (refines/contradicts),
           created_at
   ```

4. **Vector Embeddings** - sqlite-vec virtual table:
   ```
   384-dimensional Float32Array vectors
   Cosine similarity search with configurable thresholds
   ```

### 1.3 Core Implementation Files

**Server Components (packages/mcp-server/src/mama/):**
- `mama-api.js` (30,545 bytes) - Main API with 6 core functions
- `db-manager.js` (17,479 bytes) - Database operations and queries
- `decision-formatter.js` (35,842 bytes) - Token-optimized formatting
- `decision-tracker.js` (21,462 bytes) - Evolution graph management
- `embeddings.js` (7,837 bytes) - Vector generation with caching
- `relevance-scorer.js` (10,210 bytes) - Weighted ranking algorithm
- `memory-inject.js` (7,962 bytes) - Context injection with token budget
- `hook-metrics.js` (11,460 bytes) - Performance monitoring
- `query-intent.js` (7,276 bytes) - Query analysis
- `embedding-cache.js` (4,797 bytes) - Singleton pattern caching
- `ollama-client.js` (10,669 bytes) - Optional local LLM integration
- `outcome-tracker.js` (9,123 bytes) - Result tracking
- `transparency-banner.js` (8,310 bytes) - Tier status display
- `config-loader.js` (6,084 bytes) - Configuration management
- `debug-logger.js` (1,924 bytes) - Logging utilities
- `time-formatter.js` (2,481 bytes) - Timestamp formatting
- `memory-store.js` (3,336 bytes) - In-memory caching

**Tool Implementations (packages/mcp-server/src/tools/):**
- `save-decision.js` (4,150 bytes) - Decision persistence
- `recall-decision.js` (2,742 bytes) - History retrieval
- `suggest-decision.js` (2,492 bytes) - Semantic search
- `list-decisions.js` (2,238 bytes) - Chronological listing
- `update-outcome.js` (4,908 bytes) - Outcome updates
- `checkpoint-tools.js` (2,150 bytes) - Session management
- `index.js` (1,619 bytes) - Tool exports

### 1.4 Storage & Data Location

**Local Storage Only:**
- Database: `~/.claude/mama-memory.db` (configurable via `MAMA_DB_PATH`)
- Config: `~/.mama/config.json`
- Embedding Models: ~500MB cache (downloaded on first use)
- No external API calls or cloud dependencies

**Shared Database:**
- Single SQLite database shared across all MCP clients
- Works simultaneously with Claude Code, Claude Desktop, Codex, Antigravity IDE

### 1.5 Communication Protocol

**MCP (Model Context Protocol):**
- Transport: stdio (standard input/output)
- Format: JSON-RPC
- Logging: stderr for diagnostics, stdout for MCP data
- 7 exposed tools via ListToolsRequestSchema and CallToolRequestSchema

---

## 2. Token Efficiency

### 2.1 Token Budget Management

**Hard Limit: 500 tokens per injection**
```javascript
const TOKEN_BUDGET = 500; // Max 500 tokens per injection
```

**Token Estimation:**
- ~1 token per 4 characters
- Truncation strategy preserves priority information

### 2.2 Context Formatting Strategies

**Three-Tier Truncation Priority:**
1. Quick answers (highest priority)
2. Code examples (medium priority)
3. Trust metadata (lowest priority)

**Format Variants:**

1. **Instant Answer** (with trust_context):
   - Quick answer + code example + 5-component trust evidence

2. **Teaser List** (Google-style):
   - Top 3 results with relevance percentages
   - 40-token teaser format for UserPromptSubmit hook
   - 300-token budget for PreToolUse hook

3. **Legacy Context**:
   - Small histories: Full details
   - Large histories: Rolling summaries highlighting top 3 failures

4. **Recall Output**:
   - Single decisions: Full metadata
   - Multiple decisions: Chronological history with semantic edges

### 2.3 Optimization Techniques

**Embedding Caching:**
- Singleton pattern model initialization
- Cache clearing on model change
- Avoids redundant computations
- Target latency: <30ms per embedding

**Batch Processing:**
- Multiple texts processed in single model forward pass
- More efficient than sequential generation

**Top-N Selection:**
- Decision chains >4 items: Show top 3 with full detail
- Remaining items: Summarized with failure counts only
- Reduces token overhead while preserving critical information

**Query Truncation:**
- Long queries truncated for embedding generation
- Preserves semantic meaning while reducing compute

### 2.4 Memory Injection Performance

**Automatic Context Injection:**

1. **UserPromptSubmit Hook:**
   - Threshold: 75% similarity
   - Format: 40-token teaser
   - Example: "💡 MAMA: 2 related • authentication_strategy (85%, 3 days ago)"

2. **PreToolUse Hook:**
   - Triggers: Before read/edit/grep operations
   - Threshold: 70% similarity
   - Budget: 300 tokens for context-specific details

**Performance Targets:**
- Embedding generation: <30ms
- Vector search: <100ms
- Total hook latency: <500ms (warning at 400ms)
- Overall timeout: 5 seconds

### 2.5 Token Overhead Analysis

**Per-Session Overhead:**
- Hook executions: 2-3 per user interaction
- Token injection: 40-500 tokens depending on hook type
- Typical session: ~1,500-3,000 tokens for memory context
- Checkpoint save: ~200-500 tokens (summary + files + next steps)
- Checkpoint resume: ~300-600 tokens (retrieval + display)

**Memory Compaction:**
- No automatic compaction mechanism
- Manual outcome updates mark decisions as superseded
- Superseded decisions still searchable but lower priority
- Database grows linearly with decision count

---

## 3. Simplicity & Setup

### 3.1 Installation Methods

**Claude Code (Recommended - Easiest):**
```bash
/plugin marketplace add jungjaehoon/claude-plugins
/plugin install mama@jungjaehoon
```
- Installation time: 1-2 minutes
- Automatic MCP server download
- Embedding model downloads on first use (~50MB)

**Claude Desktop:**
Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "mama": {
      "command": "npx",
      "args": ["-y", "@jungjaehoon/mama-server"],
      "env": {
        "MAMA_EMBEDDING_MODEL": "Xenova/multilingual-e5-small"
      }
    }
  }
}
```

**Other MCP Clients:**
- Codex: `.toml` configuration
- Antigravity IDE (Gemini): `.json` configuration

### 3.2 System Requirements

**Mandatory:**
- Node.js ≥18.0.0 (20+ recommended)
- 500MB free disk space (for embedding models)
- SQLite support

**Optional for Full Features:**
- better-sqlite3 (required for Tier 1)
- @huggingface/transformers (required for Tier 1)

### 3.3 Feature Tiers

**Tier 1 (Full Features):**
- Vector search enabled
- Semantic similarity matching
- 80% accuracy
- ~100ms hook latency
- Requires both optional dependencies

**Tier 2 (Degraded Mode):**
- Exact match search only
- No vector search
- 40% accuracy (vs 80% in Tier 1)
- Data remains retrievable
- Graceful degradation if dependencies fail

**Tier Detection:**
- Automatic during postinstall
- Re-run with `/mama-configure --tier-check`
- Stored in `~/.mama/config.json`

### 3.4 Configuration Options

**Available Settings:**
```bash
/mama-configure --show                    # Display current config
/mama-configure --model=X                 # Change embedding model
/mama-configure --db-path=X               # Change database location
/mama-configure --tier-check              # Re-detect capabilities
```

**Embedding Model Options:**
- `Xenova/multilingual-e5-small` (384-dim, recommended, default)
- `Xenova/multilingual-e5-base` (768-dim, better accuracy, larger)
- `Xenova/all-MiniLM-L6-v2` (384-dim, English only)

**Note:** Database path change does NOT migrate data (manual migration required)

### 3.5 Codebase Complexity

**Monorepo Structure:**
```
packages/
├── mcp-server/           # 17 core files, 7 tools, comprehensive tests
└── claude-code-plugin/   # 7 commands, 3 hooks, 1 skill
docs/                     # Documentation (structure unknown)
```

**Lines of Code (Estimated):**
- Core implementation: ~180KB across 17 files
- Tools: ~18KB across 7 files
- Plugin: ~20KB (commands + hooks + skills)
- Tests: 134 tests (62 unit, 39 integration, 33 regression)

**Code Quality:**
- 100% test pass rate
- Comprehensive error handling
- Graceful degradation patterns
- Extensive logging and metrics

---

## 4. Claude Code Compatibility

### 4.1 Integration Method

**MCP Server Approach:**
- Plugin references server via `.mcp.json`:
  ```json
  {
    "command": "npx",
    "args": ["-y", "@jungjaehoon/mama-server"],
    "env": {
      "MAMA_EMBEDDING_MODEL": "Xenova/multilingual-e5-small"
    }
  }
  ```
- Server runs as separate process
- Communication via stdio MCP protocol

### 4.2 Available Commands

| Command | Purpose | Token Impact |
|---------|---------|--------------|
| `/mama-save` | Store decision with reasoning | ~100-200 tokens |
| `/mama-recall <topic>` | View decision evolution | ~300-1000 tokens |
| `/mama-suggest <query>` | Semantic search | ~200-500 tokens |
| `/mama-list` | Browse recent decisions | ~100-300 tokens |
| `/mama-checkpoint` | Save session state | ~200-500 tokens |
| `/mama-resume` | Restore session | ~300-600 tokens |
| `/mama-configure` | Manage settings | ~50-100 tokens |

### 4.3 Hooks & Auto-Context

**Automatic Hook Execution:**

1. **UserPromptSubmit Hook:**
   - Triggers: Every user prompt
   - Timeout: 10 seconds
   - Displays: Related decisions (75% threshold)
   - Format: Gentle hints, not intrusive walls of text
   - Example: "💡 MAMA: 2 related • auth_strategy (85%, 3 days ago)"

2. **PreToolUse Hook:**
   - Triggers: Before read/edit/grep operations
   - Timeout: 10 seconds
   - Displays: Context-specific decisions (70% threshold)
   - Budget: 300 tokens

3. **PostToolUse Hook:**
   - Triggers: After tool execution
   - Timeout: 10 seconds
   - Purpose: Context tracking and learning

**User Control:**
- Hooks can be disabled via environment variables
- Configuration files allow customization
- Maintains user agency

### 4.4 Skills

**mama-context Skill:**
- Background injection of relevant decisions
- Automatic context surfacing
- Transparency about tier status
- Non-intrusive design

### 4.5 Session Continuity

**Checkpoint Workflow:**

1. **Save Checkpoint** (`/mama-checkpoint`):
   - Auto-analyzes conversation history
   - Generates session summary
   - Extracts file paths from Read/Edit/Write operations
   - Infers remaining tasks from todos
   - Saves to database with timestamp
   - Zero configuration required

2. **Resume Session** (`/mama-resume`):
   - Loads most recent checkpoint
   - Displays: timestamp, summary, file list, next steps
   - Full context restoration
   - No arguments needed

### 4.6 Compatibility Issues

**Potential Concerns:**

1. **Node.js Requirement:**
   - Requires Node.js ≥18.0.0
   - Claude Code environment must support Node execution
   - ✅ Claude Code remote execution supports Node.js

2. **File System Access:**
   - Database: `~/.claude/mama-memory.db`
   - Config: `~/.mama/config.json`
   - Model cache: ~500MB
   - ✅ Claude Code has file system access

3. **MCP Protocol:**
   - Requires MCP server support
   - ✅ Claude Code supports MCP servers via `.mcp.json`

4. **Network Requirements:**
   - Initial download: npm package + embedding model (~550MB)
   - After installation: Fully offline
   - ✅ Compatible if initial installation can download

5. **Process Management:**
   - MCP server runs as separate process via npx
   - ✅ Claude Code supports launching MCP servers

### 4.7 Setup for Claude Code

**Installation Steps:**
1. Add plugin marketplace: `/plugin marketplace add jungjaehoon/claude-plugins`
2. Install plugin: `/plugin install mama@jungjaehoon`
3. Wait for MCP server download (1-2 minutes)
4. Verify: `/mama-list` should show "🟢 Tier 1 (Full Features Active)"

**Verification:**
```bash
/mama-configure --show    # Check configuration
/mama-list                # Test basic functionality
/mama-save test "Test decision" "Testing MAMA"  # Save test
/mama-recall test         # Recall test
```

---

## 5. Features & Limitations

### 5.1 Key Features

**Decision Tracking:**
- Topic-based organization
- Confidence scoring (0.0-1.0)
- Outcome tracking (pending/success/failure/partial/superseded)
- Failure reason and limitation documentation
- Type classification (user_decision vs assistant_insight)

**Decision Evolution:**
- Supersedes relationships (decision replacement)
- Refines relationships (multi-parent refinement)
- Contradicts relationships (semantic conflict detection)
- Graph-based traversal with recursive CTEs
- Automatic confidence evolution using Bayesian updates (60% prior, 40% parent)

**Semantic Search:**
- Vector embeddings (384-dim multilingual-e5-small)
- Cosine similarity matching
- Recency weighting with Gaussian decay
- Graph expansion (follows supersedes/refines/contradicts edges)
- Fallback keyword search
- Multilingual support (Korean and English tested)

**Relevance Scoring:**
```
Relevance = (Recency × 0.2) + (Importance × 0.5) + (Semantic × 0.3)
```
- Recency: Exponential decay, 30-day half-life
- Importance: Outcome-based (failures prioritized at 1.0)
- Semantic: Cosine similarity to query

**Session Continuity:**
- Zero-config checkpointing
- Automatic context extraction
- File tracking from tool operations
- Task inference from conversation
- Session state restoration

**Trust & Transparency:**
- Tier status always visible
- Search methodology disclosed (vector/keyword/graph)
- Source transparency metadata
- Validation tracking for assistant insights

**Multi-Client Support:**
- Shared database across all MCP clients
- Works with Claude Code, Claude Desktop, Codex, Antigravity
- Consistent data regardless of client

**Local-First Architecture:**
- All data on device
- No external API calls
- No tracking or analytics
- Privacy-preserving

### 5.2 Limitations

**1. No Automatic Memory Compaction:**
- Database grows linearly with decisions
- No automatic summarization or compression
- Manual outcome updates required to mark superseded decisions
- Old decisions remain in database (lower priority in search)

**2. Limited Token Budget:**
- 500 tokens per injection (hard limit)
- May miss context in complex scenarios
- Top-N selection can truncate important information
- Large decision chains show only top 3 with full detail

**3. Degraded Mode Performance:**
- Tier 2 (no vector search): 40% accuracy vs 80%
- Exact match search only without embeddings
- Significant capability loss if dependencies fail

**4. No Cross-Topic Intelligence:**
- Decisions organized by topic
- No automatic discovery of related topics
- User must know topic names to recall
- Semantic search helps but requires query

**5. Manual Decision Entry:**
- Requires explicit `/mama-save` commands
- No automatic extraction from conversation
- User must decide what to remember
- Risk of forgetting to save important decisions

**6. Limited Context Window Integration:**
- Hooks inject context but don't modify system prompt
- No persistent memory baseline
- Each session starts fresh without checkpoint

**7. Embedding Model Size:**
- 500MB disk space requirement
- ~50MB download on first use
- May be problematic on constrained systems

**8. No Cloud Sync:**
- Local database only
- No sync across machines
- Backup/migration is manual

**9. SQLite Limitations:**
- Single-writer database
- Concurrent access requires locking
- Not suitable for high-concurrency scenarios
- (Though unlikely to matter for single-user case)

**10. Confidence Evolution Complexity:**
- Bayesian updates may not match user intuition
- Multi-parent refinement can obscure reasoning
- Confidence scores lack calibration

**11. No Natural Language Decision Entry:**
- Requires structured parameters (topic, decision, reasoning)
- Cannot just say "remember this"
- Higher friction than ideal

**12. Graph Complexity:**
- Supersedes/refines/contradicts relationships can become complex
- No visualization of decision graph
- Hard to understand evolution for complex topics

### 5.3 Session Recovery Capabilities

**Checkpoint System:**
- ✅ Saves: Summary, file list, next steps
- ✅ Restores: Full context for continuation
- ✅ Zero configuration
- ❌ Only one active checkpoint at a time
- ❌ No checkpoint history browsing
- ❌ No named checkpoints (always latest)

**Limitations:**
- No automatic checkpointing on crash
- No checkpoint versioning
- No diff between checkpoints
- Manual save required

### 5.4 Comparison to Ideal Simple System

**MAMA Strengths:**
- ✅ Local-first
- ✅ Token-efficient (500-token budget)
- ✅ SQLite storage
- ✅ Semantic search
- ✅ Session continuity
- ✅ Well-tested (134 tests)
- ✅ Production-ready

**MAMA Weaknesses:**
- ❌ Complex codebase (~220KB)
- ❌ Many dependencies
- ❌ Manual decision entry
- ❌ No automatic summarization
- ❌ No cross-topic intelligence
- ❌ Requires MCP server process

---

## 6. Assessment for Claude Code

### 6.1 Token Efficiency Rating: ★★★★☆ (4/5)

**Strengths:**
- Hard 500-token limit per injection
- Smart truncation strategies
- Caching to avoid redundant embeddings
- Top-N selection reduces overhead
- Teaser format for hints (40 tokens)

**Weaknesses:**
- Hooks run on every prompt (2-3 executions)
- Cumulative overhead: ~1,500-3,000 tokens per session
- No automatic compaction
- Database grows unbounded

**Verdict:** Excellent token management with clear budgets, but cumulative overhead can add up in long sessions.

### 6.2 Simplicity Rating: ★★★☆☆ (3/5)

**Strengths:**
- Easy installation via plugin marketplace
- Automatic tier detection
- Graceful degradation
- Zero-config checkpointing
- Good documentation

**Weaknesses:**
- Complex codebase (~220KB, 17 core files)
- Many dependencies (better-sqlite3, transformers.js, sqlite-vec)
- Requires MCP server process
- Manual decision entry
- 500MB disk space requirement

**Verdict:** Simple to install and use, but complex under the hood. Not the simplest possible solution.

### 6.3 Local Storage Rating: ★★★★★ (5/5)

**Strengths:**
- 100% local (SQLite + model cache)
- No external API calls
- No cloud dependencies
- Privacy-preserving
- Shared across MCP clients

**Weaknesses:**
- No cloud sync option
- Manual backup required

**Verdict:** Perfect local-first implementation.

### 6.4 Claude Code Compatibility Rating: ★★★★★ (5/5)

**Strengths:**
- Native MCP server support
- Plugin marketplace installation
- Hooks and skills integration
- Tested in Claude Code environment
- File system access compatible

**Weaknesses:**
- Requires Node.js (available in Claude Code)
- Requires initial download (~550MB)

**Verdict:** Designed specifically for Claude Code, excellent compatibility.

### 6.5 Features Rating: ★★★★★ (5/5)

**Strengths:**
- Decision evolution tracking
- Semantic search
- Session continuity
- Multi-client support
- Outcome tracking
- Graph relationships
- Relevance scoring
- Transparency

**Weaknesses:**
- No automatic extraction
- No summarization
- No cross-topic intelligence

**Verdict:** Rich feature set focused on decision tracking and evolution.

### 6.6 Production Readiness Rating: ★★★★★ (5/5)

**Strengths:**
- 134 tests (100% pass)
- Comprehensive error handling
- Performance monitoring
- Graceful degradation
- Active development
- MIT license

**Weaknesses:**
- Relatively new project
- Unknown user base size

**Verdict:** Well-tested and production-ready.

---

## 7. Recommendations

### 7.1 Is MAMA Suitable for Claude Code?

**YES, with caveats.**

**Use MAMA if you:**
- ✅ Need decision evolution tracking
- ✅ Want semantic search across past decisions
- ✅ Value session continuity
- ✅ Can afford 500MB disk space
- ✅ Want a production-ready solution
- ✅ Don't mind manual decision entry

**Consider alternatives if you:**
- ❌ Want automatic memory extraction
- ❌ Need the simplest possible solution
- ❌ Want cross-topic intelligence
- ❌ Require automatic summarization
- ❌ Have very limited disk space
- ❌ Want cloud sync

### 7.2 Token Efficiency Assessment

**MAMA is token-efficient but not minimal:**
- 500-token budget is reasonable
- Hook overhead (1,500-3,000 tokens/session) is moderate
- No automatic compaction means growth over time
- For comparison, a minimal system might use 100-200 tokens/session

**Recommendation:** MAMA's token usage is acceptable for most use cases, but not the absolute minimum possible.

### 7.3 Simplicity Assessment

**MAMA is feature-rich, not simple:**
- Complex codebase (~220KB)
- Many dependencies
- MCP server process
- 500MB disk space

**For a truly simple system, consider:**
- Single-file implementation
- No dependencies
- In-memory or simple JSON storage
- No vector search (keyword only)
- Direct Claude Code integration (no MCP server)

**Recommendation:** MAMA trades simplicity for features. If you want maximum simplicity, build a custom minimal solution.

### 7.4 Alternative Approaches

**For Simpler Token-Efficient Memory:**

1. **Markdown File System:**
   - Store decisions in `.md` files
   - Use grep for search
   - No dependencies
   - Minimal token overhead
   - Manual organization

2. **JSON Session State:**
   - Store session summaries in JSON
   - Read on session start
   - No search capability
   - Ultra-simple
   - ~200 tokens per session

3. **SQLite without Embeddings:**
   - Use MAMA's database schema
   - Remove vector search
   - Keyword search only
   - Lighter weight
   - Less accurate

4. **Custom Minimal MCP Server:**
   - Build simplified MAMA
   - Remove decision evolution
   - Focus on session continuity only
   - ~5KB codebase
   - Fewer features

### 7.5 Adoption Strategy

**If adopting MAMA:**

1. **Start Small:**
   - Install and test with a few decisions
   - Measure actual token usage in your workflows
   - Evaluate feature value vs. complexity

2. **Configure Conservatively:**
   - Use default embedding model (multilingual-e5-small)
   - Disable hooks if overhead too high
   - Manual `/mama-suggest` calls instead

3. **Establish Patterns:**
   - Define topic naming conventions
   - Decide what decisions to save
   - Use checkpoints at session end

4. **Monitor:**
   - Check `/mama-configure --show` regularly
   - Review `~/.mama/config.json`
   - Monitor database size

5. **Iterate:**
   - Adjust hooks based on experience
   - Refine decision-saving patterns
   - Consider custom fork if needed

---

## 8. Conclusion

**MAMA is a well-designed, production-ready memory system for Claude with strong token efficiency, local-first architecture, and rich features for decision tracking.**

**Key Takeaways:**

1. **Architecture:** MCP server + plugin, SQLite + sqlite-vec, transformers.js embeddings
2. **Token Efficiency:** 500-token budget per injection, ~1,500-3,000 tokens per session
3. **Simplicity:** Easy to install, complex under the hood (~220KB codebase)
4. **Compatibility:** Excellent Claude Code support via MCP protocol
5. **Features:** Decision evolution, semantic search, session continuity, outcome tracking
6. **Limitations:** Manual entry, no auto-compaction, no cross-topic intelligence

**Final Verdict:**

MAMA is **excellent for decision tracking and session continuity**, but **not the simplest possible memory system**. If you need rich features like semantic search, decision evolution graphs, and multi-client support, MAMA is an excellent choice. If you want absolute minimal token overhead and simplest implementation, consider a custom solution.

**Rating: 4.3/5.0**
- Token Efficiency: 4/5
- Simplicity: 3/5
- Local Storage: 5/5
- Compatibility: 5/5
- Features: 5/5
- Production Ready: 5/5

**Recommendation:** **Adopt MAMA** if you value features and production readiness over absolute simplicity. **Build custom** if you need minimal implementation with <1,000 tokens per session overhead.

---

## Appendix A: Technical Specifications

**Repository:** https://github.com/jungjaehoon-lifegamez/MAMA
**License:** MIT
**Language:** JavaScript (100%)
**Runtime:** Node.js ≥18.0.0
**Package Manager:** pnpm

**Dependencies:**
- Production: @modelcontextprotocol/sdk, @huggingface/transformers, better-sqlite3, sqlite-vec, chalk
- Development: vitest, @types/better-sqlite3

**Database:**
- Engine: SQLite (better-sqlite3)
- Location: `~/.claude/mama-memory.db` (configurable)
- Vector Storage: sqlite-vec (384-dim embeddings)
- Schema: 3 tables + 1 virtual table

**Embedding Models:**
- Default: Xenova/multilingual-e5-small (384-dim)
- Alternative: Xenova/multilingual-e5-base (768-dim)
- Alternative: Xenova/all-MiniLM-L6-v2 (384-dim, English only)

**MCP Tools (7):**
1. save_decision
2. recall_decision
3. suggest_decision
4. list_decisions
5. update_outcome
6. save_checkpoint
7. load_checkpoint

**Hooks (3):**
1. UserPromptSubmit (75% threshold, 40-token teaser)
2. PreToolUse (70% threshold, 300-token budget)
3. PostToolUse (context tracking)

**Skills (1):**
1. mama-context (automatic background injection)

**Commands (7):**
1. /mama-save
2. /mama-recall
3. /mama-suggest
4. /mama-list
5. /mama-checkpoint
6. /mama-resume
7. /mama-configure

**Performance Targets:**
- Embedding generation: <30ms
- Vector search: <100ms
- Hook latency: <500ms (warning at 400ms)
- Overall timeout: 5 seconds

**Testing:**
- Total: 134 tests
- Unit: 62 tests
- Integration: 39 tests
- Regression: 33 tests
- Pass rate: 100%

---

## Appendix B: Code Examples

### Example 1: Save Decision
```bash
/mama-save auth_strategy "Use JWT with refresh tokens" "Provides better security than sessions and scales horizontally" --confidence=0.9 --type=user_decision
```

### Example 2: Recall Decision
```bash
/mama-recall auth_strategy
```

### Example 3: Semantic Search
```bash
/mama-suggest "How should I handle user authentication?"
```

### Example 4: List Recent Decisions
```bash
/mama-list --limit=20 --outcome=failure --since=7d
```

### Example 5: Checkpoint Session
```bash
/mama-checkpoint
```

### Example 6: Resume Session
```bash
/mama-resume
```

### Example 7: Configure
```bash
/mama-configure --show
/mama-configure --model=Xenova/multilingual-e5-base
```

---

## Appendix C: Relevance Scoring Formula

```javascript
// Weighted scoring formula
Relevance = (Recency × 0.2) + (Importance × 0.5) + (Semantic × 0.3)

// Recency component (exponential decay, 30-day half-life)
Recency = exp(-ln(2) * days_ago / 30)

// Importance component (outcome-based)
Importance = {
  FAILED: 1.0,      // Highest priority
  PARTIAL: 0.7,
  SUCCESS: 0.5,
  ONGOING: 0.3      // Lowest priority
}

// Semantic component (cosine similarity)
Semantic = cosine_similarity(decision_embedding, query_embedding)

// Final score
Score = 0.2 * Recency + 0.5 * Importance + 0.3 * Semantic

// Filter threshold
if (Score < 0.5) {
  // Decision not included in results
}

// Top-N selection
Results = top_N(scores, limit=3)
```

---

## Appendix D: Database Schema (SQL)

```sql
-- Decisions Table
CREATE TABLE decisions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic TEXT NOT NULL,
    decision TEXT NOT NULL,
    reasoning TEXT,
    confidence REAL DEFAULT 0.5,
    outcome TEXT,  -- pending/success/failure/partial/superseded
    failure_reason TEXT,
    limitation TEXT,
    supersedes INTEGER,
    superseded_by INTEGER,
    refined_from TEXT,  -- JSON array of parent IDs
    needs_validation BOOLEAN DEFAULT 0,
    validation_attempts INTEGER DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    usage_success INTEGER DEFAULT 0,
    usage_failure INTEGER DEFAULT 0,
    time_saved INTEGER DEFAULT 0,  -- Minutes saved
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_validated_at TIMESTAMP,
    FOREIGN KEY (supersedes) REFERENCES decisions(id),
    FOREIGN KEY (superseded_by) REFERENCES decisions(id)
);

-- Checkpoints Table
CREATE TABLE checkpoints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    summary TEXT NOT NULL,
    open_files TEXT,  -- JSON array
    next_steps TEXT,
    status TEXT DEFAULT 'active'  -- active/archived
);

-- Decision Edges Table
CREATE TABLE decision_edges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_id INTEGER NOT NULL,
    to_id INTEGER NOT NULL,
    relationship_type TEXT NOT NULL,  -- refines/contradicts
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_id) REFERENCES decisions(id),
    FOREIGN KEY (to_id) REFERENCES decisions(id)
);

-- Vector Embeddings (sqlite-vec virtual table)
CREATE VIRTUAL TABLE vec_decisions USING vec0(
    decision_id INTEGER PRIMARY KEY,
    embedding FLOAT[384]
);
```

---

## Appendix E: File Size Summary

**Total Codebase:** ~220KB

**MCP Server Core (packages/mcp-server/src/mama/):**
- mama-api.js: 30,545 bytes
- decision-formatter.js: 35,842 bytes
- decision-tracker.js: 21,462 bytes
- db-manager.js: 17,479 bytes
- ollama-client.js: 10,669 bytes
- hook-metrics.js: 11,460 bytes
- relevance-scorer.js: 10,210 bytes
- outcome-tracker.js: 9,123 bytes
- memory-inject.js: 7,962 bytes
- embeddings.js: 7,837 bytes
- query-intent.js: 7,276 bytes
- config-loader.js: 6,084 bytes
- embedding-cache.js: 4,797 bytes
- memory-store.js: 3,336 bytes
- transparency-banner.js: 8,310 bytes
- time-formatter.js: 2,481 bytes
- debug-logger.js: 1,924 bytes

**MCP Server Tools (packages/mcp-server/src/tools/):**
- update-outcome.js: 4,908 bytes
- save-decision.js: 4,150 bytes
- recall-decision.js: 2,742 bytes
- suggest-decision.js: 2,492 bytes
- list-decisions.js: 2,238 bytes
- checkpoint-tools.js: 2,150 bytes
- index.js: 1,619 bytes

**Tests:**
- hook-metrics.test.js: 21,100 bytes
- list-recall-tools.test.js: 16,228 bytes
- transparency-banner.test.js: 12,800 bytes
- config-loader.test.js: 8,400 bytes
- update-outcome.test.js: 6,192 bytes
- db-initialization.test.js: 5,000 bytes
- module-exports.test.js: 4,300 bytes

**Plugin Commands:**
- mama-configure.md: 4,567 bytes
- mama-list.md: 3,013 bytes
- mama-suggest.md: 2,755 bytes
- mama-save.md: 2,700 bytes
- mama-recall.md: 2,011 bytes
- mama-checkpoint.md: 1,797 bytes
- mama-resume.md: 1,573 bytes

---

*End of Analysis Report*

# Claude Memory Systems - Comprehensive Analysis

**Date:** 2025-11-22
**Branch:** claude/analyze-memory-systems-01SpgevcibvnLKLjfkbHJAQK

## Overview

This document analyzes memory and persistence systems for Claude and AI assistants, focusing on local storage, token efficiency, and simple setup. These systems complement or compete with claude-mem, MAMA, and claude-dementia.

---

## Category 1: MCP-Based Memory Servers

### 1. **claude-server** (davidteren/claude-server)

**URL:** https://github.com/davidteren/claude-server

**Description:**
MCP implementation providing sophisticated context management across sessions with hierarchical project contexts and continuous conversation threads.

**Key Features:**
- Persistent context across sessions
- Project-specific context organization
- Conversation continuity
- Storage structure at `~/.claude/` with contexts, projects, and context index
- Hierarchical organization

**Complexity:** Medium
**Token Efficiency:** Not specified, but uses structured context organization
**Storage:** Local filesystem (`~/.claude/`)
**Best For:** Multi-project workflows with need for organized context

---

### 2. **mcp-memory-keeper** (mkreyman/mcp-memory-keeper)

**URL:** https://github.com/mkreyman/mcp-memory-keeper

**Description:**
MCP server specifically designed to prevent context loss during conversation compaction in Claude Code.

**Key Features:**
- Persistent context management for Claude AI coding assistants
- Prevents context loss during compaction
- Preserves work history, decisions, and progress
- Storage in `~/mcp-data/memory-keeper/`

**Complexity:** Low-Medium
**Token Efficiency:** Not specified
**Storage:** Local filesystem
**Best For:** Claude Code users experiencing context loss issues

---

### 3. **claude-memory-mcp** (WhenMoon-afk/claude-memory-mcp)

**URL:** https://github.com/WhenMoon-afk/claude-memory-mcp

**Description:**
MCP server implementation providing persistent memory capabilities based on research into optimal LLM memory techniques.

**Key Features:**
- Works with Claude Desktop, Cursor, Windsurf, or any MCP client
- Research-based memory techniques
- MCP protocol integration

**Complexity:** Medium
**Token Efficiency:** Based on research-backed techniques
**Storage:** Local
**Best For:** Users wanting research-backed memory approaches

---

### 4. **Basic Memory** (basicmachines-co/basic-memory)

**URL:** https://github.com/basicmachines-co/basic-memory

**Description:**
Markdown-based persistent knowledge system with MCP integration for natural conversation-driven knowledge building.

**Key Features:**
- Simple Markdown files with frontmatter
- Local SQLite indexing
- MCP protocol support
- Human-readable storage format
- Entity titles, types, permalinks, and tags
- Natural language knowledge building

**Complexity:** Low
**Token Efficiency:** Good (Markdown is compact)
**Storage:** Local Markdown + SQLite index
**Best For:** Users wanting human-readable, portable knowledge base

---

### 5. **mcp-chromadb-memory** (stevenjjobson/mcp-chromadb-memory)

**URL:** https://github.com/stevenjjobson/mcp-chromadb-memory

**Description:**
Hybrid storage MCP server using PostgreSQL for structured data and ChromaDB for vector embeddings.

**Key Features:**
- PostgreSQL for metadata and structured queries
- ChromaDB for semantic search
- Hybrid storage approach
- MCP integration

**Complexity:** High (requires PostgreSQL + ChromaDB)
**Token Efficiency:** Good (semantic search reduces redundancy)
**Storage:** Local (PostgreSQL + ChromaDB)
**Best For:** Users needing both structured and semantic search

---

### 6. **mcp-memory-service** (doobidoo/mcp-memory-service)

**URL:** https://github.com/doobidoo/mcp-memory-service

**Description:**
Universal MCP memory service with semantic search, multi-client support, and autonomous consolidation for 13+ AI applications.

**Key Features:**
- Multi-client support (Claude Desktop, VS Code, etc.)
- Semantic search capabilities
- Autonomous memory consolidation
- SQLite-vec backend option
- Universal compatibility

**Complexity:** Medium
**Token Efficiency:** Good (autonomous consolidation)
**Storage:** Local (SQLite-vec or Cloudflare)
**Best For:** Users working across multiple AI applications

---

### 7. **memory-mcp-server** (okooo5km/memory-mcp-server)

**URL:** https://github.com/okooo5km/memory-mcp-server

**Description:**
MCP server providing knowledge graph management capabilities.

**Key Features:**
- Knowledge graph structure
- MCP protocol integration
- Graph-based memory organization

**Complexity:** Medium-High
**Token Efficiency:** Good (graph structure reduces redundancy)
**Storage:** Local
**Best For:** Users wanting graph-based knowledge representation

---

## Category 2: ChromaDB Vector Memory Systems

### 8. **claude-mem** (thedotmack/claude-mem)

**URL:** https://github.com/thedotmack/claude-mem

**Description:**
Claude Code plugin that automatically captures sessions, compresses with AI, and injects context into future sessions.

**Key Features:**
- ChromaDB vector database
- Hybrid semantic + keyword search
- One-line install: `/plugin marketplace add thedotmack/claude-mem`
- Automatic session capture and compression
- Natural language search via mem-search skill
- AI-powered compression using Claude's agent-sdk

**Complexity:** Low (plugin-based install)
**Token Efficiency:** High (AI compression + semantic search)
**Storage:** Local ChromaDB
**Best For:** Claude Code users wanting minimal setup

---

### 9. **claude-code-vector-memory** (christian-byrne/claude-code-vector-memory)

**URL:** https://github.com/christian-byrne/claude-code-vector-memory

**Description:**
Persistent memory across conversations by indexing and searching session summaries with ChromaDB.

**Key Features:**
- ChromaDB backend with fast vector similarity search
- Hybrid scoring: semantic similarity (70%), recency (20%), complexity (10%)
- Cross-platform setup scripts (Linux/macOS/Windows)
- Session summary indexing
- Persistent storage

**Complexity:** Low-Medium
**Token Efficiency:** High (weighted hybrid scoring)
**Storage:** Local ChromaDB
**Best For:** Users wanting sophisticated relevance scoring

---

### 10. **mcp-memory-toolkit** (syyunn/mcp-memory-toolkit)

**URL:** https://github.com/syyunn/mcp-memory-toolkit

**Description:**
MCP server providing persistent memory using ChromaDB for semantic search and storage.

**Key Features:**
- ChromaDB for semantic search
- Local Python package installation
- Docker container deployment option
- MCP protocol integration

**Complexity:** Medium
**Token Efficiency:** Good (semantic search)
**Storage:** Local ChromaDB
**Best For:** Users comfortable with Python/Docker

---

## Category 3: Universal Memory Engines

### 11. **mem0** (mem0ai/mem0)

**URL:** https://github.com/mem0ai/mem0

**Description:**
Universal memory layer for AI agents with intelligent personalization and learning capabilities.

**Key Features:**
- 90% lower token usage than full-context
- Personalized AI interactions
- Remembers user preferences
- Adapts to individual needs
- Continuous learning over time
- Multi-platform support

**Complexity:** Medium
**Token Efficiency:** Excellent (90% reduction)
**Storage:** Various backends supported
**Best For:** Production applications requiring maximum token efficiency

---

### 12. **Memori** (GibsonAI/Memori)

**URL:** https://github.com/GibsonAI/memori

**Description:**
Open-source memory engine enabling any LLM to remember with one line of code.

**Key Features:**
- One-line code integration
- Standard SQL databases (SQLite, PostgreSQL, MySQL)
- User owns and controls all data
- Intercepts LLM calls and injects context
- Works with any LLM

**Complexity:** Low
**Token Efficiency:** Good (context injection)
**Storage:** Local SQL databases
**Best For:** Developers wanting simple SQL-based memory

---

### 13. **OpenMemory** (CaviraOSS/OpenMemory)

**URL:** https://github.com/CaviraOSS/OpenMemory

**Description:**
Long-term memory for any AI using cognitive architecture approach rather than vector databases.

**Key Features:**
- Cognitive architecture (semantic, episodic, procedural, emotional, reflective)
- Tracks importance over time
- Builds associations between memories
- Self-hosted, open, framework-free
- Minutes to set up

**Complexity:** Low
**Token Efficiency:** Good (intelligent memory organization)
**Storage:** Local
**Best For:** Users wanting human-like memory organization

---

### 14. **Letta** (letta-ai/letta)

**URL:** https://github.com/letta-ai/letta

**Description:**
Platform for building stateful agents with advanced memory that can learn and self-improve.

**Key Features:**
- Stateful agent architecture
- Self-improving memory
- Advanced learning capabilities
- Platform for building agents

**Complexity:** High
**Token Efficiency:** Good (stateful design reduces redundancy)
**Storage:** Local
**Best For:** Building production-grade AI agents

---

## Category 4: Specialized AI Assistant Memory

### 15. **Aetherius_AI_Assistant** (libraryofcelsus/Aetherius_AI_Assistant)

**URL:** https://github.com/libraryofcelsus/Aetherius_AI_Assistant

**Description:**
Completely private, locally-operated AI assistant with realistic long-term memory using Qdrant vector DB.

**Key Features:**
- 100% private and local
- Qdrant vector database
- Realistic long-term memory
- Thought formation capabilities
- Open Source LLM support
- Sub-agent framework

**Complexity:** High
**Token Efficiency:** Good (vector search)
**Storage:** Local (Qdrant)
**Best For:** Privacy-focused users with technical expertise

---

### 16. **persistent-ai-memory** (savantskie/persistent-ai-memory)

**URL:** https://github.com/savantskie/persistent-ai-memory

**Description:**
Persistent local memory system for AI assistants with searchable storage and conversation tracking.

**Key Features:**
- Searchable storage
- Conversation tracking
- MCP tool call logging
- Intelligent scheduling
- Local storage

**Complexity:** Low-Medium
**Token Efficiency:** Good
**Storage:** Local
**Best For:** VS Code users wanting persistent memory

---

## Category 5: Claude Code Specific Solutions

### 17. **claude-code-memory-bank** (hudrazine/claude-code-memory-bank)

**URL:** https://github.com/hudrazine/claude-code-memory-bank

**Description:**
Experimental adaptation of Cline Memory Bank methodology, specifically optimized for Claude Code.

**Key Features:**
- Based on Cline Memory Bank methodology
- Optimized for Claude Code
- Systematic approach to maintaining project context
- Across-session context preservation

**Complexity:** Medium
**Token Efficiency:** Good
**Storage:** Local
**Best For:** Claude Code users familiar with Cline Memory Bank

---

### 18. **claude-memory-extractor** (obra/claude-memory-extractor)

**URL:** https://github.com/obra/claude-memory-extractor

**Description:**
Multi-dimensional memory extraction system that learns from conversation history to improve future interactions.

**Key Features:**
- Learns from conversation history
- Extracts technical lessons
- Working style preferences
- Debugging methodologies
- Systematic extraction approach
- Future interaction improvement

**Complexity:** Medium
**Token Efficiency:** Excellent (learns and improves)
**Storage:** Local
**Best For:** Users wanting AI that learns their preferences

---

### 19. **my-claude-code-setup** (centminmod/my-claude-code-setup)

**URL:** https://github.com/centminmod/my-claude-code-setup

**Description:**
Shared starter template with CLAUDE.md memory bank system for Claude Code.

**Key Features:**
- Starter template configuration
- CLAUDE.md memory bank system
- Shared configuration approach
- Template-based setup

**Complexity:** Low
**Token Efficiency:** Good (structured templates)
**Storage:** Local (CLAUDE.md files)
**Best For:** Users wanting structured template-based memory

---

### 20. **claunch** (0xkaz/claunch)

**URL:** https://github.com/0xkaz/claunch

**Description:**
Project-based Claude CLI session manager with automatic tmux setup and persistence.

**Key Features:**
- Project-based session management
- Automatic tmux setup
- Session persistence
- CLI integration
- Multi-project support

**Complexity:** Low-Medium
**Token Efficiency:** N/A (session manager, not memory system)
**Storage:** Local (tmux sessions)
**Best For:** CLI users managing multiple projects

---

## Category 6: Code Search & Context Management

### 21. **claude-context** (zilliztech/claude-context)

**URL:** https://github.com/zilliztech/claude-context

**Description:**
Code search MCP making entire codebase context available through vector database indexing.

**Key Features:**
- Vector database storage for codebase
- 40% token reduction with equivalent retrieval quality
- Embedding providers: OpenAI, VoyageAI, Ollama, Gemini
- Vector DBs: Milvus or Zilliz Cloud
- Efficient code search
- Only loads relevant code into context

**Complexity:** Medium
**Token Efficiency:** Excellent (40% reduction)
**Storage:** Local (Milvus) or Cloud (Zilliz)
**Best For:** Large codebases requiring efficient search

---

## Category 7: Advanced Research-Based Systems

### 22. **MemoryLLM** (wangyu-ustc/MemoryLLM)

**URL:** https://github.com/wangyu-ustc/MemoryLLM

**Description:**
Official implementation of ICML 2024 paper on self-updatable LLMs with scalable long-term memory.

**Key Features:**
- ICML 2024 research implementation
- Self-updatable LLM architecture
- Scalable long-term memory (M+ extension)
- Research-backed approach

**Complexity:** High
**Token Efficiency:** Research-optimized
**Storage:** Depends on implementation
**Best For:** Researchers and advanced users

---

### 23. **ement-llm-memory** (christine-sun/ement-llm-memory)

**URL:** https://github.com/christine-sun/ement-llm-memory

**Description:**
EMENT optimized memory module with statistically significant performance improvements using embedding and entity extraction.

**Key Features:**
- EMENT memory module
- Embedding module
- Entity extraction
- Statistically significant performance gains
- Research-backed optimization

**Complexity:** High
**Token Efficiency:** Research-optimized
**Storage:** Depends on implementation
**Best For:** Advanced users wanting cutting-edge research

---

### 24. **LLM-Extended-Memory** (tang-ji/LLM-Extended-Memory)

**URL:** https://github.com/tang-ji/LLM-Extended-Memory

**Description:**
Framework for extending memory capabilities through efficient encoding, external storage, indexing, recall, and decoding.

**Key Features:**
- Efficient encoding mechanisms
- External storage
- Advanced indexing
- Recall optimization
- Decoding mechanisms
- Framework approach for GPT-4 and similar models

**Complexity:** High
**Token Efficiency:** Framework-dependent
**Storage:** External storage supported
**Best For:** Building custom memory solutions

---

## Category 8: Git-Based & Markdown Systems

### 25. **DiffMem** (Growth-Kinetics/DiffMem)

**URL:** https://github.com/Growth-Kinetics/DiffMem

**Description:**
Lightweight git-based memory backend using Markdown files with BM25 indexing.

**Key Features:**
- Markdown files for human-readable storage
- Git for temporal evolution tracking
- In-memory BM25 index for fast retrieval
- Differential tracking
- Explainable retrieval
- Lightweight design

**Complexity:** Low
**Token Efficiency:** Good (BM25 + Markdown)
**Storage:** Local Git repository
**Best For:** Users wanting version-controlled memory

---

### 26. **Memory Bank MCP Server** (movibe/memory-bank)

**URL:** https://www.pulsemcp.com/servers/movibe-memory-bank

**Description:**
Maintains persistent project context through structured Memory Bank of five markdown files.

**Key Features:**
- Five structured markdown files
- Tracks goals, status, progress, decisions, patterns
- Automatic timestamp tracking
- MCP integration
- Structured approach

**Complexity:** Low
**Token Efficiency:** Good (structured markdown)
**Storage:** Local Markdown files
**Best For:** Users wanting structured project memory

---

## Category 9: Compression & Optimization

### 27. **LLMLingua** (microsoft/LLMLingua)

**URL:** https://github.com/microsoft/LLMLingua

**Description:**
Microsoft research project achieving up to 20x compression with minimal performance loss (EMNLP'23, ACL'24).

**Key Features:**
- Up to 20x compression
- Minimal performance loss
- Prompt compression
- KV-Cache compression
- Speeds up LLM inference
- Enhances key information perception

**Complexity:** High
**Token Efficiency:** Excellent (20x compression)
**Storage:** N/A (compression technique)
**Best For:** Production systems requiring maximum efficiency

---

## Category 10: Multi-Platform & Specialized

### 28. **Claude-CursorMemoryMCP** (Angleito/Claude-CursorMemoryMCP)

**URL:** https://github.com/Angleito/Claude-CursorMemoryMCP

**Description:**
Vector memory database specifically for Cursor and Claude Code.

**Key Features:**
- Dual support: Cursor and Claude Code
- Vector database
- MCP integration
- Cross-platform memory

**Complexity:** Medium
**Token Efficiency:** Good (vector search)
**Storage:** Local vector DB
**Best For:** Users working with both Cursor and Claude Code

---

### 29. **claude-memory** (Dev-Khant/claude-memory)

**URL:** https://github.com/Dev-Khant/claude-memory

**Description:**
Long-term memory system specifically for Claude.

**Key Features:**
- Claude-specific design
- Long-term memory capabilities
- Simple integration

**Complexity:** Low-Medium
**Token Efficiency:** Not specified
**Storage:** Local
**Best For:** Claude users wanting simple memory solution

---

## Comparison Matrix

| System | Complexity | Token Efficiency | Storage Type | Best For |
|--------|-----------|------------------|--------------|----------|
| claude-mem | Low | High | ChromaDB | Quick setup |
| mem0 | Medium | Excellent (90%) | Various | Production |
| Basic Memory | Low | Good | Markdown+SQLite | Human-readable |
| Memori | Low | Good | SQL | Simple SQL |
| OpenMemory | Low | Good | Local | Cognitive architecture |
| claude-context | Medium | Excellent (40%) | Vector DB | Large codebases |
| LLMLingua | High | Excellent (20x) | N/A | Research/Production |
| DiffMem | Low | Good | Git+Markdown | Version control |
| mcp-memory-keeper | Low-Medium | Not specified | Local | Context loss prevention |
| Aetherius | High | Good | Qdrant | Privacy-focused |

---

## Recommendations by Use Case

### For Claude Code Users (Simplest Setup)
1. **claude-mem** - Plugin-based, one-line install
2. **mcp-memory-keeper** - Prevents context loss
3. **my-claude-code-setup** - Template-based approach

### For Maximum Token Efficiency
1. **mem0** - 90% token reduction
2. **claude-context** - 40% reduction for code
3. **LLMLingua** - 20x compression

### For Human-Readable Storage
1. **Basic Memory** - Markdown with frontmatter
2. **DiffMem** - Git + Markdown with versioning
3. **Memory Bank MCP** - Structured markdown files

### For Privacy & Local Control
1. **Aetherius_AI_Assistant** - 100% local, private
2. **OpenMemory** - Self-hosted, framework-free
3. **Basic Memory** - Local markdown files

### For Large Codebases
1. **claude-context** - Efficient code search
2. **claude-code-vector-memory** - Session summaries
3. **mcp-chromadb-memory** - Hybrid storage

### For Research/Advanced Users
1. **MemoryLLM** - ICML 2024 research
2. **ement-llm-memory** - EMENT module
3. **Letta** - Self-improving agents

---

## Token Efficiency Summary

**Highest Efficiency:**
- **mem0:** 90% reduction
- **claude-context:** 40% reduction
- **LLMLingua:** 20x compression

**Good Efficiency:**
- Most ChromaDB-based systems (semantic search)
- Markdown-based systems (compact format)
- Hybrid scoring systems (intelligent retrieval)

**Research-Backed:**
- LLMLingua (Microsoft, EMNLP'23, ACL'24)
- MemoryLLM (ICML 2024)
- ement-llm-memory (embedding + entity extraction)

---

## Setup Complexity Ranking

**Low Complexity (Quick Start):**
1. claude-mem (plugin install)
2. Basic Memory (MCP + markdown)
3. DiffMem (git + markdown)
4. Memori (one-line code)
5. OpenMemory (minutes to setup)

**Medium Complexity:**
1. mem0 (configuration required)
2. mcp-memory-keeper (MCP setup)
3. claude-code-vector-memory (cross-platform scripts)
4. claude-context (vector DB setup)

**High Complexity:**
1. Aetherius (full stack setup)
2. Letta (platform deployment)
3. mcp-chromadb-memory (PostgreSQL + ChromaDB)
4. MemoryLLM (research implementation)

---

## Active Development Status

**Recent/Active (2024-2025):**
- claude-mem
- mem0
- OpenMemory
- Basic Memory
- claude-context
- mcp-memory-keeper
- DiffMem
- LLMLingua
- MemoryLLM

**Check Repository Activity:**
Most systems above have recent commits in 2024-2025 based on search results.

---

## Sources

### Memory Systems Discovery
- [claude-mem Resource](https://github.com/hesreallyhim/awesome-claude-code/issues/167)
- [claude-flow Memory System](https://github.com/ruvnet/claude-flow/wiki/Memory-System)
- [claude-memory-extractor](https://github.com/obra/claude-memory-extractor)
- [my-claude-code-setup](https://github.com/centminmod/my-claude-code-setup)
- [claude-memory-mcp](https://github.com/WhenMoon-afk/claude-memory-mcp)
- [Basic Memory](https://github.com/basicmachines-co/basic-memory)
- [claude-code-memory-bank](https://github.com/hudrazine/claude-code-memory-bank)
- [claude-memory (Dev-Khant)](https://github.com/Dev-Khant/claude-memory)

### Session Persistence
- [claude-flow session persistence](https://github.com/ruvnet/claude-flow/wiki/session-persistence)
- [claunch](https://github.com/0xkaz/claunch)
- [Session Management Issues](https://github.com/anthropics/claude-code/issues/1741)

### AI Assistant Memory
- [persistent-ai-memory](https://github.com/savantskie/persistent-ai-memory)
- [Memori](https://github.com/GibsonAI/Memori)
- [mem0](https://github.com/mem0ai/mem0)
- [Aetherius_AI_Assistant](https://github.com/libraryofcelsus/Aetherius_AI_Assistant)
- [Letta](https://github.com/letta-ai/letta)
- [OpenMemory](https://github.com/CaviraOSS/OpenMemory)

### LLM Memory Systems
- [ement-llm-memory](https://github.com/christine-sun/ement-llm-memory)
- [LLM-Extended-Memory](https://github.com/tang-ji/LLM-Extended-Memory)
- [MemoryLLM](https://github.com/wangyu-ustc/MemoryLLM)

### MCP Context Management
- [claude-server](https://github.com/davidteren/claude-server)
- [claude-context](https://github.com/zilliztech/claude-context)
- [mcp-memory-keeper](https://github.com/mkreyman/mcp-memory-keeper)

### ChromaDB Vector Memory
- [claude-mem](https://github.com/thedotmack/claude-mem)
- [claude-code-vector-memory](https://github.com/christian-byrne/claude-code-vector-memory)
- [mcp-memory-toolkit (syyunn)](https://github.com/syyunn/mcp-memory-toolkit)
- [mcp-chromadb-memory](https://github.com/stevenjjobson/mcp-chromadb-memory)
- [Claude-CursorMemoryMCP](https://github.com/Angleito/Claude-CursorMemoryMCP)

### Conversation Compression
- [LLMLingua](https://github.com/microsoft/LLMLingua)
- [Awesome-LLM-Compression](https://github.com/HuangOwen/Awesome-LLM-Compression)
- [Awesome-LLM-Long-Context-Modeling](https://github.com/Xnhyacinth/Awesome-LLM-Long-Context-Modeling)
- [Mem0 Chat History Summarization](https://mem0.ai/blog/llm-chat-history-summarization-guide-2025)

### Markdown & Git-Based
- [Basic Memory MCP Server](https://www.pulsemcp.com/servers/basicmachines-memory)
- [Memory Bank MCP Server](https://www.pulsemcp.com/servers/movibe-memory-bank)
- [DiffMem](https://github.com/Growth-Kinetics/DiffMem)
- [mcp-memory-service](https://github.com/doobidoo/mcp-memory-service)
- [memory-mcp-server (knowledge graph)](https://github.com/okooo5km/memory-mcp-server)

### Vector Databases
- [Qdrant Documentation](https://qdrant.tech/)
- [Qdrant GitHub](https://github.com/qdrant/qdrant)

---

## Conclusion

This analysis identified **29 distinct memory systems** for Claude and AI assistants. The landscape is diverse, ranging from simple one-line installations to complex research implementations.

**Key Findings:**

1. **Token Efficiency Leaders:** mem0 (90%), claude-context (40%), LLMLingua (20x)
2. **Simplest Setup:** claude-mem, Basic Memory, DiffMem
3. **Most Versatile:** mem0, Memori, OpenMemory
4. **Best for Privacy:** Aetherius, OpenMemory, Basic Memory
5. **Best for Code:** claude-context, claude-code-vector-memory

**Recommendation for Claude Code:**

For most users, **claude-mem** offers the best balance of simplicity (one-line install), token efficiency (AI compression + semantic search), and functionality (automatic capture + natural language search).

For users wanting more control or different approaches, **Basic Memory** (markdown), **mem0** (maximum efficiency), or **mcp-memory-keeper** (context loss prevention) are excellent alternatives.

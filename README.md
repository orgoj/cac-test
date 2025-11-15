# Claude Code Documentation

Comprehensive documentation for [Claude Code](https://claude.ai/code) - Anthropic's official AI-powered coding assistant.

## About Claude Code

Claude Code is an interactive CLI tool powered by Claude Sonnet 4.5 that helps with software engineering tasks including:
- Code development and refactoring
- Bug fixing and debugging
- Repository analysis
- Testing and documentation
- Git operations

## Documentation Index

### Core Documentation

- **[CLAUDE_CONFIGURATION.md](CLAUDE_CONFIGURATION.md)** - Complete overview of Claude Code capabilities, tools, and operational instructions
- **[CONFIGURATION.md](CONFIGURATION.md)** - Configuration system, directory structure, hooks, and skills
- **[SUBAGENT_MODEL_SELECTION.md](SUBAGENT_MODEL_SELECTION.md)** - Guide to dynamic model selection for subagents (Haiku/Sonnet/Opus)

### System Environment

- **[SYSTEM_ENVIRONMENT.md](SYSTEM_ENVIRONMENT.md)** - Detailed system overview, resources, and capabilities
- **[system-info.md](system-info.md)** - Auto-generated system information (run `./analyze-system.sh` to update)
- **[installed-packages.md](installed-packages.md)** - Complete list of 675+ installed system packages
- **[mise-package-manager.md](mise-package-manager.md)** - User-space package manager documentation

### Automation Scripts

- **[analyze-system.sh](analyze-system.sh)** - Automated system analysis script
- **[claude-info.sh](claude-info.sh)** - Claude environment information collector

## Quick Start

### Environment Overview

**Platform:** Ubuntu 24.04.3 LTS (Cloud/KVM)
**Resources:** 16 CPU cores, 13 GB RAM, 30 GB disk
**Location:** Google Cloud (104.155.178.59)

### Available Development Tools

- **Languages:** Python 3.11, Node.js 22, Java 21, Go 1.24, Ruby 3.3, PHP 8.4, Rust 1.91
- **Build Tools:** GCC 13.3, CMake 3.28, Make 4.3, Maven, Gradle
- **Version Control:** Git 2.43
- **Package Managers:** npm, pip, cargo, mise

### Key Features

**Available:**
- Full development toolchain for multiple languages
- Git operations with full repository access
- Network access via proxy
- File system read/write operations
- Process execution

**Limited:**
- Package installation via apt (permission restrictions)
- Network diagnostic tools
- System configuration changes

## Getting Help

- **Documentation Issues:** [github.com/anthropics/claude-code/issues](https://github.com/anthropics/claude-code/issues)
- **Official Docs:** [docs.claude.com/en/docs/claude-code/](https://docs.claude.com/en/docs/claude-code/)
- **Help Command:** Type `/help` in Claude Code

## Use Cases

This environment is optimized for:
- Multi-language development projects
- Building and compiling software
- Web development with modern frameworks
- DevOps scripting and automation
- Data processing and analysis
- Git-based workflows
- Testing and CI/CD preparation

## System Analysis

To generate fresh system information:

```bash
./analyze-system.sh
```

This updates `system-info.md` with current system state, resource usage, and timestamps.

## Environment Variables

Key environment indicators:
```bash
CLAUDECODE=1
CLAUDE_CODE_REMOTE=true
CLAUDE_CODE_VERSION=2.0.34
CLAUDE_CODE_REMOTE_ENVIRONMENT_TYPE=cloud_default
```

---

**Last Updated:** 2025-11-15
**Environment:** Claude Code Remote Cloud (Sandboxed)
**Model:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

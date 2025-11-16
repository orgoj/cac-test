# Claude Code Configuration Documentation

## Overview

This document describes the configuration and structure of Claude Code directories discovered in the system. Claude Code uses two primary configuration locations:

1. **Local configuration**: `.claude/` directory in the project root
2. **Global configuration**: `$HOME/.claude/` directory

## Configuration Locations

### Local Configuration (.claude/)

**Status**: Not found in current project

The local `.claude/` directory is used for project-specific configuration and can contain:
- Commands
- Hooks
- Skills
- Agents
- Settings

### Global Configuration ($HOME/.claude/)

**Location**: `/root/.claude/`

This directory contains user-wide Claude Code configuration and runtime data.

## Directory Structure

```
$HOME/.claude/
├── settings.json                 # Global settings and configuration
├── stop-hook-git-check.sh       # Git check hook script
├── projects/                     # Project-specific data
│   └── -home-user-cac-test/     # Current project data
│       ├── 72e3abd7-fdf5-4b11-9500-532d5acbd952.jsonl
│       ├── agent-dc900042.jsonl
│       └── agent-e43ec1a0.jsonl
├── session-env/                  # Session environment variables
│   └── 72e3abd7-fdf5-4b11-9500-532d5acbd952/
├── skills/                       # Available skills
│   └── session-start-hook/
│       └── SKILL.md
├── shell-snapshots/              # Bash session snapshots
│   └── snapshot-bash-*.sh
├── statsig/                      # Telemetry and statistics
│   ├── statsig.cached.evaluations.*
│   ├── statsig.last_modified_time.evaluations
│   ├── statsig.session_id.*
│   └── statsig.stable_id.*
└── todos/                        # Todo lists from sessions
    ├── 0f6bf9aa-d622-4ca7-90a7-9201f2327dd8-agent-*.json
    └── 72e3abd7-fdf5-4b11-9500-532d5acbd952-agent-*.json
```

## Configuration Files

### settings.json

**Location**: `$HOME/.claude/settings.json`

Global Claude Code settings including hooks configuration and permissions.

```json
{
    "$schema": "https://json.schemastore.org/claude-code-settings.json",
    "hooks": {
        "Stop": [
            {
                "matcher": "",
                "hooks": [
                    {
                        "type": "command",
                        "command": "~/.claude/stop-hook-git-check.sh"
                    }
                ]
            }
        ]
    },
    "permissions": {
        "allow": ["Skill"]
    }
}
```

**Configuration Details**:

- **$schema**: Points to JSON schema for validation
- **hooks.Stop**: Hooks that execute when stopping/exiting a session
  - Uses `stop-hook-git-check.sh` to ensure all changes are committed and pushed
- **permissions.allow**: List of tools that don't require user approval
  - Currently allows `Skill` tool to be used without confirmation

## Hooks

### Stop Hook: Git Check Script

**Location**: `$HOME/.claude/stop-hook-git-check.sh`

**Purpose**: Ensures all git changes are committed and pushed before stopping a session.

**Features**:
- Prevents recursion (checks `stop_hook_active` flag)
- Validates git repository presence
- Checks for uncommitted changes (staged and unstaged)
- Checks for untracked files
- Verifies all commits are pushed to remote
- Exit codes:
  - `0`: Success (no issues found)
  - `2`: Warning/error (uncommitted or unpushed changes)

**Input**: Receives JSON via stdin with session information

**Key Validations**:
1. Uncommitted changes check (`git diff`)
2. Untracked files check (`git ls-files --others`)
3. Unpushed commits check (`git rev-list`)

### Hook Types Supported

Based on the configuration and skill documentation, Claude Code supports these hook types:

1. **SessionStart**: Runs when a new session starts
   - Can install dependencies
   - Can set up environment variables
   - Supports async mode with timeout

2. **Stop**: Runs when stopping/exiting a session
   - Currently configured with git check validation

## Skills

Claude Code has access to project-specific skills that provide specialized capabilities and domain knowledge. In this environment, the following skills are available:

### Available Project Skills

#### 1. session-start-hook

**Location**: `$HOME/.claude/skills/session-start-hook/SKILL.md`

**Type**: User skill

**Name**: `startup-hook-skill`

**Description**: Creating and developing startup hooks for Claude Code on the web. Used when setting up a repository to ensure tests and linters work during web sessions.

**Key Features**:

#### Hook Input Format
```json
{
  "session_id": "abc123",
  "source": "startup|resume|clear|compact",
  "transcript_path": "/path/to/transcript.jsonl",
  "permission_mode": "default",
  "hook_event_name": "SessionStart",
  "cwd": "/workspace/repo"
}
```

#### Environment Variables
- `$CLAUDE_PROJECT_DIR`: Repository root path
- `$CLAUDE_ENV_FILE`: Path to write environment variables
- `$CLAUDE_CODE_REMOTE`: Indicates if running in remote environment

#### Async Mode Support
Hooks can run asynchronously to reduce session startup latency:
```bash
echo '{"async": true, "asyncTimeout": 300000}'
```

**Trade-offs**:
- **Synchronous**: Guarantees dependencies are ready, but delays session start
- **Asynchronous**: Faster session start, but potential race conditions

#### Supported Package Managers
The skill documentation mentions support for:
- npm (package.json)
- pip/Poetry (pyproject.toml, requirements.txt)
- cargo (Cargo.toml)
- go (go.mod)
- bundler (Gemfile)

#### Workflow
1. Analyze dependencies
2. Design hook script
3. Create hook file in `.claude/hooks/`
4. Register in `.claude/settings.json`
5. Validate hook execution
6. Validate linter functionality
7. Validate test execution
8. Commit and push

#### 2. flutter-development

**Location**: `.claude/skills/flutter-development/SKILL.md`

**Type**: Managed skill

**Name**: `flutter-development`

**Description**: Build cross-platform mobile apps with Flutter and Dart. Use when creating mobile applications, working with Flutter projects, designing UIs with widgets, implementing state management (Provider/BLoC), handling navigation, or when user mentions Flutter, Dart, mobile app development, iOS/Android apps, or Material Design.

**Use Cases**:
- Creating new Flutter mobile applications
- Designing UIs with Flutter widgets
- Implementing state management patterns (Provider, BLoC)
- Handling navigation between screens
- Working with Material Design components
- Cross-platform iOS/Android development

**When to Use**:
- User mentions Flutter, Dart, or mobile app development
- Building iOS or Android applications
- Working with Material Design or Cupertino widgets
- Implementing mobile app features and functionality

## Runtime Data

### Projects Directory

**Location**: `$HOME/.claude/projects/`

Stores session data for different projects. Each project gets a subdirectory named after its path (with slashes replaced by hyphens).

**Current Project**: `-home-user-cac-test/`

Contains JSONL files for:
- Session transcripts
- Agent execution logs

### Session Environment

**Location**: `$HOME/.claude/session-env/`

Stores environment-specific data for each session, identified by session ID.

### Shell Snapshots

**Location**: `$HOME/.claude/shell-snapshots/`

Contains bash session snapshots that can be used to restore shell state.

### Todos

**Location**: `$HOME/.claude/todos/`

Stores todo lists from different sessions and agents in JSON format.

### Statsig

**Location**: `$HOME/.claude/statsig/`

Contains telemetry and statistics data:
- Cached evaluations
- Session IDs
- Stable IDs
- Last modification times

## Configuration Best Practices

### Project-Specific Configuration

For project-specific settings, create `.claude/` directory in project root:

```bash
mkdir -p .claude/hooks
mkdir -p .claude/commands
```

### Settings Structure

`.claude/settings.json` can include:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "SessionStart": [...],
    "Stop": [...]
  },
  "permissions": {
    "allow": ["Tool1", "Tool2"]
  }
}
```

### Hook Script Template

```bash
#!/bin/bash
set -euo pipefail

# Read input
input=$(cat)

# Optional: Enable async mode
# echo '{"async": true, "asyncTimeout": 300000}'

# Your hook logic here

exit 0
```

## Security Considerations

1. **Hook Scripts**: All hook scripts should:
   - Use `set -euo pipefail` for safety
   - Be idempotent (safe to run multiple times)
   - Not require user interaction
   - Validate inputs properly

2. **Permissions**: The `permissions.allow` setting controls which tools can run without user confirmation

3. **Git Check Hook**: Prevents data loss by ensuring all work is committed and pushed before session ends

## Summary

Claude Code uses a well-structured configuration system with:
- **Global settings** for user-wide preferences
- **Project-specific settings** for repository configuration
- **Hooks** for automation at session lifecycle events
- **Skills** for specialized workflows
- **Runtime data** for session management and persistence

The discovered configuration shows:
- Active Stop hook for git validation
- Session-start-hook skill available
- Permission granted for Skill tool auto-execution
- Session data tracking and management

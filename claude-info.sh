#!/bin/bash

# Script to extract information from Claude Code directories
# Checks both local .claude and $HOME/.claude directories

echo "======================================"
echo "Claude Code Configuration Information"
echo "======================================"
echo ""

# Function to safely display file content
safe_cat() {
    if [ -f "$1" ]; then
        echo "Content of $1:"
        cat "$1"
        echo ""
    else
        echo "File not found: $1"
        echo ""
    fi
}

# Function to safely list directory
safe_ls() {
    if [ -d "$1" ]; then
        echo "Directory listing of $1:"
        ls -lah "$1"
        echo ""
    else
        echo "Directory not found: $1"
        echo ""
    fi
}

# Function to display directory tree
safe_tree() {
    if [ -d "$1" ]; then
        echo "Tree structure of $1:"
        find "$1" -type f -o -type d 2>/dev/null | sort
        echo ""
    fi
}

echo "========================================"
echo "1. LOCAL .claude DIRECTORY"
echo "========================================"
echo ""

LOCAL_CLAUDE=".claude"
if [ -d "$LOCAL_CLAUDE" ]; then
    echo "Local .claude directory exists"
    safe_tree "$LOCAL_CLAUDE"
    safe_ls "$LOCAL_CLAUDE"

    # Check for commands
    if [ -d "$LOCAL_CLAUDE/commands" ]; then
        echo "=== Commands ==="
        safe_ls "$LOCAL_CLAUDE/commands"
        for cmd in "$LOCAL_CLAUDE/commands"/*; do
            if [ -f "$cmd" ]; then
                safe_cat "$cmd"
            fi
        done
    fi

    # Check for hooks
    if [ -d "$LOCAL_CLAUDE/hooks" ]; then
        echo "=== Hooks ==="
        safe_ls "$LOCAL_CLAUDE/hooks"
        for hook in "$LOCAL_CLAUDE/hooks"/*; do
            if [ -f "$hook" ]; then
                safe_cat "$hook"
            fi
        done
    fi

    # Check for skills
    if [ -d "$LOCAL_CLAUDE/skills" ]; then
        echo "=== Skills ==="
        safe_ls "$LOCAL_CLAUDE/skills"
        for skill in "$LOCAL_CLAUDE/skills"/*; do
            if [ -f "$skill" ]; then
                safe_cat "$skill"
            fi
        done
    fi

    # Check for agents
    if [ -d "$LOCAL_CLAUDE/agents" ]; then
        echo "=== Agents ==="
        safe_ls "$LOCAL_CLAUDE/agents"
        for agent in "$LOCAL_CLAUDE/agents"/*; do
            if [ -f "$agent" ]; then
                safe_cat "$agent"
            fi
        done
    fi

    # Check for settings
    if [ -f "$LOCAL_CLAUDE/settings.json" ]; then
        echo "=== Local Settings ==="
        safe_cat "$LOCAL_CLAUDE/settings.json"
    fi
else
    echo "No local .claude directory found"
fi

echo ""
echo "========================================"
echo "2. HOME .claude DIRECTORY ($HOME/.claude)"
echo "========================================"
echo ""

HOME_CLAUDE="$HOME/.claude"
if [ -d "$HOME_CLAUDE" ]; then
    echo "Home .claude directory exists"
    safe_tree "$HOME_CLAUDE"
    safe_ls "$HOME_CLAUDE"

    # Check for settings
    if [ -f "$HOME_CLAUDE/settings.json" ]; then
        echo "=== Global Settings ==="
        safe_cat "$HOME_CLAUDE/settings.json"
    fi

    # Check for commands
    if [ -d "$HOME_CLAUDE/commands" ]; then
        echo "=== Global Commands ==="
        safe_ls "$HOME_CLAUDE/commands"
        for cmd in "$HOME_CLAUDE/commands"/*; do
            if [ -f "$cmd" ]; then
                safe_cat "$cmd"
            fi
        done
    fi

    # Check for hooks
    if [ -d "$HOME_CLAUDE/hooks" ]; then
        echo "=== Global Hooks ==="
        safe_ls "$HOME_CLAUDE/hooks"
        for hook in "$HOME_CLAUDE/hooks"/*; do
            if [ -f "$hook" ]; then
                safe_cat "$hook"
            fi
        done
    fi

    # Check for skills
    if [ -d "$HOME_CLAUDE/skills" ]; then
        echo "=== Global Skills ==="
        safe_ls "$HOME_CLAUDE/skills"
        safe_tree "$HOME_CLAUDE/skills"
        # List skill directories
        for skilldir in "$HOME_CLAUDE/skills"/*; do
            if [ -d "$skilldir" ]; then
                echo "--- Skill: $(basename $skilldir) ---"
                safe_ls "$skilldir"
                for skillfile in "$skilldir"/*; do
                    if [ -f "$skillfile" ]; then
                        safe_cat "$skillfile"
                    fi
                done
            fi
        done
    fi

    # Check for agents
    if [ -d "$HOME_CLAUDE/agents" ]; then
        echo "=== Global Agents ==="
        safe_ls "$HOME_CLAUDE/agents"
        for agent in "$HOME_CLAUDE/agents"/*; do
            if [ -f "$agent" ]; then
                safe_cat "$agent"
            fi
        done
    fi

    # Check for other notable files/directories
    if [ -f "$HOME_CLAUDE/stop-hook-git-check.sh" ]; then
        echo "=== Stop Hook Git Check Script ==="
        safe_cat "$HOME_CLAUDE/stop-hook-git-check.sh"
    fi

    # Check session-env
    if [ -d "$HOME_CLAUDE/session-env" ]; then
        echo "=== Session Environment ==="
        safe_ls "$HOME_CLAUDE/session-env"
        safe_tree "$HOME_CLAUDE/session-env"
    fi

    # Check projects
    if [ -d "$HOME_CLAUDE/projects" ]; then
        echo "=== Projects ==="
        safe_ls "$HOME_CLAUDE/projects"
        safe_tree "$HOME_CLAUDE/projects"
    fi
else
    echo "No home .claude directory found"
fi

echo ""
echo "======================================"
echo "Script execution completed"
echo "======================================"

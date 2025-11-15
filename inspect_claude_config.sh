#!/bin/bash

# Script to inspect Claude Code configuration directories and files
# Checks both project directory and $HOME for .claude configurations

echo "========================================"
echo "Claude Code Configuration Inspector"
echo "========================================"
echo ""

# Function to inspect a directory
inspect_directory() {
    local base_path="$1"
    local location_name="$2"

    echo "----------------------------------------"
    echo "Checking: $location_name"
    echo "Path: $base_path"
    echo "----------------------------------------"

    # Check if .claude directory exists
    if [ -d "$base_path/.claude" ]; then
        echo "✓ .claude directory EXISTS"
        echo ""

        # List directory structure
        echo "Directory structure:"
        tree -a -L 3 "$base_path/.claude" 2>/dev/null || ls -laR "$base_path/.claude"
        echo ""

        # Check for specific subdirectories
        for subdir in commands hooks skills agents; do
            if [ -d "$base_path/.claude/$subdir" ]; then
                echo "✓ Found: .claude/$subdir/"
                file_count=$(find "$base_path/.claude/$subdir" -type f 2>/dev/null | wc -l)
                echo "  Files: $file_count"
                if [ $file_count -gt 0 ]; then
                    echo "  Contents:"
                    find "$base_path/.claude/$subdir" -type f -exec echo "    - {}" \;
                fi
            else
                echo "✗ Not found: .claude/$subdir/"
            fi
        done
        echo ""

        # Check for configuration files
        echo "Configuration files:"
        for config in claude.json config.json settings.json .clauderc; do
            if [ -f "$base_path/.claude/$config" ]; then
                echo "  ✓ $config"
                echo "    Content preview:"
                head -20 "$base_path/.claude/$config" | sed 's/^/      /'
            fi
        done
        echo ""

        # List all files in .claude
        echo "All files in .claude:"
        find "$base_path/.claude" -type f -ls 2>/dev/null
        echo ""

    else
        echo "✗ .claude directory DOES NOT EXIST"
        echo "  Attempting to check permissions..."
        ls -ld "$base_path" 2>&1 | sed 's/^/  /'
    fi
    echo ""
}

# Check project directory
PROJECT_DIR="/home/user/cac-test"
inspect_directory "$PROJECT_DIR" "Project Directory"

# Check HOME directory
inspect_directory "$HOME" "HOME Directory (~)"

# Check for global Claude config files
echo "----------------------------------------"
echo "Global Configuration Files"
echo "----------------------------------------"
for config_file in "$HOME/.clauderc" "$HOME/.claude.json" "$HOME/.config/claude/config.json"; do
    if [ -f "$config_file" ]; then
        echo "✓ Found: $config_file"
        echo "  Content preview:"
        head -20 "$config_file" | sed 's/^/    /'
        echo ""
    else
        echo "✗ Not found: $config_file"
    fi
done
echo ""

# Check environment variables
echo "----------------------------------------"
echo "Claude-related Environment Variables"
echo "----------------------------------------"
env | grep -i claude || echo "No Claude-related environment variables found"
echo ""

# Check for MCP configuration
echo "----------------------------------------"
echo "MCP Configuration"
echo "----------------------------------------"
if [ -f "$HOME/.config/mcp/mcp.json" ]; then
    echo "✓ Found MCP config: $HOME/.config/mcp/mcp.json"
    cat "$HOME/.config/mcp/mcp.json"
else
    echo "✗ MCP config not found at: $HOME/.config/mcp/mcp.json"
fi
echo ""

# Check current user and permissions
echo "----------------------------------------"
echo "User and Permissions Info"
echo "----------------------------------------"
echo "Current user: $(whoami)"
echo "User ID: $(id)"
echo "Home directory: $HOME"
echo "Current working directory: $(pwd)"
echo ""

echo "========================================"
echo "Inspection Complete"
echo "========================================"

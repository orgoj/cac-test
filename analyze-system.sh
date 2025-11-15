#!/bin/bash

# System Analysis Script
# This script collects comprehensive information about the system environment
# Created for repeatable system analysis

set -e

OUTPUT_FILE="system-info.md"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo "# System Information Report" > "$OUTPUT_FILE"
echo "Generated: $TIMESTAMP" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# OS Information
echo "## Operating System" >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"
if [ -f /etc/os-release ]; then
    cat /etc/os-release >> "$OUTPUT_FILE"
fi
echo "\`\`\`" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Kernel Information
echo "## Kernel" >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"
uname -a >> "$OUTPUT_FILE"
if [ -f /proc/version ]; then
    echo "" >> "$OUTPUT_FILE"
    cat /proc/version >> "$OUTPUT_FILE"
fi
echo "\`\`\`" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Hostname
echo "## Hostname" >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"
hostname >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# User & Permissions
echo "## User & Permissions" >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"
echo "Current user: $(whoami)" >> "$OUTPUT_FILE"
id >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# CPU Information
echo "## CPU Information" >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"
if command -v lscpu &> /dev/null; then
    lscpu >> "$OUTPUT_FILE"
else
    echo "Processors: $(nproc)" >> "$OUTPUT_FILE"
    if [ -f /proc/cpuinfo ]; then
        grep -E "model name|processor|cpu cores" /proc/cpuinfo | head -20 >> "$OUTPUT_FILE"
    fi
fi
echo "\`\`\`" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Memory Information
echo "## Memory" >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"
if command -v free &> /dev/null; then
    free -h >> "$OUTPUT_FILE"
else
    grep -E "MemTotal|MemFree|MemAvailable" /proc/meminfo >> "$OUTPUT_FILE"
fi
echo "\`\`\`" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Disk Space
echo "## Disk Space" >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"
df -h >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Network Information
echo "## Network Configuration" >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"
echo "IP Address(es): $(hostname -I 2>/dev/null || echo 'N/A')" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

if command -v ip &> /dev/null; then
    echo "=== Interfaces ===" >> "$OUTPUT_FILE"
    ip addr show >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "=== Routes ===" >> "$OUTPUT_FILE"
    ip route show >> "$OUTPUT_FILE"
elif command -v ifconfig &> /dev/null; then
    ifconfig >> "$OUTPUT_FILE"
else
    cat /proc/net/dev >> "$OUTPUT_FILE"
fi

echo "" >> "$OUTPUT_FILE"
if [ -f /etc/resolv.conf ]; then
    echo "=== DNS Configuration ===" >> "$OUTPUT_FILE"
    cat /etc/resolv.conf >> "$OUTPUT_FILE"
fi
echo "\`\`\`" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Development Tools & Versions
echo "## Development Tools" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

check_tool_version() {
    local tool=$1
    local version_arg=${2:---version}

    if command -v "$tool" &> /dev/null; then
        echo "### $tool" >> "$OUTPUT_FILE"
        echo "\`\`\`" >> "$OUTPUT_FILE"
        echo "Path: $(command -v $tool)" >> "$OUTPUT_FILE"
        $tool $version_arg 2>&1 | head -5 >> "$OUTPUT_FILE"
        echo "\`\`\`" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi
}

# Check common development tools
check_tool_version "python3"
check_tool_version "python"
check_tool_version "node"
check_tool_version "npm"
check_tool_version "java"
check_tool_version "go" "version"
check_tool_version "ruby"
check_tool_version "php"
check_tool_version "perl"
check_tool_version "rustc"
check_tool_version "cargo"
check_tool_version "gcc"
check_tool_version "g++"
check_tool_version "make"
check_tool_version "cmake"
check_tool_version "git"
check_tool_version "docker"
check_tool_version "kubectl"

# Available binaries count
echo "## Available Binaries" >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"
echo "/usr/bin: $(ls -1 /usr/bin 2>/dev/null | wc -l) binaries" >> "$OUTPUT_FILE"
echo "/usr/local/bin: $(ls -1 /usr/local/bin 2>/dev/null | wc -l) binaries" >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# System Uptime
echo "## System Uptime" >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"
if command -v uptime &> /dev/null; then
    uptime >> "$OUTPUT_FILE"
else
    cat /proc/uptime >> "$OUTPUT_FILE"
fi
echo "\`\`\`" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Environment Variables (sanitized)
echo "## Environment Variables" >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"
env | sort | grep -v -E "(TOKEN|PASSWORD|SECRET|KEY|JWT|PROXY)" | head -50 >> "$OUTPUT_FILE"
echo "... (sensitive variables filtered)" >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Architecture
echo "## System Architecture" >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"
if command -v dpkg &> /dev/null; then
    echo "Architecture: $(dpkg --print-architecture)" >> "$OUTPUT_FILE"
fi
if [ -f /proc/cpuinfo ]; then
    grep -E "flags|features" /proc/cpuinfo | head -1 >> "$OUTPUT_FILE"
fi
echo "\`\`\`" >> "$OUTPUT_FILE"

echo "System analysis complete. Results saved to $OUTPUT_FILE"
cat "$OUTPUT_FILE"

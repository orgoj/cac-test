#!/usr/bin/env python3
"""
Analyzuje Claude Code logy a zjišťuje timing MCP startup vs Session Start Hook
"""

import json
import os
from pathlib import Path
from datetime import datetime
import re

def parse_claude_logs():
    """Analyzuje .claude session logy"""

    project_logs = Path.home() / ".claude" / "projects" / "-home-user-cac-test"

    if not project_logs.exists():
        print(f"❌ Log directory not found: {project_logs}")
        return

    print("📁 Analyzing Claude session logs...\n")

    # Najdi všechny .jsonl soubory
    log_files = sorted(project_logs.glob("*.jsonl"))

    if not log_files:
        print("❌ No .jsonl log files found")
        return

    print(f"Found {len(log_files)} log files:\n")

    for log_file in log_files:
        print(f"\n{'='*60}")
        print(f"📄 File: {log_file.name}")
        print(f"{'='*60}\n")

        mcp_events = []
        hook_events = []
        all_events = []

        try:
            with open(log_file, 'r') as f:
                for line_num, line in enumerate(f, 1):
                    try:
                        entry = json.loads(line.strip())

                        timestamp = entry.get('timestamp', 'unknown')
                        event_type = entry.get('type', 'unknown')
                        message = entry.get('message', '')

                        # Hledej MCP related events
                        if 'mcp' in str(entry).lower():
                            mcp_events.append({
                                'line': line_num,
                                'timestamp': timestamp,
                                'type': event_type,
                                'data': entry
                            })

                        # Hledej hook events
                        if 'hook' in str(entry).lower() or 'session-start' in str(entry).lower():
                            hook_events.append({
                                'line': line_num,
                                'timestamp': timestamp,
                                'type': event_type,
                                'data': entry
                            })

                        all_events.append({
                            'line': line_num,
                            'timestamp': timestamp,
                            'type': event_type
                        })

                    except json.JSONDecodeError:
                        continue

        except Exception as e:
            print(f"❌ Error reading {log_file}: {e}")
            continue

        # Výstup
        if mcp_events:
            print(f"🔧 MCP Events ({len(mcp_events)}):")
            for event in mcp_events[:10]:  # First 10
                print(f"  Line {event['line']:4d} | {event['timestamp']} | {event['type']}")
                print(f"           → {str(event['data'])[:100]}...")
            if len(mcp_events) > 10:
                print(f"  ... and {len(mcp_events) - 10} more")
        else:
            print("ℹ️  No MCP events found")

        print()

        if hook_events:
            print(f"🪝 Hook Events ({len(hook_events)}):")
            for event in hook_events[:10]:
                print(f"  Line {event['line']:4d} | {event['timestamp']} | {event['type']}")
                print(f"           → {str(event['data'])[:100]}...")
            if len(hook_events) > 10:
                print(f"  ... and {len(hook_events) - 10} more")
        else:
            print("ℹ️  No Hook events found")

        print(f"\n📊 Total events in file: {len(all_events)}")


def parse_claude_code_log():
    """Analyzuje /tmp/claude-code.log"""

    log_file = Path("/tmp/claude-code.log")

    if not log_file.exists():
        print("❌ /tmp/claude-code.log not found")
        return

    print(f"\n\n{'='*60}")
    print("📄 Analyzing /tmp/claude-code.log")
    print(f"{'='*60}\n")

    mcp_lines = []
    hook_lines = []

    try:
        with open(log_file, 'r') as f:
            for line_num, line in enumerate(f, 1):
                line_lower = line.lower()

                if 'mcp' in line_lower:
                    mcp_lines.append((line_num, line.strip()))

                if 'hook' in line_lower or 'session-start' in line_lower:
                    hook_lines.append((line_num, line.strip()))

        if mcp_lines:
            print(f"🔧 MCP related lines ({len(mcp_lines)}):")
            for line_num, content in mcp_lines[-20:]:  # Last 20
                print(f"  {line_num:5d} | {content[:120]}")
        else:
            print("ℹ️  No MCP mentions found")

        print()

        if hook_lines:
            print(f"🪝 Hook related lines ({len(hook_lines)}):")
            for line_num, content in hook_lines[-20:]:
                print(f"  {line_num:5d} | {content[:120]}")
        else:
            print("ℹ️  No Hook mentions found")

    except Exception as e:
        print(f"❌ Error reading log: {e}")


def check_session_start_log():
    """Zkontroluje náš custom session-start.log"""

    log_file = Path("/home/user/cac-test/.session-start.log")

    print(f"\n\n{'='*60}")
    print("📄 Checking custom session-start.log")
    print(f"{'='*60}\n")

    if not log_file.exists():
        print("⚠️  .session-start.log doesn't exist yet")
        print("   (Will be created on next session start)")
        return

    try:
        with open(log_file, 'r') as f:
            content = f.read()
            print(content)
    except Exception as e:
        print(f"❌ Error reading: {e}")


def main():
    print("\n" + "="*60)
    print("🔍 Claude Code MCP Timing Analyzer")
    print("="*60 + "\n")

    # 1. Analyzuj Claude session logy
    parse_claude_logs()

    # 2. Analyzuj claude-code.log
    parse_claude_code_log()

    # 3. Zkontroluj náš custom log
    check_session_start_log()

    print("\n" + "="*60)
    print("✅ Analysis complete")
    print("="*60 + "\n")

    print("💡 Tip: Run this script again after restarting the session")
    print("   to see when session-start hook executes vs MCP startup\n")


if __name__ == "__main__":
    main()

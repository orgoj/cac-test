#!/bin/bash
# Session Start Hook - Test timing vs MCP startup

TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S.%N")
LOG_FILE="/home/user/cac-test/.session-start.log"

echo "[$TIMESTAMP] Session start hook executed" >> "$LOG_FILE"
echo "[$TIMESTAMP] PWD: $PWD" >> "$LOG_FILE"
echo "[$TIMESTAMP] Session ID: $CLAUDE_CODE_SESSION_ID" >> "$LOG_FILE"
echo "---" >> "$LOG_FILE"

# Výstup také do stdout pro viditelnost
echo "✓ Session start hook executed at $TIMESTAMP"

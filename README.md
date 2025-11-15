# Claude Code Environment - System Overview

This repository contains comprehensive information about the Claude Code execution environment.

## Quick Summary

**Environment Type:** Claude Code Remote (Cloud)
**Operating System:** Ubuntu 24.04.3 LTS (Noble Numbat)
**Kernel:** Linux 4.4.0
**Architecture:** x86_64 (amd64)
**Virtualization:** KVM (full virtualization)
**User:** root (uid=0)
**Hostname:** runsc

## System Resources

- **CPU:** 16 cores (Intel, Model 106)
- **Memory:** 13 GB RAM (no swap)
- **Disk:** 30 GB root filesystem
- **Internal IP:** 21.0.0.54
- **Public IP:** 104.155.178.59 (Google Cloud)

## Key Features

### Container Environment
- Running in a sandboxed container (`IS_SANDBOX=yes`)
- Limited network tools (no `ip`, `ifconfig`, `netstat` commands)
- Proxy-based internet access configured
- Some system utilities have restricted permissions

### Development Tools Available

#### Programming Languages & Runtimes
- **Python:** 3.11.14 (`/usr/local/bin/python3`)
- **Node.js:** v22.21.1 (`/opt/node22/bin/node`)
- **NPM:** 10.9.4
- **Java:** OpenJDK 21.0.8 (`/usr/bin/java`)
- **Go:** 1.24.7 (`/usr/local/go/bin/go`)
- **Ruby:** 3.3.6 (`/usr/local/bin/ruby`)
- **PHP:** 8.4.14 (`/usr/bin/php`)
- **Rust:** 1.91.1 (rustc + cargo)
- **Perl:** 5.38.2

#### Build Tools & Compilers
- **GCC:** 13.3.0
- **G++:** 13.3.0
- **Make:** GNU Make 4.3
- **CMake:** 3.28.3
- **Bun:** Latest
- **Gradle:** `/opt/gradle`
- **Maven:** `/opt/maven`

#### Version Control & Tools
- **Git:** 2.43.0
- **NVM:** Node Version Manager configured
- **rbenv:** Ruby environment manager

#### Network & Download Tools
- **curl:** 8.5.0 (with OpenSSL/3.0.13, HTTP/2, many protocols)
- **wget:** 1.21.4

#### Available Binaries
- `/usr/bin`: 1,055+ binaries
- `/usr/local/bin`: 27+ binaries

### System Capabilities

✅ **Available:**
- Full development toolchain (GCC, Python, Node, Java, Go, Rust, etc.)
- Git operations
- File system read/write (as root)
- Network access (via proxy)
- Internet downloads (curl, wget)
- Process execution
- Package information query

⚠️ **Limited/Restricted:**
- Package installation (`apt` has permission issues)
- `sudo` command (ownership issues)
- Network utilities (`ip`, `ifconfig`, `netstat` not available)
- Some system configuration

## Environment Variables

Key environment variables indicate this is a Claude Code remote environment:

```bash
CLAUDECODE=1
CLAUDE_CODE_REMOTE=true
CLAUDE_CODE_VERSION=2.0.34
CLAUDE_CODE_REMOTE_ENVIRONMENT_TYPE=cloud_default
CLAUDE_CODE_SESSION_ID=session_01SzNKhWoPpmRTik33gWKUw2
IS_SANDBOX=yes
```

## Network Configuration

- **Internal IP:** 21.0.0.54 (container network)
- **Public IP:** 104.155.178.59 (Google Cloud, load-balanced in 104.155.x.x range)
- **Proxy Chain:** Traffic routed through 34.160.111.145 (Google proxy)
- **Proxy:** Configured for HTTP/HTTPS traffic with JWT authentication
- **DNS:** Available via `/etc/resolv.conf`
- **No-Proxy Exceptions:** localhost, 127.0.0.1, *.google.com, *.googleapis.com
- **Internet Access:** Full access via curl/wget through proxy

## File System

```
Filesystem      Size  Used Avail Use%
/              30GB  3.8M   30G   1%
/dev          252GB     0  252G   0%
```

## System Analysis Script

This repository includes an automated analysis script that can be run to gather fresh system information:

```bash
./analyze-system.sh
```

This script generates a detailed `system-info.md` file containing:
- OS and kernel details
- Hardware specifications (CPU, memory, disk)
- Network configuration
- All installed development tools with versions
- Environment variables (sanitized)
- System uptime and resource usage

### Running the Analysis

```bash
# Make executable (if not already)
chmod +x analyze-system.sh

# Run the analysis
./analyze-system.sh

# View the results
cat system-info.md
```

## Use Cases

This environment is suitable for:
- **Multi-language development** (Python, Node, Java, Go, Rust, Ruby, PHP, etc.)
- **Building and compiling** (GCC, CMake, Make available)
- **Web development** (Node.js, npm, various web frameworks)
- **DevOps scripting** (Bash, Python, full CLI tools)
- **Data processing** (Python with access to pip packages)
- **Git workflows** (full git support)

## Limitations

- Cannot install system packages via apt (permission restrictions)
- Limited network diagnostic tools
- No Docker daemon (docker CLI may be present but won't function)
- No kubectl connection to clusters (CLI only)
- Temporary environment (session-based)

## Files in This Repository

- `README.md` - This overview document
- `analyze-system.sh` - Automated system analysis script
- `system-info.md` - Detailed system information (auto-generated)

## Updates

To refresh the system information, simply run:

```bash
./analyze-system.sh
```

This will update `system-info.md` with current system state and timestamps.

---

**Last Updated:** Auto-generated on each analysis run
**Environment:** Claude Code Remote Cloud (Sandboxed)

# Claude Version Information

Dokumentace aktuální verze Claude běžící v Claude Code remote containeru.

## AI Model (Claude)

### Základní informace

- **Model:** Claude Sonnet 4.5
- **Model ID:** `claude-sonnet-4-5-20250929`
- **Knowledge cutoff:** January 2025

### Poznámka o nejnovějším modelu

Nejnovější frontier model Anthropic je **Claude Opus 4.5** (`claude-opus-4-5-20251101`). Remote container v současnosti běží na Claude Sonnet 4.5.

## Claude Code CLI

### Verze a prostředí

- **Verze:** `2.0.59`
- **Entrypoint:** `remote`
- **Environment Type:** `cloud_default`
- **Remote Mode:** Aktivní (`CLAUDE_CODE_REMOTE=true`)
- **Debug Mode:** Aktivní (`CLAUDE_CODE_DEBUG=true`)

## Session informace

### Identifikátory

- **Session ID:** `session_01DAyX7kyqWMAoPwVnoxq6ue`
- **Container ID:** `container_01MuJdfGLPTCrHf4aZT67pwf--claude_code_remote--bronze-uneven-second-tissue`
- **User Session ID:** `a7ad5725-b34d-4524-8cf5-cf63d2326d49`

## Jak zjistit verzi programově

### Claude Code CLI verze

```bash
echo $CLAUDE_CODE_VERSION
```

**Výstup:** `2.0.59`

### Kontrola remote prostředí

```bash
echo $CLAUDE_CODE_REMOTE
```

**Výstup:** `true`

### Session ID

```bash
echo $CLAUDE_CODE_REMOTE_SESSION_ID
```

**Výstup:** `session_01DAyX7kyqWMAoPwVnoxq6ue`

### Kompletní přehled Claude proměnných

```bash
env | grep -i claude
```

## Důležité environment proměnné

| Proměnná | Hodnota | Popis |
|----------|---------|-------|
| `CLAUDE_CODE_VERSION` | `2.0.59` | Verze Claude Code CLI |
| `CLAUDE_CODE_REMOTE` | `true` | Indikátor remote prostředí |
| `CLAUDE_CODE_ENTRYPOINT` | `remote` | Typ entrypointu |
| `CLAUDE_CODE_REMOTE_ENVIRONMENT_TYPE` | `cloud_default` | Typ cloud prostředí |
| `CLAUDE_CODE_DEBUG` | `true` | Debug režim |
| `CLAUDE_CODE_SESSION_ID` | `a7ad5725-b34d-4524-8cf5-cf63d2326d49` | User session ID |
| `CLAUDE_CODE_REMOTE_SESSION_ID` | `session_01DAyX7kyqWMAoPwVnoxq6ue` | Remote session ID |
| `CLAUDE_CODE_CONTAINER_ID` | `container_01MuJdfGLPTCrHf4aZT67pwf--claude_code_remote--bronze-uneven-second-tissue` | Container ID |
| `CLAUDE_CODE_PROXY_RESOLVES_HOSTS` | `true` | Proxy DNS resolving |
| `CLAUDECODE` | `1` | Legacy indikátor Claude Code prostředí |

## Network Proxy Configuration

Container používá proxy pro všechny HTTP/HTTPS požadavky. Proxy obsahuje JWT token pro autentizaci:

```bash
echo $HTTP_PROXY | cut -d'@' -f1 | tail -c 50
```

### Proxy proměnné

- `HTTP_PROXY` / `http_proxy`
- `HTTPS_PROXY` / `https_proxy`
- `YARN_HTTP_PROXY`
- `YARN_HTTPS_PROXY`
- `GLOBAL_AGENT_HTTP_PROXY`
- `GLOBAL_AGENT_HTTPS_PROXY`

## File Descriptors

Claude Code používá speciální file descriptory pro autentizaci:

- **FD 3:** WebSocket auth (`CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR=3`)
- **FD 4:** OAuth token (`CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR=4`)

## Model Capabilities

### Co model umí

- Pokročilá analýza kódu
- Multi-step reasoning
- Kontext až 200k tokenů
- Multimodální vstup (text, obrázky, PDF)
- Generování strukturovaného výstupu

### Omezení

- Knowledge cutoff: January 2025
- Sonnet 4.5 (nikoliv Opus 4.5 - nejvýkonnější model)
- Remote prostředí s proxy constraints

## Verze kontrolní script

Můžete vytvořit jednoduchý script pro kontrolu verzí:

```bash
#!/bin/bash
# check-versions.sh

echo "=== Claude Version Check ==="
echo ""
echo "AI Model:"
echo "  Model: Claude Sonnet 4.5"
echo "  Model ID: claude-sonnet-4-5-20250929"
echo ""
echo "Claude Code CLI:"
echo "  Version: $CLAUDE_CODE_VERSION"
echo "  Remote: $CLAUDE_CODE_REMOTE"
echo "  Environment: $CLAUDE_CODE_REMOTE_ENVIRONMENT_TYPE"
echo ""
echo "Session:"
echo "  Session ID: $CLAUDE_CODE_REMOTE_SESSION_ID"
echo "  Container: $CLAUDE_CODE_CONTAINER_ID"
echo ""
```

## Poznámky

### Version History

Tento dokument odráží aktuální stav containeru. Historické verze:

- **2.0.50** - Předchozí verze (uvedena v README.md)
- **2.0.59** - Aktuální verze (ověřeno 2025-12-22)

### Aktualizace dokumentace

Pro aktualizaci této dokumentace:

1. Spusť kontrolu verzí: `env | grep -i claude`
2. Porovnej s hodnotami v tomto dokumentu
3. Aktualizuj změněné hodnoty
4. Commitni s popisem: "Update Claude version to X.Y.Z"

## Související dokumentace

- **[SYSTEM_ENVIRONMENT.md](SYSTEM_ENVIRONMENT.md)** - Detailní přehled systémového prostředí
- **[CONFIGURATION.md](CONFIGURATION.md)** - Claude Code konfigurace a nastavení
- **[README.md](README.md)** - Hlavní dokumentace repozitáře

---

**Poslední aktualizace:** 2025-12-22
**Claude Code Version:** 2.0.59
**Model:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

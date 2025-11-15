# ⚠️ DEPRECATED: Adaptive MCP Server

**Tento přístup JE DEPRECATED a neměl by se používat!**

## Proč je deprecated?

Adaptive server vyžadoval bootstrap code v `.claude/mcp.json`:

```json
{
  "headers": {
    "X-One-Time-Code": "bootstrap-xyz789"  // ❌ SECRET V GIT REPO!
  }
}
```

**Problémy:**
- ❌ Secret v Git repo (i když dočasný)
- ❌ Manuální cleanup potřeba (smazat code po první session)
- ❌ Git history obsahuje secret navždy
- ❌ Risk zapomenout smazat code

---

## ✅ Použij místo toho:

### Metoda 1: Discovery → Static Whitelist (DOPORUČENO)

```bash
# 1. Deploy discovery endpoint
# 2. Zjisti IP z logů
# 3. Deploy MCP server s pevným IP whitelistem
# 4. Config BEZ JAKÝCHKOLIV secrets

{
  "mcpServers": {
    "brave": {
      "url": "https://my-mcp.vercel.app/api/mcp"
    }
  }
}
```

**✅ Zero secrets v Git od začátku!**

Viz [../QUICK_IP_DISCOVERY.md](../QUICK_IP_DISCOVERY.md) pro details.

---

### Metoda 2: Progressive Whitelist

```bash
# Start s AWS IP ranges
# Postupně zužuj basované na real IPs
```

Viz [progressive-whitelist-mcp-server.ts](./progressive-whitelist-mcp-server.ts)

---

**Poslední aktualizace:** 2025-11-15
**Důvod deprecation:** Security - secrets nemají co dělat v Git repo

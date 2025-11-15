# Bezpečné řešení API klíčů pro Anthropic Remote Container

## Problém

V Anthropic remote containeru:
- ❌ Nemáte kontrolu nad inicializací containeru
- ❌ Nemůžete nastavit environment variables před startem
- ❌ Container je vytvo řen dynamicky z vašeho Git repo
- ❌ Jakékoliv secrets v Gitu jsou kompromitované

## ✅ Řešení: Remote MCP Server

**Koncept:** API klíče nejsou v containeru, ale na vašem serveru. Container se k němu jen připojí přes HTTPS.

### Architektura

```
┌─────────────────────────────────┐
│ Anthropic Remote Container     │
│                                 │
│  Claude Code                    │
│    ↓ HTTPS                      │
│  MCP Client (v containeru)      │
└────────────┬────────────────────┘
             │
             │ HTTPS + Auth
             │
┌────────────▼────────────────────┐
│ VÁŠ Server (Vercel/Railway/etc)│
│                                 │
│  Remote MCP Server              │
│    - API klíče (BRAVE, GITHUB)  │
│    - OAuth token                │
│    - Autentizace                │
└─────────────────────────────────┘
```

---

## Možnosti nasazení

### Option 1: One-Time Secret URL (Nejjednodušší)

**Pro:** Žádný vlastní server
**Proti:** Musíte generovat URL každou session

**Postup:**

**1. Vytvořte session start hook:**
```bash
# .claude/hooks/session-start.sh
#!/bin/bash

# Stáhne API klíč z one-time secret URL
if [ ! -z "$MCP_SECRET_URL" ]; then
    API_KEY=$(curl -s "$MCP_SECRET_URL")
    export BRAVE_API_KEY="$API_KEY"
    echo "✓ API klíč načten z one-time URL"
fi
```

**2. Před startem session:**
- Jdi na https://onetimesecret.com
- Vlož svůj API klíč
- Nastav TTL na 10 minut
- Zkopíruj URL

**3. V Claude Code remote:**
```bash
export MCP_SECRET_URL="https://onetimesecret.com/secret/xxxxx"
# Hook automaticky načte klíč
```

**Služby pro one-time secrets:**
- https://onetimesecret.com (14 dní retention)
- https://privnote.com (přečti jednou, vymaž)
- https://snappass.io (vlastní TTL)

---

### Option 2: Remote MCP Server (Nejprofesionálnější)

**Pro:** Automatické, bezpečné, škálovatelné
**Proti:** Vyžaduje deployment serveru

#### A) Vercel Deployment

**1. Vytvořte MCP server:**
```typescript
// api/mcp.ts
import { MCPServer } from '@modelcontextprotocol/sdk';

const server = new MCPServer({
  name: "brave-search-remote",
  version: "1.0.0"
});

// API klíč je v Vercel environment variables
const BRAVE_API_KEY = process.env.BRAVE_API_KEY;

server.tool("search", async (query: string) => {
  const response = await fetch("https://api.search.brave.com/res/v1/web/search", {
    headers: {
      "X-Subscription-Token": BRAVE_API_KEY
    }
  });
  return response.json();
});

export default server.handler();
```

**2. Deploy na Vercel:**
```bash
vercel deploy
# Přidej BRAVE_API_KEY do Vercel environment variables
```

**3. V `.claude/mcp.json`:**
```json
{
  "mcpServers": {
    "brave-search": {
      "url": "https://your-app.vercel.app/api/mcp",
      "transport": "http",
      "headers": {
        "Authorization": "Bearer your-server-auth-token"
      }
    }
  }
}
```

**✅ API klíč je na Vercelu, NE v containeru!**

#### B) Railway / Fly.io Deployment

Stejný princip, jen jiný hosting provider.

#### C) Cloudflare Workers

```javascript
// worker.js
export default {
  async fetch(request) {
    const BRAVE_API_KEY = env.BRAVE_API_KEY; // Cloudflare secret

    // MCP server logika
  }
}
```

---

### Option 3: GitHub Actions jako Proxy

**Koncept:** GitHub Actions má secrets, použijte je jako proxy.

**1. Vytvořte workflow:**
```yaml
# .github/workflows/mcp-proxy.yml
name: MCP Proxy
on:
  workflow_dispatch:
    inputs:
      query:
        required: true

jobs:
  search:
    runs-on: ubuntu-latest
    steps:
      - name: Search
        run: |
          curl "https://api.search.brave.com/res/v1/web/search?q=${{ inputs.query }}" \
            -H "X-Subscription-Token: ${{ secrets.BRAVE_API_KEY }}"
```

**2. V containeru:**
```bash
gh workflow run mcp-proxy.yml -f query="AI trends"
```

**⚠️ Limitace:** Rate limits GitHub Actions

---

### Option 4: Proxy přes váš osobní server

**Pokud máte VPS/homelab:**

**1. Nastavte nginx proxy:**
```nginx
location /mcp/brave {
    proxy_pass https://api.search.brave.com;
    proxy_set_header X-Subscription-Token $BRAVE_API_KEY;
}
```

**2. V containeru:**
```json
{
  "mcpServers": {
    "brave-search": {
      "url": "https://your-server.com/mcp/brave"
    }
  }
}
```

---

## Doporučení

### Pro testování:
→ **Option 1** (One-time secret URL) - nejrychlejší start

### Pro produkci:
→ **Option 2** (Remote MCP na Vercel/Railway) - nejčistší

### Pro power users:
→ **Option 4** (Vlastní proxy server) - plná kontrola

---

## Implementace: Remote Brave Search Server

**Kompletní příklad na Vercel:**

```typescript
// api/mcp/brave.ts
import { StreamableHTTPServer } from '@modelcontextprotocol/sdk';

const BRAVE_API_KEY = process.env.BRAVE_API_KEY!;

const server = new StreamableHTTPServer({
  name: "brave-search",
  version: "1.0.0",
  capabilities: {
    tools: ["web_search"]
  }
});

server.tool({
  name: "web_search",
  description: "Search the web using Brave Search",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string" }
    }
  },
  handler: async ({ query }) => {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`,
      {
        headers: {
          "Accept": "application/json",
          "X-Subscription-Token": BRAVE_API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Brave API error: ${response.status}`);
    }

    return response.json();
  }
});

export default server.handler();
```

**Vercel config:**
```json
{
  "env": {
    "BRAVE_API_KEY": "@brave-api-key"
  }
}
```

**V containeru (.claude/mcp.json):**
```json
{
  "mcpServers": {
    "brave-search": {
      "url": "https://your-vercel-app.vercel.app/api/mcp/brave",
      "transport": "http"
    }
  }
}
```

**🎉 Hotovo! API klíč je bezpečně na Vercelu.**

---

## Security Best Practices

### Server-side:
- ✅ Použijte rate limiting
- ✅ Implementujte autentizaci (Bearer token)
- ✅ Logujte všechny requesty
- ✅ Nastavte CORS správně
- ✅ Rotujte auth tokeny pravidelně

### Client-side (v containeru):
- ✅ Auth token může být v `.claude/mcp.json` (není secret, jen autentizuje požadavky)
- ✅ Používejte read-only tokeny kde možné
- ✅ Nastavte krátké TTL pro tokeny

---

## Quick Start Guide

**Nejrychlejší způsob (5 minut):**

1. **Deploy na Vercel:**
   ```bash
   npx create-mcp-server@latest my-remote-mcp
   cd my-remote-mcp
   # Přidej Brave Search tool
   vercel deploy
   vercel env add BRAVE_API_KEY
   ```

2. **V Git repo přidej:**
   ```json
   // .claude/mcp.json
   {
     "mcpServers": {
       "brave": {
         "url": "https://my-remote-mcp.vercel.app/mcp"
       }
     }
   }
   ```

3. **Commit & Push**

4. **Spusť Claude Code remote session**
   - Container se připojí k tvému Vercel serveru
   - API klíč je na Vercelu, ne v containeru
   - ✅ Bezpečné!

---

## Troubleshooting

**Q: Co když Vercel free tier nestačí?**
A: Railway, Fly.io, nebo Cloudflare Workers mají generous free tiery

**Q: Jak zabezpečit remote server?**
A: Bearer token v headers, IP whitelist, nebo OAuth 2.1

**Q: Můžu použít pro GitHub MCP?**
A: Ano! GitHub Personal Access Token je na serveru, ne v containeru

**Q: Co když nechci vlastní server?**
A: Použij Option 1 (One-time secret URL) pro jednorázové použití

---

## Odkazy

- [MCP Remote Servers Spec](https://modelcontextprotocol.io/docs/develop/connect-remote-servers)
- [Vercel MCP Deployment](https://vercel.com/docs/mcp)
- [One Time Secret](https://onetimesecret.com)
- [Railway MCP Guide](https://docs.railway.app/guides/mcp)

---

**Poslední aktualizace:** 2025-11-15
**Pro:** Anthropic Claude Code Remote Environment

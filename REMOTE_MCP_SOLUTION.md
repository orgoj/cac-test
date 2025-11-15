# Bezpečné řešení API klíčů pro Anthropic Remote Container

## Problém

V Anthropic remote containeru:
- ❌ Nemáte kontrolu nad inicializací containeru
- ❌ Nemůžete nastavit environment variables před startem
- ❌ Container je vytvořen dynamicky z vašeho Git repo
- ❌ Nemůžete spouštět bash příkazy před inicializací
- ❌ **Máte JEN: Git repo + prompt**

## ✅ Jediné funkční řešení: Remote MCP Server

**Koncept:** API klíče NEJSOU v containeru, ale na VAŠEM serveru. Container se k němu jen připojí přes HTTPS.

### Architektura

```
┌─────────────────────────────────┐
│ Anthropic Remote Container     │
│ (vy NEMÁTE kontrolu)            │
│                                 │
│  Claude Code                    │
│    │                            │
│    ↓ čte .claude/mcp.json       │
│  MCP Client                     │
│    │                            │
│    ↓ HTTPS připojení            │
└────┼────────────────────────────┘
     │
     │ HTTPS + Auth (optional)
     │
┌────▼────────────────────────────┐
│ VÁŠ Server                      │
│ (Vercel/Railway/Fly.io/etc)     │
│                                 │
│  Remote MCP Server              │
│    - API klíče (BRAVE, GITHUB)  │
│    - Implementuje MCP protokol  │
│    - Autentizace (optional)     │
└─────────────────────────────────┘
```

---

## Implementace: Remote MCP Server

### Krok 1: Deploy serveru s API klíči

Vyber si hosting provider a deployni MCP server:

#### A) Vercel (doporučeno pro začátečníky)

**1. Vytvoř MCP server:**

```typescript
// api/mcp/brave.ts
import { StreamableHTTPServer } from '@modelcontextprotocol/sdk';

// API klíč je v Vercel environment variables!
const BRAVE_API_KEY = process.env.BRAVE_API_KEY!;

const server = new StreamableHTTPServer({
  name: "brave-search",
  version: "1.0.0"
});

server.tool({
  name: "web_search",
  description: "Search the web using Brave Search",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Search query" },
      count: { type: "number", description: "Number of results (default: 10)" }
    },
    required: ["query"]
  },
  handler: async ({ query, count = 10 }) => {
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${count}`;

    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "X-Subscription-Token": BRAVE_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Brave API error: ${response.status}`);
    }

    return await response.json();
  }
});

export default server.handler();
```

**2. Deploy:**

```bash
vercel deploy
```

**3. Nastav environment variable na Vercelu:**

```bash
vercel env add BRAVE_API_KEY
# Zadej svůj actual API klíč
```

**4. URL tvého serveru:**
```
https://your-project.vercel.app/api/mcp/brave
```

---

#### B) Railway.app

```typescript
// server.ts
import { createServer } from 'http';
import { StreamableHTTPServer } from '@modelcontextprotocol/sdk';

const BRAVE_API_KEY = process.env.BRAVE_API_KEY!;
const PORT = process.env.PORT || 3000;

const mcpServer = new StreamableHTTPServer({
  name: "brave-search",
  version: "1.0.0"
});

// ... stejná implementace jako výše ...

const httpServer = createServer(mcpServer.handler());

httpServer.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
});
```

**Deploy:**
```bash
railway up
railway env set BRAVE_API_KEY=your-api-key
```

---

#### C) Cloudflare Workers

```typescript
// worker.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const BRAVE_API_KEY = env.BRAVE_API_KEY; // Cloudflare secret

    // MCP server implementace
    // ...

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" }
    });
  }
}
```

---

### Krok 2: Nakonfiguruj MCP v Git repo

V tvém Git repo přidej do `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "brave-search": {
      "url": "https://your-project.vercel.app/api/mcp/brave",
      "transport": "http"
    }
  }
}
```

**To je všechno!**

---

### Krok 3: Commit & Push

```bash
git add .claude/mcp.json
git commit -m "Add remote Brave Search MCP server"
git push
```

---

### Krok 4: Spusť Claude Code session

1. Anthropic vytvoří container
2. Naklonuje tvůj repo
3. Přečte `.claude/mcp.json`
4. **Připojí se k tvému serveru na Vercelu**
5. ✅ API klíč je na Vercelu, NE v containeru!

---

## Bezpečnost

### Optional: Přidej autentizaci

**Na serveru:**

```typescript
export default async function handler(req: Request) {
  const authHeader = req.headers.get('Authorization');
  const expectedToken = process.env.MCP_AUTH_TOKEN;

  if (authHeader !== `Bearer ${expectedToken}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // ... MCP server logika
}
```

**V .claude/mcp.json:**

```json
{
  "mcpServers": {
    "brave-search": {
      "url": "https://your-project.vercel.app/api/mcp/brave",
      "transport": "http",
      "headers": {
        "Authorization": "Bearer your-auth-token-here"
      }
    }
  }
}
```

**⚠️ Poznámka:** Auth token v mcp.json NENÍ secret (je public v Gitu), jen kontroluje že requesty jdou z tvého containeru.

### Best Practices:

- ✅ Rate limiting na serveru
- ✅ Logování všech requestů
- ✅ CORS nastavení
- ✅ Read-only API klíče kde možné
- ✅ Monitoring usage

---

## Příklad: GitHub MCP Server

```typescript
// api/mcp/github.ts
const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;

server.tool({
  name: "list_repos",
  description: "List user repositories",
  handler: async () => {
    const response = await fetch('https://api.github.com/user/repos', {
      headers: {
        "Authorization": `Bearer ${GITHUB_TOKEN}`,
        "Accept": "application/vnd.github.v3+json"
      }
    });

    return await response.json();
  }
});
```

---

## Quick Start: 5-minutový setup

```bash
# 1. Vytvoř projekt
npx create-next-app@latest my-mcp-server
cd my-mcp-server

# 2. Nainstaluj SDK
npm install @modelcontextprotocol/sdk

# 3. Vytvoř api/mcp/brave.ts (viz kód výše)

# 4. Deploy
vercel deploy

# 5. Nastav env var
vercel env add BRAVE_API_KEY

# 6. V tvém projektu přidej .claude/mcp.json
# {
#   "mcpServers": {
#     "brave": {
#       "url": "https://your-app.vercel.app/api/mcp/brave",
#       "transport": "http"
#     }
#   }
# }

# 7. Commit & push
git add .claude/mcp.json && git commit -m "Add remote MCP" && git push
```

---

## Troubleshooting

**Q: Server nefunguje**
A: Zkontroluj Vercel logs: `vercel logs`

**Q: API klíč nefunguje**
A: Ověř env vars: `vercel env ls`

**Q: CORS error**
A: Přidej CORS headers na server

**Q: Chci testovat lokálně**
A: `vercel dev` + ngrok pro HTTPS tunnel

---

## Další možnosti

### Multi-tool MCP Server

Jeden server může mít více tools:

```typescript
server.tool({ name: "web_search", ... });
server.tool({ name: "image_search", ... });
server.tool({ name: "news_search", ... });
```

### Více serverů

```json
{
  "mcpServers": {
    "brave": {
      "url": "https://your-app.vercel.app/api/mcp/brave"
    },
    "github": {
      "url": "https://your-app.vercel.app/api/mcp/github"
    }
  }
}
```

---

## Proč JEN toto řešení funguje

### ❌ Co NEFUNGUJE:

1. **Session start hooks** - vyžadují bash příkazy PŘED startem
2. **Environment variables** - nemůžeš je nastavit před inicializací containeru
3. **One-time secrets** - vyžadují stažení v hooku
4. **GitHub Actions proxy** - vyžadují `gh` CLI volání
5. **Cokoliv co vyžaduje interakci** během session startu

### ✅ Proč Remote MCP funguje:

1. Container **POUZE přečte** `.claude/mcp.json` z Gitu
2. **Automaticky se připojí** k URL v konfiguraci
3. **Žádná bash interakce** není potřeba
4. API klíče jsou **na tvém serveru**, ne v containeru
5. **100% pasivní** z pohledu containeru

---

## Odkazy

- [MCP Remote Servers Specification](https://modelcontextprotocol.io/docs/develop/connect-remote-servers)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Railway Deployment](https://docs.railway.app)
- [Cloudflare Workers](https://workers.cloudflare.com)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

---

**Poslední aktualizace:** 2025-11-15
**Pro:** Anthropic Claude Code Remote Environment

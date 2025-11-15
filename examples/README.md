# 🔐 Bezpečný Remote MCP - Příklady a Guides

Kompletní reference pro deployment a zabezpečení Remote MCP serverů v Anthropic remote containerech.

---

## 📁 Obsah tohoto adresáře

| Soubor | Popis | Začni zde |
|--------|-------|-----------|
| **deploy-guide.md** | Krok-za-krokem deployment guide (10 min) | ⭐ START |
| **secure-mcp-server.ts** | Production-ready MCP server s autentizací | Zkopíruj do projektu |
| **.claude-mcp-examples.json** | Příklady MCP config pro různé scenáře | Reference |

---

## 🚀 Quick Start (10 minut)

### 1. Přečti Deploy Guide

```bash
cat deploy-guide.md
```

**Naučíš se:**
- ✅ Jak vytvořit a deployovat MCP server
- ✅ Jak nastavit autentizaci
- ✅ Jak nakonfigurovat Claude Code
- ✅ Jak monitorovat a debugovat

### 2. Zkopíruj Server Kód

```bash
# Vytvoř nový projekt
npx create-next-app@latest my-mcp-server
cd my-mcp-server

# Zkopíruj secure server
mkdir -p pages/api/mcp
cp ../secure-mcp-server.ts pages/api/mcp/index.ts

# Install dependencies
npm install @modelcontextprotocol/sdk
```

### 3. Deploy

```bash
# Deploy na Vercel
npx vercel

# Nastav secrets
npx vercel env add MCP_AUTH_TOKEN
npx vercel env add BRAVE_API_KEY

# Redeploy s env vars
npx vercel --prod
```

### 4. Nakonfiguruj Claude

```bash
# V tvém projektu
cd ~/cac-test

# Vytvoř config (použij svůj URL a token)
cat > .claude/mcp.json << 'EOF'
{
  "mcpServers": {
    "secure-brave": {
      "url": "https://your-app.vercel.app/api/mcp",
      "transport": "http",
      "headers": {
        "Authorization": "Bearer your-token-here"
      }
    }
  }
}
EOF

# Commit
git add .claude/mcp.json
git commit -m "Add secure MCP"
git push
```

### 5. Test!

Spusť novou Claude Code session a zkus:

```
Search for "claude code documentation" using web search
```

✅ Claude teď má přístup k Brave Search přes tvůj secure MCP server!

---

## 📚 Dokumentace

### Hlavní guides

1. **[REMOTE_MCP_SOLUTION.md](../REMOTE_MCP_SOLUTION.md)**
   - Proč Remote MCP je jediné řešení
   - Architektura
   - Basic implementation

2. **[MCP_SECURITY_GUIDE.md](../MCP_SECURITY_GUIDE.md)**
   - 5 bezpečnostních úrovní
   - Autentizace patterns
   - Best practices
   - Incident response

3. **[deploy-guide.md](./deploy-guide.md)**
   - Praktický deployment
   - Troubleshooting
   - Monitoring

### Reference implementace

4. **[secure-mcp-server.ts](./secure-mcp-server.ts)**
   - Production-ready kód
   - Bearer token auth
   - Rate limiting
   - Comprehensive logging
   - Error handling

5. **[.claude-mcp-examples.json](./.claude-mcp-examples.json)**
   - Config příklady
   - Security levels
   - Troubleshooting tips

---

## 🔒 Bezpečnostní přehled

### ✅ Co je bezpečné

```json
{
  "mcpServers": {
    "brave": {
      "url": "https://your-app.vercel.app/api/mcp",
      "transport": "http",
      "headers": {
        "Authorization": "Bearer public-auth-token-abc123"
      }
    }
  }
}
```

**Proč:**
- ✅ API klíče (BRAVE_API_KEY) jsou na Vercelu, NE v Gitu
- ✅ Auth token v .claude/mcp.json je public - slouží jen k identifikaci
- ✅ Server kontroluje token a rate limiting
- ✅ Všechno přes HTTPS

### ❌ Co je NEBEZPEČNÉ

```json
{
  "mcpServers": {
    "brave": {
      "url": "https://your-app.vercel.app/api/mcp",
      "transport": "http",
      "headers": {
        "X-Brave-API-Key": "BSA123456789..."  // ❌ NIKDY!
      }
    }
  }
}
```

**Proč:**
- ❌ API klíč v .claude/mcp.json → veřejný v Gitu → leaked!
- ❌ Kdokoliv může použít tvůj API klíč
- ❌ Unlimited rate limit → vysoké náklady

---

## 🏗️ Architektura

```
┌────────────────────────────────────┐
│ Anthropic Remote Container        │
│ (DYNAMIC, NO CONTROL)              │
│                                    │
│  ┌──────────────────────────────┐ │
│  │ Claude Code                  │ │
│  │  ↓ reads .claude/mcp.json    │ │
│  │ MCP Client                   │ │
│  └──────────────────────────────┘ │
└────────────┬───────────────────────┘
             │
             │ HTTPS + Bearer Token
             ↓
┌────────────────────────────────────┐
│ Your Vercel Deployment             │
│ (YOU HAVE FULL CONTROL)            │
│                                    │
│  ┌──────────────────────────────┐ │
│  │ MCP Server                   │ │
│  │  - Bearer auth check         │ │
│  │  - Rate limiting             │ │
│  │  - Logging                   │ │
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │ Environment Variables        │ │
│  │  - MCP_AUTH_TOKEN            │ │
│  │  - BRAVE_API_KEY 🔑          │ │
│  │  - GITHUB_TOKEN 🔑           │ │
│  └──────────────────────────────┘ │
└────────────┬───────────────────────┘
             │
             │ HTTPS + API Key
             ↓
┌────────────────────────────────────┐
│ External APIs                      │
│  - Brave Search                    │
│  - GitHub API                      │
│  - Your databases                  │
│  - ...                             │
└────────────────────────────────────┘
```

**Klíčové principy:**
1. 🔑 **Secrets zůstávají na serveru** (Vercel env vars)
2. 🔓 **Public auth token** v .claude/mcp.json (identifikace, ne autentizace)
3. 🛡️ **Server kontroluje** rate limits a auth
4. 📊 **Server loguje** všechny requesty

---

## 🎯 Use Cases

### 1. Web Search (Brave API)

```typescript
// secure-mcp-server.ts už obsahuje
server.tool({
  name: "web_search",
  description: "Search the web using Brave Search API",
  handler: async ({ query }) => {
    const BRAVE_API_KEY = process.env.BRAVE_API_KEY!;
    // ... volání Brave API
  }
});
```

### 2. GitHub Integration

```typescript
server.tool({
  name: "list_repos",
  description: "List GitHub repositories",
  handler: async () => {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;

    const response = await fetch('https://api.github.com/user/repos', {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    return await response.json();
  }
});
```

### 3. Database Access

```typescript
server.tool({
  name: "query_database",
  description: "Query internal database",
  handler: async ({ sql }) => {
    const DB_CONNECTION = process.env.DATABASE_URL!;

    // Použij parametrizované queries proti SQL injection!
    const result = await db.query(sql);

    return result;
  }
});
```

### 4. Internal APIs

```typescript
server.tool({
  name: "get_user_data",
  description: "Fetch user data from internal API",
  handler: async ({ userId }) => {
    const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY!;

    const response = await fetch(`https://api.internal.com/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${INTERNAL_API_KEY}`
      }
    });

    return await response.json();
  }
});
```

---

## 🔄 Maintenance

### Token Rotation (každých 30-90 dní)

```bash
# 1. Generuj nový token
NEW_TOKEN=$(openssl rand -base64 32)

# 2. Update na Vercel
vercel env rm MCP_AUTH_TOKEN production
vercel env add MCP_AUTH_TOKEN production
# (zadej $NEW_TOKEN)

# 3. Redeploy
vercel --prod

# 4. Update všechny projekty s .claude/mcp.json
# ... update Authorization header ...

# 5. Commit & push
```

### Monitoring Checklist

Každý týden zkontroluj:
- ✅ Vercel logs: `vercel logs | grep SECURITY`
- ✅ Rate limit hits: `vercel logs | grep "Rate limit"`
- ✅ API usage: Brave/GitHub dashboard
- ✅ Error rate: `vercel logs | grep ERROR`

---

## 💡 Tips & Tricks

### Multi-environment setup

```json
// .claude/mcp.staging.json
{
  "mcpServers": {
    "brave": {
      "url": "https://mcp-staging.vercel.app/api/mcp",
      "headers": {
        "Authorization": "Bearer staging-token-xyz"
      }
    }
  }
}

// .claude/mcp.production.json
{
  "mcpServers": {
    "brave": {
      "url": "https://mcp-prod.your-domain.com/api/mcp",
      "headers": {
        "Authorization": "Bearer prod-token-abc"
      }
    }
  }
}
```

Pak:
```bash
# Test ve staging
cp .claude/mcp.staging.json .claude/mcp.json
git commit -m "Test in staging"

# Deploy do production
cp .claude/mcp.production.json .claude/mcp.json
git commit -m "Deploy to production"
```

### Local development

```bash
# Spusť server lokálně
cd my-mcp-server
vercel dev

# V jiném terminálu, vytvoř HTTPS tunnel
ngrok http 3000

# Use ngrok URL v .claude/mcp.json
{
  "mcpServers": {
    "local-dev": {
      "url": "https://abc123.ngrok.io/api/mcp",
      "headers": {
        "Authorization": "Bearer dev-token"
      }
    }
  }
}
```

---

## 🆘 Support

**Problém s deployment?**
1. Přečti [Troubleshooting](./deploy-guide.md#troubleshooting)
2. Zkontroluj [Security Guide](../MCP_SECURITY_GUIDE.md)
3. Podívej se na [examples](./.claude-mcp-examples.json)

**Security incident?**
1. Okamžitě rotuj všechny tokeny
2. Zkontroluj logs: `vercel logs`
3. Disable server: `vercel env rm MCP_AUTH_TOKEN`
4. Investigate & fix
5. Redeploy s novými tokeny

**Další otázky?**
- [MCP Documentation](https://modelcontextprotocol.io)
- [Vercel Support](https://vercel.com/support)

---

**Poslední aktualizace:** 2025-11-15
**Licence:** MIT
**Autor:** Claude Code Security Team

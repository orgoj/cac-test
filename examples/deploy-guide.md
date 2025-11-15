# 🚀 Deploy Guide: Bezpečný MCP Server

## Quick Start (10 minut)

### Krok 1: Vytvoř projekt

```bash
# Vytvoř nový Next.js projekt
npx create-next-app@latest my-secure-mcp
cd my-secure-mcp

# Nainstaluj dependencies
npm install @modelcontextprotocol/sdk
```

### Krok 2: Zkopíruj server kód

```bash
# Vytvoř API endpoint
mkdir -p pages/api/mcp
cp ../examples/secure-mcp-server.ts pages/api/mcp/index.ts
```

### Krok 3: Vygeneruj bezpečný token

```bash
# Generuj silný random token
openssl rand -base64 32

# Výstup (příklad):
# Xk7mP9vQ2wN8jL4hR5tY6uI1oE3sA0gF9dH8cV7bN6m=
```

**💾 Ulož si tento token! Budeš ho potřebovat 2x:**
1. Pro Vercel environment variable
2. Pro `.claude/mcp.json`

### Krok 4: Deploy na Vercel

```bash
# Inicializuj Git repo (pokud není)
git init
git add .
git commit -m "Initial commit"

# Deploy na Vercel
npx vercel

# Odpověz na otázky:
# ? Set up and deploy "~/my-secure-mcp"? [Y/n] y
# ? Which scope? Your account
# ? Link to existing project? [y/N] n
# ? What's your project's name? my-secure-mcp
# ? In which directory is your code located? ./
```

**Získáš URL jako:**
```
https://my-secure-mcp.vercel.app
```

### Krok 5: Nastav environment variables

```bash
# Nastav MCP auth token
npx vercel env add MCP_AUTH_TOKEN
? What's the value? Xk7mP9vQ2wN8jL4hR5tY6uI1oE3sA0gF9dH8cV7bN6m=
? Add to which environments? Production, Preview, Development

# Nastav Brave API klíč
npx vercel env add BRAVE_API_KEY
? What's the value? BSA... (tvůj Brave Search API klíč)
? Add to which environments? Production, Preview, Development
```

### Krok 6: Redeploy s novými env vars

```bash
npx vercel --prod
```

### Krok 7: Testuj server

```bash
# Test bez autentizace (mělo by selhat)
curl https://my-secure-mcp.vercel.app/api/mcp

# Výstup:
# {"error":"Missing Authorization header"}

# Test s autentizací (mělo by fungovat)
curl -X POST \
  -H "Authorization: Bearer Xk7mP9vQ2wN8jL4hR5tY6uI1oE3sA0gF9dH8cV7bN6m=" \
  -H "Content-Type: application/json" \
  -d '{"method":"tools/list"}' \
  https://my-secure-mcp.vercel.app/api/mcp

# Výstup:
# {"tools":[{"name":"web_search","description":"Search the web using Brave Search API",...}]}
```

### Krok 8: Nakonfiguruj Claude Code

V tvém projektu (ne v my-secure-mcp):

```bash
cd ~/cac-test

# Vytvoř .claude/mcp.json
cat > .claude/mcp.json << 'EOF'
{
  "mcpServers": {
    "secure-brave-search": {
      "url": "https://my-secure-mcp.vercel.app/api/mcp",
      "transport": "http",
      "headers": {
        "Authorization": "Bearer Xk7mP9vQ2wN8jL4hR5tY6uI1oE3sA0gF9dH8cV7bN6m="
      }
    }
  }
}
EOF
```

**⚠️ POZOR:** Token v `.claude/mcp.json` je veřejný! Proto:
- Použij **rozdílný token** než pro API klíče
- Token slouží jen k identifikaci "legit" requestů
- **Skutečné secrets** (Brave API klíč) jsou na Vercelu

### Krok 9: Commit & Push

```bash
git add .claude/mcp.json
git commit -m "Add secure MCP configuration"
git push
```

### Krok 10: Spusť Claude Code

Při příští Claude Code session:
- Container přečte `.claude/mcp.json`
- Připojí se k tvému MCP serveru
- ✅ Claude má přístup k Brave Search!

---

## 🔍 Monitoring & Debugging

### Sleduj logy v reálném čase

```bash
npx vercel logs --follow
```

**Uvidíš:**
```
[MCP] Authorized request: { ip: '52.20.x.x', method: 'POST', ... }
[MCP] web_search called: { query: 'claude code documentation', count: 10 }
[MCP] web_search success: { query: '...', resultsCount: 10 }
[MCP] Request completed: { ip: '52.20.x.x', duration: '234ms', status: 200 }
```

### Zkontroluj neautorizované pokusy

```bash
npx vercel logs | grep SECURITY
```

**Výstup:**
```
[SECURITY] Invalid token attempt: { ip: 'x.x.x.x', timestamp: '...', ... }
[SECURITY] Rate limit exceeded: { ip: 'x.x.x.x', timestamp: '...' }
```

### Analytics

1. **Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Analytics → Usage

2. **Custom tracking:**
   - Přidej Datadog/Sentry (viz MCP_SECURITY_GUIDE.md)

---

## 🔄 Token Rotation

**Kdy rotovat token:**
- Každých 30-90 dní (preventivně)
- Podezřelá aktivita v lozích
- Po security incidentu

**Jak rotovat:**

```bash
# 1. Vygeneruj nový token
NEW_TOKEN=$(openssl rand -base64 32)
echo $NEW_TOKEN

# 2. Aktualizuj na Vercelu
npx vercel env rm MCP_AUTH_TOKEN production
npx vercel env add MCP_AUTH_TOKEN production
# Zadej nový token

# 3. Redeploy
npx vercel --prod

# 4. Aktualizuj .claude/mcp.json v projektech
# (všechny projekty, které používají tento MCP server)

# 5. Commit & push
git add .claude/mcp.json
git commit -m "Rotate MCP auth token"
git push
```

---

## 🛡️ Security Checklist

Před spuštěním do produkce:

- ✅ Použit silný random token (min. 32 bytů)
- ✅ Token uložen v Vercel env vars
- ✅ Rate limiting aktivní
- ✅ Security headers nastaveny
- ✅ Logování zapnuto
- ✅ Brave API klíč je **read-only** (pokud možné)
- ✅ Monitoring nastaven
- ✅ Token rotation plán (každých 30-90 dní)
- ✅ Tested unauthorized access (vrací 401)
- ✅ Tested rate limiting (vrací 429)

---

## 🐛 Troubleshooting

### Server vrací 401 i s correct tokenem

**Příčina:** Token nesedí na serveru a v config.

**Řešení:**
```bash
# Zkontroluj env var na Vercelu
npx vercel env ls

# Zkontroluj hodnotu
npx vercel env pull .env.local
cat .env.local | grep MCP_AUTH_TOKEN
```

### Rate limiting je moc přísný

**Řešení:** Uprav konstanty v `secure-mcp-server.ts`:

```typescript
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 min → 60 min
const RATE_LIMIT_MAX = 100; // 100 → 1000
```

Deploy:
```bash
git commit -am "Increase rate limits"
npx vercel --prod
```

### CORS error z browseru

**Příčina:** Voláš MCP endpoint z browseru.

**Řešení:** MCP servery jsou jen pro MCP klienty (Claude), ne pro browsery.

Pokud **opravdu** chceš umožnit browser access, přidej CORS headers:

```typescript
headers: {
  'Access-Control-Allow-Origin': 'https://your-frontend.com',
  // NE '*' - to je security riziko!
}
```

### Vercel deploy selhává

**Příčina 1:** Chybí dependencies

```bash
npm install --save @modelcontextprotocol/sdk
git commit -am "Add MCP SDK"
```

**Příčina 2:** TypeScript errors

```bash
npm run build
# Oprav errory
```

---

## 💰 Náklady

### Vercel
- **Hobby tier:** ZDARMA (dostatečné pro většinu use cases)
- Limity:
  - 100 GB bandwidth/měsíc
  - 100 GB-hours function execution/měsíc

### Brave Search API
- **Free tier:** 2,000 queries/měsíc ZDARMA
- **Paid:** $5/měsíc za 20,000 queries

### Celkem
**0-5 USD/měsíc** pro typické použití!

---

## 📚 Další zdroje

- [Vercel Documentation](https://vercel.com/docs)
- [MCP Security Guide](../MCP_SECURITY_GUIDE.md)
- [Remote MCP Solution](../REMOTE_MCP_SOLUTION.md)
- [MCP Protocol Spec](https://modelcontextprotocol.io/docs)

---

**Poslední aktualizace:** 2025-11-15

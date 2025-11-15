# 🚀 Quick IP Discovery - Když neznáš Anthropic IP

**Problém:** Nevíš jaké IP adresy používá Anthropic Claude Code remote container.

**Řešení:** 3 rychlé metody jak zjistit IP bez předchozích znalostí.

---

## Metoda 1: IP Discovery Endpoint (5 minut)

### Krok 1: Deploy discovery endpoint

```bash
# Vytvoř minimální projekt
mkdir ip-discovery && cd ip-discovery

# Vytvoř package.json
cat > package.json << 'EOF'
{
  "name": "ip-discovery",
  "version": "1.0.0"
}
EOF

# Vytvoř discovery endpoint
mkdir -p api
cat > api/discover.ts << 'EOF'
export default async function handler(req: Request) {
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
                   req.headers.get('x-real-ip') ||
                   'unknown';

  console.log('[IP-DISCOVERY]', {
    ip: clientIp,
    timestamp: new Date().toISOString()
  });

  return new Response(JSON.stringify({
    yourIp: clientIp,
    timestamp: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
EOF

# Deploy na Vercel
npx vercel
```

**URL:** `https://your-project.vercel.app/api/discover`

### Krok 2: Zavolej z Claude Code

V Claude Code session:

```bash
curl https://your-project.vercel.app/api/discover
```

**Response:**
```json
{
  "yourIp": "52.20.123.45",
  "timestamp": "2025-11-15T..."
}
```

### Krok 3: Zjisti CIDR range

```bash
# Option A: Online nástroj
# Jdi na https://www.whatismyip.com/ip-whois-lookup/
# Zadej: 52.20.123.45

# Option B: whois command
whois 52.20.123.45 | grep -i cidr

# Výstup:
# CIDR: 52.20.0.0/14
```

### Krok 4: Použij v MCP serveru

```typescript
// pages/api/mcp/index.ts
const ANTHROPIC_IP_RANGES = [
  '52.20.0.0/14',  // <- Tvoje zjištěná IP range
];
```

**✅ Hotovo!**

---

## Metoda 2: Adaptive Server (NEJJEDNODUŠŠÍ)

**Koncept:** Server si sám "naučí" whitelisted IPs při prvním requestu.

### Krok 1: Deploy adaptive server

```bash
# Zkopíruj adaptive-mcp-server.ts z examples/
cp examples/adaptive-mcp-server.ts pages/api/mcp/index.ts

# Deploy
npx vercel

# Nastav env vars
npx vercel env add BRAVE_API_KEY
npx vercel env add ONE_TIME_CODE
# Zadej: bootstrap-12345 (nebo jiný secret)
```

### Krok 2: První request s one-time code

V projektu vytvoř `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "brave": {
      "url": "https://your-app.vercel.app/api/mcp",
      "transport": "http",
      "headers": {
        "X-One-Time-Code": "bootstrap-12345"
      }
    }
  }
}
```

### Krok 3: Commit, push, test

```bash
git add .claude/mcp.json
git commit -m "Add adaptive MCP (with bootstrap code)"
git push

# Spusť Claude Code session
# První request: Server whitelistne tvoji IP
# Zkontroluj logy:
vercel logs | grep "New IP whitelisted"

# Výstup:
# [SECURITY] 🎉 New IP whitelisted: { ip: '52.20.123.45', ... }
```

### Krok 4: Smaž bootstrap code

Teď když je IP whitelistu, smaž one-time code z konfigurace:

```json
{
  "mcpServers": {
    "brave": {
      "url": "https://your-app.vercel.app/api/mcp",
      "transport": "http"
    }
  }
}
```

```bash
git commit -am "Remove bootstrap code (IP whitelisted)"
git push
```

**✅ Zero secrets v Gitu!**

**Výhody:**
- ✅ Nevyžaduje předchozí znalost IP
- ✅ Automaticky whitelistuje při prvním použití
- ✅ Bootstrap code jen v první verzi (smažeš po první session)
- ✅ Pak již žádné credentials v Gitu

---

## Metoda 3: Permissive Start + Manual Lock

**Koncept:** Start bez whitelistu, pak postupně přidávej IPs.

### Krok 1: Deploy s logging-only режимом

```typescript
// pages/api/mcp/index.ts

const WHITELIST_ENABLED = process.env.WHITELIST_ENABLED === 'true';
const KNOWN_IPS = new Set<string>();

export default async function handler(req: Request) {
  const clientIp = getClientIp(req);

  // Loguj VŠECHNY IPs
  console.info('[IP-TRACKING]', {
    ip: clientIp,
    timestamp: new Date().toISOString(),
    userAgent: req.headers.get('user-agent')
  });

  // Pokud whitelist není enabled, povol všechno (POZOR!)
  if (!WHITELIST_ENABLED) {
    console.warn('[SECURITY] ⚠️ Whitelist disabled - allowing all IPs!');
    // ... process MCP request ...
  }

  // Pokud whitelist je enabled, kontroluj
  if (!KNOWN_IPS.has(clientIp)) {
    return new Response('Forbidden', { status: 403 });
  }

  // ... process MCP request ...
}
```

### Krok 2: Deploy bez whitelistu

```bash
npx vercel
npx vercel env add BRAVE_API_KEY
npx vercel env add WHITELIST_ENABLED
# Zadej: false
```

### Krok 3: Použij Claude Code + sleduj logy

```bash
# V jiném terminálu
vercel logs --follow | grep IP-TRACKING

# Uvidíš:
# [IP-TRACKING] { ip: '52.20.123.45', timestamp: '...' }
# [IP-TRACKING] { ip: '52.20.123.46', timestamp: '...' }
# [IP-TRACKING] { ip: '52.20.123.47', timestamp: '...' }
```

### Krok 4: Enable whitelist

Po pár sessionech, když máš všechny IPs:

```typescript
const ANTHROPIC_IP_RANGES = [
  '52.20.0.0/14',  // Range covering 52.20.123.45-47
];
```

```bash
# Enable whitelist
vercel env rm WHITELIST_ENABLED production
vercel env add WHITELIST_ENABLED production
# Zadej: true

# Redeploy
npx vercel --prod
```

**⚠️ VAROVÁNÍ:** Metoda 3 je riskantnější - permissive mode znamená že kdokoliv může volat server během discovery fáze!

---

## Srovnání metod

| Metoda | Setup Time | Security Risk | Zero Secrets |
|--------|------------|---------------|--------------|
| **1. Discovery Endpoint** | 5 min | ✅ Low | ✅ Yes |
| **2. Adaptive Server** | 10 min | ✅ Low | ✅ Yes (po bootstrap) |
| **3. Permissive Start** | 5 min | ❌ High (dočasně) | ✅ Yes |

**Doporučení:**
- **Pro produkci:** Metoda 1 nebo 2
- **Pro rychlý test:** Metoda 1
- **Pro production bez předchozích znalostí:** Metoda 2

---

## Praktický workflow: Metoda 2 (Adaptive)

```bash
# === SETUP (JEDNOU) ===

# 1. Deploy adaptive server
npx create-next-app my-mcp && cd my-mcp
cp path/to/adaptive-mcp-server.ts pages/api/mcp/index.ts
npm install @modelcontextprotocol/sdk
npx vercel
npx vercel env add BRAVE_API_KEY
npx vercel env add ONE_TIME_CODE  # např. "init-xyz789"
npx vercel env add ADMIN_TOKEN    # např. "admin-abc123" (optional)

# 2. První config S bootstrap code
cat > .claude/mcp.json << 'EOF'
{
  "mcpServers": {
    "brave": {
      "url": "https://my-mcp.vercel.app/api/mcp",
      "headers": {
        "X-One-Time-Code": "init-xyz789"
      }
    }
  }
}
EOF

git add .claude/mcp.json
git commit -m "Add MCP with bootstrap"
git push

# === PRVNÍ SESSION ===

# 3. Spusť Claude Code
# Server whitelistne IP automaticky

# 4. Zkontroluj logy
vercel logs | grep "New IP whitelisted"

# === CLEANUP ===

# 5. Smaž bootstrap code
cat > .claude/mcp.json << 'EOF'
{
  "mcpServers": {
    "brave": {
      "url": "https://my-mcp.vercel.app/api/mcp"
    }
  }
}
EOF

git commit -am "Remove bootstrap (IP whitelisted)"
git push

# === HOTOVO ===
# ✅ Zero secrets v Gitu
# ✅ IP automaticky whitelistnutá
# ✅ Další sessions: bez jakékoliv autentizace
```

---

## Monitoring whitelisted IPs

```bash
# Check admin endpoint (pokud jsi nastavil ADMIN_TOKEN)
curl -H "Authorization: Bearer admin-abc123" \
  https://my-mcp.vercel.app/api/mcp/admin

# Response:
{
  "whitelistedIPs": ["52.20.123.45", "52.20.123.46"],
  "pendingIPs": {},
  "stats": {
    "totalWhitelisted": 2,
    "totalPending": 0
  }
}
```

---

## Troubleshooting

### Problém: Server vrací 401 po smazání bootstrap code

**Příčina:** IP nebyla whitelistnutá (první request selhal).

**Řešení:**
```bash
# Přidej bootstrap code zpět
# Zkus znovu
# Zkontroluj logy že IP byla whitelistnutá
```

### Problém: Vidím více IPs

**Příčina:** Anthropic používá load balancer.

**Řešení:**
```bash
# Zjisti CIDR range všech IPs
whois 52.20.123.45 | grep CIDR
whois 52.20.123.46 | grep CIDR

# Pokud jsou ze stejného range, použij range místo individual IPs
# Jinak: přidej všechny do whitelistu
```

### Problém: IP se mění každou session

**Příčina:** Rotující IP pool.

**Řešení:**
```bash
# Použij adaptive server - automaticky přidá nové IPs (s bootstrap code)
# Nebo zjisti celý IP range a whitelist range místo individual IPs
```

---

## Next Steps

Po zjištění IP:

1. **Přejdi na pevný IP whitelist** (pro lepší security)
   - Zkopíruj `ip-whitelisted-mcp-server.ts`
   - Přidej zjištěné ranges do `ANTHROPIC_IP_RANGES`
   - Deploy

2. **Nastav monitoring**
   - Alert na nové IPs (mimo whitelist)
   - Dashboard s whitelisted IPs

3. **Dokumentuj**
   - Které IP ranges jsou Anthropic
   - Kdy je revalidovat
   - Kdo má přístup

---

**Poslední aktualizace:** 2025-11-15
**Doporučená metoda:** Adaptive Server (Metoda 2)

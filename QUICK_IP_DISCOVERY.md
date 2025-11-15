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

## Metoda 2: Progressive Whitelist (START ŠIROCE, ZÚŽI POSTUPNĚ)

**Koncept:** Start s širokými AWS IP ranges, postupně zužuj basované na skutečných IPs v lozích.

**✅ Zero secrets v Git od začátku!**

### Krok 1: Deploy s AWS ranges

```bash
# Zkopíruj progressive-whitelist-mcp-server.ts
cp examples/progressive-whitelist-mcp-server.ts pages/api/mcp/index.ts

# Deploy
npx vercel
npx vercel env add BRAVE_API_KEY
npx vercel env add ADMIN_TOKEN  # pro monitoring (optional)
```

### Krok 2: Config BEZ JAKÝCHKOLIV SECRETS

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
git add .claude/mcp.json
git commit -m "Add MCP (zero secrets)"
git push
```

### Krok 3: Použij & sleduj real IPs

```bash
# Spusť Claude Code sessions
# Server trackuje všechny real IPs

# Zkontroluj observed IPs
vercel logs | grep "New Anthropic IP observed"

# Výstup:
# [TRACKING] 🆕 New Anthropic IP observed: {
#   ip: '52.20.123.45',
#   allObserved: ['52.20.123.45', '52.20.123.46']
# }
```

### Krok 4: Zúži ranges (optional)

Po několika sessionách:

```typescript
// Původní (široké)
const INITIAL_IP_RANGES = [
  '52.20.0.0/14',  // Celý AWS range
  '54.80.0.0/13',
];

// Zúžené (basované na observed IPs)
const INITIAL_IP_RANGES = [
  '52.20.123.0/24',  // Jen skutečně používaný subnet
];
```

**Výhody:**
- ✅ Zero secrets v Git od začátku
- ✅ Funguje okamžitě (AWS ranges)
- ✅ Postupné zpřísňování basované na real data
- ✅ Tracking real IPs pro budoucí optimalizaci

**Nevýhody:**
- ⚠️ Široké ranges na začátku (zahrnují i jiné AWS uživatele)
- ⚠️ Není ideální security na začátku

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

| Metoda | Setup Time | Security Risk | Zero Secrets (od začátku) | Doporučení |
|--------|------------|---------------|---------------------------|------------|
| **1. Discovery Endpoint** | 5 min discovery + 5 min deploy | ✅ Low | ✅ Yes | ⭐⭐⭐⭐⭐ BEST |
| **2. Progressive Whitelist** | 5 min | ⚠️ Medium (široké ranges) | ✅ Yes | ⭐⭐⭐⭐ Good |
| **3. Permissive Start** | 5 min | ❌ High (dočasně) | ✅ Yes | ⭐⭐ Last resort |

**Jasné doporučení:**
- **Pro produkci:** Metoda 1 (Discovery → Static whitelist)
- **Pro rychlý start:** Metoda 2 (Progressive whitelist)
- **Nikdy nepoužívej:** Adaptive server s bootstrap code v Gitu!

---

## Praktický workflow: Metoda 1 (Discovery → Static) - DOPORUČENO

```bash
# === FÁZE 1: DISCOVERY (5 min) ===

# 1. Deploy discovery endpoint
mkdir ip-discovery && cd ip-discovery
cat > api/discover.ts << 'EOF'
export default async function handler(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  console.log('[IP-DISCOVERY]', ip, new Date().toISOString());
  return new Response(JSON.stringify({
    yourIp: ip,
    timestamp: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
EOF

npx vercel

# 2. Z Claude Code zavolej endpoint
curl https://your-discovery.vercel.app/api/discover

# Nebo sleduj logy
vercel logs --follow

# Výstup:
# [IP-DISCOVERY] 52.20.123.45 2025-11-15T...

# 3. Opakuj několikrát (různé sessions) pro zjištění všech IPs

# 4. Zjisti CIDR ranges
whois 52.20.123.45 | grep CIDR
# CIDR: 52.20.0.0/14

# === FÁZE 2: PRODUCTION MCP SERVER (5 min) ===

# 5. Deploy MCP server s pevnými IP ranges
npx create-next-app my-mcp && cd my-mcp
npm install @modelcontextprotocol/sdk ipaddr.js

# Zkopíruj ip-whitelisted-mcp-server.ts
cp path/to/ip-whitelisted-mcp-server.ts pages/api/mcp/index.ts

# Update IP ranges (basované na discovery)
# const ANTHROPIC_IP_RANGES = ['52.20.0.0/14'];

npx vercel
npx vercel env add BRAVE_API_KEY

# 6. Config - ZERO SECRETS!
cat > .claude/mcp.json << 'EOF'
{
  "mcpServers": {
    "brave": {
      "url": "https://my-mcp.vercel.app/api/mcp"
    }
  }
}
EOF

git add .claude/mcp.json
git commit -m "Add MCP (zero secrets, static IP whitelist)"
git push

# === HOTOVO ===
# ✅ Zero secrets v Gitu (od začátku!)
# ✅ Pevný IP whitelist (nejvyšší security)
# ✅ Žádné dočasné credentials
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

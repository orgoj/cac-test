# 🔍 Jak zjistit Anthropic IP Ranges

Pro IP whitelisting potřebuješ znát IP adresy, ze kterých Claude Code v remote containeru volá tvůj MCP server.

---

## Metoda 1: Experimentální zjištění (DOPORUČENO)

### Krok 1: Deploy test endpoint

```typescript
// api/test/ip-logger.ts
export default async function handler(req: Request) {
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] ||
                   req.headers.get('x-real-ip') ||
                   'unknown';

  console.log('[IP-LOGGER]', {
    ip: clientIp,
    timestamp: new Date().toISOString(),
    headers: {
      'x-forwarded-for': req.headers.get('x-forwarded-for'),
      'x-real-ip': req.headers.get('x-real-ip'),
      'user-agent': req.headers.get('user-agent')
    }
  });

  return new Response(JSON.stringify({
    yourIp: clientIp,
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
```

### Krok 2: Deploy

```bash
vercel deploy
```

### Krok 3: Test z Claude Code

V Claude Code session:

```bash
curl https://your-app.vercel.app/api/test/ip-logger
```

### Krok 4: Zkontroluj logy

```bash
vercel logs --follow | grep IP-LOGGER
```

**Výstup:**
```
[IP-LOGGER] {
  ip: '52.20.123.45',
  timestamp: '2025-11-15T...',
  headers: { ... }
}
```

### Krok 5: Opakuj několikrát

Spusť Claude Code v několika různých sessions a zaloguj všechny IP adresy.

**Možné výsledky:**
- Vždy stejná IP → whitelist jen tu IP
- Různé IPs ze stejného range → whitelist celý range
- Různé IPs z různých ranges → whitelist všechny ranges

### Krok 6: Identifikuj CIDR ranges

```bash
# Použij whois k zjištění range
whois 52.20.123.45 | grep CIDR

# Výstup například:
# CIDR: 52.20.0.0/14
```

---

## Metoda 2: Kontaktuj Anthropic Support

```
To: support@anthropic.com
Subject: Request for Claude Code IP Ranges

Hi Anthropic team,

I'm building a Remote MCP server for Claude Code and need to implement
IP whitelisting for security.

Could you please provide:
1. IP ranges used by Claude Code remote containers
2. Whether these ranges are stable or subject to change
3. Recommended approach for IP-based access control

Project: [tvůj projekt]
Use case: Secure MCP server with zero credentials in Git

Thanks!
```

---

## Metoda 3: AWS IP Ranges (fallback)

Anthropic běží na AWS, takže můžeš použít AWS public IP ranges.

### Stáhni AWS IP ranges

```bash
curl -o aws-ip-ranges.json https://ip-ranges.amazonaws.com/ip-ranges.json
```

### Filtruj relevantní ranges

```bash
# US-East (Anthropic primary region)
cat aws-ip-ranges.json | \
  jq -r '.prefixes[] | select(.region=="us-east-1" and .service=="EC2") | .ip_prefix' | \
  head -20

# Výstup:
# 52.20.0.0/14
# 54.0.0.0/8
# 18.0.0.0/8
# ...
```

### EU regions (pokud Anthropic expanduje)

```bash
cat aws-ip-ranges.json | \
  jq -r '.prefixes[] | select(.region=="eu-west-1" and .service=="EC2") | .ip_prefix' | \
  head -20
```

**⚠️ Varování:** AWS ranges jsou VELMI široké. Toto není ideální bezpečnostní řešení, protože zahrnuje i jiné AWS zákazníky.

---

## Metoda 4: Dynamické IP whitelisting

Pokud nemůžeš získat fixed IP ranges, použij hybrid approach:

### Server s auto-learning

```typescript
// api/mcp/adaptive.ts

// In-memory store (v produkci použij Redis/KV)
const knownGoodIPs = new Set<string>();

export default async function handler(req: Request) {
  const clientIp = getClientIp(req);

  // 1. Zkontroluj, jestli IP je známá
  if (knownGoodIPs.has(clientIp)) {
    // Known good IP, pokračuj
    return handleMcpRequest(req);
  }

  // 2. Neznámá IP - vyžaduj one-time authorization
  const authCode = req.headers.get('X-Auth-Code');

  if (!authCode) {
    return new Response(JSON.stringify({
      error: 'New IP detected',
      message: 'Please provide one-time auth code',
      ip: clientIp
    }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // 3. Ověř one-time code
  const isValidCode = await verifyOneTimeCode(authCode);

  if (!isValidCode) {
    return new Response('Invalid auth code', { status: 401 });
  }

  // 4. Přidej IP do whitelist
  knownGoodIPs.add(clientIp);
  console.info('[SECURITY] New IP whitelisted:', clientIp);

  // 5. Pokračuj s requestem
  return handleMcpRequest(req);
}
```

### Claude Config s one-time code

```json
// .claude/mcp.json
{
  "mcpServers": {
    "brave": {
      "url": "https://my-mcp.vercel.app/api/mcp/adaptive",
      "transport": "http",
      "headers": {
        "X-Auth-Code": "one-time-code-12345"
      }
    }
  }
}
```

**Workflow:**
1. První request s novým IP: Server vrátí 401
2. Přidáš `X-Auth-Code` do config
3. Commit & push
4. Další request: Server ověří code a whitelistne IP
5. Všechny další requesty z této IP: Automaticky povoleny
6. Smaž auth code z config

---

## Metoda 5: Použij CDN/Proxy s known IP

### Cloudflare jako proxy

```
Claude Code → Cloudflare → Tvůj server
              ^
              Known Cloudflare IPs
```

**Server:**
```typescript
// Whitelist Cloudflare IP ranges
const CLOUDFLARE_IPS = [
  '173.245.48.0/20',
  '103.21.244.0/22',
  '103.22.200.0/22',
  // ... všechny Cloudflare ranges
];

// Získej real client IP z Cloudflare header
const clientIp = req.headers.get('CF-Connecting-IP');
```

**Výhody:**
- ✅ Known Cloudflare IP ranges
- ✅ DDoS protection
- ✅ Analytics

**Nevýhody:**
- ❌ Extra hop
- ❌ Závislost na Cloudflare

---

## Praktická konfigurace

### Konservativní přístup (start malý, expanduj)

```typescript
// api/mcp/conservative.ts

const WHITELISTED_IPS = [
  // Začni prázdný
];

const PENDING_IPS = new Map<string, number>(); // IP → request count

export default async function handler(req: Request) {
  const clientIp = getClientIp(req);

  // Whitelisted IPs
  if (WHITELISTED_IPS.includes(clientIp)) {
    return handleMcpRequest(req);
  }

  // Track new IPs
  PENDING_IPS.set(clientIp, (PENDING_IPS.get(clientIp) || 0) + 1);

  console.warn('[PENDING-IP]', {
    ip: clientIp,
    count: PENDING_IPS.get(clientIp),
    userAgent: req.headers.get('user-agent')
  });

  return new Response(JSON.stringify({
    error: 'IP not yet whitelisted',
    ip: clientIp,
    message: 'Check server logs to whitelist this IP'
  }), {
    status: 403,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
```

**Workflow:**
1. Deploy server
2. Try MCP call from Claude Code
3. Zkontroluj logy: `vercel logs | grep PENDING-IP`
4. Přidej IP do `WHITELISTED_IPS`
5. Redeploy
6. ✅ Done

---

## Tools pro IP management

### ipaddr.js (JavaScript)

```bash
npm install ipaddr.js
```

```typescript
import ipaddr from 'ipaddr.js';

function isInRange(ip: string, range: string): boolean {
  const [rangeIp, cidr] = range.split('/');
  const addr = ipaddr.process(ip);
  const rangeAddr = ipaddr.process(rangeIp);
  return addr.match(rangeAddr, parseInt(cidr));
}

isInRange('52.20.123.45', '52.20.0.0/14'); // true
```

### ip-range-check (JavaScript)

```bash
npm install ip-range-check
```

```typescript
import inRange from 'ip-range-check';

inRange('52.20.123.45', '52.20.0.0/14'); // true
inRange('1.2.3.4', ['52.20.0.0/14', '54.0.0.0/8']); // false
```

### Online CIDR calculator

- https://www.ipaddressguide.com/cidr
- https://cidr.xyz/

---

## Bezpečnostní best practices

### Multi-layer defense

```typescript
export default async function handler(req: Request) {
  const clientIp = getClientIp(req);

  // Layer 1: Known bad IPs (blacklist)
  if (BLACKLISTED_IPS.includes(clientIp)) {
    return new Response('Forbidden', { status: 403 });
  }

  // Layer 2: IP whitelist
  if (!isInWhitelist(clientIp)) {
    return new Response('IP not whitelisted', { status: 403 });
  }

  // Layer 3: Rate limiting
  if (!checkRateLimit(clientIp)) {
    return new Response('Too many requests', { status: 429 });
  }

  // Layer 4: Optional light token
  const token = req.headers.get('X-Token');
  if (token && token !== process.env.LIGHT_TOKEN) {
    return new Response('Invalid token', { status: 401 });
  }

  // All checks passed
  return handleMcpRequest(req);
}
```

### Monitoring & alerting

```typescript
// Alert na neočekávané IPs
const EXPECTED_IP_COUNT = 5; // Očekáváš ~5 různých IPs

if (knownGoodIPs.size > EXPECTED_IP_COUNT * 2) {
  console.error('[ALERT] Unusual number of IPs:', knownGoodIPs.size);
  // Send alert (email, Slack, PagerDuty, ...)
}

// Alert na suspicious patterns
if (PENDING_IPS.get(clientIp) > 10) {
  console.error('[ALERT] IP attempting many requests:', clientIp);
}
```

---

## Troubleshooting

### Problém: IP se mění každou session

**Příčina:** Anthropic používá load balancer s rotujícími IPs.

**Řešení:** Whitelist celý IP range místo individual IPs.

### Problém: Nemůžu získat client IP

**Příčina:** Proxy/CDN neforwarduje IP headers.

**Řešení:** Zkontroluj headers:
```typescript
console.log('All headers:', Object.fromEntries(req.headers));
```

Hledej:
- `x-forwarded-for`
- `x-real-ip`
- `cf-connecting-ip` (Cloudflare)
- `true-client-ip`

### Problém: Whitelistnul jsem moc široký range

**Příčina:** Použil jseš celý AWS range místo Anthropic-specific.

**Řešení:** Zúzni range:
```typescript
// Příliš široké
'0.0.0.0/0' // Celý internet! ❌

// Lepší
'52.20.0.0/14' // Jeden AWS range ⚠️

// Nejlepší
'52.20.123.0/24' // Specific subnet ✅
```

---

**Tip:** Start s Metodou 1 (experimentální zjištění). Je nejpraktičtější a dává ti přesné IPs.

**Poslední aktualizace:** 2025-11-15

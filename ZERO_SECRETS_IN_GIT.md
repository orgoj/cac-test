# 🔐 Zero Secrets in Git - Pokročilá řešení

**Problém:** I když auth token v `.claude/mcp.json` není "secret" jako API klíč, **pořád je veřejný v Gitu** a kdokoliv s ním může volat tvůj server.

**Cíl:** MCP server bez JAKÝCHKOLIV credentials v Git repo.

---

## ✅ Řešení 1: IP Whitelisting (NEJLEPŠÍ pro remote container)

**Koncept:** Server přijímá POUZE requesty z Anthropic IP ranges. Žádný token není potřeba!

### Server implementace

```typescript
// api/mcp/ip-whitelisted.ts

const ANTHROPIC_IP_RANGES = [
  // Anthropic/AWS IP ranges - update podle dokumentace
  '52.20.0.0/14',      // AWS US-East
  '35.180.0.0/16',     // AWS EU
  '54.0.0.0/8',        // AWS General
  // ... další ranges
];

function isAnthropicIp(clientIp: string): boolean {
  // Implementace CIDR check
  const ipaddr = require('ipaddr.js');

  try {
    const addr = ipaddr.process(clientIp);

    return ANTHROPIC_IP_RANGES.some(range => {
      const [rangeIp, rangeCidr] = range.split('/');
      const rangeAddr = ipaddr.process(rangeIp);
      return addr.match(rangeAddr, parseInt(rangeCidr));
    });
  } catch (e) {
    return false;
  }
}

export default async function handler(req: Request) {
  // 1. Získej client IP
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] ||
                   req.headers.get('x-real-ip') ||
                   'unknown';

  // 2. Zkontroluj IP whitelist
  if (!isAnthropicIp(clientIp)) {
    console.error('[SECURITY] Blocked non-Anthropic IP:', {
      ip: clientIp,
      timestamp: new Date().toISOString()
    });

    return new Response('Forbidden', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  // 3. IP je OK, pokračuj s MCP serverem
  console.info('[SECURITY] Allowed Anthropic IP:', clientIp);

  const server = new StreamableHTTPServer({
    name: "ip-whitelisted-mcp",
    version: "1.0.0"
  });

  // ... tvoje MCP tools ...

  return server.handleRequest(req);
}
```

### Claude Config (ŽÁDNÝ TOKEN!)

```json
// .claude/mcp.json
{
  "mcpServers": {
    "brave-search": {
      "url": "https://my-mcp.vercel.app/api/mcp",
      "transport": "http"
    }
  }
}
```

**✅ Žádné credentials v Gitu!**

### Jak získat Anthropic IP ranges

**Možnost 1: Kontaktuj Anthropic support**
```
Subject: Request for Claude Code IP ranges
Body: Hi, I need IP ranges for IP whitelisting my MCP server...
```

**Možnost 2: Experimentální zjištění**
```bash
# V Claude Code session
curl https://api.ipify.org

# Loguj na serveru a sleduj IP adresy
vercel logs | grep "Allowed Anthropic IP"
```

**Možnost 3: AWS IP ranges (Anthropic běží na AWS)**
```bash
# Stáhni AWS IP ranges
curl https://ip-ranges.amazonaws.com/ip-ranges.json | \
  jq -r '.prefixes[] | select(.region=="us-east-1") | .ip_prefix'
```

### NPM balíček pro IP checking

```bash
npm install ipaddr.js ip-range-check
```

```typescript
import { inRange } from 'ip-range-check';

const isAllowed = inRange(clientIp, ANTHROPIC_IP_RANGES);
```

---

## ✅ Řešení 2: GitHub Actions + Ephemeral Tokens

**Koncept:** GitHub Action generuje dočasný token před každou session.

### Workflow

```yaml
# .github/workflows/generate-mcp-token.yml
name: Generate MCP Session Token

on:
  workflow_dispatch:
    inputs:
      duration_hours:
        description: 'Token validity in hours'
        required: false
        default: '24'

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Generate ephemeral token
        id: token
        run: |
          # Generuj token s expirací
          TOKEN=$(openssl rand -base64 32)
          EXPIRES_AT=$(date -u -d "+${{ github.event.inputs.duration_hours }} hours" +"%Y-%m-%dT%H:%M:%SZ")

          echo "token=$TOKEN" >> $GITHUB_OUTPUT
          echo "expires_at=$EXPIRES_AT" >> $GITHUB_OUTPUT

      - name: Store token in Vercel
        run: |
          # Ulož do Vercel KV store s expirací
          curl -X POST "https://my-mcp.vercel.app/api/admin/tokens" \
            -H "Authorization: Bearer ${{ secrets.ADMIN_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d '{
              "token": "${{ steps.token.outputs.token }}",
              "expiresAt": "${{ steps.token.outputs.expires_at }}"
            }'

      - name: Update MCP config
        run: |
          # Update .claude/mcp.json
          cat > .claude/mcp.json << EOF
          {
            "mcpServers": {
              "brave": {
                "url": "https://my-mcp.vercel.app/api/mcp",
                "transport": "http",
                "headers": {
                  "Authorization": "Bearer ${{ steps.token.outputs.token }}"
                }
              }
            }
          }
          EOF

      - name: Commit and push
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add .claude/mcp.json
          git commit -m "Update MCP token (expires: ${{ steps.token.outputs.expires_at }})"
          git push

      - name: Summary
        run: |
          echo "✅ New token generated!"
          echo "📅 Expires: ${{ steps.token.outputs.expires_at }}"
          echo "⏰ Duration: ${{ github.event.inputs.duration_hours }} hours"
```

### Server s token validation

```typescript
// api/mcp/ephemeral.ts
import { kv } from '@vercel/kv';

export default async function handler(req: Request) {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.substring(7);

  if (!token) {
    return new Response('Missing token', { status: 401 });
  }

  // Zkontroluj token v KV store
  const tokenData = await kv.get(`mcp:token:${token}`);

  if (!tokenData) {
    console.error('[SECURITY] Unknown token:', token.substring(0, 8));
    return new Response('Invalid token', { status: 401 });
  }

  // Zkontroluj expiraci
  const expiresAt = new Date(tokenData.expiresAt);
  if (expiresAt < new Date()) {
    console.warn('[SECURITY] Expired token:', {
      token: token.substring(0, 8),
      expiredAt: expiresAt
    });

    // Cleanup
    await kv.del(`mcp:token:${token}`);

    return new Response('Token expired', { status: 401 });
  }

  // Token je validní!
  console.info('[SECURITY] Valid ephemeral token:', {
    expiresAt: expiresAt.toISOString()
  });

  // MCP server
  // ...
}
```

### Usage

```bash
# Před každou Claude Code session:
gh workflow run generate-mcp-token.yml -f duration_hours=24

# Počkej na dokončení
gh run watch

# Pull fresh config
git pull

# ✅ Teď spusť Claude Code session
```

**Výhody:**
- ✅ Token v Gitu expiruje po N hodinách
- ✅ Starý token je automaticky nevalidní
- ✅ Audit trail v GitHub Actions logs

**Nevýhody:**
- ❌ Manuální krok před každou session
- ❌ Token je pořád v Git history (jen expired)

---

## ✅ Řešení 3: Request Signing (bez tokenu v Gitu)

**Koncept:** Místo tokenu použij podepsané requesty. Signature se generuje on-the-fly.

### Server

```typescript
// api/mcp/signed.ts
import crypto from 'crypto';

const SIGNING_SECRET = process.env.MCP_SIGNING_SECRET!;

function verifySignature(req: Request): boolean {
  const timestamp = req.headers.get('X-Timestamp');
  const signature = req.headers.get('X-Signature');
  const body = await req.text();

  // Zkontroluj timestamp (max 5 min stará)
  const requestTime = new Date(timestamp);
  const now = new Date();
  const diffMinutes = (now - requestTime) / 1000 / 60;

  if (diffMinutes > 5) {
    console.warn('[SECURITY] Request too old:', diffMinutes, 'minutes');
    return false;
  }

  // Vypočti expected signature
  const payload = `${timestamp}:${body}`;
  const expectedSignature = crypto
    .createHmac('sha256', SIGNING_SECRET)
    .update(payload)
    .digest('hex');

  // Constant-time compare
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export default async function handler(req: Request) {
  if (!verifySignature(req)) {
    return new Response('Invalid signature', { status: 401 });
  }

  // Request je authentic!
  // ... MCP server ...
}
```

### Claude Config

```json
// .claude/mcp.json
{
  "mcpServers": {
    "brave": {
      "url": "https://my-mcp.vercel.app/api/mcp",
      "transport": "http",
      "requestSigning": {
        "algorithm": "hmac-sha256",
        "secretEnv": "MCP_SIGNING_SECRET"
      }
    }
  }
}
```

**Problém:** MCP protokol zatím nepodporuje custom request signing! ❌

---

## ✅ Řešení 4: Proxy s GitHub OAuth (Advanced)

**Koncept:** Server ověří, že request jde z autorizovaného GitHub uživatele.

### Architektura

```
┌─────────────────────────────────┐
│ Anthropic Container             │
│                                 │
│  Claude Code                    │
│    ↓                            │
│  GitHub CLI (gh)                │
│    ↓ OAuth token (automatic!)   │
└────┼────────────────────────────┘
     │
     ↓ HTTPS + GitHub token
┌────────────────────────────────┐
│ Proxy Server                    │
│  1. Verify GitHub token         │
│  2. Check user authorization    │
│  3. Forward to MCP server       │
└────┼────────────────────────────┘
     │
     ↓
┌────────────────────────────────┐
│ MCP Server                      │
└────────────────────────────────┘
```

### Proxy implementace

```typescript
// api/proxy/mcp.ts

export default async function handler(req: Request) {
  // 1. Získej GitHub token z requestu
  const authHeader = req.headers.get('Authorization');
  const githubToken = authHeader?.replace('Bearer ', '');

  if (!githubToken) {
    return new Response('Missing GitHub token', { status: 401 });
  }

  // 2. Ověř token u GitHubu
  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `Bearer ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (!userResponse.ok) {
    console.error('[SECURITY] Invalid GitHub token');
    return new Response('Invalid GitHub token', { status: 401 });
  }

  const userData = await userResponse.json();
  const username = userData.login;

  // 3. Zkontroluj, že user je autorizovaný
  const ALLOWED_USERS = process.env.ALLOWED_GITHUB_USERS?.split(',') || [];

  if (!ALLOWED_USERS.includes(username)) {
    console.error('[SECURITY] Unauthorized user:', username);
    return new Response('Unauthorized', { status: 403 });
  }

  console.info('[SECURITY] Authorized GitHub user:', username);

  // 4. Forward do MCP serveru
  const mcpResponse = await fetch('https://my-mcp.vercel.app/api/mcp/internal', {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'X-Authenticated-User': username
    },
    body: req.body
  });

  return mcpResponse;
}
```

### Claude Config

```json
// .claude/mcp.json
{
  "mcpServers": {
    "brave": {
      "url": "https://my-mcp.vercel.app/api/proxy/mcp",
      "transport": "http",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      }
    }
  }
}
```

**Problém:** MCP config nepodporuje env var substitution! ❌

---

## 🎯 Praktické doporučení

### Pro většinu případů: **IP Whitelisting**

```typescript
// Nejjednodušší, nejbezpečnější, zero credentials v Gitu

const ALLOWED_IPS = [
  // Anthropic IP ranges
  '52.0.0.0/8',
  '54.0.0.0/8',
  // Tvoje IP pro testing
  '1.2.3.4/32'
];

if (!isIpInRange(clientIp, ALLOWED_IPS)) {
  return new Response('Forbidden', { status: 403 });
}
```

**.claude/mcp.json:**
```json
{
  "mcpServers": {
    "brave": {
      "url": "https://my-mcp.vercel.app/api/mcp"
    }
  }
}
```

**✅ Zero secrets v Gitu!**

### Pro vysokou bezpečnost: **IP Whitelisting + Basic Rate Limiting**

```typescript
// Kombinace IP whitelist + aggressive rate limiting

const RATE_LIMIT_MAX = 50; // Jen 50 req/15min per IP
const ALLOWED_IPS = [...];

// 1. IP whitelist
if (!isIpInRange(clientIp, ALLOWED_IPS)) {
  return new Response('Forbidden', { status: 403 });
}

// 2. Rate limiting
if (getRateLimit(clientIp) > RATE_LIMIT_MAX) {
  return new Response('Too many requests', { status: 429 });
}

// 3. MCP server
```

---

## 📊 Srovnání řešení

| Řešení | Security | Complexity | Zero Secrets | Podporováno |
|--------|----------|------------|--------------|-------------|
| IP Whitelist | ⭐⭐⭐⭐⭐ | ⭐⭐ | ✅ YES | ✅ YES |
| Ephemeral Tokens | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ NO* | ✅ YES |
| Request Signing | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ YES | ❌ NO |
| GitHub OAuth Proxy | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ YES | ⚠️ PARTIAL |

*Token je v Gitu, ale expiruje

---

## 💡 Hybrid Approach (DOPORUČENO)

**Kombinuj IP Whitelist + Lightweight Token:**

1. **IP Whitelist** blokuje 99.9% špatných requestů
2. **Rotující token** (v Gitu) jako dodatečná vrstva
3. Token můžeš rotovat jednou týdně bez rizika (protože IP whitelist)

```typescript
// api/mcp/hybrid.ts

export default async function handler(req: Request) {
  const clientIp = getClientIp(req);

  // 1. HLAVNÍ OBRANA: IP Whitelist
  if (!isAnthropicIp(clientIp)) {
    return new Response('Forbidden', { status: 403 });
  }

  // 2. SEKUNDÁRNÍ: Light token check
  const token = req.headers.get('Authorization')?.substring(7);
  const CURRENT_TOKEN = process.env.MCP_TOKEN; // Rotuj každý týden

  if (token !== CURRENT_TOKEN) {
    console.warn('[SECURITY] Invalid token from whitelisted IP:', clientIp);
    return new Response('Invalid token', { status: 401 });
  }

  // ✅ Both checks passed
  // ... MCP server ...
}
```

**Výhody:**
- ✅ IP whitelist je primary defense (zero secrets)
- ✅ Token je backup (low-risk i když leaked)
- ✅ Snadná rotace (jednou týdně je OK)

---

**Poslední aktualizace:** 2025-11-15

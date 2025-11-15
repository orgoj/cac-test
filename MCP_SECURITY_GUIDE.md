# Bezpečné propojení Claude s Remote MCP Server

## 🔒 Bezpečnostní úrovně

### Level 1: Žádná autentizace (❌ NEDOPORUČENO pro produkci)

```json
// .claude/mcp.json
{
  "mcpServers": {
    "my-service": {
      "url": "https://my-mcp.vercel.app/api/mcp",
      "transport": "http"
    }
  }
}
```

**Rizika:**
- ❌ Kdokoliv s URL může volat tvůj server
- ❌ Může vyčerpat rate limity
- ❌ Může zneužít API klíče na serveru

**Kdy použít:** Jen pro testování, ne-sensitivní data

---

### Level 2: Bearer Token autentizace (✅ ZÁKLADNÍ OCHRANA)

**Server (Vercel/Railway):**

```typescript
// api/mcp/secure.ts
import { StreamableHTTPServer } from '@modelcontextprotocol/sdk';

// Očekávaný auth token (uložený v env vars)
const MCP_AUTH_TOKEN = process.env.MCP_AUTH_TOKEN!;

export default async function handler(req: Request) {
  // 1. Zkontroluj autentizaci
  const authHeader = req.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Missing Authorization header', { status: 401 });
  }

  const token = authHeader.substring(7); // Odstraň "Bearer "

  if (token !== MCP_AUTH_TOKEN) {
    return new Response('Invalid token', { status: 401 });
  }

  // 2. Token je validní, pokračuj s MCP serverem
  const server = new StreamableHTTPServer({
    name: "secure-mcp",
    version: "1.0.0"
  });

  // ... tvoje MCP tools ...

  return server.handleRequest(req);
}
```

**Claude Config:**

```json
// .claude/mcp.json
{
  "mcpServers": {
    "my-service": {
      "url": "https://my-mcp.vercel.app/api/mcp/secure",
      "transport": "http",
      "headers": {
        "Authorization": "Bearer my-secret-token-12345"
      }
    }
  }
}
```

**Setup:**

```bash
# Na Vercel
vercel env add MCP_AUTH_TOKEN
# Zadej: my-secret-token-12345

# V projektu
git add .claude/mcp.json
git commit -m "Add MCP auth"
git push
```

**⚠️ DŮLEŽITÉ:**
- Token v `.claude/mcp.json` **JE VEŘEJNÝ** (v Git repo)
- Token slouží jen k identifikaci "legit" requestů z tvého projektu
- **NENÍ to secret** - nedávej tam hesla!

---

### Level 3: Session-specific tokens (🔒 LEPŠÍ BEZPEČNOST)

**Koncept:** Každá Claude session dostane unikátní token s expirací.

**Server:**

```typescript
// api/auth/create-session.ts
export default async function handler(req: Request) {
  // Generuj dočasný token (platný např. 24h)
  const sessionToken = generateToken();
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

  // Ulož do databáze/Redis
  await redis.set(`mcp:session:${sessionToken}`, {
    createdAt: Date.now(),
    expiresAt,
    projectId: 'cac-test'
  });

  return new Response(JSON.stringify({
    token: sessionToken,
    expiresAt
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

```typescript
// api/mcp/secure.ts
export default async function handler(req: Request) {
  const token = req.headers.get('Authorization')?.substring(7);

  // Ověř token v databázi
  const session = await redis.get(`mcp:session:${token}`);

  if (!session || session.expiresAt < Date.now()) {
    return new Response('Invalid or expired token', { status: 401 });
  }

  // Pokračuj s MCP serverem
  // ...
}
```

**Workflow:**

1. Vytvoř novou session: `curl https://my-mcp.vercel.app/api/auth/create-session`
2. Získej token
3. Přidej do `.claude/mcp.json` (lokálně, NE do Gitu!)
4. Po expiraci vytvoř nový token

---

### Level 4: IP Whitelisting (🛡️ NEJVYŠŠÍ BEZPEČNOST)

**Server:**

```typescript
// api/mcp/secure.ts
const ALLOWED_IPS = [
  '52.20.0.0/14',      // Anthropic IP ranges
  '35.180.0.0/16',     // AWS EU
  // ... další Anthropic IP ranges
];

export default async function handler(req: Request) {
  // Získej IP adresu
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] ||
                   req.headers.get('x-real-ip');

  // Zkontroluj whitelisting
  if (!isIpInRange(clientIp, ALLOWED_IPS)) {
    console.error(`Blocked IP: ${clientIp}`);
    return new Response('Forbidden', { status: 403 });
  }

  // Pokračuj s autentizací a MCP
  // ...
}

function isIpInRange(ip: string, ranges: string[]): boolean {
  // Implementace CIDR range check
  // (použij knihovnu ipaddr.js nebo ip-range-check)
  return ranges.some(range => {
    // ... CIDR check logika
  });
}
```

**Získání Anthropic IP ranges:**

```bash
# Kontaktuj Anthropic support pro aktuální IP ranges
# Nebo sleduj dokumentaci: https://docs.anthropic.com
```

---

### Level 5: Mutual TLS (mTLS) (🔐 ENTERPRISE)

**Koncept:** Obě strany si ověří certifikáty.

```typescript
// api/mcp/secure.ts
import { readFileSync } from 'fs';
import { createServer } from 'https';

const server = createServer({
  // Server certifikát
  cert: readFileSync('/path/to/server-cert.pem'),
  key: readFileSync('/path/to/server-key.pem'),

  // Vyžaduj klientský certifikát
  requestCert: true,
  rejectUnauthorized: true,
  ca: [readFileSync('/path/to/ca-cert.pem')]
}, handler);
```

**Claude Config:**

```json
{
  "mcpServers": {
    "my-service": {
      "url": "https://my-mcp.vercel.app/api/mcp/secure",
      "transport": "http",
      "tls": {
        "cert": "/path/to/client-cert.pem",
        "key": "/path/to/client-key.pem"
      }
    }
  }
}
```

---

## 🎯 Doporučené řešení pro většinu případů

### Kombinace: Bearer Token + Rate Limiting + Logging

```typescript
// api/mcp/secure.ts
import { StreamableHTTPServer } from '@modelcontextprotocol/sdk';
import rateLimit from 'express-rate-limit';

const MCP_AUTH_TOKEN = process.env.MCP_AUTH_TOKEN!;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minut
  max: 100, // Max 100 requestů per window
  message: 'Too many requests'
});

export default async function handler(req: Request) {
  // 1. Rate limiting
  await limiter(req);

  // 2. Autentizace
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.substring(7);

  if (token !== MCP_AUTH_TOKEN) {
    // Log neautorizovaný pokus
    console.error('Unauthorized attempt:', {
      ip: req.headers.get('x-forwarded-for'),
      userAgent: req.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    });

    return new Response('Unauthorized', { status: 401 });
  }

  // 3. Log legitimní request
  console.info('MCP request:', {
    ip: req.headers.get('x-forwarded-for'),
    timestamp: new Date().toISOString(),
    method: req.method
  });

  // 4. MCP server
  const server = new StreamableHTTPServer({
    name: "secure-mcp",
    version: "1.0.0"
  });

  server.tool({
    name: "web_search",
    description: "Secure web search",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string" }
      }
    },
    handler: async ({ query }) => {
      // Log usage
      console.info('Search query:', query);

      // Implementace
      const BRAVE_API_KEY = process.env.BRAVE_API_KEY!;
      const response = await fetch(
        `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            "X-Subscription-Token": BRAVE_API_KEY
          }
        }
      );

      return await response.json();
    }
  });

  return server.handleRequest(req);
}
```

---

## 📊 Monitoring & Alerting

### Vercel Analytics

```typescript
// api/mcp/secure.ts
import { track } from '@vercel/analytics/server';

export default async function handler(req: Request) {
  // Track usage
  track('mcp_request', {
    tool: req.url,
    authorized: isAuthorized,
    ip: req.headers.get('x-forwarded-for')
  });

  // ...
}
```

### Custom Logging na Datadog/Sentry

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

export default async function handler(req: Request) {
  try {
    // ... MCP logika
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        component: 'mcp-server',
        ip: req.headers.get('x-forwarded-for')
      }
    });

    return new Response('Internal error', { status: 500 });
  }
}
```

---

## ⚡ Quick Setup: Bezpečný MCP (5 minut)

```bash
# 1. Generuj silný token
openssl rand -base64 32

# 2. Na Vercel
vercel env add MCP_AUTH_TOKEN
# Zadej vygenerovaný token

vercel env add BRAVE_API_KEY
# Zadej Brave API klíč

# 3. Deploy server (viz secure.ts výše)
vercel deploy

# 4. V projektu
echo '{
  "mcpServers": {
    "secure-brave": {
      "url": "https://your-app.vercel.app/api/mcp/secure",
      "transport": "http",
      "headers": {
        "Authorization": "Bearer '"$(openssl rand -base64 32)"'"
      }
    }
  }
}' > .claude/mcp.json

# 5. Commit
git add .claude/mcp.json
git commit -m "Add secure MCP configuration"
git push
```

---

## 🔐 Best Practices Checklist

- ✅ **Vždy používej HTTPS** (ne HTTP)
- ✅ **Bearer token autentizace** minimálně
- ✅ **Rate limiting** (100-1000 req/15min)
- ✅ **Logování všech requestů**
- ✅ **Monitoring & alerting** na neautorizované pokusy
- ✅ **Read-only API klíče** kde možné
- ✅ **Token rotation** každých 30-90 dní
- ✅ **IP whitelisting** pro produkci
- ❌ **Nikdy** API klíče v `.claude/mcp.json`
- ❌ **Nikdy** CORS `*` wildcard

---

## 🚨 Co dělat při security incidentu

1. **Okamžitě rotuj tokeny:**
   ```bash
   vercel env add MCP_AUTH_TOKEN  # Nový token
   vercel deploy
   ```

2. **Zkontroluj logy:**
   ```bash
   vercel logs --follow
   ```

3. **Identifikuj zdroj:**
   - IP adresy
   - User agents
   - Časové vzory

4. **Blokuj útočníka:**
   - IP blacklist
   - Zabanuj token

5. **Zkontroluj damage:**
   - API usage statistiky
   - Neočekávané náklady
   - Data leaks

---

## 📚 Další zdroje

- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [Vercel Security Best Practices](https://vercel.com/docs/security/overview)
- [MCP Security Guidelines](https://modelcontextprotocol.io/docs/security)

---

**Poslední aktualizace:** 2025-11-15
**Autor:** Claude Code Security Guide

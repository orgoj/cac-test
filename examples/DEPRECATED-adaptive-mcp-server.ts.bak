/**
 * Adaptive MCP Server - Auto-learning IP whitelist
 *
 * První request: Vyžaduje one-time auth code
 * Server si zapamatuje IP
 * Další requesty z té IP: Automaticky povoleny
 *
 * Security: First-request authorization + learned IPs
 */

import { StreamableHTTPServer } from '@modelcontextprotocol/sdk';

const BRAVE_API_KEY = process.env.BRAVE_API_KEY!;
const ONE_TIME_CODE = process.env.ONE_TIME_CODE || 'bootstrap-12345';

// In-memory whitelist (v produkci použij Redis/KV)
const whitelistedIPs = new Set<string>();
const pendingIPs = new Map<string, number>(); // IP -> attempt count

// Rate limiting
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 50;
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
         req.headers.get('x-real-ip') ||
         'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const limit = rateLimits.get(ip);

  if (!limit || now > limit.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (limit.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  limit.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - limit.count };
}

// MCP Server
const server = new StreamableHTTPServer({
  name: "adaptive-mcp",
  version: "1.0.0"
});

server.tool({
  name: "web_search",
  description: "Search the web using Brave Search API",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Search query" },
      count: { type: "number", description: "Number of results", minimum: 1, maximum: 20 }
    },
    required: ["query"]
  },
  handler: async ({ query, count = 10 }) => {
    console.info('[MCP] web_search:', { query, count });

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

// Main Handler
export default async function handler(req: Request): Promise<Response> {
  const clientIp = getClientIp(req);
  const startTime = Date.now();

  try {
    // CORS Preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, X-One-Time-Code',
        }
      });
    }

    // 1. RATE LIMITING
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      console.warn('[SECURITY] Rate limit exceeded:', clientIp);
      return new Response(JSON.stringify({
        error: 'Too many requests',
        retryAfter: RATE_LIMIT_WINDOW / 1000
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(RATE_LIMIT_WINDOW / 1000)
        }
      });
    }

    // 2. CHECK IF IP IS WHITELISTED
    if (whitelistedIPs.has(clientIp)) {
      console.info('[SECURITY] ✅ Known whitelisted IP:', clientIp);

      // Pokračuj s MCP requestem
      const mcpResponse = await server.handleRequest(req);

      const duration = Date.now() - startTime;
      console.info('[MCP] ✅ Request completed:', {
        ip: clientIp,
        duration: `${duration}ms`,
        status: mcpResponse.status
      });

      return mcpResponse;
    }

    // 3. NEW IP - VYŽADUJ ONE-TIME CODE
    const oneTimeCode = req.headers.get('X-One-Time-Code');

    if (!oneTimeCode) {
      // Track pending IP
      pendingIPs.set(clientIp, (pendingIPs.get(clientIp) || 0) + 1);

      console.warn('[SECURITY] ⚠️ New IP without auth code:', {
        ip: clientIp,
        attempts: pendingIPs.get(clientIp),
        userAgent: req.headers.get('user-agent')
      });

      return new Response(JSON.stringify({
        error: 'New IP detected - authorization required',
        message: 'This is the first request from your IP address. Please provide a one-time authorization code.',
        ip: clientIp,
        instructions: [
          '1. Add X-One-Time-Code header to your request',
          '2. Get the code from your server environment (ONE_TIME_CODE)',
          '3. After first successful auth, this IP will be permanently whitelisted'
        ],
        example: {
          'X-One-Time-Code': 'your-bootstrap-code-here'
        }
      }, null, 2), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'WWW-Authenticate': 'OneTimeCode realm="MCP Server"'
        }
      });
    }

    // 4. VERIFY ONE-TIME CODE
    if (oneTimeCode !== ONE_TIME_CODE) {
      console.error('[SECURITY] ❌ Invalid one-time code:', {
        ip: clientIp,
        providedCode: oneTimeCode.substring(0, 8) + '...',
        timestamp: new Date().toISOString()
      });

      return new Response(JSON.stringify({
        error: 'Invalid one-time code'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 5. CODE IS VALID - WHITELIST IP!
    whitelistedIPs.add(clientIp);
    pendingIPs.delete(clientIp);

    console.info('[SECURITY] 🎉 New IP whitelisted:', {
      ip: clientIp,
      timestamp: new Date().toISOString(),
      totalWhitelisted: whitelistedIPs.size
    });

    // 6. PROCESS MCP REQUEST
    const mcpResponse = await server.handleRequest(req);

    const duration = Date.now() - startTime;
    console.info('[MCP] ✅ First request completed (IP now whitelisted):', {
      ip: clientIp,
      duration: `${duration}ms`
    });

    const headers = new Headers(mcpResponse.headers);
    headers.set('X-IP-Whitelisted', 'true');
    headers.set('X-Total-Whitelisted-IPs', String(whitelistedIPs.size));

    return new Response(mcpResponse.body, {
      status: mcpResponse.status,
      headers
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[MCP] ❌ Error:', {
      ip: clientIp,
      duration: `${duration}ms`,
      error: error instanceof Error ? error.message : String(error)
    });

    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Cleanup
setInterval(() => {
  const now = Date.now();
  for (const [ip, limit] of rateLimits.entries()) {
    if (now > limit.resetAt) {
      rateLimits.delete(ip);
    }
  }
}, 60 * 60 * 1000);

// Admin endpoint - GET /api/mcp/admin
export async function GET(req: Request): Promise<Response> {
  const adminToken = req.headers.get('Authorization')?.substring(7);
  const expectedToken = process.env.ADMIN_TOKEN;

  if (!expectedToken || adminToken !== expectedToken) {
    return new Response('Unauthorized', { status: 401 });
  }

  return new Response(JSON.stringify({
    whitelistedIPs: Array.from(whitelistedIPs),
    pendingIPs: Object.fromEntries(pendingIPs),
    rateLimits: rateLimits.size,
    stats: {
      totalWhitelisted: whitelistedIPs.size,
      totalPending: pendingIPs.size
    }
  }, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

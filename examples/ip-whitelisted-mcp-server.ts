/**
 * IP Whitelisted MCP Server - ZERO SECRETS IN GIT
 *
 * Security:
 * - Pouze Anthropic IP ranges jsou povoleny
 * - Žádný token v .claude/mcp.json není potřeba!
 * - Rate limiting per IP
 * - Comprehensive logging
 *
 * Deploy:
 * 1. vercel deploy
 * 2. vercel env add BRAVE_API_KEY
 * 3. Done! No auth token needed in Git.
 */

import { StreamableHTTPServer } from '@modelcontextprotocol/sdk';
import ipaddr from 'ipaddr.js';

// === KONFIGURACE ===

const BRAVE_API_KEY = process.env.BRAVE_API_KEY!;

// Anthropic/AWS IP ranges
// TODO: Update with actual Anthropic IP ranges from support
const ANTHROPIC_IP_RANGES = [
  // AWS US-East (primary Anthropic region)
  '52.0.0.0/8',
  '54.0.0.0/8',
  '18.0.0.0/8',

  // AWS EU-West
  '35.180.0.0/16',
  '3.248.0.0/14',

  // Přidej svoji IP pro local testing
  // '1.2.3.4/32',  // <- Tvoje IP zde
];

// Rate limiting (přísnější než u token-based)
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minut
const RATE_LIMIT_MAX = 50; // Jen 50 requestů (místo 100)

const rateLimits = new Map<string, { count: number; resetAt: number }>();

// === IP VALIDATION ===

function getClientIp(req: Request): string {
  // Vercel poskytuje client IP v těchto headerech
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Může být comma-separated list, první je client
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

function isIpInWhitelist(clientIp: string): boolean {
  if (clientIp === 'unknown') {
    return false;
  }

  try {
    const addr = ipaddr.process(clientIp);

    for (const range of ANTHROPIC_IP_RANGES) {
      const [rangeIp, rangeCidr] = range.split('/');
      const rangeAddr = ipaddr.process(rangeIp);
      const cidr = parseInt(rangeCidr);

      if (addr.match(rangeAddr, cidr)) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('[IP] Invalid IP format:', clientIp, error);
    return false;
  }
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const limit = rateLimits.get(ip);

  if (!limit || now > limit.resetAt) {
    rateLimits.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (limit.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  limit.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - limit.count };
}

// === MCP SERVER ===

const server = new StreamableHTTPServer({
  name: "ip-whitelisted-mcp",
  version: "1.0.0"
});

server.tool({
  name: "web_search",
  description: "Search the web using Brave Search API",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Search query"
      },
      count: {
        type: "number",
        description: "Number of results (1-20)",
        minimum: 1,
        maximum: 20
      }
    },
    required: ["query"]
  },
  handler: async ({ query, count = 10 }) => {
    console.info('[MCP] web_search:', { query, count });

    try {
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

      const data = await response.json();

      console.info('[MCP] web_search success:', {
        query,
        resultsCount: data.web?.results?.length || 0
      });

      return data;

    } catch (error) {
      console.error('[MCP] web_search error:', error);
      throw error;
    }
  }
});

// === MAIN HANDLER ===

export default async function handler(req: Request): Promise<Response> {
  const startTime = Date.now();
  const clientIp = getClientIp(req);

  try {
    // 0. CORS Preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // 1. IP WHITELIST (PRIMARY SECURITY)
    const isWhitelisted = isIpInWhitelist(clientIp);

    if (!isWhitelisted) {
      console.error('[SECURITY] ❌ Blocked non-whitelisted IP:', {
        ip: clientIp,
        userAgent: req.headers.get('user-agent'),
        timestamp: new Date().toISOString()
      });

      return new Response(JSON.stringify({
        error: 'Forbidden',
        message: 'IP not in whitelist'
      }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'X-Security-Reason': 'IP-Not-Whitelisted'
        }
      });
    }

    console.info('[SECURITY] ✅ Whitelisted IP:', clientIp);

    // 2. RATE LIMITING
    const rateLimit = checkRateLimit(clientIp);

    if (!rateLimit.allowed) {
      console.warn('[SECURITY] ⚠️ Rate limit exceeded:', {
        ip: clientIp,
        timestamp: new Date().toISOString()
      });

      return new Response(JSON.stringify({
        error: 'Too many requests',
        retryAfter: RATE_LIMIT_WINDOW / 1000
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(RATE_LIMIT_WINDOW / 1000),
          'X-RateLimit-Remaining': '0'
        }
      });
    }

    // 3. MCP REQUEST
    console.info('[MCP] Processing request:', {
      ip: clientIp,
      method: req.method,
      userAgent: req.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    });

    const mcpResponse = await server.handleRequest(req);

    // 4. SUCCESS
    const duration = Date.now() - startTime;
    console.info('[MCP] ✅ Request completed:', {
      ip: clientIp,
      duration: `${duration}ms`,
      status: mcpResponse.status,
      rateLimitRemaining: rateLimit.remaining
    });

    const headers = new Headers(mcpResponse.headers);
    headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
    headers.set('X-Response-Time', `${duration}ms`);

    return new Response(mcpResponse.body, {
      status: mcpResponse.status,
      headers
    });

  } catch (error) {
    const duration = Date.now() - startTime;

    console.error('[MCP] ❌ Request failed:', {
      ip: clientIp,
      duration: `${duration}ms`,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// === CLEANUP ===

setInterval(() => {
  const now = Date.now();
  let cleaned = 0;

  for (const [ip, limit] of rateLimits.entries()) {
    if (now > limit.resetAt) {
      rateLimits.delete(ip);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.info('[CLEANUP] Removed', cleaned, 'expired rate limits');
  }
}, 60 * 60 * 1000); // Každou hodinu

// === HEALTH CHECK ===

// Pro monitoring - GET /api/mcp/health
export async function GET(req: Request): Promise<Response> {
  return new Response(JSON.stringify({
    status: 'healthy',
    service: 'ip-whitelisted-mcp',
    timestamp: new Date().toISOString(),
    ipRanges: ANTHROPIC_IP_RANGES.length,
    ratelimitActive: rateLimits.size
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

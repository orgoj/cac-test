/**
 * Bezpečný Remote MCP Server - Production Ready
 *
 * Features:
 * - Bearer token autentizace
 * - Rate limiting
 * - Request logging
 * - Error handling
 * - Security headers
 */

import { StreamableHTTPServer } from '@modelcontextprotocol/sdk';

// === KONFIGURACE ===

const MCP_AUTH_TOKEN = process.env.MCP_AUTH_TOKEN!;
const BRAVE_API_KEY = process.env.BRAVE_API_KEY!;

// Rate limiting state (v produkci použij Redis)
const rateLimits = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minut
const RATE_LIMIT_MAX = 100; // Max 100 requestů per window

// === UTILITY FUNKCE ===

function getClientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0] ||
         req.headers.get('x-real-ip') ||
         'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const limit = rateLimits.get(ip);

  // Reset pokud uplynulo window
  if (!limit || now > limit.resetAt) {
    rateLimits.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  // Zkontroluj limit
  if (limit.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  // Increment
  limit.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - limit.count };
}

function securityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'none'",
  };
}

// === MCP SERVER ===

const server = new StreamableHTTPServer({
  name: "secure-mcp-server",
  version: "1.0.0"
});

// Tool: Web Search
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
        description: "Number of results (default: 10)",
        minimum: 1,
        maximum: 20
      }
    },
    required: ["query"]
  },
  handler: async ({ query, count = 10 }) => {
    console.info('[MCP] web_search called:', { query, count });

    try {
      const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${count}`;

      const response = await fetch(url, {
        headers: {
          "Accept": "application/json",
          "X-Subscription-Token": BRAVE_API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`Brave API error: ${response.status} ${response.statusText}`);
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

// === HLAVNÍ HANDLER ===

export default async function handler(req: Request): Promise<Response> {
  const startTime = Date.now();
  const clientIp = getClientIp(req);

  try {
    // 1. CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type',
          ...securityHeaders()
        }
      });
    }

    // 2. RATE LIMITING
    const rateLimit = checkRateLimit(clientIp);

    if (!rateLimit.allowed) {
      console.warn('[SECURITY] Rate limit exceeded:', {
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
          'X-RateLimit-Remaining': '0',
          ...securityHeaders()
        }
      });
    }

    // 3. AUTENTIZACE
    const authHeader = req.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('[SECURITY] Missing Authorization header:', {
        ip: clientIp,
        userAgent: req.headers.get('user-agent'),
        timestamp: new Date().toISOString()
      });

      return new Response(JSON.stringify({
        error: 'Missing Authorization header'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'WWW-Authenticate': 'Bearer realm="MCP Server"',
          ...securityHeaders()
        }
      });
    }

    const token = authHeader.substring(7);

    if (token !== MCP_AUTH_TOKEN) {
      console.error('[SECURITY] Invalid token attempt:', {
        ip: clientIp,
        userAgent: req.headers.get('user-agent'),
        timestamp: new Date().toISOString(),
        tokenPrefix: token.substring(0, 8) + '...'
      });

      return new Response(JSON.stringify({
        error: 'Invalid token'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...securityHeaders()
        }
      });
    }

    // 4. MCP REQUEST
    console.info('[MCP] Authorized request:', {
      ip: clientIp,
      method: req.method,
      userAgent: req.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    });

    const mcpResponse = await server.handleRequest(req);

    // 5. LOG SUCCESS
    const duration = Date.now() - startTime;
    console.info('[MCP] Request completed:', {
      ip: clientIp,
      duration: `${duration}ms`,
      status: mcpResponse.status
    });

    // Add security headers
    const headers = new Headers(mcpResponse.headers);
    Object.entries(securityHeaders()).forEach(([key, value]) => {
      headers.set(key, value);
    });
    headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));

    return new Response(mcpResponse.body, {
      status: mcpResponse.status,
      headers
    });

  } catch (error) {
    const duration = Date.now() - startTime;

    console.error('[MCP] Request failed:', {
      ip: clientIp,
      duration: `${duration}ms`,
      error: error instanceof Error ? error.message : String(error)
    });

    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...securityHeaders()
      }
    });
  }
}

// === CLEANUP (optional) ===

// Vyčisti staré rate limit záznamy každou hodinu
setInterval(() => {
  const now = Date.now();
  for (const [ip, limit] of rateLimits.entries()) {
    if (now > limit.resetAt) {
      rateLimits.delete(ip);
    }
  }
}, 60 * 60 * 1000);

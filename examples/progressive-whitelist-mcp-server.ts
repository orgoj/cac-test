/**
 * MCP Server s AWS IP ranges jako výchozí whitelist
 *
 * Start: Široký AWS whitelist (není ideální, ale lepší než nic)
 * Postupně: Zužuj basované na real IPs v lozích
 *
 * Security: Základní ochrana + postupné zpřísňování
 */

import { StreamableHTTPServer } from '@modelcontextprotocol/sdk';
import ipaddr from 'ipaddr.js';

const BRAVE_API_KEY = process.env.BRAVE_API_KEY!;

// AWS IP ranges kde běží Anthropic
// TODO: Zúžit basované na skutečných IPs v lozích
const INITIAL_IP_RANGES = [
  // AWS US-East (Anthropic primary)
  '52.20.0.0/14',
  '54.80.0.0/13',
  '18.204.0.0/14',

  // AWS EU-West (možná budoucí expanze)
  '35.180.0.0/16',
  '3.248.0.0/14',
];

// Tracking real IPs pro postupné zpřísňování
const observedIPs = new Set<string>();

const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 50;
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
         req.headers.get('x-real-ip') ||
         'unknown';
}

function isIpInWhitelist(clientIp: string): boolean {
  if (clientIp === 'unknown') return false;

  try {
    const addr = ipaddr.process(clientIp);

    for (const range of INITIAL_IP_RANGES) {
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
  name: "progressive-whitelist-mcp",
  version: "1.0.0"
});

server.tool({
  name: "web_search",
  description: "Search the web using Brave Search API",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string" },
      count: { type: "number", minimum: 1, maximum: 20 }
    },
    required: ["query"]
  },
  handler: async ({ query, count = 10 }) => {
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

export default async function handler(req: Request): Promise<Response> {
  const clientIp = getClientIp(req);
  const startTime = Date.now();

  try {
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

    // 1. IP WHITELIST CHECK
    const isWhitelisted = isIpInWhitelist(clientIp);

    if (!isWhitelisted) {
      console.error('[SECURITY] ❌ Blocked IP (not in AWS ranges):', {
        ip: clientIp,
        timestamp: new Date().toISOString()
      });

      return new Response(JSON.stringify({
        error: 'Forbidden',
        message: 'IP not in allowed ranges'
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. TRACK OBSERVED IPs (pro budoucí zpřísňování)
    if (!observedIPs.has(clientIp)) {
      observedIPs.add(clientIp);
      console.info('[TRACKING] 🆕 New Anthropic IP observed:', {
        ip: clientIp,
        totalObserved: observedIPs.size,
        allObserved: Array.from(observedIPs)
      });
    }

    console.info('[SECURITY] ✅ Whitelisted IP:', clientIp);

    // 3. RATE LIMITING
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      console.warn('[SECURITY] ⚠️ Rate limit exceeded:', clientIp);
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

    // 4. MCP REQUEST
    const mcpResponse = await server.handleRequest(req);

    const duration = Date.now() - startTime;
    console.info('[MCP] ✅ Request completed:', {
      ip: clientIp,
      duration: `${duration}ms`,
      status: mcpResponse.status
    });

    return mcpResponse;

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

// Admin endpoint pro monitoring
export async function GET(req: Request): Promise<Response> {
  const adminToken = req.headers.get('Authorization')?.substring(7);
  if (adminToken !== process.env.ADMIN_TOKEN) {
    return new Response('Unauthorized', { status: 401 });
  }

  return new Response(JSON.stringify({
    currentRanges: INITIAL_IP_RANGES,
    observedIPs: Array.from(observedIPs),
    stats: {
      totalObserved: observedIPs.size,
      rateLimitsActive: rateLimits.size
    },
    recommendation: observedIPs.size > 0
      ? 'Consider narrowing IP ranges based on observed IPs'
      : 'Waiting for first requests to observe real IPs'
  }, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

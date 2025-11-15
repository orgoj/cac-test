/**
 * IP Discovery Server - Zjisti Anthropic IP adresy
 *
 * Tento super-jednoduchý endpoint ti ukáže IP adresu Claude Code containeru.
 *
 * Deploy:
 * 1. vercel deploy
 * 2. Z Claude Code session zavolej tento endpoint
 * 3. Uvidíš IP adresu v response
 * 4. Použij tu IP v ip-whitelisted-mcp-server.ts
 */

export default async function handler(req: Request): Promise<Response> {
  // Získej client IP
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const clientIp = forwardedFor?.split(',')[0].trim() || realIp || 'unknown';

  // Loguj pro monitoring
  console.log('[IP-DISCOVERY]', {
    ip: clientIp,
    timestamp: new Date().toISOString(),
    allHeaders: {
      'x-forwarded-for': forwardedFor,
      'x-real-ip': realIp,
      'user-agent': req.headers.get('user-agent'),
      'cf-connecting-ip': req.headers.get('cf-connecting-ip'),
    }
  });

  // Vrať IP jako response
  return new Response(JSON.stringify({
    message: 'Your IP address detected!',
    ip: clientIp,
    timestamp: new Date().toISOString(),
    headers: {
      'x-forwarded-for': forwardedFor,
      'x-real-ip': realIp,
      'user-agent': req.headers.get('user-agent'),
    },
    next_steps: [
      '1. Copy this IP address',
      '2. Use whois to find CIDR range: whois ' + clientIp + ' | grep CIDR',
      '3. Add range to ANTHROPIC_IP_RANGES in ip-whitelisted-mcp-server.ts',
      '4. Redeploy your MCP server'
    ]
  }, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
}

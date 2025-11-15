# Všechny možnosti: API klíče v Anthropic Remote Container

**Realita:** V remote containeru NEMÁTE kontrolu nad inicializací. Všechna řešení mají kompromisy.

---

## 📋 Přehled všech možností

| # | Řešení | Security | Kompromisy | Status |
|---|--------|----------|------------|--------|
| 1 | Remote MCP + IP Whitelist | ⭐⭐⭐⭐⭐ | Musíš znát Anthropic IP | ✅ Funguje |
| 2 | Remote MCP + Bearer Token | ⭐⭐⭐⭐ | Token v .claude/mcp.json (Git) | ✅ Funguje |
| 3 | Remote MCP + AWS Ranges | ⭐⭐⭐ | Široký whitelist (i jiní AWS users) | ✅ Funguje |
| 4 | Discovery → Static Whitelist | ⭐⭐⭐⭐⭐ | Vyžaduje 2 fáze (discovery + deploy) | ✅ Funguje |
| 5 | Adaptive + Bootstrap Code | ⭐⭐⭐ | Secret v Git (i když dočasný) | ⚠️ Deprecated |
| 6 | Session-start hooks | - | Nemůžeš spouštět před inicializací | ❌ Nefunguje |
| 7 | Environment variables | - | Nemůžeš nastavit před startem | ❌ Nemožné |
| 8 | GitHub Actions + Tokens | ⭐⭐⭐ | Token stále končí v Git | ⚠️ Komplikované |
| 9 | Anthropic konzultace | ⭐⭐⭐⭐⭐ | Závisí na Anthropic support | 🤷 Možná |

---

## 1️⃣ Remote MCP + IP Whitelist (nejbezpečnější)

### Jak to funguje:
```typescript
// Server kontroluje IP při každém requestu
if (!isAnthropicIp(clientIp)) {
  return new Response('Forbidden', { status: 403 });
}
```

### .claude/mcp.json (ZERO SECRETS):
```json
{
  "mcpServers": {
    "brave": {
      "url": "https://my-mcp.vercel.app/api/mcp"
    }
  }
}
```

### ✅ Výhody:
- Žádné credentials v Git
- Nejvyšší security
- API klíče jen na serveru

### ❌ Nevýhody:
- **MUSÍŠ ZNÁT Anthropic IP adresy** (nejsou veřejně dokumentované)
- Vyžaduje discovery fázi nebo kontakt s Anthropic
- IP adresy se mohou měnit

### Kdy použít:
- Když máš čas na discovery
- Když ti záleží na nejvyšší security
- Pro produkci

---

## 2️⃣ Remote MCP + Bearer Token (pragmatický kompromis)

### Jak to funguje:
```typescript
// Server kontroluje token
const token = req.headers.get('Authorization')?.substring(7);
if (token !== MCP_AUTH_TOKEN) {
  return new Response('Unauthorized', { status: 401 });
}
```

### .claude/mcp.json (TOKEN V GIT):
```json
{
  "mcpServers": {
    "brave": {
      "url": "https://my-mcp.vercel.app/api/mcp",
      "headers": {
        "Authorization": "Bearer public-token-abc123"
      }
    }
  }
}
```

### ✅ Výhody:
- Funguje okamžitě
- Jednoduchý setup (10 min)
- Rate limiting možný
- Funguje bez znalosti IP

### ❌ Nevýhody:
- **Token je v Git repo** (public)
- Kdokoliv s tokenem může volat server
- Musíš rotovat token pravidelně
- Není to "skutečný" secret, ale pořád v Gitu

### Kdy použít:
- Když potřebuješ rychlé řešení
- Když nemůžeš zjistit Anthropic IPs
- Pro development/testing
- Když kombinuješ s rate limiting

### Mitigace rizika:
- Rotuj token každý měsíc
- Aggressive rate limiting (50 req/15min)
- Monitor logs na abuse
- Používej různé tokeny pro dev/prod

---

## 3️⃣ Remote MCP + AWS IP Ranges (široký whitelist)

### Jak to funguje:
```typescript
// Whitelist celé AWS ranges
const AWS_RANGES = [
  '52.0.0.0/8',   // Celý AWS US-East
  '54.0.0.0/8',
];
```

### .claude/mcp.json (ZERO SECRETS):
```json
{
  "mcpServers": {
    "brave": {
      "url": "https://my-mcp.vercel.app/api/mcp"
    }
  }
}
```

### ✅ Výhody:
- Zero secrets v Git
- Funguje okamžitě
- Postupné zužování možné

### ❌ Nevýhody:
- **Široký whitelist** zahrnuje všechny AWS uživatele v tom regionu
- Není ideální security
- Spoléháš se na rate limiting

### Kdy použít:
- Když nemůžeš zjistit přesné Anthropic IPs
- Jako temporary řešení
- Když kombinuješ s aggressive rate limiting

---

## 4️⃣ Discovery → Static Whitelist (dvě fáze)

### Jak to funguje:

**Fáze 1: Discovery**
```bash
# Deploy discovery endpoint
curl https://discovery.vercel.app/api/ip
# → {"ip": "52.20.123.45"}
```

**Fáze 2: Production**
```typescript
// Použij zjištěné IP ranges
const ANTHROPIC_IP_RANGES = ['52.20.0.0/14'];
```

### ✅ Výhody:
- Zero secrets v Git
- Přesný IP whitelist
- Nejvyšší security po zjištění IPs

### ❌ Nevýhody:
- **Vyžaduje 2 samostatné deploymenty**
- Musíš čekat na discovery
- Několik Claude sessions pro zjištění všech IPs

### Kdy použít:
- Když máš čas na správný setup
- Pro produkci
- Když chceš nejvyšší security

---

## 5️⃣ Adaptive + Bootstrap Code (DEPRECATED)

### Jak to funguje:
```json
// První request S bootstrap code
{
  "headers": {
    "X-One-Time-Code": "bootstrap-xyz"  // ❌ SECRET V GIT!
  }
}

// Druhý commit BEZ code
{
  "headers": {}
}
```

### ✅ Výhody:
- Auto-learning whitelist
- Funguje bez předchozí znalosti IP

### ❌ Nevýhody:
- **SECRET V GIT REPO** (i když dočasný)
- Zůstává v Git history
- Manuální cleanup potřeba
- Risk zapomenout smazat

### Kdy použít:
- **NIKDY** - deprecated

---

## 6️⃣ Session-Start Hooks (NEFUNGUJE)

### Proč ne:
```bash
# .claude/hooks/session-start.sh
# ❌ Tento hook se NESPUSTÍ před container inicializací!

# Anthropic vytvoří container
# → Naklonuje Git repo
# → Spustí Claude Code
# → TEĎ TEPRVE by mohl běžet hook
# → Ale už je pozdě - container je initialized
```

### ❌ Problém:
- Container je již vytvořen když dostaneš přístup
- Nemůžeš spouštět příkazy PŘED inicializací
- Hooks běží UVNITŘ containeru, ne před ním

### Status:
- **NEFUNGUJE** v remote containeru

---

## 7️⃣ Environment Variables (NEMOŽNÉ)

### Proč ne:
- Nemáš přístup k container creation procesu
- Container je již vytvořen s vašim Git repo
- Žádný způsob jak nastavit env vars před startem

### Status:
- **NEMOŽNÉ** v remote containeru

---

## 8️⃣ GitHub Actions + Ephemeral Tokens

### Jak to funguje:
```yaml
# .github/workflows/generate-token.yml
- name: Generate token
  run: |
    TOKEN=$(openssl rand -base64 32)
    # Store in Vercel KV with expiration
    # Update .claude/mcp.json
    # Commit & push
```

### ✅ Výhody:
- Token expiruje
- Audit trail
- Automatizace možná

### ❌ Nevýhody:
- **Token pořád v Git** (i když expired)
- Vyžaduje GitHub Actions
- Vyžaduje Vercel KV/Redis
- Manuální trigger před každou session
- Komplikované

### Kdy použít:
- Když máš velmi strict security požadavky
- Když můžeš akceptovat manuální workflow
- Pro enterprise use case

---

## 9️⃣ Konzultace s Anthropic

### Co požádat:
```
To: support@anthropic.com
Subject: Remote Container - API Keys Best Practice

Questions:
1. What are official Anthropic IP ranges for remote containers?
2. What is the recommended approach for external API access?
3. Are there plans for native secrets management?
4. Can we set environment variables before container initialization?
```

### ✅ Výhody:
- Oficiální guidance
- Možná nativní řešení v budoucnu
- IP ranges dokumentované

### ❌ Nevýhody:
- Závisí na Anthropic response
- Nemusí existovat "perfektní" řešení
- Může trvat

---

## 🎯 Doporučení (upřímně)

### Pro produkci:
**Řešení 4 (Discovery → Static Whitelist)**
- Nejvyšší security
- Zero secrets v Git
- Kompromis: 2 fáze setup

### Pro rychlý start:
**Řešení 2 (Bearer Token)**
- Funguje okamžitě
- Kompromis: Token v Git (public, ne secret)
- Mitigace: Rate limiting + rotation

### Pro paranoidní security:
**Řešení 9 (Kontaktuj Anthropic)**
- Získej oficiální IP ranges
- Pak použij Řešení 1

---

## 💭 Pravda

**Žádné řešení není perfektní.**

Remote container bez kontroly nad inicializací znamená že:
- Buď máš secrets v Gitu (kompromis)
- Nebo potřebuješ znát Anthropic IPs (vyžaduje discovery)
- Nebo použiješ široký whitelist (nižší security)

**Fundamentální problém:**
- Anthropic kontroluje container creation
- Ty kontroluješ jen Git repo
- Git repo je public
- → Secrets v Git repo = bad
- → Musíš použít něco veřejného (IP whitelist, public auth token)

**Best we can do:**
1. Remote MCP server (secrets na tvém serveru, ne v containeru) ✅
2. IP whitelist (žádné credentials) nebo bearer token (public, ne secret)
3. Rate limiting + monitoring + logging

---

## 📚 Dokumentace

Všechny implementace:
- `COMPLETE_SOLUTION.md` - komplexní guide
- `ZERO_SECRETS_IN_GIT.md` - zero-secrets přístupy
- `MCP_SECURITY_GUIDE.md` - všechny security levels
- `QUICK_IP_DISCOVERY.md` - jak zjistit IPs
- `examples/` - všechny implementace

---

**Poslední aktualizace:** 2025-11-15
**Realita:** Všechna řešení mají kompromisy. Vyber si podle tvých priorit.

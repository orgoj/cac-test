# MCP Servery - Konfigurace a testování

Tento dokument popisuje nakonfigurované MCP (Model Context Protocol) servery v projektu, zejména ty, které komunikují s okolím.

## Nakonfigurované MCP servery

### 1. Context7 (@upstash/context7-mcp)

**Účel:** Poskytuje aktuální, version-specific dokumentaci a příklady kódu pro knihovny přímo do kontextu LLM.

**Funkce:**
- Stahuje aktuální dokumentaci, aby se zabránilo halucinacím LLM s neexistujícími API
- Eliminuje přepínání mezi taby při hledání dokumentace
- Podporuje různé MCP klienty (Claude Desktop, OpenAI Codex, JetBrains IDEs)
- Volitelný API klíč pro vyšší limity

**Konfigurace:**
```json
"context7": {
  "command": "npx",
  "args": [
    "-y",
    "@upstash/context7-mcp"
  ]
}
```

**Použití:**
- Žádejte Claude o dokumentaci konkrétních knihoven
- Získejte aktuální příklady kódu pro danou verzi knihovny
- Ověřte, zda API existuje před jeho použitím

**Zdroj:** https://github.com/upstash/context7

---

### 2. DuckDuckGo Search (duckduckgo-mcp-server)

**Účel:** Vyhledávání na webu pomocí DuckDuckGo (žádný API klíč není potřeba).

**Funkce:**
- Web search s DuckDuckGo
- Privacy-friendly (žádné trackování)
- Rate limit: 1 dotaz/sekundu, 15000 dotazů/měsíc
- Konfigurovatelný počet výsledků (1-20)
- SafeSearch režimy (strict/moderate/off)

**Konfigurace:**
```json
"duckduckgo-search": {
  "command": "npx",
  "args": [
    "-y",
    "duckduckgo-mcp-server"
  ]
}
```

**Použití:**
- Vyhledávání aktuálních informací na webu
- Privacy-focused alternativa k Google
- Žádná registrace nebo API klíč

**Zdroj:** https://github.com/nickclyde/duckduckgo-mcp-server

---

### 3. Fetch (mcp-server-fetch)

**Účel:** Umožňuje stahování obsahu z webových stránek.

**Funkce:**
- Stahování HTML obsahu
- Konverze na markdown pro snadnější analýzu
- Read-only přístup (nemodifikuje soubory)

**Konfigurace:**
```json
"fetch": {
  "command": "uvx",
  "args": [
    "mcp-server-fetch"
  ]
}
```

**Použití:**
- Stahování dokumentace z webových stránek
- Analýza obsahu webových stránek
- Získávání informací z online zdrojů

---

### 4. Memory (@modelcontextprotocol/server-memory)

**Účel:** Ukládání kontextu a paměti mezi sessions.

**Konfigurace:**
```json
"memory": {
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-memory"
  ]
}
```

---

### 5. Filesystem (@modelcontextprotocol/server-filesystem)

**Účel:** Přístup k souborovému systému.

**Konfigurace:**
```json
"filesystem": {
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-filesystem",
    "/home/user/cac-test"
  ]
}
```

---

## MCP servery komunikující s okolím

Nakonfigurované servery pro externí komunikaci (bez nutnosti API klíčů):

1. **Context7** - Dokumentace a příklady kódu z online zdrojů
2. **DuckDuckGo Search** - Vyhledávání na webu (privacy-friendly)
3. **Fetch** - Stahování webového obsahu

## Testování MCP serverů

### Test Context7

Zkuste:
```
Jaké jsou nejnovější funkce v React 19?
```

Claude by měl použít Context7 k získání aktuální dokumentace.

### Test DuckDuckGo Search

Zkuste:
```
Vyhledej nejnovější trendy v AI development
```

Claude by měl použít DuckDuckGo k vyhledání aktuálních informací.

### Test Fetch

Zkuste:
```
Stáhni obsah z https://example.com a shrň ho
```

Claude by měl použít fetch server k získání obsahu.

## Bezpečné ukládání API klíčů

Pokud potřebujete používat MCP servery s API klíči (jako Brave Search, GitHub), zde jsou **bezpečné způsoby**:

### Metoda 1: Proměnné prostředí (DOPORUČENO)

Místo ukládání klíče přímo v `mcp.json`, použijte proměnné prostředí:

**1. Vytvořte soubor `.env` (přidejte do .gitignore!):**
```bash
# .env (NIKDY necommitujte tento soubor!)
BRAVE_API_KEY=your-actual-api-key-here
GITHUB_TOKEN=ghp_your-github-token-here
```

**2. V `mcp.json` odkazujte na proměnnou:**
```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "${BRAVE_API_KEY}"
      }
    }
  }
}
```

**3. Načtěte `.env` při startu:**
```bash
# Linux/Mac
export $(cat .env | xargs)
```

### Metoda 2: Systémové proměnné prostředí

**Linux/Mac (.bashrc nebo .zshrc):**
```bash
export BRAVE_API_KEY="your-api-key"
export GITHUB_TOKEN="ghp_your-token"
```

**Windows (PowerShell):**
```powershell
[System.Environment]::SetEnvironmentVariable('BRAVE_API_KEY', 'your-api-key', 'User')
```

### Metoda 3: Oddělený konfigurační soubor

**1. Vytvořte `mcp.secrets.json` (přidejte do .gitignore!):**
```json
{
  "BRAVE_API_KEY": "your-actual-key",
  "GITHUB_TOKEN": "ghp_your-token"
}
```

**2. V `mcp.json` použijte:**
```json
{
  "mcpServers": {
    "brave-search": {
      "command": "sh",
      "args": ["-c", "BRAVE_API_KEY=$(jq -r .BRAVE_API_KEY mcp.secrets.json) npx -y @modelcontextprotocol/server-brave-search"]
    }
  }
}
```

### ⚠️ NIKDY:

- ❌ Necommitujte API klíče do Gitu
- ❌ Nesdílejte API klíče v public repozitářích
- ❌ Neukládejte klíče přímo v `mcp.json` pokud je soubor verzovaný

### ✅ VŽDY:

- ✅ Přidejte `.env` a `mcp.secrets.json` do `.gitignore`
- ✅ Používejte proměnné prostředí
- ✅ Rotujte klíče pravidelně
- ✅ Používejte read-only klíče kde je to možné

## Bezpečnostní poznámky

**Pozor (duben 2025):**
- MCP má známé bezpečnostní problémy včetně prompt injection
- Kombinace nástrojů může vést k exfiltraci souborů
- "Lookalike" nástroje mohou tiše nahradit důvěryhodné

**Doporučení:**
- Pečlivě kontrolujte, jaké nástroje MCP servery poskytují
- Nepoužívejte citlivé API klíče ve sdílených prostředích
- Pravidelně aktualizujte MCP servery

## Odkazy

- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Official MCP Servers Repository](https://github.com/modelcontextprotocol/servers)
- [Context7 GitHub](https://github.com/upstash/context7)
- [DuckDuckGo MCP Server](https://github.com/nickclyde/duckduckgo-mcp-server)
- [MCP Server List (LobeHub)](https://lobehub.com/mcp)
- [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers)
- [Glama.ai - MCP Servers bez API klíčů](https://glama.ai/mcp/servers/search/mcp-servers-that-do-not-require-api-keys)

---

**Poslední aktualizace:** 2025-11-15
**Verze MCP:** 2025-06-18

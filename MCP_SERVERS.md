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

### 2. Brave Search (@modelcontextprotocol/server-brave-search)

**Účel:** Umožňuje vyhledávání na webu pomocí Brave Search API.

**Funkce:**
- Web search (vyhledávání na webu)
- Local Points of Interest search (vyhledávání místních míst)
- Image search (vyhledávání obrázků)
- Video search (vyhledávání videí)
- News search (vyhledávání zpráv)
- AI-powered summarization (shrnutí pomocí AI)

**Konfigurace:**
```json
"brave-search": {
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-brave-search"
  ],
  "env": {
    "BRAVE_API_KEY": "your-brave-api-key-here"
  }
}
```

**Limity (free tier):**
- 2,000 dotazů/měsíc zdarma
- 1 dotaz/sekundu

**Výhody:**
- Vlastní nezávislý index (na rozdíl od DuckDuckGo)
- Privacy-focused (na rozdíl od Google)
- Oficiálně podporovaný Anthropic

**Získání API klíče:**
1. Navštivte https://brave.com/search/api/
2. Zaregistrujte se zdarma
3. Zkopírujte API klíč
4. Nahraďte `your-brave-api-key-here` v konfiguraci

**Zdroj:** https://github.com/modelcontextprotocol/servers

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

Hlavní servery pro externí komunikaci:

1. **Context7** - Dokumentace a příklady kódu z online zdrojů
2. **Brave Search** - Vyhledávání na webu
3. **Fetch** - Stahování webového obsahu

## Testování MCP serverů

### Test Context7

Zkuste:
```
Jaké jsou nejnovější funkce v React 19?
```

Claude by měl použít Context7 k získání aktuální dokumentace.

### Test Brave Search

Zkuste:
```
Vyhledej nejnovější trendy v AI development
```

Claude by měl použít Brave Search k vyhledání aktuálních informací.

### Test Fetch

Zkuste:
```
Stáhni obsah z https://example.com a shrň ho
```

Claude by měl použít fetch server k získání obsahu.

## Další dostupné MCP servery

Další zajímavé servery pro komunikaci s okolím:

- **Google Custom Search** - Vyhledávání přes Google (100 dotazů/den zdarma)
- **Open-WebSearch** - Multi-engine search (Bing, DuckDuckGo, Brave, Baidu)
- **GitHub MCP** - Integrace s GitHub API
- **Slack MCP** - Integrace se Slack
- **PostgreSQL MCP** - Připojení k PostgreSQL databázím

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
- [Brave Search MCP](https://github.com/brave/brave-search-mcp-server)
- [MCP Server List (LobeHub)](https://lobehub.com/mcp)

---

**Poslední aktualizace:** 2025-11-15
**Verze MCP:** 2025-06-18

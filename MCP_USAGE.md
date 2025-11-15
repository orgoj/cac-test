# Používání MCP (Model Context Protocol) v Claude Code

## Co je MCP?

Model Context Protocol (MCP) je otevřený protokol vyvinutý společností Anthropic, který umožňuje Claude Code bezpečně se připojit k externím datovým zdrojům a službám. MCP servery běží jako samostatné procesy a komunikují s Claude přes standardizovaný protokol.

## Jak MCP funguje v Claude Code

MCP servery poskytují Claude přístup k:
- **Datovým zdrojům** - databáze, souborové systémy, API
- **Nástrojům** - web scraping, automatizace prohlížeče, Git operace
- **Kontextu** - perzistentní paměť mezi sezeními, knowledge graphs

### Architektura

```
Claude Code ←→ MCP Protocol ←→ MCP Server ←→ External Resource
```

Každý MCP server je nezávislý proces, který:
1. Přijímá požadavky od Claude Code přes stdio nebo HTTP
2. Zpracovává požadavky podle svých schopností
3. Vrací výsledky zpět Claude Code

## Konfigurace MCP serverů

### Umístění konfigurace

MCP servery se konfigurují v souboru:
```
.claude/mcp.json
```

### Struktura konfigurace

```json
{
  "mcpServers": {
    "server-name": {
      "command": "příkaz-ke-spuštění",
      "args": ["argument1", "argument2"]
    }
  }
}
```

### Příklad konfigurace

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/allowed/directory"
      ]
    },
    "fetch": {
      "command": "uvx",
      "args": [
        "mcp-server-fetch"
      ]
    },
    "memory": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-memory"
      ]
    }
  }
}
```

## Dostupné MCP servery

### 1. Filesystem Server

**Package**: `@modelcontextprotocol/server-filesystem` (Node.js)

**Účel**: Bezpečný přístup k souborovému systému

**Instalace**:
```bash
npx -y @modelcontextprotocol/server-filesystem /path/to/directory
```

**Použití**:
- Čtení a zápis souborů
- Vytváření a mazání adresářů
- Vyhledávání souborů
- Bezpečnostní omezení na specifikovaný adresář

**Konfigurace**:
```json
"filesystem": {
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-filesystem",
    "/home/user/projekt"
  ]
}
```

### 2. Fetch Server

**Package**: `mcp-server-fetch` (Python)

**Účel**: Stahování a zpracování webového obsahu

**Instalace**:
```bash
uvx mcp-server-fetch
# nebo
pip install mcp-server-fetch
```

**Použití**:
- Stahování webových stránek
- Konverze HTML na markdown
- Extrakce obsahu pro LLM

**Konfigurace**:
```json
"fetch": {
  "command": "uvx",
  "args": [
    "mcp-server-fetch"
  ]
}
```

### 3. Memory Server

**Package**: `@modelcontextprotocol/server-memory` (Node.js)

**Účel**: Perzistentní paměť napříč sezeními

**Instalace**:
```bash
npx -y @modelcontextprotocol/server-memory
```

**Použití**:
- Ukládání kontextu mezi sezeními
- Knowledge graph pro vztahy mezi informacemi
- Dlouhodobá paměť o preferencích uživatele

**Konfigurace**:
```json
"memory": {
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-memory"
  ]
}
```

### 4. Git Server

**Package**: `@modelcontextprotocol/server-git` (Node.js)

**Účel**: Operace s Git repozitáři

**Instalace**:
```bash
npx -y @modelcontextprotocol/server-git
```

**Použití**:
- Čtení historie commitů
- Vyhledávání v Git repozitáři
- Diff a blame operace

### 5. Sequential Thinking Server

**Package**: `@modelcontextprotocol/server-sequential-thinking` (Node.js)

**Účel**: Pokročilé myšlenkové procesy

**Použití**:
- Systematické řešení problémů
- Krokové analýzy
- Strukturované rozhodování

### Další dostupné servery

- **Everything** - Testovací server se všemi funkcemi MCP
- **Time** - Práce s časem a časovými pásmy
- **GitHub** (archivováno) - GitHub API integrace
- **GitLab** (archivováno) - GitLab API integrace
- **PostgreSQL** (archivováno) - PostgreSQL databáze
- **SQLite** (archivováno) - SQLite databáze
- **Puppeteer** (archivováno) - Automatizace prohlížeče
- **Slack** (archivováno) - Slack integrace

## Jak používat MCP v Claude Code

### 1. Nastavení projektu

Vytvořte `.claude/mcp.json` v kořenovém adresáři projektu:

```bash
mkdir -p .claude
cat > .claude/mcp.json << 'EOF'
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/home/user/projekt"
      ]
    }
  }
}
EOF
```

### 2. Restart Claude Code

Po vytvoření nebo úpravě `mcp.json` je potřeba restartovat Claude Code, aby se načetla nová konfigurace.

### 3. Ověření funkčnosti

Servery se spouštějí automaticky při startu Claude Code. Můžete ověřit, že fungují:

```bash
# Test filesystem serveru
timeout 5 npx -y @modelcontextprotocol/server-filesystem /home/user/projekt

# Test fetch serveru
timeout 5 uvx mcp-server-fetch

# Test memory serveru
timeout 5 npx -y @modelcontextprotocol/server-memory
```

## Požadavky na prostředí

### Node.js servery
- **Node.js**: verze 18 nebo vyšší
- **npm/npx**: balíčkový manažer Node.js

Ověření:
```bash
node --version  # v18.0.0 nebo vyšší
npx --version
```

### Python servery
- **Python**: verze 3.10 nebo vyšší
- **uv/uvx**: moderní Python package manager

Ověření:
```bash
python3 --version  # Python 3.10 nebo vyšší
uvx --version
```

Instalace uv:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## Příklady použití

### Filesystem Server

```
Claude, přečti soubor config.yaml a zobraz jeho obsah
Claude, vytvoř nový adresář src/components
Claude, najdi všechny .py soubory v projektu
```

### Fetch Server

```
Claude, stáhni obsah z https://example.com a shrň hlavní body
Claude, načti dokumentaci z URL a extrahuj příklady kódu
```

### Memory Server

```
Claude, zapamatuj si, že preferuji TypeScript před JavaScriptem
Claude, jaké preference jsi si o mně zapamatoval?
```

## Troubleshooting

### Server se nespouští

1. **Ověřte instalaci závislostí**:
   ```bash
   # Pro Node.js servery
   node --version
   npx --version

   # Pro Python servery
   python3 --version
   uvx --version
   ```

2. **Zkontrolujte syntax mcp.json**:
   ```bash
   cat .claude/mcp.json | python3 -m json.tool
   ```

3. **Testujte server manuálně**:
   ```bash
   npx -y @modelcontextprotocol/server-filesystem /tmp
   ```

### Package nenalezen (404 error)

- Ověřte správný název balíčku
- Některé servery jsou Python balíčky (`uvx`), jiné Node.js (`npx`)
- Zkontrolujte, zda balíček existuje:
  ```bash
  npm view @modelcontextprotocol/server-name
  ```

### Oprávnění (Permission denied)

- Filesystem server má bezpečnostní omezení
- Ujistěte se, že cesta v konfiguraci existuje a je přístupná:
  ```bash
  ls -la /path/to/directory
  ```

### Timeout problémy

- Některé servery potřebují čas na inicializaci
- Zvyšte timeout při testování:
  ```bash
  timeout 30 uvx mcp-server-fetch
  ```

## Bezpečnost

### Filesystem Server
- Omezuje přístup pouze na specifikované adresáře
- Nemůže číst/zapisovat mimo povolené cesty
- Vždy specifikujte co nejmenší možnou cestu

### Fetch Server
- Stahuje pouze veřejně dostupný obsah
- Neposílá cookies ani autentizační údaje
- Dodržujte robots.txt a terms of service

### Memory Server
- Data jsou ukládána lokálně
- Nevyžaduje připojení k internetu
- Osobní data zůstávají na vašem zařízení

## Reference

- [MCP Dokumentace](https://modelcontextprotocol.io/)
- [Oficiální MCP servery](https://github.com/modelcontextprotocol/servers)
- [MCP SDK](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
- [Claude Code dokumentace](https://docs.claude.com/en/docs/claude-code)

## Další kroky

1. Prozkoumejte [seznam 100+ komunitních MCP serverů](https://github.com/modelcontextprotocol/servers)
2. Vytvořte vlastní MCP server pro specifické potřeby
3. Integrujte MCP s vašimi interními nástroji a databázemi

---

**Poslední aktualizace**: 15. listopadu 2025

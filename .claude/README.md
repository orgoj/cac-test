# Claude MCP Configuration

Tento adresář obsahuje konfiguraci pro Model Context Protocol (MCP) servery.

## Nakonfigurované MCP servery

### 1. Filesystem Server
- **Popis**: Poskytuje přístup k souborovému systému
- **Příkaz**: `npx @modelcontextprotocol/server-filesystem`
- **Rozsah**: `/home/user/cac-test`

### 2. Fetch Server
- **Popis**: Poskytuje HTTP fetch schopnosti pro načítání web obsahu
- **Příkaz**: `npx @modelcontextprotocol/server-fetch`

### 3. Memory Server
- **Popis**: Poskytuje perzistentní paměťový kontext napříč sezeními
- **Příkaz**: `npx @modelcontextprotocol/server-memory`

## Jak MCP funguje

MCP (Model Context Protocol) umožňuje Claude Code připojit se k externím datovým zdrojům a službám. Servery běží jako samostatné procesy a komunikují s Claude přes standardizovaný protokol.

## Testování

Po restartu Claude Code budou tyto MCP servery automaticky dostupné. Můžete je otestovat pomocí příkazů, které využívají jejich schopnosti.

## Další možnosti

Další dostupné MCP servery:
- `@modelcontextprotocol/server-github` - GitHub integrace
- `@modelcontextprotocol/server-sqlite` - SQLite databáze
- `@modelcontextprotocol/server-postgres` - PostgreSQL databáze
- Context7 - pokročilé code context nástroje
- Vlastní MCP servery přes HTTP nebo stdio

## Reference

- [MCP Documentation](https://modelcontextprotocol.io/)
- [Official MCP Servers](https://github.com/modelcontextprotocol/servers)

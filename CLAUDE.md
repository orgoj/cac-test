# Claude Code - Pokyny pro práci s tímto repozitářem

## Účel repozitáře

Tento repozitář slouží **výhradně pro dokumentaci** Claude Code remote execution environment dostupného na [claude.ai/code](https://claude.ai/code).

## Pravidla pro dokumentaci

### 1. Struktura dokumentace

**DŮLEŽITÉ:** Všechna dokumentace musí být uložena v **root adresáři** projektu.

- ❌ **NESPRÁVNĚ:** Vytvářet podadresáře typu `docs/`, `documentation/`, atd.
- ✅ **SPRÁVNĚ:** Všechny `.md` soubory v root adresáři projektu

**Výjimky:**
- `.claude/` adresář - pro Claude Code konfiguraci (skills, hooks, commands)
- `examples/` adresář - pro příklady a demo skripty

### 2. README.md jako hlavní index

- README.md **MUSÍ** obsahovat kompletní seznam všech dokumentačních souborů
- Každý nový `.md` soubor **MUSÍ** být přidán do sekce "Documentation Index" v README.md
- Odkazy musí být ve formátu: `- **[FILENAME.md](FILENAME.md)** - Stručný popis`

### 3. Projektové Skills

Claude Code má v tomto prostředí k dispozici následující projektové skills:

#### session-start-hook
- **Typ:** User skill
- **Popis:** Creating and developing startup hooks for Claude Code on the web. Use when the user wants to set up a repository for Claude Code on the web, create a SessionStart hook to ensure their project can run tests and linters during web sessions.
- **Použití:** Nastavení repozitáře pro automatické spouštění testů a linterů při startu Claude Code session

#### flutter-development
- **Typ:** Managed skill
- **Popis:** Build cross-platform mobile apps with Flutter and Dart. Use when creating mobile applications, working with Flutter projects, designing UIs with widgets, implementing state management (Provider/BLoC), handling navigation.
- **Použití:** Vývoj mobilních aplikací s Flutter, práce s widgety, state management, navigace

### 4. Když přidáváš novou dokumentaci

1. Vytvoř `.md` soubor **v root adresáři**
2. Přidej odkaz do README.md sekce "Documentation Index"
3. Použij popisný název souboru (např. `MCP_SECURITY_GUIDE.md`, `PRPM_PROXY_ISSUE.md`)
4. Zahrň do názvu téma nebo problém, který dokumentace řeší

### 5. Když najdeš dokumentaci v podadresářích

Pokud Claude Code najde dokumentaci v podadresářích (např. `docs/`):

1. **Přesuň** všechny `.md` soubory do root adresáře
2. **Aktualizuj** odkazy v README.md
3. **Smaž** prázdný podadresář
4. **Commitni** změny s popisem "Move documentation to root directory"

## Příklad správné struktury

```
/home/user/cac-test/
├── README.md                           # Hlavní index
├── CLAUDE.md                          # Tento soubor - pravidla
├── CONFIGURATION.md                   # Dokumentace
├── SYSTEM_ENVIRONMENT.md              # Dokumentace
├── MCP_SERVERS.md                     # Dokumentace
├── PRPM_PROXY_ISSUE.md               # Dokumentace
├── .claude/
│   ├── skills/
│   │   └── flutter-development/
│   │       └── SKILL.md
│   └── commands/
└── examples/
    └── deploy-guide.md
```

## Příklad NESPRÁVNÉ struktury

```
/home/user/cac-test/
├── README.md
├── docs/                              # ❌ ŠPATNĚ
│   ├── PRPM_PROXY_ISSUE.md           # ❌ Má být v root
│   └── README.md                      # ❌ Nepotřebné
└── documentation/                     # ❌ ŠPATNĚ
    └── guide.md                       # ❌ Má být v root
```

## Checklist před commitem

- [ ] Všechny `.md` soubory jsou v root (kromě `.claude/` a `examples/`)
- [ ] README.md obsahuje odkazy na všechny dokumentační soubory
- [ ] Žádné prázdné `docs/` nebo podobné adresáře neexistují
- [ ] Nové soubory mají popisné názvy
- [ ] Každý odkaz v README.md má stručný popis

## Důvod těchto pravidel

- **Jednoduchost:** Všechna dokumentace na jednom místě
- **Přehlednost:** README.md jako single source of truth
- **Rychlost:** Snadné vyhledávání bez procházení podadresářů
- **Konzistence:** Jednotná struktura pro všechny přispěvatele

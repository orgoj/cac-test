# Flutter Hello World

Jednoduchá Flutter aplikace vytvořená pomocí vlastního Flutter Development Skillu.

## O projektu

Tato aplikace demonstruje:
- ✅ **Použití prpm nástroje** - package manager pro AI prompts a skills
- ✅ **Vytvoření Flutter skillu** - vlastní skill pro Flutter development
- ✅ **Flutter Hello World** - základní Flutter aplikace s Material Design 3

## Flutter Skill

Flutter skill byl vytvořen v `.claude/skills/flutter-development.md` a obsahuje:

- Best practices pro Flutter development
- Základní šablony a pattern-y
- Instrukce pro state management
- Příklady běžných widget-ů a návrhových vzorů
- Doporučené příkazy a workflow

## Struktura aplikace

Aplikace používá tyto Flutter koncepty podle skillu:

- **const constructors** - pro lepší performance
- **StatelessWidget** - pro jednoduchý UI bez stavu
- **Material Design 3** - moderní UI framework
- **Responsive layout** - Column, Center, SizedBox widgets
- **Semantic naming** - HomePage místo MyHomePage

## Spuštění aplikace

```bash
# Přejít do složky projektu
cd flutter_hello_world

# Spustit aplikaci
flutter run
```

### Dostupné platformy

```bash
# Web
flutter run -d chrome

# Linux desktop
flutter run -d linux

# Android (vyžaduje emulator nebo zařízení)
flutter run -d android
```

## Testování prpm nástroje

Během vývoje byl otestován prpm nástroj:

```bash
# Instalace
npm install -g prpm

# Vyhledávání skills
prpm search flutter

# Poznámka: V tomto prostředí měl prpm problémy s připojením k registru
# Proto byl Flutter skill vytvořen ručně podle dokumentace z claude-plugins.dev
```

## Použitý Flutter Skill

Skill obsahuje kompletní průvodce pro:

1. Vytváření Flutter projektů
2. State management (Provider, BLoC)
3. Navigation a routing
4. HTTP requests a API integrace
5. Best practices a anti-patterns
6. Běžné widget-y a layout patterns

Viz `.claude/skills/flutter-development.md` pro kompletní dokumentaci.

## Technologie

- **Flutter**: 3.38.1
- **Dart**: 3.10.0
- **Material Design**: 3
- **prpm**: latest (testováno, ale použit alternativní přístup)

## Co bylo naučeno

1. **prpm** je package manager pro AI prompts, který funguje napříč editorem (Cursor, Claude, Continue, atd.)
2. **Skills** lze vytvářet ručně když registry není dostupný
3. **Flutter** lze nainstalovat a používat v Linux prostředí pomocí git clone
4. **Best practices** ze skillu pomáhají psát čistší a výkonnější Flutter kód

## Další kroky

Pro rozšíření aplikace podle Flutter skillu:

- [ ] Přidat state management s Provider
- [ ] Implementovat navigaci s GoRouter
- [ ] Přidat HTTP requests
- [ ] Vytvořit více screen-ů
- [ ] Implementovat dark mode
- [ ] Přidat unit testy

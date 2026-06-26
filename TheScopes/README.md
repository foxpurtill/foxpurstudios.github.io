# The Scopes

A cosmic guidance UE5 experience combining astrology, numerology, biorhythms, and moon phases.

## What's Included

### C++ Module (`Source/TheScopes/`)
- **TheScopesEngine.h/.cpp** — Blueprint-callable calculation functions:
  - `GetZodiacSign(date)` — returns zodiac sign from birth date
  - `GetMoonPhase(date)` — returns moon phase name and illumination
  - `CalculateLifePathNumber(date)` — numerology life path number
  - `CalculateExpressionNumber(name)` — numerology expression number
  - `CalculateSoulUrgeNumber(name)` — numerology soul urge number
  - `CalculateBiorhythm(date, type, period)` — biorhythm percentage
- **TheScopesHUD.h/.cpp** — AHUD subclass that auto-creates and displays the UMG widget on BeginPlay. Set this as your GameMode's HUD Class.
- **TheScopes.Build.cs** — Module build rules (UMG, Slate, SlateCore dependencies)

### Python Calculation Engine (`Content/Python/`)
- **TheScopesEngine.py** — Standalone Python implementation of all calculations
- **the_scopes_calc.py** — CLI calculator → JSON output
- **TheScopesDisplay.py** — Screen display helper

### Documentation (`Docs/`)
- **TheScopes_Setup_Instructions.md** — Step-by-step setup guide for the UE5 project

## Current State (June 26, 2026)

### What Works
- Python calculation engine (tested, produces correct results)
- C++ module (written, needs compilation in UE5 editor)
- UMG Widget Blueprint at `/Game/UI/TheScopes_MainUI`
- Level environment: dark cosmic sky, ground plane, atmospheric lighting

### What Needs To Be Done
1. **Compile C++ in UE5 editor** — Tools → Compile C++ Code
2. **Set up GameMode** — Create `TheScopesGameMode` (parent: GameModeBase), set HUD Class to `TheScopesHUD`
3. **World Settings** — Override Game Mode → `TheScopesGameMode`
4. **Clean Level Blueprint** — Delete all nodes (broken from earlier MCP attempts)
5. **Remove old actors** — Delete `TheScopesCanvasHUD_C_0`, `TheScopesHUD_C_0`, `TheScopesHUDv2`
6. **Press Play** — Widget should appear automatically
7. **Wire Calculate button** — Bind OnClicked to call C++ engine functions, update result text blocks

### Known Issues
- Level Blueprint has broken nodes from MCP tool attempts — must be deleted manually
- C++ `TheScopesHUD` class not yet compiled — editor must compile first
- MCP Blueprint tools cannot set class-type pin defaults (fundamental limitation)
- Widget visibility issue when parent class is Actor instead of HUD (now fixed with C++ AHUD subclass)

## Test Data
```
Name: Patricia Caelum
Birth: 2004-09-21

Sun Sign: Virgo
Moon Phase: Waxing Gibbous (94.4%)
Life Path: 3
Expression: 4
Soul Urge: 8
Physical: -13.6%
Emotional: 62.3%
Intellectual: -99.0%
Days Alive: 13,191
```

## Tech Stack
- Unreal Engine 5.7
- C++ with UMG (UI framework)
- Python 3.x (standalone calculator)
- McpAutomationBridge plugin (editor automation)

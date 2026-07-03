# CLAUDE.md

Guidance for Claude Code when working in this repo.

## What this is

A single-page Create React App (CRA, react-scripts 5, React 19) that lets players of the
Legends of the Jedi MUD filter/compare alien races by class levels, stats, cost, and traits.
All logic lives in [src/App.js](src/App.js) — one file, one class component, no router, no
state library. Keep it that way unless the task requires otherwise.

## Data pipeline

Race data is NOT authored by hand. It's scraped from the live MUD via the MUSHClient plugin
[LotJ_Race_Exporter.xml](LotJ_Race_Exporter.xml) (Lua), which parses `showrace` output and
dumps JSON to the clipboard (`dumpRaces` alias). That JSON is pasted into
`src/races_raw.json`, then reformatted:

```bash
jq --sort-keys . src/races_raw.json > src/races.json
```

`src/App.js` imports `src/races.json` directly and builds everything from it at module load
time. The `races_raw_*` / `races_*` files with era suffixes (`pre-2024`, `sandbox-2022`,
`sandbox-2024`) are point-in-time snapshots kept for reference/diffing — don't delete them,
don't treat them as live data.

## Commands

```bash
npm start   # dev server, localhost:3000
npm run build
npm test    # CRA/Jest, barely used — see src/App.test.js
```

## Data model (per race in races.json)

`name, shortdesc, price, deposit, str/dex/con/int/wis/cha/lck, hp, ac, frc, apponly,
language, traits[], skincolors[], levels.{com,pil,eng,hun,smu,lea,esp,sli,med,sci}` where
each `levels.<mainclass>` is itself an object of levels-per-class (a 10x10 matrix: level
reached in each of the 10 classes when that class is your main). Class codes: COM
(combat), PIL (piloting), ENG (engineering), HUN (bounty hunting), SMU (smuggling), LEA
(leadership), ESP (espionage), SLI (slicer), MED (medical), SCI (science).

## Known rough edges (don't "fix" these as drive-by cleanup)

- `App.js` mutates the imported race objects in place (`race.radar = [...]`) rather than
  copying — intentional one-time enrichment at module load, not per-render.
- There's a stray `console.log(event)` and a commented-out fieldset-toggle block in
  `handleInputChange` — pre-existing WIP, leave alone unless asked to touch that code path.
- `imperialRaces` is a hardcoded name list in `App.js`, not derived from a trait/flag in the
  data. If the race list changes, this list needs manual updates too.

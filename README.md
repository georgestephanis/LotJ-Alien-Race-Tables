# Legends of the Jedi React Races Index

A React app for filtering/comparing alien races from the Legends of the Jedi MUD by
class levels, stats, cost, and traits.

Race data comes from a dump (generated via the race exporter plugin,
[LotJ_Race_Exporter.xml](LotJ_Race_Exporter.xml), included in the root) from MUSHClient.
Once the export is generated and saved to `src/races_raw.json`, format it into
`src/races.json` (the file the app actually imports) with:

```bash
jq --sort-keys . src/races_raw.json > src/races.json
```

Sorting keeps diffs of the dataset readable.

## Getting started

Built with [Create React App](https://github.com/facebook/create-react-app) (react-scripts 5).

```bash
npm install
npm start      # dev server at http://localhost:3000, reloads on change
npm test       # Jest via react-scripts
npm run build  # production build to ./build
```

See [CLAUDE.md](CLAUDE.md) for the data model and known rough edges.

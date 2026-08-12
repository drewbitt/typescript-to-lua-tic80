# TIC-80 TypeScript starter

Write a [TIC-80](https://tic80.com/) game in TypeScript. [TypeScriptToLua](https://typescripttolua.github.io/) compiles the project to one Lua text cartridge.

[Use this template](https://github.com/drewbitt/typescript-to-lua-tic80/generate) to create a repository.

## Before you start

- Node.js 22 or newer
- pnpm 11.21.0
- [TIC-80 Pro](https://github.com/nesbox/TIC-80/wiki/PRO-Version), or a source build made with `BUILD_PRO=On`, to open and save Lua text cartridges

Run `npx get-pnpm` if pnpm isn't installed.

## Get started

```sh
pnpm install
pnpm start
```

`pnpm start` builds `index.lua` and opens it in TIC-80. If the executable is not named `tic80`, change the `play` script in `package.json`.

## Code and cartridge data

Put game code in `index.ts`. Imported TypeScript modules are bundled into `index.lua`; there is no separate bundler or manual `require` step.

TIC-80 calls frame callbacks from Lua's global table. The sample assigns `globalThis.TIC`, and TypeScriptToLua writes `_G.TIC`. This is the same callback as `function TIC()` in TIC-80's Lua examples. The declarations in `tic.d.ts` also cover `BOOT`, `OVR`, `SCN`, `MENU`, and `BDR`.

TIC-80 uses Lua comments such as `-- title: game` and `-- <TILES>` instead of a separate frontmatter file. Those comments live in `assets.lua` and are added to the generated cartridge during each build.

When you edit sprites, maps, sound, or music in TIC-80:

1. Save the cart before rebuilding or reloading it.
2. Run `pnpm sync-assets` before the next build.
3. Commit the updated `assets.lua`.

Builds read from `assets.lua` and never copy data back from `index.lua`. This keeps an old generated cart from replacing newer tracked assets. Do not leave `pnpm dev` running while TIC-80 has unsaved resource edits; both programs can write the same file.

Read TIC-80's [cartridge metadata](https://github.com/nesbox/TIC-80/wiki/Cartridge-Metadata) and [external editor](https://github.com/nesbox/TIC-80/wiki/External-Editor) pages for the comment format and save rules.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm build` | Type-check, bundle the TypeScript modules, and add `assets.lua` to `index.lua` |
| `pnpm dev` | Rebuild `index.lua` when a TypeScript file changes |
| `pnpm start` | Build and open the cartridge in TIC-80 |
| `pnpm play` | Open the existing cartridge without rebuilding |
| `pnpm sync-assets` | Copy saved metadata and resource comments from `index.lua` to `assets.lua` |
| `pnpm test` | Test cartridge-data handling and run a complete build |
| `pnpm typecheck` | Check the project with native TypeScript 7 |

## Why two TypeScript packages?

TypeScriptToLua 1.37.1 uses the TypeScript 6 compiler API. The build keeps Microsoft's TypeScript 6 compatibility package for Lua output and runs native TypeScript 7 as a separate type check.

# TIC-80 TypeScript starter

Write a [TIC-80](https://tic80.com/) game in TypeScript. [TypeScriptToLua](https://typescripttolua.github.io/) compiles the project to one Lua text cartridge.

[Use this template](https://github.com/drewbitt/typescript-to-lua-tic80/generate) to create a repository.

## Before you start

- Node.js 22 or newer
- pnpm 11
- [TIC-80 Pro](https://github.com/nesbox/TIC-80/wiki/PRO-Version), or a source build made with `BUILD_PRO=On`, to open and save Lua text cartridges

Run `npx get-pnpm` if pnpm isn't installed.

## Get started

```sh
pnpm install
pnpm start
```

`pnpm start` builds `index.lua` and opens it in TIC-80. If the executable is not named `tic80`, change the `play` script in `package.json`.

## Project files

| File | Contents |
| --- | --- |
| `index.ts` and other `.ts` files | Game code |
| `assets.lua` | Cartridge metadata, sprites, maps, sound, and music |
| `index.lua` | Generated cartridge; do not commit it |

TIC-80 expects its callbacks in Lua's global table. Define them with `globalThis`:

```ts
globalThis.TIC = function TIC() {
	// Runs once per frame.
};
```

TypeScriptToLua emits this as `_G.TIC`. `tic.d.ts` also declares `BOOT`, `OVR`, `SCN`, `MENU`, and `BDR`.

## Editing cartridge resources

Edit cartridge resources in TIC-80. Then:

1. Save the cart in TIC-80.
2. Run `pnpm sync-assets`.
3. Commit the updated `assets.lua`.

> [!IMPORTANT]
> Save and sync before rebuilding or reloading. `pnpm dev` rewrites `index.lua`, so stop it while TIC-80 has unsaved resource edits.

Every build reads cartridge data from `assets.lua`. TIC-80's [cartridge metadata](https://github.com/nesbox/TIC-80/wiki/Cartridge-Metadata) and [external editor](https://github.com/nesbox/TIC-80/wiki/External-Editor) pages document the file format.

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

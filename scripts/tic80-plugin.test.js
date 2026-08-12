const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const createPlugin = require("./tic80-plugin");
const { extractCartData, syncAssets } = createPlugin;

function temporaryDirectory(t, prefix) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  t.after(() => fs.rmSync(directory, { recursive: true }));
  return directory;
}

const knownSections = [
  "TILES",
  "SPRITES",
  "MAP",
  "WAVES",
  "SFX",
  "PATTERNS",
  "TRACKS",
  "FLAGS",
  "SCREEN",
  "PALETTE",
  "LANG",
  "TILES1",
];

test("extracts TIC-80 metadata, known sections, banks, and future sections", () => {
  const metadata = [
    "-- title: game",
    "-- author: player",
    "-- desc: example",
    "-- script: lua",
    "-- input: gamepad",
    "-- saveid: game-save",
    "-- menu: RESET",
    "-- site: example.com",
    "-- license: MIT",
    "-- version: 1.0",
  ];
  const sections = [...knownSections, "FUTURE_DATA"].map(
    section => `-- <${section}>\n-- 000:00\n-- </${section}>`,
  );
  const expected = `${metadata.join("\n")}\n\n${sections.join("\n\n")}\n`;

  assert.equal(extractCartData(`local code = true\n${expected}`), expected);
});

test("ignores Lua files without cartridge data", () => {
  assert.equal(extractCartData("local value = 1\n"), undefined);
});

test("normalizes Windows line endings when syncing cartridge data", () => {
  assert.equal(
    extractCartData("local value = 1\r\n-- title: game\r\n-- script: lua\r\n"),
    "-- title: game\n-- script: lua\n",
  );
});

test("keeps the template assets in canonical TIC-80 comment form", () => {
  const assets = fs.readFileSync(path.resolve(__dirname, "..", "assets.lua"), "utf8");
  const sections = Array.from(assets.matchAll(/^-- <([A-Z][A-Z0-9_]*)>\n((?:-- \d{3}:[0-9a-f]+\n)+)-- <\/\1>$/gm));

  assert.equal(extractCartData(assets), assets);
  assert.equal(sections.length, 5);
});

test("attaches assets to the bundled output using the config directory", t => {
  const directory = temporaryDirectory(t, "tic80-plugin-");
  const assets = "-- title: attached\n-- script: lua\n\n-- <TILES>\n-- 000:00\n-- </TILES>\n";
  fs.writeFileSync(path.join(directory, "assets.lua"), assets);
  const files = [{ outputPath: path.join(directory, "index.lua"), code: "local value = 1\n" }];

  createPlugin({ assets: "assets.lua" }).beforeEmit(
    undefined,
    { configFilePath: path.join(directory, "tsconfig.json") },
    undefined,
    files,
  );

  assert.equal(
    files[0].code,
    "-- title: attached\n-- script: lua\n\nlocal value = 1\n\n-- <TILES>\n-- 000:00\n-- </TILES>\n",
  );
});

test("syncs assets only when explicitly requested", t => {
  const directory = temporaryDirectory(t, "tic80-sync-");
  const cartPath = path.join(directory, "index.lua");
  const assetsPath = path.join(directory, "assets.lua");
  fs.writeFileSync(cartPath, "local value = 1\n-- title: saved\n-- script: lua\n");
  fs.writeFileSync(assetsPath, "-- title: current\n-- script: lua\n");

  assert.equal(fs.readFileSync(assetsPath, "utf8"), "-- title: current\n-- script: lua\n");
  syncAssets(cartPath, assetsPath);
  assert.equal(fs.readFileSync(assetsPath, "utf8"), "-- title: saved\n-- script: lua\n");
});

test("refuses to replace assets from a file without cartridge data", t => {
  const directory = temporaryDirectory(t, "tic80-sync-");
  const cartPath = path.join(directory, "index.lua");
  const assetsPath = path.join(directory, "assets.lua");
  fs.writeFileSync(cartPath, "local value = 1\n");
  fs.writeFileSync(assetsPath, "-- title: current\n-- script: lua\n");

  assert.throws(() => syncAssets(cartPath, assetsPath), /No TIC-80 cartridge data found/);
  assert.equal(fs.readFileSync(assetsPath, "utf8"), "-- title: current\n-- script: lua\n");
});

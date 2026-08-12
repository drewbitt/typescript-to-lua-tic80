const fs = require("node:fs");
const path = require("node:path");

const HEADER_PATTERN = /^--\s*(?:title|author|desc|script|input|saveid|menu|site|license|version):.*$/gim;
const SECTION_PATTERN = /^--\s*<([A-Z][A-Z0-9_]*)>[\s\S]*?^--\s*<\/\1>[ \t]*$/gm;

function extractCartParts(source) {
  const normalizedSource = source.replaceAll("\r\n", "\n");
  const headers = normalizedSource.match(HEADER_PATTERN) ?? [];
  const sections = Array.from(normalizedSource.matchAll(SECTION_PATTERN), match => match[0]);

  return { headers, sections };
}

function extractCartData(source) {
  const { headers, sections } = extractCartParts(source);

  if (headers.length === 0 && sections.length === 0) return undefined;
  return [headers.join("\n"), sections.join("\n\n")].filter(Boolean).join("\n\n") + "\n";
}

function getProjectRoot(compilerOptions) {
  return compilerOptions.configFilePath
    ? path.dirname(compilerOptions.configFilePath)
    : process.cwd();
}

module.exports = function tic80Plugin(options) {
  return {
    beforeEmit(_program, compilerOptions, _emitHost, files) {
      const assetsPath = path.resolve(getProjectRoot(compilerOptions), options.assets ?? "assets.lua");
      const { headers, sections } = extractCartParts(fs.readFileSync(assetsPath, "utf8"));
      const bundle = files.find(file => file.outputPath.endsWith(".lua"));
      if (bundle) {
        bundle.code = [headers.join("\n"), bundle.code.trim(), sections.join("\n\n")]
          .filter(Boolean)
          .join("\n\n") + "\n";
      }
    },
  };
};

function syncAssets(cartPath, assetsPath) {
  const source = fs.readFileSync(cartPath, "utf8");
  const cartData = extractCartData(source);
  if (!cartData) throw new Error(`No TIC-80 cartridge data found in ${cartPath}`);
  fs.writeFileSync(assetsPath, cartData);
}

module.exports.extractCartData = extractCartData;
module.exports.syncAssets = syncAssets;

if (require.main === module) {
  const root = process.cwd();
  syncAssets(path.resolve(root, "index.lua"), path.resolve(root, "assets.lua"));
  console.log("Copied TIC-80 metadata and assets from index.lua to assets.lua.");
}

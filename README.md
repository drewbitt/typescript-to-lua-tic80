# Typescript to Lua for TIC-80

Base project for writing TIC-80 games in Typescript by transpiling to Lua.

Utilizes [TypeScriptToLua](https://typescripttolua.github.io/)

## Bundling

In development no bundling is needed. Using the typescript `import` function will generate lua code utilizing the `require` function. TIC-80 will find the file being imported via `require` in the current directory.

In production or when wanting to run the application without being in the same directory as the source files, it is recommended to use [TQ-Bundler](https://github.com/scambier/TQ-Bundler) to bundle the application into a single file. To use TQ-Bundler, replace the `require` function in lua code with `include` statements.

```lua
-- Lua syntax
include "macros" -- will look for ./macros.lua
include "tools.utils" -- ./tools/utils.lua
```

TQ-Bundler will replace the `include` statements with the contents of the file being included. Follow instructions in the TQ-Bundler repository to install and use.

## Minification

Included in the `scripts` folder is a script to minify the lua code. This is not required, but can be used to reduce the size of the lua code. To use, run `node scripts/minify.js <path to lua file>`. This will create a new file with the same name as the original file in the `dist` folder, but with `.min.lua` appended to the end.

Note: Comments will not be included in minified code. Therefore, TIC-80 metadata will not be included. This can be added back in manually.

This is largely untested and may not work as expected for TIC-80 specific API code. You can also try using `TQ-Bundler` to bundle the application and minify the bundled file.

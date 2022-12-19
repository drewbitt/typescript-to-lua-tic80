# Typescript to Lua for TIC-80

Base project for writing TIC-80 games in Typescript by transpiling to Lua.

## Bundling

In development no bundling is needed. Using the typescript `import` function will generate lua code utilizing the `require` function. TIC-80 will find the file being imported via `require` in the current directory.

In production or when wanting to run the application without being in the same directory as the source files, it is recommended to use [TQ-Bundler](https://github.com/scambier/TQ-Bundler) to bundle the application into a single file. To use TQ-Bundler, replace the `require` function in lua code with `include` statements.

```lua
-- Lua syntax
include "macros" -- will look for ./macros.lua
include "tools.utils" -- ./tools/utils.lua
```

TQ-Bundler will replace the `include` statements with the contents of the file being included. Follow instructions in the TQ-Bundler repository to install and use.

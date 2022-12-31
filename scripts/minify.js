/*
    Usage: node minify.js <path to file>
    Example: node scripts/minify.js index.lua
    Output: dist/index.min.lua

    This script will minify the file and save it in the dist folder
    This script will NOT include TIC-80 metadata which is represented as a Lua comment. You will need to add the metadata manually back to the minified file.
*/

const luamin = require('lua-format')
const fs = require('fs')

const arg = process.argv[2]

const Code = fs.readFileSync(arg, 'utf8')
const Settings = {
    RenameVariables: true,
    RenameGlobals: false,
    SolveMath: true
}

const Minified = luamin.Minify(Code, Settings)

const path = arg.split('/')
const filename = path[path.length - 1]
const filenameParts = filename.split('.')
filenameParts.splice(filenameParts.length - 1, 0, 'min')
const filenameMin = filenameParts.join('.')

const newpath = `dist/${filenameMin}`

if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist')
}

fs.writeFileSync(newpath, Minified, 'utf8')
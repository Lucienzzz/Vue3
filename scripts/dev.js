// console.log(process);
const args = require('minimist')(process.argv.slice(2))
// the value of args is `C:\\Users\\nhtb\\Desktop\\myProject\\vue\\scripts\\dev.js`
// console.log(args);
const {resolve} = require('path')
// internal module function in the node, to get the current file path
// console.log(resolve);
// console.log(args)

const target = args._[0] || 'reactivity';
const format = args.f || 'global';
// console.log(target);

// 开发环境只打包某一个
const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))
const {build} = require("esbuild");
// params `__dirname` always represent current file directory
// iife     immediate run function   (function(){})()
// cjs      the module of node        module.exports
// esm      esModule from browser     import
const outputFormat = format.startsWith('global') ? 'iife' :
    format === 'cjs' ? 'cjs' : 'esm'
const outfile = resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`)

build({
    entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
    outfile,
    bundle: true, // pack all of packages together
    sourcemap: true,
    format: outputFormat, // the format of target
    globalName: pkg.buildOptions?.name, // global name of pack
    platform: format === 'cjs' ? 'node' : 'browser', // platform
    watch: {
        onRebuild(error) {
            if (!error) console.log('rebuild~~~~~~')
        }
    }
}).then(() => {
    console.log('watching~~~~~~`')
})


const { defaults, watch } = require('./rollup.build');

const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const livereload = require('rollup-plugin-livereload');

const nodeBuiltins = require('rollup-plugin-node-builtins');
const nodeGlobals = require('rollup-plugin-node-globals');

const livereloadServer = livereload({
    watch: 'src/node-server/plinko/',
    port: 35732
});

watch([
  Object.assign({}, defaults, {
    entry: 'src/browser/canvas-websocket/index.js',
    dest: 'lib/browser/canvas-websocket.js',
    moduleName: 'NodeServerBrowserPlinko',
    plugins: defaults.plugins.concat([
      livereloadServer,
      nodeBuiltins(),
      nodeGlobals()
    ])
  }),
  {
    entry: 'src/node/canvas-websocket/index.js',
    dest: 'lib/node/canvas-websocket.js',
    moduleName: 'NodeServerNodePlinko',
    format: 'cjs',
    plugins: [
      commonjs(),
      babel({
        exclude: ['node_modules/**', 'data/**']
      })
    ]
  }
]);


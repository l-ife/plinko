const rollup = require('rollup');
const watch = require('rollup-watch');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const livereload = require('rollup-plugin-livereload');
const serve = require('rollup-plugin-serve');


const defaults = {
  format: 'iife',
  sourceMap: true,
  plugins: [
    babel({
      exclude: 'node_modules/**',
      exclude: 'data/**'
    }),
    commonjs(),
    resolve(),
    serve('lib'),
    livereload()
  ]
};

const configs = [
  Object.assign({}, defaults, {
    entry: 'src/index.js',
    dest: 'lib/index.js',
    moduleName: 'Index'
  }),
  Object.assign({}, defaults, {
    entry: 'src/plinko.js',
    dest: 'lib/plinko.js',
    moduleName: 'Plinko'
  })
];

const watchers = configs.map(config => watch(rollup, config));

const stderr = console.error.bind(console)

const eventHandler = (event, filename) => {
  switch (event.code) {
    case 'STARTING':
      stderr('checking rollup-watch version...')
      break
    case 'BUILD_START':
      stderr(`bundling ${filename}...`)
      break
    case 'BUILD_END':
      stderr(`${filename} bundled in ${event.duration}ms. Watching for changes...`)
      break
    case 'ERROR':
      stderr(`error: ${event.error}`)
      break
    default:
      stderr(`unknown event: ${event}`)
  }
}

watchers.forEach(
  (watcher, ndx) =>
    watcher.on('event', event => eventHandler(event, configs[ndx].entry))
);

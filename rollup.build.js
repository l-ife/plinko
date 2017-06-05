const rollup = require('rollup');
const watch = require('rollup-watch');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const livereload = require('rollup-plugin-livereload');
const dsv = require('rollup-plugin-dsv');
const serve = require('rollup-plugin-serve');

// const express = require('express');
// const staticServer = express();

// staticServer.use(express.static('.'));

// staticServer.listen(3000, function() {
//     console.log('Listening on 3000');
// });

const defaults = {
  format: 'iife',
  sourceMap: true,
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      exclude: 'data/**'
    }),
    dsv()
  ]
};

const livereloadServer = livereload('src');
const server = serve({
  contentBase: '.',
  port: 3000
});

const configs = [
  Object.assign({}, defaults, {
    entry: 'src/test-matterjs.js',
    dest: 'lib/node/test-matterjs.js',
    moduleName: 'test-matterjs'
  }),
  Object.assign({}, defaults, {
    entry: 'src/test-matterjs.js',
    dest: 'lib/browser/test-matterjs.js',
    moduleName: 'Index',
    plugins: defaults.plugins.concat([
      livereloadServer,
      server
    ])
  }),
  Object.assign({}, defaults, {
    entry: 'src/browser/plinko.js',
    dest: 'lib/browser/plinko.js',
    moduleName: 'Plinko',
    plugins: defaults.plugins.concat([
      livereloadServer,
      server
    ])
  }),
  Object.assign({}, defaults, {
    entry: 'src/node/plinko.js',
    dest: 'lib/node/plinko.js',
    moduleName: 'Plinko',
    plugins: defaults.plugins.concat([
    ])
  }),
  Object.assign({}, defaults, {
    entry: 'src/browser/data/3d.js',
    dest: 'lib/browser/data/3d.js',
    moduleName: '3d-scatterplot',
    plugins: defaults.plugins.concat([
      livereloadServer,
      server
    ])
  }),
  Object.assign({}, defaults, {
    entry: 'src/browser/data/2d.js',
    dest: 'lib/browser/data/2d.js',
    moduleName: '3d-scatterplot',
    plugins: defaults.plugins.concat([
      // livereloadServer,
      server
    ])
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


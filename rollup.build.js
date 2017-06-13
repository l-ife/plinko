const rollup = require('rollup');
const watch = require('rollup-watch');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const dsv = require('rollup-plugin-dsv');

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

const stderr = console.error.bind(console)

const wrappedWatch = (configs) => {
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

  const watchers = configs.map(config => watch(rollup, config));
  watchers.forEach(
    (watcher, ndx) =>
      watcher.on('event', event => eventHandler(event, configs[ndx].entry))
  );
}

module.exports = {
  defaults,
  watch: wrappedWatch
}

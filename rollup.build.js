const assign = require('lodash/assign');

const rollup = require('rollup');
const watch = require('rollup-watch');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');
const nodeBuiltins = require('rollup-plugin-node-builtins');
const nodeGlobals = require('rollup-plugin-node-globals');
const livereload = require('rollup-plugin-livereload');

const defaults = {
  external: [
    'matter-js/build/matter.js',
    'alea',
    'lodash/forEach',
    'lodash/mapValues',
    'lodash/get',
    'lodash/map'
  ],
  globals: {
    'matter-js/build/matter.js': 'Matter',
    alea: 'Alea',
    'lodash/forEach': 'forEach',
    'lodash/mapValues': 'mapValues',
    'lodash/get': 'get',
    'lodash/map': 'map'
  },
};

const getNodeDefaults = (baseOptions) => assign({}, defaults, {
  format: 'cjs',
  plugins: [
    commonjs({
      namedExports: {
        'matter-js/build/matter.js': [
          'Composite', 'Bodies', 'Body', 'Common', 'Composite', 'Engine', 'Events', 'Render', 'World'
        ]
      }
    }),
    // uglify(),
    babel({
      exclude: ['node_modules/**', 'data/**']
    })
  ]
}, baseOptions);

const getBrowserDefaults = (baseOptions, livereloadOptions) => {
  let browserPlugins = [
      resolve({
        // jsnext: true,
        module: true,
        // main: true,
        // modulesOnly: true,
        // browser: true
      }),
      commonjs({
        namedExports: {
          'matter-js/build/matter.js': [
            'Composite', 'Bodies', 'Body', 'Common', 'Composite', 'Engine', 'Events', 'Render', 'World'
          ]
        }
      }),
      // uglify(),
      babel({
        exclude: ['node_modules/**', 'data/**']
      }),
      nodeBuiltins(),
      nodeGlobals()
    ];
  if (livereloadOptions) {
    const { livereloadServer, livereloadWatchPath, port } = livereloadOptions;
    browserPlugins.push( livereloadServer || livereload({ watch: livereloadWatchPath, port }) );
  }
  return assign({}, defaults, {
    format: 'iife',
    sourceMap: true,
    plugins: browserPlugins
  }, baseOptions);
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
  watch: wrappedWatch,
  getBrowserDefaults,
  getNodeDefaults
}

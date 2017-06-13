const livereload = require('rollup-plugin-livereload');
const uglify = require('rollup-plugin-uglify');

const { defaults, watch } = require('./rollup.build');

const livereloadServer = livereload({
    watch: ['src/test-matterjs', 'src/browser/create-random-dots'],
    port: 35731
});

watch([
  Object.assign({}, defaults, {
    entry: 'src/test-matterjs.js',
    dest: 'lib/browser/test-matterjs.js',
    moduleName: 'matterjs-test-browser',
    plugins: defaults.plugins.concat([
      uglify(),
      livereloadServer
    ])
  }),
  Object.assign({}, defaults, {
    entry: 'src/test-matterjs.js',
    dest: 'lib/node/test-matterjs.js',
    moduleName: 'matterjs-test-node',
    plugins: defaults.plugins.concat([
    ])
  }),
  Object.assign({}, defaults, {
    entry: 'src/browser/create-random-dots/index.js',
    dest: 'lib/browser/create-random-dots.js',
    moduleName: 'p5-js-test',
    plugins: defaults.plugins.concat([
      uglify(),
      livereloadServer
    ])
  })
]);

const livereload = require('rollup-plugin-livereload');
const uglify = require('rollup-plugin-uglify');

const { defaults, watch } = require('./rollup.build');

const livereloadServer = livereload({
    watch: 'src/browser/data',
    port: 35730
});

watch([
  Object.assign({}, defaults, {
    entry: 'src/browser/data/3d.js',
    dest: 'lib/browser/data/3d.js',
    moduleName: '3d-scatterplot',
    plugins: defaults.plugins.concat([
      uglify(),
      livereloadServer
    ])
  }),
  Object.assign({}, defaults, {
    entry: 'src/browser/data/2d.js',
    dest: 'lib/browser/data/2d.js',
    moduleName: '3d-scatterplot',
    plugins: defaults.plugins.concat([
      uglify(),
      livereloadServer
    ])
  })
]);

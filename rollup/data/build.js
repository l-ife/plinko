const { watch, getBrowserDefaults } = require('./rollup.build');

const livereload = require('rollup-plugin-livereload');
const livereloadServer = livereload({
  port: 35730, watch: 'src/browser/data'
});

watch([
  getBrowserDefaults({
    entry: 'src/browser/data/3d.js',
    dest: 'lib/browser/data/3d.js',
    moduleName: '3d-scatterplot'
  }, { livereloadServer }),
  getBrowserDefaults({
    entry: 'src/browser/data/2d.js',
    dest: 'lib/browser/data/2d.js',
    moduleName: '3d-scatterplot'
  }, { livereloadServer })
]);

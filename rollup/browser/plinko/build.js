const { watch, getBrowserDefaults } = require('./rollup.build');

watch([
  getBrowserDefaults({
    entry: 'src/browser/browser-plinko/index.js',
    dest: 'lib/browser/browser-plinko.js',
    moduleName: 'Plinko'
  }, { livereloadWatchPath: 'src/browser/plinko', port: 35732 })
]);

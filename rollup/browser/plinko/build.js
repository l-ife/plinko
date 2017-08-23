const { watch, getBrowserDefaults } = require('../../core/build');

watch([
  getBrowserDefaults({
    entry: 'src/browser/plinko/index.js',
    dest: 'lib/browser/plinko.js',
    moduleName: 'Plinko'
  }, { livereloadWatchPaths: ['src/browser/plinko', 'src/core/plinko'], port: 35732 })
]);

const { watch, getBrowserDefaults } = require('./rollup.build');

watch([
  getBrowserDefaults({
    entry: 'src/browser/division-tests/index.js',
    dest: 'lib/browser/division-tests.js',
    moduleName: 'Division Tests'
  }, { livereloadWatchPath: 'src/browser/plinko', port: 35734 })
]);

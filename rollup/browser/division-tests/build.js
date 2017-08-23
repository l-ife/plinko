const { watch, getBrowserDefaults } = require('../../core/build');

watch([
  getBrowserDefaults({
    entry: 'src/browser/division-tests/index.js',
    dest: 'lib/browser/division-tests.js',
    moduleName: 'Division Tests'
  }, { livereloadWatchPaths: ['src/browser/division-tests', 'src/core/division-tests'], port: 35734 })
]);

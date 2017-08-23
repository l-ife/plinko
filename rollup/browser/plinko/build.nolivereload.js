const { watch, getBrowserDefaults } = require('../../core/build');

watch([
  getBrowserDefaults({
    entry: 'src/browser/plinko/index.js',
    dest: 'lib/browser/plinko.js',
    moduleName: 'Plinko'
  })
]);

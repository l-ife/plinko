const { watch, getNodeDefaults } = require('../../core/build');

watch([
  getNodeDefaults({
    entry: 'src/node/plinko/no-visual.js',
    dest: 'lib/node/plinko.js',
    moduleName: 'Plinko'
  })
]);

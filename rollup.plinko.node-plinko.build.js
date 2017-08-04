const { watch, getNodeDefaults } = require('./rollup.build');

watch([
  getNodeDefaults({
    entry: 'src/node/node-plinko/index.js',
    dest: 'lib/node/node-plinko.js',
    moduleName: 'Plinko'
  })
]);

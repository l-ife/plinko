const { watch, getNodeDefaults } = require('./rollup.build');

watch([
  getNodeDefaults({
    entry: 'src/node/division-tests/index.js',
    dest: 'lib/node/division-tests.js',
    moduleName: 'NodeDivisionTests'
  })
]);

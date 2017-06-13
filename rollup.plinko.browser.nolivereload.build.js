const livereload = require('rollup-plugin-livereload');
const uglify = require('rollup-plugin-uglify');

const { defaults, watch } = require('./rollup.build');

watch([
  Object.assign({}, defaults, {
    entry: 'src/browser/plinko/index.js',
    dest: 'lib/browser/plinko.js',
    moduleName: 'Plinko',
    plugins: defaults.plugins.concat([
      // uglify()
    ])
  })
]);

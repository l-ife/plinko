const livereload = require('rollup-plugin-livereload');
const uglify = require('rollup-plugin-uglify');

const { defaults, watch } = require('./rollup.build');

const livereloadServer = livereload({
    watch: 'src/browser/plinko',
    port: 35732
});

watch([
  Object.assign({}, defaults, {
    entry: 'src/browser/browser-plinko/index.js',
    dest: 'lib/browser/browser-plinko.js',
    moduleName: 'Plinko',
    plugins: defaults.plugins.concat([
      // uglify(),
      livereloadServer
    ])
  })
]);

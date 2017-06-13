const { defaults, watch } = require('./rollup.build');

const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');

watch([
  Object.assign({}, {
    entry: 'src/node/plinko.js',
    dest: 'lib/node/plinko.js',
    moduleName: 'Plinko',
    format: 'cjs',
    plugins: [
      commonjs(),
      babel({
        exclude: 'node_modules/**',
        exclude: 'data/**'
      })
    ]
  })
]);

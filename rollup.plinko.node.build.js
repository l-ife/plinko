const { defaults, watch } = require('./rollup.build');

const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');

watch([
  Object.assign({}, {
    entry: 'src/node/plinko.js',
    dest: 'lib/node/plinko.js',
    moduleName: 'Plinko',
    format: 'cjs',
    plugins: [
      resolve({ module: true }),
      commonjs({
        namedExports: {
          // left-hand side can be an absolute path, a path
          // relative to the current directory, or the name
          // of a module in node_modules
          'node_modules/my-lib/index.js': [ 'named' ]
        }
      }),
      babel({
        exclude: ['node_modules/**', 'data/**']
      })
    ]
  })
]);

import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'src/index.js',
  format: 'iife',
  moduleName: 'index',
  sourceMap: true,
  plugins: [
    babel({
        exclude: 'node_modules/**'
    }),
    commonjs(),
    resolve()
  ],
  dest: 'lib/output.js'
};

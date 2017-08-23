const { watch, getBrowserDefaults, getNodeDefaults } = require('../../core/build');

const livereload = require('rollup-plugin-livereload');
const livereloadServer = livereload({
    watch: ['src/universal/test-matterjs', 'src/browser/create-random-dots'],
    port: 35731
});

watch([
  getBrowserDefaults({
    entry: 'src/universal/test-matterjs/index.js',
    dest: 'lib/browser/test-matterjs.js',
    moduleName: 'matterjs-test-browser'
  }, { livereloadServer }),
  getNodeDefaults({
    entry: 'src/universal/test-matterjs/index.js',
    dest: 'lib/node/test-matterjs.js',
    moduleName: 'matterjs-test-node'
  }),
  getBrowserDefaults({
    entry: 'src/browser/create-random-dots/index.js',
    dest: 'lib/browser/create-random-dots.js',
    moduleName: 'p5-js-test'
  }, { livereloadServer })
]);

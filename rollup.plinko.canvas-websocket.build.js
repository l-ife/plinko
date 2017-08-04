const { watch, getBrowserDefaults, getNodeDefaults } = require('./rollup.build');

const configs = [
  getBrowserDefaults({
    entry: 'src/browser/canvas-websocket/index.js',
    dest: 'lib/browser/canvas-websocket.js',
    moduleName: 'CanvasWebsocketBrowserPlinko'
  }, { livereloadWatchPath: 'src/browser/canvas-websocket', port: 35733 }),
  getNodeDefaults({
    entry: 'src/node/canvas-websocket/index.js',
    dest: 'lib/node/canvas-websocket.js',
    moduleName: 'CanvasWebsocketNodePlinko'
  }),
  getNodeDefaults({
    entry: 'src/node/canvas-websocket/video-streamer.js',
    dest: 'lib/node/canvas-video-streamer.js',
    moduleName: 'ChildProcessVideoStreamer'
  })
];

console.log(configs);

watch(configs);


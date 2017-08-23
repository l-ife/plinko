const { watch, getBrowserDefaults, getNodeDefaults } = require('../../core/build');

watch([
  getBrowserDefaults({
    entry: 'src/browser/canvas-websocket/index.js',
    dest: 'lib/browser/canvas-websocket.js',
    moduleName: 'CanvasWebsocketBrowserPlinko'
  }, { livereloadWatchPaths: ['src/browser/canvas-websocket'], port: 35733 }),
  getNodeDefaults({
    entry: 'src/node/canvas-websocket/video-streamer.js',
    dest: 'lib/node/canvas-video-streamer.js',
    moduleName: 'ChildProcessVideoStreamer'
  }),
  getNodeDefaults({
    entry: 'src/node/division-tests/canvas.js',
    dest: 'lib/node/division-tests/canvas.js',
    moduleName: 'NodeDivisionTests'
  })
]);


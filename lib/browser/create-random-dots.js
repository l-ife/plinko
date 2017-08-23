document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35731/livereload.js?snipver=1"></' + 'script>');
(function () {
'use strict';

//https://stackoverflow.com/questions/2405772/is-there-a-way-to-dynamically-extend-the-html5-canvas-without-clearing-whats-dr
var margin = { top: 20, right: 20, bottom: 40, left: 100 };
var height = 700 - margin.top - margin.bottom;
var width = 1000 - margin.left - margin.right;

function showTimeSince(startTime) {
  var currentTime = new Date().getTime();
  var runtime = currentTime - startTime;
  document.getElementById('timeRendering').innerHTML = runtime + 'ms';
}

function paintCanvas(canvas, data, x, y) {
  var startTime = new Date().getTime();

  var context = canvas.getContext("2d");

  setInterval(function () {
    context.fillStyle = window.d3.hsl(Math.random() * 360, 1, 0.5, 0.01);
    context.fillRect(Math.random() * width, Math.random() * height, 0.5, 0.5);
    showTimeSince(startTime);
  }, 1);
}

var graphDiv = window.d3.selectAll('div').data([0]);
graphDiv.enter().append('div').style('position', 'relative');

var canvas = graphDiv.selectAll('canvas').data([0]);
canvas.enter().append('canvas').attr('height', height).attr('width', width).style('position', 'absolute').style('top', margin.top + 'px').style('left', margin.left + 'px');

paintCanvas(canvas.node());

}());
//# sourceMappingURL=create-random-dots.js.map

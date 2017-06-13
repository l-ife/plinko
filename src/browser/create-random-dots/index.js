//https://stackoverflow.com/questions/2405772/is-there-a-way-to-dynamically-extend-the-html5-canvas-without-clearing-whats-dr
const margin = { top: 20, right: 20, bottom: 40, left: 100 };
const height = 700 - margin.top - margin.bottom;
const width = 1000 - margin.left - margin.right;

function showTimeSince(startTime) {
    const currentTime = new Date().getTime();
    const runtime = currentTime - startTime;
    document.getElementById('timeRendering').innerHTML = runtime + 'ms';
}

function paintCanvas(canvas, data, x, y) {
    let startTime = new Date().getTime();

    const context = canvas.getContext("2d");

    setInterval(function() {
      context.fillStyle = window.d3.hsl((Math.random())*360, 1, 0.5, 0.01);
      context.fillRect(Math.random()*width, Math.random()*height, 0.5, 0.5);
      showTimeSince(startTime);
    }, 1);
}

const graphDiv = window.d3.selectAll('div').data([0]);
graphDiv.enter().append('div')
  .style('position', 'relative');

const canvas = graphDiv.selectAll('canvas').data([0]);
canvas.enter().append('canvas')
  .attr('height', height)
  .attr('width', width)
  .style('position', 'absolute')
  .style('top', margin.top + 'px')
  .style('left', margin.left + 'px');

paintCanvas(canvas.node());

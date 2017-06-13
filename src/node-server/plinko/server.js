const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const Canvas = require('canvas');
let longLivedCanvas = new Canvas(500, 500);

const getAnImage = () => {
    let ctx = longLivedCanvas.getContext('2d');
    var gradient = ctx.createLinearGradient(Math.random()*20, Math.random()*20, 500-Math.random()*20, 500-Math.random()*20);
    ctx.save();
    const translate = 500/2;
    ctx.translate(translate, translate);
    const randomRotation = Math.random();
    ctx.rotate(randomRotation);
    ctx.translate(-translate, -translate);
    for (var i = Math.random()*50; i >= 0; i--) {
        gradient.addColorStop(Math.random(), `rgba(${parseInt(Math.random()*255)},${parseInt(Math.random()*255)},${parseInt(Math.random()*255)},${Math.random()})`);
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(Math.random()*20, Math.random()*20, 500-Math.random()*20, 500-Math.random()*20);
    ctx.restore();

    for (var i = Math.random(12); i >= 0; i--) {
        ctx.font = `${Math.random()*80}px Impact`;
        const randomRotation2 = Math.random();
        ctx.rotate(randomRotation2);
        ctx.fillText("Awesome!", (Math.random()*500), (Math.random()*500));
        ctx.rotate(-randomRotation2);
    }

    return longLivedCanvas.toDataURL();
}

wss.on('connection', ws => {
  ws.on('message', message => {
    ws.send(getAnImage());
  });
  ws.on('error', error => {
    console.log('error', error);
  });
});

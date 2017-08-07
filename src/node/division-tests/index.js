const { spawn } = require('child_process');
const { createWriteStream } = require('fs');
const stream = require('stream');
const { join: pathJoin } = require('path');
const WebSocket = require('ws');
const Canvas = require('canvas');
import { Bodies, Body, Composite, Engine, Events, World } from '../../matter-js-exports-shim';

import simulation from '../../division-tests/simulation';
const { setup, stepLogic, utils: { getTime }, consts: { plinkoWidth, plinkoHeight } } = simulation;

import { uuid } from '../../utils';
import { getNextSafePath } from '../node-utils';

const [ node, file, seed, writeDirPath = './data' ] = process.argv;

let port = 8080;

let sessionId = seed || uuid({ length: 16 });

const { path: mkvPath, justName } = getNextSafePath({
    dirPath: writeDirPath,
    fileName: sessionId,
    extension: 'mkv'
});

const filesName = justName;

const startWSServer = () => {
    let wss = new WebSocket.Server({ port });
    wss.on('error', (e) => {
        if(e.code == 'EADDRINUSE') {
            port++;
            startWSServer();
        }
    });
    wss.on('connection', ws => {
      ws.on('message', message => {
        frameRequestCallback = (frame) => {
            if(ws.readyState === WebSocket.OPEN) {
                ws.send(frame);
            } else {
                console.error('websocket was closed');
            }
        };
      });
      ws.on('error', error => console.error('error', error));
    });
}
startWSServer();


const ellipse = (ctx, x, y, w) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, w/2, 0, 2 * Math.PI);
    ctx.restore();
};

const quad = (ctx, [[x1,y1],[x2,y2],[x3,y3],[x4,y4]]) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
};

const background = (ctx, color) => {
    ctx.save();
    ctx.fillStyle = color || 'white';
    ctx.fillRect(0, 0, longLivedCanvas.width, longLivedCanvas.height);
    ctx.restore();
};

const margins = {
    x: plinkoWidth*1.5,
    top: 200,
    bottom: 0
};

const beforeKillBall = (ball) => {};

let { engine, beginTime } = setup({ sessionId, beforeKillBall });

const stepLogicHandlers = {
    beforeKillBall
};

const setupCanvasAndDrawHandlers = () => {
    let longLivedCanvas = new Canvas(plinkoWidth + (2*margins.x), (margins.top + plinkoHeight + margins.bottom));
    let ctx = longLivedCanvas.getContext('2d');

    return {
        longLivedCanvas,
        frameReset() {
            background(ctx);
        },
        drawBall({ ball }) {
            const { debug, render: { fillStyle }, position: { x, y }, circleRadius, data: { hue, brightness } } = ball;
            ctx.fillStyle = `hsl(${hue},100%,${(brightness*100)}%)`;
            ellipse(ctx, margins.x+x, margins.top+y, circleRadius * 2);
            ctx.fill();
        },
        drawWall({ wall }) {
            let xysArray = wall.vertices
                .map(({ x, y }) => [margins.x+x, margins.top+y]);
            ctx.fillStyle = `rgb(0,0,0)`;
            quad(ctx, xysArray);
            ctx.fill();
        }
    };
};

let frameRequestCallback;
let { longLivedCanvas, drawBall, drawWall, frameReset } = setupCanvasAndDrawHandlers();

const stepLogicHandlersWithDrawingHandlers = Object.assign({}, stepLogicHandlers, {
    drawBall,
    drawWall
});

let child = spawn('node', ['./lib/node/canvas-video-streamer.js'], { env: Object.assign(process.env, { filesName })});
child.on('error', err => console.error(err));

child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);

// Initiate the source
let bufferStream = new stream.PassThrough({
    highWaterMark: 2000 * 1024
});
bufferStream.pipe(child.stdin);

const ticksPerFrame = 50;
let tickStep = 0;

const runStartTime = (new Date()).getTime();
let theInterval = setInterval(() => {
    Events.trigger(engine, 'tick', { timestamp: engine.timing.timestamp });
    Engine.update(engine, engine.timing.delta);
    Events.trigger(engine, 'afterTick', { timestamp: engine.timing.timestamp });
    tickStep++;
    if (frameRequestCallback || (tickStep === ticksPerFrame)) {
        frameReset();
        stepLogic(Object.assign({}, stepLogicHandlersWithDrawingHandlers, {
            afterCycle() {
                if (frameRequestCallback) {
                    const dataUrl = longLivedCanvas.toDataURL();

                    frameRequestCallback(dataUrl);
                    frameRequestCallback = null;
                }
                if (tickStep === ticksPerFrame) {
                    longLivedCanvas.toBuffer(function(err, buff) {
                        if (!err) return bufferStream.write(buff);
                        console.error(err);
                    });
                    tickStep = 0;
                }
            }
        }));
    } else {
        stepLogic(stepLogicHandlers);
    }
}, 0);

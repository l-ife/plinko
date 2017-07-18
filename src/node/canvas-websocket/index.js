const { join: pathJoin } = require('path');
const WebSocket = require('ws');
const Canvas = require('canvas');
import Matter from 'matter-js/build/matter';
const { Bodies, Body, Engine, Events, Render, World } = Matter;

import plinko from '../../plinko';
const { setup, stepLogic, utils: { getTime, getAverageMinMax }, consts: { plinkoWidth, plinkoHeight } } = plinko;

const margins = 200;

import { uuid } from '../../utils';
import { getNextSafePath } from '../node-utils';

import {
    theBookOfPlinkoersHeaders, ballToEntry
} from '../../logging-utils';

import { setupCsvWriter } from '../logging-utils';

const [ node, file, seed, writeDirPath = './data' ] = process.argv;

let port = 8080;

let sessionId = seed || uuid({ length: 16 });

const { path: theBookFilePath, justName } = getNextSafePath({
    dirPath: writeDirPath,
    fileName: sessionId,
    extension: 'csv'
});

const filesName = justName;

// console.log(`Writing to ${theBookFilePath}`);
let { write: writeToTheBook } = setupCsvWriter(theBookFilePath);
writeToTheBook(theBookOfPlinkoersHeaders);

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

const background = (ctx, color) => {
    ctx.save();
    ctx.fillStyle = color || 'white';
    ctx.fillRect(0, 0, longLivedCanvas.width, longLivedCanvas.height);
    ctx.restore();
};

const beforeKillBall = (ball) => {
    const now = getTime(engine);
    writeToTheBook(ballToEntry(ball, now, beginTime));
};

let { engine, beginTime } = setup({ sessionId, beforeKillBall });

const stepLogicHandlers = {
    beforeKillBall
};

const setupCanvasAndDrawHandlers = () => {
    let longLivedCanvas = new Canvas(plinkoWidth + (2*margins), plinkoHeight + (2*margins));
    let ctx = longLivedCanvas.getContext('2d');

    return {
        longLivedCanvas,
        frameReset() {
            background(ctx);
        },
        drawBall({ ball }) {
            const { render: { fillStyle }, position: { x, y }, circleRadius } = ball;

            const ballAge = (getTime(engine) - ball.birthdate);
            const { average } = getAverageMinMax();
            const dullness = ((ballAge > average) ? 0.4 : 1) * 255;
            ctx.fillStyle = `hsl(${fillStyle[0]},100%,50%)`;
            ellipse(ctx, margins+x, margins+y, circleRadius * 2);
            ctx.fill();
        },
        drawPeg({ peg }) {
            const { position: { x, y }, circleRadius } = peg;
            ctx.fillStyle = 'rgb(240,240,240)';
            ellipse(ctx, margins+x, margins+y, circleRadius * 2);
            ctx.fill();
        }
    };
};

let frameRequestCallback;
let { longLivedCanvas, drawBall, drawPeg, frameReset } = setupCanvasAndDrawHandlers();

const stepLogicHandlersWithDrawingHandlers = Object.assign({}, stepLogicHandlers, {
    drawBall,
    drawPeg
});

const { spawn } = require('child_process');

let child = spawn('node', ['./lib/node/canvas-video-streamer.js'], { env: Object.assign(process.env, { filesName })});
child.on('error', err => console.error(err));
child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);

let ffplay = spawn('ffplay', ['-window_title', filesName, '-'], { stdio: ['pipe', 'ignore', 'ignore'] });
ffplay.on('error', err => console.error(err));

const stream = require('stream');

// Initiate the source
let bufferStream = new stream.PassThrough();
bufferStream.pipe(child.stdin);
bufferStream.pipe(ffplay.stdin);

const ticksPerFrame = 50;
let tickStep = 0;

setInterval(() => {
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

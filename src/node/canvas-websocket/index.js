const { join: pathJoin } = require('path');
const WebSocket = require('ws');
const Canvas = require('canvas');
import Matter from 'matter-js/build/matter';
const { Bodies, Body, Engine, Events, Render, World } = Matter;

import plinko from '../../plinko';
const { setup, stepLogic, utils: { getTime, getAverageMinMax }, consts: { plinkoWidth, plinkoHeight } } = plinko;

import { uuid } from '../../utils';

import {
    theBookOfPlinkoersHeaders, ballToEntry
} from '../../logging-utils';

import { setupCsvWriter } from '../logging-utils';

const [ node, file, writeDirPath = './data/' ] = process.argv;

let port = 8080;

const sessionId = uuid(16);

const theBookFilePath = pathJoin(writeDirPath, `${sessionId}-BoP.csv`);
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
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, longLivedCanvas.width, longLivedCanvas.height);
    ctx.restore();
};

const beforeKillBall = (ball) => {
    const now = getTime(engine);
    writeToTheBook(ballToEntry(ball, now, beginTime));
};

let { engine, beginTime } = setup({ beforeKillBall });

const stepLogicHandlers = {
    beforeKillBall
};

const setupCanvasAndDrawHandlers = () => {
    let longLivedCanvas = new Canvas(plinkoWidth, plinkoHeight);
    let ctx = longLivedCanvas.getContext('2d');

    return {
        longLivedCanvas,
        frameReset() {
            background(ctx, 255);
        },
        drawBall({ ball }) {
            const { render: { fillStyle }, position: { x, y }, circleRadius } = ball;

            const ballAge = (getTime(engine) - ball.birthdate);
            const { average } = getAverageMinMax();
            const dullness = ((ballAge > average) ? 0.4 : 1) * 255;
            ctx.fillStyle = `hsl(${fillStyle[0]},100%,50%)`;
            ellipse(ctx, x, y, circleRadius * 2);
            ctx.fill();
        },
        drawPeg({ peg }) {
            const { position: { x, y }, circleRadius } = peg;
            ctx.fillStyle = 'rgb(240,240,240)';
            ellipse(ctx, x, y, circleRadius * 2);
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

var stream = require('stream');

// Initiate the source
var bufferStream = new stream.PassThrough();
bufferStream.pipe(process.stdout);

const ticksPerFrame = 100;
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

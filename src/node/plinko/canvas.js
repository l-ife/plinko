const { spawn } = require('child_process');
const { createWriteStream } = require('fs');
const stream = require('stream');
const { join: pathJoin } = require('path');
const WebSocket = require('ws');
const Canvas = require('canvas');
import { Bodies, Body, Composite, Engine, Events, World } from '../../core/utils/matter-js-exports-shim';

import plinko from '../../core/plinko/simulation';
const { setup, stepLogic, utils: { getTime, getAverageMinMax }, consts: { plinkoWidth, plinkoHeight } } = plinko;

const margins = {
    x: plinkoWidth*1.5,
    top: 200,
    bottom: 0
};

import { uuid } from '../../core/utils';
import { getNextSafePath } from '../../node/utils';

import { getGenomeColumnHeaders, getGenomeColumns } from '../../core/plinko/genome';
import { getDataColumnHeaders, getDataColumns, calculateDataFields } from '../../core/plinko/data';

import { BookOfTheDead } from '../../core/utils/logging';
import { setupCsvWriter } from '../../node/utils/logging';

const [ node, file, seed, writeDirPath = './data' ] = process.argv;

let port = 8080;

const bookOfTheDead = BookOfTheDead({
    getGenomeColumnHeaders,
    getGenomeColumns,

    getDataColumnHeaders,
    getDataColumns,
    calculateDataFields
});

let sessionId = seed || uuid({ length: 16 });

const { path: theBookFilePath, justName } = getNextSafePath({
    dirPath: writeDirPath,
    fileName: sessionId,
    extension: 'csv'
});

const filesName = justName;

// console.log(`Writing to ${theBookFilePath}`);
let { write: writeToTheBook } = setupCsvWriter(theBookFilePath);
writeToTheBook(bookOfTheDead.theBookOfTheDeadHeaders);

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

const beforeKillBall = (ball) => {
    const now = getTime(engine);
    writeToTheBook(bookOfTheDead.ballToEntry(ball, now, beginTime));
};

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
            const { render: { fillStyle }, position: { x, y }, circleRadius } = ball;

            const ballAge = (getTime(engine) - ball.data.birthdate);
            const { average } = getAverageMinMax();
            const dullness = ((ballAge > average) ? 0.4 : 1) * 255;
            ctx.fillStyle = `hsl(${fillStyle[0]},100%,50%)`;
            ellipse(ctx, margins.x+x, margins.top+y, circleRadius * 2);
            ctx.fill();
        },
        drawPeg({ peg }) {
            const { position: { x, y }, circleRadius } = peg;
            ctx.fillStyle = 'rgb(150,150,150)';
            ellipse(ctx, margins.x+x, margins.top+y, circleRadius * 2);
            ctx.fill();
        },
        drawWall({ wall }) {
            let xysArray = wall.vertices
                .map(({ x, y }) => [margins.x+x, margins.top+y]);
            ctx.fillStyle = `rgb(0,0,0)`;
            quad(ctx, xysArray);
            ctx.fill();
        },
        drawCorpse({ corpse }) {
            const { render: { fillStyle }, position: { x, y }, circleRadius } = corpse;
            ctx.fillStyle = `rgb(${230},${230},${230})`;
            ellipse(ctx, margins.x+x, margins.top+y, circleRadius * 2);
            ctx.fill();
        }
    };
};

let frameRequestCallback;
let { longLivedCanvas, drawBall, drawPeg, drawWall, drawCorpse, frameReset } = setupCanvasAndDrawHandlers();

const stepLogicHandlersWithDrawingHandlers = Object.assign({}, stepLogicHandlers, {
    drawBall,
    drawPeg,
    drawWall,
    drawCorpse
});

let child = spawn('node', ['./lib/node/canvas-video-streamer.js'], { env: Object.assign(process.env, { filesName })});
child.on('error', err => console.error(err));

child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);

// Initiate the source
let bufferStream = new stream.PassThrough();
bufferStream.pipe(child.stdin);

// let ffplay = spawn('ffplay', ['-window_title', filesName, '-'], { stdio: ['pipe', 'ignore', 'ignore'] });
// ffplay.on('error', err => console.error(err));
// bufferStream.pipe(ffplay.stdin);

let memoryMonitorWriteBuffer = createWriteStream(`./data/${filesName}-memory.csv`);

const ticksPerFrame = 50*5;
let tickStep = 0;

const FREQUENCY = 1000;
let count = FREQUENCY;
// let hd;
// let metacount = 1;
// let snapshot1, snapshot2;
const runStartTime = (new Date()).getTime();
memoryMonitorWriteBuffer.write(`(new Date()).getTime(),engine.timing.timestamp,heapSize,heapUsed,allBodies.length,staticBodies.length,engine.pairs.list.length\n`);
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
    if (count === 0) {
        const { heapTotal: heapSize, heapUsed: heapUsed } = process.memoryUsage();
        const allBodies = Composite.allBodies(engine.world);
        const staticBodies = allBodies.filter(({ isStatic }) => isStatic);

        memoryMonitorWriteBuffer.write(`${(new Date()).getTime()-runStartTime},${engine.timing.timestamp},${heapSize},${heapUsed},${allBodies.length},${staticBodies.length},${engine.pairs.list.length}\n`);

        count = FREQUENCY;
    } else if (count > 0) {
        count--;
    }
}, 0);

const { join: pathJoin } = require('path');
const WebSocket = require('ws');
const Canvas = require('canvas');
import Matter from 'matter-js/build/matter';
const { Bodies, Body, Engine, Events, Render, World } = Matter;

import plinko from '../../plinko';
const { setup, stepLogic, utils: { getTime } } = plinko;

import { uuid } from '../../utils';

import {
    theBookOfPlinkoersHeaders, ballToEntry
} from '../../logging-utils';

import { setupCsvWriter } from '../logging-utils';

const [ node, file, writeDirPath = './data/' ] = process.argv;

const port = 8080;

const sessionId = uuid(16);

const theBookFilePath = pathJoin(writeDirPath, `${sessionId}-BoP.csv`);
console.log(`Writing to ${theBookFilePath}`);
let { write: writeToTheBook } = setupCsvWriter(theBookFilePath);
writeToTheBook(theBookOfPlinkoersHeaders);

const wss = new WebSocket.Server({ port });

console.log(`WebSocket Server listening on port ${port}`);

const beforeKillBall = (ball) => {
    const now = getTime(engine);
    writeToTheBook(ballToEntry(ball, now, beginTime));
};

let { engine, beginTime } = setup({ beforeKillBall });

const stepLogicHandlers = {
    beforeKillBall
};

/**
 * @method ellipse
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} [h]
 * @return {p5}
 */
ellipse = (canvas, x, y, w, h) {
  (h === undefined) && h = w;

  // p5 supports negative width and heights for rects
  (w < 0) && w = Math.abs(w);
  (h < 0) && h = Math.abs(h);
  if (!this._renderer._doStroke && !this._renderer._doFill) {
    return this;
  }
  var vals = canvas.modeAdjust(
    args[0],
    args[1],
    args[2],
    args[3],
    this._renderer._ellipseMode);
  args[0] = vals.x;
  args[1] = vals.y;
  args[2] = vals.w;
  args[3] = vals.h;
  this._renderer.ellipse(args);
  return this;
};

const setupCanvasAndDrawHandlers = () => {
    let longLivedCanvas = new Canvas(500, 500);
    let longLivedCanvasContext = longLivedCanvas.getContext('2d');

    return {
        longLivedCanvas,
        drawBall({ ball }) {
            const { render: { fillStyle }, position: { x, y }, circleRadius } = ball;

            const ballAge = (getTime(engine) - ball.birthdate);
            const { average } = getAverageMinMax();
            const dullness = ((ballAge > average) ? 0.4 : 1) * 255;
            //
            fill([ fillStyle[0], dullness, dullness ]);
            ellipse(x, y, circleRadius * 2);
            //
        },
        drawPeg({ peg }) {
            const { position: { x, y }, circleRadius } = peg;
            //
            fill(240);
            ellipse(x, y, circleRadius * 2);
            //
        }
    };
};

const setupFrame = () => {

};

let frameRequestCallback;
let { longLivedCanvas, drawBall, drawPeg } = setupCanvasAndDrawHandlers();

const stepLogicHandlersWithDrawingHandlers = Object.assign({}, stepLogicHandlers, {
    drawBall,
    drawPeg
});

// const getAnImage = () => {
//     let ctx = longLivedCanvasContext;
//     var gradient = ctx.createLinearGradient(Math.random()*20, Math.random()*20, 500-Math.random()*20, 500-Math.random()*20);
//     ctx.save();
//     const translate = 500/2;
//     ctx.translate(translate, translate);
//     const randomRotation = Math.random();
//     ctx.rotate(randomRotation);
//     ctx.translate(-translate, -translate);
//     for (var i = Math.random()*50; i >= 0; i--) {
//         gradient.addColorStop(Math.random(), `rgba(${parseInt(Math.random()*255)},${parseInt(Math.random()*255)},${parseInt(Math.random()*255)},${Math.random()})`);
//     }
//     ctx.fillStyle = gradient;
//     ctx.fillRect(Math.random()*20, Math.random()*20, 500-Math.random()*20, 500-Math.random()*20);
//     ctx.restore();

//     for (var i = Math.random(12); i >= 0; i--) {
//         ctx.font = `${Math.random()*80}px Impact`;
//         const randomRotation2 = Math.random();
//         ctx.rotate(randomRotation2);
//         ctx.fillText("Awesome!", (Math.random()*500), (Math.random()*500));
//         ctx.rotate(-randomRotation2);
//     }
// }


setInterval(() => {
    Events.trigger(engine, 'tick', { timestamp: engine.timing.timestamp });
    Engine.update(engine, engine.timing.delta);
    Events.trigger(engine, 'afterTick', { timestamp: engine.timing.timestamp });
    if (frameRequestCallback) {
        stepLogic(Object.assign({}, stepLogicHandlersWithDrawingHandlers, {
            afterCycle: () => {
                const dataUrl = longLivedCanvas.toDataURL();
                frameRequestCallback(dataUrl);
            }
        }));
    } else {
        stepLogic(stepLogicHandlers);
    }
}, 0);

wss.on('connection', ws => {
  ws.on('message', message => {
    frameRequested = (frame) => {
        ws.send(frame);
    };
  });
  ws.on('error', error => {
    console.log('error', error);
  });
});

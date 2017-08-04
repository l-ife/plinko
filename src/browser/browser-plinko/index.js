import { uuid } from '../../utils';
import { getUrlArguments } from '../browser-utils';
import { BookOfPlinkoers } from '../../logging-utils';
import { saveToDisk, startPeriodicCsvBackup } from '../logging-utils';

import { Bodies, Body, Engine, Events, World } from '../../matter-js-exports-shim';

import plinko from '../../plinko';
const { setup, stepLogic, utils: { getTime, ballAgeSurvivalFactor, getAverageMinMax }, consts: { plinkoWidth, plinkoHeight, oldAge } } = plinko;

let engine;
let beginTime;

const { seed } = getUrlArguments();

const sessionId = seed || uuid({ length: 16 });
console.log(sessionId);

let bookOfPlinkoers = BookOfPlinkoers();

startPeriodicCsvBackup(`${sessionId}-BoP`,
    () => bookOfPlinkoers.getTheBook(engine, getTime(engine), beginTime)
);

window.doASave = () => {
    saveToDisk(bookOfPlinkoers.getTheBook(engine, getTime(engine), beginTime), { filename: `${sessionId}-BoP` });
};

console.log('loaded');

const stepLogicHandlers = {
    beforeKillBall(ball) {
        bookOfPlinkoers.addDead(ball, getTime(engine), beginTime);
    },
    drawBall({ ball }) {
        const { debug, render: { fillStyle }, position: { x, y }, circleRadius } = ball;

        // const ballAge = (getTime(engine) - ball.data.birthdate);
        // const { average } = getAverageMinMax();
        // const dullness = ((ballAge > average) ? 0.4 : 1) * 255;
        // fill([ fillStyle[0], dullness, dullness ]);
        fill([ debug?0:fillStyle[0], 255, 255 ]);
        ellipse(x, y, circleRadius * 2);
    },
    drawPeg({ peg }) {
        const { debug, position: { x, y }, circleRadius } = peg;
        fill(debug?0:150);
        ellipse(x, y, circleRadius * 2);
    },
    drawWall({ wall }) {
        const { debug, position: { x, y }, vertices } = wall;
        let xysArray = vertices
            .map(({ x, y }) => [x, y])
            .reduce((acc, arr) => acc.concat(arr), []);
        fill(debug?150:0);
        quad(...xysArray);
    },
    drawCorpse({ corpse }) {
        const { debug, render: { fillStyle }, position: { x, y }, circleRadius } = corpse;
        fill(debug?0:230);
        ellipse(x, y, circleRadius * 2);
    }
};

window.setup = () => {
    ({ engine, beginTime } = setup({ sessionId, beforeKillBall: stepLogicHandlers.beforeKillBall }));
    Engine.run(engine);

    colorMode(HSB, 255);
    createCanvas(window.windowWidth, window.windowHeight);
};

let count = 0;
window.draw = () => {
    background(255);
    strokeWeight(0);

    translate((width / 2) - (plinkoWidth / 2), 100);

    stepLogic(stepLogicHandlers);
    if(count>1000){
        console.log(engine.pairs.list.length);
        count = 0;
    } else {
        count++;
    }
};

window.windowResized = () => {
    window.resizeCanvas(window.windowWidth, window.windowHeight);
};

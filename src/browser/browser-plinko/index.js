import { uuid } from '../../utils';
import { getUrlArguments } from '../browser-utils';
import { BookOfPlinkoers } from '../../logging-utils';
import { saveToDisk, startPeriodicCsvBackup } from '../logging-utils';

import Matter from 'matter-js/build/matter';
const { Bodies, Body, Engine, Events, Render, World } = Matter;

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
        const { render: { fillStyle }, position: { x, y }, circleRadius } = ball;

        const ballAge = (getTime(engine) - ball.birthdate);
        const { average } = getAverageMinMax();
        const dullness = ((ballAge > average) ? 0.4 : 1) * 255;
        fill([ fillStyle[0], dullness, dullness ]);
        ellipse(x, y, circleRadius * 2);
    },
    drawPeg({ peg }) {
        const { position: { x, y }, circleRadius } = peg;
        fill(240);
        ellipse(x, y, circleRadius * 2);
    }
};

window.setup = () => {
    ({ engine, beginTime } = setup({ sessionId, beforeKillBall: stepLogicHandlers.beforeKillBall }));
    Engine.run(engine);

    colorMode(HSB, 255);
    createCanvas(window.windowWidth, window.windowHeight);
};

window.draw = () => {
    background(255);
    strokeWeight(0);

    translate((width / 2) - (plinkoWidth / 2), 0);

    stepLogic(stepLogicHandlers);
};

window.windowResized = () => {
    window.resizeCanvas(window.windowWidth, window.windowHeight);
};

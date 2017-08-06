import { uuid } from '../../utils';
import { getUrlArguments } from '../browser-utils';

import { Bodies, Body, Engine, Events, World } from '../../matter-js-exports-shim';

import simulation from './simulation';
const { setup, stepLogic, utils: { getTime }, consts: { plinkoWidth, plinkoHeight } } = simulation;

let engine;
let beginTime;

const { seed } = getUrlArguments();

const sessionId = seed || uuid({ length: 16 });
console.log(sessionId);

const stepLogicHandlers = {
    beforeKillBall(ball) {},
    drawBall({ ball }) {
        const { debug, render: { fillStyle }, position: { x, y }, circleRadius, data: { hue, brightness } } = ball;
        fill([ hue, 255, brightness ]);
        ellipse(x, y, circleRadius * 2);
    },
    drawWall({ wall }) {
        const { debug, position: { x, y }, vertices } = wall;
        let xysArray = vertices
            .map(({ x, y }) => [x, y])
            .reduce((acc, arr) => acc.concat(arr), []);
        fill(debug?150:0);
        quad(...xysArray);
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

    translate((width / 2) - (plinkoWidth / 2), 100);

    stepLogic(stepLogicHandlers);
};

window.windowResized = () => {
    window.resizeCanvas(window.windowWidth, window.windowHeight);
};

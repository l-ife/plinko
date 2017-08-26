import { uuid } from '../../core/utils';
import { getUrlArguments } from '../../browser/utils';

import { Bodies, Body, Engine, Events, World } from '../../core/utils/matter-js-exports-shim';

import simulation from '../../core/division-tests/simulation';
const { setup, stepLogic, utils: { getTime }, consts: { stageWidth } } = simulation;

let engine;
let beginTime;

const { seed } = getUrlArguments();

const sessionId = seed || uuid({ length: 16 });
console.log(sessionId);

const stepLogicHandlers = {
    beforeKillBall(ball) {},
    drawBall({ ball }) {
        const {
            render: { fillStyle },
            position: { x, y },
            circleRadius,
            genome: { hue, brightness },
            anchorConstraints = [],
            debug
        } = ball;
        anchorConstraints.forEach(anchorConstraint => {
            const { pointA: { x: pAx, y: pAy } } = anchorConstraint;
            fill([ hue, 255, brightness*255 ]);
            ellipse(pAx, pAy, 10);
        });
        fill([ hue, 255, brightness*255 ]);
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

window.draw = () => {
    background(255);
    strokeWeight(0);

    translate((width / 2) - (stageWidth / 2), 100);

    stepLogic(stepLogicHandlers);
};

window.windowResized = () => {
    window.resizeCanvas(window.windowWidth, window.windowHeight);
};

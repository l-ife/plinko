import Matter from 'matter-js/build/matter';
const { Bodies, Body, Composite, Engine, Events, Render, World } = Matter;

import plinko from '../plinko.js';
const { setup, draw, utils: { getTime }, consts: { plinkoWidth, plinkoHeight, oldAge } } = plinko;

let canvas;
let engine;
let beginTime;

console.log('loaded');

window.setup = () => {
    ({ engine, beginTime } = setup());
    Engine.run(engine);

    colorMode(HSB, 255);
    canvas = createCanvas(plinkoWidth + 600, plinkoHeight);
};

window.draw = () => {
    background(255);
    strokeWeight(0);

    translate(width / 2 - plinkoWidth / 2, 0);

    draw({
        drawBall: ({ p, ball }) => {
            const {
                render: { fillStyle, strokeStyle, lineWidth, visible },
                position: { x, y },
                circleRadius,
                isStatic,
                isSensor,
                label
            } = ball;

            const ballAge = (getTime(engine) - ball.birthdate);
            const darkerIfOld = (ballAge > oldAge) ? 0.4 : 1;

            fill([
                fillStyle[0],
                255 * darkerIfOld,
                255 * darkerIfOld
            ]);

            ellipse(x, y, circleRadius * 2);
        },
        drawPeg: ({ p, peg }) => {
            const {
                render: { fillStyle, strokeStyle, lineWidth, visible },
                position: { x, y },
                circleRadius,
                isStatic,
                isSensor,
                label
            } = peg;

            fill(240);

            ellipse(x, y, circleRadius * 2);
        }
    });
};

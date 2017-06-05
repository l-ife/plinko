import p5 from 'p5';
import Matter from 'matter-js/build/matter';
const { Bodies, Body, Composite, Engine, Events, Render, World } = Matter;

import plinko from '../plinko.js';
const { setup, draw, utils: { getTime }, consts: { plinkoWidth, plinkoHeight, oldAge } } = plinko;
console.log('test');

const theSketch = new p5((p) => {
    let canvas;
    let engine;
    let beginTime;

    p.setup = () => {
        ({ engine, beginTime } = setup(p));
        Engine.run(engine);

        p.colorMode(p.HSB, 255);
        canvas = p.createCanvas(plinkoWidth + 600, plinkoHeight);
    };

    p.draw = () => {
        p.background(255);
        p.strokeWeight(0);

        p.translate(p.width / 2 - plinkoWidth / 2, 0);

        draw({
            p,
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

                p.fill([
                    fillStyle[0],
                    255 * darkerIfOld,
                    255 * darkerIfOld
                ]);

                p.ellipse(x, y, circleRadius * 2);
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

                p.fill(240);

                p.ellipse(x, y, circleRadius * 2);
            }
        });
    };
}, 'body');

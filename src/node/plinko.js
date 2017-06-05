import Matter from 'matter-js/build/matter';
const { Bodies, Body, Composite, Engine, Events, Render, World } = Matter;

import plinko from '../plinko.js';
const { setup, draw, utils: { getTime } } = plinko;

console.log('test');

let { engine, beginTime } = setup();
console.log(`ballRadius,position,hue,mutationRate,restitution,generation,birthdate,age,ancestry`);
while (true) {
    draw({
        beforeKillBall: (ball) => {
            const { ballRadius, position, hue, mutationRate, restitution, generation, ancestry } = ball.genome;
            const ballAge = (getTime(engine) - ball.birthdate);
            console.log([
                ballRadius,
                position,
                hue,
                mutationRate,
                restitution,
                generation,
                ball.birthdate - beginTime,
                ballAge,
                ancestry
            ].join(','));
        }
    });
    Events.trigger(engine, 'tick', { timestamp: engine.timing.timestamp });
    Engine.update(engine, engine.timing.delta);
    Events.trigger(engine, 'afterTick', { timestamp: engine.timing.timestamp });
}

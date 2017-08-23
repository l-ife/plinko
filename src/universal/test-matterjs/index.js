import range from 'lodash/range';
import { Bodies, Engine, Events, Render, World } from '../../core/utils/matter-js-exports-shim';
const { betaLeft } = require('../../core/utils/distributions');

// create an engine
var engine = Engine.create();

const rand = (max) => Math.random()*max;

// create two boxes and a ground
const alphabet =
    range('A'.charCodeAt(0), 'Z'.charCodeAt(0)+1).map(String.fromCharCode);
let bodies = alphabet.map((label) => {
    return Bodies.polygon(
        200+rand(400),
        100+rand(200),
        rand(20),
        150*(1/betaLeft(15)),
        {
            label,
            density: rand(2000)*0.001,
            friction: 1,
            frictionStatic: 10
        }
    );
});
var ground = Bodies.rectangle(400, 610, 810, 60, { label: 'floor',  isStatic: true });

// add all of the bodies to the world
World.add(engine.world, bodies.concat([ground]));

if (typeof window != 'undefined') {
    // create a renderer
    var render = Render.create({
        element: document.body,
        engine: engine
    });
    // run the engine
    Engine.run(engine);

    // run the renderer
    Render.run(render);
} else {
    const logStr = ({ label, position: { x, y }}) => `${label} - ${x.toFixed(5)} ${y.toFixed(5)}`;
    const logAll = () => console.log(
        engine.world.bodies.map(logStr).join(' - ')
    );

    for (var i = 0; i < 100; i++) {
        Events.trigger(engine, 'tick', { timestamp: engine.timing.timestamp });
        Engine.update(engine, engine.timing.delta);
        Events.trigger(engine, 'afterTick', { timestamp: engine.timing.timestamp });
        logAll();
    }
}

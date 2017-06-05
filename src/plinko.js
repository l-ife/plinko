let pegSize = 14;
let ballRadius = 6;

let plinkoWidth = 750;
let plinkoHeight = 1800;
let countX = 10;
let countY = 20;

const oldAge = 75000;

const uuid = (length) => {
    let theReturn = [];
    for (var i = 0; i < length; i++) {
        theReturn.push(String.fromCharCode(parseInt(Math.random() * (127 - 33) + 33)));
    }
    return theReturn.join('');
}

const getTime = (passedInEngine) => (passedInEngine || engine).timing.timestamp;

import Matter from 'matter-js/build/matter';
const { Bodies, Body, Composite, Engine, Events, Render, World } = Matter;

// add plinko sensors
// create genome:
//  {
//      drop: {
//          position: [calcers],
//  calcers = [
//      uniform(start, end),
//      normal(mean, variance),
//      exact(x),
//      roundTo(notch)
//  ]

let engine;
let beginTime;

const setup = ({ p } = {}) => {
    engine = Engine.create();
    beginTime = getTime();

    let offsetX = 0.5 / countX * plinkoWidth;
    let offsetY = 0.5 / countY * plinkoHeight + 50;

    for(let y = 0; y < countY; y++) {
        for(let x = 0; x < countX - y % 2 ? -1 : 0; x++) {
            addCircle({
                x: x / countX * plinkoWidth + offsetX * (!(y % 2) ? 1 : 2),
                y: y / countY * plinkoHeight * (2 / 3) + offsetY,
                r: pegSize,
                options: {
                    isStatic: true,
                    label: 'peg'
                }
            });
        }
    }
    // for(let x = 0; x < countX; x++) {
    //     const aWidth = (1 / countX) * plinkoWidth;
    //     let body = Bodies.rectangle(
    //         (x * aWidth) + (0.5*aWidth),
    //         plinkoHeight * (2 / 3) + offsetY,
    //         pegSize * 4,
    //         pegSize,
    //         {
    //             isStatic: true,
    //             // isSensor: true,
    //             fillStyle: [100,0,0],
    //             label: 'sensor'
    //         }
    //     );
    //     addBody(body);
    // }
    return {
        engine,
        beginTime
    };
}

function addBody(...bodies) {
    World.add(engine.world, ...bodies);
}

function removeBody(...bodies) {
    World.remove(engine.world, ...bodies);
}

function addCircle({ x = 0, y = 0, r = 10, options = {} } = {}) {
    let body = Bodies.circle(x, y, r, options)
    addBody(body);
    return body;
}

function bounds(min, max) {
    return number => Math.min(Math.max(number, min), max);
}

function mutate({ parentValue, bounds, magnitude, rate, defaultVal }) {
    if (parentValue === undefined) {
        return defaultVal;
    }

    const mutation = (
        ((Math.random()*magnitude * 2) - magnitude) * rate
    );

    return bounds(parentValue + mutation);
}

function killBall({ ball, beforeKillBall }) {
    beforeKillBall && beforeKillBall(ball);
    removeBody(ball);
}

function spawnBall(parent = { genome: {} }) {
    const ballAge = (parent.birthdate && (getTime() - parent.birthdate)) || 0;

    const ancestry = parent.genome.ancestry || uuid(4);
    const mutationRate = mutate({
        parentValue: parent.genome.mutationRate,
        bounds: bounds(0, 1),
        magnitude: 0.01,
        rate: 1,
        defaultVal: 1
    });
    // TODO: position max
    // TODO: position min
    // TODO: make these objects an array and loop over and pass in parent.genome
    const thePosition = mutate({
        parentValue: parent.genome.position,
        bounds: bounds(-0.1, 1.1),
        magnitude: 0.1,
        rate: mutationRate,
        defaultVal: Math.random()*(0.9-0.1)+0.1
    });
    const theBallRadius = mutate({
        parentValue: parent.genome.ballRadius,
        bounds: bounds(0.01, 24),
        magnitude: 0.5,
        rate: mutationRate,
        defaultVal: ballRadius
    });
    const theHue = mutate({
        parentValue: parent.genome.hue,
        bounds: bounds(0, 255),
        magnitude: 2,
        rate: mutationRate,
        defaultVal: Math.random()*255
    });
    const theRestitution = mutate({
        parentValue: parent.genome.restitution,
        bounds: bounds(0, 1),
        magnitude: 0.05,
        rate: mutationRate,
        defaultVal: 0.75
    });
    const theGeneration = (parent.genome.generation + 1) || 0;
    addCircle({
        x: plinkoWidth * thePosition,
        y: -10,
        r: theBallRadius,
        options: {
            genome: {
                ballRadius: theBallRadius,
                position: thePosition,
                hue: theHue,
                mutationRate: mutationRate,
                restitution: theRestitution,
                generation: theGeneration
            },
            birthdate: getTime(),
            restitution: theRestitution,
            // torque: random(-0.05, 0.05),
            label: 'ball',
            render: {
                lineWidth: theGeneration/8,
                fillStyle: [
                    theHue,
                    255,
                    255
                ]
            }
        }
    });
}

const draw = ({ p, drawBall, drawPeg, beforeKillBall } = {}) => {
    let bodies = Composite.allBodies(engine.world);

    const now = getTime();
    if(bodies.length < 250 && (now % 1000 < 1)) {
        spawnBall();
    }

    bodies.forEach((n, i) => {
        const {
            render: { fillStyle, strokeStyle, lineWidth, visible },
            position: { x, y },
            circleRadius,
            isStatic,
            isSensor,
            label
        } = n;
        if(!visible) {
            return;
        }
        let ballAge;
        if (label === 'ball') {
            ballAge = (now - n.birthdate);
            function ballAgeSurvivalFactor() {
                const ageFactor = (ballAge/oldAge);
                return ((Math.random()*0.5) + (ageFactor - 1.5));
            }
            if (bodies.length > 1000 && ballAgeSurvivalFactor() > 0.90) {
                killBall({ ball: n, beforeKillBall });
                return;
            }

            if (y > plinkoHeight * 1.3) {
                killBall({ ball: n, beforeKillBall });
                spawnBall(n);
                const fallSplitFactor = ballAgeSurvivalFactor();
                if (fallSplitFactor > 0.99) {
                    spawnBall(n);
                }
            } else if (ballAge > oldAge && Math.random() > 0.99995 && ballAgeSurvivalFactor() > 0.85) {
                spawnBall(n);
            } else {
                drawBall && drawBall({ p, ball: n });
            }
        } else if (label === 'peg') {
            drawPeg && drawPeg({ p, peg: n });
        }
    });
}

export default {
    setup,
    draw,
    utils: {
        mutate,
        getTime,
        uuid
    },
    consts: {
        pegSize,
        ballRadius,
        plinkoWidth,
        plinkoHeight,
        countX,
        countY,
        oldAge
    }
};


/*
 else if (label === 'sensor') {
    p.fill(0);
    p.beginShape();
    n.vertices.forEach(({x, y}) => {
        p.vertex(x, y);
    })
    p.endShape(p.CLOSE);
}
*/


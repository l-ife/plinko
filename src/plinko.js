import { uuid } from './utils';
import TrailingData from './trailing-data';

let pegSize = 14;
let defaultBallRadius = 6;

let plinkoWidth = 750;
let plinkoHeight = 1800;
let countX = 10;
let countY = 20;
let numOfPegs = 0;

const oldAge = 75000;

import Matter from 'matter-js/build/matter';
const { Bodies, Body, Composite, Engine, Events, Render, World } = Matter;

const TYPES_OF_BIRTH_AND_DEATH = {
    BIRTH: {
        NEW: 0,
        LOOPED_AROUND: 1,
        LOOP_AROUND_SPLIT: 2,
        MIDSTREAM_SPAWN: 3,
        REBIRTH_FROM_THE_ANCIENTS: 4
    },
    DEATH: {
        DIEOFF: 5,
        FELL_OFF_BOTTOM: 6,
        EATEN: 7
    }
};

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
let trailingData;
// let theBest;

const getTime = (passedInEngine) => (passedInEngine || engine).timing.timestamp;

const getAverageMinMax = () => {
    return trailingData.getAverageMinMax('age');
};

const ballAgeSurvivalFactor = (ballAge, randomFactorRange = 0.5) => {
    const { average, min, max } = getAverageMinMax();
    const ageStepFactor = Math.min(average, 200);
    const ageFactor = ((ballAge - average)/ageStepFactor);
    const randomFactor = (
        (randomFactorRange/2) +
        (Math.random()*randomFactorRange)
    );
    return (randomFactor + (ageFactor - 1));
};

const stepLogic = ({ beforeKillBall, afterCycle, drawBall, drawPeg }) => {
    let bodies = Composite.allBodies(engine.world);

    const now = getTime();
    const baselineCount = 600;
    const numOfBalls = bodies.length - numOfPegs;
    let ballsNeeded = Math.max(baselineCount - numOfBalls, 0)/1000;
    for (; ballsNeeded > 0; ballsNeeded--) {
        spawnBall(undefined, TYPES_OF_BIRTH_AND_DEATH.BIRTH.REBIRTH_FROM_THE_ANCIENTS);
    }

    bodies.forEach((n, i) => {
        const { render: { visible }, position: { x, y }, label } = n;
        if(!visible) return;
        if (label === 'ball') {
            const ballAge = (now - n.birthdate);
            const getBallAgeSurvivalFactor = (randomFactorRange) => {
                return ballAgeSurvivalFactor(ballAge, randomFactorRange);
            };
            if (bodies.length > 1000 && getBallAgeSurvivalFactor() < 0.50) {
                killBall({ ball: n, beforeKillBall }, TYPES_OF_BIRTH_AND_DEATH.DEATH.DIEOFF);
                return;
            }

            if (y > plinkoHeight * 1.3) {
                killBall({ ball: n, beforeKillBall }, TYPES_OF_BIRTH_AND_DEATH.DEATH.FELL_OFF_BOTTOM);
                if (Math.random() > 0.125 && getBallAgeSurvivalFactor() > 0.50) {
                    spawnBall(n, TYPES_OF_BIRTH_AND_DEATH.BIRTH.LOOPED_AROUND);
                }
            } else if (Math.random() > 0.995 && getBallAgeSurvivalFactor() > 0.55) {
                let i = n.genome.midstreamBirthrate;
                while (i >= 1) {
                    spawnBall(n, TYPES_OF_BIRTH_AND_DEATH.BIRTH.MIDSTREAM_SPAWN);
                    n.genome.midstreamChildren++;
                    i--;
                }
                if (i > Math.random()) {
                    spawnBall(n, TYPES_OF_BIRTH_AND_DEATH.BIRTH.MIDSTREAM_SPAWN);
                    n.genome.midstreamChildren++;
                }
            }
            drawBall && drawBall({ ball: n });
        } else if (label === 'peg') {
            drawPeg && drawPeg({ peg: n });
        }
    });
    afterCycle && afterCycle();
}

const setup = ({ beforeKillBall } = {}) => {
    engine = Engine.create();
    beginTime = getTime();
    trailingData = TrailingData({ age: 3000 });
    // theBest = SortedBuffer(100);

    // Events.on(engine, "collisionStart", ({ pairs, timestamp, source, name }) => {
    //     pairs.forEach(({ bodyA, bodyB }) => {
    //         if (
    //             (bodyA.label === 'ball' && bodyB.label === 'ball') &&
    //             (bodyA.genome.ancestry !== bodyB.genome.ancestry)
    //         ) {
    //             if (bodyA.speed > bodyB.speed && bodyA.genome.ballRadius > 7) {
    //                 killBall({ ball: bodyB, beforeKillBall }, TYPES_OF_BIRTH_AND_DEATH.DEATH.EATEN);
    //                 bodyA.genome.ate++;
    //             } else if (bodyB.speed > bodyA.speed && bodyB.genome.ballRadius > 7) {
    //                 killBall({ ball: bodyA, beforeKillBall }, TYPES_OF_BIRTH_AND_DEATH.DEATH.EATEN);
    //                 bodyB.genome.ate++;
    //             }
    //         }
    //     })
    // });

    let offsetX = 0.5 / countX * plinkoWidth;
    let offsetY = 0.5 / countY * plinkoHeight + 50;

    for(let y = 0; y < countY; y++) {
        for(let x = 0; x < countX - y % 2 ? -1 : 0; x++) {
            numOfPegs++;
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

const SortedBuffer = (bufferLength) => {
    let objects = {};
    let valueBuffer = [];

    function insertSorted(array, item) {
        for (let j = i - 1; array[j] > item; j--) {
            array[j + 1] = array[j];
        }
        array[j + 1] = item;
    }

    return {
        potentiallyInsert(ball, ballAge) {
            if (valueBuffer.length >= bufferLength) {
                const min = valueBuffer[0];
                if (ballAge > min) {
                    delete objects[min];
                    delete valueBuffer[0];
                }
            }
            insertSorted(valueBuffer, ballAge);
            objects[ballAge] = ball;
        },
        getRandomBest() {
            if (valueBuffer.length === 0) return;
            return valueBuffer[parseInt(Math.random()*valueBuffer.length)];
        },
        getTheBest() {
            if (valueBuffer.length === 0) return;
            return valueBuffer[valueBuffer.length - 1];
        }
    };
}

function killBall({ ball, beforeKillBall }, deathType) {
    if (beforeKillBall) {
        const { position: { x, y } } = ball;
        ball.genome.deathPositionX = x/plinkoWidth;
        ball.genome.deathPositionY = y/plinkoHeight;
        ball.genome.deathType = deathType;
        beforeKillBall && beforeKillBall(ball);
    }
    const ballAge = (getTime(engine) - ball.birthdate);
    // theBest.potentiallyInsert(ball, ballAge);
    trailingData.addPoint('age', ballAge);
    removeBody(ball);
}

function spawnBall(parent = { genome: { mutationRates: {} } }, birthType) {
    const ancestry = parent.genome.ancestry || uuid(4);
    const mutationRates = {
        ballRadius: mutate({
            parentValue: parent.genome.mutationRates.ballRadius,
            bounds: bounds(0, 1),
            magnitude: 0.05,
            rate: 1,
            defaultVal: 1
        }),
        position: mutate({
            parentValue: parent.genome.mutationRates.position,
            bounds: bounds(0, 1),
            magnitude: 0.05,
            rate: 1,
            defaultVal: 1
        }),
        restitution: mutate({
            parentValue: parent.genome.mutationRates.restitution,
            bounds: bounds(0, 1),
            magnitude: 0.05,
            rate: 1,
            defaultVal: 1
        }),
        midstreamBirthrate: mutate({
            parentValue: parent.genome.mutationRates.midstreamBirthrate,
            bounds: bounds(0, 1),
            magnitude: 0.05,
            rate: 1,
            defaultVal: 1
        })
    };
    // TODO: position max
    // TODO: position min
    // TODO: make these objects an array and loop over and pass in parent.genome
    const position = mutate({
        parentValue: parent.genome.position,
        bounds: bounds(-0.1, 1.1),
        magnitude: 0.1,
        rate: mutationRates.position,
        defaultVal: Math.random()*(0.9-0.1)+0.1
    });
    const ballRadius = mutate({
        parentValue: parent.genome.ballRadius,
        bounds: bounds(0.01, 55),
        magnitude: 0.5,
        rate: mutationRates.ballRadius,
        defaultVal: defaultBallRadius
    });
    const hue = mutate({
        parentValue: parent.genome.hue,
        bounds: bounds(0, 255),
        magnitude: 5,
        rate: 1,
        defaultVal: Math.random()*255
    });
    const restitution = mutate({
        parentValue: parent.genome.restitution,
        bounds: bounds(0, 1),
        magnitude: 0.05,
        rate: mutationRates.restitution,
        defaultVal: 0.75
    });
    const midstreamBirthrate = mutate({
        parentValue: parent.genome.midstreamBirthrate,
        bounds: bounds(0, 1),
        magnitude: 0.25,
        rate: mutationRates.midstreamBirthrate,
        defaultVal: 1
    });
    const generation = (parent.genome.generation + 1) || 0;
    addCircle({
        x: plinkoWidth * position,
        y: -10,
        r: ballRadius,
        options: {
            genome: {
                ballRadius,
                position,
                hue,
                mutationRates,
                restitution,
                midstreamBirthrate,
                generation,
                ancestry,
                birthType,
                midstreamChildren: 0,
                ate: 0
            },
            birthdate: getTime(),
            restitution,
            // torque: random(-0.05, 0.05),
            label: 'ball',
            render: {
                fillStyle: [
                    hue,
                    255,
                    255
                ]
            }
        }
    });
}

export default {
    setup,
    stepLogic,
    utils: {
        mutate,
        getTime,
        ballAgeSurvivalFactor,
        getAverageMinMax
    },
    consts: {
        pegSize,
        defaultBallRadius,
        plinkoWidth,
        plinkoHeight,
        countX,
        countY,
        oldAge
    }
};


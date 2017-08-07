import { uuid } from '../utils';

import Alea from 'alea';

const MAX_SCALE_FACTOR = 3;

let plinkoWidth = 750;//*1.5;
let plinkoHeight = 1800;
let countX = 20;//*1.5;
let countY = 2;//24;
let numOfPegs = 0;

const areaToRadiusPercentageIncrease = areaPercentageIncrease => 0.2 * Math.sqrt( (25 * areaPercentageIncrease) + 25) - 1;
const areaGivenRadius = radius => Math.PI * Math.pow(radius, 2);
const radiusGivenArea = area   => Math.sqrt(area) / Math.sqrt(Math.PI);

const MINIMUM_BALL_RADIUS = 5;

import { Bodies, Body, Composite, Constraint, Engine, Events, World } from '../matter-js-exports-shim';

import { makeNewBeingGenome, makeChildGenome } from '../genome';

let random;

let engine;
let beginTime;

function valueBetween(min, max, random) {
    return ( min + (random() * (max - min)) );
}

const getTime = (passedInEngine) => (passedInEngine || engine).timing.timestamp;

let numOfBallsLastCycle = 0;
const stepLogic = ({ beforeKillBall, afterCycle, drawBall, drawCorpse, drawPeg, drawWall }) => {
    let bodies = Composite.allBodies(engine.world);

    const now = getTime();
    const baselineCount = 125*MAX_SCALE_FACTOR;
    const maxCount = 125*MAX_SCALE_FACTOR;
    let numOfBalls = 0;

    bodies.forEach((n, i) => {
        numOfBalls++;
        const { render: { visible }, circleRadius, position: { x, y }, genome: { ballRadius, growthRate } = {}, label } = n;
        if(!visible) return;
        if (label === 'ball') {
            if (y > plinkoHeight * 1.3) {
                killBall({ ball: n, beforeKillBall });
                numOfBalls--;
            } else if (numOfBalls < maxCount && n.speed < 7 && n.data.energy > areaGivenRadius(circleRadius) && random() < 0.05) {
                const newBall = spawnBall(n, { xOveride: x, yOveride: y });
                numOfBalls++;
                n.data.energy -= areaGivenRadius(circleRadius);
                World.add(engine.world, Constraint.create({
                    bodyA: n, bodyB: newBall,
                    stiffness: 0.15,
                    length: circleRadius + 2,
                    damping: 0.75
                }));
            } else if (random() < 0.0005) {
                killBall({ ball: n, beforeKillBall });
                numOfBalls--;
            }
            drawBall && drawBall({ ball: n });
        } else if (label === 'wall') {
            drawWall && drawWall({ wall: n });
        }
    });

    let ballsNeeded = Math.max(baselineCount - numOfBalls, 0);
    for (; ballsNeeded > 0; ballsNeeded--) {
        if (random() < 0.005*0.7) {
            spawnBall();
            numOfBalls++;
        }
    }

    numOfBallsLastCycle = numOfBalls;

    afterCycle && afterCycle({ numOfBalls });
}

const setup = ({ sessionId, beforeKillBall } = {}) => {
    random = new Alea(sessionId);
    engine = Engine.create();
    engine.constraintIterations = 3;
    beginTime = getTime();

    Events.on(engine, "collisionStart", ({ pairs, source : { timing: { timestamp: now } }, name }) => {
        pairs.forEach(({ bodyA, bodyB }) => {
            const { label: aLabel } = bodyA;
            const { label: bLabel } = bodyB;
            if (aLabel === 'ball' && bLabel === 'ball') {
                const { circleRadius: aRadius, speed: aSpeed, data: { group: aGroup, energy: aEnergy } } = bodyA;
                const { circleRadius: bRadius, speed: bSpeed, data: { group: bGroup, energy: bEnergy } } = bodyB;
                if (aGroup !== bGroup) {
                    if (aRadius > bRadius) {
                        killBall({ ball: bodyB, beforeKillBall });
                        bodyA.data.energy += bEnergy;
                    } else {
                        killBall({ ball: bodyA, beforeKillBall });
                        bodyB.data.energy += aEnergy;
                    }
                }
            }
        })
    });

    const boxWidth = plinkoWidth*3;
    const boxBottom = plinkoHeight-450;
    const boxHeight = 500;
    const wallThickness = 75;
    const centerX = (plinkoWidth/2);
    const leftX = centerX-(boxWidth/2);
    const rightX = centerX+(boxWidth/2);
    addRectangle({
        x: centerX, y: boxBottom, w: boxWidth, h: wallThickness,
        options: { isStatic: true, label: 'wall' }
    });
    addRectangle({
        x: leftX, y: boxBottom-(boxHeight/2), w: wallThickness, h: boxHeight,
        options: { isStatic: true, label: 'wall' }
    });
    addRectangle({
        x: rightX, y: boxBottom-(boxHeight/2), w: wallThickness, h: boxHeight,
        options: { isStatic: true, label: 'wall' }
    });

    // for (var hue = 0; hue <= 360; hue++) {
    //     addRectangle({
    //         x: leftX+(hue*(boxWidth/360)), y: boxBottom - 300, w: boxWidth/360, h: wallThickness,
    //         options: { isStatic: true, label: 'wall', data: { hue } }
    //     })
    // }

    return {
        engine,
        beginTime
    };
}

function addBody(body) {
    World.add(engine.world, body);
}

function removeBody(body) {
    World.remove(engine.world, body);
}

function addCircle({ x = 0, y = 0, r = 10, options = {} } = {}) {
    let body = Bodies.circle(x, y, r, options);
    addBody(body);
    return body;
}

function addRectangle({ x = 0, y = 0, w = 10, h = 10, options = {} } = {}) {
    let body = Bodies.rectangle(x, y, w, h, options);
    addBody(body);
    return body;
}

function killBall({ ball, beforeKillBall }) {
    if (beforeKillBall) {
        beforeKillBall && beforeKillBall(ball);
    }
    removeBody(ball);
}

function spawnBall(parent = {}, { xOveride, yOveride } = {}) {
    const { circleRadius: parentCircleRadius, data: { hue, group, brightness } = {} } = parent;
    const newBallRadius = parentCircleRadius ? Math.max(parentCircleRadius + valueBetween(-6.5, 1.5, random), MINIMUM_BALL_RADIUS) : MINIMUM_BALL_RADIUS + (random()*60/MAX_SCALE_FACTOR);
    const defaultedNewHue = hue ? (hue + 1.5) : (random() * 360);
    const wrappedNewHue = (defaultedNewHue>360) ? defaultedNewHue - 360 : defaultedNewHue;
    return addCircle({
        x: xOveride || (plinkoWidth * ( (3*random()) - 1 )),
        y: yOveride || -10,
        r: newBallRadius,
        options: {
            label: 'ball',
            restitution: 0,
            data: {
                group: group || parseInt(random()*5000),
                energy: areaGivenRadius(newBallRadius),
                hue: wrappedNewHue,
                brightness: ((brightness !== undefined) ? Math.max(brightness - 0.01, 0.25) : 0.75)
            }
        }
    });
}

export default {
    setup,
    stepLogic,
    utils: {
        getTime
    },
    consts: {
        plinkoWidth,
        plinkoHeight,
        countX,
        countY
    }
};


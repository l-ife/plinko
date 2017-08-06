import { uuid } from '../../utils';

import Alea from 'alea';

let pegSize = 14;
const PEG_EATER_MINIMUM_ENERGY = 1750;
let defaultBallRadius = 6;

let plinkoWidth = 750;//*1.5;
let plinkoHeight = 1800;
let countX = 20;//*1.5;
let countY = 2;//24;
let numOfPegs = 0;

const areaToRadiusPercentageIncrease = areaPercentageIncrease => 0.2 * Math.sqrt( (25 * areaPercentageIncrease) + 25) - 1;
const areaGivenRadius = radius => Math.PI * Math.pow(radius, 2);
const radiusGivenArea = area   => Math.sqrt(area) / Math.sqrt(Math.PI);

const MINIMUM_BALL_RADIUS = 5;
const MINIMUM_BALL_BIRTH_ENERGY = areaGivenRadius(MINIMUM_BALL_RADIUS);

import { Bodies, Body, Composite, Constraint, Engine, Events, World } from '../../matter-js-exports-shim';

import { makeNewBeingGenome, makeChildGenome } from '../../genome';

let random;

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
// let theBest;

const getTime = (passedInEngine) => (passedInEngine || engine).timing.timestamp;

let numOfBallsLastCycle = 0;
const stepLogic = ({ beforeKillBall, afterCycle, drawBall, drawCorpse, drawPeg, drawWall }) => {
    let bodies = Composite.allBodies(engine.world);

    const now = getTime();
    const baselineCount = 125;
    const maxCount = 125;
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
        } else if (label === 'peg') {
            drawPeg && drawPeg({ peg: n });
        } else if (label === 'wall') {
            drawWall && drawWall({ wall: n });
        } else if (label === 'corpse') {
            if (y > plinkoHeight * 1.3) {
                removeBody(n);
                return;
            }
            drawCorpse && drawCorpse({ corpse: n });
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
            } else if (
                (aLabel === 'corpse' && bLabel === 'ball') ||
                (bLabel === 'corpse' && aLabel === 'ball')
            ) {
            } else if (
                (aLabel === 'peg' && bLabel === 'ball') ||
                (bLabel === 'peg' && aLabel === 'ball')
            ) {
            }
        })
    });

    // let offsetX = 0.5 / countX * plinkoWidth;
    // let offsetY = 0.5 / countY * plinkoHeight + 50;

    // for(let y = 0; y < countY; y++) {
    //     for(let x = 0; x < countX - y % 2 ? -1 : 0; x++) {
    //         numOfPegs++;
    //         addCircle({
    //             x: x / countX * plinkoWidth + offsetX * (!(y % 2) ? 1 : 2),
    //             y: y / countY * plinkoHeight * (2 / 3) + offsetY,
    //             r: pegSize,
    //             options: {
    //                 isStatic: true,
    //                 label: 'peg'
    //             }
    //         });
    //     }
    // }

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
    // TODO: Use the dormant bodies too
    let body = Bodies.rectangle(x, y, w, h, options);
    addBody(body);
    return body;
}

function convertToCorpse(ball) {
    const { data: { energy } } = ball;
    // TODO: Write this for perfomrance
    ball.label = 'corpse';
    ball.restitution = 0.95;
    ball.render.fillStyle = undefined;
    ball.genome = undefined;
    ball.data = { energy };
}

function convertToPeg(ball, energyPutIntoPeg = PEG_EATER_MINIMUM_ENERGY) {
    const { circleRadius } = ball;
    ball.label = 'peg';
    ball.render.fillStyle = undefined;
    ball.genome = undefined;
    ball.data = undefined;
    ball.pegEnergy = energyPutIntoPeg;
    const scaleFactor = pegSize/circleRadius;
    Body.scale(ball, scaleFactor, scaleFactor);
    Body.setStatic(ball, true);
}

function killBall({ ball, beforeKillBall }) {
    if (beforeKillBall) {
        beforeKillBall && beforeKillBall(ball);
    }
    removeBody(ball);
}

function spawnBall(parent = {}, { xOveride, yOveride } = {}) {
    const { circleRadius: parentCircleRadius, data: { hue, group, brightness } = {} } = parent;
    const newBallRadius = parentCircleRadius ? Math.max(parentCircleRadius, defaultBallRadius) : defaultBallRadius + (random()*60);
    const defaultedNewHue = hue ? (hue + 5) : (random() * 255);
    const wrappedNewHue = (defaultedNewHue>255) ? defaultedNewHue - 255 : defaultedNewHue;
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
                brightness: (brightness !== undefined) ? Math.max(brightness - 5, 0) : 255
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
        pegSize,
        defaultBallRadius,
        plinkoWidth,
        plinkoHeight,
        countX,
        countY
    }
};


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

import { valueBetween, bounds } from '../utils';

import { makeNewBeingGenome, makeChildGenome } from './genome';
import { getNewBeingData } from './data';

let random;

let engine;
let beginTime;

const getTime = (passedInEngine) => (passedInEngine || engine).timing.timestamp;

let numOfBallsLastCycle = 0;
const stepLogic = ({ beforeKillBall, afterCycle, drawBall, drawCorpse, drawPeg, drawWall }) => {
    let bodies = Composite.allBodies(engine.world);

    const now = getTime();
    const baselineCount = 130*MAX_SCALE_FACTOR;
    const maxCount = 160*MAX_SCALE_FACTOR;
    let numOfBalls = 0;

    const someMagicFactor = 1/20;

    bodies.forEach((n, i) => {
        numOfBalls++;
        const { render: { visible }, label } = n;
        if(!visible) return;
        if (label === 'ball') {
            const { circleRadius, position: { x, y }, genome: { splitRate, percentageToUseForPregnancy, maxBallRadius, minBallRadiusGrowth, maxBallRadiusGrowth } } = n;
            if (y > plinkoHeight * 1.3) {
                killBall({ ball: n, beforeKillBall });
                numOfBalls--;
            } else if (numOfBallsLastCycle < maxCount && n.speed < 7 && random() < someMagicFactor && random() < splitRate) {
                const energyAvailable = n.data.energy * percentageToUseForPregnancy;
                const newBallRadius = bounds(MINIMUM_BALL_RADIUS, maxBallRadius)(
                    circleRadius + valueBetween(minBallRadiusGrowth, maxBallRadiusGrowth, random)
                );
                const energyRequired = areaGivenRadius(newBallRadius);
                if (energyAvailable > energyRequired) {
                    const newBall = spawnBall(n, { xOveride: x, yOveride: y, paidInSize: newBallRadius });
                    numOfBalls++;
                    n.data.changeEnergy(-1 * energyAvailable);
                    if (n.data.energy < 0) {
                        killBall({ ball: n, beforeKillBall });
                        numOfBalls--;
                    } else {
                        World.add(engine.world, Constraint.create({
                            bodyA: n, bodyB: newBall,
                            stiffness: 0.15,
                            length: circleRadius + 2,
                            damping: 0.75
                        }));
                    }
                }
            } else if (random() < (someMagicFactor/100)) {
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
        if (random() < (someMagicFactor*0.07)) {
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
                const { circleRadius: aRadius, speed: aSpeed, genome: { ancestry: aAncestry, carnivorismRate: aCarnivorismRate, cannibalismRate: aCannibalismRate }, data: { energy: aEnergy } } = bodyA;
                const { circleRadius: bRadius, speed: bSpeed, genome: { ancestry: bAncestry, carnivorismRate: bCarnivorismRate, cannibalismRate: bCannibalismRate }, data: { energy: bEnergy } } = bodyB;
                if (aAncestry !== bAncestry) {
                    if (aRadius >= bRadius && random() < aCarnivorismRate) {
                        killBall({ ball: bodyB, beforeKillBall });
                        bodyA.data.changeEnergy(bEnergy);
                    } else if (bRadius >= aRadius && random() < bCarnivorismRate) {
                        killBall({ ball: bodyA, beforeKillBall });
                        bodyB.data.changeEnergy(aEnergy);
                    }
                } else {
                    if (aRadius >= bRadius && random() < aCannibalismRate) {
                        killBall({ ball: bodyB, beforeKillBall });
                        bodyA.data.changeEnergy(bEnergy);
                    } else if (bRadius >= aRadius && random() < bCannibalismRate) {
                        killBall({ ball: bodyA, beforeKillBall });
                        bodyB.data.changeEnergy(aEnergy);
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

function spawnBall(parent, { xOveride, yOveride, paidInSize } = {}) {
    const genome = ( parent ? makeChildGenome(parent, random) : makeNewBeingGenome(random) );
    const { ballRadius, hue, brightness } = genome;
    const newBallRadius = paidInSize || ( MINIMUM_BALL_RADIUS + (random()*60/MAX_SCALE_FACTOR) );
    return addCircle({
        x: xOveride || (plinkoWidth * ( (3*random()) - 1 )),
        y: yOveride || -10,
        r: newBallRadius,
        options: {
            label: 'ball',
            restitution: 0,
            genome,
            data: getNewBeingData({
                parent,
                now: getTime(),
                beginTime,
                initialEnergy: areaGivenRadius(newBallRadius)
            }),
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


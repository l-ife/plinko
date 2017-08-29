import reduce from 'lodash/reduce';

import { uuid } from '../../core/utils';
import { valueBetween, bounds } from '../../core/utils';

import Alea from 'alea';

const MAX_SCALE_FACTOR = 3;

let stageWidth = 750;//*1.5;
let stageHeight = 1800;
let countX = 20;//*1.5;
let countY = 2;//24;
let numOfPegs = 0;

const X_MARGINS = stageWidth * 1.5;
const Y_START = -10;

const outOfBoundsChecker = ({ left, right, top, bottom }) =>
    ({ x, y }) => ( x < left || x > right || y < top || y > bottom );

const outOfBounds = outOfBoundsChecker({
    left: (-1 * X_MARGINS * 1.5),
    right: (stageWidth + (X_MARGINS * 1.5)),
    top: (Y_START * 4),
    bottom: (stageHeight * 1.3)
});

const areaToRadiusPercentageIncrease = areaPercentageIncrease => 0.2 * Math.sqrt( (25 * areaPercentageIncrease) + 25) - 1;
const areaGivenRadius = radius => Math.PI * Math.pow(radius, 2);
const radiusGivenArea = area   => Math.sqrt(area) / Math.sqrt(Math.PI);

const MINIMUM_BALL_RADIUS = 5;

const ANCHORBABYCOST = 10000;

import { Bodies, Body, Composite, Constraint, Engine, Events, World } from '../../core/utils/matter-js-exports-shim';

import { makeNewBeingGenome, makeChildGenome, HUE_STEP } from '../../core/division-tests/genome';
import { getNewBeingData } from '../../core/division-tests/data';

let random;

let engine;
let beginTime;

const getTime = (passedInEngine) => (passedInEngine || engine).timing.timestamp;

let numOfBallsLastCycle = 0;
const stepLogic = ({ beforeKillBall, afterCycle, drawBall, drawCorpse, drawPeg, drawWall }) => {
    let bodies = Composite.allBodies(engine.world);

    const now = getTime();
    const baselineCount = 160*MAX_SCALE_FACTOR;
    const maxCount = 160*MAX_SCALE_FACTOR;
    let numOfBalls = 0;

    const someMagicFactor = 1/20;

    bodies.forEach((n, i) => {
        const { position: { x, y }, render: { visible }, label } = n;
        if(!visible) return;
        if (label === 'ball') {
            numOfBalls++;
            const {
                circleRadius,
                genome: {
                    splitRate,
                    percentageToUseForPregnancy,
                    makeAnchorBabyChance,
                    maxBallRadius,
                    ballRadiusGrowthExtentOne,
                    ballRadiusGrowthExtentTwo,
                    energyDiffusionRate
                },
                data: { birthdate },
                constraints
            } = n;
            if (now - birthdate > 32000 && random() < 40/maxCount) {
                n.data.changeEnergy(-1 * 100);
            }
            const { data: { energy } } = n;
            if (outOfBounds({ x, y })) {
                killBall({ ball: n, beforeKillBall });
                numOfBalls--;
            } else if (energy < 0) {
                killBall({ ball: n, beforeKillBall, becomeCorpse: true });
                numOfBalls--;
            } else if (random() < (someMagicFactor/10000)) {
                killBall({ ball: n, beforeKillBall, becomeCorpse: true });
                numOfBalls--;
            } else {
                if (numOfBallsLastCycle < maxCount && n.speed < 7 && random() < someMagicFactor && random() < splitRate) {
                    const energyAvailable = n.data.energy * percentageToUseForPregnancy;
                    const newBallRadius = bounds(MINIMUM_BALL_RADIUS, maxBallRadius)(
                        circleRadius + valueBetween(ballRadiusGrowthExtentOne, ballRadiusGrowthExtentTwo, random)
                    );
                    const isAnchorBaby = (random() < makeAnchorBabyChance);
                    const energyRequired = areaGivenRadius(newBallRadius) + (isAnchorBaby?ANCHORBABYCOST:0);
                    if (energyAvailable > energyRequired) {
                        const newBall = spawnBall(n, { xOveride: x, yOveride: y, paidInSize: newBallRadius, isAnchorBaby });
                        numOfBalls++;
                        n.data.changeEnergy(-1 * energyRequired);
                    }
                }

                if(constraints.length > 0) {
                    const [
                        lessThanNeighbors,
                        lessThanNeighborsTotal,
                        neighborsTotal
                    ] = constraints.reduce(([lessThanNeighbors, lessThanNeighborsTotal, total], constraint) => {
                        const neighbor = getOtherEndOfConstraint(constraint, n);
                        const { data: { energy: neighborEnergy } } = neighbor;
                        if (neighborEnergy > energy) {
                            return [
                                lessThanNeighbors,
                                lessThanNeighborsTotal,
                                total + neighborEnergy
                            ];
                        }
                        return [
                            lessThanNeighbors.concat([neighbor]),
                            lessThanNeighborsTotal + neighborEnergy,
                            total + neighborEnergy
                        ];
                    }, [[], 0, 0]);
                    const neighborsAverage = (neighborsTotal/constraints.length);
                    if (lessThanNeighbors.length > 0) {
                        const lessThanNeighborsAverage = (lessThanNeighborsTotal/lessThanNeighbors.length);
                        const differential = energy - lessThanNeighborsAverage;
                        if (differential > 0) {
                            const totalDifferential = differential * lessThanNeighbors.length;
                            lessThanNeighbors.forEach(neighbor => {
                                const { data: { energy: neighborEnergy } } = neighbor;
                                const neighborDifferentialShare = (energy - neighborEnergy)/totalDifferential;
                                const transferAmount = energyDiffusionRate * neighborDifferentialShare * differential;
                                // Makesure they haven't been killed in the mean time
                                if (neighbor.data.changeEnergy && n.data.changeEnergy) {
                                    neighbor.data.changeEnergy(transferAmount);
                                    n.data.changeEnergy(-1 * transferAmount);
                                }
                            });
                        }
                    }
                }
                drawBall && drawBall({ ball: n });
            }
        } else if (label === 'wall') {
            drawWall && drawWall({ wall: n });
        } else if (label === 'corpse') {
            const { data: { becameACorpse } } = n;
            if ( outOfBounds({ x, y }) || ( (now - becameACorpse) > 128000 ) ) {
                removeBody(n);
            } else {
                drawCorpse && drawCorpse({ corpse: n });
            }
        }
    });

    let ballsNeeded = Math.max(baselineCount - numOfBalls, 0);
    for (; ballsNeeded > 0; ballsNeeded--) {
        if (random() < (someMagicFactor*0.7)) {
            spawnBall();
            numOfBalls++;
        }
    }

    numOfBallsLastCycle = numOfBalls;

    afterCycle && afterCycle({ numOfBalls });
}

const areSameSpeciesCheck = ({ bodyA, bodyB }) => {
    const { genome: { ancestry: aAncestry } } = bodyA;
    const { genome: { ancestry: bAncestry } } = bodyB;
    return ( aAncestry === bAncestry );
};

const getMurderAbility = (random, { eater, attacked }) => {
    return eater.circleRadius >= attacked.circleRadius;
};

const cannibalismCheck = (random, { bodyA, bodyB }) => {
    return {
        aWantsToEat: (
            (random() < bodyA.genome.cannibalismRate) &&
            getMurderAbility(random, { eater: bodyA, attacked: bodyB })
        ),
        bWantsToEat: (
            (random() < bodyB.genome.cannibalismRate) &&
            getMurderAbility(random, { eater: bodyB, attacked: bodyA })
        )
    };
};

const carnivorismCheck = (random, { bodyA, bodyB }) => {
    return {
        aWantsToEat: (random() < bodyA.genome.carnivorismRate) && getMurderAbility(random, { eater: bodyA, attacked: bodyB }),
        bWantsToEat: (random() < bodyB.genome.carnivorismRate) && getMurderAbility(random, { eater: bodyB, attacked: bodyA })
    };
};

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
                const areSameSpecies = areSameSpeciesCheck({ bodyA, bodyB });
                const checkFunction = areSameSpecies ? cannibalismCheck : carnivorismCheck;
                const { aWantsToEat, bWantsToEat } = checkFunction(random, { bodyA, bodyB });
                const someonesGonnaEat = aWantsToEat || bWantsToEat;
                if (someonesGonnaEat) {
                    const bothWantToEat = aWantsToEat && bWantsToEat;
                    const aEats = (
                        (bothWantToEat && (random() < 0.5)) ||
                        (aWantsToEat && !bWantsToEat)
                    );
                    const [ eater, eaten ] = aEats ? [ bodyA, bodyB ] : [ bodyB, bodyA ];
                    const { area: consumedArea, data: { energy: consumedEnergy } } = eaten;
                    killBall({ ball: eaten, beforeKillBall });
                    areSameSpecies ? eater.data.ownEaten++ : eater.data.othersEaten++;
                    eater.data.changeEnergy(consumedArea + consumedEnergy);
                } else {
                    const {
                        genome: {
                            selfStickiness: aSelfStickiness,
                            stickinessToOthers: aStickinessToOthers
                        },
                        data: { energy: aEnergy }
                    } = bodyA;
                    const {
                        genome: {
                            selfStickiness: bSelfStickiness,
                            stickinessToOthers: bStickinessToOthers
                        },
                        data: { energy: bEnergy }
                    } = bodyB;
                    if (areSameSpecies) {
                        if (random() < aSelfStickiness || random() < bSelfStickiness) {
                            stickTogether(bodyA, bodyB);
                        }
                    } else {
                        if (random() < aStickinessToOthers || random() < bStickinessToOthers) {
                            stickTogether(bodyA, bodyB);
                        }
                    }
                }
            } else if (
                (aLabel === 'corpse' && bLabel === 'ball') ||
                (bLabel === 'corpse' && aLabel === 'ball')
            ) {
                const [ theBall, theCorpse ] = (aLabel === 'ball') ? [ bodyA, bodyB ] : [ bodyB, bodyA ];
                const { area: consumedArea, data: { energy: consumedEnergy } } = theCorpse;
                theBall.data.changeEnergy(consumedArea + consumedEnergy);
                removeBody(theCorpse);
            }
        })
    });

    const boxWidth = stageWidth * 3;
    const boxBottom = stageHeight - 450;
    const boxHeight = 500;
    const wallThickness = 75;
    const centerX = (stageWidth / 2);
    const leftX = centerX - (boxWidth / 2);
    const rightX = centerX + (boxWidth / 2);
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

function getOtherEndOfConstraint(constraint, me) {
    const { bodyA, bodyB } = constraint;
    return (bodyA.id === me.id) ? bodyB : bodyA;
}

function addBody(body) {
    World.add(engine.world, body);
}

function removeBodyConstraints(body) {
    if (body.constraints) {
        body.constraints.forEach(constraint => {
            if (constraint) {
                const neighbor = getOtherEndOfConstraint(constraint, body);
                neighbor.neighborIds.delete(body.id);
                World.remove(engine.world, constraint);
            }
        });
        body.constraints = undefined;
    }
    if (body.anchorConstraints) {
        body.anchorConstraints.forEach(constraint => {
            if (constraint) World.remove(engine.world, constraint);
        });
        body.anchorConstraints = undefined;
    }
}

function removeBody(body) {
    removeBodyConstraints(body);
    World.remove(engine.world, body);
}

function stickTogether(ballA, ballB) {
    if( !ballA.neighborIds.has(ballB.id) ) {
        const bond = Constraint.create({
            bodyA: ballA, bodyB: ballB,
            stiffness: 0.15,
            length: ballA.circleRadius + 2,
            damping: 0.75
        });
        // Incase one of the balls is currently being eaten
        if (ballA.constraints !== undefined && ballB.constraints !== undefined) {
            ballA.constraints.push(bond);
            ballB.constraints.push(bond);
            World.add(engine.world, bond);
            ballA.neighborIds.add(ballB.id);
            if (ballB.neighborIds.has(ballA.id)) console.log('WTF!');
            ballB.neighborIds.add(ballA.id);
        }
    }
}

function stickToWorld(ball) {
    const { position: { x, y } } = ball;
    const anchor = Constraint.create({
         bodyB: ball,
         pointB: { x: -25, y: 0 },
         pointA: { x, y },
         stiffness: 0.5
    });
    if (ball.anchorConstraints !== undefined) {
        ball.anchorConstraints.push(anchor);
        World.add(engine.world, anchor);
    }
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

function convertToCorpse(ball) {
    const { data: { energy } } = ball;
    // TODO: Write this for perfomrance
    ball.label = 'corpse';
    ball.restitution = 0.95;
    ball.render.fillStyle = undefined;
    ball.genome = undefined;
    ball.data = { energy, becameACorpse: getTime() };
}

function killBall({ ball, beforeKillBall, becomeCorpse }) {
    if (beforeKillBall) {
        beforeKillBall && beforeKillBall(ball);
    }
    if (becomeCorpse) {
        convertToCorpse(ball);
    } else {
        removeBody(ball);
    }
}

function spawnBall(parent, { xOveride, yOveride, paidInSize, isAnchorBaby } = {}) {
    const genome = ( parent ? makeChildGenome(parent, random) : makeNewBeingGenome(random) );
    const { ballRadius, hue, brightness } = genome;
    const newBallRadius = paidInSize || ( MINIMUM_BALL_RADIUS + (random()*60/MAX_SCALE_FACTOR) );
    const newBall = addCircle({
        x: xOveride || (stageWidth * ( (3*random()) - 1 )),
        y: yOveride || Y_START,
        r: newBallRadius,
        options: {
            label: 'ball',
            restitution: 0,
            genome,
            constraints: [],
            anchorConstraints: [],
            neighborIds: new Set(),
            data: getNewBeingData({
                parent,
                now: getTime(),
                beginTime,
                initial: {
                    energy: 0,
                    wasAnchorBaby: isAnchorBaby?1:0
                }
            }),
        }
    });
    if (parent) stickTogether(parent, newBall);
    if (isAnchorBaby) stickToWorld(newBall);
}

export default {
    setup,
    stepLogic,
    utils: {
        getTime
    },
    consts: {
        stageWidth,
        stageHeight,
        countX,
        countY
    }
};


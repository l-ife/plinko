import { uuid } from './utils';
import TrailingData from './trailing-data';

import Alea from 'alea';

let pegSize = 14;
const PEG_EATER_MINIMUM_ENERGY = 1750;
let defaultBallRadius = 6;

let plinkoWidth = 750;//*1.5;
let plinkoHeight = 1800;
let countX = 20;//*1.5;
let countY = 2;//24;
let numOfPegs = 0;

const oldAge = 75000;

const areaToRadiusPercentageIncrease = areaPercentageIncrease => 0.2 * Math.sqrt( (25 * areaPercentageIncrease) + 25) - 1;
const areaGivenRadius = radius => Math.PI * Math.pow(radius, 2);
const radiusGivenArea = area   => Math.sqrt(area) / Math.sqrt(Math.PI);
const MINIMUM_BALL_RADIUS = 5;
const MINIMUM_BALL_BIRTH_ENERGY = areaGivenRadius(MINIMUM_BALL_RADIUS);

import { Bodies, Body, Composite, Constraint, Engine, Events, World } from './matter-js-exports-shim';

import { makeNewBeingGenome, makeChildGenome } from './plinko/genome';
import { getNewBeingData } from './plinko/data';

let random;

const TYPES_OF_BIRTH_AND_DEATH = {
    BIRTH: {
        NEW: 0,
        LOOPED_AROUND: 1,
        LOOP_AROUND_SPLIT: 2,
        MIDSTREAM_SPAWN: 3,
        REBIRTH_FROM_THE_ANCIENTS: 4,
        RESOURCE_CHILD: 5,
        DYING_BREATH_BABY: 6,
        SPLIT: 13
    },
    DEATH: {
        DIEOFF: 7,
        FELL_OFF_BOTTOM: 8,
        EATEN_BY_OTHER_SPECIES: 9,
        EATEN_BY_OWN_SPECIES: 10,
        OLD_AGE: 11,
        BECAME_PEG: 12
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
        (random()*randomFactorRange)
    );
    return (randomFactor + (ageFactor - 1));
};

const DIEOFF_POINT = 1800;
let numOfBallsLastCycle = 0;
const stepLogic = ({ beforeKillBall, afterCycle, drawBall, drawCorpse, drawPeg, drawWall }) => {
    let bodies = Composite.allBodies(engine.world);

    const now = getTime();
    const baselineCount = 175;
    let numOfBalls = 0;

    bodies.forEach((n, i) => {
        const { render: { visible }, circleRadius, position: { x, y }, genome: { ballRadius, growthRate } = {}, label } = n;
        if(!visible) return;
        if (label === 'ball') {
            numOfBalls++;
            const ballAge = (now - n.data.birthdate);
            const areaOfCircle = areaGivenRadius(circleRadius);
            if (ballAge > n.genome.maxAge) {
                if (n.data.energy > MINIMUM_BALL_BIRTH_ENERGY && random() < 0.875) {
                    n.data.changeEnergy(-1 * MINIMUM_BALL_BIRTH_ENERGY);
                    spawnBall(n, TYPES_OF_BIRTH_AND_DEATH.BIRTH.DYING_BREATH_BABY);
                    numOfBalls++;
                }
                killBall({ ball: n, beforeKillBall }, TYPES_OF_BIRTH_AND_DEATH.DEATH.OLD_AGE);
                numOfBalls--;
                return;
            }
            const getBallAgeSurvivalFactor = (randomFactorRange) => {
                return ballAgeSurvivalFactor(ballAge, randomFactorRange);
            };
            if (numOfBallsLastCycle > DIEOFF_POINT && getBallAgeSurvivalFactor() < 0.50) {
                killBall({ ball: n, beforeKillBall }, TYPES_OF_BIRTH_AND_DEATH.DEATH.DIEOFF);
                numOfBalls--;
                return;
            }

            if (y > plinkoHeight * 1.3) {
                if (n.data.energy > MINIMUM_BALL_BIRTH_ENERGY && random() < 0.875 /*&& getBallAgeSurvivalFactor() > 0.50*/) {
                    n.data.changeEnergy(-1 * MINIMUM_BALL_BIRTH_ENERGY);
                    spawnBall(n, TYPES_OF_BIRTH_AND_DEATH.BIRTH.LOOPED_AROUND);
                    numOfBalls++;
                }
                killBall({ ball: n, beforeKillBall }, TYPES_OF_BIRTH_AND_DEATH.DEATH.FELL_OFF_BOTTOM);
                numOfBalls--;
            } else if (random() < 0.05 && getBallAgeSurvivalFactor() > 0.55) {
                let i = n.genome.midstreamBirthrate;
                while (i >= 1 && n.data.energy > MINIMUM_BALL_BIRTH_ENERGY) {
                    const energyLeftOver = n.data.energy - MINIMUM_BALL_BIRTH_ENERGY;
                    const energyToGive = Math.min(energyLeftOver, n.genome.maxEnergyToDonateToMidstreamChild);
                    n.data.changeEnergy(-1 * ( MINIMUM_BALL_BIRTH_ENERGY + energyToGive ));
                    spawnBall(n, TYPES_OF_BIRTH_AND_DEATH.BIRTH.MIDSTREAM_SPAWN, { energyDonation: energyToGive });
                    numOfBalls++;
                    n.data.midstreamChildren++;
                    i--;
                }
                if (random() < i && n.data.energy > MINIMUM_BALL_BIRTH_ENERGY) {
                    const energyLeftOver = n.data.energy - MINIMUM_BALL_BIRTH_ENERGY;
                    const energyToGive = Math.min(energyLeftOver, n.genome.maxEnergyToDonateToMidstreamChild);
                    n.data.changeEnergy(-1 * ( MINIMUM_BALL_BIRTH_ENERGY + energyToGive ));
                    spawnBall(n, TYPES_OF_BIRTH_AND_DEATH.BIRTH.MIDSTREAM_SPAWN, { energyDonation: energyToGive });
                    numOfBalls++;
                    n.data.midstreamChildren++;
                }
            } else if (circleRadius < ballRadius && (areaOfCircle * growthRate) < n.data.energy && random() < 0.5) {
                const scaleFactor = (1 + areaToRadiusPercentageIncrease(growthRate));
                Body.scale(n, scaleFactor, scaleFactor);
                n.data.changeEnergy(-1 * (areaOfCircle * growthRate));
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
            spawnBall(undefined, TYPES_OF_BIRTH_AND_DEATH.BIRTH.REBIRTH_FROM_THE_ANCIENTS);
            numOfBalls++;
        }
    }

    numOfBallsLastCycle = numOfBalls;

    afterCycle && afterCycle({ numOfBalls });
}

const getMurderAbility = (random, { eater, attacked }) => {
    // const typeFloat = eater.genome[typeField];
    return eater.circleRadius > attacked.circleRadius;
};

const cannibalismCheck = (random, { bodyA, bodyB }) => {
    return {
        aWantsToEat: (random() < bodyA.genome.cannibalismRate) && getMurderAbility(random, { eater: bodyA, attacked: bodyB }),
        bWantsToEat: (random() < bodyB.genome.cannibalismRate) && getMurderAbility(random, { eater: bodyB, attacked: bodyA })
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
    // engine = Engine.create({ enableSleeping: true });
    engine = Engine.create();
    beginTime = getTime();
    trailingData = TrailingData({ age: 3000 });
    // theBest = SortedBuffer(100);

    Events.on(engine, "collisionStart", ({ pairs, source : { timing: { timestamp: now } }, name }) => {
        pairs.forEach(({ bodyA, bodyB }) => {
            const { label: aLabel } = bodyA;
            const { label: bLabel } = bodyB;
            if (aLabel === 'ball' && bLabel === 'ball') {
                if ((now - bodyA.data.birthdate) > 300 && (now - bodyB.data.birthdate) > 300) {
                    const areSameSpecies = (bodyA.genome.ancestry === bodyB.genome.ancestry);
                    const deathType = TYPES_OF_BIRTH_AND_DEATH.DEATH[areSameSpecies ? 'EATEN_BY_OWN_SPECIES' : 'EATEN_BY_OTHER_SPECIES'];
                    const checkFunction = areSameSpecies ? cannibalismCheck : carnivorismCheck;
                    const { aWantsToEat, bWantsToEat } = checkFunction(random, { bodyA, bodyB });
                    const aEats = (
                        (aWantsToEat && bWantsToEat && (random() < 0.5)) ||
                        (aWantsToEat && !bWantsToEat)
                    );
                    const [ eater, eaten ] = aEats ? [ bodyA, bodyB ] : [ bodyB, bodyA ];
                    const { genome: { maxEnergyToDonateToMidstreamChild }, data: { energy } } = eater;
                    const { circleRadius: consumedRadius, data: { energy: consumedEnergy } } = eaten;
                    killBall({ ball: eaten, beforeKillBall }, deathType);
                    areSameSpecies ? eater.data.ownEaten++ : eater.data.othersEaten++;
                    const energyConsumed = areaGivenRadius(consumedRadius) + consumedEnergy;
                    eater.data.changeEnergy(energyConsumed);
                    const { circleRadius, position: { x, y }, genome: { splitRate, becomePegRate, extraEnergyToPutIntoPeg } } = eater;
                    if (energy > (PEG_EATER_MINIMUM_ENERGY + extraEnergyToPutIntoPeg) && y > 0.2 && random() < becomePegRate) {
                        killBall(
                            { ball: eater, beforeKillBall },
                            TYPES_OF_BIRTH_AND_DEATH.DEATH.BECAME_PEG,
                            { energyPutIntoPeg: PEG_EATER_MINIMUM_ENERGY + extraEnergyToPutIntoPeg }
                        );
                    } else if (energy > MINIMUM_BALL_BIRTH_ENERGY && y > 0.2 && random() < splitRate) {
                        const energyLeftOver = energy - MINIMUM_BALL_BIRTH_ENERGY;
                        const energyToGive = Math.min(energyLeftOver, maxEnergyToDonateToMidstreamChild);
                        eater.data.changeEnergy(-1 * ( MINIMUM_BALL_BIRTH_ENERGY + energyToGive ));
                        const newBall = spawnBall(eater, TYPES_OF_BIRTH_AND_DEATH.BIRTH.SPLIT, { xOveride: x, yOveride: y - (circleRadius + MINIMUM_BALL_RADIUS), energyDonation: energyToGive });
                        const constraint = Constraint.create({
                            bodyA: eater,
                            bodyB: newBall,
                            // pointB: {
                            //     x: 0,
                            //     y: (-1 * (circleRadius + MINIMUM_BALL_RADIUS))
                            // }
                        });
                        World.add(engine.world, constraint);
                        // console.log('there was a split');
                        eater.data.timesSplit++;
                    }
                }
            } else if (
                (aLabel === 'corpse' && bLabel === 'ball') ||
                (bLabel === 'corpse' && aLabel === 'ball')
            ) {
                const [ theBall, theCorpse ] = (aLabel === 'ball') ? [ bodyA, bodyB ] : [ bodyB, bodyA ];
                const { data: { energy } } = theBall;
                const { circleRadius: consumedRadius, data: { energy: consumedEnergy } } = theCorpse;
                const energyConsumed = areaGivenRadius(consumedRadius) + consumedEnergy;
                theBall.data.changeEnergy(energyConsumed);
                removeBody(theCorpse);
            } else if (
                (aLabel === 'peg' && bLabel === 'ball') ||
                (bLabel === 'peg' && aLabel === 'ball')
            ) {
                const [ theBall, thePeg ] = (aLabel === 'ball') ? [ bodyA, bodyB ] : [ bodyB, bodyA ];
                const { genome: { eatPegRate }, data: { energy } } = theBall;
                const { pegEnergy } = thePeg;
                if (energy > pegEnergy && random() < eatPegRate) {
                    removeBody(thePeg);
                    theBall.data.changeEnergy(-1 * pegEnergy);
                    theBall.data.pegsEaten++;
                }
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
    // dormantBodies.push(body);
    World.remove(engine.world, body);
}

function addCircle({ x = 0, y = 0, r = 10, options = {} } = {}) {
    let body;
    // if (dormantBodies.length > 0) {
    //     let dormantBody = dormantBodies.pop();
    //     Body.set(dormantBody, Common.extend(dormantBody, options, {
    //         id: Common.nextId(), position: { x, y }, angle: 0,
    //         isSleeping: false, speed: 0, render: { visible: true }
    //     }));
    //     const scaleFactor = r/dormantBody.circleRadius;
    //     Body.scale(dormantBody, scaleFactor, scaleFactor);
    // } else {
        body = Bodies.circle(x, y, r, options);
    // }
    addBody(body);
    return body;
}

function addRectangle({ x = 0, y = 0, w = 10, h = 10, options = {} } = {}) {
    // TODO: Use the dormant bodies too
    let body = Bodies.rectangle(x, y, w, h, options);
    addBody(body);
    return body;
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
            return valueBuffer[parseInt(random()*valueBuffer.length)];
        },
        getTheBest() {
            if (valueBuffer.length === 0) return;
            return valueBuffer[valueBuffer.length - 1];
        }
    };
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

function killBall({ ball, beforeKillBall }, deathType, { energyPutIntoPeg } = {}) {
    if (beforeKillBall) {
        ball.data.deathType = deathType;
        beforeKillBall && beforeKillBall(ball);
    }
    const ballAge = (getTime(engine) - ball.data.birthdate);
    // theBest.potentiallyInsert(ball, ballAge);
    trailingData.addPoint('age', ballAge);
    switch (deathType) {
        case TYPES_OF_BIRTH_AND_DEATH.DEATH.FELL_OFF_BOTTOM:
        case TYPES_OF_BIRTH_AND_DEATH.DEATH.EATEN_BY_OTHER_SPECIES:
        case TYPES_OF_BIRTH_AND_DEATH.DEATH.EATEN_BY_OWN_SPECIES:
            removeBody(ball);
            break;
        case TYPES_OF_BIRTH_AND_DEATH.DEATH.BECAME_PEG:
            convertToPeg(ball, energyPutIntoPeg);
            break;
        default:
            convertToCorpse(ball);
    }
}

function spawnBall(parent, birthType, { xOveride, yOveride, energyDonation = 0 } = {}) {
    const genome = ( parent ? makeChildGenome(parent, random) : makeNewBeingGenome(random) );
    const { ballRadius, startBallRadius, hue, position, restitution } = genome;
    const extraEnergyNeeded = areaGivenRadius(startBallRadius) - MINIMUM_BALL_BIRTH_ENERGY;
    // I just unconstrained startBallRadius and ballRadius because they couldn't be mutually constrained
    // Fix up this logic to constraint them at runtime
    const actualStartRadius = (extraEnergyNeeded > energyDonation) ?
                                ( Math.sqrt( (energyDonation / Math.PI) + Math.pow(MINIMUM_BALL_RADIUS, 2) ) ) : startBallRadius;
    const energy = (extraEnergyNeeded > energyDonation) ? 0 : (energyDonation - extraEnergyNeeded);
    return addCircle({
        x: xOveride || (plinkoWidth * position),
        y: yOveride || -10,
        r: actualStartRadius,
        options: {
            label: 'ball',
            render: { fillStyle: [ hue, 255, 255 ] },
            restitution,
            genome,
            data: getNewBeingData({
                parent,
                now: getTime(),
                beginTime,
                birthType,
                initialEnergy: energy
            }),
        }
    });
}

export default {
    setup,
    stepLogic,
    utils: {
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


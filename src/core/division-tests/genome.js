import forEach from 'lodash/forEach';
import mapValues from 'lodash/mapValues';
import get from 'lodash/get';

import { uuid, valueBetween, ExtendableError } from '../../core/utils';

import { Genome, GENETYPES } from '../../core/utils/genome';

const MAX_SCALE_FACTOR = 3;
const MINIMUM_BALL_RADIUS = 5;

export const HUE_STEP = 1.5;

const genomeDefinition = {
    maxBallRadius: {
        type: GENETYPES.FLOAT,
        bounds: [MINIMUM_BALL_RADIUS, 45],
        mutates: {
            magnitude: 2.5,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: () => 1,
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    maxBallRadiusGrowth: {
        type: GENETYPES.FLOAT,
        bounds: [-1.5, 1.5],
        mutates: {
            magnitude: 0.3,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: () => 1,
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    minBallRadiusGrowth: {
        type: GENETYPES.FLOAT,
        bounds: [-6.5, 1],
        mutates: {
            magnitude: 0.75,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: () => 1,
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    makeAnchorBabyChance: {
        bounds: [0, 1],
        mutates: {
            magnitude: 0.1,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: () => 1,
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    stickiness: {
        bounds: [0, 1],
        mutates: {
            magnitude: 0.1,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: () => 1,
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    // maxConcurrentChildren: {

    // },
    // maxAge: {
    //     type: GENETYPES.FLOAT,
    //     bounds: [10, 100000],
    //     getNewBeingValue: ({ random }) => valueBetween(500, 2500, random),
    //     mutates: {
    //         magnitude: 1000,
    //         rate: {
    //             bounds: [0, 1],
    //             getNewBeingValue: () => 1,
    //             mutates: { magnitude: 0.05, rate: 1 }
    //         }
    //     }
    // },
    carnivorismRate: {
        bounds: [0, 1],
        getNewBeingValue: () => 1,
        mutates: {
            magnitude: 0.1,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: () => 1,
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    cannibalismRate: {
        bounds: [0, 1],
        getNewBeingValue: () => 0,
        mutates: {
            magnitude: 0.1,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: () => 1,
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    speciationRate: {
        bounds: [0, 1],
        getNewBeingValue: () => 0,
        mutates: {
            magnitude: 2/10000,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: () => 1,
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    splitRate: {
        type: GENETYPES.FLOAT,
        bounds: [0, 1],
        mutates: {
            magnitude: 0.1,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: () => 1,
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    percentageToUseForPregnancy: {
        type: GENETYPES.FLOAT,
        bounds: [0, 1],
        mutates: {
            magnitude: 0.1,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: () => 1,
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    hue: {
        type: GENETYPES.FLOAT,
        getChildValue: ({ parentVal }) => {
            const defaultedNewHue = parentVal + HUE_STEP;
            return (defaultedNewHue > 360) ?
                defaultedNewHue - 360 : defaultedNewHue;
        },
        getNewBeingValue: ({ random }) => random() * 360
    },
    brightness: {
        type: GENETYPES.FLOAT,
        getChildValue: ({ parentVal }) => Math.max(parentVal - (0.01/2), 0.25),
        getNewBeingValue: () => 0.75,
    },
    generation: {
        getNewBeingValue: () => 0,
        getChildValue: ({ parentVal }) => parentVal + 1
    },
    ancestry: {
        getNewBeingValue: ({ random }) => uuid({ length: 4, rng: random }),
        getChildValue: ({ random, parentVal, parentGenome: { speciationRate } }) =>
            random() < speciationRate ?
                uuid({ length: 4, rng: random }) : parentVal
    },
};

const divisionGenome = new Genome(genomeDefinition);

export function getGenomeColumnHeaders() {
    return divisionGenome.getGenomeColumnHeaders();
};

export function getGenomeColumns(genome) {
    return divisionGenome.getGenomeColumns(genome);
};

export function makeChildGenome({ genome: pGenome }, random) {
    return divisionGenome.makeChildGenome({ genome: pGenome }, random);
};

export function makeNewBeingGenome(random) {
    return divisionGenome.makeNewBeingGenome(random);
};

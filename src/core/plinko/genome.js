import forEach from 'lodash/forEach';
import mapValues from 'lodash/mapValues';
import get from 'lodash/get';

import { uuid, valueBetween, ExtendableError } from '../../core/utils';

import { Genome, GENETYPES } from '../../core/utils/genome';

const genomeDefinition = {
    startBallRadius: {
        type: GENETYPES.FLOAT,
        bounds: [5, 50],
        mutates: {
            magnitude: 0.5,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: () => 1,
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    ballRadius: {
        type: GENETYPES.FLOAT,
        bounds: [5, 50],
        mutates: {
            magnitude: 0.5,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: () => 1,
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    maxEnergyToDonateToMidstreamChild: {
        type: GENETYPES.FLOAT,
        bounds: [0, 1000000],
        getNewBeingValue: () => 0,
        mutates: {
            magnitude: 300,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: () => 1,
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    extraEnergyToPutIntoPeg: {
        type: GENETYPES.FLOAT,
        bounds: [0, 1000000],
        getNewBeingValue: () => 0,
        mutates: {
            magnitude: 300,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: () => 1,
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    position: {
        type: GENETYPES.FLOAT,
        bounds: [-0.1, 1.1],
        mutates: {
            magnitude: 0.1,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: () => 1,
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    growthRate: {
        type: GENETYPES.FLOAT,
        bounds: [0, 1],
        getNewBeingValue: () => 1,
        mutates: {
            magnitude: 0.05,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: () => 1,
                mutates: { magnitude: 0.025, rate: 1 }
            }
        }
    },
    restitution: {
        type: GENETYPES.FLOAT,
        bounds: [0, 1],
        mutates: {
            magnitude: 0.05,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: () => 1,
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    midstreamBirthrate: {
        bounds: [0, 1],
        mutates: {
            magnitude: 0.25,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: () => 1,
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    maxAge: {
        type: GENETYPES.FLOAT,
        bounds: [10, 100000],
        getNewBeingValue: ({ random }) => valueBetween(500, 2500, random),
        mutates: {
            magnitude: 1000,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: () => 1,
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    eatPegRate: {
        bounds: [0, 1],
        getNewBeingValue: () => 0.5,
        mutates: {
            magnitude: 0.1,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: () => 1,
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
    becomePegRate: {
        bounds: [0, 1],
        getNewBeingValue: () => 0.5,
        mutates: {
            magnitude: 0.1,
            rate: {
                bounds: [0, 1],
                getNewBeingValue: () => 1,
                mutates: { magnitude: 0.05, rate: 1 }
            }
        }
    },
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
    hue: {
        type: GENETYPES.FLOAT,
        bounds: [0, 255],
        mutates: {
            magnitude: 2,
            rate: 1,
            dontLog: true
        }
    },
    generation: {
        getNewBeingValue: () => 0,
        getChildValue: ({ parentVal }) => parentVal + 1
    },
    ancestry: {
        getNewBeingValue: ({ random }) => uuid({ length: 4, rng: random }),
    },
};

const plinkoGenome = new Genome(genomeDefinition);

export function getGenomeColumnHeaders() {
    return plinkoGenome.getGenomeColumnHeaders();
};

export function getGenomeColumns(genome) {
    return plinkoGenome.getGenomeColumns(genome);
};

export function makeChildGenome({ genome: pGenome }, random) {
    return plinkoGenome.makeChildGenome({ genome: pGenome }, random);
};

export function makeNewBeingGenome(random) {
    return plinkoGenome.makeNewBeingGenome(random);
};

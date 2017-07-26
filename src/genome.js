import forEach from 'lodash/forEach';
import mapValues from 'lodash/mapValues';
import get from 'lodash/get';

import { uuid, ExtendableError } from './utils';


const GENETYPES = {
    FLOAT: 0,
    RANKED_SET: 1
}

function bounds(min, max) {
    return number => Math.min(Math.max(number, min), max);
}

function valueBetween(min, max, random) {
    return ( min + (random() * (max - min)) );
}

function mutate({ parentValue, _boundsFn, mutates: { magnitude }, rate }, random) {
    const mutation = (
        ((random()*magnitude * 2) - magnitude) * rate
    );

    return _boundsFn(parentValue + mutation);
}

const genomeDefinition = {
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
    carnivorismType: {
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
    cannibalismType: {
        type: GENETYPES.FLOAT,
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
            magnitude: 5,
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

const dynamicGenomeDefinition = mapValues(
    genomeDefinition, geneDefinition => {
        if (geneDefinition.bounds) {
            const [min, max] = geneDefinition.bounds;
            geneDefinition._boundsFn = bounds(min, max);
        }
        if (get(geneDefinition, 'mutates.rate.bounds')) {
            const [min, max] = geneDefinition.mutates.rate.bounds;
            geneDefinition.mutates.rate._boundsFn = bounds(min, max);
        }
        return geneDefinition;
    }
);

export function getGenomeColumnHeaders() {
    let genomeColumnHeaders = [];
    let mutationRateColumnHeaders = [];
    forEach(genomeDefinition, (geneDefintion, key) => {
        genomeColumnHeaders.push(key);
        if (geneDefintion.mutates && !get(geneDefintion, 'mutates.dontLog')) mutationRateColumnHeaders.push(`mutationRate:${key}`);
    });
    return genomeColumnHeaders.concat(mutationRateColumnHeaders);
};

export function getGenomeColumns(genome) {
    let genomeColumns = [];
    let mutationRateColumns = [];
    forEach(genomeDefinition, (geneDefintion, key) => {
        genomeColumns.push(+(genome[key].toFixed?genome[key].toFixed(4):genome[key]));
        if (geneDefintion.mutates && !get(geneDefintion, 'mutates.dontLog')) +(mutationRateColumns.push(genome.mutationRates[key].toFixed?genome.mutationRates[key].toFixed(4):genome.mutationRates[key]));
    });
    return genomeColumns.concat(mutationRateColumns);
};

class GeneMissingBoundsOrDefault extends ExtendableError {}

function getGeneDefault(geneDefintion = {}, random) {
    const { getNewBeingValue, bounds } = geneDefintion;
    if (getNewBeingValue) {
        return getNewBeingValue({ definition: geneDefintion, random });
    } else if (bounds) {
        const [ min, max ] = bounds;
        return valueBetween(min, max, random);
    } else {
        throw new GeneMissingBoundsOrDefault();
    }
}

export function makeNewBeingGenome(random) {
    let genome = { mutationRates: {} };
    forEach(genomeDefinition, (geneDefintion, key) => {
        genome[key] = getGeneDefault(geneDefintion, random);
        if (geneDefintion.mutates) {
            const mutationRate = geneDefintion.mutates.rate
            genome.mutationRates[key] =
                (typeof mutationRate === 'object') ?
                    getGeneDefault(mutationRate, random) : mutationRate;
        }
    });
    return genome;
};

export function makeChildGenome({ genome: pGenome }, random) {
    // console.log('\n');
    // console.log('\n');
    // console.log(pGenome);
    // console.log('\n');

    const { ancestry } = pGenome;
    let cGenome = { mutationRates: {} };
    forEach(dynamicGenomeDefinition, (geneDefintion, key) => {
        const { mutationRates: { [key]: pMutationRate }, [key]: pValue } = pGenome;
        if (geneDefintion.mutates) {
            cGenome[key] = mutate(
                Object.assign(
                    geneDefintion,
                    { parentValue: pValue, rate: pMutationRate }
                ),
                random
            );
            const mutationRateDefinitionOrStaticRate = geneDefintion.mutates.rate;
            if (typeof mutationRateDefinitionOrStaticRate === 'object') {
                cGenome.mutationRates[key] = mutate(
                    Object.assign(
                        mutationRateDefinitionOrStaticRate,
                        { parentValue: pMutationRate, rate: mutationRateDefinitionOrStaticRate.mutates.rate }
                    ),
                    random
                );
            } else {
                cGenome.mutationRates[key] = mutationRateDefinitionOrStaticRate;
            }
        } else if (geneDefintion.getChildValue) {
            cGenome[key] = geneDefintion.getChildValue({ parentVal: pValue });
        } else {
            cGenome[key] = pValue;
        }
    });

    // console.log(cGenome);
    // console.log('\n');
    // console.log('\n');

    return cGenome;
}

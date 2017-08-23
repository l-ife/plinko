import forEach from 'lodash/forEach';
import mapValues from 'lodash/mapValues';
import get from 'lodash/get';

import { uuid, valueBetween, bounds, ExtendableError } from '../../core/utils';


export const GENETYPES = {
    FLOAT: 0,
    RANKED_SET: 1
}

function mutate({ parentValue, _boundsFn, mutates: { magnitude }, rate }, random) {
    const mutation = (
        ((random()*magnitude * 2) - magnitude) * rate
    );

    return _boundsFn(parentValue + mutation);
}

function _getGenomeColumnHeaders(genomeDefinition) {
    let genomeColumnHeaders = [];
    let mutationRateColumnHeaders = [];
    forEach(genomeDefinition, (geneDefintion, key) => {
        genomeColumnHeaders.push(key);
        if (geneDefintion.mutates && !get(geneDefintion, 'mutates.dontLog')) mutationRateColumnHeaders.push(`mutationRate:${key}`);
    });
    return genomeColumnHeaders.concat(mutationRateColumnHeaders);
};

function _getGenomeColumns(genomeDefinition, genome) {
    let genomeColumns = [];
    let mutationRateColumns = [];
    forEach(genomeDefinition, (geneDefintion, key) => {
        genomeColumns.push(+(genome[key].toFixed?genome[key].toFixed(4):genome[key]));
        if (geneDefintion.mutates && !get(geneDefintion, 'mutates.dontLog')) +(mutationRateColumns.push(genome.mutationRates[key].toFixed?genome.mutationRates[key].toFixed(4):genome.mutationRates[key]));
    });
    return genomeColumns.concat(mutationRateColumns);
};

class GeneMissingBoundsOrDefault extends ExtendableError {}

function __getGeneDefault(geneDefintion = {}, genome = {}, random) {
    const { getNewBeingValue, bounds } = geneDefintion;
    if (getNewBeingValue) {
        return getNewBeingValue({ definition: geneDefintion, genome, random });
    } else if (bounds) {
        const [ min, max ] = bounds;
        return valueBetween(min, max, random);
    } else {
        throw new GeneMissingBoundsOrDefault();
    }
}

function _makeNewBeingGenome(genomeDefinition, random) {
    let genome = { mutationRates: {} };
    forEach(genomeDefinition, (geneDefintion, key) => {
        genome[key] = __getGeneDefault(geneDefintion, genome, random);
        if (geneDefintion.mutates) {
            const mutationRate = geneDefintion.mutates.rate
            genome.mutationRates[key] =
                (typeof mutationRate === 'object') ?
                    __getGeneDefault(mutationRate, random) : mutationRate;
        }
    });
    return genome;
};

function _makeChildGenome({ genome: pGenome }, dynamicGenomeDefinition, random) {
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
            cGenome[key] = geneDefintion.getChildValue({
                parentVal: pValue,
                childGenomeSoFar: cGenome,
                parentGenome: pGenome,
                random
            });
        } else {
            cGenome[key] = pValue;
        }
    });

    return cGenome;
}

export function Genome(genomeDefinition, random) {
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

    return {
        getGenomeColumnHeaders() {
            return _getGenomeColumnHeaders(genomeDefinition);
        },
        getGenomeColumns(genome) {
            return _getGenomeColumns(genomeDefinition, genome);
        },
        makeChildGenome({ genome: pGenome }, random) {
            return _makeChildGenome({ genome: pGenome }, dynamicGenomeDefinition, random);
        },
        makeNewBeingGenome(random) {
            return _makeNewBeingGenome(genomeDefinition, random);
        }
    }
}

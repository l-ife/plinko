import forEach from 'lodash/forEach';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import assign from 'lodash/assign';

import { Data } from '../../core/utils/data';

let plinkoWidth = 750;
let plinkoHeight = 1800;

const dataDefinitions = {
    birthdate: {
        getInitialValue: ({ parent, now, beginTime }) => now,
        // getValueToLog: ({ data: { birthdate } }, { beginTime }) => (birthdate - beginTime)
    },
    age: {
        getInitialValue: () => 0,
        getValueToLog: ({ data: { birthdate } }, { now }) => (now - birthdate)
    },
    totalLifeEnergy: {
        getInitialValue: () => 0,
    },
    energy: {
        getInitialValue: ({ initial: { energy = 0 } = {} }) => energy,
    },
    deathPositionX: {
        getValueToLog: ({ position: { x } }) => x/plinkoWidth
    },
    deathPositionY: {
        getValueToLog: ({ position: { y } }) => y/plinkoWidth
    },
    midstreamChildren: {
        getInitialValue: () => 0,
    },
    othersEaten: {
        getInitialValue: () => 0,
    },
    ownEaten: {
        getInitialValue: () => 0,
    },
    pegsEaten: {
        getInitialValue: () => 0
    },
    timesSplit: {
        getInitialValue: () => 0
    },
    birthType: {
        getInitialValue: ({ birthType }) => birthType
    },
    deathType: {
        getValueToLog: ({ data: { deathType }}) => deathType
    },
    radius: {
        getValueToLog: ({ circleRadius }) => circleRadius
    },
};

const dataFunctions = {
    changeEnergy(energyChange) {
        this.energy += energyChange;
        if (energyChange > 0) {
            this.totalLifeEnergy += energyChange;
        }
    }
};

const plinkoDataDriver = new Data(dataDefinitions, dataFunctions);

export function getDataColumnHeaders() {
    return plinkoDataDriver.getDataColumnHeaders();
};

export function getNewBeingData(contextualData) {
    return plinkoDataDriver.getNewBeingData(contextualData);
};

export function calculateDataFields(ball, contextualData) {
    return plinkoDataDriver.calculateDataFields(ball, contextualData);
};

export function getDataColumns(ballData) {
    return plinkoDataDriver.getDataColumns(ballData);
};


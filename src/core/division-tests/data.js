import forEach from 'lodash/forEach';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import assign from 'lodash/assign';

import { Data } from '../../core/utils/data';

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
    othersEaten: {
        getInitialValue: () => 0,
    },
    ownEaten: {
        getInitialValue: () => 0,
    },
    // timesSplit: {
    //     getInitialValue: () => 0
    // },
    // finalRadius: {
    //     getValueToLog: ({ circleRadius }) => circleRadius
    // },
};

const dataFunctions = {
    changeEnergy(energyChange) {
        this.energy += energyChange;
        if (energyChange > 0) {
            this.totalLifeEnergy += energyChange;
        }
    }
};

const divisionDataDriver = new Data(dataDefinitions, dataFunctions);

export function getDataColumnHeaders() {
    return divisionDataDriver.getDataColumnHeaders();
};

export function getNewBeingData(contextualData) {
    return divisionDataDriver.getNewBeingData(contextualData);
};

export function calculateDataFields(ball, contextualData) {
    return divisionDataDriver.calculateDataFields(ball, contextualData);
};

export function getDataColumns(ballData) {
    return divisionDataDriver.getDataColumns(ballData);
};


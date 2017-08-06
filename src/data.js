import forEach from 'lodash/forEach';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import assign from 'lodash/assign';

// import plinko from './plinko';
// const { consts: { plinkoWidth, plinkoHeight } } = plinko;
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
        getInitialValue: () => 0,
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
};

const dataFunctions = {
    changeEnergy(energyChange) {
        this.energy += energyChange;
        if (energyChange > 0) {
            this.totalLifeEnergy += energyChange;
        }
    }
};

export function getDataColumnHeaders() {
    return map(dataDefinitions, (dataDefinition, key) => key);
};

export function getNewBeingData(contextualData) {
    const dataObject = mapValues(dataDefinitions, ({ getInitialValue }) => {
        return getInitialValue ?
            getInitialValue(contextualData) :
            undefined;
    });
    return assign(dataObject, dataFunctions);
};

export function calculateDataFields(ball, contextualData) {
    let ballData = Object.assign({}, ball.data);
    forEach(dataDefinitions, (dataDefinition, key) => {
        const { getValueToLog } = dataDefinition;
        if (getValueToLog) ballData[key] = getValueToLog(ball, contextualData);
    });
    return ballData;
};

export function getDataColumns(ballData) {
    return map(dataDefinitions, (dataDefinition, key) => +(ballData[key] && ballData[key].toFixed?ballData[key].toFixed(4):ballData[key]));
};

import forEach from 'lodash/forEach';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import assign from 'lodash/assign';

function _getDataColumnHeaders(dataDefinitions) {
    return map(dataDefinitions, (dataDefinition, key) => key);
};

function _getNewBeingData(dataDefinitions, dataFunctions, contextualData) {
    const dataObject = mapValues(dataDefinitions, ({ getInitialValue }) => {
        return getInitialValue ?
            getInitialValue(contextualData) :
            undefined;
    });
    return assign({}, dataObject, dataFunctions);
};

function _calculateDataFields(dataDefinitions, ball, contextualData) {
    let ballData = Object.assign({}, ball.data);
    forEach(dataDefinitions, (dataDefinition, key) => {
        const { getValueToLog } = dataDefinition;
        if (getValueToLog) ballData[key] = getValueToLog(ball, contextualData);
    });
    return ballData;
};

function _getDataColumns(dataDefinitions, ballData) {
    return map(dataDefinitions, (dataDefinition, key) => {
        const data = ballData[key];
        if ((data || data === 0) && data.toFixed) {
            return +(data.toFixed(4));
        }
        return data;
    });
};

export function Data(dataDefinitions, dataFunctions) {
    return {
        getDataColumnHeaders() {
            return _getDataColumnHeaders(dataDefinitions);
        },
        getNewBeingData(contextualData) {
            return _getNewBeingData(dataDefinitions, dataFunctions, contextualData);
        },
        calculateDataFields(ball, contextualData) {
            return _calculateDataFields(dataDefinitions, ball, contextualData);
        },
        getDataColumns(ballData) {
            return _getDataColumns(dataDefinitions, ballData);
        }
    }
}

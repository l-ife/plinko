export default function (lengths = {}) {
    let trailingData = {};
    const startKey = (key, length) => {
        trailingData[key] = { points: [], cursor: 0, length, _cachedAnswers: undefined };
    };
    const addPoint = (key, newNumber) => {
        if (!trailingData[key]) {
            throw new Error('No trailing data with that key started.');
        }
        let { cursor, length } = trailingData[key];
        trailingData[key].points[cursor] = newNumber;
        trailingData[key].cursor = (cursor <= length) ? cursor+1 : 0;
        trailingData[key]._cachedAnswers = undefined;
    };
    const getAverageMinMax = (key) => {
        if (!trailingData[key]) {
            throw new Error('No trailing data with that key started.');
        }
        if (trailingData[key]._cachedAnswers !== undefined) {
            return trailingData[key]._cachedAnswers;
        }
        const { points }  = trailingData[key];
        const aggregates = points.reduce((acc, num) => {
            return {
                sum: acc.sum + num,
                min: Math.min(acc.min, num),
                max: Math.max(acc.max, num)
            };
        }, { sum: 0, min: Infinity, max: -Infinity });
        const average = aggregates.sum/(points.length || 1);
        const min = aggregates.min;
        const max = aggregates.max;
        const answers = { average, min, max };
        trailingData[key]._cachedAnswers = answers;
        return answers;
    };
    Object.keys(lengths).forEach((key) => startKey(key, lengths[key]));
    return {
        startKey,
        addPoint,
        getAverageMinMax
    };
};

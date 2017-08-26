import { Composite } from '../../core/utils/matter-js-exports-shim';

import { getGenomeColumnHeaders, getGenomeColumns } from '../../core/division-tests/genome';
import { calculateDataFields, getDataColumnHeaders, getDataColumns } from '../../core/division-tests/data';

export const theBookOfTheDeadHeaders =
    getGenomeColumnHeaders().concat(getDataColumnHeaders());

export const ballToEntry = (ball, now, beginTime) => {
    const genomeColumns = getGenomeColumns(ball.genome);
    const dataColumns = getDataColumns(calculateDataFields(ball, { now, beginTime }));
    return genomeColumns.concat(dataColumns);
};

export const BookOfTheDead = () => {
    let theDead = [];

    const getTheBook = (engine, now, beginTime) => {
        const headerString = theBookOfTheDeadHeaders.join(',');
        const theDeadCsv = theDead.map(entry => entry.join(',')).join('\n');
        const theCurrentlyLivingCsv = Composite.allBodies(engine.world)
            .filter(body => body.genome !== undefined)
            .map(ball => ballToEntry(ball, now, beginTime).join(','))
            .join('\n');
        return `${headerString}\n${theDeadCsv}\n${theCurrentlyLivingCsv}`;
    };

    const addDead = (ball, now, beginTime) => {
        theDead.push(ballToEntry(ball, now, beginTime))
    };

    return {
        addDead,
        getTheBook
    };
};

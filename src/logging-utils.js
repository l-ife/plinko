import { Composite } from 'matter-js/build/matter.js';

import { getGenomeColumnHeaders, getGenomeColumns } from './genome';
import { calculateDataFields, getDataColumnHeaders, getDataColumns } from './data';

export const theBookOfPlinkoersHeaders =
    getGenomeColumnHeaders().concat(getDataColumnHeaders());

export const ballToEntry = (ball, now, beginTime) => {
    const genomeColumns = getGenomeColumns(ball.genome);
    const dataColumns = getDataColumns(calculateDataFields(ball, { now, beginTime }));
    return genomeColumns.concat(dataColumns);
};

export const BookOfPlinkoers = () => {
    let theDead = [];

    const getTheBook = (engine, now, beginTime) => {
        const headerString = theBookOfPlinkoersHeaders.join(',');
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

export const BookOfTheDead = ({
    getGenomeColumnHeaders,
    getGenomeColumns,

    getDataColumnHeaders,
    getDataColumns,
    calculateDataFields
}) => {
    let theDead = [];

    const theBookOfTheDeadHeaders =
        getGenomeColumnHeaders().concat(getDataColumnHeaders());

    const ballToEntry = (ball, now, beginTime) => {
        const genomeColumns = getGenomeColumns(ball.genome);
        const dataColumns = getDataColumns(calculateDataFields(ball, { now, beginTime }));
        return genomeColumns.concat(dataColumns);
    };

    const addDead = (ball, now, beginTime) => {
        theDead.push(ballToEntry(ball, now, beginTime))
    };

    const getTheBook = (balls, now, beginTime) => {
        const headerString = theBookOfTheDeadHeaders.join(',');
        const theDeadCsv = theDead.map(entry => entry.join(',')).join('\n');
        const theCurrentlyLivingCsv = balls
            .map(ball => ballToEntry(ball, now, beginTime).join(','))
            .join('\n');
        return `${headerString}\n${theDeadCsv}\n${theCurrentlyLivingCsv}`;
    };

    return {
        theBookOfTheDeadHeaders,
        ballToEntry,
        addDead,
        getTheBook
    };
};

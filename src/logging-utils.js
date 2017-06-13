import Matter from 'matter-js/build/matter';
const { Composite } = Matter;

export const theBookOfPlinkoersHeaders = [
    'ballRadius',
    'position',
    'hue',
    'mutationRate:ballRadius',
    'mutationRate:position',
    'mutationRate:restitution',
    'mutationRate:midstreamBirthrate',
    'restitution',
    'midstreamBirthrate',
    'generation',
    'birthdate',
    'age',
    'ancestry',
    'birthType',
    'deathType',
    'deathPositionX',
    'deathPositionY',
    'midstreamChildren',
    'ate'
];

export const ballToEntry = (ball, now, beginTime) => {
    const {
        ballRadius,
        position,
        hue,
        mutationRates,
        restitution,
        midstreamBirthrate,
        generation,
        ancestry,
        birthType,
        deathType,
        deathPositionX,
        deathPositionY,
        midstreamChildren,
        ate
    } = ball.genome;
    const ballAge = (now - ball.birthdate);
    return [
        ballRadius,
        position,
        hue,
        mutationRates.ballRadius,
        mutationRates.position,
        mutationRates.restitution,
        mutationRates.midstreamBirthrate,
        restitution,
        midstreamBirthrate,
        generation,
        ball.birthdate - beginTime,
        ballAge,
        ancestry,
        birthType,
        deathType,
        deathPositionX,
        deathPositionY,
        midstreamChildren,
        ate
    ];
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

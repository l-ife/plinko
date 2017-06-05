import Matter from 'matter-js/build/matter';
const { Bodies, Body, Composite, Engine, Events, Render, World } = Matter;

import plinko from '../plinko.js';
const { setup, draw, utils: { getTime, uuid }, consts: { plinkoWidth, plinkoHeight, oldAge } } = plinko;

let canvas;
let engine;
let beginTime;

const sessionId = uuid(16);

window.theWinners = [];

window.lifeStudy = () => {
    const theCurrentlyLivingCsv = Composite.allBodies(engine.world)
        .filter(body => body.genome !== undefined)
        .map(({
            genome: {
                ballRadius,
                position,
                hue,
                mutationRate,
                restitution,
                generation,
                birthdate,
                ancestry
            }
        }) => {
            return [
                ballRadius,
                position,
                hue,
                mutationRate,
                restitution,
                generation,
                (birthdate - beginTime),
                (getTime() - birthdate),
                ancestry
            ].join(',');
        })
            .join('\n');
    return `ballRadius,position,hue,mutationRate,restitution,generation,birthdate,age,ancestry
    ${window.theWinners.map(winners => winners.join(',')).join('\n')}
    ${theCurrentlyLivingCsv}`;
}

window.saveToDisk = (filename) => {
    let data = window.lifeStudy();
    let blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')
    a.download = filename || `${sessionId}.csv`;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl =  ['text/csv', a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
}

let minutesTillNextBackup = 1;
let timeout;
function periodicBackup() {
    window.saveToDisk(`${sessionId}.csv`);
    minutesTillNextBackup = Math.min(minutesTillNextBackup * 2, 30);
    timeout = setTimeout(periodicBackup, minutesTillNextBackup * 60 * 1000);
}
timeout = setTimeout(periodicBackup, minutesTillNextBackup * 60 * 1000);

console.log('loaded');

window.setup = () => {
    ({ engine, beginTime } = setup());
    Engine.run(engine);

    colorMode(HSB, 255);
    canvas = createCanvas(windowWidth, windowHeight);
};

window.draw = () => {
    background(255);
    strokeWeight(0);

    translate(width / 2 - plinkoWidth / 2, 0);

    draw({
        drawBall: ({ p, ball }) => {
            const {
                render: { fillStyle, strokeStyle, lineWidth, visible },
                position: { x, y },
                circleRadius,
                isStatic,
                isSensor,
                label
            } = ball;

            const ballAge = (getTime(engine) - ball.birthdate);
            const darkerIfOld = (ballAge > oldAge) ? 0.4 : 1;

            fill([
                fillStyle[0],
                255 * darkerIfOld,
                255 * darkerIfOld
            ]);

            ellipse(x, y, circleRadius * 2);
        },
        drawPeg: ({ p, peg }) => {
            const {
                render: { fillStyle, strokeStyle, lineWidth, visible },
                position: { x, y },
                circleRadius,
                isStatic,
                isSensor,
                label
            } = peg;

            fill(240);

            ellipse(x, y, circleRadius * 2);
        },
        beforeKillBall: (ball) => {
            const { ballRadius, position, hue, mutationRate, restitution, generation, ancestry } = ball.genome;
            const ballAge = (getTime(engine) - ball.birthdate);
            window.theWinners.push([
                ballRadius,
                position,
                hue,
                mutationRate,
                restitution,
                generation,
                ball.birthdate - beginTime,
                ballAge,
                ancestry
            ]);
        }
    });
};

window.windowResized = () => {
    resizeCanvas(windowWidth, windowHeight);
};

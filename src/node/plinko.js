// const heapdump = require('heapdump');

const { join: pathJoin } = require('path');

const { createWriteStream, openSync } = require('fs');

const setupFileStream = function(filename) {
    const fd = openSync(filename, 'wx');
    let writeStream = createWriteStream(undefined, { fd });
    return writeStream;
}


import Matter from 'matter-js/build/matter';
const { Bodies, Body, Engine, Events, Render, World } = Matter;

import plinko from '../plinko';
const { setup, stepLogic, utils: { getTime } } = plinko;

import { uuid } from '../utils';

import {
    theBookOfPlinkoersHeaders, ballToEntry
} from '../logging-utils';


const [ node, file, writeDirPath = './data' ] = process.argv;

const sessionId = uuid(16);

// const theBookFilePath = pathJoin(writeDirPath, `${sessionId}-BoP.csv`);

// console.log(`Writing to ${theBookFilePath}`);

// let writeToTheBook = setupFileStream(theBookFilePath);

// writeToTheBook.write(theBookOfPlinkoersHeaders.join(',')+'\n');

const beforeKillBall = (ball) => {
    const now = getTime(engine);
    // writeToTheBook.write(ballToEntry(ball, now, beginTime).join(',')+'\n');
    console.log(ballToEntry(ball, now, beginTime).join(','));
};

console.log(theBookOfPlinkoersHeaders.join(','));

let { engine, beginTime } = setup({ beforeKillBall });

const stepLogicHandlers = {
    beforeKillBall
};

while (true) {
// setInterval(() => {
    Events.trigger(engine, 'tick', { timestamp: engine.timing.timestamp });
    Engine.update(engine, engine.timing.delta);
    Events.trigger(engine, 'afterTick', { timestamp: engine.timing.timestamp });
    stepLogic(stepLogicHandlers);
// }, 0);
}

// setInterval(() => {
//     heapdump.writeSnapshot('./' + Date.now() + '.heapsnapshot');
// }, 100000);

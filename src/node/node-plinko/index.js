const { join: pathJoin } = require('path');

import { Bodies, Body, Engine, Events, World } from '../../matter-js-exports-shim';

import plinko from '../../plinko';
const { setup, stepLogic, utils: { getTime } } = plinko;

import { uuid } from '../../utils';
import { getNextSafePath } from '../node-utils';

import {
    theBookOfPlinkoersHeaders, ballToEntry
} from '../../logging-utils';

import { setupCsvWriter } from '../logging-utils';

const [ node, file, seed, writeDirPath = './data' ] = process.argv;

const sessionId = seed || uuid({ length: 16 });

const { path: theBookFilePath } = getNextSafePath({
    dirPath: writeDirPath,
    fileName: sessionId,
    extension: 'csv'
});

console.log(`Writing to ${theBookFilePath}`);

let { write: writeToTheBook } = setupCsvWriter(theBookFilePath);

writeToTheBook(theBookOfPlinkoersHeaders);

const beforeKillBall = (ball) => {
    const now = getTime(engine);
    writeToTheBook(ballToEntry(ball, now, beginTime));
};

let { engine, beginTime } = setup({ sessionId, beforeKillBall });

const stepLogicHandlers = {
    beforeKillBall
};

setInterval(() => {
	let i = 1000;
	while (--i > 0) {
	    Events.trigger(engine, 'tick', { timestamp: engine.timing.timestamp });
	    Engine.update(engine, engine.timing.delta);
	    Events.trigger(engine, 'afterTick', { timestamp: engine.timing.timestamp });
	    stepLogic(stepLogicHandlers);
	}
}, 0);

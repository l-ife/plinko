const { join: pathJoin } = require('path');

import { Bodies, Body, Engine, Events, World } from '../../core/utils/matter-js-exports-shim';

import plinko from '../../core/plinko/simulation';
const { setup, stepLogic, utils: { getTime } } = plinko;

import { uuid } from '../../core/utils';
import { getNextSafePath } from '../../node/utils';

import { getGenomeColumnHeaders, getGenomeColumns } from '../../core/plinko/genome';
import { getDataColumnHeaders, getDataColumns, calculateDataFields } from '../../core/plinko/data';

import { BookOfTheDead } from '../../core/utils/logging';
import { setupCsvWriter } from '../../node/utils/logging';

const bookOfTheDead = BookOfTheDead({
    getGenomeColumnHeaders,
    getGenomeColumns,

    getDataColumnHeaders,
    getDataColumns,
    calculateDataFields
});

const [ node, file, seed, writeDirPath = './data' ] = process.argv;

const sessionId = seed || uuid({ length: 16 });

const { path: theBookFilePath } = getNextSafePath({
    dirPath: writeDirPath,
    fileName: sessionId,
    extension: 'csv'
});

console.log(`Writing to ${theBookFilePath}`);

let { write: writeToTheBook } = setupCsvWriter(theBookFilePath);

writeToTheBook(bookOfTheDead.theBookOfPlinkoersHeaders);

const beforeKillBall = (ball) => {
    const now = getTime(engine);
    writeToTheBook(bookOfTheDead.ballToEntry(ball, now, beginTime));
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

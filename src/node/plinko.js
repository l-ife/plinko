const { join: pathJoin } = require('path');

import Matter from 'matter-js/build/matter';
const { Bodies, Body, Engine, Events, Render, World } = Matter;

import plinko from '../plinko';
const { setup, stepLogic, utils: { getTime } } = plinko;

import { uuid } from '../utils';

import {
    theBookOfPlinkoersHeaders, ballToEntry
} from '../logging-utils';

import { setupCsvWriter } from './logging-utils';


const [ node, file, writeDirPath = './data/' ] = process.argv;

const sessionId = uuid(16);

const theBookFilePath = pathJoin(writeDirPath, `${sessionId}-BoP.csv`);

console.log(`Writing to ${theBookFilePath}`);

let { write: writeToTheBook } = setupCsvWriter(theBookFilePath);

writeToTheBook(theBookOfPlinkoersHeaders);

const beforeKillBall = (ball) => {
    const now = getTime(engine);
    writeToTheBook(ballToEntry(ball, now, beginTime));
};

let { engine, beginTime } = setup({ beforeKillBall });

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
import p5 from 'p5';
let pegSize = 14;
let ballRadius = 6;

let plinkoWidth = 750;
let plinkoHeight = 900;
let countX = 10;
let countY = 20;

const oldAge = 75000;

const uuid = (length) => {
    let theReturn = [];
    for (var i = 0; i < length; i++) {
        theReturn.push(String.fromCharCode(parseInt(Math.random() * (127 - 33) + 33)));
    }
    return theReturn.join('');
}

const sessionId = uuid(16);

window.theWinners = [];

window.engine;

window.lifeStudy = () => {
    return `ballRadius,position,hue,mutationRate,restitution,generation,birthdate,age,ancestry
    ${window.theWinners.map(winners => winners.join(',')).join('\n')}
    ${Composite.allBodies(engine.world).filter(body => body.genome !== undefined).map({ genome:
        { ballRadius, position, hue, mutationRate, restitution, generation, birthdate, ancestry } } =>
        [ ballRadius, position, hue, mutationRate, restitution, generation, (birthdate - window.beginTime), (window.getTime() - birthdate), ancestry ].join(','))
            .join('\n')}`;
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

import Matter from 'matter-js/build/matter';
const { Bodies, Body, Composite, Engine, Events, Render, World } = Matter;

// add plinko sensors
// create genome:
//  {
//      drop: {
//          position: [calcers],
//  calcers = [
//      uniform(start, end),
//      normal(mean, variance),
//      exact(x),
//      roundTo(notch)
//  ]

const sketch = (p) => {
    let canvas;

    p.setup = () => {
        p.colorMode(p.HSB, 255);

        console.log('setting up');
        window.engine = Engine.create();
        window.getTime = () => engine.timing.timestamp;
        window.beginTime = window.getTime();
        Engine.run(engine);

        canvas = p.createCanvas(p.windowWidth, p.windowHeight);

        let offsetX = 0.5 / countX * plinkoWidth;
        let offsetY = 0.5 / countY * plinkoHeight + 50;

        for(let y = 0; y < countY; y++) {
            for(let x = 0; x < countX - y % 2 ? -1 : 0; x++) {
                addCircle({
                    x: x / countX * plinkoWidth + offsetX * (!(y % 2) ? 1 : 2),
                    y: y / countY * plinkoHeight * (2 / 3) + offsetY,
                    r: pegSize,
                    options: {
                        isStatic: true,
                        label: 'peg'
                    }
                });
            }
        }
        // for(let x = 0; x < countX; x++) {
        //     const aWidth = (1 / countX) * plinkoWidth;
        //     let body = Bodies.rectangle(
        //         (x * aWidth) + (0.5*aWidth),
        //         plinkoHeight * (2 / 3) + offsetY,
        //         pegSize * 4,
        //         pegSize,
        //         {
        //             isStatic: true,
        //             // isSensor: true,
        //             fillStyle: [100,0,0],
        //             label: 'sensor'
        //         }
        //     );
        //     addBody(body);
        // }
    }

    function addBody(...bodies) {
        World.add(engine.world, ...bodies);
    }

    function removeBody(...bodies) {
        World.remove(engine.world, ...bodies);
    }

    function addCircle({ x = 0, y = 0, r = 10, options = {} } = {}) {
        let body = Bodies.circle(x, y, r, options)
        addBody(body);
        return body;
    }

    function bounds(min, max) {
        return number => Math.min(Math.max(number, min), max);
    }

    function mutate({ parentValue, bounds, magnitude, rate, defaultVal }) {
        if (parentValue === undefined) {
            return defaultVal;
        }

        const mutation = (
            (p.random(magnitude * 2) - magnitude) * rate
        );

        return bounds(parentValue + mutation);
    }

    function spawnBall(parent = { genome: {} }) {
        const ballAge = (parent.birthdate && (window.getTime() - parent.birthdate)) || 0;
        if (parent.genome.hue) {
            const { ballRadius, position, hue, mutationRate, restitution, generation, ancestry } = parent.genome;
            window.theWinners.push([
                ballRadius, position, hue, mutationRate, restitution, generation, parent.birthdate - window.beginTime, ballAge, ancestry
            ]);
        }
        const ancestry = parent.genome.ancestry || uuid(4);
        const mutationRate = mutate({
            parentValue: parent.genome.mutationRate,
            bounds: bounds(0, 1),
            magnitude: 0.01,
            rate: 1,
            defaultVal: 1
        });
        // TODO: position max
        // TODO: position min
        // TODO: make these objects an array and loop over and pass in parent.genome
        const thePosition = mutate({
            parentValue: parent.genome.position,
            bounds: bounds(-0.1, 1.1),
            magnitude: 0.1,
            rate: mutationRate,
            defaultVal: p.random(0.1, 0.9)
        });
        const theBallRadius = mutate({
            parentValue: parent.genome.ballRadius,
            bounds: bounds(0.01, 24),
            magnitude: 0.5,
            rate: mutationRate,
            defaultVal: ballRadius
        });
        const theHue = mutate({
            parentValue: parent.genome.hue,
            bounds: bounds(0, 255),
            magnitude: 2,
            rate: mutationRate,
            defaultVal: p.random(255)
        });
        const theRestitution = mutate({
            parentValue: parent.genome.restitution,
            bounds: bounds(0, 1),
            magnitude: 0.05,
            rate: mutationRate,
            defaultVal: 0.75
        });
        const theGeneration = (parent.genome.generation + 1) || 0;
        addCircle({
            x: plinkoWidth * thePosition,
            y: -10,
            r: theBallRadius,
            options: {
                genome: {
                    ballRadius: theBallRadius,
                    position: thePosition,
                    hue: theHue,
                    mutationRate: mutationRate,
                    restitution: theRestitution,
                    generation: theGeneration
                },
                birthdate: window.getTime(),
                restitution: theRestitution,
                // torque: random(-0.05, 0.05),
                label: 'ball',
                render: {
                    lineWidth: theGeneration/8,
                    fillStyle: [
                        theHue,
                        255,
                        255
                    ]
                }
            }
        });

    }

    p.draw = () => {
        p.background(255);
        p.strokeWeight(0);

        p.translate(p.width / 2 - plinkoWidth / 2, 0);

        let bodies = Composite.allBodies(engine.world);

        if(bodies.length < 250 && !(p.frameCount % 20)) {
            spawnBall();
        }

        const now = window.getTime();

        bodies.forEach((n, i) => {
            const {
                render: {fillStyle, strokeStyle, lineWidth, visible},
                position: {x, y},
                circleRadius,
                isStatic,
                isSensor,
                label
            } = n;
            if(!visible) {
                return;
            }
            let ballAge;
            if (label === 'ball') {
                ballAge = (now - n.birthdate);
                function ballAgeSurvivalFactor() {
                    const ageFactor = (ballAge/oldAge);
                    return (p.random(0.5) + (ageFactor - 1.5));
                }
                if (bodies.length > 1000 && ballAgeSurvivalFactor() > 0.90) {
                    removeBody(n);
                    return;
                }

                if (y > p.height * 1.3) {
                    removeBody(n);
                    spawnBall(n);
                    const fallSplitFactor = ballAgeSurvivalFactor();
                    if (fallSplitFactor > 0.99) {
                        spawnBall(n);
                    }
                } else if (ballAge > oldAge && p.random(1) > 0.99995 && ballAgeSurvivalFactor() > 0.85) {
                    spawnBall(n);
                } else {
                    const darkerIfOld = (ballAge > oldAge) ? 0.4 : 1;
                    p.fill([
                        fillStyle[0],
                        255 * darkerIfOld,
                        255 * darkerIfOld
                    ]);

                    p.ellipse(x, y, circleRadius * 2);
                }
            } else if (label === 'sensor') {
                p.fill(0);
                p.beginShape();
                n.vertices.forEach(({x, y}) => {
                    p.vertex(x, y);
                })
                p.endShape(p.CLOSE);
            } else {
                p.fill(255);
            }
        });
    }
};

const theSketch = new p5(sketch, 'body');

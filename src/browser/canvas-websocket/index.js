let rates = [null, 2, 1, 0.5, 0.25, 0.125, 0.0625, 0.03125, 0.015625, 3, 4, 6, 8, 16];
let rate = rates[0];
let ports = [8080, 8081, 8082, 8083, 8084, 8085, 8086];
let port = ports[0];

let timeout;

const updateState = state => {
    document.getElementById('state').innerHTML = (state ? 'Connected' : 'Failed');
}

let wss = {};
const getWsConnection = () => {
    return new Promise((resolve, reject) => {
        if (wss[port]) {
            updateState(true);
            return resolve(wss[port]);
        }
        updateState(false);
        wss[port] = new WebSocket(`ws://localhost:${port}`);
        Object.assign(wss[port], {
            onopen() { resolve(wss[port]); updateState(true); },
            onclose() { reject('websocket closed', wss[port]); updateState(false); },
            onerror(err) { reject(err); updateState(false); },
            onmessage({ data, type }) {
                if (type === 'message') document.querySelector('img').setAttribute('src', data);
            },
        });
    });
}

const poll = (ws) => { ws.send(1); }

const pollAndLoop = (ws) => {
    if (timeout) clearTimeout(timeout);
    const loop = () => {
        poll(ws);
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(loop, 1000/rate);
    };
    loop();
};

const updateLoop = () =>
    getWsConnection()
        .then(ws => {
            if (rate !== null) {
                pollAndLoop(ws);
            } else {
                poll(ws);
            }
        });

const addOption = (selector, value) => {
    const option = document.createElement('option');
    option.setAttribute('value', value);
    option.innerHTML = value;
    selector.appendChild(option);
}

let rateSelector = document.getElementById('rate');
rates.forEach(rate => addOption(rateSelector, rate));
let portSelector = document.getElementById('port');
ports.forEach(port => addOption(portSelector, port));
let requestFrameButton = document.getElementById('requestFrame');

rateSelector.onchange = function() {
    rate = parseFloat(this.value || this.options[this.selectedIndex].value);
    updateLoop();
};
portSelector.onchange = function() {
    port = parseInt(this.value || this.options[this.selectedIndex].value);
    updateLoop();
}
requestFrameButton.onclick = function() {
    getWsConnection().then(poll);
}

updateLoop();

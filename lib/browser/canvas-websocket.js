document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35733/livereload.js?snipver=1"></' + 'script>');
(function () {
'use strict';

var rates = [2, 1, 0.5, 0.25, 0.125, 0.0625, 0.03125, 0.015625, 3, 4, 6, 8, 16];
var rate = rates[0];
var ports = [8080, 8081, 8082, 8083, 8084, 8085, 8086];
var port = ports[0];

var timeout = void 0;
var ws = void 0;

var updateState = function updateState(state) {
    document.getElementById('state').innerHTML = state ? 'Connected' : 'Failed';
};

var pollAndLoop = function pollAndLoop() {
    if (timeout) clearTimeout(timeout);
    ws = new WebSocket('ws://localhost:' + port);
    Object.assign(ws, {
        onopen: function onopen() {
            updateState(true);
            var loop = function loop() {
                ws.send(1);
                if (timeout) clearTimeout(timeout);
                timeout = setTimeout(loop, 1000 / rate);
            };
            loop();
        },
        onclose: function onclose() {
            console.log('closed');updateState(false);
        },
        onerror: function onerror(err) {
            console.error('error', err);updateState(false);
        },
        onmessage: function onmessage(_ref) {
            var data = _ref.data,
                type = _ref.type;

            if (type === 'message') document.querySelector('img').setAttribute('src', data);
        }
    });
};

var addOption = function addOption(selector, value) {
    var option = document.createElement('option');
    option.setAttribute('value', value);
    option.innerHTML = value;
    selector.appendChild(option);
};

var rateSelector = document.getElementById('rate');
rates.forEach(function (rate) {
    return addOption(rateSelector, rate);
});
var portSelector = document.getElementById('port');
ports.forEach(function (port) {
    return addOption(portSelector, port);
});

rateSelector.onchange = function () {
    rate = parseFloat(this.value || this.options[this.selectedIndex].value);
    pollAndLoop();
};
portSelector.onchange = function () {
    port = parseInt(this.value || this.options[this.selectedIndex].value);
    pollAndLoop();
};

pollAndLoop();

}());
//# sourceMappingURL=canvas-websocket.js.map

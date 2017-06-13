const ws = new WebSocket('ws://localhost:8080');

let rate = 60;

const startLoop = (ws) => {
    const loop = () => {
        ws.send(1);
        setTimeout(loop, 1000/rate);
    };
    loop();
};

Object.assign(ws, {
    onopen() {
        startLoop(ws);
    },
    onclose() {
        console.log('closed');
    },
    onerror() {
        console.log('error');
    },
    onmessage({ data, type }) {
        if (type === 'message') {
            var i = document.querySelector('img');
            i.setAttribute('src', data);
        }
    }
});

document.onmousemove = ({ clientY }) => {
    rate = parseInt((clientY / window.innerHeight) * 120 + 1);
    document.getElementById('rate').innerHTML = rate;
}

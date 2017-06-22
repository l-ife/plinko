const { fork, spawn } = require('child_process');

export function setupCsvWriter (filepath) {
    let child = spawn('node', ['./lib/node/child-logger.js'], { detached: true, env: { filepath }});
    child.unref();

    return {
        write(row) {
            const buf = Buffer.allocUnsafe(4);
            buf.writeFloatBE(row[0], 0);
            child.stdin.write(buf);
        }
    };
};

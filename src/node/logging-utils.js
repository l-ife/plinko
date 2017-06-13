const { createWriteStream } = require('fs');

export const setupFileStream = (filename) => {
    const writableStream = createWriteStream(filename);

    return row => {
        writableStream.write(`${row}\n`);
    }
}

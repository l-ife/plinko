const { createWriteStream } = require('fs');
const { Readable } = require('stream');

let writeStream = createWriteStream(process.env.filepath);
let readStream = Readable();
readStream._read = () => {}; // necessary in some versions of node
readStream.pipe(writeStream);

// process.on('message', ({ row }) => {
//     readStream.push(`${row.join(',')}\n`);
// });

process.stdin.on('data', function(buf) {
    readStream.write(buf.readFloatBE(0));
});

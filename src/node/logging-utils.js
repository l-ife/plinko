const { createWriteStream } = require('fs');
const { Readable } = require('stream');

export function setupCsvWriter (filepath) {
	let writeStream = createWriteStream(filepath);

	return {
		write(row) {
		    writeStream.write(`${row.join(',')}\n`);
		}
	};
}
const { createWriteStream } = require('fs');

export function setupCsvWriter (filepath) {
	let writeStream = createWriteStream(filepath);

	return {
		write(row) {
		    writeStream.write(`${row.join(',')}\n`);
		}
	};
}

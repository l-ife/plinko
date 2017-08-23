let disposeOfPrevious = {};
export const saveToDisk = (string, { filetype = 'csv', filename, passedInMimetype } = {}) => {
    disposeOfPrevious[filename] && disposeOfPrevious[filename]();
    const mimetype = passedInMimetype || `text/${filetype}`;
    let blob = new Blob([string], {type: mimetype}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')
    a.download = `${filename}.${filetype}`;
    let url = window.URL.createObjectURL(blob);
    blob = null;
    a.href = url;
    disposeOfPrevious[filename] = () => window.URL.revokeObjectURL(url);
    a.dataset.downloadurl =  [mimetype, a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
};

export const startPeriodicCsvBackup = (filename, stringGeneratorFunction, maxBackupRate = 30) => {
    let minutesTillNextBackup = 4;
    let csvTimer;
    function periodicBackup() {
        saveToDisk(stringGeneratorFunction(), { filename });
        minutesTillNextBackup = Math.min(minutesTillNextBackup * 2, maxBackupRate);
        csvTimer = setTimeout(periodicBackup, minutesTillNextBackup * 60 * 1000);
    }
    csvTimer = setTimeout(periodicBackup, minutesTillNextBackup * 60 * 1000);
};

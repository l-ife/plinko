import fs from 'fs';

export const getNextSafePath = ({ dirPath, fileName, extension }) => {
    let justName = fileName;
    let path = `${dirPath}/${justName}.${extension}`;
    let int = 0;
    while(fs.existsSync(path)) {
        justName = `${fileName}(${int++})`;
        path = `${dirPath}/${justName}.${extension}`;
    }
    return { path, justName };
};

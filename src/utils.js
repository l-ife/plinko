const makeValidCharMap = () => {
    const ranges = [[48, 57], [65, 90], [97,122]];
    const theMap = ranges.reduce((acc, [min, max]) => {
        let pointer = min;
        while(pointer <= max) {
            acc.push(pointer);
            pointer++;
        }
        return acc;
    }, []);
    return theMap;
}

const charMap = makeValidCharMap();

export const uuid = (length) => {
    let theReturn = [];
    for (var i = 0; i < length; i++) {
        const num = Math.floor(Math.random() * charMap.length);
        theReturn.push(String.fromCharCode(charMap[num]));
    }
    return theReturn.join('');
};

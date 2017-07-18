export const getUrlArguments = () => {
    const queryString = location.search.substr(1);
    var result = {};
    queryString.split("&").forEach(part => {
        const [ key, value ] = part.split("=");
        result[key] = decodeURIComponent(value);
    });
    return result;
};

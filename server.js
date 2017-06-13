const express = require('express');
const staticServer = express();

staticServer.use(express.static('.'));

staticServer.listen(3000, function() {
    console.log('Listening on 3000');
});

/* jshint node: true */
/* global process */

var http = require('http');

var sd = require('../index.js');

sd.notifyStatus('starting');

var server = http.createServer(function (req, res) {
    console.log(req.method, req.url);
    if (req.url === '/block') {
        var i = 1;
        while (i > 0) i++;

    } else {
        res.end('Hello\n');
    }
});

server.listen(8089, function (error) {
    if (error) {
        console.error('listen', error);
        process.exit(1);

    } else {
        sd.startWatchdogPing();
        sd.notifyReady();
        sd.notifyStatus('running');
    }
});

process.on('SIGTERM', function () {
    console.log("Stopping");
    sd.notifyStatus('stopping');
    
    server.close();
    
    sd.stopWatchdogPing();
});

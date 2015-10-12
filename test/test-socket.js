/* jshint node: true */
/* global process */

var http = require('http');

var sd = require('../index.js');

sd.notify('STATUS=starting');

var server = http.createServer(function (req, res) {
    console.log(req.method, req.url);
    res.end('Hello\n');
});

var listeners = sd.listeners();
console.log(listeners);

var sock = listeners.length > 0? listeners[0]: 8088;

server.listen(sock, function (error) {
    if (error) {
        console.error('Listen error: %j', error);

    } else {
        console.log('Running in %s mode', sock.fd? 'socket-activate': 'standalone');
        console.log('Listen: %j', server.address());
        sd.notify('READY=1\nSTATUS=running');
    }
});

process.on('SIGTERM', function () {
    console.log('Stopping');
    server.close();
    sd.notify('READY=0\nSTATUS=stopping');
});

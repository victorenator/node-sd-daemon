/* jshint node: true */
/* global process */

var http = require('http');

var instance = process.argv[2];

var server = http.createServer(function (req, res) {
    console.log(req.method, req.url);
    res.end('Hello ' + instance + '\n');
});

server.listen({fd: 3}, function (error) {
    if (error) {
        console.error('Listen error: %j', error);

    } else {
        console.log('Listen: %j', server.address());
    }
});

process.on('SIGTERM', function () {
    server.close();
});

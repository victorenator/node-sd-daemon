var http = require('http');

var sd = require('../index.js');

sd.notify('STATUS=starting');

var timer;
var server = http.createServer(function(req, res) {
    console.log(req.method, req.url);
    res.end('Hello\n');
});

var sock = sd.listen_fds() > 0? {fd: sd.LISTEN_FDS_START}: 8088;

server.listen(sock, function(error) {
    if (error) {
        console.error('listen', error);

    } else {
        console.log("Running in %s mode", sock.fd? 'socket-activate': 'standalone');
        sd.notify('READY=1\nSTATUS=running');
    }
});


process.on('SIGTERM', function() {
    console.log("Stopping");
    clearInterval(timer);
    server.close();
    sd.notify('READY=0\nSTATUS=stopping');
});

import {createServer} from 'node:http';

import {listeners as sdListeners, notify} from '../index.js';

notify('STATUS=starting');

const server = createServer((req, res) => {
    console.log(req.method, req.url);
    res.end('Hello\n');
});

const listeners = sdListeners();
console.log(listeners);

const sock = listeners.length > 0? listeners[0]: 8088;

server.listen(sock, error => {
    if (error) {
        console.error('Listen error: %j', error);

    } else {
        console.log('Running in %s mode', sock['fd']? 'socket-activate': 'standalone');
        console.log('Listen: %j', server.address());
        notify('READY=1\nSTATUS=running');
    }
});

process.on('SIGTERM', () => {
    console.log('Stopping');
    server.close();
    notify('READY=0\nSTATUS=stopping');
});

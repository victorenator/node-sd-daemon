import {createServer} from 'node:http';

import {notifyReady, notifyStatus, startWatchdogPing, stopWatchdogPing} from '../index.js';

notifyStatus('starting');

const server = createServer((req, res) => {
    console.log(req.method, req.url);
    if (req.url === '/block') {
        var i = 1;
        while (i > 0) i++;

    } else {
        res.end('Hello\n');
    }
});

server.listen(8089, error => {
    if (error) {
        console.error('listen', error);
        process.exit(1);

    } else {
        startWatchdogPing();
        notifyReady();
        notifyStatus('running');
    }
});

process.on('SIGTERM', function () {
    console.log('Stopping');
    notifyStatus('stopping');
    
    server.close();
    
    stopWatchdogPing();
});

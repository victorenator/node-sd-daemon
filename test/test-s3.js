import {createServer} from 'node:http';

const instance = process.argv[2];

const server = createServer((req, res) => {
    console.log(req.method, req.url);
    res.end('Hello ' + instance + '\n');
});

server.listen({fd: 3}, error => {
    if (error) {
        console.error('Listen error: %j', error);

    } else {
        console.log('Listen: %j', server.address());
    }
});

process.on('SIGTERM', () => {
    server.close();
});

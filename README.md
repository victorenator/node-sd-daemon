# Bindings for libsystemd-daemon #

## Dependencies ##
* pkg-config
* libsystemd-dev or libsystemd-daemon-dev
* node-nan

## Install ##
```bash
npm install sd-daemon
```

### On Debian ###
```bash
sudo apt-get install devscripts
sudo mk-build-deps -ir
debuild
sudo dpkg -i ../node-sd-daemon_*.deb
```

## Test ##

### Watchdog ###

test.service:
```ini
...
[Service]
WatchdogSec=10s
```

test.js:
```javascript
...
sd.startWatchdogPing();
```

```bash
systemctl --user link "$PWD/test/test.service"
systemctl --user start test.service

curl localhost:8089
systemctl --user status test.service
curl localhost:8089/block

...
systemctl --user status test.service

systemctl --user stop test.service
systemctl --user disable test.service
```

### Socket Activation ###

test-socket.socket:
```ini
...
[Socket]
ListenStream=8088
```

test-socket.service:
```ini
...
[Service]
ExecStart=/usr/bin/nodejs test-socket.js
NonBlocking=yes
```

test-socket.js:
```javascript
var listeners = sd.listeners();
if (listeners.length) {
    server.listen({fd: listeners[0]});
}
```

```bash
systemctl --user link "$PWD/test/test-socket.socket" "$PWD/test/test-socket.service"
systemctl --user start test-socket.socket

curl localhost:8088
systemctl --user status test-socket.service
...

systemctl --user stop test-socket.socket test-socket.service
systemctl --user disable test-socket.socket
```

### Cluster (two instances) ###

test-s3@.service
```ini
[Service]
ExecStart=/usr/bin/nodejs test-s3.js %i
NonBlocking=yes
Sockets=test-s3.socket
```

test-s3.socket:
```ini
[Socket]
ListenStream=8087
Service=test-s3@1.service
Service=test-s3@2.service
```

```bash
systemctl --user link "$PWD/test/test-s3@.service" "$PWD/test/test-s3.socket"
systemctl --user start test-s3@1.service test-s3@2.service

curl localhost:8087
curl localhost:8087
curl localhost:8087
curl localhost:8087

systemctl --user stop test-s3@1.service test-s3@2.service test-s3.socket
systemctl --user disable test-s3@.service test-s3.socket
```

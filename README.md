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
```bash
systemctl --user link "$PWD/test/test.service"
systemctl --user start test.service

curl localhost:8089
systemctl --user status test.service
curl localhost:8089/block
....
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
....

systemctl --user stop test-socket.socket test-socket.service
systemctl --user disable test-socket.socket
```

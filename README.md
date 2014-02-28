# Bindings for libsystemd-daemon #

## Dependencies ##
* pkg-config
* libsystemd-daemon-dev

## Install ##
```
npm install sd-daemon
```

### On Debian ###
```
sudo apt-get install devscripts
sudo mk-build-deps -ir
debuild
sudo dpkg -i ../node-sd-daemon_*.deb
```

## Test ##

### Watchdog ###
```
sudo systemctl start user@vic.service
systemctl --user link "$PWD/test/test.service"
systemctl --user start test.service

curl localhost:8089
systemctl --user status test.service
curl localhost:8089/block
....
systemctl --user status test.service

systemctl --user stop test.service
systemctl --user disable test.service
sudo systemctl stop user@vic.service
```

### Socket Activation ###
```
sudo systemctl start user@vic.service
systemctl --user link "$PWD/test/test.socket"
systemctl --user start test.socket

curl localhost:8088
systemctl --user status test.service
....

systemctl --user stop test.socket
systemctl --user disable test.socket
sudo systemctl stop user@vic.service
```

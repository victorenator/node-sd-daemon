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
sudo systemctl start user@$(id -u).service
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
```
sudo systemctl start user@$(id -u).service
systemctl --user link "$PWD/test/test-sa.socket"
systemctl --user start test-sa.socket

curl localhost:8088
systemctl --user status test-sa.service
....

systemctl --user stop test-sa.socket
systemctl --user disable test-sa.socket
```

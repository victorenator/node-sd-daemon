# Bindings for libsystemd-daemon #

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
```
sudo systemctl start user@vic.service
systemctl --user link "$PWD/test/test.service"
systemctl --user start test.service
....

systemctl --user stop test.service
systemctl --user disable test.service
sudo systemctl stop user@vic.service
```

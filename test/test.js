var sd = require('../index.js');

sd.notify('STATUS=starting');

var timer = setInterval(function() {
    sd.notify('WATCHDOG=1');
}, 1000);

process.on('SIGTERM', function() {
    sd.notify('STATUS=stopping');
    clearInterval(timer);
});

sd.notify('STATUS=running');

var binding = require('./daemon');

var watchdog = null;

exports.booted = binding.booted;
exports.notify = binding.notify;
exports.LISTEN_FDS_START = binding.LISTEN_FDS_START;

exports.listen_fds = function() {
    return process.env['LISTEN_FDS'] || 0;
};

exports.notifyReady = function() {
    exports.notify('READY=1');
};

exports.notifyStatus = function(status) {
    exports.notify('STATUS=' + status);
};

exports.notifyWatchdog = function() {
    exports.notify('WATCHDOG=1');
};

exports.watchdogUsec = function() {
    return parseInt(process.env['WATCHDOG_USEC']) || null;
};

/**
 * Starts the watchdog ping if the watchdog enabled (WatchdogSec)
 * @param {number} k
 */
exports.startWatchdogPing = function(k) {
    if (watchdog) return;
        
    var timeout = exports.watchdogUsec();
    
    if (!timeout) return;
    
    if (!(k > 0 && k < 1)) k = 0.5;
    
    timeout = Math.round(timeout * k / 1000);
    
    watchdog = setInterval(function() {
        exports.notifyWatchdog();
    }, timeout);
};

exports.stopWatchdogPing = function() {
    if (watchdog) {
        clearInterval(watchdog);
        watchdog = null;
    }
};


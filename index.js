/* jshint node: true */
/* global exports, process */

var util = require('util');

var binding = require('./daemon');

var watchdog = null;

exports.booted = binding.booted;
exports.LISTEN_FDS_START = binding.LISTEN_FDS_START;

exports.listen_fds = function () {
    return Number(process.env.LISTEN_FDS) || 0;
};

exports.listeners = function () {
    var count = Number(process.env.LISTEN_FDS) || 0;
    var fdNames = (process.env.LISTEN_FDNAMES || '').split(':');
    var arr = new Array(count);
    for (var i = 0; i < count; i++) {
        arr[i] = {
            fd: binding.LISTEN_FDS_START + i
        };
        if (fdNames[i]) {
            arr[i].name = fdNames[i];
        }
    }
    return arr;
};

exports.notify = function () {
    return binding.notify(util.format.apply(util, arguments));
};

exports.notifyReady = function () {
    return exports.notify('READY=1');
};

exports.notifyReloading = function () {
    return exports.notify('RELOADING=1');
};

exports.notifyStatus = function (status) {
    return exports.notify('STATUS=%s', status);
};

exports.notifyStopping = function () {
    return exports.notify('STOPPING=1');
};

exports.notifyWatchdog = function () {
    return exports.notify('WATCHDOG=1');
};

exports.watchdog_enabled = function () {
    var usec = Number(process.env.WATCHDOG_USEC);
    var pid = Number(process.env.WATCHDOG_PID);
    return usec > 0 && (!pid || pid === process.pid)? usec: 0;
};

exports.watchdogUsec = function () {
    return Number(process.env.WATCHDOG_USEC) || null;
};

/**
 * Starts the watchdog ping if the watchdog enabled (WatchdogSec)
 * @param {number} k
 */
exports.startWatchdogPing = function (k) {
    if (watchdog) {
       return;
    }

    var usec = exports.watchdogUsec();

    if (!usec) {
        return;
    }

    if (!(k > 0 && k < 1)) {
        k = 0.5;
    }

    var timeout = Math.round(usec * k / 1000);

    watchdog = setInterval(function () {
        exports.notifyWatchdog();
    }, timeout);
};

exports.stopWatchdogPing = function () {
    if (watchdog) {
        clearInterval(watchdog);
        watchdog = null;
    }
};

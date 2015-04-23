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
    var arr = new Array(count);
    for (var i = 0; i < count; i++) {
        arr[i] = binding.LISTEN_FDS_START + i;
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

exports.watchdogUsec = function () {
    return parseInt(process.env['WATCHDOG_USEC'], 10) || null;
};

/**
 * Starts the watchdog ping if the watchdog enabled (WatchdogSec)
 * @param {number} k
 */
exports.startWatchdogPing = function (k) {
    if (watchdog) return;

    var timeout = exports.watchdogUsec();

    if (!timeout) return;

    if (!(k > 0 && k < 1)) k = 0.5;

    timeout = Math.round(timeout * k / 1000);

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

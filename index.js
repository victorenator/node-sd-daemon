import {format} from 'node:util';
import {setInterval} from 'node:timers';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);

// @ts-ignore
const binding = require('./daemon.node');

let watchdog = null;

/** @type {number} */
export const LISTEN_FDS_START = binding.LISTEN_FDS_START;

/**
 * @returns {0|1}
 */
export function booted() {
    return binding.booted();
}

export function listenFDs() {
    return Number(process.env.LISTEN_FDS ?? 0);
}

/**
 * @typedef {object} Listener
 * @property {number} fd
 * @property {string} [name]
 */

export function listeners() {
    const count = Number(process.env.LISTEN_FDS ?? 0);
    const fdNames = (process.env.LISTEN_FDNAMES || '').split(':');
    /** @type {Listener[]} */
    const arr = new Array(count);
    for (let i = 0; i < count; i++) {
        arr[i] = {
            fd: binding.LISTEN_FDS_START + i
        };
        if (fdNames[i]) {
            arr[i].name = fdNames[i];
        }
    }
    return arr;
}

/**
 * @param  {... string} args 
 * @returns 
 */
export function notify(... args) {
    return binding.notify(format(... args));
}

export function notifyReady() {
    return exports.notify('READY=1');
}

export function notifyReloading() {
    return exports.notify('RELOADING=1');
}

/**
 * @param {string} status 
 * @returns 
 */
export function notifyStatus(status) {
    return exports.notify('STATUS=%s', status);
}

export function notifyStopping() {
    return exports.notify('STOPPING=1');
}

export function notifyWatchdog() {
    return exports.notify('WATCHDOG=1');
}

export function watchdogEnabled() {
    const usec = Number(process.env.WATCHDOG_USEC);
    const pid = Number(process.env.WATCHDOG_PID);
    return usec > 0 && (!pid || pid === process.pid)? usec: 0;
}

export function watchdogUsec() {
    return Number(process.env.WATCHDOG_USEC) || null;
}

/**
 * Starts the watchdog ping if the watchdog enabled (WatchdogSec)
 * @param {number} [k]
 */
export function startWatchdogPing(k = 0.5) {
    if (watchdog) {
       return;
    }

    const usec = exports.watchdogUsec();

    if (!usec) {
        return;
    }

    if (!(k > 0 && k < 1)) {
        k = 0.5;
    }

    const timeout = Math.round(usec * k / 1000);

    watchdog = setInterval(() => {
        notifyWatchdog();
    }, timeout);
}

export function stopWatchdogPing() {
    if (watchdog) {
        clearInterval(watchdog);
        watchdog = null;
    }
}

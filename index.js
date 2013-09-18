var binding = require('./build/Release/daemon.node');

exports.booted = binding.booted;
exports.notify = binding.notify;
exports.LISTEN_FDS_START = binding.LISTEN_FDS_START;

exports.listen_fds = function() {
    return process.env['LISTEN_FDS'] || 0;
};



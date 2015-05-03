var Writable = require('stream').Writable;

module.exports = {
    stringWriter: stringWriter
};

function stringWriter(handler) {
    var ws = Writable();
    var chunks;

    ws._write = function (chunk, enc, next) {
        chunks.push(chunk);
        next();
    };
    ws.on('pipe', function() {
        chunks = [];
    });
    ws.on('finish', function() {
        var str = Buffer.concat(chunks).toString('utf8');
        handler(str);
    });

    return ws;
}

var browserify = require('browserify');
var stringWriter = require('./helpers').stringWriter;

describe('browserfiy should make bundle b', function() {
    var bundles = {};
    var error;

    function makeBundle(b, done, handler) {
        b.bundle().on('error', function(e) {
            error = e.message || e;
            done();
        }).pipe(stringWriter(function(str) {
            handler(str);
            done();
        }));
    }

    afterEach(function() {
        expect(error).not.toBeDefined();

        // bundle b should contain only b.js
        expect(bundles.b).not.toContain('aaaFunc');
        expect(bundles.b).toContain('bbbFunc');
    });

    it('without browserify-shim', function(done) {
        var b = browserify();

        b.add('b');

        // exclude a.js from bundle b
        b.external('a');

        makeBundle(b, done, function(str) {
            bundles.b = str;
        });
    });

    it('with browserify-shim', function(done) {
        var b = browserify();

        b.add('b');

        // exclude a.js from bundle b
        b.external('a');

        // shim b.js
        b.transform('browserify-shim', {
            global: true
        });

        makeBundle(b, done, function(str) {
            bundles.b = str;
        });
    });
});

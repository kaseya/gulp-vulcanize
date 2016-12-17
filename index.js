'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var Vulcanize = require('vulcanize');

module.exports = function (opts) {
    opts = opts || {};

    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new gutil.PluginError('gulp-vulcanize', 'Streaming not supported'));
            return;
        }

        //if abspath was set, strip it from the src file path, lest it get applied twice
        var filePath = file.path;
        if (typeof opts.abspath !== 'undefined' && opts.abspath.length > 0) {
            var pathIdx = filePath.indexOf(opts.abspath);
            if (pathIdx >= 0) {
              filePath = filePath.substr(pathIdx + opts.abspath.length);
            }
        }

        (new Vulcanize(opts)).process(filePath, function (err, inlinedHtml) {
            if (err) {
                cb(new gutil.PluginError('gulp-vulcanize', err, {fileName: file.path}));
                return;
            }

            file.contents = new Buffer(inlinedHtml);
            cb(null, file);
        });
    });
};

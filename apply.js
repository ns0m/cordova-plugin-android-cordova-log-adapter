var PLUGIN_NAME = 'cordova-plugin-android-cordova-log-adapter';
var SRC_PATH = './platforms/android/app/src/main';
var TARGET_FILE_REGEX = /\.java/;

var LOG_MAPPINGS = {
    'android.util.Log': 'org.apache.cordova.LOG',
    'Log.v': 'LOG.v',
    'Log.d': 'LOG.d',
    'Log.i': 'LOG.i',
    'Log.w': 'LOG.w',
    'Log.e': 'LOG.e'
};

var deferred, fs, path, perf_hooks, recursiveDir;

function log(message) {
    console.log(PLUGIN_NAME + ': ' + message);
}

function onFatalException(ex) {
    log('EXCEPTION: ' + ex.toString());
    deferred.resolve(); // resolve instead of reject so build doesn't fail
}

function run() {
    try {
        fs = require('fs');
        path = require('path');
        recursiveDir = require('recursive-readdir');
        perf_hooks = require('perf_hooks');
    } catch (e) {
        throw('Failed to load dependencies: ' + e.toString());
    }

    var startTime = perf_hooks.performance.now();

    // Replace class/method names in source code
    recursiveDir(SRC_PATH, [function (file, stats) {
        if (stats.isDirectory()) {
            return false;
        }
        return !file.match(TARGET_FILE_REGEX);
    }], attempt(function (err, files) {
        if (err) throw err;

        for (var filePath of files) {
            var fileContents = fs.readFileSync(filePath).toString();
            if (matchLog(fileContents, Object.keys(LOG_MAPPINGS)[0])) {
                for (var logMappingKey in LOG_MAPPINGS) {
                    fileContents = replaceLog(fileContents, logMappingKey, LOG_MAPPINGS[logMappingKey]);
                }
                fs.writeFileSync(filePath, fileContents, 'utf8');
            }
        }
        log('Processed ' + files.length + ' source files in ' + parseInt(perf_hooks.performance.now() - startTime) + 'ms');
        deferred.resolve();
    }));
}

function matchLog(target, value) {
    value = '(?:' + sanitiseForRegExp(value) + ')([^a-zA-Z0-9]+)';
    return target.match(new RegExp(value, 'g'));
}

function replaceLog(target, oldValue, newValue) {
    oldValue = '(?:' + sanitiseForRegExp(oldValue) + ')([^a-zA-Z0-9]+)';
    return target.replace(new RegExp(oldValue, 'g'), newValue + '$1');
}

function sanitiseForRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

function attempt(fn) {
    return function () {
        try {
            fn.apply(this, arguments);
        } catch (e) {
            onFatalException(e);
        }
    }
}

module.exports = function (ctx) {
    try {
        deferred = require('q').defer();
    } catch (e) {
        e.message = 'Unable to load node module dependency \'q\': ' + e.message;
        onFatalException(e);
        throw e;
    }
    attempt(run)();
    return deferred.promise;
};

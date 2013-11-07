  var util = require('util');

  global.GAIA_DIR = process.env.GAIA_DIR || './';

  global.mozTestInfo = {appPath: process.env.CURRENT_APP};
  const excludedApps = [
    'bluetooth', 'keyboard', 'wallpaper', // no generic way to test yet
    'communications/facebook', 'communications/gmail', // part of other apps
    'communications/import', 'communications/live', // part of other apps
    'communications', // not an app
    'homescreen', // we can't "launch" it
    'system', // reboots the phone
    'system/camera', // copy of the camera app
  ];

console.log(JSON.stringify(mozTestInfo));
  if (excludedApps.indexOf(mozTestInfo.appPath) !== -1) {
    if (process.env.VERBOSE) {
      console.log("'" + mozTestInfo.appPath + "' is an excluded app, skipping tests.");
    }

    var output = {};
    output.stats = {application: mozTestInfo.appPath,
                    suites: 0};
    console.log(JSON.stringify(output));
    return;
  }

/*
  window.Date = Date;
  global.window = window; // REMOVE
*/

  var Mocha = require('mocha');


//  Mocha.reporters.JSONMozTest = require(GAIA_DIR + '/tests/reporters/jsonmoztest.js');
  Mocha.reporters.JSONMozPerf = require(GAIA_DIR + '/tests/reporters/jsonmozperf.js');

  //Hack to format errors
  Mocha.reporters.Base.list = function(failures) {
    failures.forEach(function(test, i) {
      // format
      var fmt = this.color('error title', '  %s) %s:\n') +
          this.color('error message', '     %s') +
          this.color('error stack', '\n%s\n');

      // msg
      var err = test.err,
          message = err.message || '',
          stack = util.format(err),
          index = stack.indexOf(message) + message.length,
          msg = stack.slice(0, index),
          actual = err.actual,
          expected = err.expected;

      // actual / expected diff
      if ('string' == typeof actual && 'string' == typeof expected) {
        var len = Math.max(actual.length, expected.length);

        if (len < 20) msg = errorDiff(err, 'Chars');
        else msg = errorDiff(err, 'Words');

        // linenos
        var lines = msg.split('\n');
        if (lines.length > 4) {
          var width = String(lines.length).length;
          msg = lines.map(function(str, i) {
            return pad(++i, width) + ' |' + ' ' + str;
          }).join('\n');
        }

        msg = [
          '\n', this.color('diff removed', 'actual'),
          ' ', this.color('diff added', 'expected'),
          '\n\n',
          msg,
          '\n'
        ].join('');

        // indent
        msg = msg.replace(/^/gm, '      ');

        fmt = this.color('error title', '  %s) %s:\n%s') +
              this.color('error stack', '\n%s\n');
      }

      // indent stack trace without msg
      stack = stack.slice(index ? index + 1 : index)
        .replace(/^/gm, '  ');

      console.error(fmt, (i + 1), test.fullTitle(), msg, stack);
    }.bind(this));

  };


  var reporter = process.env.REPORTER || 'Spec';

  if (!(reporter in Mocha.reporters)) {
    var reporters = Object.keys(Mocha.reporters);
    var idx = reporters.indexOf('Base');

    if (idx !== -1) {
      reporters.splice(idx, 1);
    }

    var allowed = reporters.join(',\t\n');
    console.log('Error running integration tests:\n');

    console.log(
      'Invalid REPORTER "' + reporter + '" set use one of:\n' +
      allowed
    );

  } else {
    mozTestInfo.runs = process.env.RUNS || 5;
  }


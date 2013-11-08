'use strict';

var App = require('./app');
var PerformanceHelper = require(GAIA_DIR + '/tests/performance/performance_helper.js');

var manifestPath, entryPoint;

var arr = mozTestInfo.appPath.split('/');
manifestPath = arr[0];
entryPoint = arr[1];

marionette('startup test ' + mozTestInfo.appPath + ' >', function() {

  var app;
  var client = marionette.client({
    settings: {
      'ftu.manifestURL': null
    }
  });

  var performanceHelper;

  app = new App(client, mozTestInfo.appPath);
  if (app.skip) {
    return;
  }

  performanceHelper = new PerformanceHelper({ app: app });

  suite(mozTestInfo.appPath + ' >', function() {

    setup(function() {
      app.unlock(); // it affects the first run otherwise
      PerformanceHelper.registerLoadTimeListener(client);
    });

    teardown(function() {
      PerformanceHelper.unregisterLoadTimeListener(client);
    });

    test('startup time', function() {
      // Mocha timeout for this test
      this.timeout(100000);
      // Marionnette timeout for each command sent to the device
      client.setScriptTimeout(10000);

      performanceHelper.repeatWithDelay(function(app, next) {
        app.launch();
        app.close();
      });

      var results = PerformanceHelper.getLoadTimes(client);
      results = results.filter(function (element) {
        if (element.src.indexOf('app://' + manifestPath) !== 0) {
          return false;
        }
        if (entryPoint && element.src.indexOf(entryPoint) === -1) {
          return false;
        }
        return true;
      }).map(function (element) {
        return element.time;
      });

      PerformanceHelper.reportDuration(results);
    });
  });

});


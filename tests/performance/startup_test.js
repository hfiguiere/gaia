'use strict';

var GAIA_DIR = global.GAIA_DIR;

var AppIntegration = require(GAIA_DIR + '/tests/js/app_integration.js');
var IntegrationHelper = require(GAIA_DIR + '/tests/js/integration_helper.js');
var PerformanceHelper = require(GAIA_DIR + '/tests/performance/performance_helper.js');
var MarionetteHelper = require(GAIA_DIR + '/tests/js/marionette_helper.js');

function GenericIntegration(device) {
  AppIntegration.apply(this, arguments);
}

var manifestPath, entryPoint;

var arr = window.mozTestInfo.appPath.split('/');
manifestPath = arr[0];
entryPoint = arr[1];

GenericIntegration.prototype = {
  __proto__: AppIntegration.prototype,
  appName: window.mozTestInfo.appPath,
  manifestURL: 'app://' + manifestPath + '.gaiamobile.org/manifest.webapp',
  entryPoint: entryPoint
};

suite(window.mozTestInfo.appPath + ' >', function() {
  var device;
  var app;

  var performanceHelper;

  MarionetteHelper.start(function(client) {
    app = new GenericIntegration(client);
    device = app.device;
    performanceHelper = new PerformanceHelper({ app: app });
  });

  setup(function() {
    /*yield*/ IntegrationHelper.unlock(device); // it affects the first run otherwise
    /*yield*/ PerformanceHelper.registerLoadTimeListener(device);
  });

  teardown(function() {
    /*yield*/ PerformanceHelper.unregisterLoadTimeListener(device);
  });

  test('startup time', function() {
    // Mocha timeout for this test
    this.timeout(100000);
    // Marionnette timeout for each command sent to the device
    /*yield*/ device.setScriptTimeout(10000);

    /*yield*/ performanceHelper.repeatWithDelay(function(app, next) {
      /*yield*/ app.launch();
      /*yield*/ app.close();
    });

    var results = /*yield*/ PerformanceHelper.getLoadTimes(device);
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


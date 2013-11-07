'use strict';

var AppIntegration = require(GAIA_DIR + '/tests/js/app_integration.js');
var IntegrationHelper = require(GAIA_DIR + '/tests/js/integration_helper.js');
var PerformanceHelper = require(GAIA_DIR + '/tests/performance/performance_helper.js');

function GenericIntegration(device) {
  AppIntegration.apply(this, arguments);
}

var manifestPath, entryPoint;

var arr = mozTestInfo.appPath.split('/');
manifestPath = arr[0];
entryPoint = arr[1];

GenericIntegration.prototype = {
  __proto__: AppIntegration.prototype,
  appName: mozTestInfo.appPath,
  manifestURL: 'app://' + manifestPath + '.gaiamobile.org/manifest.webapp',
  entryPoint: entryPoint
};

suite(mozTestInfo.appPath + ' >', function() {
  var device;
  var app;
  var client = marionette.client();

  var performanceHelper;

  app = new GenericIntegration(client);
  device = app.device;
  performanceHelper = new PerformanceHelper({ app: app });

  setup(function() {
    IntegrationHelper.unlock(device); // it affects the first run otherwise
    PerformanceHelper.registerLoadTimeListener(device);
  });

  teardown(function() {
    PerformanceHelper.unregisterLoadTimeListener(device);
  });

  test('startup time', function() {
    // Mocha timeout for this test
    this.timeout(100000);
    // Marionnette timeout for each command sent to the device
    device.setScriptTimeout(10000);

    performanceHelper.repeatWithDelay(function(app, next) {
      app.launch();
      app.close();
    });

    var results = PerformanceHelper.getLoadTimes(device);
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


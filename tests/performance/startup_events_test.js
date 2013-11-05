'use strict';

var AppIntegration = require(GAIA_DIR + '/tests/js/app_integration.js');
var IntegrationHelper = require(GAIA_DIR + '/tests/js/integration_helper.js');
require(GAIA_DIR + '/tests/performance/performance_helper.js');
var MarionetteHelper = require(GAIA_DIR + '/tests/js/marionette_helper.js');

var whitelistedApps = ['communications/contacts'];

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

  MarionetteHelper.start(function(client) {
    app = new GenericIntegration(client);
    device = app.device;
  });

  setup(function() {
    // it affects the first run otherwise
    /*yield*/ IntegrationHelper.unlock(device);
  });

  if (whitelistedApps.indexOf(mozTestInfo.appPath) === -1) {
    return;
  }

  test('', function() {

    this.timeout(500000);
    /*yield*/ device.setScriptTimeout(50000);

    var lastEvent = 'startup-path-done';

    var performanceHelper = new PerformanceHelper({
      app: app,
      lastEvent: lastEvent
    });

    /*yield*/ performanceHelper.repeatWithDelay(function(app, next) {

      var waitForBody = false;
      /*yield*/ app.launch(waitForBody);

      var runResults = /*yield*/ performanceHelper.observe(next);

      performanceHelper.reportRunDurations(runResults);
      /*yield*/ app.close();
    });

    performanceHelper.finish();

  });

});


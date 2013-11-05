'use strict';

requireCommon('test/synthetic_gestures.js');
require(GAIA_DIR + '/tests/performance/performance_helper.js');
var MarionetteHelper = require(GAIA_DIR + '/tests/js/marionette_helper.js');
require(GAIA_DIR + '/apps/communications/dialer/test/integration/app.js');

suite(mozTestInfo.appPath + '>', function() {
  var device;
  var app;

  MarionetteHelper.start(function(client) {
    app = new DialerIntegration(client);
    device = app.device;
  });

  setup(function() {
    /*yield*/ IntegrationHelper.unlock(device);
  });

  test('Dialer/callLog rendering time >', function() {

    this.timeout(500000);
    /*yield*/ device.setScriptTimeout(50000);

    var lastEvent = 'call-log-ready';

    var performanceHelper = new PerformanceHelper({
      app: app,
      lastEvent: lastEvent
    });

    /*yield*/ performanceHelper.repeatWithDelay(function(app, next) {
      var waitForBody = true;
      /*yield*/ app.launch(waitForBody);

      var recentsButton = /*yield*/ app.element('optionRecents');

      /*yield*/ recentsButton.singleTap();

      var runResults = /*yield*/ performanceHelper.observe(next);
      performanceHelper.reportRunDurations(runResults);

      /*yield*/ app.close();
    });

    performanceHelper.finish();
  });
});

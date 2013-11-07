'use strict';

requireCommon('test/synthetic_gestures.js');
require(GAIA_DIR + '/tests/performance/performance_helper.js');
var DialerIntegration =
  require(GAIA_DIR + '/apps/communications/dialer/test/integration/app.js');

suite(mozTestInfo.appPath + '>', function() {
  var device;
  var app;
  var client = marionette.client();

  app = new DialerIntegration(client);
  device = app.device;

  setup(function() {
    IntegrationHelper.unlock(device);
  });

  test('Dialer/callLog rendering time >', function() {

    this.timeout(500000);
    device.setScriptTimeout(50000);

    var lastEvent = 'call-log-ready';

    var performanceHelper = new PerformanceHelper({
      app: app,
      lastEvent: lastEvent
    });

    performanceHelper.repeatWithDelay(function(app, next) {
      var waitForBody = true;
      app.launch(waitForBody);

      var recentsButton = app.element('optionRecents');

      recentsButton.singleTap();

      var runResults = performanceHelper.observe(next);
      performanceHelper.reportRunDurations(runResults);

      app.close();
    });

    performanceHelper.finish();
  });
});

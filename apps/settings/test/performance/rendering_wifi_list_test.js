'use strict';

requireCommon('test/synthetic_gestures.js');
var PerformanceHelper =
  require(GAIA_DIR + '/tests/performance/performance_helper.js');
var SettingsIntegration =
  require(GAIA_DIR + '/apps/settings/test/integration/app.js');

suite(mozTestInfo.appPath + ' >', function() {
  var device;
  var app;
  var client = marionette.client();

  app = new SettingsIntegration(client);
  device = app.device;

  setup(function() {
    // It affects the first run otherwise
    IntegrationHelper.unlock(device);
  });

  test('rendering WiFi list >', function() {
    this.timeout(500000);
    device.setScriptTimeout(50000);

    var lastEvent = 'settings-panel-wifi-ready';

    var performanceHelper = new PerformanceHelper({
      app: app,
      lastEvent: lastEvent
    });

    performanceHelper.repeatWithDelay(function(app, next) {
      var waitForBody = true;
      app.launch(waitForBody);

      var wifiSubpanel = app.element('wifiSelector');
      wifiSubpanel.singleTap();

      var runResults = performanceHelper.observe(next);
      performanceHelper.reportRunDurations(runResults);

      app.close();
    });

    performanceHelper.finish();

  });
});

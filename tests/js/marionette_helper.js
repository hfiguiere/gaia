var Marionette = require('marionette-client');

var MarionetteHelper = {

  /**
   * Starts a marionette instance.
   *
   *    suite('my integration test', function() {
   *      var device;
   *
   *      MarionetteHelper.start(function(client) {
   *        device = client;
   *      });
   *
   *    });
   *
   *
   * @param {Function} [client=Marionette.Client] client object.
   * @param {Function} callback passes ready to use driver instance. [driver].
   */
  start: function(client, callback) {
    var device;

    // check if custom client has been provided.
    if (arguments.length === 1) {
      callback = client;
      client = Marionette.Client;
    }

    suiteSetup(function() {
      var driver;
      this.timeout(10000);

      driver = new Marionette.Drivers.TcpSync({});
      /*yield*/ driver.connect(MochaTask.next);

      device = new Marionette.Client(driver, {
        defaultCallback: MochaTask.nextNodeStyle
      });

      /*yield*/ device.startSession();

      callback(device);
    });

    suiteTeardown(function() {
      this.timeout(10000);
      /*yield*/ device.deleteSession();
    });
  }

};

module.exports = MarionetteHelper;


function PerfApp(client, origin) {
  this.client = client;
  this.origin = origin;
}

module.exports = PerfApp;

PerfApp.prototype = {

  /**
   * Launches app, switches to frame, and waits for it to be loaded.
   */
  launch: function() {
    this.client.apps.launch(this.origin);
    this.client.apps.switchToApp(this.origin);
    this.client.helper.waitForElement('body');
  },

  unlock: function() {
/*
    var client = this.client;
    client.importScript(
      './tests/atoms/gaia_lock_screen.js',
      function() {
        client.executeJsScript('GaiaLockScreen.unlock()',
				  client.defaultCallback);
      });
*/
  }

};

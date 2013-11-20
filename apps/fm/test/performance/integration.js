
var App = requireGaia('/tests/performance/app.js');

function FmIntegration(client) {
  App.apply(this, arguments);
}

FmIntegration.prototype = {
  __proto__: App.prototype,
  appName: 'Settings',
  manifestURL: 'app://fm.gaiamobile.org/manifest.webapp',

  selectors: {
    powerSwitch: '#power-switch'
  }
};

module.exports = FmIntegration;

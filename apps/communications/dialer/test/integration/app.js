'use strict';

var AppIntegration = require(GAIA_DIR + '/tests/js/app_integration.js');
require(GAIA_DIR + '/tests/js/integration_helper.js');

function DialerIntegration(device) {
  AppIntegration.apply(this, arguments);
}

DialerIntegration.prototype = {
  __proto__: AppIntegration.prototype,
  appName: 'Phone',
  manifestURL: 'app://communications.gaiamobile.org/manifest.webapp',
  entryPoint: 'dialer',

  selectors: {
    optionRecents: '#option-recents'
  }
};

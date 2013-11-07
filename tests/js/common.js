
var GAIA_DIR = process.env.GAIA_DIR || './';

CommonResourceLoader = {
  url: function(url) {
    return GAIA_DIR + '/test_apps/test-agent/' + url;
  }
};

global.location = {};
global.location.host = 'localhost';

// require with a callback
global.require2 = function(url, cb) {
  var r = require(url);
  if (typeof(cb) === 'function') {
    cb();
  }
  return r;
};


module.exports = CommonResourceLoader;

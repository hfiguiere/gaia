(function(window) {

  // register the globals and Node vs Browser
  if(typeof window.navigator === 'undefined') {
    window = global.window;
  }

  var TestUrlResolver = (function() {

    var location = window.location,
        domainParts = window.location.host.split('.'),
        addSubdomain = false,
        prefix = null;

    if (domainParts.length > 2) {
      //running from gaiamobile.org subdomain
      addSubdomain = true;
    } else {
      //running from localhost
      addSubdomain = false;
    }

    return {
      PARSE_REGEX: /^(\/?)([\w\d-]+)\/(.*)/,

      parse: function tur_parse(url) {
        if (addSubdomain) {
          var parsedUrl = this.PARSE_REGEX.exec(url);
          var domain = location.protocol + '//' + parsedUrl[2] + '.';

          domain += domainParts.slice(1).join('.') + '/';

          return {
            domain: domain,
            host: parsedUrl[2],
            url: parsedUrl[3]
          };

        } else {
          throw new Error('you must run tests using real domains on localhost');
        }
      },

      resolve: function tur_resolve(url) {
        var parts = this.parse(url);
        return parts.domain + parts.url;
      }
    };

  }());

  window.TestUrlResolver = TestUrlResolver;

  if(typeof module.exports !== 'undefined') {
    module.exports = TestUrlResolver;
  }
}(this));


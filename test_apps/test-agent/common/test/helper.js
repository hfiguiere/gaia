// put stuff here to help your tests out...

(function(window) {

  // register the globals and Node vs Browser
  if(typeof window.navigator === 'undefined') {
    window = global.window;
  }

  var htmlFragments;
  var requestedFragments = {};

  // mocha test methods we want to provide
  // yield support to.
  var testMethods = [
        'suiteSetup',
        'setup',
        'test',
        'teardown',
        'suiteTeardown'
      ];

  // chai has no backtraces in ff
  // this patch will change the error
  // class used to provide real .stack.
  function patchChai(Assertion) {
    function chaiAssert(expr, msg, negateMsg, expected, actual) {
      actual = actual || this.obj;
      var msg = (this.negate ? negateMsg : msg),
          ok = this.negate ? !expr : expr;

      if (!ok) {
        throw new Error(
          // include custom message if available
          this.msg ? this.msg + ': ' + msg : msg
        );
      }
    }
    Assertion.prototype.assert = chaiAssert;
  }

  global.requireApp = function(url, cb, options) {
    require2(TestUrlResolver.resolve(url), cb, options);
  };

  /**
   * Appends a templated node to the body for a suite
   * Removes the node at teardown.
   * @param {String} is the type of element.
   * @param {Object} attrs optional attributes.
   */
  global.suiteTemplate = function(is, attrs) {

    var testElement;

    setup(function ta_template() {
      var foundElement = htmlFragments.querySelector('element[name="' + is + '"]');
      testElement = document.createElement(foundElement.getAttribute('extends') || 'div');
      var template = foundElement.querySelector('template');
      testElement.innerHTML = template.innerHTML;

      attrs = attrs || {};
      for (var i in attrs) {
        testElement.setAttribute(i, attrs[i]);
      }

      document.body.appendChild(testElement);
    });

    teardown(function ta_teardown() {
      testElement.parentNode.removeChild(testElement);
    });
  };

  global.requireElements = function(url) {

    url = TestUrlResolver.resolve(url);

    if (requestedFragments[url]) {
      return;
    }
    requestedFragments[url] = true;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false /* intentional sync */);
    xhr.send();

    if (!htmlFragments) {
      htmlFragments = document.createElement('div');
    }
    htmlFragments.innerHTML += xhr.responseText;
  };


  var CommonResourceLoader = require(GAIA_DIR + '/tests/js/common.js');
  /**
   * Require a file from /common/ resources.
   *
   * Usage: requireCommon('vendor/mocha/mocha.js');
   *
   * @param {String} url relative location of file.
   * @param {Function} cb optional callback called
   *                      when resource has been loaded.
   */
  global.requireCommon = function(url, cb) {
    return require2(CommonResourceLoader.url('/common/' + url), cb);
  };

  // template
  requireCommon('test/template.js');

  // load chai
  requireCommon('vendor/chai/chai.js', function() {
    chai.Assertion.includeStack = true;
    patchChai(chai.Assertion);
    global.assert = chai.assert;
  });

  // mocha helpers
  requireCommon('test/mocha_task.js');
  requireCommon('test/mocha_generators.js', function() {
    testMethods.forEach(function(method) {
      testSupport.mochaGenerators.overload(method);
    });
  });

  // url utilities
  global.TestUrlResolver = requireCommon('test/test_url_resolver.js');

}(this));


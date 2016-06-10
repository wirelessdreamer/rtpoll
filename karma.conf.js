'use strict';

module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['angular','jasmine'],
    angular: ['mocks'],
    reporters: ['progress', 'coverage'],
	preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'www/js/*.js': ['coverage']
    },
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },
    files: [
      'www/js/*.js',
      'spec/*.spec.js'
    ]
  });
};
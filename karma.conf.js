'use strict';

module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['angular','jasmine'],
    angular: ['mocks'],
    files: [
      'js/*.js',
      'spec/*.spec.js'
    ]
  });
};
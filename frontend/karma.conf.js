module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    files: [],
    reporters: ['progress'],
    browsers: ['ChromeHeadless'],
    singleRun: true
  });
};

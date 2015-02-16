

module.exports = function(config) {
  config.set({
    files : [
      'bower_components/angular/angular.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angularjs-toaster/toaster.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-file-upload/angular-file-upload.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'app/js/services/cart.js',
      'app/js/directives/cart.js',
      'app/js/controllers/app.js',
      'app/js/filter/app.js',
      'app/js/app.js',
      'app/js/controllers/admin.js',
      'app/js/directives/app.js',
      'test/unit/**/*.js'
    ],
    basePath: '../',
    frameworks: ['jasmine'],
    reporters: ['progress'],
    browsers: ['Chrome'],
    autoWatch: false,
    singleRun: true,
    colors: true
  });
};

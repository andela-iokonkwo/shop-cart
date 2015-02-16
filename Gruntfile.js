module.exports = function (grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    var appConfig = {
        app: 'app',
        dist: 'dist'
    };
    grunt.initConfig({
        yeoman: appConfig,
        shell: {
            options: {
                stdout: true
            },
            selenium: {
                command: './selenium/start',
                options: {
                    stdout: false,
                    async: true
                }
            },
            protractor_install: {
                command: 'node ./node_modules/protractor/bin/webdriver-manager update'
            },
            npm_install: {
                command: 'npm install'
            }
        },

        connect: {
            options: {
                port: 8000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function (connect) {
                        return [
                          connect.static('.tmp'),
                          connect.static('bower_components'),
                          connect.static(appConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    open: true,
                    port: 9000,
                    middleware: function (connect) {
                        return [
                          connect.static(appConfig.dist)
                        ];
                    }
                }
            },
            webserver: {
                options: {
                    port: 8888,
                    keepalive: true
                }
            },
            devserver: {
                options: {
                    port: 8888
                }
            },
            testserver: {
                options: {
                    port: 9999
                }
            },
            coverage: {
                options: {
                    base: 'coverage/',
                    port: 5555,
                    keepalive: true
                }
            }
        },

        protractor: {
            options: {
                keepAlive: true,
                configFile: "./test/protractor.conf.js"
            },
            singlerun: {},
            auto: {
                keepAlive: true,
                options: {
                    args: {
                        seleniumPort: 4444
                    }
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
              'Gruntfile.js',
              'app/scripts/{,*/}*.js'
            ]
        },

        watch: {
            options: {
                livereload: 7777
            },
            js: {
                files: ['<%= yeoman.app %>/js/**/*.js'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                  '<%= yeoman.app %>/{,*/}*.html',
                  '<%= yeoman.app %>/templates/*.html',
                  '<%= yeoman.app %>/views/*.html',
                  '<%= yeoman.app %>/views/admin/*.html',
                  '.tmp/css/{,*/}*.css',
                  '<%= yeoman.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
            assets: {
                files: ['app/css/**/*.css', 'app/js/**/*.js'],
                tasks: []
            },
            protractor: {
                files: ['app/scripts/**/*.js', 'test/e2e/**/*.js'],
                tasks: ['protractor:auto']
            }
        },

        open: {
            devserver: {
                path: 'http://localhost:8888'
            },
            coverage: {
                path: 'http://localhost:5555'
            }
        },

        karma: {
            unit: {
                configFile: './test/karma-unit.conf.js',
                autoWatch: false,
                singleRun: true
            },
            unit_auto: {
                configFile: './test/karma-unit.conf.js',
                autoWatch: true,
                singleRun: false
            },
            unit_coverage: {
                configFile: './test/karma-unit.conf.js',
                autoWatch: false,
                singleRun: true,
                reporters: ['progress', 'coverage'],
                preprocessors: {
                    'app/scripts/*.js': ['coverage']
                },
                coverageReporter: {
                    type: 'html',
                    dir: 'coverage/'
                }
            },
        },
        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                      '.tmp',
                      '<%= yeoman.dist %>/{,*/}*',
                      '!<%= yeoman.dist %>/.git*',
                      '!<%= yeoman.dist %>/index.html'
                    ]
                }]
            },
            server: '.tmp'
        },
        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                      '*.{ico,png,txt}',
                      'img/{,*/}*',
                      'img/{,*/}**/',
                      'img/{,*/}**/**/*',
                      'templates/*.html',
                      'views/*.html',
                      'lib/fancybox/source/*',
                      'lib/fancybox/source/**/*',
                      'layerslider/skins/**/*',
                      'views/admin/*.html',
                      'fonts/*'
                    ]
                    },
                  //  {
                //    expand: true,
                //    cwd: '<%= yeoman.app %>',
                //    src: 'img/*',
                //    dest: '<%= yeoman.dist %>/css/dist'
                //}, 
                {
                    expand: true,
                    cwd: 'bower_components/bootstrap',
                    src: 'fonts/*',
                    dest: '<%= yeoman.dist %>'
                }, {
                    expand: true,
                    cwd: 'bower_components/font-awesome',
                    src: 'fonts/*',
                    dest: '<%= yeoman.dist %>'
                }
                //{
                //    expand: true,
                //    cwd: 'bower_components/bootstrap',
                //    src: 'fonts/*',
                //    dest: '<%= yeoman.dist %>/css/dist'
                //}, {
                //    expand: true,
                //    cwd: 'bower_components/font-awesome',
                //    src: 'fonts/*',
                //    dest: '<%= yeoman.dist %>/css/dist'
                //}
]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/css',
                dest: '.tmp/css/',
                src: '{,*/}*.css'
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: ['*.html', 'templates/*.html', 'views/*.html', 'views/admin/*.html'],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },

        uglify: {
            options: {
                mangle: false
            },
            dist: {
                files: {
                    '<%= yeoman.dist %>/scripts/app.min.js': [
                      '<%= yeoman.dist %>/scripts/app.js'
                    ],
                    '<%= yeoman.dist %>/scripts/ui.min.js': [
                      '<%= yeoman.dist %>/scripts/ui.js'
                    ],
                    '<%= yeoman.dist %>/scripts/vendor.min.js': [
                      '<%= yeoman.dist %>/scripts/vendor.js'
                    ]
                }
            }
        },
        concat: {
            js: {
                src: ['<%= yeoman.app %>/js/*.js', '<%= yeoman.app %>/js/**/*.js'],
                dest: '<%= yeoman.dist %>/scripts/app.js'
            },
            uijs: {
                src: [//'app/lib/fancybox/source/jquery.fancybox.pack.js',
                'bower_components/owl-carousel/owl-carousel/owl.carousel.min.js',
                'bower_components/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js',
                'bower_components/layerslider/js/greensock.js',
                'bower_components/layerslider/js/layerslider.transitions.js',
                'bower_components/layerslider/js/layerslider.kreaturamedia.jquery.js',
                'bower_components/jquery-zoom/jquery.zoom.min.js'
                ],
                dest: '<%= yeoman.dist %>/scripts/ui.js'
            },
            vendorjs: {
                src: ['bower_components/jquery/dist/jquery.min.js',
                'bower_components/jquery-migrate/jquery-migrate.min.js',
                'bootstrap/dist/js/bootstrap.min.js',
                'app/scripts/back-to-top.js',
                'bower_components/jquery-slimscroll/jquery.slimscroll.min.js',
                'bower_components/angular/angular.min.js',
                'bower_components/angular-ui-router/release/angular-ui-router.min.js',
                'bower_components/angular-sanitize/angular-sanitize.min.js',
                'app/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
                'bower_components/angular-file-upload/angular-file-upload.min.js',
                'bower_components/angular-animate/angular-animate.min.js',
                'bower_components/angularjs-toaster/toaster.js'],
                dest: '<%= yeoman.dist %>/scripts/vendor.js'
            },
            css: {
                src: ['bower_components/font-awesome/css/font-awesome.min.css',
                'bower_components/bootstrap/dist/css/bootstrap.min.css',
                //'lib/fancybox/source/jquery.fancybox.css',
                'bower_components/owl-carousel/owl-carousel/owl.carousel.css',
                'bower_components/layerslider/css/layerslider.css', 
                '<%= yeoman.app %>/css/components.css',
                    '<%= yeoman.app %>/css/style.css',
                    '<%= yeoman.app %>/css/style-shop.css',
                    '<%= yeoman.app %>/css/style-layer-slider.css',
                    '<%= yeoman.app %>/css/style-responsive.css',
                    '<%= yeoman.app %>/css/themes/red.css',
                    '<%= yeoman.app %>/css/custom.css',
                'bower_components/angularjs-toaster/toaster.css'],
                dest: '<%= yeoman.dist %>/css/app.css'
            }
        },
        cssmin: {
            css: {
                src: '<%= yeoman.dist %>/css/app.css',
                dest: '<%= yeoman.dist %>/css/app.min.css'
            }
        }

    });



    //single run tests
    grunt.registerTask('test', ['jshint', 'test:unit', 'test:e2e']);
    grunt.registerTask('test:unit', ['karma:unit']);
    grunt.registerTask('test:e2e', ['connect:testserver', 'protractor:singlerun']);

    //autotest and watch tests
    grunt.registerTask('autotest', ['karma:unit_auto']);
    grunt.registerTask('autotest:unit', ['karma:unit_auto']);
    grunt.registerTask('autotest:e2e', ['connect:testserver', 'shell:selenium', 'watch:protractor']);

    //coverage testing
    grunt.registerTask('test:coverage', ['karma:unit_coverage']);
    grunt.registerTask('coverage', ['karma:unit_coverage', 'open:coverage', 'connect:coverage']);

    //installation-related
    grunt.registerTask('install', ['update', 'shell:protractor_install']);
    grunt.registerTask('update', ['shell:npm_install', 'concat']);

    //defaults
    grunt.registerTask('default', ['dev']);

    //development
    grunt.registerTask('dev', ['update', 'connect:devserver', 'open:devserver', 'watch:assets']);

    //server daemon
    grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
          'connect:livereload',
          'watch'
        ]);
    });

    //build
    grunt.registerTask('build', [
   'clean:dist',
   'copy:dist',
   'concat',
   'cssmin',
    'uglify',
   'htmlmin'
    ]);
};

var path = require('path');

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['default']
            },
            compass: {
                files: ['src/sass/*.scss'],
                tasks: ['compass'],
                options: {
                    spawn: false,
                }
            },
            js: {
                files: ['src/js/*.js'],
                tasks: ['uglify'],
                options: {
                    spawn: false,
                }
            },
            html: {
                files: ['src/index.html'],
                tasks: ['htmlmin'],
                options: {
                    spawn: false,
                }
            }
        },
        compass: {
            dist: {
                options: {
                    config: 'config.rb'
                }
            }
        },
        uglify: {
            my_target: {
                options: {
                    preserveComments: false,
                    drop_console: true,
                    screwIE8: false,
                    compress: {
                        unused: true
                    },
                    beautify: false
                },
                files: {
                    'www/assets/js/main.js': ['src/js/jquery-3.2.1.min.js', 'src/js/main.js']
                }
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'src/img',
                    src: ['**'],
                    dest: 'www/assets/img',
                }, {
                    expand: true,
                    cwd: 'src/sounds',
                    src: ['**'],
                    dest: 'www/assets/sounds',
                }, {
                    expand: true,
                    cwd: 'src/fonts',
                    src: ['**'],
                    dest: 'www/assets/fonts',
                }]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'www/index.html': 'src/index.html'
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    grunt.registerTask('default', ['compass', 'uglify', 'copy', 'htmlmin']);
    grunt.registerTask('watcher', ['compass', 'uglify', 'copy', 'htmlmin', 'watch']);
};
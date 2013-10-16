/*global module */
module.exports = function (grunt) {
	'use strict';

	grunt.initConfig({
		concat: {
			'dist/main.js': [
				'bower_components/jquery/jquery.js',
				'bower_components/jquery-timeago/jquery.timeago.js',
				'bower_components/lodash/dist/lodash.js',
				'js/vendor/list.js',
				'js/vendor/list.paging.js',
				'js/main.js'
			]
		},
		uglify: {
			all: {
				files: {
					'dist/main.js': ['dist/main.js']
				}
			}
		},
		jshint: {
			files: ['js/*.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		watch: {
			all: {
				files: ['js/*.js'],
				tasks: ['default']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['concat']);
	grunt.registerTask('minify', ['concat', 'uglify']);
};

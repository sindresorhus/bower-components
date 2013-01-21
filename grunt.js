/*global module */
module.exports = function (grunt) {
	'use strict';

	grunt.initConfig({
		concat: {
			'dist/main.js': [
				'js/vendor/jquery.js',
				'js/vendor/jquery.timeago.js',
				'js/vendor/lodash.js',
				'js/vendor/list.js',
				'js/vendor/list.paging.js',
				'js/main.js'
			]
		},
		min: {
			'dist/main.js': ['dist/main.js']
		},
		lint: {
			files: ['js/*.js']
		}
	});

	grunt.registerTask('default', 'concat');
	grunt.registerTask('minify', 'concat min');
};

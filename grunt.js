/*global module */
module.exports = function( grunt ) {
	'use strict';

  grunt.initConfig({
    concat: {
      'dist/main.js': [
        'js/vendor/jquery.js',
        'js/vendor/jquery-ajax-localstorage-cache.js',
        'js/vendor/lodash.min.js',
        'js/vendor/list.min.js',
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

  grunt.loadTasks('tasks');

  grunt.registerTask('default', 'lint concat min');
};

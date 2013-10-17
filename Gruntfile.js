module.exports = function (grunt) {
  grunt.initConfig({
    pkg: require('./package.json'),
    nodemon: {
      dev: {
        options: {
          file: 'server.js',
          watchedExtensions: ['js', 'json'],
          ignoredFiles: ['node_modules/**', 'public/**'],
          nodeArgs: ['--debug']
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.registerTask('default', ['nodemon']);
};
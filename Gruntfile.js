module.exports = function(grunt) {
    // load all grunt tasks
    require('matchdep')
    .filterDev('grunt-*')
    .filter(function(task) {
        return task !== 'grunt-cli';
    })
    .forEach(grunt.loadNpmTasks);

    // configurable paths
    var pathConfig = {
        tests: 'specs'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        paths: pathConfig,
        exec: {
            build: 'npm run build',
            start: 'npm run start'
        }
    });


    grunt.registerTask('build', 'exec:build');
    grunt.registerTask('default', 'exec:start');
};

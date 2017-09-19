module.exports = function (grunt) {
    grunt.initConfig({

    // define source files and their destinations
    uglify: {
        files: { 
            src: './public/*.js',  // source files mask
            dest: './build.min.js',    // destination folder
            flatten: true,   // remove all unnecessary nesting
        }
    },
    watch: {
        js:  { files: 'js/*.js', tasks: [ 'uglify' ] },
    }
});

// load plugins
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-uglify');

// register at least this one task
grunt.registerTask('default', [ 'uglify' ]);


};

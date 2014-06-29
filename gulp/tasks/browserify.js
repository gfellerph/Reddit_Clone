// Dependencies
// ============

var browserify   = require('browserify');
var gulp         = require('gulp');
var handleErrors = require('../utils/handleErrors');
var source       = require('vinyl-source-stream');


// Options
// =======

var options = {
	jsBaseDir: './assets/js/**/*.js',
	jsMainFile: './assets/js/main.js',
	jsOutputDir: './assets/build',
	jsOutputFileName: 'main.js'
}


// Tasks
// =====

gulp.task('browserify', jsbuild);


// Watcher
// =======

gulp.watch(options.jsBaseDir).on('change', jsbuild);


// Functions
// =========

function jsbuild(event){
	console.time('JS build');

	// Define the entry point
	browserify({ entries: [options.jsMainFile]})

	// Bundle that shit and enable sourcemaps
	.bundle({ debug: true })

	// Log errors
	.on('error', handleErrors)

	// use vinyl source stream to hand the file to gulp
	.pipe( source(options.jsOutputFileName) )

	// Save it
	.pipe(gulp.dest(options.jsOutputDir));	

	console.timeEnd('JS build');
}
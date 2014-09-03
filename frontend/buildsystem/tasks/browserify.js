// Dependencies
// ============

var browserify  = require('browserify');
var gulp        = require('gulp');
var source      = require('vinyl-source-stream');
var plumber 	= require('gulp-plumber');
var rename		= require('gulp-rename');
var uglify		= require('gulp-uglify');
var streamify	= require('gulp-streamify');
var gutil		= require('gulp-util');


// Options
// =======

var options = {
	jsBaseDir: '../js/**/*.js',			// Where your js files are stored
	jsMainFile: '../js/main.js',			// Entry point to js files
	jsOutputDir: '../../public/js',				// Output directory
	jsOutputFileName: 'main.js',		// Name of the output file
	jsOutputMinFileName: 'main.min.js'	// Name of the minified output file (no sourcemap)
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

	// Define the entry point
	browserify({ entries: [options.jsMainFile]})

	// Bundle that shit and enable sourcemaps
	.bundle({ debug: true })

	// Log errors to the console and continue watching
	.on('error', function(error){
		console.log(error);
		return;
	})

	// use vinyl source stream to hand the file to gulp
	.pipe( source(options.jsOutputFileName) )

	// Save it
	.pipe(gulp.dest(options.jsOutputDir))

	// Rename it
	.pipe(rename(options.jsOutputMinFileName))

	// Minify it
	.pipe( streamify(uglify()) )

	// Save minified file
	.pipe(gulp.dest(options.jsOutputDir));	

	gutil.log('JS built');
}
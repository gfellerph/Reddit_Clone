// Dependencies
// ============

var browserify  = require('browserify');
var gulp        = require('gulp');
var source      = require('vinyl-source-stream');
var plumber 	= require('gulp-plumber');
var rename		= require('gulp-rename');
var uglify		= require('gulp-uglify');
var streamify	= require('gulp-streamify');


// Options
// =======

var options = {
	minify: true,						// Minify the file or not
	jsBaseDir: 'assets/js/**/*.js',			// Where your js files are stored
	jsMainFile: './assets/js/main.js',			// Entry point to js files
	jsOutputDir: './assets/build',				// Output directory
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
	console.time('JS build');

	// Define the entry point
	browserify({ entries: [options.jsMainFile]})

	// Bundle that shit and enable sourcemaps
	.bundle({ debug: true })

	// Report errors and continue watching
	.pipe( plumber() )

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

	console.timeEnd('JS build');
}
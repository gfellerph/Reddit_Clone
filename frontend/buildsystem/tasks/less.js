// Dependencies
// ============

var gulp 		= require('gulp');
var plumber 	= require('gulp-plumber');
var less 		= require('gulp-less');
var rename 		= require('gulp-rename');
var minify		= require('gulp-minify-css');
var sourcemaps 	= require('gulp-sourcemaps');
var gutil		= require('gulp-util');
var autoprefixer = require('gulp-autoprefixer');


// Options
// =====

var options = {
	lessBaseDir: '../less/**/*.less', 		// Where all less files are stored and the watcher is set
	lessMainFile: '../less/main.less', 	// Where your less files are imported
	lessOutputDir: '../../public/css', 			// Where main.css, main.min.css and the sourcemap would be written to
	lessOutputMinName: 'main.min.css'	// Name of the minified css
}


// Tasks
// =====

gulp.task('less', lessbuild);


// Watcher
// =======

gulp.watch(options.lessBaseDir).on('change', lessbuild);


// Functions
// =========

function lessbuild(event){

	// Start piping with main file
	gulp.src(options.lessMainFile)

	// Report errors and keep watching
	.pipe( plumber() )

	// Initialize sourcemaps
	.pipe( sourcemaps.init() )

	// Compile less and generate sourcemap
	.pipe( less() )

	// Generate sourcemap
	.pipe( sourcemaps.write() )

	// Run autoprefixer
	.pipe( autoprefixer() )

	// Save compiled css
	.pipe( gulp.dest(options.lessOutputDir) )

	// Rename stream
	.pipe( rename(options.lessOutputMinName) )

	// Minify
	.pipe( minify() )

	// Save minified file
	.pipe( gulp.dest(options.lessOutputDir) );

	gutil.log('Less built');
}
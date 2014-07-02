// Dependencies
// ============

var gulp 		= require('gulp');
var plumber 	= require('gulp-plumber');
var less 		= require('gulp-less');
var rename 		= require('gulp-rename');
var minify		= require('gulp-minify-css');


// Options
// =====

var options = {
	lessBaseDir: 'assets/less/**/*.less', 		// Where all less files are stored and the watcher is set
	lessMainFile: './assets/less/main.less', 	// Where your less files are imported
	lessOutputDir: './assets/build', 			// Where main.css, main.min.css and the sourcemap would be written to
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
	console.time('Less build');

	// Start piping with main file
	gulp.src(options.lessMainFile)

	// Report errors and keep watching
	.pipe( plumber() )

	// Compile less and generate sourcemap
	.pipe( less({ sourceMap: true }) )

	// Save compiled css
	.pipe( gulp.dest(options.lessOutputDir) )

	// Rename stream
	.pipe( rename(options.lessOutputMinName) )

	// Minify
	.pipe( minify() )

	// Save minified file
	.pipe( gulp.dest(options.lessOutputDir) );

	console.timeEnd('Less build');
}
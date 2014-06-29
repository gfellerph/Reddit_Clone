// Dependencies
// ============

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var less = require('gulp-less');


// Options
// =======

var options = {
	lessBaseDir: './assets/less/**/*.less', 			// Where all less files are stored and the watcher is set
	lessMainFile: './assets/less/main.less', 			// Where your less files are imported
	lessOutputDir: './assets/build' 							// Where main.css, main.min.css and the sourcemap would be written to
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
	console.time('LESS build');

	gulp.src(options.lessMainFile)
	.pipe( plumber() )
	.pipe( less({ sourceMap: true }) )
	.pipe( gulp.dest(options.lessOutputDir) );

	console.timeEnd('LESS build');
}
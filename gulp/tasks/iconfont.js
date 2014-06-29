// Dependencies
// ============

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var iconfont = require('gulp-iconfont');


// Options
// =====

var options = {
	svgBaseDir: './assets/fonts/svg/**/*.svg', 	// Where all svg files are stored and the watcher is set
	iconfontOutputDir: './assets/fonts', 					// Where main.css, main.min.css and the sourcemap would be written to
	fontName: 'fonticons'
}


// Tasks
// =====

gulp.task('iconfont', buildIconfont);


// Watcher
// =======

// Does not work yet
/*gulp.watch(options.svgBaseDir).on('added', buildIconfont);
gulp.watch(options.svgBaseDir).on('deleted', buildIconfont);
gulp.watch(options.svgBaseDir).on('changed', buildIconfont);*/


// Functions
// =========

function buildIconfont(){
	console.time('Build iconfont');

	gulp.src(options.svgBaseDir)
	.pipe( plumber() )
	.pipe(iconfont({
		fontName: options.fontName,
		appendCodepoints: true,
		normalize: true
	}))
	.on('codepoints', function(codepoints, options){
		// CSS Style making here, but how????
	})
	.pipe(gulp.dest(options.iconfontOutputDir));

	console.timeEnd('Build iconfont');
}
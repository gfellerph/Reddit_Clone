// Dependencies
// ============

var gulp 		= require('gulp');
var plumber 	= require('gulp-plumber');
var iconfont 	= require('gulp-iconfont');
var gutil		= require('gulp-util');
var consolidate = require('gulp-consolidate');
var rename 		= require('gulp-rename');


// Options
// =======

var options = {

	// Where you want to store the svg Files
	svgBaseDir: '../svg/**/*.svg',

	// Where the font files will be saved to
	iconfontOutputDir: '../../public/fonts/',

	// Name to use on generated webfont, in the less file and as font-family name		
	fontName: 'fonticons',

	// Class name to use in less files, name of the mixin
	className: 'gfx',

	// Path to the less template
	lessTemplate: 'tasks/iconfont-template.less',

	// Where the generated less file should be saved to
	lessOutputFilePath: '../less/scaffolding/',

	// This path will be written in the @fontface rule in the less file
	fontServerPath: '/fonts/'
}


// Tasks
// =====

gulp.task('iconfont', buildIconfont);


// Watcher
// =======

gulp.watch(options.svgBaseDir).on('change', buildIconfont);


// Functions
// =========

function buildIconfont(){

	gulp.src(options.svgBaseDir)
	.pipe( plumber() )
	.pipe( iconfont({
		fontName: options.fontName,
		//fixedWidth: false,
		//centerHorizontally: false,
		normalize: true,
		//fontHeight: 512,
		//descent: 0,
		appendCodepoints: true
	}))
	.on('codepoints', function(codepoints){
		gulp.src(options.lessTemplate)
		.pipe( plumber() )
		.pipe( consolidate('lodash', {
			glyphs: codepoints,
			fontName: options.fontName,
			fontPath: options.fontServerPath,
			className: options.className
		}))
		.pipe( rename(options.fontName + '.less') )
		.pipe( gulp.dest(options.lessOutputFilePath) );

		gutil.log('Built less fontfile');
	})
	.pipe(gulp.dest(options.iconfontOutputDir));

	gutil.log('Built iconfont');
}
/*
	Main JS file for require.js
	===========================

	Imports jquery and bootstrap js from CDN's with a local
	fallback.
*/

require.config({
	paths: {
		'jquery': [ // CDN jQuery with local fallback
			'//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
			'vendor/jquery.min'
		],
		'bootstrap': [ // CDN Bootstrap with local fallback
			'//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min',
			'vendor/bootstrap.min'
		],
		'masonry': 'vendor/masonry.min'
	},
	shim: { // Shim for external scripts
		'bootstrap': {
			deps: ['jquery'] // Bootstrap depends on jquery
		}
	}
});

require([
	'vendor/modernizr',
	'bootstrap',
	'modules/post',
	'modules/nav',
	'modules/reddit-import'
	/* more modules */
	
], function(Modernizr, bootstrap, post, nav, redditImport, masonry){

});
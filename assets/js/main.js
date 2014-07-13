// SOURCE: https://github.com/greypants/gulp-starter/blob/master/gulp/index.js

// Event handler for page functionality
var $ = require('./vendor/jquery');

require('./modules/tags');
require('./modules/expander');

var rimport = require('./modules/reddit-api-mantle.js');
var Post = require('./modules/post');

var p = new Post({
	url: 'http://upload.wikimedia.org/wikipedia/commons/d/d3/Nelumno_nucifera_open_flower_-_botanic_garden_adelaide2.jpg',
	$template: $('#posts').find('.template'),
	title: 'flower'
});

$('#posts').append(p.generate());
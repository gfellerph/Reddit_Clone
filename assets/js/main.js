// SOURCE: https://github.com/greypants/gulp-starter/blob/master/gulp/index.js

// Event handler for page functionality
require('./modules/tags');
require('./modules/expander');

var post = require('./modules/post');
var rimport = require('./modules/reddit-import.js');
// SOURCE: https://github.com/greypants/gulp-starter/blob/master/gulp/index.js

var fs = require('fs');
var onlyScripts = require('./vendor/scriptFilter');
var nav = require('./modules/nav');
var post = require('./modules/post');
var rimport = require('./modules/reddit-import.js');
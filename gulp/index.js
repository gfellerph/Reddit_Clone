// SOURCE: https://github.com/greypants/gulp-starter/blob/master/gulp/index.js

var fs = require('fs');
var onlyScripts = require('./utils/scriptFilter');
var tasks = fs.readdirSync('./gulp/tasks/').filter(onlyScripts);

tasks.forEach(function(task){
	require('./tasks/' + task);
});
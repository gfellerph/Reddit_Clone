var gulp = require('gulp');

gulp.task('heroku:production', ['less', 'browserify', 'iconfont']);
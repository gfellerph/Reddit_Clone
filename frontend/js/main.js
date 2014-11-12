var app = angular.module('reddit', ['ngRoute']);

//========
// Imports
//========

// Routes
var postRoutes = require('./routes/post');
var authRoutes = require('./routes/auth');

// Controllers
var postCtrl = require('./controllers/post');
var postDetailCtrl = require('./controllers/post-detail');
var commentCtrl = require('./controllers/comment');

// Directives
var postDirective = require('./directives/post');
var commentDirective = require('./directives/comment');


//=======
// Routes
//=======

app.config(postRoutes);
app.config(authRoutes);


//============
// Controllers
//============

app.controller('PostController', postCtrl);
app.controller('PostDetailController', postDetailCtrl);
app.controller('CommentController', commentCtrl);


//===========
// Directives
//===========

app.directive('post', postDirective.list);
app.directive('postdetail', postDirective.detail);
app.directive('postform', postDirective.form);
app.directive('comment', commentDirective.comment);
app.directive('commentform', commentDirective.commentForm);
var app = angular.module('reddit', ['ngRoute']);

//========
// Imports
//========

// Routes
var postRoutes = require('./routes/post');

// Controllers
var postCtrl = require('./controllers/post');
var commentCtrl = require('./controllers/comment');

// Directives
var postDirective = require('./directives/post');
var commentDirective = require('./directives/comment');


//=======
// Routes
//=======

app.config(postRoutes);


//============
// Controllers
//============

app.controller('PostController', postCtrl);
app.controller('CommentController', commentCtrl);


//===========
// Directives
//===========

app.directive('post', postDirective);
app.directive('comment', commentDirective.comment);
app.directive('commentform', commentDirective.commentForm);
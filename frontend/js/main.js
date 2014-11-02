var app = angular.module('reddit', ['ngRoute']);

//========
// Imports
//========

// Routes
var postRoutes = require('./routes/post');

// Controllers
var postListCtrl = require('./controllers/post-list-ctrl');
var postReadCtrl = require('./controllers/post-read-ctrl');
var commentCtrl = require('./controllers/comment-ctrl');

// Directives
var postDirective = require('./directives/postDirective');
var commentDirective = require('./directives/commentDirective');


//=======
// Routes
//=======
app.config(postRoutes);


//============
// Controllers
//============
app.controller('PostListController', postListCtrl);
app.controller('PostReadController', postReadCtrl);
app.controller('CommentController', commentCtrl);


//===========
// Directives
//===========
app.directive('post', postDirective);
app.directive('comment', commentDirective);
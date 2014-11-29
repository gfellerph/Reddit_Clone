// Vendor scripts
require('../bower_components/angular/angular.min.js');
require('../bower_components/angular-route/angular-route.js');
var socket = io.connect();
socket.on('news', function(data) {

});
//========
// The app
//========

var app = angular.module('reddit', ['ngRoute']);


//========
// Imports
//========

// Routes
var postRoutes 			= require('./routes/post');
var authRoutes 			= require('./routes/auth');

// Controllers
var postCtrl 			= require('./controllers/post');
var listViewCtrl		= require('./controllers/list-posts');
var detailViewCtrl 		= require('./controllers/detail-view');
var postFormCtrl 		= require('./controllers/post-form');
var commentCtrl 		= require('./controllers/comment');
var commentFormCtrl 	= require('./controllers/comment-form');
var authCtrl 			= require('./controllers/auth');
var loginCtrl 			= require('./controllers/login-form');

// Directives
var postDirective 		= require('./directives/post');
var commentDirective 	= require('./directives/comment');
var authDirective 		= require('./directives/auth');
var postsLoaded 		= require('./directives/posts-loaded');

// Factories
var authInterceptor 	= require('./factories/auth-interceptor');
var authChangeNotifier 	= require('./factories/auth-change-notifier');

// Config
var interceptor 		= require('./config/interceptor');


//========
// Factory
//========

app.factory('authInterceptor', authInterceptor);
app.factory('authState', authChangeNotifier);


//=======
// Config
//=======

app.config(interceptor);


//=======
// Routes
//=======

app.config(postRoutes);
app.config(authRoutes);


//============
// Controllers
//============

app.controller('PostController', postCtrl);
app.controller('DetailViewController', detailViewCtrl);
app.controller('ListViewController', listViewCtrl);
app.controller('PostFormController', postFormCtrl);
app.controller('CommentController', commentCtrl);
app.controller('CommentFormController', commentFormCtrl);
app.controller('AuthController', authCtrl);
app.controller('LoginFormController', loginCtrl);


//===========
// Directives
//===========

app.directive('post', postDirective.post);
app.directive('postform', postDirective.form);
app.directive('comment', commentDirective.comment);
app.directive('commentform', commentDirective.commentForm);
app.directive('authheader', authDirective.authHeader);
app.directive('postsLoaded', postsLoaded);
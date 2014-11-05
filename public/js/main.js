(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Requires
var Comment = require('../../../models/comment');
var User = require('../../../models/user');

module.exports = [
	'$scope',
	'$http',
	'$routeParams',
	function ($scope, $http, $routeParams) {


		// List of all comments for this post
		$scope.comments = [];
		// Form model
		$scope.comment = new Comment();
		// ID of the post
		$scope.postId = $routeParams.id;
		// Dummy data for user
		$scope.dummy_user = new User({ name: 'Philipp', joined: Date.now() });


		//=====
		// LIST
		//=====

		this.list = function () {

			// Get comment list
			var req = $http.get('/api/comments/to/' + $scope.postId);
			req.success ( function (data, status, headers, config) {
				$scope.comments = data;
			});
			req.error (function (err) { console.log(err); });
		};


		//=======
		// CREATE
		//=======

		this.create = function () {

			// Initialize comment object
			$scope.comment.user = $scope.dummy_user;
			$scope.comment.postId = $scope.postId;

			// Push to the server
			var req = $http.post('/api/comment', $scope.comment);
			req.success ( function (data, status, headers, config) {
				$scope.comments.push(data);
			});
			req.error ( function (err) {
				console.log(err);
			});

			// Reset
			$scope.comment = {};
		}


		//=======
		// Answer
		//=======
		this.answer = function () {

		}


		//==============
		// Initial calls
		//==============

		this.list();
	}
];
},{"../../../models/comment":7,"../../../models/user":10}],2:[function(require,module,exports){
var Post = require('../../../models/post');
var Score = require('../../../models/score');
var User = require('../../../models/user');

module.exports = [
	'$scope',
	'$http',
	'$routeParams',
	function ($scope, $http, $routeParams) {

		// List of all posts
		$scope.posts = [];
		// Form model/Detail view
		$scope.post = new Post();
		// ID of the post
		$scope.postId = $routeParams.id;
		// Dummy data for user
		$scope.dummy_user = new User({ name: 'Philipp', joined: Date.now() });


		//=====
		// LIST
		//=====

		$scope.list = function () {

			// Get list of posts
			$http.get('/api/posts')
				.success ( function (data) {
					$scope.posts = data;
				})
				.error ( function (err) {
					console.log(err);
				});
		};


		//=====
		// Read
		//=====

		$scope.read = function () {

			// Get details of one post
			$http.get('/api/post/' + $routeParams.id)
				.success ( function (data) {
					$scope.post = new Post(data);
				})
				.error ( function (err) {
					console.log(err);
				});
		};


		//=======
		// Upvote
		//=======

		$scope.upvote = function (post) {
			var $post = new Post(post);
			$post.score.upvotes++;

			$http.put('/api/post/' + $post._id + '/upvote/', $post)
				.error ( function (err) {
					$post.score.upvotes--;
					console.log(err);
				});
		}


		//=========
		// Downvote
		//=========

		$scope.downvote = function (post) {
			var $post = new Post(post);
			$post.score.downvotes++;

			$http.put('/api/post/' + $post._id + '/downvote/', $post)
				.error ( function (err) {
					$post.score.downvotes--;
					console.log(err);
				});
		}


		//=========
		// Initiate
		//=========

		$scope.list();
	}
];
},{"../../../models/post":8,"../../../models/score":9,"../../../models/user":10}],3:[function(require,module,exports){
exports.comment = function () {
	return {
		templateUrl: '/comments/comment-template'
	};
};

exports.commentForm = function () {
	return {
		templateUrl: '/comments/comment-form'
	};
};
},{}],4:[function(require,module,exports){
module.exports = function () {
	return {
		templateUrl: '/posts/post-template'
	};
};
},{}],5:[function(require,module,exports){
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
},{"./controllers/comment":1,"./controllers/post":2,"./directives/comment":3,"./directives/post":4,"./routes/post":6}],6:[function(require,module,exports){
module.exports = [
	'$routeProvider',
	function ($routeProvider) {
		$routeProvider.
		
			// List of all posts
			when('/', {
				templateUrl: '/posts/list',
				controller: 'PostController'
			}).

			// List of specific post
			when('/post/:id', {
				templateUrl: function ($params) {
					return '/posts/post/' + $params.id
				},
				controller: 'PostController'
			}).

			// Error
			when('/404', {
				templateUrl: '/posts/404'
			}).
			otherwise( { redirectTo: '/404' })
	}
];
},{}],7:[function(require,module,exports){
var User 	= require('./user');
var Score 	= require('./score');
var extend = require('extend');

//=====
// Data model of a comment
//=====
module.exports = function (constructor) {
	var $scope = this;

	var DEFAULT = {
		text: '',
		parent: null,
		posted: Date.now(),
		user: new User(),
		score: new Score(),
		postId: -1
	}
	
	return extend($scope, DEFAULT, constructor);
};
},{"./score":9,"./user":10,"extend":11}],8:[function(require,module,exports){
var User 	= require('./user');
var Score 	= require('./score');
var extend = require('extend');

// Data model of a post
module.exports = function (constructor){

	var $scope = this;

	var DEFAULT = {
		title: '',
		text: '',
		image: '',
		posted: Date.now(),
		score: new Score(),
		user: new User()
	}

	return extend($scope, DEFAULT, constructor);
};
},{"./score":9,"./user":10,"extend":11}],9:[function(require,module,exports){
var extend = require('extend');

// Score model
module.exports = function (constructor){
	var $scope = this;

	var DEFAULT = {
		upvotes: 0,
		downvotes: 0,
		get: function (){
			return $scope.upvotes - $scope.downvotes;
		}
	}

	return extend($scope, DEFAULT, constructor);
}
},{"extend":11}],10:[function(require,module,exports){
var extend = require('extend');

// User model
module.exports = function (constructor){

	var $scope = this;

	var DEFAULT = {
		name: '',
		joined: Date.now()
	}

	return extend($scope, DEFAULT, constructor);
};
},{"extend":11}],11:[function(require,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;
var undefined;

var isPlainObject = function isPlainObject(obj) {
	'use strict';
	if (!obj || toString.call(obj) !== '[object Object]') {
		return false;
	}

	var has_own_constructor = hasOwn.call(obj, 'constructor');
	var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {}

	return key === undefined || hasOwn.call(obj, key);
};

module.exports = function extend() {
	'use strict';
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = extend(deep, clone, copy);

				// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxHaXRIdWJcXFJlZGRpdF9DbG9uZVxcZnJvbnRlbmRcXGJ1aWxkc3lzdGVtXFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvY29udHJvbGxlcnMvY29tbWVudC5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvY29udHJvbGxlcnMvcG9zdC5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvZGlyZWN0aXZlcy9jb21tZW50LmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9kaXJlY3RpdmVzL3Bvc3QuanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL21haW4uanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL3JvdXRlcy9wb3N0LmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9tb2RlbHMvY29tbWVudC5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvbW9kZWxzL3Bvc3QuanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL21vZGVscy9zY29yZS5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvbW9kZWxzL3VzZXIuanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL25vZGVfbW9kdWxlcy9leHRlbmQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gUmVxdWlyZXNcclxudmFyIENvbW1lbnQgPSByZXF1aXJlKCcuLi8uLi8uLi9tb2RlbHMvY29tbWVudCcpO1xyXG52YXIgVXNlciA9IHJlcXVpcmUoJy4uLy4uLy4uL21vZGVscy91c2VyJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcclxuXHQnJHNjb3BlJyxcclxuXHQnJGh0dHAnLFxyXG5cdCckcm91dGVQYXJhbXMnLFxyXG5cdGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMpIHtcclxuXHJcblxyXG5cdFx0Ly8gTGlzdCBvZiBhbGwgY29tbWVudHMgZm9yIHRoaXMgcG9zdFxyXG5cdFx0JHNjb3BlLmNvbW1lbnRzID0gW107XHJcblx0XHQvLyBGb3JtIG1vZGVsXHJcblx0XHQkc2NvcGUuY29tbWVudCA9IG5ldyBDb21tZW50KCk7XHJcblx0XHQvLyBJRCBvZiB0aGUgcG9zdFxyXG5cdFx0JHNjb3BlLnBvc3RJZCA9ICRyb3V0ZVBhcmFtcy5pZDtcclxuXHRcdC8vIER1bW15IGRhdGEgZm9yIHVzZXJcclxuXHRcdCRzY29wZS5kdW1teV91c2VyID0gbmV3IFVzZXIoeyBuYW1lOiAnUGhpbGlwcCcsIGpvaW5lZDogRGF0ZS5ub3coKSB9KTtcclxuXHJcblxyXG5cdFx0Ly89PT09PVxyXG5cdFx0Ly8gTElTVFxyXG5cdFx0Ly89PT09PVxyXG5cclxuXHRcdHRoaXMubGlzdCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdC8vIEdldCBjb21tZW50IGxpc3RcclxuXHRcdFx0dmFyIHJlcSA9ICRodHRwLmdldCgnL2FwaS9jb21tZW50cy90by8nICsgJHNjb3BlLnBvc3RJZCk7XHJcblx0XHRcdHJlcS5zdWNjZXNzICggZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcblx0XHRcdFx0JHNjb3BlLmNvbW1lbnRzID0gZGF0YTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJlcS5lcnJvciAoZnVuY3Rpb24gKGVycikgeyBjb25zb2xlLmxvZyhlcnIpOyB9KTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdC8vPT09PT09PVxyXG5cdFx0Ly8gQ1JFQVRFXHJcblx0XHQvLz09PT09PT1cclxuXHJcblx0XHR0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdC8vIEluaXRpYWxpemUgY29tbWVudCBvYmplY3RcclxuXHRcdFx0JHNjb3BlLmNvbW1lbnQudXNlciA9ICRzY29wZS5kdW1teV91c2VyO1xyXG5cdFx0XHQkc2NvcGUuY29tbWVudC5wb3N0SWQgPSAkc2NvcGUucG9zdElkO1xyXG5cclxuXHRcdFx0Ly8gUHVzaCB0byB0aGUgc2VydmVyXHJcblx0XHRcdHZhciByZXEgPSAkaHR0cC5wb3N0KCcvYXBpL2NvbW1lbnQnLCAkc2NvcGUuY29tbWVudCk7XHJcblx0XHRcdHJlcS5zdWNjZXNzICggZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcblx0XHRcdFx0JHNjb3BlLmNvbW1lbnRzLnB1c2goZGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXEuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyBSZXNldFxyXG5cdFx0XHQkc2NvcGUuY29tbWVudCA9IHt9O1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLz09PT09PT1cclxuXHRcdC8vIEFuc3dlclxyXG5cdFx0Ly89PT09PT09XHJcblx0XHR0aGlzLmFuc3dlciA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PT09PT09PT1cclxuXHRcdC8vIEluaXRpYWwgY2FsbHNcclxuXHRcdC8vPT09PT09PT09PT09PT1cclxuXHJcblx0XHR0aGlzLmxpc3QoKTtcclxuXHR9XHJcbl07IiwidmFyIFBvc3QgPSByZXF1aXJlKCcuLi8uLi8uLi9tb2RlbHMvcG9zdCcpO1xyXG52YXIgU2NvcmUgPSByZXF1aXJlKCcuLi8uLi8uLi9tb2RlbHMvc2NvcmUnKTtcclxudmFyIFVzZXIgPSByZXF1aXJlKCcuLi8uLi8uLi9tb2RlbHMvdXNlcicpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRzY29wZScsXHJcblx0JyRodHRwJyxcclxuXHQnJHJvdXRlUGFyYW1zJyxcclxuXHRmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zKSB7XHJcblxyXG5cdFx0Ly8gTGlzdCBvZiBhbGwgcG9zdHNcclxuXHRcdCRzY29wZS5wb3N0cyA9IFtdO1xyXG5cdFx0Ly8gRm9ybSBtb2RlbC9EZXRhaWwgdmlld1xyXG5cdFx0JHNjb3BlLnBvc3QgPSBuZXcgUG9zdCgpO1xyXG5cdFx0Ly8gSUQgb2YgdGhlIHBvc3RcclxuXHRcdCRzY29wZS5wb3N0SWQgPSAkcm91dGVQYXJhbXMuaWQ7XHJcblx0XHQvLyBEdW1teSBkYXRhIGZvciB1c2VyXHJcblx0XHQkc2NvcGUuZHVtbXlfdXNlciA9IG5ldyBVc2VyKHsgbmFtZTogJ1BoaWxpcHAnLCBqb2luZWQ6IERhdGUubm93KCkgfSk7XHJcblxyXG5cclxuXHRcdC8vPT09PT1cclxuXHRcdC8vIExJU1RcclxuXHRcdC8vPT09PT1cclxuXHJcblx0XHQkc2NvcGUubGlzdCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdC8vIEdldCBsaXN0IG9mIHBvc3RzXHJcblx0XHRcdCRodHRwLmdldCgnL2FwaS9wb3N0cycpXHJcblx0XHRcdFx0LnN1Y2Nlc3MgKCBmdW5jdGlvbiAoZGF0YSkge1xyXG5cdFx0XHRcdFx0JHNjb3BlLnBvc3RzID0gZGF0YTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHQvLz09PT09XHJcblx0XHQvLyBSZWFkXHJcblx0XHQvLz09PT09XHJcblxyXG5cdFx0JHNjb3BlLnJlYWQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHQvLyBHZXQgZGV0YWlscyBvZiBvbmUgcG9zdFxyXG5cdFx0XHQkaHR0cC5nZXQoJy9hcGkvcG9zdC8nICsgJHJvdXRlUGFyYW1zLmlkKVxyXG5cdFx0XHRcdC5zdWNjZXNzICggZnVuY3Rpb24gKGRhdGEpIHtcclxuXHRcdFx0XHRcdCRzY29wZS5wb3N0ID0gbmV3IFBvc3QoZGF0YSk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0Ly89PT09PT09XHJcblx0XHQvLyBVcHZvdGVcclxuXHRcdC8vPT09PT09PVxyXG5cclxuXHRcdCRzY29wZS51cHZvdGUgPSBmdW5jdGlvbiAocG9zdCkge1xyXG5cdFx0XHR2YXIgJHBvc3QgPSBuZXcgUG9zdChwb3N0KTtcclxuXHRcdFx0JHBvc3Quc2NvcmUudXB2b3RlcysrO1xyXG5cclxuXHRcdFx0JGh0dHAucHV0KCcvYXBpL3Bvc3QvJyArICRwb3N0Ll9pZCArICcvdXB2b3RlLycsICRwb3N0KVxyXG5cdFx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdCRwb3N0LnNjb3JlLnVwdm90ZXMtLTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PT09XHJcblx0XHQvLyBEb3dudm90ZVxyXG5cdFx0Ly89PT09PT09PT1cclxuXHJcblx0XHQkc2NvcGUuZG93bnZvdGUgPSBmdW5jdGlvbiAocG9zdCkge1xyXG5cdFx0XHR2YXIgJHBvc3QgPSBuZXcgUG9zdChwb3N0KTtcclxuXHRcdFx0JHBvc3Quc2NvcmUuZG93bnZvdGVzKys7XHJcblxyXG5cdFx0XHQkaHR0cC5wdXQoJy9hcGkvcG9zdC8nICsgJHBvc3QuX2lkICsgJy9kb3dudm90ZS8nLCAkcG9zdClcclxuXHRcdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0XHQkcG9zdC5zY29yZS5kb3dudm90ZXMtLTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PT09XHJcblx0XHQvLyBJbml0aWF0ZVxyXG5cdFx0Ly89PT09PT09PT1cclxuXHJcblx0XHQkc2NvcGUubGlzdCgpO1xyXG5cdH1cclxuXTsiLCJleHBvcnRzLmNvbW1lbnQgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHRlbXBsYXRlVXJsOiAnL2NvbW1lbnRzL2NvbW1lbnQtdGVtcGxhdGUnXHJcblx0fTtcclxufTtcclxuXHJcbmV4cG9ydHMuY29tbWVudEZvcm0gPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHRlbXBsYXRlVXJsOiAnL2NvbW1lbnRzL2NvbW1lbnQtZm9ybSdcclxuXHR9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiB7XHJcblx0XHR0ZW1wbGF0ZVVybDogJy9wb3N0cy9wb3N0LXRlbXBsYXRlJ1xyXG5cdH07XHJcbn07IiwidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdyZWRkaXQnLCBbJ25nUm91dGUnXSk7XHJcblxyXG4vLz09PT09PT09XHJcbi8vIEltcG9ydHNcclxuLy89PT09PT09PVxyXG5cclxuLy8gUm91dGVzXHJcbnZhciBwb3N0Um91dGVzID0gcmVxdWlyZSgnLi9yb3V0ZXMvcG9zdCcpO1xyXG5cclxuLy8gQ29udHJvbGxlcnNcclxudmFyIHBvc3RDdHJsID0gcmVxdWlyZSgnLi9jb250cm9sbGVycy9wb3N0Jyk7XHJcbnZhciBjb21tZW50Q3RybCA9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvY29tbWVudCcpO1xyXG5cclxuLy8gRGlyZWN0aXZlc1xyXG52YXIgcG9zdERpcmVjdGl2ZSA9IHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9wb3N0Jyk7XHJcbnZhciBjb21tZW50RGlyZWN0aXZlID0gcmVxdWlyZSgnLi9kaXJlY3RpdmVzL2NvbW1lbnQnKTtcclxuXHJcblxyXG4vLz09PT09PT1cclxuLy8gUm91dGVzXHJcbi8vPT09PT09PVxyXG5cclxuYXBwLmNvbmZpZyhwb3N0Um91dGVzKTtcclxuXHJcblxyXG4vLz09PT09PT09PT09PVxyXG4vLyBDb250cm9sbGVyc1xyXG4vLz09PT09PT09PT09PVxyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ1Bvc3RDb250cm9sbGVyJywgcG9zdEN0cmwpO1xyXG5hcHAuY29udHJvbGxlcignQ29tbWVudENvbnRyb2xsZXInLCBjb21tZW50Q3RybCk7XHJcblxyXG5cclxuLy89PT09PT09PT09PVxyXG4vLyBEaXJlY3RpdmVzXHJcbi8vPT09PT09PT09PT1cclxuXHJcbmFwcC5kaXJlY3RpdmUoJ3Bvc3QnLCBwb3N0RGlyZWN0aXZlKTtcclxuYXBwLmRpcmVjdGl2ZSgnY29tbWVudCcsIGNvbW1lbnREaXJlY3RpdmUuY29tbWVudCk7XHJcbmFwcC5kaXJlY3RpdmUoJ2NvbW1lbnRmb3JtJywgY29tbWVudERpcmVjdGl2ZS5jb21tZW50Rm9ybSk7IiwibW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRyb3V0ZVByb3ZpZGVyJyxcclxuXHRmdW5jdGlvbiAoJHJvdXRlUHJvdmlkZXIpIHtcclxuXHRcdCRyb3V0ZVByb3ZpZGVyLlxyXG5cdFx0XHJcblx0XHRcdC8vIExpc3Qgb2YgYWxsIHBvc3RzXHJcblx0XHRcdHdoZW4oJy8nLCB7XHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvcG9zdHMvbGlzdCcsXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ1Bvc3RDb250cm9sbGVyJ1xyXG5cdFx0XHR9KS5cclxuXHJcblx0XHRcdC8vIExpc3Qgb2Ygc3BlY2lmaWMgcG9zdFxyXG5cdFx0XHR3aGVuKCcvcG9zdC86aWQnLCB7XHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6IGZ1bmN0aW9uICgkcGFyYW1zKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gJy9wb3N0cy9wb3N0LycgKyAkcGFyYW1zLmlkXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRjb250cm9sbGVyOiAnUG9zdENvbnRyb2xsZXInXHJcblx0XHRcdH0pLlxyXG5cclxuXHRcdFx0Ly8gRXJyb3JcclxuXHRcdFx0d2hlbignLzQwNCcsIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJy9wb3N0cy80MDQnXHJcblx0XHRcdH0pLlxyXG5cdFx0XHRvdGhlcndpc2UoIHsgcmVkaXJlY3RUbzogJy80MDQnIH0pXHJcblx0fVxyXG5dOyIsInZhciBVc2VyIFx0PSByZXF1aXJlKCcuL3VzZXInKTtcclxudmFyIFNjb3JlIFx0PSByZXF1aXJlKCcuL3Njb3JlJyk7XHJcbnZhciBleHRlbmQgPSByZXF1aXJlKCdleHRlbmQnKTtcclxuXHJcbi8vPT09PT1cclxuLy8gRGF0YSBtb2RlbCBvZiBhIGNvbW1lbnRcclxuLy89PT09PVxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb25zdHJ1Y3Rvcikge1xyXG5cdHZhciAkc2NvcGUgPSB0aGlzO1xyXG5cclxuXHR2YXIgREVGQVVMVCA9IHtcclxuXHRcdHRleHQ6ICcnLFxyXG5cdFx0cGFyZW50OiBudWxsLFxyXG5cdFx0cG9zdGVkOiBEYXRlLm5vdygpLFxyXG5cdFx0dXNlcjogbmV3IFVzZXIoKSxcclxuXHRcdHNjb3JlOiBuZXcgU2NvcmUoKSxcclxuXHRcdHBvc3RJZDogLTFcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIGV4dGVuZCgkc2NvcGUsIERFRkFVTFQsIGNvbnN0cnVjdG9yKTtcclxufTsiLCJ2YXIgVXNlciBcdD0gcmVxdWlyZSgnLi91c2VyJyk7XHJcbnZhciBTY29yZSBcdD0gcmVxdWlyZSgnLi9zY29yZScpO1xyXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgnZXh0ZW5kJyk7XHJcblxyXG4vLyBEYXRhIG1vZGVsIG9mIGEgcG9zdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb25zdHJ1Y3Rvcil7XHJcblxyXG5cdHZhciAkc2NvcGUgPSB0aGlzO1xyXG5cclxuXHR2YXIgREVGQVVMVCA9IHtcclxuXHRcdHRpdGxlOiAnJyxcclxuXHRcdHRleHQ6ICcnLFxyXG5cdFx0aW1hZ2U6ICcnLFxyXG5cdFx0cG9zdGVkOiBEYXRlLm5vdygpLFxyXG5cdFx0c2NvcmU6IG5ldyBTY29yZSgpLFxyXG5cdFx0dXNlcjogbmV3IFVzZXIoKVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIGV4dGVuZCgkc2NvcGUsIERFRkFVTFQsIGNvbnN0cnVjdG9yKTtcclxufTsiLCJ2YXIgZXh0ZW5kID0gcmVxdWlyZSgnZXh0ZW5kJyk7XHJcblxyXG4vLyBTY29yZSBtb2RlbFxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb25zdHJ1Y3Rvcil7XHJcblx0dmFyICRzY29wZSA9IHRoaXM7XHJcblxyXG5cdHZhciBERUZBVUxUID0ge1xyXG5cdFx0dXB2b3RlczogMCxcclxuXHRcdGRvd252b3RlczogMCxcclxuXHRcdGdldDogZnVuY3Rpb24gKCl7XHJcblx0XHRcdHJldHVybiAkc2NvcGUudXB2b3RlcyAtICRzY29wZS5kb3dudm90ZXM7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gZXh0ZW5kKCRzY29wZSwgREVGQVVMVCwgY29uc3RydWN0b3IpO1xyXG59IiwidmFyIGV4dGVuZCA9IHJlcXVpcmUoJ2V4dGVuZCcpO1xyXG5cclxuLy8gVXNlciBtb2RlbFxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb25zdHJ1Y3Rvcil7XHJcblxyXG5cdHZhciAkc2NvcGUgPSB0aGlzO1xyXG5cclxuXHR2YXIgREVGQVVMVCA9IHtcclxuXHRcdG5hbWU6ICcnLFxyXG5cdFx0am9pbmVkOiBEYXRlLm5vdygpXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gZXh0ZW5kKCRzY29wZSwgREVGQVVMVCwgY29uc3RydWN0b3IpO1xyXG59OyIsInZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciB1bmRlZmluZWQ7XG5cbnZhciBpc1BsYWluT2JqZWN0ID0gZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmopIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRpZiAoIW9iaiB8fCB0b1N0cmluZy5jYWxsKG9iaikgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0dmFyIGhhc19vd25fY29uc3RydWN0b3IgPSBoYXNPd24uY2FsbChvYmosICdjb25zdHJ1Y3RvcicpO1xuXHR2YXIgaGFzX2lzX3Byb3BlcnR5X29mX21ldGhvZCA9IG9iai5jb25zdHJ1Y3RvciAmJiBvYmouY29uc3RydWN0b3IucHJvdG90eXBlICYmIGhhc093bi5jYWxsKG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsICdpc1Byb3RvdHlwZU9mJyk7XG5cdC8vIE5vdCBvd24gY29uc3RydWN0b3IgcHJvcGVydHkgbXVzdCBiZSBPYmplY3Rcblx0aWYgKG9iai5jb25zdHJ1Y3RvciAmJiAhaGFzX293bl9jb25zdHJ1Y3RvciAmJiAhaGFzX2lzX3Byb3BlcnR5X29mX21ldGhvZCkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIE93biBwcm9wZXJ0aWVzIGFyZSBlbnVtZXJhdGVkIGZpcnN0bHksIHNvIHRvIHNwZWVkIHVwLFxuXHQvLyBpZiBsYXN0IG9uZSBpcyBvd24sIHRoZW4gYWxsIHByb3BlcnRpZXMgYXJlIG93bi5cblx0dmFyIGtleTtcblx0Zm9yIChrZXkgaW4gb2JqKSB7fVxuXG5cdHJldHVybiBrZXkgPT09IHVuZGVmaW5lZCB8fCBoYXNPd24uY2FsbChvYmosIGtleSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGV4dGVuZCgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgb3B0aW9ucywgbmFtZSwgc3JjLCBjb3B5LCBjb3B5SXNBcnJheSwgY2xvbmUsXG5cdFx0dGFyZ2V0ID0gYXJndW1lbnRzWzBdLFxuXHRcdGkgPSAxLFxuXHRcdGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsXG5cdFx0ZGVlcCA9IGZhbHNlO1xuXG5cdC8vIEhhbmRsZSBhIGRlZXAgY29weSBzaXR1YXRpb25cblx0aWYgKHR5cGVvZiB0YXJnZXQgPT09ICdib29sZWFuJykge1xuXHRcdGRlZXAgPSB0YXJnZXQ7XG5cdFx0dGFyZ2V0ID0gYXJndW1lbnRzWzFdIHx8IHt9O1xuXHRcdC8vIHNraXAgdGhlIGJvb2xlYW4gYW5kIHRoZSB0YXJnZXRcblx0XHRpID0gMjtcblx0fSBlbHNlIGlmICgodHlwZW9mIHRhcmdldCAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIHRhcmdldCAhPT0gJ2Z1bmN0aW9uJykgfHwgdGFyZ2V0ID09IG51bGwpIHtcblx0XHR0YXJnZXQgPSB7fTtcblx0fVxuXG5cdGZvciAoOyBpIDwgbGVuZ3RoOyArK2kpIHtcblx0XHRvcHRpb25zID0gYXJndW1lbnRzW2ldO1xuXHRcdC8vIE9ubHkgZGVhbCB3aXRoIG5vbi1udWxsL3VuZGVmaW5lZCB2YWx1ZXNcblx0XHRpZiAob3B0aW9ucyAhPSBudWxsKSB7XG5cdFx0XHQvLyBFeHRlbmQgdGhlIGJhc2Ugb2JqZWN0XG5cdFx0XHRmb3IgKG5hbWUgaW4gb3B0aW9ucykge1xuXHRcdFx0XHRzcmMgPSB0YXJnZXRbbmFtZV07XG5cdFx0XHRcdGNvcHkgPSBvcHRpb25zW25hbWVdO1xuXG5cdFx0XHRcdC8vIFByZXZlbnQgbmV2ZXItZW5kaW5nIGxvb3Bcblx0XHRcdFx0aWYgKHRhcmdldCA9PT0gY29weSkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gUmVjdXJzZSBpZiB3ZSdyZSBtZXJnaW5nIHBsYWluIG9iamVjdHMgb3IgYXJyYXlzXG5cdFx0XHRcdGlmIChkZWVwICYmIGNvcHkgJiYgKGlzUGxhaW5PYmplY3QoY29weSkgfHwgKGNvcHlJc0FycmF5ID0gQXJyYXkuaXNBcnJheShjb3B5KSkpKSB7XG5cdFx0XHRcdFx0aWYgKGNvcHlJc0FycmF5KSB7XG5cdFx0XHRcdFx0XHRjb3B5SXNBcnJheSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0Y2xvbmUgPSBzcmMgJiYgQXJyYXkuaXNBcnJheShzcmMpID8gc3JjIDogW107XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGNsb25lID0gc3JjICYmIGlzUGxhaW5PYmplY3Qoc3JjKSA/IHNyYyA6IHt9O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIE5ldmVyIG1vdmUgb3JpZ2luYWwgb2JqZWN0cywgY2xvbmUgdGhlbVxuXHRcdFx0XHRcdHRhcmdldFtuYW1lXSA9IGV4dGVuZChkZWVwLCBjbG9uZSwgY29weSk7XG5cblx0XHRcdFx0Ly8gRG9uJ3QgYnJpbmcgaW4gdW5kZWZpbmVkIHZhbHVlc1xuXHRcdFx0XHR9IGVsc2UgaWYgKGNvcHkgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHRhcmdldFtuYW1lXSA9IGNvcHk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBSZXR1cm4gdGhlIG1vZGlmaWVkIG9iamVjdFxuXHRyZXR1cm4gdGFyZ2V0O1xufTtcblxuIl19

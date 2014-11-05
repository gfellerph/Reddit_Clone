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
			console.log($scope);
			var template = {};
			var req = $http.get('/comments/comment-template');
			req.success = function ( data ) {
				template = data;
				console.log(template);
				$(document).prepend(template);
			}
		}


		//=======
		// Upvote
		//=======
		
		this.upvote = function (comment) {
			var $comment = new Comment(comment);

			$comment.score.upvotes++;
			$http.put('/api/comment/' + $comment._id + '/upvote', $comment)
			.error ( function (err) {
				$comment.score.upvotes--;
				console.log(err);
			});
		}


		//=========
		// Downvote
		//=========
		
		this.downvote = function (comment) {
			var $comment = new Comment(comment);

			$comment.score.downvotes++;
			$http.put('/api/comment/' + $comment._id + '/downvote', $comment)
			.error ( function (err) {
				$comment.score.downvotes--;
				console.log(err);
			});
		}


		//==============
		// Initial calls
		//==============

		this.list();
	}
];
},{"../../../models/comment":8,"../../../models/user":11}],2:[function(require,module,exports){
var Post = require('../../../models/post');
var Score = require('../../../models/score');
var User = require('../../../models/user');

module.exports = [
	'$scope',
	'$http',
	'$routeParams',
	function ($scope, $http, $routeParams) {

		// Form model/Detail view
		$scope.post = new Post();
		// ID of the post
		$scope.postId = $routeParams.id;
		// Dummy data for user
		$scope.dummy_user = new User({ name: 'Philipp', joined: Date.now() });


		//=====
		// Read
		//=====

		$scope.read = function () {

			// Get details of one post
			$http.get('/api/post/' + $routeParams.id)
				.success ( function (data) {
					$scope.post = new Post(data);
					console.log($scope.post);
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

		$scope.read();
	}
];
},{"../../../models/post":9,"../../../models/score":10,"../../../models/user":11}],3:[function(require,module,exports){
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


		//=======
		// CREATE
		//=======

		$scope.create = function (post) {
			console.log('create post', post);
			var $post = new Post(post);
			$http.post('/api/post', $post)
				.success ( function (data) {
					$scope.posts.push(data);
				})
				.error ( function (err) {
					console.log(err);
				});
		}


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
},{"../../../models/post":9,"../../../models/score":10,"../../../models/user":11}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
module.exports.list = function () {
	return {
		templateUrl: '/posts/post-template',
		link: function (scope, element, attrs) {
			console.log(element);
		}
	};
};

module.exports.detail = function () {
	return {
		templateUrl: '/posts/post-detail',
		link: function (scope, element, attrs) {
			console.log(element);
		}
	};
};

module.exports.form = function () {
	return {
		templateUrl: '/posts/post-form',
		link: function (scope, element, attrs) {
			console.log(element);
		}
	};
};
},{}],6:[function(require,module,exports){
var app = angular.module('reddit', ['ngRoute']);

//========
// Imports
//========

// Routes
var postRoutes = require('./routes/post');

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
},{"./controllers/comment":1,"./controllers/post":3,"./controllers/post-detail":2,"./directives/comment":4,"./directives/post":5,"./routes/post":7}],7:[function(require,module,exports){
module.exports = [
	'$routeProvider',
	function ($routeProvider) {
		$routeProvider.
		
			// List of all posts
			when('/', {
				templateUrl: '/posts/list',
				controller: 'PostController'
			}).

			// Detail of specific post
			when('/post/:id', {
				templateUrl: function ($params) {
					return '/posts/post/' + $params.id
				},
				controller: 'PostDetailController'
			}).

			// Error
			when('/404', {
				templateUrl: '/posts/404'
			}).
			otherwise( { redirectTo: '/404' })
	}
];
},{}],8:[function(require,module,exports){
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
},{"./score":10,"./user":11,"extend":12}],9:[function(require,module,exports){
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
},{"./score":10,"./user":11,"extend":12}],10:[function(require,module,exports){
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
},{"extend":12}],11:[function(require,module,exports){
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
},{"extend":12}],12:[function(require,module,exports){
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


},{}]},{},[6])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6XFxVc2Vyc1xcUGhpbGlwcCBHZmVsbGVyXFxEb2N1bWVudHNcXEdpdEh1YlxcUmVkZGl0X0Nsb25lXFxmcm9udGVuZFxcYnVpbGRzeXN0ZW1cXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiYzovVXNlcnMvUGhpbGlwcCBHZmVsbGVyL0RvY3VtZW50cy9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL2NvbnRyb2xsZXJzL2NvbW1lbnQuanMiLCJjOi9Vc2Vycy9QaGlsaXBwIEdmZWxsZXIvRG9jdW1lbnRzL0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvY29udHJvbGxlcnMvcG9zdC1kZXRhaWwuanMiLCJjOi9Vc2Vycy9QaGlsaXBwIEdmZWxsZXIvRG9jdW1lbnRzL0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvY29udHJvbGxlcnMvcG9zdC5qcyIsImM6L1VzZXJzL1BoaWxpcHAgR2ZlbGxlci9Eb2N1bWVudHMvR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9kaXJlY3RpdmVzL2NvbW1lbnQuanMiLCJjOi9Vc2Vycy9QaGlsaXBwIEdmZWxsZXIvRG9jdW1lbnRzL0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvZGlyZWN0aXZlcy9wb3N0LmpzIiwiYzovVXNlcnMvUGhpbGlwcCBHZmVsbGVyL0RvY3VtZW50cy9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL21haW4uanMiLCJjOi9Vc2Vycy9QaGlsaXBwIEdmZWxsZXIvRG9jdW1lbnRzL0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvcm91dGVzL3Bvc3QuanMiLCJjOi9Vc2Vycy9QaGlsaXBwIEdmZWxsZXIvRG9jdW1lbnRzL0dpdEh1Yi9SZWRkaXRfQ2xvbmUvbW9kZWxzL2NvbW1lbnQuanMiLCJjOi9Vc2Vycy9QaGlsaXBwIEdmZWxsZXIvRG9jdW1lbnRzL0dpdEh1Yi9SZWRkaXRfQ2xvbmUvbW9kZWxzL3Bvc3QuanMiLCJjOi9Vc2Vycy9QaGlsaXBwIEdmZWxsZXIvRG9jdW1lbnRzL0dpdEh1Yi9SZWRkaXRfQ2xvbmUvbW9kZWxzL3Njb3JlLmpzIiwiYzovVXNlcnMvUGhpbGlwcCBHZmVsbGVyL0RvY3VtZW50cy9HaXRIdWIvUmVkZGl0X0Nsb25lL21vZGVscy91c2VyLmpzIiwiYzovVXNlcnMvUGhpbGlwcCBHZmVsbGVyL0RvY3VtZW50cy9HaXRIdWIvUmVkZGl0X0Nsb25lL25vZGVfbW9kdWxlcy9leHRlbmQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIFJlcXVpcmVzXHJcbnZhciBDb21tZW50ID0gcmVxdWlyZSgnLi4vLi4vLi4vbW9kZWxzL2NvbW1lbnQnKTtcclxudmFyIFVzZXIgPSByZXF1aXJlKCcuLi8uLi8uLi9tb2RlbHMvdXNlcicpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRzY29wZScsXHJcblx0JyRodHRwJyxcclxuXHQnJHJvdXRlUGFyYW1zJyxcclxuXHRmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zKSB7XHJcblxyXG5cclxuXHRcdC8vIExpc3Qgb2YgYWxsIGNvbW1lbnRzIGZvciB0aGlzIHBvc3RcclxuXHRcdCRzY29wZS5jb21tZW50cyA9IFtdO1xyXG5cdFx0Ly8gRm9ybSBtb2RlbFxyXG5cdFx0JHNjb3BlLmNvbW1lbnQgPSBuZXcgQ29tbWVudCgpO1xyXG5cdFx0Ly8gSUQgb2YgdGhlIHBvc3RcclxuXHRcdCRzY29wZS5wb3N0SWQgPSAkcm91dGVQYXJhbXMuaWQ7XHJcblx0XHQvLyBEdW1teSBkYXRhIGZvciB1c2VyXHJcblx0XHQkc2NvcGUuZHVtbXlfdXNlciA9IG5ldyBVc2VyKHsgbmFtZTogJ1BoaWxpcHAnLCBqb2luZWQ6IERhdGUubm93KCkgfSk7XHJcblxyXG5cclxuXHRcdC8vPT09PT1cclxuXHRcdC8vIExJU1RcclxuXHRcdC8vPT09PT1cclxuXHJcblx0XHR0aGlzLmxpc3QgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHQvLyBHZXQgY29tbWVudCBsaXN0XHJcblx0XHRcdHZhciByZXEgPSAkaHR0cC5nZXQoJy9hcGkvY29tbWVudHMvdG8vJyArICRzY29wZS5wb3N0SWQpO1xyXG5cdFx0XHRyZXEuc3VjY2VzcyAoIGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG5cdFx0XHRcdCRzY29wZS5jb21tZW50cyA9IGRhdGE7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXEuZXJyb3IgKGZ1bmN0aW9uIChlcnIpIHsgY29uc29sZS5sb2coZXJyKTsgfSk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHQvLz09PT09PT1cclxuXHRcdC8vIENSRUFURVxyXG5cdFx0Ly89PT09PT09XHJcblxyXG5cdFx0dGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHQvLyBJbml0aWFsaXplIGNvbW1lbnQgb2JqZWN0XHJcblx0XHRcdCRzY29wZS5jb21tZW50LnVzZXIgPSAkc2NvcGUuZHVtbXlfdXNlcjtcclxuXHRcdFx0JHNjb3BlLmNvbW1lbnQucG9zdElkID0gJHNjb3BlLnBvc3RJZDtcclxuXHJcblx0XHRcdC8vIFB1c2ggdG8gdGhlIHNlcnZlclxyXG5cdFx0XHR2YXIgcmVxID0gJGh0dHAucG9zdCgnL2FwaS9jb21tZW50JywgJHNjb3BlLmNvbW1lbnQpO1xyXG5cdFx0XHRyZXEuc3VjY2VzcyAoIGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG5cdFx0XHRcdCRzY29wZS5jb21tZW50cy5wdXNoKGRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmVxLmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly8gUmVzZXRcclxuXHRcdFx0JHNjb3BlLmNvbW1lbnQgPSB7fTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly89PT09PT09XHJcblx0XHQvLyBBbnN3ZXJcclxuXHRcdC8vPT09PT09PVxyXG5cclxuXHRcdHRoaXMuYW5zd2VyID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZygkc2NvcGUpO1xyXG5cdFx0XHR2YXIgdGVtcGxhdGUgPSB7fTtcclxuXHRcdFx0dmFyIHJlcSA9ICRodHRwLmdldCgnL2NvbW1lbnRzL2NvbW1lbnQtdGVtcGxhdGUnKTtcclxuXHRcdFx0cmVxLnN1Y2Nlc3MgPSBmdW5jdGlvbiAoIGRhdGEgKSB7XHJcblx0XHRcdFx0dGVtcGxhdGUgPSBkYXRhO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHRlbXBsYXRlKTtcclxuXHRcdFx0XHQkKGRvY3VtZW50KS5wcmVwZW5kKHRlbXBsYXRlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLz09PT09PT1cclxuXHRcdC8vIFVwdm90ZVxyXG5cdFx0Ly89PT09PT09XHJcblx0XHRcclxuXHRcdHRoaXMudXB2b3RlID0gZnVuY3Rpb24gKGNvbW1lbnQpIHtcclxuXHRcdFx0dmFyICRjb21tZW50ID0gbmV3IENvbW1lbnQoY29tbWVudCk7XHJcblxyXG5cdFx0XHQkY29tbWVudC5zY29yZS51cHZvdGVzKys7XHJcblx0XHRcdCRodHRwLnB1dCgnL2FwaS9jb21tZW50LycgKyAkY29tbWVudC5faWQgKyAnL3Vwdm90ZScsICRjb21tZW50KVxyXG5cdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0JGNvbW1lbnQuc2NvcmUudXB2b3Rlcy0tO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLz09PT09PT09PVxyXG5cdFx0Ly8gRG93bnZvdGVcclxuXHRcdC8vPT09PT09PT09XHJcblx0XHRcclxuXHRcdHRoaXMuZG93bnZvdGUgPSBmdW5jdGlvbiAoY29tbWVudCkge1xyXG5cdFx0XHR2YXIgJGNvbW1lbnQgPSBuZXcgQ29tbWVudChjb21tZW50KTtcclxuXHJcblx0XHRcdCRjb21tZW50LnNjb3JlLmRvd252b3RlcysrO1xyXG5cdFx0XHQkaHR0cC5wdXQoJy9hcGkvY29tbWVudC8nICsgJGNvbW1lbnQuX2lkICsgJy9kb3dudm90ZScsICRjb21tZW50KVxyXG5cdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0JGNvbW1lbnQuc2NvcmUuZG93bnZvdGVzLS07XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PT09PT09PT1cclxuXHRcdC8vIEluaXRpYWwgY2FsbHNcclxuXHRcdC8vPT09PT09PT09PT09PT1cclxuXHJcblx0XHR0aGlzLmxpc3QoKTtcclxuXHR9XHJcbl07IiwidmFyIFBvc3QgPSByZXF1aXJlKCcuLi8uLi8uLi9tb2RlbHMvcG9zdCcpO1xyXG52YXIgU2NvcmUgPSByZXF1aXJlKCcuLi8uLi8uLi9tb2RlbHMvc2NvcmUnKTtcclxudmFyIFVzZXIgPSByZXF1aXJlKCcuLi8uLi8uLi9tb2RlbHMvdXNlcicpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRzY29wZScsXHJcblx0JyRodHRwJyxcclxuXHQnJHJvdXRlUGFyYW1zJyxcclxuXHRmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zKSB7XHJcblxyXG5cdFx0Ly8gRm9ybSBtb2RlbC9EZXRhaWwgdmlld1xyXG5cdFx0JHNjb3BlLnBvc3QgPSBuZXcgUG9zdCgpO1xyXG5cdFx0Ly8gSUQgb2YgdGhlIHBvc3RcclxuXHRcdCRzY29wZS5wb3N0SWQgPSAkcm91dGVQYXJhbXMuaWQ7XHJcblx0XHQvLyBEdW1teSBkYXRhIGZvciB1c2VyXHJcblx0XHQkc2NvcGUuZHVtbXlfdXNlciA9IG5ldyBVc2VyKHsgbmFtZTogJ1BoaWxpcHAnLCBqb2luZWQ6IERhdGUubm93KCkgfSk7XHJcblxyXG5cclxuXHRcdC8vPT09PT1cclxuXHRcdC8vIFJlYWRcclxuXHRcdC8vPT09PT1cclxuXHJcblx0XHQkc2NvcGUucmVhZCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdC8vIEdldCBkZXRhaWxzIG9mIG9uZSBwb3N0XHJcblx0XHRcdCRodHRwLmdldCgnL2FwaS9wb3N0LycgKyAkcm91dGVQYXJhbXMuaWQpXHJcblx0XHRcdFx0LnN1Y2Nlc3MgKCBmdW5jdGlvbiAoZGF0YSkge1xyXG5cdFx0XHRcdFx0JHNjb3BlLnBvc3QgPSBuZXcgUG9zdChkYXRhKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCRzY29wZS5wb3N0KTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHQvLz09PT09PT1cclxuXHRcdC8vIFVwdm90ZVxyXG5cdFx0Ly89PT09PT09XHJcblxyXG5cdFx0JHNjb3BlLnVwdm90ZSA9IGZ1bmN0aW9uIChwb3N0KSB7XHJcblx0XHRcdHZhciAkcG9zdCA9IG5ldyBQb3N0KHBvc3QpO1xyXG5cdFx0XHQkcG9zdC5zY29yZS51cHZvdGVzKys7XHJcblxyXG5cdFx0XHQkaHR0cC5wdXQoJy9hcGkvcG9zdC8nICsgJHBvc3QuX2lkICsgJy91cHZvdGUvJywgJHBvc3QpXHJcblx0XHRcdFx0LmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0JHBvc3Quc2NvcmUudXB2b3Rlcy0tO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly89PT09PT09PT1cclxuXHRcdC8vIERvd252b3RlXHJcblx0XHQvLz09PT09PT09PVxyXG5cclxuXHRcdCRzY29wZS5kb3dudm90ZSA9IGZ1bmN0aW9uIChwb3N0KSB7XHJcblx0XHRcdHZhciAkcG9zdCA9IG5ldyBQb3N0KHBvc3QpO1xyXG5cdFx0XHQkcG9zdC5zY29yZS5kb3dudm90ZXMrKztcclxuXHJcblx0XHRcdCRodHRwLnB1dCgnL2FwaS9wb3N0LycgKyAkcG9zdC5faWQgKyAnL2Rvd252b3RlLycsICRwb3N0KVxyXG5cdFx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdCRwb3N0LnNjb3JlLmRvd252b3Rlcy0tO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly89PT09PT09PT1cclxuXHRcdC8vIEluaXRpYXRlXHJcblx0XHQvLz09PT09PT09PVxyXG5cclxuXHRcdCRzY29wZS5yZWFkKCk7XHJcblx0fVxyXG5dOyIsInZhciBQb3N0ID0gcmVxdWlyZSgnLi4vLi4vLi4vbW9kZWxzL3Bvc3QnKTtcclxudmFyIFNjb3JlID0gcmVxdWlyZSgnLi4vLi4vLi4vbW9kZWxzL3Njb3JlJyk7XHJcbnZhciBVc2VyID0gcmVxdWlyZSgnLi4vLi4vLi4vbW9kZWxzL3VzZXInKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gW1xyXG5cdCckc2NvcGUnLFxyXG5cdCckaHR0cCcsXHJcblx0JyRyb3V0ZVBhcmFtcycsXHJcblx0ZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcykge1xyXG5cclxuXHRcdC8vIExpc3Qgb2YgYWxsIHBvc3RzXHJcblx0XHQkc2NvcGUucG9zdHMgPSBbXTtcclxuXHRcdC8vIEZvcm0gbW9kZWwvRGV0YWlsIHZpZXdcclxuXHRcdCRzY29wZS5wb3N0ID0gbmV3IFBvc3QoKTtcclxuXHRcdC8vIElEIG9mIHRoZSBwb3N0XHJcblx0XHQkc2NvcGUucG9zdElkID0gJHJvdXRlUGFyYW1zLmlkO1xyXG5cdFx0Ly8gRHVtbXkgZGF0YSBmb3IgdXNlclxyXG5cdFx0JHNjb3BlLmR1bW15X3VzZXIgPSBuZXcgVXNlcih7IG5hbWU6ICdQaGlsaXBwJywgam9pbmVkOiBEYXRlLm5vdygpIH0pO1xyXG5cclxuXHJcblx0XHQvLz09PT09XHJcblx0XHQvLyBMSVNUXHJcblx0XHQvLz09PT09XHJcblxyXG5cdFx0JHNjb3BlLmxpc3QgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHQvLyBHZXQgbGlzdCBvZiBwb3N0c1xyXG5cdFx0XHQkaHR0cC5nZXQoJy9hcGkvcG9zdHMnKVxyXG5cdFx0XHRcdC5zdWNjZXNzICggZnVuY3Rpb24gKGRhdGEpIHtcclxuXHRcdFx0XHRcdCRzY29wZS5wb3N0cyA9IGRhdGE7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0Ly89PT09PT09XHJcblx0XHQvLyBDUkVBVEVcclxuXHRcdC8vPT09PT09PVxyXG5cclxuXHRcdCRzY29wZS5jcmVhdGUgPSBmdW5jdGlvbiAocG9zdCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZygnY3JlYXRlIHBvc3QnLCBwb3N0KTtcclxuXHRcdFx0dmFyICRwb3N0ID0gbmV3IFBvc3QocG9zdCk7XHJcblx0XHRcdCRodHRwLnBvc3QoJy9hcGkvcG9zdCcsICRwb3N0KVxyXG5cdFx0XHRcdC5zdWNjZXNzICggZnVuY3Rpb24gKGRhdGEpIHtcclxuXHRcdFx0XHRcdCRzY29wZS5wb3N0cy5wdXNoKGRhdGEpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly89PT09PT09XHJcblx0XHQvLyBVcHZvdGVcclxuXHRcdC8vPT09PT09PVxyXG5cclxuXHRcdCRzY29wZS51cHZvdGUgPSBmdW5jdGlvbiAocG9zdCkge1xyXG5cdFx0XHR2YXIgJHBvc3QgPSBuZXcgUG9zdChwb3N0KTtcclxuXHRcdFx0JHBvc3Quc2NvcmUudXB2b3RlcysrO1xyXG5cclxuXHRcdFx0JGh0dHAucHV0KCcvYXBpL3Bvc3QvJyArICRwb3N0Ll9pZCArICcvdXB2b3RlLycsICRwb3N0KVxyXG5cdFx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdCRwb3N0LnNjb3JlLnVwdm90ZXMtLTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PT09XHJcblx0XHQvLyBEb3dudm90ZVxyXG5cdFx0Ly89PT09PT09PT1cclxuXHJcblx0XHQkc2NvcGUuZG93bnZvdGUgPSBmdW5jdGlvbiAocG9zdCkge1xyXG5cdFx0XHR2YXIgJHBvc3QgPSBuZXcgUG9zdChwb3N0KTtcclxuXHRcdFx0JHBvc3Quc2NvcmUuZG93bnZvdGVzKys7XHJcblxyXG5cdFx0XHQkaHR0cC5wdXQoJy9hcGkvcG9zdC8nICsgJHBvc3QuX2lkICsgJy9kb3dudm90ZS8nLCAkcG9zdClcclxuXHRcdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0XHQkcG9zdC5zY29yZS5kb3dudm90ZXMtLTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PT09XHJcblx0XHQvLyBJbml0aWF0ZVxyXG5cdFx0Ly89PT09PT09PT1cclxuXHJcblx0XHQkc2NvcGUubGlzdCgpO1xyXG5cdH1cclxuXTsiLCJleHBvcnRzLmNvbW1lbnQgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHRlbXBsYXRlVXJsOiAnL2NvbW1lbnRzL2NvbW1lbnQtdGVtcGxhdGUnXHJcblx0fTtcclxufTtcclxuXHJcbmV4cG9ydHMuY29tbWVudEZvcm0gPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHRlbXBsYXRlVXJsOiAnL2NvbW1lbnRzL2NvbW1lbnQtZm9ybSdcclxuXHR9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzLmxpc3QgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHRlbXBsYXRlVXJsOiAnL3Bvc3RzL3Bvc3QtdGVtcGxhdGUnLFxyXG5cdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlbGVtZW50KTtcclxuXHRcdH1cclxuXHR9O1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuZGV0YWlsID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiB7XHJcblx0XHR0ZW1wbGF0ZVVybDogJy9wb3N0cy9wb3N0LWRldGFpbCcsXHJcblx0XHRsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGVsZW1lbnQpO1xyXG5cdFx0fVxyXG5cdH07XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5mb3JtID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiB7XHJcblx0XHR0ZW1wbGF0ZVVybDogJy9wb3N0cy9wb3N0LWZvcm0nLFxyXG5cdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlbGVtZW50KTtcclxuXHRcdH1cclxuXHR9O1xyXG59OyIsInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgncmVkZGl0JywgWyduZ1JvdXRlJ10pO1xyXG5cclxuLy89PT09PT09PVxyXG4vLyBJbXBvcnRzXHJcbi8vPT09PT09PT1cclxuXHJcbi8vIFJvdXRlc1xyXG52YXIgcG9zdFJvdXRlcyA9IHJlcXVpcmUoJy4vcm91dGVzL3Bvc3QnKTtcclxuXHJcbi8vIENvbnRyb2xsZXJzXHJcbnZhciBwb3N0Q3RybCA9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvcG9zdCcpO1xyXG52YXIgcG9zdERldGFpbEN0cmwgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL3Bvc3QtZGV0YWlsJyk7XHJcbnZhciBjb21tZW50Q3RybCA9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvY29tbWVudCcpO1xyXG5cclxuLy8gRGlyZWN0aXZlc1xyXG52YXIgcG9zdERpcmVjdGl2ZSA9IHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9wb3N0Jyk7XHJcbnZhciBjb21tZW50RGlyZWN0aXZlID0gcmVxdWlyZSgnLi9kaXJlY3RpdmVzL2NvbW1lbnQnKTtcclxuXHJcblxyXG4vLz09PT09PT1cclxuLy8gUm91dGVzXHJcbi8vPT09PT09PVxyXG5cclxuYXBwLmNvbmZpZyhwb3N0Um91dGVzKTtcclxuXHJcblxyXG4vLz09PT09PT09PT09PVxyXG4vLyBDb250cm9sbGVyc1xyXG4vLz09PT09PT09PT09PVxyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ1Bvc3RDb250cm9sbGVyJywgcG9zdEN0cmwpO1xyXG5hcHAuY29udHJvbGxlcignUG9zdERldGFpbENvbnRyb2xsZXInLCBwb3N0RGV0YWlsQ3RybCk7XHJcbmFwcC5jb250cm9sbGVyKCdDb21tZW50Q29udHJvbGxlcicsIGNvbW1lbnRDdHJsKTtcclxuXHJcblxyXG4vLz09PT09PT09PT09XHJcbi8vIERpcmVjdGl2ZXNcclxuLy89PT09PT09PT09PVxyXG5cclxuYXBwLmRpcmVjdGl2ZSgncG9zdCcsIHBvc3REaXJlY3RpdmUubGlzdCk7XHJcbmFwcC5kaXJlY3RpdmUoJ3Bvc3RkZXRhaWwnLCBwb3N0RGlyZWN0aXZlLmRldGFpbCk7XHJcbmFwcC5kaXJlY3RpdmUoJ3Bvc3Rmb3JtJywgcG9zdERpcmVjdGl2ZS5mb3JtKTtcclxuYXBwLmRpcmVjdGl2ZSgnY29tbWVudCcsIGNvbW1lbnREaXJlY3RpdmUuY29tbWVudCk7XHJcbmFwcC5kaXJlY3RpdmUoJ2NvbW1lbnRmb3JtJywgY29tbWVudERpcmVjdGl2ZS5jb21tZW50Rm9ybSk7IiwibW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRyb3V0ZVByb3ZpZGVyJyxcclxuXHRmdW5jdGlvbiAoJHJvdXRlUHJvdmlkZXIpIHtcclxuXHRcdCRyb3V0ZVByb3ZpZGVyLlxyXG5cdFx0XHJcblx0XHRcdC8vIExpc3Qgb2YgYWxsIHBvc3RzXHJcblx0XHRcdHdoZW4oJy8nLCB7XHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvcG9zdHMvbGlzdCcsXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ1Bvc3RDb250cm9sbGVyJ1xyXG5cdFx0XHR9KS5cclxuXHJcblx0XHRcdC8vIERldGFpbCBvZiBzcGVjaWZpYyBwb3N0XHJcblx0XHRcdHdoZW4oJy9wb3N0LzppZCcsIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogZnVuY3Rpb24gKCRwYXJhbXMpIHtcclxuXHRcdFx0XHRcdHJldHVybiAnL3Bvc3RzL3Bvc3QvJyArICRwYXJhbXMuaWRcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdQb3N0RGV0YWlsQ29udHJvbGxlcidcclxuXHRcdFx0fSkuXHJcblxyXG5cdFx0XHQvLyBFcnJvclxyXG5cdFx0XHR3aGVuKCcvNDA0Jywge1xyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3Bvc3RzLzQwNCdcclxuXHRcdFx0fSkuXHJcblx0XHRcdG90aGVyd2lzZSggeyByZWRpcmVjdFRvOiAnLzQwNCcgfSlcclxuXHR9XHJcbl07IiwidmFyIFVzZXIgXHQ9IHJlcXVpcmUoJy4vdXNlcicpO1xyXG52YXIgU2NvcmUgXHQ9IHJlcXVpcmUoJy4vc2NvcmUnKTtcclxudmFyIGV4dGVuZCA9IHJlcXVpcmUoJ2V4dGVuZCcpO1xyXG5cclxuLy89PT09PVxyXG4vLyBEYXRhIG1vZGVsIG9mIGEgY29tbWVudFxyXG4vLz09PT09XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvbnN0cnVjdG9yKSB7XHJcblx0dmFyICRzY29wZSA9IHRoaXM7XHJcblxyXG5cdHZhciBERUZBVUxUID0ge1xyXG5cdFx0dGV4dDogJycsXHJcblx0XHRwYXJlbnQ6IG51bGwsXHJcblx0XHRwb3N0ZWQ6IERhdGUubm93KCksXHJcblx0XHR1c2VyOiBuZXcgVXNlcigpLFxyXG5cdFx0c2NvcmU6IG5ldyBTY29yZSgpLFxyXG5cdFx0cG9zdElkOiAtMVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gZXh0ZW5kKCRzY29wZSwgREVGQVVMVCwgY29uc3RydWN0b3IpO1xyXG59OyIsInZhciBVc2VyIFx0PSByZXF1aXJlKCcuL3VzZXInKTtcclxudmFyIFNjb3JlIFx0PSByZXF1aXJlKCcuL3Njb3JlJyk7XHJcbnZhciBleHRlbmQgPSByZXF1aXJlKCdleHRlbmQnKTtcclxuXHJcbi8vIERhdGEgbW9kZWwgb2YgYSBwb3N0XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvbnN0cnVjdG9yKXtcclxuXHJcblx0dmFyICRzY29wZSA9IHRoaXM7XHJcblxyXG5cdHZhciBERUZBVUxUID0ge1xyXG5cdFx0dGl0bGU6ICcnLFxyXG5cdFx0dGV4dDogJycsXHJcblx0XHRpbWFnZTogJycsXHJcblx0XHRwb3N0ZWQ6IERhdGUubm93KCksXHJcblx0XHRzY29yZTogbmV3IFNjb3JlKCksXHJcblx0XHR1c2VyOiBuZXcgVXNlcigpXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gZXh0ZW5kKCRzY29wZSwgREVGQVVMVCwgY29uc3RydWN0b3IpO1xyXG59OyIsInZhciBleHRlbmQgPSByZXF1aXJlKCdleHRlbmQnKTtcclxuXHJcbi8vIFNjb3JlIG1vZGVsXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvbnN0cnVjdG9yKXtcclxuXHR2YXIgJHNjb3BlID0gdGhpcztcclxuXHJcblx0dmFyIERFRkFVTFQgPSB7XHJcblx0XHR1cHZvdGVzOiAwLFxyXG5cdFx0ZG93bnZvdGVzOiAwLFxyXG5cdFx0Z2V0OiBmdW5jdGlvbiAoKXtcclxuXHRcdFx0cmV0dXJuICRzY29wZS51cHZvdGVzIC0gJHNjb3BlLmRvd252b3RlcztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBleHRlbmQoJHNjb3BlLCBERUZBVUxULCBjb25zdHJ1Y3Rvcik7XHJcbn0iLCJ2YXIgZXh0ZW5kID0gcmVxdWlyZSgnZXh0ZW5kJyk7XHJcblxyXG4vLyBVc2VyIG1vZGVsXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvbnN0cnVjdG9yKXtcclxuXHJcblx0dmFyICRzY29wZSA9IHRoaXM7XHJcblxyXG5cdHZhciBERUZBVUxUID0ge1xyXG5cdFx0bmFtZTogJycsXHJcblx0XHRqb2luZWQ6IERhdGUubm93KClcclxuXHR9XHJcblxyXG5cdHJldHVybiBleHRlbmQoJHNjb3BlLCBERUZBVUxULCBjb25zdHJ1Y3Rvcik7XHJcbn07IiwidmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIHVuZGVmaW5lZDtcblxudmFyIGlzUGxhaW5PYmplY3QgPSBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iaikge1xuXHQndXNlIHN0cmljdCc7XG5cdGlmICghb2JqIHx8IHRvU3RyaW5nLmNhbGwob2JqKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHR2YXIgaGFzX293bl9jb25zdHJ1Y3RvciA9IGhhc093bi5jYWxsKG9iaiwgJ2NvbnN0cnVjdG9yJyk7XG5cdHZhciBoYXNfaXNfcHJvcGVydHlfb2ZfbWV0aG9kID0gb2JqLmNvbnN0cnVjdG9yICYmIG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgJiYgaGFzT3duLmNhbGwob2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSwgJ2lzUHJvdG90eXBlT2YnKTtcblx0Ly8gTm90IG93biBjb25zdHJ1Y3RvciBwcm9wZXJ0eSBtdXN0IGJlIE9iamVjdFxuXHRpZiAob2JqLmNvbnN0cnVjdG9yICYmICFoYXNfb3duX2NvbnN0cnVjdG9yICYmICFoYXNfaXNfcHJvcGVydHlfb2ZfbWV0aG9kKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly8gT3duIHByb3BlcnRpZXMgYXJlIGVudW1lcmF0ZWQgZmlyc3RseSwgc28gdG8gc3BlZWQgdXAsXG5cdC8vIGlmIGxhc3Qgb25lIGlzIG93biwgdGhlbiBhbGwgcHJvcGVydGllcyBhcmUgb3duLlxuXHR2YXIga2V5O1xuXHRmb3IgKGtleSBpbiBvYmopIHt9XG5cblx0cmV0dXJuIGtleSA9PT0gdW5kZWZpbmVkIHx8IGhhc093bi5jYWxsKG9iaiwga2V5KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXh0ZW5kKCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBvcHRpb25zLCBuYW1lLCBzcmMsIGNvcHksIGNvcHlJc0FycmF5LCBjbG9uZSxcblx0XHR0YXJnZXQgPSBhcmd1bWVudHNbMF0sXG5cdFx0aSA9IDEsXG5cdFx0bGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCxcblx0XHRkZWVwID0gZmFsc2U7XG5cblx0Ly8gSGFuZGxlIGEgZGVlcCBjb3B5IHNpdHVhdGlvblxuXHRpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0ZGVlcCA9IHRhcmdldDtcblx0XHR0YXJnZXQgPSBhcmd1bWVudHNbMV0gfHwge307XG5cdFx0Ly8gc2tpcCB0aGUgYm9vbGVhbiBhbmQgdGhlIHRhcmdldFxuXHRcdGkgPSAyO1xuXHR9IGVsc2UgaWYgKCh0eXBlb2YgdGFyZ2V0ICE9PSAnb2JqZWN0JyAmJiB0eXBlb2YgdGFyZ2V0ICE9PSAnZnVuY3Rpb24nKSB8fCB0YXJnZXQgPT0gbnVsbCkge1xuXHRcdHRhcmdldCA9IHt9O1xuXHR9XG5cblx0Zm9yICg7IGkgPCBsZW5ndGg7ICsraSkge1xuXHRcdG9wdGlvbnMgPSBhcmd1bWVudHNbaV07XG5cdFx0Ly8gT25seSBkZWFsIHdpdGggbm9uLW51bGwvdW5kZWZpbmVkIHZhbHVlc1xuXHRcdGlmIChvcHRpb25zICE9IG51bGwpIHtcblx0XHRcdC8vIEV4dGVuZCB0aGUgYmFzZSBvYmplY3Rcblx0XHRcdGZvciAobmFtZSBpbiBvcHRpb25zKSB7XG5cdFx0XHRcdHNyYyA9IHRhcmdldFtuYW1lXTtcblx0XHRcdFx0Y29weSA9IG9wdGlvbnNbbmFtZV07XG5cblx0XHRcdFx0Ly8gUHJldmVudCBuZXZlci1lbmRpbmcgbG9vcFxuXHRcdFx0XHRpZiAodGFyZ2V0ID09PSBjb3B5KSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBSZWN1cnNlIGlmIHdlJ3JlIG1lcmdpbmcgcGxhaW4gb2JqZWN0cyBvciBhcnJheXNcblx0XHRcdFx0aWYgKGRlZXAgJiYgY29weSAmJiAoaXNQbGFpbk9iamVjdChjb3B5KSB8fCAoY29weUlzQXJyYXkgPSBBcnJheS5pc0FycmF5KGNvcHkpKSkpIHtcblx0XHRcdFx0XHRpZiAoY29weUlzQXJyYXkpIHtcblx0XHRcdFx0XHRcdGNvcHlJc0FycmF5ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRjbG9uZSA9IHNyYyAmJiBBcnJheS5pc0FycmF5KHNyYykgPyBzcmMgOiBbXTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y2xvbmUgPSBzcmMgJiYgaXNQbGFpbk9iamVjdChzcmMpID8gc3JjIDoge307XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gTmV2ZXIgbW92ZSBvcmlnaW5hbCBvYmplY3RzLCBjbG9uZSB0aGVtXG5cdFx0XHRcdFx0dGFyZ2V0W25hbWVdID0gZXh0ZW5kKGRlZXAsIGNsb25lLCBjb3B5KTtcblxuXHRcdFx0XHQvLyBEb24ndCBicmluZyBpbiB1bmRlZmluZWQgdmFsdWVzXG5cdFx0XHRcdH0gZWxzZSBpZiAoY29weSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0dGFyZ2V0W25hbWVdID0gY29weTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFJldHVybiB0aGUgbW9kaWZpZWQgb2JqZWN0XG5cdHJldHVybiB0YXJnZXQ7XG59O1xuXG4iXX0=

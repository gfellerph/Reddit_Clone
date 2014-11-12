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
},{"../../../models/comment":9,"../../../models/user":12}],2:[function(require,module,exports){
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
},{"../../../models/post":10,"../../../models/score":11,"../../../models/user":12}],3:[function(require,module,exports){
var Post = require('../../../models/post');
var Score = require('../../../models/score');
var User = require('../../../models/user');

module.exports = [
	'$scope',
	'$http',
	'$routeParams',
	'$firebase',
	function ($scope, $http, $routeParams, $firebase) {

		var ref = new Firebase("https://dazzling-torch-4816.firebaseio.com/");
		var sync = $firebase(ref);
		console.log(sync);

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
},{"../../../models/post":10,"../../../models/score":11,"../../../models/user":12}],4:[function(require,module,exports){
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
var app = angular.module('reddit', ['ngRoute', 'firebase']);

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
},{"./controllers/comment":1,"./controllers/post":3,"./controllers/post-detail":2,"./directives/comment":4,"./directives/post":5,"./routes/auth":7,"./routes/post":8}],7:[function(require,module,exports){
module.exports = [
	'$routeProvider',
	function ($routeProvider) {
		$routeProvider.
		
			// List of all posts
			when('/auth', {
				templateUrl: '/auth/login'
				//,controller: 'AuthController'
			}).

			// Detail of specific post
			when('/auth/register', {
				templateUrl: '/auth/register'
				//,controller: 'AuthController'
			}).
			
			otherwise( { redirectTo: '/404' })
	}
];
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
},{"./score":11,"./user":12,"extend":13}],10:[function(require,module,exports){
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
},{"./score":11,"./user":12,"extend":13}],11:[function(require,module,exports){
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
},{"extend":13}],12:[function(require,module,exports){
var extend = require('extend');

// User model
module.exports = function (constructor){

	var $scope = this;

	var DEFAULT = {
		password: '',
		username: '',
		email: '',
		joined: Date.now()
	}

	return extend($scope, DEFAULT, constructor);
};
},{"extend":13}],13:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6XFxVc2Vyc1xcUGhpbGlwcCBHZmVsbGVyXFxEb2N1bWVudHNcXEdpdEh1YlxcUmVkZGl0X0Nsb25lXFxmcm9udGVuZFxcYnVpbGRzeXN0ZW1cXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiYzovVXNlcnMvUGhpbGlwcCBHZmVsbGVyL0RvY3VtZW50cy9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL2NvbnRyb2xsZXJzL2NvbW1lbnQuanMiLCJjOi9Vc2Vycy9QaGlsaXBwIEdmZWxsZXIvRG9jdW1lbnRzL0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvY29udHJvbGxlcnMvcG9zdC1kZXRhaWwuanMiLCJjOi9Vc2Vycy9QaGlsaXBwIEdmZWxsZXIvRG9jdW1lbnRzL0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvY29udHJvbGxlcnMvcG9zdC5qcyIsImM6L1VzZXJzL1BoaWxpcHAgR2ZlbGxlci9Eb2N1bWVudHMvR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9kaXJlY3RpdmVzL2NvbW1lbnQuanMiLCJjOi9Vc2Vycy9QaGlsaXBwIEdmZWxsZXIvRG9jdW1lbnRzL0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvZGlyZWN0aXZlcy9wb3N0LmpzIiwiYzovVXNlcnMvUGhpbGlwcCBHZmVsbGVyL0RvY3VtZW50cy9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL21haW4uanMiLCJjOi9Vc2Vycy9QaGlsaXBwIEdmZWxsZXIvRG9jdW1lbnRzL0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvcm91dGVzL2F1dGguanMiLCJjOi9Vc2Vycy9QaGlsaXBwIEdmZWxsZXIvRG9jdW1lbnRzL0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvcm91dGVzL3Bvc3QuanMiLCJjOi9Vc2Vycy9QaGlsaXBwIEdmZWxsZXIvRG9jdW1lbnRzL0dpdEh1Yi9SZWRkaXRfQ2xvbmUvbW9kZWxzL2NvbW1lbnQuanMiLCJjOi9Vc2Vycy9QaGlsaXBwIEdmZWxsZXIvRG9jdW1lbnRzL0dpdEh1Yi9SZWRkaXRfQ2xvbmUvbW9kZWxzL3Bvc3QuanMiLCJjOi9Vc2Vycy9QaGlsaXBwIEdmZWxsZXIvRG9jdW1lbnRzL0dpdEh1Yi9SZWRkaXRfQ2xvbmUvbW9kZWxzL3Njb3JlLmpzIiwiYzovVXNlcnMvUGhpbGlwcCBHZmVsbGVyL0RvY3VtZW50cy9HaXRIdWIvUmVkZGl0X0Nsb25lL21vZGVscy91c2VyLmpzIiwiYzovVXNlcnMvUGhpbGlwcCBHZmVsbGVyL0RvY3VtZW50cy9HaXRIdWIvUmVkZGl0X0Nsb25lL25vZGVfbW9kdWxlcy9leHRlbmQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIFJlcXVpcmVzXHJcbnZhciBDb21tZW50ID0gcmVxdWlyZSgnLi4vLi4vLi4vbW9kZWxzL2NvbW1lbnQnKTtcclxudmFyIFVzZXIgPSByZXF1aXJlKCcuLi8uLi8uLi9tb2RlbHMvdXNlcicpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRzY29wZScsXHJcblx0JyRodHRwJyxcclxuXHQnJHJvdXRlUGFyYW1zJyxcclxuXHRmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zKSB7XHJcblxyXG5cclxuXHRcdC8vIExpc3Qgb2YgYWxsIGNvbW1lbnRzIGZvciB0aGlzIHBvc3RcclxuXHRcdCRzY29wZS5jb21tZW50cyA9IFtdO1xyXG5cdFx0Ly8gRm9ybSBtb2RlbFxyXG5cdFx0JHNjb3BlLmNvbW1lbnQgPSBuZXcgQ29tbWVudCgpO1xyXG5cdFx0Ly8gSUQgb2YgdGhlIHBvc3RcclxuXHRcdCRzY29wZS5wb3N0SWQgPSAkcm91dGVQYXJhbXMuaWQ7XHJcblx0XHQvLyBEdW1teSBkYXRhIGZvciB1c2VyXHJcblx0XHQkc2NvcGUuZHVtbXlfdXNlciA9IG5ldyBVc2VyKHsgbmFtZTogJ1BoaWxpcHAnLCBqb2luZWQ6IERhdGUubm93KCkgfSk7XHJcblxyXG5cclxuXHRcdC8vPT09PT1cclxuXHRcdC8vIExJU1RcclxuXHRcdC8vPT09PT1cclxuXHJcblx0XHR0aGlzLmxpc3QgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHQvLyBHZXQgY29tbWVudCBsaXN0XHJcblx0XHRcdHZhciByZXEgPSAkaHR0cC5nZXQoJy9hcGkvY29tbWVudHMvdG8vJyArICRzY29wZS5wb3N0SWQpO1xyXG5cdFx0XHRyZXEuc3VjY2VzcyAoIGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG5cdFx0XHRcdCRzY29wZS5jb21tZW50cyA9IGRhdGE7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXEuZXJyb3IgKGZ1bmN0aW9uIChlcnIpIHsgY29uc29sZS5sb2coZXJyKTsgfSk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHQvLz09PT09PT1cclxuXHRcdC8vIENSRUFURVxyXG5cdFx0Ly89PT09PT09XHJcblxyXG5cdFx0dGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHQvLyBJbml0aWFsaXplIGNvbW1lbnQgb2JqZWN0XHJcblx0XHRcdCRzY29wZS5jb21tZW50LnVzZXIgPSAkc2NvcGUuZHVtbXlfdXNlcjtcclxuXHRcdFx0JHNjb3BlLmNvbW1lbnQucG9zdElkID0gJHNjb3BlLnBvc3RJZDtcclxuXHJcblx0XHRcdC8vIFB1c2ggdG8gdGhlIHNlcnZlclxyXG5cdFx0XHR2YXIgcmVxID0gJGh0dHAucG9zdCgnL2FwaS9jb21tZW50JywgJHNjb3BlLmNvbW1lbnQpO1xyXG5cdFx0XHRyZXEuc3VjY2VzcyAoIGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG5cdFx0XHRcdCRzY29wZS5jb21tZW50cy5wdXNoKGRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmVxLmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly8gUmVzZXRcclxuXHRcdFx0JHNjb3BlLmNvbW1lbnQgPSB7fTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly89PT09PT09XHJcblx0XHQvLyBBbnN3ZXJcclxuXHRcdC8vPT09PT09PVxyXG5cclxuXHRcdHRoaXMuYW5zd2VyID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZygkc2NvcGUpO1xyXG5cdFx0XHR2YXIgdGVtcGxhdGUgPSB7fTtcclxuXHRcdFx0dmFyIHJlcSA9ICRodHRwLmdldCgnL2NvbW1lbnRzL2NvbW1lbnQtdGVtcGxhdGUnKTtcclxuXHRcdFx0cmVxLnN1Y2Nlc3MgPSBmdW5jdGlvbiAoIGRhdGEgKSB7XHJcblx0XHRcdFx0dGVtcGxhdGUgPSBkYXRhO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHRlbXBsYXRlKTtcclxuXHRcdFx0XHQkKGRvY3VtZW50KS5wcmVwZW5kKHRlbXBsYXRlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLz09PT09PT1cclxuXHRcdC8vIFVwdm90ZVxyXG5cdFx0Ly89PT09PT09XHJcblx0XHRcclxuXHRcdHRoaXMudXB2b3RlID0gZnVuY3Rpb24gKGNvbW1lbnQpIHtcclxuXHRcdFx0dmFyICRjb21tZW50ID0gbmV3IENvbW1lbnQoY29tbWVudCk7XHJcblxyXG5cdFx0XHQkY29tbWVudC5zY29yZS51cHZvdGVzKys7XHJcblx0XHRcdCRodHRwLnB1dCgnL2FwaS9jb21tZW50LycgKyAkY29tbWVudC5faWQgKyAnL3Vwdm90ZScsICRjb21tZW50KVxyXG5cdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0JGNvbW1lbnQuc2NvcmUudXB2b3Rlcy0tO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLz09PT09PT09PVxyXG5cdFx0Ly8gRG93bnZvdGVcclxuXHRcdC8vPT09PT09PT09XHJcblx0XHRcclxuXHRcdHRoaXMuZG93bnZvdGUgPSBmdW5jdGlvbiAoY29tbWVudCkge1xyXG5cdFx0XHR2YXIgJGNvbW1lbnQgPSBuZXcgQ29tbWVudChjb21tZW50KTtcclxuXHJcblx0XHRcdCRjb21tZW50LnNjb3JlLmRvd252b3RlcysrO1xyXG5cdFx0XHQkaHR0cC5wdXQoJy9hcGkvY29tbWVudC8nICsgJGNvbW1lbnQuX2lkICsgJy9kb3dudm90ZScsICRjb21tZW50KVxyXG5cdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0JGNvbW1lbnQuc2NvcmUuZG93bnZvdGVzLS07XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PT09PT09PT1cclxuXHRcdC8vIEluaXRpYWwgY2FsbHNcclxuXHRcdC8vPT09PT09PT09PT09PT1cclxuXHJcblx0XHR0aGlzLmxpc3QoKTtcclxuXHR9XHJcbl07IiwidmFyIFBvc3QgPSByZXF1aXJlKCcuLi8uLi8uLi9tb2RlbHMvcG9zdCcpO1xyXG52YXIgU2NvcmUgPSByZXF1aXJlKCcuLi8uLi8uLi9tb2RlbHMvc2NvcmUnKTtcclxudmFyIFVzZXIgPSByZXF1aXJlKCcuLi8uLi8uLi9tb2RlbHMvdXNlcicpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRzY29wZScsXHJcblx0JyRodHRwJyxcclxuXHQnJHJvdXRlUGFyYW1zJyxcclxuXHRmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zKSB7XHJcblxyXG5cdFx0Ly8gRm9ybSBtb2RlbC9EZXRhaWwgdmlld1xyXG5cdFx0JHNjb3BlLnBvc3QgPSBuZXcgUG9zdCgpO1xyXG5cdFx0Ly8gSUQgb2YgdGhlIHBvc3RcclxuXHRcdCRzY29wZS5wb3N0SWQgPSAkcm91dGVQYXJhbXMuaWQ7XHJcblx0XHQvLyBEdW1teSBkYXRhIGZvciB1c2VyXHJcblx0XHQkc2NvcGUuZHVtbXlfdXNlciA9IG5ldyBVc2VyKHsgbmFtZTogJ1BoaWxpcHAnLCBqb2luZWQ6IERhdGUubm93KCkgfSk7XHJcblxyXG5cclxuXHRcdC8vPT09PT1cclxuXHRcdC8vIFJlYWRcclxuXHRcdC8vPT09PT1cclxuXHJcblx0XHQkc2NvcGUucmVhZCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdC8vIEdldCBkZXRhaWxzIG9mIG9uZSBwb3N0XHJcblx0XHRcdCRodHRwLmdldCgnL2FwaS9wb3N0LycgKyAkcm91dGVQYXJhbXMuaWQpXHJcblx0XHRcdFx0LnN1Y2Nlc3MgKCBmdW5jdGlvbiAoZGF0YSkge1xyXG5cdFx0XHRcdFx0JHNjb3BlLnBvc3QgPSBuZXcgUG9zdChkYXRhKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCRzY29wZS5wb3N0KTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHQvLz09PT09PT1cclxuXHRcdC8vIFVwdm90ZVxyXG5cdFx0Ly89PT09PT09XHJcblxyXG5cdFx0JHNjb3BlLnVwdm90ZSA9IGZ1bmN0aW9uIChwb3N0KSB7XHJcblx0XHRcdHZhciAkcG9zdCA9IG5ldyBQb3N0KHBvc3QpO1xyXG5cdFx0XHQkcG9zdC5zY29yZS51cHZvdGVzKys7XHJcblxyXG5cdFx0XHQkaHR0cC5wdXQoJy9hcGkvcG9zdC8nICsgJHBvc3QuX2lkICsgJy91cHZvdGUvJywgJHBvc3QpXHJcblx0XHRcdFx0LmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0JHBvc3Quc2NvcmUudXB2b3Rlcy0tO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly89PT09PT09PT1cclxuXHRcdC8vIERvd252b3RlXHJcblx0XHQvLz09PT09PT09PVxyXG5cclxuXHRcdCRzY29wZS5kb3dudm90ZSA9IGZ1bmN0aW9uIChwb3N0KSB7XHJcblx0XHRcdHZhciAkcG9zdCA9IG5ldyBQb3N0KHBvc3QpO1xyXG5cdFx0XHQkcG9zdC5zY29yZS5kb3dudm90ZXMrKztcclxuXHJcblx0XHRcdCRodHRwLnB1dCgnL2FwaS9wb3N0LycgKyAkcG9zdC5faWQgKyAnL2Rvd252b3RlLycsICRwb3N0KVxyXG5cdFx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdCRwb3N0LnNjb3JlLmRvd252b3Rlcy0tO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly89PT09PT09PT1cclxuXHRcdC8vIEluaXRpYXRlXHJcblx0XHQvLz09PT09PT09PVxyXG5cclxuXHRcdCRzY29wZS5yZWFkKCk7XHJcblx0fVxyXG5dOyIsInZhciBQb3N0ID0gcmVxdWlyZSgnLi4vLi4vLi4vbW9kZWxzL3Bvc3QnKTtcclxudmFyIFNjb3JlID0gcmVxdWlyZSgnLi4vLi4vLi4vbW9kZWxzL3Njb3JlJyk7XHJcbnZhciBVc2VyID0gcmVxdWlyZSgnLi4vLi4vLi4vbW9kZWxzL3VzZXInKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gW1xyXG5cdCckc2NvcGUnLFxyXG5cdCckaHR0cCcsXHJcblx0JyRyb3V0ZVBhcmFtcycsXHJcblx0JyRmaXJlYmFzZScsXHJcblx0ZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJGZpcmViYXNlKSB7XHJcblxyXG5cdFx0dmFyIHJlZiA9IG5ldyBGaXJlYmFzZShcImh0dHBzOi8vZGF6emxpbmctdG9yY2gtNDgxNi5maXJlYmFzZWlvLmNvbS9cIik7XHJcblx0XHR2YXIgc3luYyA9ICRmaXJlYmFzZShyZWYpO1xyXG5cdFx0Y29uc29sZS5sb2coc3luYyk7XHJcblxyXG5cdFx0Ly8gTGlzdCBvZiBhbGwgcG9zdHNcclxuXHRcdCRzY29wZS5wb3N0cyA9IFtdO1xyXG5cdFx0Ly8gRm9ybSBtb2RlbC9EZXRhaWwgdmlld1xyXG5cdFx0JHNjb3BlLnBvc3QgPSBuZXcgUG9zdCgpO1xyXG5cdFx0Ly8gSUQgb2YgdGhlIHBvc3RcclxuXHRcdCRzY29wZS5wb3N0SWQgPSAkcm91dGVQYXJhbXMuaWQ7XHJcblx0XHQvLyBEdW1teSBkYXRhIGZvciB1c2VyXHJcblx0XHQkc2NvcGUuZHVtbXlfdXNlciA9IG5ldyBVc2VyKHsgbmFtZTogJ1BoaWxpcHAnLCBqb2luZWQ6IERhdGUubm93KCkgfSk7XHJcblxyXG5cclxuXHRcdC8vPT09PT1cclxuXHRcdC8vIExJU1RcclxuXHRcdC8vPT09PT1cclxuXHJcblx0XHQkc2NvcGUubGlzdCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdC8vIEdldCBsaXN0IG9mIHBvc3RzXHJcblx0XHRcdCRodHRwLmdldCgnL2FwaS9wb3N0cycpXHJcblx0XHRcdFx0LnN1Y2Nlc3MgKCBmdW5jdGlvbiAoZGF0YSkge1xyXG5cdFx0XHRcdFx0JHNjb3BlLnBvc3RzID0gZGF0YTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHQvLz09PT09PT1cclxuXHRcdC8vIENSRUFURVxyXG5cdFx0Ly89PT09PT09XHJcblxyXG5cdFx0JHNjb3BlLmNyZWF0ZSA9IGZ1bmN0aW9uIChwb3N0KSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdjcmVhdGUgcG9zdCcsIHBvc3QpO1xyXG5cdFx0XHR2YXIgJHBvc3QgPSBuZXcgUG9zdChwb3N0KTtcclxuXHRcdFx0JGh0dHAucG9zdCgnL2FwaS9wb3N0JywgJHBvc3QpXHJcblx0XHRcdFx0LnN1Y2Nlc3MgKCBmdW5jdGlvbiAoZGF0YSkge1xyXG5cdFx0XHRcdFx0JHNjb3BlLnBvc3RzLnB1c2goZGF0YSk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLz09PT09PT1cclxuXHRcdC8vIFVwdm90ZVxyXG5cdFx0Ly89PT09PT09XHJcblxyXG5cdFx0JHNjb3BlLnVwdm90ZSA9IGZ1bmN0aW9uIChwb3N0KSB7XHJcblx0XHRcdHZhciAkcG9zdCA9IG5ldyBQb3N0KHBvc3QpO1xyXG5cdFx0XHQkcG9zdC5zY29yZS51cHZvdGVzKys7XHJcblxyXG5cdFx0XHQkaHR0cC5wdXQoJy9hcGkvcG9zdC8nICsgJHBvc3QuX2lkICsgJy91cHZvdGUvJywgJHBvc3QpXHJcblx0XHRcdFx0LmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0JHBvc3Quc2NvcmUudXB2b3Rlcy0tO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly89PT09PT09PT1cclxuXHRcdC8vIERvd252b3RlXHJcblx0XHQvLz09PT09PT09PVxyXG5cclxuXHRcdCRzY29wZS5kb3dudm90ZSA9IGZ1bmN0aW9uIChwb3N0KSB7XHJcblx0XHRcdHZhciAkcG9zdCA9IG5ldyBQb3N0KHBvc3QpO1xyXG5cdFx0XHQkcG9zdC5zY29yZS5kb3dudm90ZXMrKztcclxuXHJcblx0XHRcdCRodHRwLnB1dCgnL2FwaS9wb3N0LycgKyAkcG9zdC5faWQgKyAnL2Rvd252b3RlLycsICRwb3N0KVxyXG5cdFx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdCRwb3N0LnNjb3JlLmRvd252b3Rlcy0tO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly89PT09PT09PT1cclxuXHRcdC8vIEluaXRpYXRlXHJcblx0XHQvLz09PT09PT09PVxyXG5cclxuXHRcdCRzY29wZS5saXN0KCk7XHJcblx0fVxyXG5dOyIsImV4cG9ydHMuY29tbWVudCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0dGVtcGxhdGVVcmw6ICcvY29tbWVudHMvY29tbWVudC10ZW1wbGF0ZSdcclxuXHR9O1xyXG59O1xyXG5cclxuZXhwb3J0cy5jb21tZW50Rm9ybSA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0dGVtcGxhdGVVcmw6ICcvY29tbWVudHMvY29tbWVudC1mb3JtJ1xyXG5cdH07XHJcbn07IiwibW9kdWxlLmV4cG9ydHMubGlzdCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0dGVtcGxhdGVVcmw6ICcvcG9zdHMvcG9zdC10ZW1wbGF0ZScsXHJcblx0XHRsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGVsZW1lbnQpO1xyXG5cdFx0fVxyXG5cdH07XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5kZXRhaWwgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHRlbXBsYXRlVXJsOiAnL3Bvc3RzL3Bvc3QtZGV0YWlsJyxcclxuXHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZWxlbWVudCk7XHJcblx0XHR9XHJcblx0fTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmZvcm0gPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHRlbXBsYXRlVXJsOiAnL3Bvc3RzL3Bvc3QtZm9ybScsXHJcblx0XHRsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGVsZW1lbnQpO1xyXG5cdFx0fVxyXG5cdH07XHJcbn07IiwidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdyZWRkaXQnLCBbJ25nUm91dGUnLCAnZmlyZWJhc2UnXSk7XHJcblxyXG4vLz09PT09PT09XHJcbi8vIEltcG9ydHNcclxuLy89PT09PT09PVxyXG5cclxuLy8gUm91dGVzXHJcbnZhciBwb3N0Um91dGVzID0gcmVxdWlyZSgnLi9yb3V0ZXMvcG9zdCcpO1xyXG52YXIgYXV0aFJvdXRlcyA9IHJlcXVpcmUoJy4vcm91dGVzL2F1dGgnKTtcclxuXHJcbi8vIENvbnRyb2xsZXJzXHJcbnZhciBwb3N0Q3RybCA9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvcG9zdCcpO1xyXG52YXIgcG9zdERldGFpbEN0cmwgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL3Bvc3QtZGV0YWlsJyk7XHJcbnZhciBjb21tZW50Q3RybCA9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvY29tbWVudCcpO1xyXG5cclxuLy8gRGlyZWN0aXZlc1xyXG52YXIgcG9zdERpcmVjdGl2ZSA9IHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9wb3N0Jyk7XHJcbnZhciBjb21tZW50RGlyZWN0aXZlID0gcmVxdWlyZSgnLi9kaXJlY3RpdmVzL2NvbW1lbnQnKTtcclxuXHJcblxyXG4vLz09PT09PT1cclxuLy8gUm91dGVzXHJcbi8vPT09PT09PVxyXG5cclxuYXBwLmNvbmZpZyhwb3N0Um91dGVzKTtcclxuYXBwLmNvbmZpZyhhdXRoUm91dGVzKTtcclxuXHJcblxyXG4vLz09PT09PT09PT09PVxyXG4vLyBDb250cm9sbGVyc1xyXG4vLz09PT09PT09PT09PVxyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ1Bvc3RDb250cm9sbGVyJywgcG9zdEN0cmwpO1xyXG5hcHAuY29udHJvbGxlcignUG9zdERldGFpbENvbnRyb2xsZXInLCBwb3N0RGV0YWlsQ3RybCk7XHJcbmFwcC5jb250cm9sbGVyKCdDb21tZW50Q29udHJvbGxlcicsIGNvbW1lbnRDdHJsKTtcclxuXHJcblxyXG4vLz09PT09PT09PT09XHJcbi8vIERpcmVjdGl2ZXNcclxuLy89PT09PT09PT09PVxyXG5cclxuYXBwLmRpcmVjdGl2ZSgncG9zdCcsIHBvc3REaXJlY3RpdmUubGlzdCk7XHJcbmFwcC5kaXJlY3RpdmUoJ3Bvc3RkZXRhaWwnLCBwb3N0RGlyZWN0aXZlLmRldGFpbCk7XHJcbmFwcC5kaXJlY3RpdmUoJ3Bvc3Rmb3JtJywgcG9zdERpcmVjdGl2ZS5mb3JtKTtcclxuYXBwLmRpcmVjdGl2ZSgnY29tbWVudCcsIGNvbW1lbnREaXJlY3RpdmUuY29tbWVudCk7XHJcbmFwcC5kaXJlY3RpdmUoJ2NvbW1lbnRmb3JtJywgY29tbWVudERpcmVjdGl2ZS5jb21tZW50Rm9ybSk7IiwibW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRyb3V0ZVByb3ZpZGVyJyxcclxuXHRmdW5jdGlvbiAoJHJvdXRlUHJvdmlkZXIpIHtcclxuXHRcdCRyb3V0ZVByb3ZpZGVyLlxyXG5cdFx0XHJcblx0XHRcdC8vIExpc3Qgb2YgYWxsIHBvc3RzXHJcblx0XHRcdHdoZW4oJy9hdXRoJywge1xyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnL2F1dGgvbG9naW4nXHJcblx0XHRcdFx0Ly8sY29udHJvbGxlcjogJ0F1dGhDb250cm9sbGVyJ1xyXG5cdFx0XHR9KS5cclxuXHJcblx0XHRcdC8vIERldGFpbCBvZiBzcGVjaWZpYyBwb3N0XHJcblx0XHRcdHdoZW4oJy9hdXRoL3JlZ2lzdGVyJywge1xyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnL2F1dGgvcmVnaXN0ZXInXHJcblx0XHRcdFx0Ly8sY29udHJvbGxlcjogJ0F1dGhDb250cm9sbGVyJ1xyXG5cdFx0XHR9KS5cclxuXHRcdFx0XHJcblx0XHRcdG90aGVyd2lzZSggeyByZWRpcmVjdFRvOiAnLzQwNCcgfSlcclxuXHR9XHJcbl07IiwibW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRyb3V0ZVByb3ZpZGVyJyxcclxuXHRmdW5jdGlvbiAoJHJvdXRlUHJvdmlkZXIpIHtcclxuXHRcdCRyb3V0ZVByb3ZpZGVyLlxyXG5cdFx0XHJcblx0XHRcdC8vIExpc3Qgb2YgYWxsIHBvc3RzXHJcblx0XHRcdHdoZW4oJy8nLCB7XHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvcG9zdHMvbGlzdCcsXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ1Bvc3RDb250cm9sbGVyJ1xyXG5cdFx0XHR9KS5cclxuXHJcblx0XHRcdC8vIERldGFpbCBvZiBzcGVjaWZpYyBwb3N0XHJcblx0XHRcdHdoZW4oJy9wb3N0LzppZCcsIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogZnVuY3Rpb24gKCRwYXJhbXMpIHtcclxuXHRcdFx0XHRcdHJldHVybiAnL3Bvc3RzL3Bvc3QvJyArICRwYXJhbXMuaWRcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdQb3N0RGV0YWlsQ29udHJvbGxlcidcclxuXHRcdFx0fSkuXHJcblxyXG5cdFx0XHQvLyBFcnJvclxyXG5cdFx0XHR3aGVuKCcvNDA0Jywge1xyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3Bvc3RzLzQwNCdcclxuXHRcdFx0fSkuXHJcblx0XHRcdG90aGVyd2lzZSggeyByZWRpcmVjdFRvOiAnLzQwNCcgfSlcclxuXHR9XHJcbl07IiwidmFyIFVzZXIgXHQ9IHJlcXVpcmUoJy4vdXNlcicpO1xyXG52YXIgU2NvcmUgXHQ9IHJlcXVpcmUoJy4vc2NvcmUnKTtcclxudmFyIGV4dGVuZCA9IHJlcXVpcmUoJ2V4dGVuZCcpO1xyXG5cclxuLy89PT09PVxyXG4vLyBEYXRhIG1vZGVsIG9mIGEgY29tbWVudFxyXG4vLz09PT09XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvbnN0cnVjdG9yKSB7XHJcblx0dmFyICRzY29wZSA9IHRoaXM7XHJcblxyXG5cdHZhciBERUZBVUxUID0ge1xyXG5cdFx0dGV4dDogJycsXHJcblx0XHRwYXJlbnQ6IG51bGwsXHJcblx0XHRwb3N0ZWQ6IERhdGUubm93KCksXHJcblx0XHR1c2VyOiBuZXcgVXNlcigpLFxyXG5cdFx0c2NvcmU6IG5ldyBTY29yZSgpLFxyXG5cdFx0cG9zdElkOiAtMVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gZXh0ZW5kKCRzY29wZSwgREVGQVVMVCwgY29uc3RydWN0b3IpO1xyXG59OyIsInZhciBVc2VyIFx0PSByZXF1aXJlKCcuL3VzZXInKTtcclxudmFyIFNjb3JlIFx0PSByZXF1aXJlKCcuL3Njb3JlJyk7XHJcbnZhciBleHRlbmQgPSByZXF1aXJlKCdleHRlbmQnKTtcclxuXHJcbi8vIERhdGEgbW9kZWwgb2YgYSBwb3N0XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvbnN0cnVjdG9yKXtcclxuXHJcblx0dmFyICRzY29wZSA9IHRoaXM7XHJcblxyXG5cdHZhciBERUZBVUxUID0ge1xyXG5cdFx0dGl0bGU6ICcnLFxyXG5cdFx0dGV4dDogJycsXHJcblx0XHRpbWFnZTogJycsXHJcblx0XHRwb3N0ZWQ6IERhdGUubm93KCksXHJcblx0XHRzY29yZTogbmV3IFNjb3JlKCksXHJcblx0XHR1c2VyOiBuZXcgVXNlcigpXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gZXh0ZW5kKCRzY29wZSwgREVGQVVMVCwgY29uc3RydWN0b3IpO1xyXG59OyIsInZhciBleHRlbmQgPSByZXF1aXJlKCdleHRlbmQnKTtcclxuXHJcbi8vIFNjb3JlIG1vZGVsXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvbnN0cnVjdG9yKXtcclxuXHR2YXIgJHNjb3BlID0gdGhpcztcclxuXHJcblx0dmFyIERFRkFVTFQgPSB7XHJcblx0XHR1cHZvdGVzOiAwLFxyXG5cdFx0ZG93bnZvdGVzOiAwLFxyXG5cdFx0Z2V0OiBmdW5jdGlvbiAoKXtcclxuXHRcdFx0cmV0dXJuICRzY29wZS51cHZvdGVzIC0gJHNjb3BlLmRvd252b3RlcztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBleHRlbmQoJHNjb3BlLCBERUZBVUxULCBjb25zdHJ1Y3Rvcik7XHJcbn0iLCJ2YXIgZXh0ZW5kID0gcmVxdWlyZSgnZXh0ZW5kJyk7XHJcblxyXG4vLyBVc2VyIG1vZGVsXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvbnN0cnVjdG9yKXtcclxuXHJcblx0dmFyICRzY29wZSA9IHRoaXM7XHJcblxyXG5cdHZhciBERUZBVUxUID0ge1xyXG5cdFx0cGFzc3dvcmQ6ICcnLFxyXG5cdFx0dXNlcm5hbWU6ICcnLFxyXG5cdFx0ZW1haWw6ICcnLFxyXG5cdFx0am9pbmVkOiBEYXRlLm5vdygpXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gZXh0ZW5kKCRzY29wZSwgREVGQVVMVCwgY29uc3RydWN0b3IpO1xyXG59OyIsInZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciB1bmRlZmluZWQ7XG5cbnZhciBpc1BsYWluT2JqZWN0ID0gZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmopIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRpZiAoIW9iaiB8fCB0b1N0cmluZy5jYWxsKG9iaikgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0dmFyIGhhc19vd25fY29uc3RydWN0b3IgPSBoYXNPd24uY2FsbChvYmosICdjb25zdHJ1Y3RvcicpO1xuXHR2YXIgaGFzX2lzX3Byb3BlcnR5X29mX21ldGhvZCA9IG9iai5jb25zdHJ1Y3RvciAmJiBvYmouY29uc3RydWN0b3IucHJvdG90eXBlICYmIGhhc093bi5jYWxsKG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsICdpc1Byb3RvdHlwZU9mJyk7XG5cdC8vIE5vdCBvd24gY29uc3RydWN0b3IgcHJvcGVydHkgbXVzdCBiZSBPYmplY3Rcblx0aWYgKG9iai5jb25zdHJ1Y3RvciAmJiAhaGFzX293bl9jb25zdHJ1Y3RvciAmJiAhaGFzX2lzX3Byb3BlcnR5X29mX21ldGhvZCkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIE93biBwcm9wZXJ0aWVzIGFyZSBlbnVtZXJhdGVkIGZpcnN0bHksIHNvIHRvIHNwZWVkIHVwLFxuXHQvLyBpZiBsYXN0IG9uZSBpcyBvd24sIHRoZW4gYWxsIHByb3BlcnRpZXMgYXJlIG93bi5cblx0dmFyIGtleTtcblx0Zm9yIChrZXkgaW4gb2JqKSB7fVxuXG5cdHJldHVybiBrZXkgPT09IHVuZGVmaW5lZCB8fCBoYXNPd24uY2FsbChvYmosIGtleSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGV4dGVuZCgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgb3B0aW9ucywgbmFtZSwgc3JjLCBjb3B5LCBjb3B5SXNBcnJheSwgY2xvbmUsXG5cdFx0dGFyZ2V0ID0gYXJndW1lbnRzWzBdLFxuXHRcdGkgPSAxLFxuXHRcdGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsXG5cdFx0ZGVlcCA9IGZhbHNlO1xuXG5cdC8vIEhhbmRsZSBhIGRlZXAgY29weSBzaXR1YXRpb25cblx0aWYgKHR5cGVvZiB0YXJnZXQgPT09ICdib29sZWFuJykge1xuXHRcdGRlZXAgPSB0YXJnZXQ7XG5cdFx0dGFyZ2V0ID0gYXJndW1lbnRzWzFdIHx8IHt9O1xuXHRcdC8vIHNraXAgdGhlIGJvb2xlYW4gYW5kIHRoZSB0YXJnZXRcblx0XHRpID0gMjtcblx0fSBlbHNlIGlmICgodHlwZW9mIHRhcmdldCAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIHRhcmdldCAhPT0gJ2Z1bmN0aW9uJykgfHwgdGFyZ2V0ID09IG51bGwpIHtcblx0XHR0YXJnZXQgPSB7fTtcblx0fVxuXG5cdGZvciAoOyBpIDwgbGVuZ3RoOyArK2kpIHtcblx0XHRvcHRpb25zID0gYXJndW1lbnRzW2ldO1xuXHRcdC8vIE9ubHkgZGVhbCB3aXRoIG5vbi1udWxsL3VuZGVmaW5lZCB2YWx1ZXNcblx0XHRpZiAob3B0aW9ucyAhPSBudWxsKSB7XG5cdFx0XHQvLyBFeHRlbmQgdGhlIGJhc2Ugb2JqZWN0XG5cdFx0XHRmb3IgKG5hbWUgaW4gb3B0aW9ucykge1xuXHRcdFx0XHRzcmMgPSB0YXJnZXRbbmFtZV07XG5cdFx0XHRcdGNvcHkgPSBvcHRpb25zW25hbWVdO1xuXG5cdFx0XHRcdC8vIFByZXZlbnQgbmV2ZXItZW5kaW5nIGxvb3Bcblx0XHRcdFx0aWYgKHRhcmdldCA9PT0gY29weSkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gUmVjdXJzZSBpZiB3ZSdyZSBtZXJnaW5nIHBsYWluIG9iamVjdHMgb3IgYXJyYXlzXG5cdFx0XHRcdGlmIChkZWVwICYmIGNvcHkgJiYgKGlzUGxhaW5PYmplY3QoY29weSkgfHwgKGNvcHlJc0FycmF5ID0gQXJyYXkuaXNBcnJheShjb3B5KSkpKSB7XG5cdFx0XHRcdFx0aWYgKGNvcHlJc0FycmF5KSB7XG5cdFx0XHRcdFx0XHRjb3B5SXNBcnJheSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0Y2xvbmUgPSBzcmMgJiYgQXJyYXkuaXNBcnJheShzcmMpID8gc3JjIDogW107XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGNsb25lID0gc3JjICYmIGlzUGxhaW5PYmplY3Qoc3JjKSA/IHNyYyA6IHt9O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIE5ldmVyIG1vdmUgb3JpZ2luYWwgb2JqZWN0cywgY2xvbmUgdGhlbVxuXHRcdFx0XHRcdHRhcmdldFtuYW1lXSA9IGV4dGVuZChkZWVwLCBjbG9uZSwgY29weSk7XG5cblx0XHRcdFx0Ly8gRG9uJ3QgYnJpbmcgaW4gdW5kZWZpbmVkIHZhbHVlc1xuXHRcdFx0XHR9IGVsc2UgaWYgKGNvcHkgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHRhcmdldFtuYW1lXSA9IGNvcHk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBSZXR1cm4gdGhlIG1vZGlmaWVkIG9iamVjdFxuXHRyZXR1cm4gdGFyZ2V0O1xufTtcblxuIl19

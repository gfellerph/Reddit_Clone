(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = [
	'$httpProvider'
	, function ($httpProvider) {
		
		//Http Intercpetor to check auth failures for xhr requests
		$httpProvider.interceptors.push('authInterceptor');
	}
]
},{}],2:[function(require,module,exports){
var User = require('../models/user');

module.exports = [
	'$scope',
	'$http',
	'$routeParams',
	'$location',
	function ($scope, $http, $routeParams, $location) {
		$scope.user = false;

		// Get user info
		var req = $http.get('/api/user')
			.success ( function (data) {
				$scope.user = data;
			})
			.error ( function (err) {
				console.log(err);
			});

		// Underline active page
		$scope.isActive = function (route) {
			return route === $location.path();
		}

		$scope.logout = function () {
			$scope.user = false;
			$location.path('/logout');
		}
	}
];
},{"../models/user":15}],3:[function(require,module,exports){
// Requires
var Comment = require('../models/comment');
var User = require('../models/user');

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
},{"../models/comment":12,"../models/user":15}],4:[function(require,module,exports){
var Post = require('../models/post');
var Score = require('../models/score');
var User = require('../models/user');

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
},{"../models/post":13,"../models/score":14,"../models/user":15}],5:[function(require,module,exports){
var Post = require('../models/post');
var Score = require('../models/score');
var User = require('../models/user');

module.exports = [
	'$scope',
	'$http',
	'$location',
	'$routeParams',
	function ($scope, $http, $location, $routeParams) {

		var $posts = $('.posts');

		// List of all posts
		$scope.posts = [];
		// Form model/Detail view
		$scope.post = new Post();
		// ID of the post
		$scope.postId = $routeParams.id;

		// Refresh element positions
		$scope.updatePackery = function () {
			console.log($posts);
			$posts.packery();
		};


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
			var $post = new Post(post);
			$http.post('/api/post', $post)
				.success ( function (data) {
					$location.path('/');
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


		//======
		// Score
		//======
		$scope.score = function (post) {

			var score = 0;

			for (var i = 0; i < post.votes.length; i++) {
				score += post.votes[i].vote;
			}
			
			return score;
		}


		//=========
		// Initiate
		//=========

		$scope.list();
	}
];
},{"../models/post":13,"../models/score":14,"../models/user":15}],6:[function(require,module,exports){
module.exports.authHeader = ['$location', function ($location) {
	return {
		restrict: 'E'
		,templateUrl: '/auth/header'
	};
}];
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
module.exports.list = function () {
	return {
		templateUrl: '/posts/post-template',
		replace: true
	};
};

module.exports.detail = function () {
	return {
		templateUrl: '/posts/post-detail'
		
	};
};

module.exports.form = function () {
	return {
		templateUrl: '/posts/post-form'
	};
};
},{}],9:[function(require,module,exports){
module.exports = function () {

	var linkFunction;
	var controllerFunction;

	var $posts = $('.posts');

	linkFunction = function (scope, element, attrs) {
		if(scope.$last){
			setTimeout(function () {
				scope.$emit('postsloaded', element, attrs);
			}, 1);
		};
	};

	controllerFunction = function ($scope) {
		$scope.$on('postsloaded', function (e) {
			
			// Initialize packery
			$posts.packery({
				itemSelector: 'li',
				gutter: 10
			});
		});
	};

	return {
		link: linkFunction,
		restrict: 'A',
		controller: controllerFunction
	}
};
},{}],10:[function(require,module,exports){
module.exports = [
	'$q'
	, '$location'
	, function ($q, $location) {
		var handler = {
			response: function (response) {
				if (response.status === 401) {
					// console.log(response.status);
				}
				return response || $q.when(response);
			}
			, responseError: function (rejection) {
				if (rejection.status === 401) {
					$location.path('/login').search('returnTo', JSON.parse(rejection.data).returnTo);
				}
				//return $q.reject(rejection);
			}
		}

		return handler;
	}
];
},{}],11:[function(require,module,exports){

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
var postDetailCtrl 		= require('./controllers/post-detail');
var commentCtrl 		= require('./controllers/comment');
var authCtrl 			= require('./controllers/auth');

// Directives
var postDirective 		= require('./directives/post');
var commentDirective 	= require('./directives/comment');
var authDirective 		= require('./directives/auth');
var postsLoaded 		= require('./directives/posts-loaded');

// Factories
var authInterceptor 	= require('./factories/auth-interceptor');

// Config
var interceptor 		= require('./config/interceptor');


//========
// Factory
//========

app.factory('authInterceptor', authInterceptor);


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
app.controller('PostDetailController', postDetailCtrl);
app.controller('CommentController', commentCtrl);
app.controller('AuthController', authCtrl);


//===========
// Directives
//===========

app.directive('post', postDirective.list);
app.directive('postdetail', postDirective.detail);
app.directive('postform', postDirective.form);
app.directive('comment', commentDirective.comment);
app.directive('commentform', commentDirective.commentForm);
app.directive('authheader', authDirective.authHeader);
app.directive('postsLoaded', postsLoaded);
},{"./config/interceptor":1,"./controllers/auth":2,"./controllers/comment":3,"./controllers/post":5,"./controllers/post-detail":4,"./directives/auth":6,"./directives/comment":7,"./directives/post":8,"./directives/posts-loaded":9,"./factories/auth-interceptor":10,"./routes/auth":16,"./routes/post":17}],12:[function(require,module,exports){
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
},{"./score":14,"./user":15,"extend":18}],13:[function(require,module,exports){
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
		score: new Score()
	}

	return extend($scope, DEFAULT, constructor);
};
},{"./score":14,"extend":18}],14:[function(require,module,exports){
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
},{"extend":18}],15:[function(require,module,exports){
var extend = require('extend');

// Data model of a post
module.exports = function (constructor){

    var $scope = this;

    var DEFAULT = {
        email: '',
        password: ''
    }

    return extend($scope, DEFAULT, constructor);
};
},{"extend":18}],16:[function(require,module,exports){
module.exports = [
	'$routeProvider',
	function ($routeProvider) {
		$routeProvider.
		
			// List of all posts
			when('/login', {
				templateUrl: '/auth'
				,controller: 'AuthController'
			}).

			// Detail of specific post
			when('/register', {
				templateUrl: '/auth/register'
				,controller: 'AuthController'
			}).

			// Logout
			when('/logout', {
				templateUrl: '/auth/logout'
				,controller: 'AuthController'
			}).
			
			otherwise( { redirectTo: '/404' })
	}
];
},{}],17:[function(require,module,exports){
module.exports = [
	'$routeProvider',
	function ($routeProvider) {
		$routeProvider.
		
			// List of all posts
			when('/', {
				templateUrl: '/posts/list'
			}).

			// Detail of specific post
			when('/post/:id', {
				templateUrl: function ($params) {
					return '/posts/post/' + $params.id
				},
				controller: 'PostDetailController'
			}).

			// Create post
			when('/add-link', {
				templateUrl: '/posts/post-form'
			}).

			// Error
			when('/404', {
				templateUrl: '/posts/404'
			}).
			otherwise( { redirectTo: '/404' })
	}
];
},{}],18:[function(require,module,exports){
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


},{}]},{},[11])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxHaXRIdWJcXFJlZGRpdF9DbG9uZVxcZnJvbnRlbmRcXGJ1aWxkc3lzdGVtXFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvY29uZmlnL2ludGVyY2VwdG9yLmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9jb250cm9sbGVycy9hdXRoLmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9jb250cm9sbGVycy9jb21tZW50LmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9jb250cm9sbGVycy9wb3N0LWRldGFpbC5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvY29udHJvbGxlcnMvcG9zdC5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvZGlyZWN0aXZlcy9hdXRoLmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9kaXJlY3RpdmVzL2NvbW1lbnQuanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL2RpcmVjdGl2ZXMvcG9zdC5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvZGlyZWN0aXZlcy9wb3N0cy1sb2FkZWQuanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL2ZhY3Rvcmllcy9hdXRoLWludGVyY2VwdG9yLmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9tYWluLmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9tb2RlbHMvY29tbWVudC5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvbW9kZWxzL3Bvc3QuanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL21vZGVscy9zY29yZS5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvbW9kZWxzL3VzZXIuanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL3JvdXRlcy9hdXRoLmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9yb3V0ZXMvcG9zdC5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvbm9kZV9tb2R1bGVzL2V4dGVuZC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gW1xyXG5cdCckaHR0cFByb3ZpZGVyJ1xyXG5cdCwgZnVuY3Rpb24gKCRodHRwUHJvdmlkZXIpIHtcclxuXHRcdFxyXG5cdFx0Ly9IdHRwIEludGVyY3BldG9yIHRvIGNoZWNrIGF1dGggZmFpbHVyZXMgZm9yIHhociByZXF1ZXN0c1xyXG5cdFx0JGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnYXV0aEludGVyY2VwdG9yJyk7XHJcblx0fVxyXG5dIiwidmFyIFVzZXIgPSByZXF1aXJlKCcuLi9tb2RlbHMvdXNlcicpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRzY29wZScsXHJcblx0JyRodHRwJyxcclxuXHQnJHJvdXRlUGFyYW1zJyxcclxuXHQnJGxvY2F0aW9uJyxcclxuXHRmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24pIHtcclxuXHRcdCRzY29wZS51c2VyID0gZmFsc2U7XHJcblxyXG5cdFx0Ly8gR2V0IHVzZXIgaW5mb1xyXG5cdFx0dmFyIHJlcSA9ICRodHRwLmdldCgnL2FwaS91c2VyJylcclxuXHRcdFx0LnN1Y2Nlc3MgKCBmdW5jdGlvbiAoZGF0YSkge1xyXG5cdFx0XHRcdCRzY29wZS51c2VyID0gZGF0YTtcclxuXHRcdFx0fSlcclxuXHRcdFx0LmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdC8vIFVuZGVybGluZSBhY3RpdmUgcGFnZVxyXG5cdFx0JHNjb3BlLmlzQWN0aXZlID0gZnVuY3Rpb24gKHJvdXRlKSB7XHJcblx0XHRcdHJldHVybiByb3V0ZSA9PT0gJGxvY2F0aW9uLnBhdGgoKTtcclxuXHRcdH1cclxuXHJcblx0XHQkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQkc2NvcGUudXNlciA9IGZhbHNlO1xyXG5cdFx0XHQkbG9jYXRpb24ucGF0aCgnL2xvZ291dCcpO1xyXG5cdFx0fVxyXG5cdH1cclxuXTsiLCIvLyBSZXF1aXJlc1xyXG52YXIgQ29tbWVudCA9IHJlcXVpcmUoJy4uL21vZGVscy9jb21tZW50Jyk7XHJcbnZhciBVc2VyID0gcmVxdWlyZSgnLi4vbW9kZWxzL3VzZXInKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gW1xyXG5cdCckc2NvcGUnLFxyXG5cdCckaHR0cCcsXHJcblx0JyRyb3V0ZVBhcmFtcycsXHJcblx0ZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcykge1xyXG5cclxuXHJcblx0XHQvLyBMaXN0IG9mIGFsbCBjb21tZW50cyBmb3IgdGhpcyBwb3N0XHJcblx0XHQkc2NvcGUuY29tbWVudHMgPSBbXTtcclxuXHRcdC8vIEZvcm0gbW9kZWxcclxuXHRcdCRzY29wZS5jb21tZW50ID0gbmV3IENvbW1lbnQoKTtcclxuXHRcdC8vIElEIG9mIHRoZSBwb3N0XHJcblx0XHQkc2NvcGUucG9zdElkID0gJHJvdXRlUGFyYW1zLmlkO1xyXG5cdFx0Ly8gRHVtbXkgZGF0YSBmb3IgdXNlclxyXG5cdFx0JHNjb3BlLmR1bW15X3VzZXIgPSBuZXcgVXNlcih7IG5hbWU6ICdQaGlsaXBwJywgam9pbmVkOiBEYXRlLm5vdygpIH0pO1xyXG5cclxuXHJcblx0XHQvLz09PT09XHJcblx0XHQvLyBMSVNUXHJcblx0XHQvLz09PT09XHJcblxyXG5cdFx0dGhpcy5saXN0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0Ly8gR2V0IGNvbW1lbnQgbGlzdFxyXG5cdFx0XHR2YXIgcmVxID0gJGh0dHAuZ2V0KCcvYXBpL2NvbW1lbnRzL3RvLycgKyAkc2NvcGUucG9zdElkKTtcclxuXHRcdFx0cmVxLnN1Y2Nlc3MgKCBmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuXHRcdFx0XHQkc2NvcGUuY29tbWVudHMgPSBkYXRhO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmVxLmVycm9yIChmdW5jdGlvbiAoZXJyKSB7IGNvbnNvbGUubG9nKGVycik7IH0pO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0Ly89PT09PT09XHJcblx0XHQvLyBDUkVBVEVcclxuXHRcdC8vPT09PT09PVxyXG5cclxuXHRcdHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0Ly8gSW5pdGlhbGl6ZSBjb21tZW50IG9iamVjdFxyXG5cdFx0XHQkc2NvcGUuY29tbWVudC51c2VyID0gJHNjb3BlLmR1bW15X3VzZXI7XHJcblx0XHRcdCRzY29wZS5jb21tZW50LnBvc3RJZCA9ICRzY29wZS5wb3N0SWQ7XHJcblxyXG5cdFx0XHQvLyBQdXNoIHRvIHRoZSBzZXJ2ZXJcclxuXHRcdFx0dmFyIHJlcSA9ICRodHRwLnBvc3QoJy9hcGkvY29tbWVudCcsICRzY29wZS5jb21tZW50KTtcclxuXHRcdFx0cmVxLnN1Y2Nlc3MgKCBmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuXHRcdFx0XHQkc2NvcGUuY29tbWVudHMucHVzaChkYXRhKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJlcS5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIFJlc2V0XHJcblx0XHRcdCRzY29wZS5jb21tZW50ID0ge307XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PVxyXG5cdFx0Ly8gQW5zd2VyXHJcblx0XHQvLz09PT09PT1cclxuXHJcblx0XHR0aGlzLmFuc3dlciA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJHNjb3BlKTtcclxuXHRcdFx0dmFyIHRlbXBsYXRlID0ge307XHJcblx0XHRcdHZhciByZXEgPSAkaHR0cC5nZXQoJy9jb21tZW50cy9jb21tZW50LXRlbXBsYXRlJyk7XHJcblx0XHRcdHJlcS5zdWNjZXNzID0gZnVuY3Rpb24gKCBkYXRhICkge1xyXG5cdFx0XHRcdHRlbXBsYXRlID0gZGF0YTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyh0ZW1wbGF0ZSk7XHJcblx0XHRcdFx0JChkb2N1bWVudCkucHJlcGVuZCh0ZW1wbGF0ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly89PT09PT09XHJcblx0XHQvLyBVcHZvdGVcclxuXHRcdC8vPT09PT09PVxyXG5cdFx0XHJcblx0XHR0aGlzLnVwdm90ZSA9IGZ1bmN0aW9uIChjb21tZW50KSB7XHJcblx0XHRcdHZhciAkY29tbWVudCA9IG5ldyBDb21tZW50KGNvbW1lbnQpO1xyXG5cclxuXHRcdFx0JGNvbW1lbnQuc2NvcmUudXB2b3RlcysrO1xyXG5cdFx0XHQkaHR0cC5wdXQoJy9hcGkvY29tbWVudC8nICsgJGNvbW1lbnQuX2lkICsgJy91cHZvdGUnLCAkY29tbWVudClcclxuXHRcdFx0LmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdCRjb21tZW50LnNjb3JlLnVwdm90ZXMtLTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly89PT09PT09PT1cclxuXHRcdC8vIERvd252b3RlXHJcblx0XHQvLz09PT09PT09PVxyXG5cdFx0XHJcblx0XHR0aGlzLmRvd252b3RlID0gZnVuY3Rpb24gKGNvbW1lbnQpIHtcclxuXHRcdFx0dmFyICRjb21tZW50ID0gbmV3IENvbW1lbnQoY29tbWVudCk7XHJcblxyXG5cdFx0XHQkY29tbWVudC5zY29yZS5kb3dudm90ZXMrKztcclxuXHRcdFx0JGh0dHAucHV0KCcvYXBpL2NvbW1lbnQvJyArICRjb21tZW50Ll9pZCArICcvZG93bnZvdGUnLCAkY29tbWVudClcclxuXHRcdFx0LmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdCRjb21tZW50LnNjb3JlLmRvd252b3Rlcy0tO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLz09PT09PT09PT09PT09XHJcblx0XHQvLyBJbml0aWFsIGNhbGxzXHJcblx0XHQvLz09PT09PT09PT09PT09XHJcblxyXG5cdFx0dGhpcy5saXN0KCk7XHJcblx0fVxyXG5dOyIsInZhciBQb3N0ID0gcmVxdWlyZSgnLi4vbW9kZWxzL3Bvc3QnKTtcclxudmFyIFNjb3JlID0gcmVxdWlyZSgnLi4vbW9kZWxzL3Njb3JlJyk7XHJcbnZhciBVc2VyID0gcmVxdWlyZSgnLi4vbW9kZWxzL3VzZXInKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gW1xyXG5cdCckc2NvcGUnLFxyXG5cdCckaHR0cCcsXHJcblx0JyRyb3V0ZVBhcmFtcycsXHJcblx0ZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcykge1xyXG5cclxuXHRcdC8vIEZvcm0gbW9kZWwvRGV0YWlsIHZpZXdcclxuXHRcdCRzY29wZS5wb3N0ID0gbmV3IFBvc3QoKTtcclxuXHRcdC8vIElEIG9mIHRoZSBwb3N0XHJcblx0XHQkc2NvcGUucG9zdElkID0gJHJvdXRlUGFyYW1zLmlkO1xyXG5cdFx0Ly8gRHVtbXkgZGF0YSBmb3IgdXNlclxyXG5cdFx0JHNjb3BlLmR1bW15X3VzZXIgPSBuZXcgVXNlcih7IG5hbWU6ICdQaGlsaXBwJywgam9pbmVkOiBEYXRlLm5vdygpIH0pO1xyXG5cclxuXHJcblx0XHQvLz09PT09XHJcblx0XHQvLyBSZWFkXHJcblx0XHQvLz09PT09XHJcblxyXG5cdFx0JHNjb3BlLnJlYWQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHQvLyBHZXQgZGV0YWlscyBvZiBvbmUgcG9zdFxyXG5cdFx0XHQkaHR0cC5nZXQoJy9hcGkvcG9zdC8nICsgJHJvdXRlUGFyYW1zLmlkKVxyXG5cdFx0XHRcdC5zdWNjZXNzICggZnVuY3Rpb24gKGRhdGEpIHtcclxuXHRcdFx0XHRcdCRzY29wZS5wb3N0ID0gbmV3IFBvc3QoZGF0YSk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygkc2NvcGUucG9zdCk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0Ly89PT09PT09XHJcblx0XHQvLyBVcHZvdGVcclxuXHRcdC8vPT09PT09PVxyXG5cclxuXHRcdCRzY29wZS51cHZvdGUgPSBmdW5jdGlvbiAocG9zdCkge1xyXG5cdFx0XHR2YXIgJHBvc3QgPSBuZXcgUG9zdChwb3N0KTtcclxuXHRcdFx0JHBvc3Quc2NvcmUudXB2b3RlcysrO1xyXG5cclxuXHRcdFx0JGh0dHAucHV0KCcvYXBpL3Bvc3QvJyArICRwb3N0Ll9pZCArICcvdXB2b3RlLycsICRwb3N0KVxyXG5cdFx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdCRwb3N0LnNjb3JlLnVwdm90ZXMtLTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PT09XHJcblx0XHQvLyBEb3dudm90ZVxyXG5cdFx0Ly89PT09PT09PT1cclxuXHJcblx0XHQkc2NvcGUuZG93bnZvdGUgPSBmdW5jdGlvbiAocG9zdCkge1xyXG5cdFx0XHR2YXIgJHBvc3QgPSBuZXcgUG9zdChwb3N0KTtcclxuXHRcdFx0JHBvc3Quc2NvcmUuZG93bnZvdGVzKys7XHJcblxyXG5cdFx0XHQkaHR0cC5wdXQoJy9hcGkvcG9zdC8nICsgJHBvc3QuX2lkICsgJy9kb3dudm90ZS8nLCAkcG9zdClcclxuXHRcdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0XHQkcG9zdC5zY29yZS5kb3dudm90ZXMtLTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PT09XHJcblx0XHQvLyBJbml0aWF0ZVxyXG5cdFx0Ly89PT09PT09PT1cclxuXHJcblx0XHQkc2NvcGUucmVhZCgpO1xyXG5cdH1cclxuXTsiLCJ2YXIgUG9zdCA9IHJlcXVpcmUoJy4uL21vZGVscy9wb3N0Jyk7XHJcbnZhciBTY29yZSA9IHJlcXVpcmUoJy4uL21vZGVscy9zY29yZScpO1xyXG52YXIgVXNlciA9IHJlcXVpcmUoJy4uL21vZGVscy91c2VyJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcclxuXHQnJHNjb3BlJyxcclxuXHQnJGh0dHAnLFxyXG5cdCckbG9jYXRpb24nLFxyXG5cdCckcm91dGVQYXJhbXMnLFxyXG5cdGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkbG9jYXRpb24sICRyb3V0ZVBhcmFtcykge1xyXG5cclxuXHRcdHZhciAkcG9zdHMgPSAkKCcucG9zdHMnKTtcclxuXHJcblx0XHQvLyBMaXN0IG9mIGFsbCBwb3N0c1xyXG5cdFx0JHNjb3BlLnBvc3RzID0gW107XHJcblx0XHQvLyBGb3JtIG1vZGVsL0RldGFpbCB2aWV3XHJcblx0XHQkc2NvcGUucG9zdCA9IG5ldyBQb3N0KCk7XHJcblx0XHQvLyBJRCBvZiB0aGUgcG9zdFxyXG5cdFx0JHNjb3BlLnBvc3RJZCA9ICRyb3V0ZVBhcmFtcy5pZDtcclxuXHJcblx0XHQvLyBSZWZyZXNoIGVsZW1lbnQgcG9zaXRpb25zXHJcblx0XHQkc2NvcGUudXBkYXRlUGFja2VyeSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJHBvc3RzKTtcclxuXHRcdFx0JHBvc3RzLnBhY2tlcnkoKTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdC8vPT09PT1cclxuXHRcdC8vIExJU1RcclxuXHRcdC8vPT09PT1cclxuXHJcblx0XHQkc2NvcGUubGlzdCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdC8vIEdldCBsaXN0IG9mIHBvc3RzXHJcblx0XHRcdCRodHRwLmdldCgnL2FwaS9wb3N0cycpXHJcblx0XHRcdFx0LnN1Y2Nlc3MgKCBmdW5jdGlvbiAoZGF0YSkge1xyXG5cdFx0XHRcdFx0JHNjb3BlLnBvc3RzID0gZGF0YTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHQvLz09PT09PT1cclxuXHRcdC8vIENSRUFURVxyXG5cdFx0Ly89PT09PT09XHJcblxyXG5cdFx0JHNjb3BlLmNyZWF0ZSA9IGZ1bmN0aW9uIChwb3N0KSB7XHJcblx0XHRcdHZhciAkcG9zdCA9IG5ldyBQb3N0KHBvc3QpO1xyXG5cdFx0XHQkaHR0cC5wb3N0KCcvYXBpL3Bvc3QnLCAkcG9zdClcclxuXHRcdFx0XHQuc3VjY2VzcyAoIGZ1bmN0aW9uIChkYXRhKSB7XHJcblx0XHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnLycpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly89PT09PT09XHJcblx0XHQvLyBVcHZvdGVcclxuXHRcdC8vPT09PT09PVxyXG5cclxuXHRcdCRzY29wZS51cHZvdGUgPSBmdW5jdGlvbiAocG9zdCkge1xyXG5cdFx0XHR2YXIgJHBvc3QgPSBuZXcgUG9zdChwb3N0KTtcclxuXHRcdFx0JHBvc3Quc2NvcmUudXB2b3RlcysrO1xyXG5cclxuXHRcdFx0JGh0dHAucHV0KCcvYXBpL3Bvc3QvJyArICRwb3N0Ll9pZCArICcvdXB2b3RlLycsICRwb3N0KVxyXG5cdFx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdCRwb3N0LnNjb3JlLnVwdm90ZXMtLTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PT09XHJcblx0XHQvLyBEb3dudm90ZVxyXG5cdFx0Ly89PT09PT09PT1cclxuXHJcblx0XHQkc2NvcGUuZG93bnZvdGUgPSBmdW5jdGlvbiAocG9zdCkge1xyXG5cdFx0XHR2YXIgJHBvc3QgPSBuZXcgUG9zdChwb3N0KTtcclxuXHRcdFx0JHBvc3Quc2NvcmUuZG93bnZvdGVzKys7XHJcblxyXG5cdFx0XHQkaHR0cC5wdXQoJy9hcGkvcG9zdC8nICsgJHBvc3QuX2lkICsgJy9kb3dudm90ZS8nLCAkcG9zdClcclxuXHRcdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0XHQkcG9zdC5zY29yZS5kb3dudm90ZXMtLTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09XHJcblx0XHQvLyBTY29yZVxyXG5cdFx0Ly89PT09PT1cclxuXHRcdCRzY29wZS5zY29yZSA9IGZ1bmN0aW9uIChwb3N0KSB7XHJcblxyXG5cdFx0XHR2YXIgc2NvcmUgPSAwO1xyXG5cclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwb3N0LnZvdGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0c2NvcmUgKz0gcG9zdC52b3Rlc1tpXS52b3RlO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRyZXR1cm4gc2NvcmU7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PT09XHJcblx0XHQvLyBJbml0aWF0ZVxyXG5cdFx0Ly89PT09PT09PT1cclxuXHJcblx0XHQkc2NvcGUubGlzdCgpO1xyXG5cdH1cclxuXTsiLCJtb2R1bGUuZXhwb3J0cy5hdXRoSGVhZGVyID0gWyckbG9jYXRpb24nLCBmdW5jdGlvbiAoJGxvY2F0aW9uKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHJlc3RyaWN0OiAnRSdcclxuXHRcdCx0ZW1wbGF0ZVVybDogJy9hdXRoL2hlYWRlcidcclxuXHR9O1xyXG59XTsiLCJleHBvcnRzLmNvbW1lbnQgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHRlbXBsYXRlVXJsOiAnL2NvbW1lbnRzL2NvbW1lbnQtdGVtcGxhdGUnXHJcblx0fTtcclxufTtcclxuXHJcbmV4cG9ydHMuY29tbWVudEZvcm0gPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHRlbXBsYXRlVXJsOiAnL2NvbW1lbnRzL2NvbW1lbnQtZm9ybSdcclxuXHR9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzLmxpc3QgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHRlbXBsYXRlVXJsOiAnL3Bvc3RzL3Bvc3QtdGVtcGxhdGUnLFxyXG5cdFx0cmVwbGFjZTogdHJ1ZVxyXG5cdH07XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5kZXRhaWwgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHRlbXBsYXRlVXJsOiAnL3Bvc3RzL3Bvc3QtZGV0YWlsJ1xyXG5cdFx0XHJcblx0fTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmZvcm0gPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHRlbXBsYXRlVXJsOiAnL3Bvc3RzL3Bvc3QtZm9ybSdcclxuXHR9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHR2YXIgbGlua0Z1bmN0aW9uO1xyXG5cdHZhciBjb250cm9sbGVyRnVuY3Rpb247XHJcblxyXG5cdHZhciAkcG9zdHMgPSAkKCcucG9zdHMnKTtcclxuXHJcblx0bGlua0Z1bmN0aW9uID0gZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG5cdFx0aWYoc2NvcGUuJGxhc3Qpe1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRzY29wZS4kZW1pdCgncG9zdHNsb2FkZWQnLCBlbGVtZW50LCBhdHRycyk7XHJcblx0XHRcdH0sIDEpO1xyXG5cdFx0fTtcclxuXHR9O1xyXG5cclxuXHRjb250cm9sbGVyRnVuY3Rpb24gPSBmdW5jdGlvbiAoJHNjb3BlKSB7XHJcblx0XHQkc2NvcGUuJG9uKCdwb3N0c2xvYWRlZCcsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBJbml0aWFsaXplIHBhY2tlcnlcclxuXHRcdFx0JHBvc3RzLnBhY2tlcnkoe1xyXG5cdFx0XHRcdGl0ZW1TZWxlY3RvcjogJ2xpJyxcclxuXHRcdFx0XHRndXR0ZXI6IDEwXHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGxpbms6IGxpbmtGdW5jdGlvbixcclxuXHRcdHJlc3RyaWN0OiAnQScsXHJcblx0XHRjb250cm9sbGVyOiBjb250cm9sbGVyRnVuY3Rpb25cclxuXHR9XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRxJ1xyXG5cdCwgJyRsb2NhdGlvbidcclxuXHQsIGZ1bmN0aW9uICgkcSwgJGxvY2F0aW9uKSB7XHJcblx0XHR2YXIgaGFuZGxlciA9IHtcclxuXHRcdFx0cmVzcG9uc2U6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMSkge1xyXG5cdFx0XHRcdFx0Ly8gY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlIHx8ICRxLndoZW4ocmVzcG9uc2UpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCwgcmVzcG9uc2VFcnJvcjogZnVuY3Rpb24gKHJlamVjdGlvbikge1xyXG5cdFx0XHRcdGlmIChyZWplY3Rpb24uc3RhdHVzID09PSA0MDEpIHtcclxuXHRcdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvbG9naW4nKS5zZWFyY2goJ3JldHVyblRvJywgSlNPTi5wYXJzZShyZWplY3Rpb24uZGF0YSkucmV0dXJuVG8pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvL3JldHVybiAkcS5yZWplY3QocmVqZWN0aW9uKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBoYW5kbGVyO1xyXG5cdH1cclxuXTsiLCJcclxuLy89PT09PT09PVxyXG4vLyBUaGUgYXBwXHJcbi8vPT09PT09PT1cclxuXHJcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgncmVkZGl0JywgWyduZ1JvdXRlJ10pO1xyXG5cclxuXHJcbi8vPT09PT09PT1cclxuLy8gSW1wb3J0c1xyXG4vLz09PT09PT09XHJcblxyXG4vLyBSb3V0ZXNcclxudmFyIHBvc3RSb3V0ZXMgXHRcdFx0PSByZXF1aXJlKCcuL3JvdXRlcy9wb3N0Jyk7XHJcbnZhciBhdXRoUm91dGVzIFx0XHRcdD0gcmVxdWlyZSgnLi9yb3V0ZXMvYXV0aCcpO1xyXG5cclxuLy8gQ29udHJvbGxlcnNcclxudmFyIHBvc3RDdHJsIFx0XHRcdD0gcmVxdWlyZSgnLi9jb250cm9sbGVycy9wb3N0Jyk7XHJcbnZhciBwb3N0RGV0YWlsQ3RybCBcdFx0PSByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL3Bvc3QtZGV0YWlsJyk7XHJcbnZhciBjb21tZW50Q3RybCBcdFx0PSByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL2NvbW1lbnQnKTtcclxudmFyIGF1dGhDdHJsIFx0XHRcdD0gcmVxdWlyZSgnLi9jb250cm9sbGVycy9hdXRoJyk7XHJcblxyXG4vLyBEaXJlY3RpdmVzXHJcbnZhciBwb3N0RGlyZWN0aXZlIFx0XHQ9IHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9wb3N0Jyk7XHJcbnZhciBjb21tZW50RGlyZWN0aXZlIFx0PSByZXF1aXJlKCcuL2RpcmVjdGl2ZXMvY29tbWVudCcpO1xyXG52YXIgYXV0aERpcmVjdGl2ZSBcdFx0PSByZXF1aXJlKCcuL2RpcmVjdGl2ZXMvYXV0aCcpO1xyXG52YXIgcG9zdHNMb2FkZWQgXHRcdD0gcmVxdWlyZSgnLi9kaXJlY3RpdmVzL3Bvc3RzLWxvYWRlZCcpO1xyXG5cclxuLy8gRmFjdG9yaWVzXHJcbnZhciBhdXRoSW50ZXJjZXB0b3IgXHQ9IHJlcXVpcmUoJy4vZmFjdG9yaWVzL2F1dGgtaW50ZXJjZXB0b3InKTtcclxuXHJcbi8vIENvbmZpZ1xyXG52YXIgaW50ZXJjZXB0b3IgXHRcdD0gcmVxdWlyZSgnLi9jb25maWcvaW50ZXJjZXB0b3InKTtcclxuXHJcblxyXG4vLz09PT09PT09XHJcbi8vIEZhY3RvcnlcclxuLy89PT09PT09PVxyXG5cclxuYXBwLmZhY3RvcnkoJ2F1dGhJbnRlcmNlcHRvcicsIGF1dGhJbnRlcmNlcHRvcik7XHJcblxyXG5cclxuLy89PT09PT09XHJcbi8vIENvbmZpZ1xyXG4vLz09PT09PT1cclxuXHJcbmFwcC5jb25maWcoaW50ZXJjZXB0b3IpO1xyXG5cclxuXHJcbi8vPT09PT09PVxyXG4vLyBSb3V0ZXNcclxuLy89PT09PT09XHJcblxyXG5hcHAuY29uZmlnKHBvc3RSb3V0ZXMpO1xyXG5hcHAuY29uZmlnKGF1dGhSb3V0ZXMpO1xyXG5cclxuXHJcbi8vPT09PT09PT09PT09XHJcbi8vIENvbnRyb2xsZXJzXHJcbi8vPT09PT09PT09PT09XHJcblxyXG5hcHAuY29udHJvbGxlcignUG9zdENvbnRyb2xsZXInLCBwb3N0Q3RybCk7XHJcbmFwcC5jb250cm9sbGVyKCdQb3N0RGV0YWlsQ29udHJvbGxlcicsIHBvc3REZXRhaWxDdHJsKTtcclxuYXBwLmNvbnRyb2xsZXIoJ0NvbW1lbnRDb250cm9sbGVyJywgY29tbWVudEN0cmwpO1xyXG5hcHAuY29udHJvbGxlcignQXV0aENvbnRyb2xsZXInLCBhdXRoQ3RybCk7XHJcblxyXG5cclxuLy89PT09PT09PT09PVxyXG4vLyBEaXJlY3RpdmVzXHJcbi8vPT09PT09PT09PT1cclxuXHJcbmFwcC5kaXJlY3RpdmUoJ3Bvc3QnLCBwb3N0RGlyZWN0aXZlLmxpc3QpO1xyXG5hcHAuZGlyZWN0aXZlKCdwb3N0ZGV0YWlsJywgcG9zdERpcmVjdGl2ZS5kZXRhaWwpO1xyXG5hcHAuZGlyZWN0aXZlKCdwb3N0Zm9ybScsIHBvc3REaXJlY3RpdmUuZm9ybSk7XHJcbmFwcC5kaXJlY3RpdmUoJ2NvbW1lbnQnLCBjb21tZW50RGlyZWN0aXZlLmNvbW1lbnQpO1xyXG5hcHAuZGlyZWN0aXZlKCdjb21tZW50Zm9ybScsIGNvbW1lbnREaXJlY3RpdmUuY29tbWVudEZvcm0pO1xyXG5hcHAuZGlyZWN0aXZlKCdhdXRoaGVhZGVyJywgYXV0aERpcmVjdGl2ZS5hdXRoSGVhZGVyKTtcclxuYXBwLmRpcmVjdGl2ZSgncG9zdHNMb2FkZWQnLCBwb3N0c0xvYWRlZCk7IiwidmFyIFVzZXIgXHQ9IHJlcXVpcmUoJy4vdXNlcicpO1xyXG52YXIgU2NvcmUgXHQ9IHJlcXVpcmUoJy4vc2NvcmUnKTtcclxudmFyIGV4dGVuZCA9IHJlcXVpcmUoJ2V4dGVuZCcpO1xyXG5cclxuLy89PT09PVxyXG4vLyBEYXRhIG1vZGVsIG9mIGEgY29tbWVudFxyXG4vLz09PT09XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvbnN0cnVjdG9yKSB7XHJcblx0dmFyICRzY29wZSA9IHRoaXM7XHJcblxyXG5cdHZhciBERUZBVUxUID0ge1xyXG5cdFx0dGV4dDogJycsXHJcblx0XHRwYXJlbnQ6IG51bGwsXHJcblx0XHRwb3N0ZWQ6IERhdGUubm93KCksXHJcblx0XHR1c2VyOiBuZXcgVXNlcigpLFxyXG5cdFx0c2NvcmU6IG5ldyBTY29yZSgpLFxyXG5cdFx0cG9zdElkOiAtMVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gZXh0ZW5kKCRzY29wZSwgREVGQVVMVCwgY29uc3RydWN0b3IpO1xyXG59OyIsInZhciBTY29yZSBcdD0gcmVxdWlyZSgnLi9zY29yZScpO1xyXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgnZXh0ZW5kJyk7XHJcblxyXG4vLyBEYXRhIG1vZGVsIG9mIGEgcG9zdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb25zdHJ1Y3Rvcil7XHJcblxyXG5cdHZhciAkc2NvcGUgPSB0aGlzO1xyXG5cclxuXHR2YXIgREVGQVVMVCA9IHtcclxuXHRcdHRpdGxlOiAnJyxcclxuXHRcdHRleHQ6ICcnLFxyXG5cdFx0aW1hZ2U6ICcnLFxyXG5cdFx0cG9zdGVkOiBEYXRlLm5vdygpLFxyXG5cdFx0c2NvcmU6IG5ldyBTY29yZSgpXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gZXh0ZW5kKCRzY29wZSwgREVGQVVMVCwgY29uc3RydWN0b3IpO1xyXG59OyIsInZhciBleHRlbmQgPSByZXF1aXJlKCdleHRlbmQnKTtcclxuXHJcbi8vIFNjb3JlIG1vZGVsXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvbnN0cnVjdG9yKXtcclxuXHR2YXIgJHNjb3BlID0gdGhpcztcclxuXHJcblx0dmFyIERFRkFVTFQgPSB7XHJcblx0XHR1cHZvdGVzOiAwLFxyXG5cdFx0ZG93bnZvdGVzOiAwLFxyXG5cdFx0Z2V0OiBmdW5jdGlvbiAoKXtcclxuXHRcdFx0cmV0dXJuICRzY29wZS51cHZvdGVzIC0gJHNjb3BlLmRvd252b3RlcztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBleHRlbmQoJHNjb3BlLCBERUZBVUxULCBjb25zdHJ1Y3Rvcik7XHJcbn0iLCJ2YXIgZXh0ZW5kID0gcmVxdWlyZSgnZXh0ZW5kJyk7XHJcblxyXG4vLyBEYXRhIG1vZGVsIG9mIGEgcG9zdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb25zdHJ1Y3Rvcil7XHJcblxyXG4gICAgdmFyICRzY29wZSA9IHRoaXM7XHJcblxyXG4gICAgdmFyIERFRkFVTFQgPSB7XHJcbiAgICAgICAgZW1haWw6ICcnLFxyXG4gICAgICAgIHBhc3N3b3JkOiAnJ1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBleHRlbmQoJHNjb3BlLCBERUZBVUxULCBjb25zdHJ1Y3Rvcik7XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRyb3V0ZVByb3ZpZGVyJyxcclxuXHRmdW5jdGlvbiAoJHJvdXRlUHJvdmlkZXIpIHtcclxuXHRcdCRyb3V0ZVByb3ZpZGVyLlxyXG5cdFx0XHJcblx0XHRcdC8vIExpc3Qgb2YgYWxsIHBvc3RzXHJcblx0XHRcdHdoZW4oJy9sb2dpbicsIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJy9hdXRoJ1xyXG5cdFx0XHRcdCxjb250cm9sbGVyOiAnQXV0aENvbnRyb2xsZXInXHJcblx0XHRcdH0pLlxyXG5cclxuXHRcdFx0Ly8gRGV0YWlsIG9mIHNwZWNpZmljIHBvc3RcclxuXHRcdFx0d2hlbignL3JlZ2lzdGVyJywge1xyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnL2F1dGgvcmVnaXN0ZXInXHJcblx0XHRcdFx0LGNvbnRyb2xsZXI6ICdBdXRoQ29udHJvbGxlcidcclxuXHRcdFx0fSkuXHJcblxyXG5cdFx0XHQvLyBMb2dvdXRcclxuXHRcdFx0d2hlbignL2xvZ291dCcsIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJy9hdXRoL2xvZ291dCdcclxuXHRcdFx0XHQsY29udHJvbGxlcjogJ0F1dGhDb250cm9sbGVyJ1xyXG5cdFx0XHR9KS5cclxuXHRcdFx0XHJcblx0XHRcdG90aGVyd2lzZSggeyByZWRpcmVjdFRvOiAnLzQwNCcgfSlcclxuXHR9XHJcbl07IiwibW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRyb3V0ZVByb3ZpZGVyJyxcclxuXHRmdW5jdGlvbiAoJHJvdXRlUHJvdmlkZXIpIHtcclxuXHRcdCRyb3V0ZVByb3ZpZGVyLlxyXG5cdFx0XHJcblx0XHRcdC8vIExpc3Qgb2YgYWxsIHBvc3RzXHJcblx0XHRcdHdoZW4oJy8nLCB7XHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvcG9zdHMvbGlzdCdcclxuXHRcdFx0fSkuXHJcblxyXG5cdFx0XHQvLyBEZXRhaWwgb2Ygc3BlY2lmaWMgcG9zdFxyXG5cdFx0XHR3aGVuKCcvcG9zdC86aWQnLCB7XHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6IGZ1bmN0aW9uICgkcGFyYW1zKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gJy9wb3N0cy9wb3N0LycgKyAkcGFyYW1zLmlkXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRjb250cm9sbGVyOiAnUG9zdERldGFpbENvbnRyb2xsZXInXHJcblx0XHRcdH0pLlxyXG5cclxuXHRcdFx0Ly8gQ3JlYXRlIHBvc3RcclxuXHRcdFx0d2hlbignL2FkZC1saW5rJywge1xyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3Bvc3RzL3Bvc3QtZm9ybSdcclxuXHRcdFx0fSkuXHJcblxyXG5cdFx0XHQvLyBFcnJvclxyXG5cdFx0XHR3aGVuKCcvNDA0Jywge1xyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3Bvc3RzLzQwNCdcclxuXHRcdFx0fSkuXHJcblx0XHRcdG90aGVyd2lzZSggeyByZWRpcmVjdFRvOiAnLzQwNCcgfSlcclxuXHR9XHJcbl07IiwidmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIHVuZGVmaW5lZDtcblxudmFyIGlzUGxhaW5PYmplY3QgPSBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iaikge1xuXHQndXNlIHN0cmljdCc7XG5cdGlmICghb2JqIHx8IHRvU3RyaW5nLmNhbGwob2JqKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHR2YXIgaGFzX293bl9jb25zdHJ1Y3RvciA9IGhhc093bi5jYWxsKG9iaiwgJ2NvbnN0cnVjdG9yJyk7XG5cdHZhciBoYXNfaXNfcHJvcGVydHlfb2ZfbWV0aG9kID0gb2JqLmNvbnN0cnVjdG9yICYmIG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgJiYgaGFzT3duLmNhbGwob2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSwgJ2lzUHJvdG90eXBlT2YnKTtcblx0Ly8gTm90IG93biBjb25zdHJ1Y3RvciBwcm9wZXJ0eSBtdXN0IGJlIE9iamVjdFxuXHRpZiAob2JqLmNvbnN0cnVjdG9yICYmICFoYXNfb3duX2NvbnN0cnVjdG9yICYmICFoYXNfaXNfcHJvcGVydHlfb2ZfbWV0aG9kKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly8gT3duIHByb3BlcnRpZXMgYXJlIGVudW1lcmF0ZWQgZmlyc3RseSwgc28gdG8gc3BlZWQgdXAsXG5cdC8vIGlmIGxhc3Qgb25lIGlzIG93biwgdGhlbiBhbGwgcHJvcGVydGllcyBhcmUgb3duLlxuXHR2YXIga2V5O1xuXHRmb3IgKGtleSBpbiBvYmopIHt9XG5cblx0cmV0dXJuIGtleSA9PT0gdW5kZWZpbmVkIHx8IGhhc093bi5jYWxsKG9iaiwga2V5KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXh0ZW5kKCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBvcHRpb25zLCBuYW1lLCBzcmMsIGNvcHksIGNvcHlJc0FycmF5LCBjbG9uZSxcblx0XHR0YXJnZXQgPSBhcmd1bWVudHNbMF0sXG5cdFx0aSA9IDEsXG5cdFx0bGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCxcblx0XHRkZWVwID0gZmFsc2U7XG5cblx0Ly8gSGFuZGxlIGEgZGVlcCBjb3B5IHNpdHVhdGlvblxuXHRpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0ZGVlcCA9IHRhcmdldDtcblx0XHR0YXJnZXQgPSBhcmd1bWVudHNbMV0gfHwge307XG5cdFx0Ly8gc2tpcCB0aGUgYm9vbGVhbiBhbmQgdGhlIHRhcmdldFxuXHRcdGkgPSAyO1xuXHR9IGVsc2UgaWYgKCh0eXBlb2YgdGFyZ2V0ICE9PSAnb2JqZWN0JyAmJiB0eXBlb2YgdGFyZ2V0ICE9PSAnZnVuY3Rpb24nKSB8fCB0YXJnZXQgPT0gbnVsbCkge1xuXHRcdHRhcmdldCA9IHt9O1xuXHR9XG5cblx0Zm9yICg7IGkgPCBsZW5ndGg7ICsraSkge1xuXHRcdG9wdGlvbnMgPSBhcmd1bWVudHNbaV07XG5cdFx0Ly8gT25seSBkZWFsIHdpdGggbm9uLW51bGwvdW5kZWZpbmVkIHZhbHVlc1xuXHRcdGlmIChvcHRpb25zICE9IG51bGwpIHtcblx0XHRcdC8vIEV4dGVuZCB0aGUgYmFzZSBvYmplY3Rcblx0XHRcdGZvciAobmFtZSBpbiBvcHRpb25zKSB7XG5cdFx0XHRcdHNyYyA9IHRhcmdldFtuYW1lXTtcblx0XHRcdFx0Y29weSA9IG9wdGlvbnNbbmFtZV07XG5cblx0XHRcdFx0Ly8gUHJldmVudCBuZXZlci1lbmRpbmcgbG9vcFxuXHRcdFx0XHRpZiAodGFyZ2V0ID09PSBjb3B5KSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBSZWN1cnNlIGlmIHdlJ3JlIG1lcmdpbmcgcGxhaW4gb2JqZWN0cyBvciBhcnJheXNcblx0XHRcdFx0aWYgKGRlZXAgJiYgY29weSAmJiAoaXNQbGFpbk9iamVjdChjb3B5KSB8fCAoY29weUlzQXJyYXkgPSBBcnJheS5pc0FycmF5KGNvcHkpKSkpIHtcblx0XHRcdFx0XHRpZiAoY29weUlzQXJyYXkpIHtcblx0XHRcdFx0XHRcdGNvcHlJc0FycmF5ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRjbG9uZSA9IHNyYyAmJiBBcnJheS5pc0FycmF5KHNyYykgPyBzcmMgOiBbXTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y2xvbmUgPSBzcmMgJiYgaXNQbGFpbk9iamVjdChzcmMpID8gc3JjIDoge307XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gTmV2ZXIgbW92ZSBvcmlnaW5hbCBvYmplY3RzLCBjbG9uZSB0aGVtXG5cdFx0XHRcdFx0dGFyZ2V0W25hbWVdID0gZXh0ZW5kKGRlZXAsIGNsb25lLCBjb3B5KTtcblxuXHRcdFx0XHQvLyBEb24ndCBicmluZyBpbiB1bmRlZmluZWQgdmFsdWVzXG5cdFx0XHRcdH0gZWxzZSBpZiAoY29weSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0dGFyZ2V0W25hbWVdID0gY29weTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFJldHVybiB0aGUgbW9kaWZpZWQgb2JqZWN0XG5cdHJldHVybiB0YXJnZXQ7XG59O1xuXG4iXX0=

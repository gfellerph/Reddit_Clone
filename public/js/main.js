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
},{"../models/user":14}],3:[function(require,module,exports){
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
},{"../models/comment":11,"../models/user":14}],4:[function(require,module,exports){
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
},{"../models/post":12,"../models/score":13,"../models/user":14}],5:[function(require,module,exports){
var Post = require('../models/post');
var Score = require('../models/score');
var User = require('../models/user');

module.exports = [
	'$scope',
	'$http',
	'$location',
	'$routeParams',
	function ($scope, $http, $location, $routeParams) {

		// List of all posts
		$scope.posts = [];
		// Form model/Detail view
		$scope.post = new Post();
		// ID of the post
		$scope.postId = $routeParams.id;


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
			console.log(score);
			return score;
		}


		//=========
		// Initiate
		//=========

		$scope.list();
	}
];
},{"../models/post":12,"../models/score":13,"../models/user":14}],6:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){

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

},{"./config/interceptor":1,"./controllers/auth":2,"./controllers/comment":3,"./controllers/post":5,"./controllers/post-detail":4,"./directives/auth":6,"./directives/comment":7,"./directives/post":8,"./factories/auth-interceptor":9,"./routes/auth":15,"./routes/post":16}],11:[function(require,module,exports){
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
},{"./score":13,"./user":14,"extend":17}],12:[function(require,module,exports){
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
},{"./score":13,"extend":17}],13:[function(require,module,exports){
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
},{"extend":17}],14:[function(require,module,exports){
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
},{"extend":17}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
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


},{}]},{},[10])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxHaXRIdWJcXFJlZGRpdF9DbG9uZVxcZnJvbnRlbmRcXGJ1aWxkc3lzdGVtXFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvY29uZmlnL2ludGVyY2VwdG9yLmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9jb250cm9sbGVycy9hdXRoLmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9jb250cm9sbGVycy9jb21tZW50LmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9jb250cm9sbGVycy9wb3N0LWRldGFpbC5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvY29udHJvbGxlcnMvcG9zdC5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvZGlyZWN0aXZlcy9hdXRoLmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9kaXJlY3RpdmVzL2NvbW1lbnQuanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL2RpcmVjdGl2ZXMvcG9zdC5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvZmFjdG9yaWVzL2F1dGgtaW50ZXJjZXB0b3IuanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL21haW4uanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL21vZGVscy9jb21tZW50LmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9tb2RlbHMvcG9zdC5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvbW9kZWxzL3Njb3JlLmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9tb2RlbHMvdXNlci5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvcm91dGVzL2F1dGguanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL3JvdXRlcy9wb3N0LmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9ub2RlX21vZHVsZXMvZXh0ZW5kL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRodHRwUHJvdmlkZXInXHJcblx0LCBmdW5jdGlvbiAoJGh0dHBQcm92aWRlcikge1xyXG5cdFx0XHJcblx0XHQvL0h0dHAgSW50ZXJjcGV0b3IgdG8gY2hlY2sgYXV0aCBmYWlsdXJlcyBmb3IgeGhyIHJlcXVlc3RzXHJcblx0XHQkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdhdXRoSW50ZXJjZXB0b3InKTtcclxuXHR9XHJcbl0iLCJ2YXIgVXNlciA9IHJlcXVpcmUoJy4uL21vZGVscy91c2VyJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcclxuXHQnJHNjb3BlJyxcclxuXHQnJGh0dHAnLFxyXG5cdCckcm91dGVQYXJhbXMnLFxyXG5cdCckbG9jYXRpb24nLFxyXG5cdGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRsb2NhdGlvbikge1xyXG5cdFx0JHNjb3BlLnVzZXIgPSBmYWxzZTtcclxuXHJcblx0XHQvLyBHZXQgdXNlciBpbmZvXHJcblx0XHR2YXIgcmVxID0gJGh0dHAuZ2V0KCcvYXBpL3VzZXInKVxyXG5cdFx0XHQuc3VjY2VzcyAoIGZ1bmN0aW9uIChkYXRhKSB7XHJcblx0XHRcdFx0JHNjb3BlLnVzZXIgPSBkYXRhO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0Ly8gVW5kZXJsaW5lIGFjdGl2ZSBwYWdlXHJcblx0XHQkc2NvcGUuaXNBY3RpdmUgPSBmdW5jdGlvbiAocm91dGUpIHtcclxuXHRcdFx0cmV0dXJuIHJvdXRlID09PSAkbG9jYXRpb24ucGF0aCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdCRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCRzY29wZS51c2VyID0gZmFsc2U7XHJcblx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvbG9nb3V0Jyk7XHJcblx0XHR9XHJcblx0fVxyXG5dOyIsIi8vIFJlcXVpcmVzXHJcbnZhciBDb21tZW50ID0gcmVxdWlyZSgnLi4vbW9kZWxzL2NvbW1lbnQnKTtcclxudmFyIFVzZXIgPSByZXF1aXJlKCcuLi9tb2RlbHMvdXNlcicpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRzY29wZScsXHJcblx0JyRodHRwJyxcclxuXHQnJHJvdXRlUGFyYW1zJyxcclxuXHRmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zKSB7XHJcblxyXG5cclxuXHRcdC8vIExpc3Qgb2YgYWxsIGNvbW1lbnRzIGZvciB0aGlzIHBvc3RcclxuXHRcdCRzY29wZS5jb21tZW50cyA9IFtdO1xyXG5cdFx0Ly8gRm9ybSBtb2RlbFxyXG5cdFx0JHNjb3BlLmNvbW1lbnQgPSBuZXcgQ29tbWVudCgpO1xyXG5cdFx0Ly8gSUQgb2YgdGhlIHBvc3RcclxuXHRcdCRzY29wZS5wb3N0SWQgPSAkcm91dGVQYXJhbXMuaWQ7XHJcblx0XHQvLyBEdW1teSBkYXRhIGZvciB1c2VyXHJcblx0XHQkc2NvcGUuZHVtbXlfdXNlciA9IG5ldyBVc2VyKHsgbmFtZTogJ1BoaWxpcHAnLCBqb2luZWQ6IERhdGUubm93KCkgfSk7XHJcblxyXG5cclxuXHRcdC8vPT09PT1cclxuXHRcdC8vIExJU1RcclxuXHRcdC8vPT09PT1cclxuXHJcblx0XHR0aGlzLmxpc3QgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHQvLyBHZXQgY29tbWVudCBsaXN0XHJcblx0XHRcdHZhciByZXEgPSAkaHR0cC5nZXQoJy9hcGkvY29tbWVudHMvdG8vJyArICRzY29wZS5wb3N0SWQpO1xyXG5cdFx0XHRyZXEuc3VjY2VzcyAoIGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG5cdFx0XHRcdCRzY29wZS5jb21tZW50cyA9IGRhdGE7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXEuZXJyb3IgKGZ1bmN0aW9uIChlcnIpIHsgY29uc29sZS5sb2coZXJyKTsgfSk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHQvLz09PT09PT1cclxuXHRcdC8vIENSRUFURVxyXG5cdFx0Ly89PT09PT09XHJcblxyXG5cdFx0dGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHQvLyBJbml0aWFsaXplIGNvbW1lbnQgb2JqZWN0XHJcblx0XHRcdCRzY29wZS5jb21tZW50LnVzZXIgPSAkc2NvcGUuZHVtbXlfdXNlcjtcclxuXHRcdFx0JHNjb3BlLmNvbW1lbnQucG9zdElkID0gJHNjb3BlLnBvc3RJZDtcclxuXHJcblx0XHRcdC8vIFB1c2ggdG8gdGhlIHNlcnZlclxyXG5cdFx0XHR2YXIgcmVxID0gJGh0dHAucG9zdCgnL2FwaS9jb21tZW50JywgJHNjb3BlLmNvbW1lbnQpO1xyXG5cdFx0XHRyZXEuc3VjY2VzcyAoIGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG5cdFx0XHRcdCRzY29wZS5jb21tZW50cy5wdXNoKGRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmVxLmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly8gUmVzZXRcclxuXHRcdFx0JHNjb3BlLmNvbW1lbnQgPSB7fTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly89PT09PT09XHJcblx0XHQvLyBBbnN3ZXJcclxuXHRcdC8vPT09PT09PVxyXG5cclxuXHRcdHRoaXMuYW5zd2VyID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZygkc2NvcGUpO1xyXG5cdFx0XHR2YXIgdGVtcGxhdGUgPSB7fTtcclxuXHRcdFx0dmFyIHJlcSA9ICRodHRwLmdldCgnL2NvbW1lbnRzL2NvbW1lbnQtdGVtcGxhdGUnKTtcclxuXHRcdFx0cmVxLnN1Y2Nlc3MgPSBmdW5jdGlvbiAoIGRhdGEgKSB7XHJcblx0XHRcdFx0dGVtcGxhdGUgPSBkYXRhO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHRlbXBsYXRlKTtcclxuXHRcdFx0XHQkKGRvY3VtZW50KS5wcmVwZW5kKHRlbXBsYXRlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLz09PT09PT1cclxuXHRcdC8vIFVwdm90ZVxyXG5cdFx0Ly89PT09PT09XHJcblx0XHRcclxuXHRcdHRoaXMudXB2b3RlID0gZnVuY3Rpb24gKGNvbW1lbnQpIHtcclxuXHRcdFx0dmFyICRjb21tZW50ID0gbmV3IENvbW1lbnQoY29tbWVudCk7XHJcblxyXG5cdFx0XHQkY29tbWVudC5zY29yZS51cHZvdGVzKys7XHJcblx0XHRcdCRodHRwLnB1dCgnL2FwaS9jb21tZW50LycgKyAkY29tbWVudC5faWQgKyAnL3Vwdm90ZScsICRjb21tZW50KVxyXG5cdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0JGNvbW1lbnQuc2NvcmUudXB2b3Rlcy0tO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLz09PT09PT09PVxyXG5cdFx0Ly8gRG93bnZvdGVcclxuXHRcdC8vPT09PT09PT09XHJcblx0XHRcclxuXHRcdHRoaXMuZG93bnZvdGUgPSBmdW5jdGlvbiAoY29tbWVudCkge1xyXG5cdFx0XHR2YXIgJGNvbW1lbnQgPSBuZXcgQ29tbWVudChjb21tZW50KTtcclxuXHJcblx0XHRcdCRjb21tZW50LnNjb3JlLmRvd252b3RlcysrO1xyXG5cdFx0XHQkaHR0cC5wdXQoJy9hcGkvY29tbWVudC8nICsgJGNvbW1lbnQuX2lkICsgJy9kb3dudm90ZScsICRjb21tZW50KVxyXG5cdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0JGNvbW1lbnQuc2NvcmUuZG93bnZvdGVzLS07XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PT09PT09PT1cclxuXHRcdC8vIEluaXRpYWwgY2FsbHNcclxuXHRcdC8vPT09PT09PT09PT09PT1cclxuXHJcblx0XHR0aGlzLmxpc3QoKTtcclxuXHR9XHJcbl07IiwidmFyIFBvc3QgPSByZXF1aXJlKCcuLi9tb2RlbHMvcG9zdCcpO1xyXG52YXIgU2NvcmUgPSByZXF1aXJlKCcuLi9tb2RlbHMvc2NvcmUnKTtcclxudmFyIFVzZXIgPSByZXF1aXJlKCcuLi9tb2RlbHMvdXNlcicpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRzY29wZScsXHJcblx0JyRodHRwJyxcclxuXHQnJHJvdXRlUGFyYW1zJyxcclxuXHRmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zKSB7XHJcblxyXG5cdFx0Ly8gRm9ybSBtb2RlbC9EZXRhaWwgdmlld1xyXG5cdFx0JHNjb3BlLnBvc3QgPSBuZXcgUG9zdCgpO1xyXG5cdFx0Ly8gSUQgb2YgdGhlIHBvc3RcclxuXHRcdCRzY29wZS5wb3N0SWQgPSAkcm91dGVQYXJhbXMuaWQ7XHJcblx0XHQvLyBEdW1teSBkYXRhIGZvciB1c2VyXHJcblx0XHQkc2NvcGUuZHVtbXlfdXNlciA9IG5ldyBVc2VyKHsgbmFtZTogJ1BoaWxpcHAnLCBqb2luZWQ6IERhdGUubm93KCkgfSk7XHJcblxyXG5cclxuXHRcdC8vPT09PT1cclxuXHRcdC8vIFJlYWRcclxuXHRcdC8vPT09PT1cclxuXHJcblx0XHQkc2NvcGUucmVhZCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdC8vIEdldCBkZXRhaWxzIG9mIG9uZSBwb3N0XHJcblx0XHRcdCRodHRwLmdldCgnL2FwaS9wb3N0LycgKyAkcm91dGVQYXJhbXMuaWQpXHJcblx0XHRcdFx0LnN1Y2Nlc3MgKCBmdW5jdGlvbiAoZGF0YSkge1xyXG5cdFx0XHRcdFx0JHNjb3BlLnBvc3QgPSBuZXcgUG9zdChkYXRhKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCRzY29wZS5wb3N0KTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHQvLz09PT09PT1cclxuXHRcdC8vIFVwdm90ZVxyXG5cdFx0Ly89PT09PT09XHJcblxyXG5cdFx0JHNjb3BlLnVwdm90ZSA9IGZ1bmN0aW9uIChwb3N0KSB7XHJcblx0XHRcdHZhciAkcG9zdCA9IG5ldyBQb3N0KHBvc3QpO1xyXG5cdFx0XHQkcG9zdC5zY29yZS51cHZvdGVzKys7XHJcblxyXG5cdFx0XHQkaHR0cC5wdXQoJy9hcGkvcG9zdC8nICsgJHBvc3QuX2lkICsgJy91cHZvdGUvJywgJHBvc3QpXHJcblx0XHRcdFx0LmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0JHBvc3Quc2NvcmUudXB2b3Rlcy0tO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly89PT09PT09PT1cclxuXHRcdC8vIERvd252b3RlXHJcblx0XHQvLz09PT09PT09PVxyXG5cclxuXHRcdCRzY29wZS5kb3dudm90ZSA9IGZ1bmN0aW9uIChwb3N0KSB7XHJcblx0XHRcdHZhciAkcG9zdCA9IG5ldyBQb3N0KHBvc3QpO1xyXG5cdFx0XHQkcG9zdC5zY29yZS5kb3dudm90ZXMrKztcclxuXHJcblx0XHRcdCRodHRwLnB1dCgnL2FwaS9wb3N0LycgKyAkcG9zdC5faWQgKyAnL2Rvd252b3RlLycsICRwb3N0KVxyXG5cdFx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdCRwb3N0LnNjb3JlLmRvd252b3Rlcy0tO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly89PT09PT09PT1cclxuXHRcdC8vIEluaXRpYXRlXHJcblx0XHQvLz09PT09PT09PVxyXG5cclxuXHRcdCRzY29wZS5yZWFkKCk7XHJcblx0fVxyXG5dOyIsInZhciBQb3N0ID0gcmVxdWlyZSgnLi4vbW9kZWxzL3Bvc3QnKTtcclxudmFyIFNjb3JlID0gcmVxdWlyZSgnLi4vbW9kZWxzL3Njb3JlJyk7XHJcbnZhciBVc2VyID0gcmVxdWlyZSgnLi4vbW9kZWxzL3VzZXInKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gW1xyXG5cdCckc2NvcGUnLFxyXG5cdCckaHR0cCcsXHJcblx0JyRsb2NhdGlvbicsXHJcblx0JyRyb3V0ZVBhcmFtcycsXHJcblx0ZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRsb2NhdGlvbiwgJHJvdXRlUGFyYW1zKSB7XHJcblxyXG5cdFx0Ly8gTGlzdCBvZiBhbGwgcG9zdHNcclxuXHRcdCRzY29wZS5wb3N0cyA9IFtdO1xyXG5cdFx0Ly8gRm9ybSBtb2RlbC9EZXRhaWwgdmlld1xyXG5cdFx0JHNjb3BlLnBvc3QgPSBuZXcgUG9zdCgpO1xyXG5cdFx0Ly8gSUQgb2YgdGhlIHBvc3RcclxuXHRcdCRzY29wZS5wb3N0SWQgPSAkcm91dGVQYXJhbXMuaWQ7XHJcblxyXG5cclxuXHRcdC8vPT09PT1cclxuXHRcdC8vIExJU1RcclxuXHRcdC8vPT09PT1cclxuXHJcblx0XHQkc2NvcGUubGlzdCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdC8vIEdldCBsaXN0IG9mIHBvc3RzXHJcblx0XHRcdCRodHRwLmdldCgnL2FwaS9wb3N0cycpXHJcblx0XHRcdFx0LnN1Y2Nlc3MgKCBmdW5jdGlvbiAoZGF0YSkge1xyXG5cdFx0XHRcdFx0JHNjb3BlLnBvc3RzID0gZGF0YTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHQvLz09PT09PT1cclxuXHRcdC8vIENSRUFURVxyXG5cdFx0Ly89PT09PT09XHJcblxyXG5cdFx0JHNjb3BlLmNyZWF0ZSA9IGZ1bmN0aW9uIChwb3N0KSB7XHJcblx0XHRcdHZhciAkcG9zdCA9IG5ldyBQb3N0KHBvc3QpO1xyXG5cdFx0XHQkaHR0cC5wb3N0KCcvYXBpL3Bvc3QnLCAkcG9zdClcclxuXHRcdFx0XHQuc3VjY2VzcyAoIGZ1bmN0aW9uIChkYXRhKSB7XHJcblx0XHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnLycpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly89PT09PT09XHJcblx0XHQvLyBVcHZvdGVcclxuXHRcdC8vPT09PT09PVxyXG5cclxuXHRcdCRzY29wZS51cHZvdGUgPSBmdW5jdGlvbiAocG9zdCkge1xyXG5cdFx0XHR2YXIgJHBvc3QgPSBuZXcgUG9zdChwb3N0KTtcclxuXHRcdFx0JHBvc3Quc2NvcmUudXB2b3RlcysrO1xyXG5cclxuXHRcdFx0JGh0dHAucHV0KCcvYXBpL3Bvc3QvJyArICRwb3N0Ll9pZCArICcvdXB2b3RlLycsICRwb3N0KVxyXG5cdFx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdCRwb3N0LnNjb3JlLnVwdm90ZXMtLTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PT09XHJcblx0XHQvLyBEb3dudm90ZVxyXG5cdFx0Ly89PT09PT09PT1cclxuXHJcblx0XHQkc2NvcGUuZG93bnZvdGUgPSBmdW5jdGlvbiAocG9zdCkge1xyXG5cdFx0XHR2YXIgJHBvc3QgPSBuZXcgUG9zdChwb3N0KTtcclxuXHRcdFx0JHBvc3Quc2NvcmUuZG93bnZvdGVzKys7XHJcblxyXG5cdFx0XHQkaHR0cC5wdXQoJy9hcGkvcG9zdC8nICsgJHBvc3QuX2lkICsgJy9kb3dudm90ZS8nLCAkcG9zdClcclxuXHRcdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0XHQkcG9zdC5zY29yZS5kb3dudm90ZXMtLTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09XHJcblx0XHQvLyBTY29yZVxyXG5cdFx0Ly89PT09PT1cclxuXHRcdCRzY29wZS5zY29yZSA9IGZ1bmN0aW9uIChwb3N0KSB7XHJcblxyXG5cdFx0XHR2YXIgc2NvcmUgPSAwO1xyXG5cclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwb3N0LnZvdGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0c2NvcmUgKz0gcG9zdC52b3Rlc1tpXS52b3RlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNvbnNvbGUubG9nKHNjb3JlKTtcclxuXHRcdFx0cmV0dXJuIHNjb3JlO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLz09PT09PT09PVxyXG5cdFx0Ly8gSW5pdGlhdGVcclxuXHRcdC8vPT09PT09PT09XHJcblxyXG5cdFx0JHNjb3BlLmxpc3QoKTtcclxuXHR9XHJcbl07IiwibW9kdWxlLmV4cG9ydHMuYXV0aEhlYWRlciA9IFsnJGxvY2F0aW9uJywgZnVuY3Rpb24gKCRsb2NhdGlvbikge1xyXG5cdHJldHVybiB7XHJcblx0XHRyZXN0cmljdDogJ0UnXHJcblx0XHQsdGVtcGxhdGVVcmw6ICcvYXV0aC9oZWFkZXInXHJcblx0fTtcclxufV07IiwiZXhwb3J0cy5jb21tZW50ID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiB7XHJcblx0XHR0ZW1wbGF0ZVVybDogJy9jb21tZW50cy9jb21tZW50LXRlbXBsYXRlJ1xyXG5cdH07XHJcbn07XHJcblxyXG5leHBvcnRzLmNvbW1lbnRGb3JtID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiB7XHJcblx0XHR0ZW1wbGF0ZVVybDogJy9jb21tZW50cy9jb21tZW50LWZvcm0nXHJcblx0fTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cy5saXN0ID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiB7XHJcblx0XHR0ZW1wbGF0ZVVybDogJy9wb3N0cy9wb3N0LXRlbXBsYXRlJyxcclxuXHRcdHJlcGxhY2U6IHRydWVcclxuXHR9O1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuZGV0YWlsID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiB7XHJcblx0XHR0ZW1wbGF0ZVVybDogJy9wb3N0cy9wb3N0LWRldGFpbCdcclxuXHRcdFxyXG5cdH07XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5mb3JtID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiB7XHJcblx0XHR0ZW1wbGF0ZVVybDogJy9wb3N0cy9wb3N0LWZvcm0nXHJcblx0fTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IFtcclxuXHQnJHEnXHJcblx0LCAnJGxvY2F0aW9uJ1xyXG5cdCwgZnVuY3Rpb24gKCRxLCAkbG9jYXRpb24pIHtcclxuXHRcdHZhciBoYW5kbGVyID0ge1xyXG5cdFx0XHRyZXNwb25zZTogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAxKSB7XHJcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UgfHwgJHEud2hlbihyZXNwb25zZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0LCByZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVqZWN0aW9uKSB7XHJcblx0XHRcdFx0aWYgKHJlamVjdGlvbi5zdGF0dXMgPT09IDQwMSkge1xyXG5cdFx0XHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9sb2dpbicpLnNlYXJjaCgncmV0dXJuVG8nLCBKU09OLnBhcnNlKHJlamVjdGlvbi5kYXRhKS5yZXR1cm5Ubyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vcmV0dXJuICRxLnJlamVjdChyZWplY3Rpb24pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGhhbmRsZXI7XHJcblx0fVxyXG5dOyIsIlxyXG4vLz09PT09PT09XHJcbi8vIFRoZSBhcHBcclxuLy89PT09PT09PVxyXG5cclxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdyZWRkaXQnLCBbJ25nUm91dGUnXSk7XHJcblxyXG5cclxuLy89PT09PT09PVxyXG4vLyBJbXBvcnRzXHJcbi8vPT09PT09PT1cclxuXHJcbi8vIFJvdXRlc1xyXG52YXIgcG9zdFJvdXRlcyBcdFx0XHQ9IHJlcXVpcmUoJy4vcm91dGVzL3Bvc3QnKTtcclxudmFyIGF1dGhSb3V0ZXMgXHRcdFx0PSByZXF1aXJlKCcuL3JvdXRlcy9hdXRoJyk7XHJcblxyXG4vLyBDb250cm9sbGVyc1xyXG52YXIgcG9zdEN0cmwgXHRcdFx0PSByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL3Bvc3QnKTtcclxudmFyIHBvc3REZXRhaWxDdHJsIFx0XHQ9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvcG9zdC1kZXRhaWwnKTtcclxudmFyIGNvbW1lbnRDdHJsIFx0XHQ9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvY29tbWVudCcpO1xyXG52YXIgYXV0aEN0cmwgXHRcdFx0PSByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL2F1dGgnKTtcclxuXHJcbi8vIERpcmVjdGl2ZXNcclxudmFyIHBvc3REaXJlY3RpdmUgXHRcdD0gcmVxdWlyZSgnLi9kaXJlY3RpdmVzL3Bvc3QnKTtcclxudmFyIGNvbW1lbnREaXJlY3RpdmUgXHQ9IHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9jb21tZW50Jyk7XHJcbnZhciBhdXRoRGlyZWN0aXZlIFx0XHQ9IHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9hdXRoJyk7XHJcblxyXG4vLyBGYWN0b3JpZXNcclxudmFyIGF1dGhJbnRlcmNlcHRvciBcdD0gcmVxdWlyZSgnLi9mYWN0b3JpZXMvYXV0aC1pbnRlcmNlcHRvcicpO1xyXG5cclxuLy8gQ29uZmlnXHJcbnZhciBpbnRlcmNlcHRvciBcdFx0PSByZXF1aXJlKCcuL2NvbmZpZy9pbnRlcmNlcHRvcicpO1xyXG5cclxuXHJcbi8vPT09PT09PT1cclxuLy8gRmFjdG9yeVxyXG4vLz09PT09PT09XHJcblxyXG5hcHAuZmFjdG9yeSgnYXV0aEludGVyY2VwdG9yJywgYXV0aEludGVyY2VwdG9yKTtcclxuXHJcblxyXG4vLz09PT09PT1cclxuLy8gQ29uZmlnXHJcbi8vPT09PT09PVxyXG5cclxuYXBwLmNvbmZpZyhpbnRlcmNlcHRvcik7XHJcblxyXG5cclxuLy89PT09PT09XHJcbi8vIFJvdXRlc1xyXG4vLz09PT09PT1cclxuXHJcbmFwcC5jb25maWcocG9zdFJvdXRlcyk7XHJcbmFwcC5jb25maWcoYXV0aFJvdXRlcyk7XHJcblxyXG5cclxuLy89PT09PT09PT09PT1cclxuLy8gQ29udHJvbGxlcnNcclxuLy89PT09PT09PT09PT1cclxuXHJcbmFwcC5jb250cm9sbGVyKCdQb3N0Q29udHJvbGxlcicsIHBvc3RDdHJsKTtcclxuYXBwLmNvbnRyb2xsZXIoJ1Bvc3REZXRhaWxDb250cm9sbGVyJywgcG9zdERldGFpbEN0cmwpO1xyXG5hcHAuY29udHJvbGxlcignQ29tbWVudENvbnRyb2xsZXInLCBjb21tZW50Q3RybCk7XHJcbmFwcC5jb250cm9sbGVyKCdBdXRoQ29udHJvbGxlcicsIGF1dGhDdHJsKTtcclxuXHJcblxyXG4vLz09PT09PT09PT09XHJcbi8vIERpcmVjdGl2ZXNcclxuLy89PT09PT09PT09PVxyXG5cclxuYXBwLmRpcmVjdGl2ZSgncG9zdCcsIHBvc3REaXJlY3RpdmUubGlzdCk7XHJcbmFwcC5kaXJlY3RpdmUoJ3Bvc3RkZXRhaWwnLCBwb3N0RGlyZWN0aXZlLmRldGFpbCk7XHJcbmFwcC5kaXJlY3RpdmUoJ3Bvc3Rmb3JtJywgcG9zdERpcmVjdGl2ZS5mb3JtKTtcclxuYXBwLmRpcmVjdGl2ZSgnY29tbWVudCcsIGNvbW1lbnREaXJlY3RpdmUuY29tbWVudCk7XHJcbmFwcC5kaXJlY3RpdmUoJ2NvbW1lbnRmb3JtJywgY29tbWVudERpcmVjdGl2ZS5jb21tZW50Rm9ybSk7XHJcbmFwcC5kaXJlY3RpdmUoJ2F1dGhoZWFkZXInLCBhdXRoRGlyZWN0aXZlLmF1dGhIZWFkZXIpO1xyXG4iLCJ2YXIgVXNlciBcdD0gcmVxdWlyZSgnLi91c2VyJyk7XHJcbnZhciBTY29yZSBcdD0gcmVxdWlyZSgnLi9zY29yZScpO1xyXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgnZXh0ZW5kJyk7XHJcblxyXG4vLz09PT09XHJcbi8vIERhdGEgbW9kZWwgb2YgYSBjb21tZW50XHJcbi8vPT09PT1cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29uc3RydWN0b3IpIHtcclxuXHR2YXIgJHNjb3BlID0gdGhpcztcclxuXHJcblx0dmFyIERFRkFVTFQgPSB7XHJcblx0XHR0ZXh0OiAnJyxcclxuXHRcdHBhcmVudDogbnVsbCxcclxuXHRcdHBvc3RlZDogRGF0ZS5ub3coKSxcclxuXHRcdHVzZXI6IG5ldyBVc2VyKCksXHJcblx0XHRzY29yZTogbmV3IFNjb3JlKCksXHJcblx0XHRwb3N0SWQ6IC0xXHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiBleHRlbmQoJHNjb3BlLCBERUZBVUxULCBjb25zdHJ1Y3Rvcik7XHJcbn07IiwidmFyIFNjb3JlIFx0PSByZXF1aXJlKCcuL3Njb3JlJyk7XHJcbnZhciBleHRlbmQgPSByZXF1aXJlKCdleHRlbmQnKTtcclxuXHJcbi8vIERhdGEgbW9kZWwgb2YgYSBwb3N0XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvbnN0cnVjdG9yKXtcclxuXHJcblx0dmFyICRzY29wZSA9IHRoaXM7XHJcblxyXG5cdHZhciBERUZBVUxUID0ge1xyXG5cdFx0dGl0bGU6ICcnLFxyXG5cdFx0dGV4dDogJycsXHJcblx0XHRpbWFnZTogJycsXHJcblx0XHRwb3N0ZWQ6IERhdGUubm93KCksXHJcblx0XHRzY29yZTogbmV3IFNjb3JlKClcclxuXHR9XHJcblxyXG5cdHJldHVybiBleHRlbmQoJHNjb3BlLCBERUZBVUxULCBjb25zdHJ1Y3Rvcik7XHJcbn07IiwidmFyIGV4dGVuZCA9IHJlcXVpcmUoJ2V4dGVuZCcpO1xyXG5cclxuLy8gU2NvcmUgbW9kZWxcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29uc3RydWN0b3Ipe1xyXG5cdHZhciAkc2NvcGUgPSB0aGlzO1xyXG5cclxuXHR2YXIgREVGQVVMVCA9IHtcclxuXHRcdHVwdm90ZXM6IDAsXHJcblx0XHRkb3dudm90ZXM6IDAsXHJcblx0XHRnZXQ6IGZ1bmN0aW9uICgpe1xyXG5cdFx0XHRyZXR1cm4gJHNjb3BlLnVwdm90ZXMgLSAkc2NvcGUuZG93bnZvdGVzO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIGV4dGVuZCgkc2NvcGUsIERFRkFVTFQsIGNvbnN0cnVjdG9yKTtcclxufSIsInZhciBleHRlbmQgPSByZXF1aXJlKCdleHRlbmQnKTtcclxuXHJcbi8vIERhdGEgbW9kZWwgb2YgYSBwb3N0XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvbnN0cnVjdG9yKXtcclxuXHJcbiAgICB2YXIgJHNjb3BlID0gdGhpcztcclxuXHJcbiAgICB2YXIgREVGQVVMVCA9IHtcclxuICAgICAgICBlbWFpbDogJycsXHJcbiAgICAgICAgcGFzc3dvcmQ6ICcnXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGV4dGVuZCgkc2NvcGUsIERFRkFVTFQsIGNvbnN0cnVjdG9yKTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IFtcclxuXHQnJHJvdXRlUHJvdmlkZXInLFxyXG5cdGZ1bmN0aW9uICgkcm91dGVQcm92aWRlcikge1xyXG5cdFx0JHJvdXRlUHJvdmlkZXIuXHJcblx0XHRcclxuXHRcdFx0Ly8gTGlzdCBvZiBhbGwgcG9zdHNcclxuXHRcdFx0d2hlbignL2xvZ2luJywge1xyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnL2F1dGgnXHJcblx0XHRcdFx0LGNvbnRyb2xsZXI6ICdBdXRoQ29udHJvbGxlcidcclxuXHRcdFx0fSkuXHJcblxyXG5cdFx0XHQvLyBEZXRhaWwgb2Ygc3BlY2lmaWMgcG9zdFxyXG5cdFx0XHR3aGVuKCcvcmVnaXN0ZXInLCB7XHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvYXV0aC9yZWdpc3RlcidcclxuXHRcdFx0XHQsY29udHJvbGxlcjogJ0F1dGhDb250cm9sbGVyJ1xyXG5cdFx0XHR9KS5cclxuXHJcblx0XHRcdC8vIExvZ291dFxyXG5cdFx0XHR3aGVuKCcvbG9nb3V0Jywge1xyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnL2F1dGgvbG9nb3V0J1xyXG5cdFx0XHRcdCxjb250cm9sbGVyOiAnQXV0aENvbnRyb2xsZXInXHJcblx0XHRcdH0pLlxyXG5cdFx0XHRcclxuXHRcdFx0b3RoZXJ3aXNlKCB7IHJlZGlyZWN0VG86ICcvNDA0JyB9KVxyXG5cdH1cclxuXTsiLCJtb2R1bGUuZXhwb3J0cyA9IFtcclxuXHQnJHJvdXRlUHJvdmlkZXInLFxyXG5cdGZ1bmN0aW9uICgkcm91dGVQcm92aWRlcikge1xyXG5cdFx0JHJvdXRlUHJvdmlkZXIuXHJcblx0XHRcclxuXHRcdFx0Ly8gTGlzdCBvZiBhbGwgcG9zdHNcclxuXHRcdFx0d2hlbignLycsIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJy9wb3N0cy9saXN0J1xyXG5cdFx0XHR9KS5cclxuXHJcblx0XHRcdC8vIERldGFpbCBvZiBzcGVjaWZpYyBwb3N0XHJcblx0XHRcdHdoZW4oJy9wb3N0LzppZCcsIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogZnVuY3Rpb24gKCRwYXJhbXMpIHtcclxuXHRcdFx0XHRcdHJldHVybiAnL3Bvc3RzL3Bvc3QvJyArICRwYXJhbXMuaWRcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdQb3N0RGV0YWlsQ29udHJvbGxlcidcclxuXHRcdFx0fSkuXHJcblxyXG5cdFx0XHQvLyBDcmVhdGUgcG9zdFxyXG5cdFx0XHR3aGVuKCcvYWRkLWxpbmsnLCB7XHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvcG9zdHMvcG9zdC1mb3JtJ1xyXG5cdFx0XHR9KS5cclxuXHJcblx0XHRcdC8vIEVycm9yXHJcblx0XHRcdHdoZW4oJy80MDQnLCB7XHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvcG9zdHMvNDA0J1xyXG5cdFx0XHR9KS5cclxuXHRcdFx0b3RoZXJ3aXNlKCB7IHJlZGlyZWN0VG86ICcvNDA0JyB9KVxyXG5cdH1cclxuXTsiLCJ2YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG52YXIgdW5kZWZpbmVkO1xuXG52YXIgaXNQbGFpbk9iamVjdCA9IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qob2JqKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0aWYgKCFvYmogfHwgdG9TdHJpbmcuY2FsbChvYmopICE9PSAnW29iamVjdCBPYmplY3RdJykge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHZhciBoYXNfb3duX2NvbnN0cnVjdG9yID0gaGFzT3duLmNhbGwob2JqLCAnY29uc3RydWN0b3InKTtcblx0dmFyIGhhc19pc19wcm9wZXJ0eV9vZl9tZXRob2QgPSBvYmouY29uc3RydWN0b3IgJiYgb2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSAmJiBoYXNPd24uY2FsbChvYmouY29uc3RydWN0b3IucHJvdG90eXBlLCAnaXNQcm90b3R5cGVPZicpO1xuXHQvLyBOb3Qgb3duIGNvbnN0cnVjdG9yIHByb3BlcnR5IG11c3QgYmUgT2JqZWN0XG5cdGlmIChvYmouY29uc3RydWN0b3IgJiYgIWhhc19vd25fY29uc3RydWN0b3IgJiYgIWhhc19pc19wcm9wZXJ0eV9vZl9tZXRob2QpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvLyBPd24gcHJvcGVydGllcyBhcmUgZW51bWVyYXRlZCBmaXJzdGx5LCBzbyB0byBzcGVlZCB1cCxcblx0Ly8gaWYgbGFzdCBvbmUgaXMgb3duLCB0aGVuIGFsbCBwcm9wZXJ0aWVzIGFyZSBvd24uXG5cdHZhciBrZXk7XG5cdGZvciAoa2V5IGluIG9iaikge31cblxuXHRyZXR1cm4ga2V5ID09PSB1bmRlZmluZWQgfHwgaGFzT3duLmNhbGwob2JqLCBrZXkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBleHRlbmQoKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIG9wdGlvbnMsIG5hbWUsIHNyYywgY29weSwgY29weUlzQXJyYXksIGNsb25lLFxuXHRcdHRhcmdldCA9IGFyZ3VtZW50c1swXSxcblx0XHRpID0gMSxcblx0XHRsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLFxuXHRcdGRlZXAgPSBmYWxzZTtcblxuXHQvLyBIYW5kbGUgYSBkZWVwIGNvcHkgc2l0dWF0aW9uXG5cdGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnYm9vbGVhbicpIHtcblx0XHRkZWVwID0gdGFyZ2V0O1xuXHRcdHRhcmdldCA9IGFyZ3VtZW50c1sxXSB8fCB7fTtcblx0XHQvLyBza2lwIHRoZSBib29sZWFuIGFuZCB0aGUgdGFyZ2V0XG5cdFx0aSA9IDI7XG5cdH0gZWxzZSBpZiAoKHR5cGVvZiB0YXJnZXQgIT09ICdvYmplY3QnICYmIHR5cGVvZiB0YXJnZXQgIT09ICdmdW5jdGlvbicpIHx8IHRhcmdldCA9PSBudWxsKSB7XG5cdFx0dGFyZ2V0ID0ge307XG5cdH1cblxuXHRmb3IgKDsgaSA8IGxlbmd0aDsgKytpKSB7XG5cdFx0b3B0aW9ucyA9IGFyZ3VtZW50c1tpXTtcblx0XHQvLyBPbmx5IGRlYWwgd2l0aCBub24tbnVsbC91bmRlZmluZWQgdmFsdWVzXG5cdFx0aWYgKG9wdGlvbnMgIT0gbnVsbCkge1xuXHRcdFx0Ly8gRXh0ZW5kIHRoZSBiYXNlIG9iamVjdFxuXHRcdFx0Zm9yIChuYW1lIGluIG9wdGlvbnMpIHtcblx0XHRcdFx0c3JjID0gdGFyZ2V0W25hbWVdO1xuXHRcdFx0XHRjb3B5ID0gb3B0aW9uc1tuYW1lXTtcblxuXHRcdFx0XHQvLyBQcmV2ZW50IG5ldmVyLWVuZGluZyBsb29wXG5cdFx0XHRcdGlmICh0YXJnZXQgPT09IGNvcHkpIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFJlY3Vyc2UgaWYgd2UncmUgbWVyZ2luZyBwbGFpbiBvYmplY3RzIG9yIGFycmF5c1xuXHRcdFx0XHRpZiAoZGVlcCAmJiBjb3B5ICYmIChpc1BsYWluT2JqZWN0KGNvcHkpIHx8IChjb3B5SXNBcnJheSA9IEFycmF5LmlzQXJyYXkoY29weSkpKSkge1xuXHRcdFx0XHRcdGlmIChjb3B5SXNBcnJheSkge1xuXHRcdFx0XHRcdFx0Y29weUlzQXJyYXkgPSBmYWxzZTtcblx0XHRcdFx0XHRcdGNsb25lID0gc3JjICYmIEFycmF5LmlzQXJyYXkoc3JjKSA/IHNyYyA6IFtdO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjbG9uZSA9IHNyYyAmJiBpc1BsYWluT2JqZWN0KHNyYykgPyBzcmMgOiB7fTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBOZXZlciBtb3ZlIG9yaWdpbmFsIG9iamVjdHMsIGNsb25lIHRoZW1cblx0XHRcdFx0XHR0YXJnZXRbbmFtZV0gPSBleHRlbmQoZGVlcCwgY2xvbmUsIGNvcHkpO1xuXG5cdFx0XHRcdC8vIERvbid0IGJyaW5nIGluIHVuZGVmaW5lZCB2YWx1ZXNcblx0XHRcdFx0fSBlbHNlIGlmIChjb3B5ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHR0YXJnZXRbbmFtZV0gPSBjb3B5O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmV0dXJuIHRoZSBtb2RpZmllZCBvYmplY3Rcblx0cmV0dXJuIHRhcmdldDtcbn07XG5cbiJdfQ==

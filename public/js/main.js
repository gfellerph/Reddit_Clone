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

		// Expose user to root scope
		$scope.$watch('user', function (user) {
			$scope.$root.user = user;
		});

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
},{"../models/user":18}],3:[function(require,module,exports){
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
},{"../models/comment":15,"../models/user":18}],4:[function(require,module,exports){
var Post = require('../models/post');

module.exports = [
	'$scope',
	'$http',
	'$routeParams',
	function ($scope, $http, $routeParams) {

		// Form model/Detail view
		$scope.post = {};

		// Get details of one post
		$http.get('/api/post/' + $routeParams.id)
			.success ( function (data) {
				$scope.post = data;
			})
			.error ( function (err) {
				console.log(err);
			});

		//console.log($scope);
	}
];
},{"../models/post":16}],5:[function(require,module,exports){
var Post = require('../models/post');
var Score = require('../models/score');

module.exports = [
	'$scope',
	'$http',
	'$location',
	'$routeParams',
	function ($scope, $http, $location, $routeParams) {

		// List of all posts
		$scope.posts = [];
		

		// Refresh element positions
		$scope.updatePackery = function () {
			$('.posts').packery();
		};


		//=====
		// LIST
		//=====

		// Get list of posts
		$http.get('/api/posts')
			.success ( function (data) {
				$scope.posts = data;
			})
			.error ( function (err) {
				console.log(err);
			});
	}
];
},{"../models/post":16,"../models/score":17}],6:[function(require,module,exports){
var Post = require('../models/post');
var Score = require('../models/score');
var User = require('../models/user');

module.exports = [
	'$scope',
	'$http',
	'$location',
	'$routeParams',
	function ($scope, $http, $location, $routeParams) {
		
		// ID of the post
		$scope.postId = $routeParams.id;

		//=======
		// CREATE
		//=======

		$scope.create = function (post) {
			var $post = new Post(post);
			console.log($post);
			$http.post('/api/post', $post)
				.success ( function (data) {
					$location.path('/');
				})
				.error ( function (err) {
					console.log(err);
				});
		}
	}
];
},{"../models/post":16,"../models/score":17,"../models/user":18}],7:[function(require,module,exports){
module.exports = [
	'$scope',
	'$http',
	'$location',
	'$routeParams',
	function ($scope, $http, $location, $routeParams) {


		//=======
		// Upvote
		//=======

		$scope.upvote = function () {

			var id = $scope.post._id;

			$http.put('/api/post/' + id + '/upvote/', $scope.post)
				.success ( function (post) {
					console.log(post);
					$scope.post.votes = post.votes;
				})
				.error ( function (err) {
					console.log(err);
				});
		}


		//=========
		// Downvote
		//=========

		$scope.downvote = function () {

			var id = $scope.post._id;

			$http.put('/api/post/' + id + '/downvote/', $scope.post)
				.success ( function (post) {
					$scope.post.votes = post.votes;
				})
				.error ( function (err) {
					console.log(err);
				});
		}


		//======
		// Score
		//======

		$scope.score = function () {

			var score = 0;

			if(!$scope.post.votes) return score;

			for (var i = 0; i < $scope.post.votes.length; i++) {
				score += $scope.post.votes[i].vote;
			}
			
			return score;
		}

		$scope.hasUpvoted = function () {

			if(!$scope.post || !$scope.$root.user || !$scope.post.votes) return false;

			var post = $scope.post;
			var userId = $scope.$root.user._id;
			var upvoted = false;

			for (var i = 0; i < post.votes.length; i++) {
				if(post.votes[i].userId == userId && post.votes[i].vote == 1) upvoted = true;
			}

			return upvoted;
		}

		$scope.hasDownvoted = function () {

			if(!$scope.post || !$scope.$root.user || !$scope.post.votes) return false;

			var post = $scope.post;
			var userId = $scope.$root.user._id;
			var downvoted = false;

			for (var i = 0; i < post.votes.length; i++) {
				if(post.votes[i].userId == userId && post.votes[i].vote == -1) downvoted = true;
			}

			return downvoted;
		}
	}
];
},{}],8:[function(require,module,exports){
module.exports.authHeader = ['$location', function ($location) {
	return {
		restrict: 'E'
		,templateUrl: '/auth/header'
	};
}];
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
module.exports.post = function () {
	return {
		templateUrl: '/posts/post-template',
		replace: true,
		controller: 'PostController'
	};
};

module.exports.form = function () {
	return {
		templateUrl: '/posts/post-form',
		controller: 'PostFormController'
	};
};
},{}],11:[function(require,module,exports){
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
			console.log('initialize packery');
			// Initialize packery
			$posts.packery({
				//itemSelector: 'li',
				gutter: 0
			});
		});
	};

	return {
		link: linkFunction,
		restrict: 'A',
		controller: controllerFunction
	}
};
},{}],12:[function(require,module,exports){
module.exports = function ($root) {
	var state;

	var broadcast = function ( state ) {
		$root.$broadcast('auth.update', state);
	};

	var update = function ( newState ) {
		state = newState;
		broadcast( state );
	};

	return {
		update: update,
		state: state
	};
};
},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){

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
var presiRoutes			= require('./routes/presentation');

// Controllers
var postCtrl 			= require('./controllers/post');
var listViewCtrl		= require('./controllers/list-view');
var detailViewCtrl 		= require('./controllers/detail-view');
var postFormCtrl 		= require('./controllers/post-form');
var commentCtrl 		= require('./controllers/comment');
var authCtrl 			= require('./controllers/auth');

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
app.config(presiRoutes);


//============
// Controllers
//============

app.controller('PostController', postCtrl);
app.controller('DetailViewController', detailViewCtrl);
app.controller('ListViewController', listViewCtrl);
app.controller('PostFormController', postFormCtrl);
app.controller('CommentController', commentCtrl);
app.controller('AuthController', authCtrl);


//===========
// Directives
//===========

app.directive('post', postDirective.post);
app.directive('postform', postDirective.form);
app.directive('comment', commentDirective.comment);
app.directive('commentform', commentDirective.commentForm);
app.directive('authheader', authDirective.authHeader);
app.directive('postsLoaded', postsLoaded);
},{"./config/interceptor":1,"./controllers/auth":2,"./controllers/comment":3,"./controllers/detail-view":4,"./controllers/list-view":5,"./controllers/post":7,"./controllers/post-form":6,"./directives/auth":8,"./directives/comment":9,"./directives/post":10,"./directives/posts-loaded":11,"./factories/auth-change-notifier":12,"./factories/auth-interceptor":13,"./routes/auth":19,"./routes/post":20,"./routes/presentation":21}],15:[function(require,module,exports){
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
},{"./score":17,"./user":18,"extend":22}],16:[function(require,module,exports){
var extend = require('extend');

// Data model of a post
module.exports = function (constructor){

	var $scope = this;

	var DEFAULT = {
		title: '',
		text: '',
		image: '',
		posted: Date.now()
	}

	return extend($scope, DEFAULT, constructor);
};
},{"extend":22}],17:[function(require,module,exports){
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
},{"extend":22}],18:[function(require,module,exports){
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
},{"extend":22}],19:[function(require,module,exports){
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
},{}],20:[function(require,module,exports){
module.exports = [
	'$routeProvider',
	function ($routeProvider) {
		$routeProvider.
		
			// List of all posts
			when('/', {
				templateUrl: '/posts/list',
				controller: 'ListViewController'
			}).

			// Detail of specific post
			when('/post/:id', {
				templateUrl: function ($params) {
					return '/posts/post/' + $params.id
				},
				controller: 'DetailViewController'
			}).

			// Create post
			when('/add-link', {
				templateUrl: '/posts/post-form',
				controller: 'PostFormController'
			}).

			// Error
			when('/404', {
				templateUrl: '/posts/404'
			}).
			otherwise( { redirectTo: '/404' })
	}
];
},{}],21:[function(require,module,exports){
module.exports = [
	'$routeProvider',
	function ($routeProvider) {
		$routeProvider.
		
			when('/presentation', { templateUrl: '/presentation', controller: 'AuthController'}).

			otherwise( { redirectTo: '/404' })
	}
];
},{}],22:[function(require,module,exports){
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


},{}]},{},[14])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxHaXRIdWJcXFJlZGRpdF9DbG9uZVxcZnJvbnRlbmRcXGJ1aWxkc3lzdGVtXFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvY29uZmlnL2ludGVyY2VwdG9yLmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9jb250cm9sbGVycy9hdXRoLmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9jb250cm9sbGVycy9jb21tZW50LmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9jb250cm9sbGVycy9kZXRhaWwtdmlldy5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvY29udHJvbGxlcnMvbGlzdC12aWV3LmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9jb250cm9sbGVycy9wb3N0LWZvcm0uanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL2NvbnRyb2xsZXJzL3Bvc3QuanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL2RpcmVjdGl2ZXMvYXV0aC5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvZGlyZWN0aXZlcy9jb21tZW50LmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9kaXJlY3RpdmVzL3Bvc3QuanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL2RpcmVjdGl2ZXMvcG9zdHMtbG9hZGVkLmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9mYWN0b3JpZXMvYXV0aC1jaGFuZ2Utbm90aWZpZXIuanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL2ZhY3Rvcmllcy9hdXRoLWludGVyY2VwdG9yLmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9tYWluLmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9tb2RlbHMvY29tbWVudC5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvbW9kZWxzL3Bvc3QuanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL21vZGVscy9zY29yZS5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvbW9kZWxzL3VzZXIuanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL3JvdXRlcy9hdXRoLmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9yb3V0ZXMvcG9zdC5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvcm91dGVzL3ByZXNlbnRhdGlvbi5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvbm9kZV9tb2R1bGVzL2V4dGVuZC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gW1xyXG5cdCckaHR0cFByb3ZpZGVyJ1xyXG5cdCwgZnVuY3Rpb24gKCRodHRwUHJvdmlkZXIpIHtcclxuXHRcdFxyXG5cdFx0Ly9IdHRwIEludGVyY3BldG9yIHRvIGNoZWNrIGF1dGggZmFpbHVyZXMgZm9yIHhociByZXF1ZXN0c1xyXG5cdFx0JGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnYXV0aEludGVyY2VwdG9yJyk7XHJcblx0fVxyXG5dIiwidmFyIFVzZXIgPSByZXF1aXJlKCcuLi9tb2RlbHMvdXNlcicpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRzY29wZScsXHJcblx0JyRodHRwJyxcclxuXHQnJHJvdXRlUGFyYW1zJyxcclxuXHQnJGxvY2F0aW9uJyxcclxuXHRmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24pIHtcclxuXHRcdCRzY29wZS51c2VyID0gZmFsc2U7XHJcblxyXG5cdFx0Ly8gRXhwb3NlIHVzZXIgdG8gcm9vdCBzY29wZVxyXG5cdFx0JHNjb3BlLiR3YXRjaCgndXNlcicsIGZ1bmN0aW9uICh1c2VyKSB7XHJcblx0XHRcdCRzY29wZS4kcm9vdC51c2VyID0gdXNlcjtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIEdldCB1c2VyIGluZm9cclxuXHRcdHZhciByZXEgPSAkaHR0cC5nZXQoJy9hcGkvdXNlcicpXHJcblx0XHRcdC5zdWNjZXNzICggZnVuY3Rpb24gKGRhdGEpIHtcclxuXHRcdFx0XHQkc2NvcGUudXNlciA9IGRhdGE7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHQvLyBVbmRlcmxpbmUgYWN0aXZlIHBhZ2VcclxuXHRcdCRzY29wZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uIChyb3V0ZSkge1xyXG5cdFx0XHRyZXR1cm4gcm91dGUgPT09ICRsb2NhdGlvbi5wYXRoKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0JHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0JHNjb3BlLnVzZXIgPSBmYWxzZTtcclxuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9sb2dvdXQnKTtcclxuXHRcdH1cclxuXHR9XHJcbl07IiwiLy8gUmVxdWlyZXNcclxudmFyIENvbW1lbnQgPSByZXF1aXJlKCcuLi9tb2RlbHMvY29tbWVudCcpO1xyXG52YXIgVXNlciA9IHJlcXVpcmUoJy4uL21vZGVscy91c2VyJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcclxuXHQnJHNjb3BlJyxcclxuXHQnJGh0dHAnLFxyXG5cdCckcm91dGVQYXJhbXMnLFxyXG5cdGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMpIHtcclxuXHJcblxyXG5cdFx0Ly8gTGlzdCBvZiBhbGwgY29tbWVudHMgZm9yIHRoaXMgcG9zdFxyXG5cdFx0JHNjb3BlLmNvbW1lbnRzID0gW107XHJcblx0XHQvLyBGb3JtIG1vZGVsXHJcblx0XHQkc2NvcGUuY29tbWVudCA9IG5ldyBDb21tZW50KCk7XHJcblx0XHQvLyBJRCBvZiB0aGUgcG9zdFxyXG5cdFx0JHNjb3BlLnBvc3RJZCA9ICRyb3V0ZVBhcmFtcy5pZDtcclxuXHRcdC8vIER1bW15IGRhdGEgZm9yIHVzZXJcclxuXHRcdCRzY29wZS5kdW1teV91c2VyID0gbmV3IFVzZXIoeyBuYW1lOiAnUGhpbGlwcCcsIGpvaW5lZDogRGF0ZS5ub3coKSB9KTtcclxuXHJcblxyXG5cdFx0Ly89PT09PVxyXG5cdFx0Ly8gTElTVFxyXG5cdFx0Ly89PT09PVxyXG5cclxuXHRcdHRoaXMubGlzdCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdC8vIEdldCBjb21tZW50IGxpc3RcclxuXHRcdFx0dmFyIHJlcSA9ICRodHRwLmdldCgnL2FwaS9jb21tZW50cy90by8nICsgJHNjb3BlLnBvc3RJZCk7XHJcblx0XHRcdHJlcS5zdWNjZXNzICggZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcblx0XHRcdFx0JHNjb3BlLmNvbW1lbnRzID0gZGF0YTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJlcS5lcnJvciAoZnVuY3Rpb24gKGVycikgeyBjb25zb2xlLmxvZyhlcnIpOyB9KTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdC8vPT09PT09PVxyXG5cdFx0Ly8gQ1JFQVRFXHJcblx0XHQvLz09PT09PT1cclxuXHJcblx0XHR0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdC8vIEluaXRpYWxpemUgY29tbWVudCBvYmplY3RcclxuXHRcdFx0JHNjb3BlLmNvbW1lbnQudXNlciA9ICRzY29wZS5kdW1teV91c2VyO1xyXG5cdFx0XHQkc2NvcGUuY29tbWVudC5wb3N0SWQgPSAkc2NvcGUucG9zdElkO1xyXG5cclxuXHRcdFx0Ly8gUHVzaCB0byB0aGUgc2VydmVyXHJcblx0XHRcdHZhciByZXEgPSAkaHR0cC5wb3N0KCcvYXBpL2NvbW1lbnQnLCAkc2NvcGUuY29tbWVudCk7XHJcblx0XHRcdHJlcS5zdWNjZXNzICggZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcblx0XHRcdFx0JHNjb3BlLmNvbW1lbnRzLnB1c2goZGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXEuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyBSZXNldFxyXG5cdFx0XHQkc2NvcGUuY29tbWVudCA9IHt9O1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLz09PT09PT1cclxuXHRcdC8vIEFuc3dlclxyXG5cdFx0Ly89PT09PT09XHJcblxyXG5cdFx0dGhpcy5hbnN3ZXIgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCRzY29wZSk7XHJcblx0XHRcdHZhciB0ZW1wbGF0ZSA9IHt9O1xyXG5cdFx0XHR2YXIgcmVxID0gJGh0dHAuZ2V0KCcvY29tbWVudHMvY29tbWVudC10ZW1wbGF0ZScpO1xyXG5cdFx0XHRyZXEuc3VjY2VzcyA9IGZ1bmN0aW9uICggZGF0YSApIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZSA9IGRhdGE7XHJcblx0XHRcdFx0Y29uc29sZS5sb2codGVtcGxhdGUpO1xyXG5cdFx0XHRcdCQoZG9jdW1lbnQpLnByZXBlbmQodGVtcGxhdGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PVxyXG5cdFx0Ly8gVXB2b3RlXHJcblx0XHQvLz09PT09PT1cclxuXHRcdFxyXG5cdFx0dGhpcy51cHZvdGUgPSBmdW5jdGlvbiAoY29tbWVudCkge1xyXG5cdFx0XHR2YXIgJGNvbW1lbnQgPSBuZXcgQ29tbWVudChjb21tZW50KTtcclxuXHJcblx0XHRcdCRjb21tZW50LnNjb3JlLnVwdm90ZXMrKztcclxuXHRcdFx0JGh0dHAucHV0KCcvYXBpL2NvbW1lbnQvJyArICRjb21tZW50Ll9pZCArICcvdXB2b3RlJywgJGNvbW1lbnQpXHJcblx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHQkY29tbWVudC5zY29yZS51cHZvdGVzLS07XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PT09XHJcblx0XHQvLyBEb3dudm90ZVxyXG5cdFx0Ly89PT09PT09PT1cclxuXHRcdFxyXG5cdFx0dGhpcy5kb3dudm90ZSA9IGZ1bmN0aW9uIChjb21tZW50KSB7XHJcblx0XHRcdHZhciAkY29tbWVudCA9IG5ldyBDb21tZW50KGNvbW1lbnQpO1xyXG5cclxuXHRcdFx0JGNvbW1lbnQuc2NvcmUuZG93bnZvdGVzKys7XHJcblx0XHRcdCRodHRwLnB1dCgnL2FwaS9jb21tZW50LycgKyAkY29tbWVudC5faWQgKyAnL2Rvd252b3RlJywgJGNvbW1lbnQpXHJcblx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHQkY29tbWVudC5zY29yZS5kb3dudm90ZXMtLTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly89PT09PT09PT09PT09PVxyXG5cdFx0Ly8gSW5pdGlhbCBjYWxsc1xyXG5cdFx0Ly89PT09PT09PT09PT09PVxyXG5cclxuXHRcdHRoaXMubGlzdCgpO1xyXG5cdH1cclxuXTsiLCJ2YXIgUG9zdCA9IHJlcXVpcmUoJy4uL21vZGVscy9wb3N0Jyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcclxuXHQnJHNjb3BlJyxcclxuXHQnJGh0dHAnLFxyXG5cdCckcm91dGVQYXJhbXMnLFxyXG5cdGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMpIHtcclxuXHJcblx0XHQvLyBGb3JtIG1vZGVsL0RldGFpbCB2aWV3XHJcblx0XHQkc2NvcGUucG9zdCA9IHt9O1xyXG5cclxuXHRcdC8vIEdldCBkZXRhaWxzIG9mIG9uZSBwb3N0XHJcblx0XHQkaHR0cC5nZXQoJy9hcGkvcG9zdC8nICsgJHJvdXRlUGFyYW1zLmlkKVxyXG5cdFx0XHQuc3VjY2VzcyAoIGZ1bmN0aW9uIChkYXRhKSB7XHJcblx0XHRcdFx0JHNjb3BlLnBvc3QgPSBkYXRhO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0Ly9jb25zb2xlLmxvZygkc2NvcGUpO1xyXG5cdH1cclxuXTsiLCJ2YXIgUG9zdCA9IHJlcXVpcmUoJy4uL21vZGVscy9wb3N0Jyk7XHJcbnZhciBTY29yZSA9IHJlcXVpcmUoJy4uL21vZGVscy9zY29yZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRzY29wZScsXHJcblx0JyRodHRwJyxcclxuXHQnJGxvY2F0aW9uJyxcclxuXHQnJHJvdXRlUGFyYW1zJyxcclxuXHRmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJGxvY2F0aW9uLCAkcm91dGVQYXJhbXMpIHtcclxuXHJcblx0XHQvLyBMaXN0IG9mIGFsbCBwb3N0c1xyXG5cdFx0JHNjb3BlLnBvc3RzID0gW107XHJcblx0XHRcclxuXHJcblx0XHQvLyBSZWZyZXNoIGVsZW1lbnQgcG9zaXRpb25zXHJcblx0XHQkc2NvcGUudXBkYXRlUGFja2VyeSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0JCgnLnBvc3RzJykucGFja2VyeSgpO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0Ly89PT09PVxyXG5cdFx0Ly8gTElTVFxyXG5cdFx0Ly89PT09PVxyXG5cclxuXHRcdC8vIEdldCBsaXN0IG9mIHBvc3RzXHJcblx0XHQkaHR0cC5nZXQoJy9hcGkvcG9zdHMnKVxyXG5cdFx0XHQuc3VjY2VzcyAoIGZ1bmN0aW9uIChkYXRhKSB7XHJcblx0XHRcdFx0JHNjb3BlLnBvc3RzID0gZGF0YTtcclxuXHRcdFx0fSlcclxuXHRcdFx0LmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdH0pO1xyXG5cdH1cclxuXTsiLCJ2YXIgUG9zdCA9IHJlcXVpcmUoJy4uL21vZGVscy9wb3N0Jyk7XHJcbnZhciBTY29yZSA9IHJlcXVpcmUoJy4uL21vZGVscy9zY29yZScpO1xyXG52YXIgVXNlciA9IHJlcXVpcmUoJy4uL21vZGVscy91c2VyJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcclxuXHQnJHNjb3BlJyxcclxuXHQnJGh0dHAnLFxyXG5cdCckbG9jYXRpb24nLFxyXG5cdCckcm91dGVQYXJhbXMnLFxyXG5cdGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkbG9jYXRpb24sICRyb3V0ZVBhcmFtcykge1xyXG5cdFx0XHJcblx0XHQvLyBJRCBvZiB0aGUgcG9zdFxyXG5cdFx0JHNjb3BlLnBvc3RJZCA9ICRyb3V0ZVBhcmFtcy5pZDtcclxuXHJcblx0XHQvLz09PT09PT1cclxuXHRcdC8vIENSRUFURVxyXG5cdFx0Ly89PT09PT09XHJcblxyXG5cdFx0JHNjb3BlLmNyZWF0ZSA9IGZ1bmN0aW9uIChwb3N0KSB7XHJcblx0XHRcdHZhciAkcG9zdCA9IG5ldyBQb3N0KHBvc3QpO1xyXG5cdFx0XHRjb25zb2xlLmxvZygkcG9zdCk7XHJcblx0XHRcdCRodHRwLnBvc3QoJy9hcGkvcG9zdCcsICRwb3N0KVxyXG5cdFx0XHRcdC5zdWNjZXNzICggZnVuY3Rpb24gKGRhdGEpIHtcclxuXHRcdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvJyk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXTsiLCJtb2R1bGUuZXhwb3J0cyA9IFtcclxuXHQnJHNjb3BlJyxcclxuXHQnJGh0dHAnLFxyXG5cdCckbG9jYXRpb24nLFxyXG5cdCckcm91dGVQYXJhbXMnLFxyXG5cdGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkbG9jYXRpb24sICRyb3V0ZVBhcmFtcykge1xyXG5cclxuXHJcblx0XHQvLz09PT09PT1cclxuXHRcdC8vIFVwdm90ZVxyXG5cdFx0Ly89PT09PT09XHJcblxyXG5cdFx0JHNjb3BlLnVwdm90ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdHZhciBpZCA9ICRzY29wZS5wb3N0Ll9pZDtcclxuXHJcblx0XHRcdCRodHRwLnB1dCgnL2FwaS9wb3N0LycgKyBpZCArICcvdXB2b3RlLycsICRzY29wZS5wb3N0KVxyXG5cdFx0XHRcdC5zdWNjZXNzICggZnVuY3Rpb24gKHBvc3QpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHBvc3QpO1xyXG5cdFx0XHRcdFx0JHNjb3BlLnBvc3Qudm90ZXMgPSBwb3N0LnZvdGVzO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly89PT09PT09PT1cclxuXHRcdC8vIERvd252b3RlXHJcblx0XHQvLz09PT09PT09PVxyXG5cclxuXHRcdCRzY29wZS5kb3dudm90ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdHZhciBpZCA9ICRzY29wZS5wb3N0Ll9pZDtcclxuXHJcblx0XHRcdCRodHRwLnB1dCgnL2FwaS9wb3N0LycgKyBpZCArICcvZG93bnZvdGUvJywgJHNjb3BlLnBvc3QpXHJcblx0XHRcdFx0LnN1Y2Nlc3MgKCBmdW5jdGlvbiAocG9zdCkge1xyXG5cdFx0XHRcdFx0JHNjb3BlLnBvc3Qudm90ZXMgPSBwb3N0LnZvdGVzO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly89PT09PT1cclxuXHRcdC8vIFNjb3JlXHJcblx0XHQvLz09PT09PVxyXG5cclxuXHRcdCRzY29wZS5zY29yZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdHZhciBzY29yZSA9IDA7XHJcblxyXG5cdFx0XHRpZighJHNjb3BlLnBvc3Qudm90ZXMpIHJldHVybiBzY29yZTtcclxuXHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLnBvc3Qudm90ZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRzY29yZSArPSAkc2NvcGUucG9zdC52b3Rlc1tpXS52b3RlO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRyZXR1cm4gc2NvcmU7XHJcblx0XHR9XHJcblxyXG5cdFx0JHNjb3BlLmhhc1Vwdm90ZWQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRpZighJHNjb3BlLnBvc3QgfHwgISRzY29wZS4kcm9vdC51c2VyIHx8ICEkc2NvcGUucG9zdC52b3RlcykgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdFx0dmFyIHBvc3QgPSAkc2NvcGUucG9zdDtcclxuXHRcdFx0dmFyIHVzZXJJZCA9ICRzY29wZS4kcm9vdC51c2VyLl9pZDtcclxuXHRcdFx0dmFyIHVwdm90ZWQgPSBmYWxzZTtcclxuXHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcG9zdC52b3Rlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGlmKHBvc3Qudm90ZXNbaV0udXNlcklkID09IHVzZXJJZCAmJiBwb3N0LnZvdGVzW2ldLnZvdGUgPT0gMSkgdXB2b3RlZCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB1cHZvdGVkO1xyXG5cdFx0fVxyXG5cclxuXHRcdCRzY29wZS5oYXNEb3dudm90ZWQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRpZighJHNjb3BlLnBvc3QgfHwgISRzY29wZS4kcm9vdC51c2VyIHx8ICEkc2NvcGUucG9zdC52b3RlcykgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdFx0dmFyIHBvc3QgPSAkc2NvcGUucG9zdDtcclxuXHRcdFx0dmFyIHVzZXJJZCA9ICRzY29wZS4kcm9vdC51c2VyLl9pZDtcclxuXHRcdFx0dmFyIGRvd252b3RlZCA9IGZhbHNlO1xyXG5cclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwb3N0LnZvdGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0aWYocG9zdC52b3Rlc1tpXS51c2VySWQgPT0gdXNlcklkICYmIHBvc3Qudm90ZXNbaV0udm90ZSA9PSAtMSkgZG93bnZvdGVkID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGRvd252b3RlZDtcclxuXHRcdH1cclxuXHR9XHJcbl07IiwibW9kdWxlLmV4cG9ydHMuYXV0aEhlYWRlciA9IFsnJGxvY2F0aW9uJywgZnVuY3Rpb24gKCRsb2NhdGlvbikge1xyXG5cdHJldHVybiB7XHJcblx0XHRyZXN0cmljdDogJ0UnXHJcblx0XHQsdGVtcGxhdGVVcmw6ICcvYXV0aC9oZWFkZXInXHJcblx0fTtcclxufV07IiwiZXhwb3J0cy5jb21tZW50ID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiB7XHJcblx0XHR0ZW1wbGF0ZVVybDogJy9jb21tZW50cy9jb21tZW50LXRlbXBsYXRlJ1xyXG5cdH07XHJcbn07XHJcblxyXG5leHBvcnRzLmNvbW1lbnRGb3JtID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiB7XHJcblx0XHR0ZW1wbGF0ZVVybDogJy9jb21tZW50cy9jb21tZW50LWZvcm0nXHJcblx0fTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cy5wb3N0ID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiB7XHJcblx0XHR0ZW1wbGF0ZVVybDogJy9wb3N0cy9wb3N0LXRlbXBsYXRlJyxcclxuXHRcdHJlcGxhY2U6IHRydWUsXHJcblx0XHRjb250cm9sbGVyOiAnUG9zdENvbnRyb2xsZXInXHJcblx0fTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmZvcm0gPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHRlbXBsYXRlVXJsOiAnL3Bvc3RzL3Bvc3QtZm9ybScsXHJcblx0XHRjb250cm9sbGVyOiAnUG9zdEZvcm1Db250cm9sbGVyJ1xyXG5cdH07XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdHZhciBsaW5rRnVuY3Rpb247XHJcblx0dmFyIGNvbnRyb2xsZXJGdW5jdGlvbjtcclxuXHJcblx0dmFyICRwb3N0cyA9ICQoJy5wb3N0cycpO1xyXG5cclxuXHRsaW5rRnVuY3Rpb24gPSBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcblx0XHRpZihzY29wZS4kbGFzdCl7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHNjb3BlLiRlbWl0KCdwb3N0c2xvYWRlZCcsIGVsZW1lbnQsIGF0dHJzKTtcclxuXHRcdFx0fSwgMSk7XHJcblx0XHR9O1xyXG5cdH07XHJcblxyXG5cdGNvbnRyb2xsZXJGdW5jdGlvbiA9IGZ1bmN0aW9uICgkc2NvcGUpIHtcclxuXHRcdCRzY29wZS4kb24oJ3Bvc3RzbG9hZGVkJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ2luaXRpYWxpemUgcGFja2VyeScpO1xyXG5cdFx0XHQvLyBJbml0aWFsaXplIHBhY2tlcnlcclxuXHRcdFx0JHBvc3RzLnBhY2tlcnkoe1xyXG5cdFx0XHRcdC8vaXRlbVNlbGVjdG9yOiAnbGknLFxyXG5cdFx0XHRcdGd1dHRlcjogMFxyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRsaW5rOiBsaW5rRnVuY3Rpb24sXHJcblx0XHRyZXN0cmljdDogJ0EnLFxyXG5cdFx0Y29udHJvbGxlcjogY29udHJvbGxlckZ1bmN0aW9uXHJcblx0fVxyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRyb290KSB7XHJcblx0dmFyIHN0YXRlO1xyXG5cclxuXHR2YXIgYnJvYWRjYXN0ID0gZnVuY3Rpb24gKCBzdGF0ZSApIHtcclxuXHRcdCRyb290LiRicm9hZGNhc3QoJ2F1dGgudXBkYXRlJywgc3RhdGUpO1xyXG5cdH07XHJcblxyXG5cdHZhciB1cGRhdGUgPSBmdW5jdGlvbiAoIG5ld1N0YXRlICkge1xyXG5cdFx0c3RhdGUgPSBuZXdTdGF0ZTtcclxuXHRcdGJyb2FkY2FzdCggc3RhdGUgKTtcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0dXBkYXRlOiB1cGRhdGUsXHJcblx0XHRzdGF0ZTogc3RhdGVcclxuXHR9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gW1xyXG5cdCckcSdcclxuXHQsICckbG9jYXRpb24nXHJcblx0LCBmdW5jdGlvbiAoJHEsICRsb2NhdGlvbikge1xyXG5cdFx0dmFyIGhhbmRsZXIgPSB7XHJcblx0XHRcdHJlc3BvbnNlOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDEpIHtcclxuXHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1cyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiByZXNwb25zZSB8fCAkcS53aGVuKHJlc3BvbnNlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQsIHJlc3BvbnNlRXJyb3I6IGZ1bmN0aW9uIChyZWplY3Rpb24pIHtcclxuXHRcdFx0XHRpZiAocmVqZWN0aW9uLnN0YXR1cyA9PT0gNDAxKSB7XHJcblx0XHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL2xvZ2luJykuc2VhcmNoKCdyZXR1cm5UbycsIEpTT04ucGFyc2UocmVqZWN0aW9uLmRhdGEpLnJldHVyblRvKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly9yZXR1cm4gJHEucmVqZWN0KHJlamVjdGlvbik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gaGFuZGxlcjtcclxuXHR9XHJcbl07IiwiXHJcbi8vPT09PT09PT1cclxuLy8gVGhlIGFwcFxyXG4vLz09PT09PT09XHJcblxyXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ3JlZGRpdCcsIFsnbmdSb3V0ZSddKTtcclxuXHJcblxyXG4vLz09PT09PT09XHJcbi8vIEltcG9ydHNcclxuLy89PT09PT09PVxyXG5cclxuLy8gUm91dGVzXHJcbnZhciBwb3N0Um91dGVzIFx0XHRcdD0gcmVxdWlyZSgnLi9yb3V0ZXMvcG9zdCcpO1xyXG52YXIgYXV0aFJvdXRlcyBcdFx0XHQ9IHJlcXVpcmUoJy4vcm91dGVzL2F1dGgnKTtcclxudmFyIHByZXNpUm91dGVzXHRcdFx0PSByZXF1aXJlKCcuL3JvdXRlcy9wcmVzZW50YXRpb24nKTtcclxuXHJcbi8vIENvbnRyb2xsZXJzXHJcbnZhciBwb3N0Q3RybCBcdFx0XHQ9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvcG9zdCcpO1xyXG52YXIgbGlzdFZpZXdDdHJsXHRcdD0gcmVxdWlyZSgnLi9jb250cm9sbGVycy9saXN0LXZpZXcnKTtcclxudmFyIGRldGFpbFZpZXdDdHJsIFx0XHQ9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvZGV0YWlsLXZpZXcnKTtcclxudmFyIHBvc3RGb3JtQ3RybCBcdFx0PSByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL3Bvc3QtZm9ybScpO1xyXG52YXIgY29tbWVudEN0cmwgXHRcdD0gcmVxdWlyZSgnLi9jb250cm9sbGVycy9jb21tZW50Jyk7XHJcbnZhciBhdXRoQ3RybCBcdFx0XHQ9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvYXV0aCcpO1xyXG5cclxuLy8gRGlyZWN0aXZlc1xyXG52YXIgcG9zdERpcmVjdGl2ZSBcdFx0PSByZXF1aXJlKCcuL2RpcmVjdGl2ZXMvcG9zdCcpO1xyXG52YXIgY29tbWVudERpcmVjdGl2ZSBcdD0gcmVxdWlyZSgnLi9kaXJlY3RpdmVzL2NvbW1lbnQnKTtcclxudmFyIGF1dGhEaXJlY3RpdmUgXHRcdD0gcmVxdWlyZSgnLi9kaXJlY3RpdmVzL2F1dGgnKTtcclxudmFyIHBvc3RzTG9hZGVkIFx0XHQ9IHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9wb3N0cy1sb2FkZWQnKTtcclxuXHJcbi8vIEZhY3Rvcmllc1xyXG52YXIgYXV0aEludGVyY2VwdG9yIFx0PSByZXF1aXJlKCcuL2ZhY3Rvcmllcy9hdXRoLWludGVyY2VwdG9yJyk7XHJcbnZhciBhdXRoQ2hhbmdlTm90aWZpZXIgXHQ9IHJlcXVpcmUoJy4vZmFjdG9yaWVzL2F1dGgtY2hhbmdlLW5vdGlmaWVyJyk7XHJcblxyXG4vLyBDb25maWdcclxudmFyIGludGVyY2VwdG9yIFx0XHQ9IHJlcXVpcmUoJy4vY29uZmlnL2ludGVyY2VwdG9yJyk7XHJcblxyXG5cclxuLy89PT09PT09PVxyXG4vLyBGYWN0b3J5XHJcbi8vPT09PT09PT1cclxuXHJcbmFwcC5mYWN0b3J5KCdhdXRoSW50ZXJjZXB0b3InLCBhdXRoSW50ZXJjZXB0b3IpO1xyXG5hcHAuZmFjdG9yeSgnYXV0aFN0YXRlJywgYXV0aENoYW5nZU5vdGlmaWVyKTtcclxuXHJcblxyXG4vLz09PT09PT1cclxuLy8gQ29uZmlnXHJcbi8vPT09PT09PVxyXG5cclxuYXBwLmNvbmZpZyhpbnRlcmNlcHRvcik7XHJcblxyXG5cclxuLy89PT09PT09XHJcbi8vIFJvdXRlc1xyXG4vLz09PT09PT1cclxuXHJcbmFwcC5jb25maWcocG9zdFJvdXRlcyk7XHJcbmFwcC5jb25maWcoYXV0aFJvdXRlcyk7XHJcbmFwcC5jb25maWcocHJlc2lSb3V0ZXMpO1xyXG5cclxuXHJcbi8vPT09PT09PT09PT09XHJcbi8vIENvbnRyb2xsZXJzXHJcbi8vPT09PT09PT09PT09XHJcblxyXG5hcHAuY29udHJvbGxlcignUG9zdENvbnRyb2xsZXInLCBwb3N0Q3RybCk7XHJcbmFwcC5jb250cm9sbGVyKCdEZXRhaWxWaWV3Q29udHJvbGxlcicsIGRldGFpbFZpZXdDdHJsKTtcclxuYXBwLmNvbnRyb2xsZXIoJ0xpc3RWaWV3Q29udHJvbGxlcicsIGxpc3RWaWV3Q3RybCk7XHJcbmFwcC5jb250cm9sbGVyKCdQb3N0Rm9ybUNvbnRyb2xsZXInLCBwb3N0Rm9ybUN0cmwpO1xyXG5hcHAuY29udHJvbGxlcignQ29tbWVudENvbnRyb2xsZXInLCBjb21tZW50Q3RybCk7XHJcbmFwcC5jb250cm9sbGVyKCdBdXRoQ29udHJvbGxlcicsIGF1dGhDdHJsKTtcclxuXHJcblxyXG4vLz09PT09PT09PT09XHJcbi8vIERpcmVjdGl2ZXNcclxuLy89PT09PT09PT09PVxyXG5cclxuYXBwLmRpcmVjdGl2ZSgncG9zdCcsIHBvc3REaXJlY3RpdmUucG9zdCk7XHJcbmFwcC5kaXJlY3RpdmUoJ3Bvc3Rmb3JtJywgcG9zdERpcmVjdGl2ZS5mb3JtKTtcclxuYXBwLmRpcmVjdGl2ZSgnY29tbWVudCcsIGNvbW1lbnREaXJlY3RpdmUuY29tbWVudCk7XHJcbmFwcC5kaXJlY3RpdmUoJ2NvbW1lbnRmb3JtJywgY29tbWVudERpcmVjdGl2ZS5jb21tZW50Rm9ybSk7XHJcbmFwcC5kaXJlY3RpdmUoJ2F1dGhoZWFkZXInLCBhdXRoRGlyZWN0aXZlLmF1dGhIZWFkZXIpO1xyXG5hcHAuZGlyZWN0aXZlKCdwb3N0c0xvYWRlZCcsIHBvc3RzTG9hZGVkKTsiLCJ2YXIgVXNlciBcdD0gcmVxdWlyZSgnLi91c2VyJyk7XHJcbnZhciBTY29yZSBcdD0gcmVxdWlyZSgnLi9zY29yZScpO1xyXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgnZXh0ZW5kJyk7XHJcblxyXG4vLz09PT09XHJcbi8vIERhdGEgbW9kZWwgb2YgYSBjb21tZW50XHJcbi8vPT09PT1cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29uc3RydWN0b3IpIHtcclxuXHR2YXIgJHNjb3BlID0gdGhpcztcclxuXHJcblx0dmFyIERFRkFVTFQgPSB7XHJcblx0XHR0ZXh0OiAnJyxcclxuXHRcdHBhcmVudDogbnVsbCxcclxuXHRcdHBvc3RlZDogRGF0ZS5ub3coKSxcclxuXHRcdHVzZXI6IG5ldyBVc2VyKCksXHJcblx0XHRzY29yZTogbmV3IFNjb3JlKCksXHJcblx0XHRwb3N0SWQ6IC0xXHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiBleHRlbmQoJHNjb3BlLCBERUZBVUxULCBjb25zdHJ1Y3Rvcik7XHJcbn07IiwidmFyIGV4dGVuZCA9IHJlcXVpcmUoJ2V4dGVuZCcpO1xyXG5cclxuLy8gRGF0YSBtb2RlbCBvZiBhIHBvc3RcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29uc3RydWN0b3Ipe1xyXG5cclxuXHR2YXIgJHNjb3BlID0gdGhpcztcclxuXHJcblx0dmFyIERFRkFVTFQgPSB7XHJcblx0XHR0aXRsZTogJycsXHJcblx0XHR0ZXh0OiAnJyxcclxuXHRcdGltYWdlOiAnJyxcclxuXHRcdHBvc3RlZDogRGF0ZS5ub3coKVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIGV4dGVuZCgkc2NvcGUsIERFRkFVTFQsIGNvbnN0cnVjdG9yKTtcclxufTsiLCJ2YXIgZXh0ZW5kID0gcmVxdWlyZSgnZXh0ZW5kJyk7XHJcblxyXG4vLyBTY29yZSBtb2RlbFxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb25zdHJ1Y3Rvcil7XHJcblx0dmFyICRzY29wZSA9IHRoaXM7XHJcblxyXG5cdHZhciBERUZBVUxUID0ge1xyXG5cdFx0dXB2b3RlczogMCxcclxuXHRcdGRvd252b3RlczogMCxcclxuXHRcdGdldDogZnVuY3Rpb24gKCl7XHJcblx0XHRcdHJldHVybiAkc2NvcGUudXB2b3RlcyAtICRzY29wZS5kb3dudm90ZXM7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gZXh0ZW5kKCRzY29wZSwgREVGQVVMVCwgY29uc3RydWN0b3IpO1xyXG59IiwidmFyIGV4dGVuZCA9IHJlcXVpcmUoJ2V4dGVuZCcpO1xyXG5cclxuLy8gRGF0YSBtb2RlbCBvZiBhIHBvc3RcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29uc3RydWN0b3Ipe1xyXG5cclxuICAgIHZhciAkc2NvcGUgPSB0aGlzO1xyXG5cclxuICAgIHZhciBERUZBVUxUID0ge1xyXG4gICAgICAgIGVtYWlsOiAnJyxcclxuICAgICAgICBwYXNzd29yZDogJydcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZXh0ZW5kKCRzY29wZSwgREVGQVVMVCwgY29uc3RydWN0b3IpO1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gW1xyXG5cdCckcm91dGVQcm92aWRlcicsXHJcblx0ZnVuY3Rpb24gKCRyb3V0ZVByb3ZpZGVyKSB7XHJcblx0XHQkcm91dGVQcm92aWRlci5cclxuXHRcdFxyXG5cdFx0XHQvLyBMaXN0IG9mIGFsbCBwb3N0c1xyXG5cdFx0XHR3aGVuKCcvbG9naW4nLCB7XHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvYXV0aCdcclxuXHRcdFx0XHQsY29udHJvbGxlcjogJ0F1dGhDb250cm9sbGVyJ1xyXG5cdFx0XHR9KS5cclxuXHJcblx0XHRcdC8vIERldGFpbCBvZiBzcGVjaWZpYyBwb3N0XHJcblx0XHRcdHdoZW4oJy9yZWdpc3RlcicsIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJy9hdXRoL3JlZ2lzdGVyJ1xyXG5cdFx0XHRcdCxjb250cm9sbGVyOiAnQXV0aENvbnRyb2xsZXInXHJcblx0XHRcdH0pLlxyXG5cclxuXHRcdFx0Ly8gTG9nb3V0XHJcblx0XHRcdHdoZW4oJy9sb2dvdXQnLCB7XHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvYXV0aC9sb2dvdXQnXHJcblx0XHRcdFx0LGNvbnRyb2xsZXI6ICdBdXRoQ29udHJvbGxlcidcclxuXHRcdFx0fSkuXHJcblx0XHRcdFxyXG5cdFx0XHRvdGhlcndpc2UoIHsgcmVkaXJlY3RUbzogJy80MDQnIH0pXHJcblx0fVxyXG5dOyIsIm1vZHVsZS5leHBvcnRzID0gW1xyXG5cdCckcm91dGVQcm92aWRlcicsXHJcblx0ZnVuY3Rpb24gKCRyb3V0ZVByb3ZpZGVyKSB7XHJcblx0XHQkcm91dGVQcm92aWRlci5cclxuXHRcdFxyXG5cdFx0XHQvLyBMaXN0IG9mIGFsbCBwb3N0c1xyXG5cdFx0XHR3aGVuKCcvJywge1xyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3Bvc3RzL2xpc3QnLFxyXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdMaXN0Vmlld0NvbnRyb2xsZXInXHJcblx0XHRcdH0pLlxyXG5cclxuXHRcdFx0Ly8gRGV0YWlsIG9mIHNwZWNpZmljIHBvc3RcclxuXHRcdFx0d2hlbignL3Bvc3QvOmlkJywge1xyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiBmdW5jdGlvbiAoJHBhcmFtcykge1xyXG5cdFx0XHRcdFx0cmV0dXJuICcvcG9zdHMvcG9zdC8nICsgJHBhcmFtcy5pZFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ0RldGFpbFZpZXdDb250cm9sbGVyJ1xyXG5cdFx0XHR9KS5cclxuXHJcblx0XHRcdC8vIENyZWF0ZSBwb3N0XHJcblx0XHRcdHdoZW4oJy9hZGQtbGluaycsIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJy9wb3N0cy9wb3N0LWZvcm0nLFxyXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdQb3N0Rm9ybUNvbnRyb2xsZXInXHJcblx0XHRcdH0pLlxyXG5cclxuXHRcdFx0Ly8gRXJyb3JcclxuXHRcdFx0d2hlbignLzQwNCcsIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJy9wb3N0cy80MDQnXHJcblx0XHRcdH0pLlxyXG5cdFx0XHRvdGhlcndpc2UoIHsgcmVkaXJlY3RUbzogJy80MDQnIH0pXHJcblx0fVxyXG5dOyIsIm1vZHVsZS5leHBvcnRzID0gW1xyXG5cdCckcm91dGVQcm92aWRlcicsXHJcblx0ZnVuY3Rpb24gKCRyb3V0ZVByb3ZpZGVyKSB7XHJcblx0XHQkcm91dGVQcm92aWRlci5cclxuXHRcdFxyXG5cdFx0XHR3aGVuKCcvcHJlc2VudGF0aW9uJywgeyB0ZW1wbGF0ZVVybDogJy9wcmVzZW50YXRpb24nLCBjb250cm9sbGVyOiAnQXV0aENvbnRyb2xsZXInfSkuXHJcblxyXG5cdFx0XHRvdGhlcndpc2UoIHsgcmVkaXJlY3RUbzogJy80MDQnIH0pXHJcblx0fVxyXG5dOyIsInZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciB1bmRlZmluZWQ7XG5cbnZhciBpc1BsYWluT2JqZWN0ID0gZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmopIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRpZiAoIW9iaiB8fCB0b1N0cmluZy5jYWxsKG9iaikgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0dmFyIGhhc19vd25fY29uc3RydWN0b3IgPSBoYXNPd24uY2FsbChvYmosICdjb25zdHJ1Y3RvcicpO1xuXHR2YXIgaGFzX2lzX3Byb3BlcnR5X29mX21ldGhvZCA9IG9iai5jb25zdHJ1Y3RvciAmJiBvYmouY29uc3RydWN0b3IucHJvdG90eXBlICYmIGhhc093bi5jYWxsKG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsICdpc1Byb3RvdHlwZU9mJyk7XG5cdC8vIE5vdCBvd24gY29uc3RydWN0b3IgcHJvcGVydHkgbXVzdCBiZSBPYmplY3Rcblx0aWYgKG9iai5jb25zdHJ1Y3RvciAmJiAhaGFzX293bl9jb25zdHJ1Y3RvciAmJiAhaGFzX2lzX3Byb3BlcnR5X29mX21ldGhvZCkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIE93biBwcm9wZXJ0aWVzIGFyZSBlbnVtZXJhdGVkIGZpcnN0bHksIHNvIHRvIHNwZWVkIHVwLFxuXHQvLyBpZiBsYXN0IG9uZSBpcyBvd24sIHRoZW4gYWxsIHByb3BlcnRpZXMgYXJlIG93bi5cblx0dmFyIGtleTtcblx0Zm9yIChrZXkgaW4gb2JqKSB7fVxuXG5cdHJldHVybiBrZXkgPT09IHVuZGVmaW5lZCB8fCBoYXNPd24uY2FsbChvYmosIGtleSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGV4dGVuZCgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgb3B0aW9ucywgbmFtZSwgc3JjLCBjb3B5LCBjb3B5SXNBcnJheSwgY2xvbmUsXG5cdFx0dGFyZ2V0ID0gYXJndW1lbnRzWzBdLFxuXHRcdGkgPSAxLFxuXHRcdGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsXG5cdFx0ZGVlcCA9IGZhbHNlO1xuXG5cdC8vIEhhbmRsZSBhIGRlZXAgY29weSBzaXR1YXRpb25cblx0aWYgKHR5cGVvZiB0YXJnZXQgPT09ICdib29sZWFuJykge1xuXHRcdGRlZXAgPSB0YXJnZXQ7XG5cdFx0dGFyZ2V0ID0gYXJndW1lbnRzWzFdIHx8IHt9O1xuXHRcdC8vIHNraXAgdGhlIGJvb2xlYW4gYW5kIHRoZSB0YXJnZXRcblx0XHRpID0gMjtcblx0fSBlbHNlIGlmICgodHlwZW9mIHRhcmdldCAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIHRhcmdldCAhPT0gJ2Z1bmN0aW9uJykgfHwgdGFyZ2V0ID09IG51bGwpIHtcblx0XHR0YXJnZXQgPSB7fTtcblx0fVxuXG5cdGZvciAoOyBpIDwgbGVuZ3RoOyArK2kpIHtcblx0XHRvcHRpb25zID0gYXJndW1lbnRzW2ldO1xuXHRcdC8vIE9ubHkgZGVhbCB3aXRoIG5vbi1udWxsL3VuZGVmaW5lZCB2YWx1ZXNcblx0XHRpZiAob3B0aW9ucyAhPSBudWxsKSB7XG5cdFx0XHQvLyBFeHRlbmQgdGhlIGJhc2Ugb2JqZWN0XG5cdFx0XHRmb3IgKG5hbWUgaW4gb3B0aW9ucykge1xuXHRcdFx0XHRzcmMgPSB0YXJnZXRbbmFtZV07XG5cdFx0XHRcdGNvcHkgPSBvcHRpb25zW25hbWVdO1xuXG5cdFx0XHRcdC8vIFByZXZlbnQgbmV2ZXItZW5kaW5nIGxvb3Bcblx0XHRcdFx0aWYgKHRhcmdldCA9PT0gY29weSkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gUmVjdXJzZSBpZiB3ZSdyZSBtZXJnaW5nIHBsYWluIG9iamVjdHMgb3IgYXJyYXlzXG5cdFx0XHRcdGlmIChkZWVwICYmIGNvcHkgJiYgKGlzUGxhaW5PYmplY3QoY29weSkgfHwgKGNvcHlJc0FycmF5ID0gQXJyYXkuaXNBcnJheShjb3B5KSkpKSB7XG5cdFx0XHRcdFx0aWYgKGNvcHlJc0FycmF5KSB7XG5cdFx0XHRcdFx0XHRjb3B5SXNBcnJheSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0Y2xvbmUgPSBzcmMgJiYgQXJyYXkuaXNBcnJheShzcmMpID8gc3JjIDogW107XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGNsb25lID0gc3JjICYmIGlzUGxhaW5PYmplY3Qoc3JjKSA/IHNyYyA6IHt9O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIE5ldmVyIG1vdmUgb3JpZ2luYWwgb2JqZWN0cywgY2xvbmUgdGhlbVxuXHRcdFx0XHRcdHRhcmdldFtuYW1lXSA9IGV4dGVuZChkZWVwLCBjbG9uZSwgY29weSk7XG5cblx0XHRcdFx0Ly8gRG9uJ3QgYnJpbmcgaW4gdW5kZWZpbmVkIHZhbHVlc1xuXHRcdFx0XHR9IGVsc2UgaWYgKGNvcHkgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHRhcmdldFtuYW1lXSA9IGNvcHk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBSZXR1cm4gdGhlIG1vZGlmaWVkIG9iamVjdFxuXHRyZXR1cm4gdGFyZ2V0O1xufTtcblxuIl19

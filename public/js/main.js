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
				templateUrl: '/posts/post-form'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxQcm9qZWt0ZVxcUmVkZGl0X0Nsb25lXFxmcm9udGVuZFxcYnVpbGRzeXN0ZW1cXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiZDovUHJvamVrdGUvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL2NvbmZpZy9pbnRlcmNlcHRvci5qcyIsImQ6L1Byb2pla3RlL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9jb250cm9sbGVycy9hdXRoLmpzIiwiZDovUHJvamVrdGUvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL2NvbnRyb2xsZXJzL2NvbW1lbnQuanMiLCJkOi9Qcm9qZWt0ZS9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvY29udHJvbGxlcnMvZGV0YWlsLXZpZXcuanMiLCJkOi9Qcm9qZWt0ZS9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvY29udHJvbGxlcnMvbGlzdC12aWV3LmpzIiwiZDovUHJvamVrdGUvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL2NvbnRyb2xsZXJzL3Bvc3QtZm9ybS5qcyIsImQ6L1Byb2pla3RlL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9jb250cm9sbGVycy9wb3N0LmpzIiwiZDovUHJvamVrdGUvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL2RpcmVjdGl2ZXMvYXV0aC5qcyIsImQ6L1Byb2pla3RlL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9kaXJlY3RpdmVzL2NvbW1lbnQuanMiLCJkOi9Qcm9qZWt0ZS9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvZGlyZWN0aXZlcy9wb3N0LmpzIiwiZDovUHJvamVrdGUvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL2RpcmVjdGl2ZXMvcG9zdHMtbG9hZGVkLmpzIiwiZDovUHJvamVrdGUvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL2ZhY3Rvcmllcy9hdXRoLWNoYW5nZS1ub3RpZmllci5qcyIsImQ6L1Byb2pla3RlL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9mYWN0b3JpZXMvYXV0aC1pbnRlcmNlcHRvci5qcyIsImQ6L1Byb2pla3RlL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9tYWluLmpzIiwiZDovUHJvamVrdGUvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL21vZGVscy9jb21tZW50LmpzIiwiZDovUHJvamVrdGUvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL21vZGVscy9wb3N0LmpzIiwiZDovUHJvamVrdGUvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL21vZGVscy9zY29yZS5qcyIsImQ6L1Byb2pla3RlL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9tb2RlbHMvdXNlci5qcyIsImQ6L1Byb2pla3RlL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9yb3V0ZXMvYXV0aC5qcyIsImQ6L1Byb2pla3RlL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9yb3V0ZXMvcG9zdC5qcyIsImQ6L1Byb2pla3RlL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9yb3V0ZXMvcHJlc2VudGF0aW9uLmpzIiwiZDovUHJvamVrdGUvUmVkZGl0X0Nsb25lL25vZGVfbW9kdWxlcy9leHRlbmQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gW1xyXG5cdCckaHR0cFByb3ZpZGVyJ1xyXG5cdCwgZnVuY3Rpb24gKCRodHRwUHJvdmlkZXIpIHtcclxuXHRcdFxyXG5cdFx0Ly9IdHRwIEludGVyY3BldG9yIHRvIGNoZWNrIGF1dGggZmFpbHVyZXMgZm9yIHhociByZXF1ZXN0c1xyXG5cdFx0JGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnYXV0aEludGVyY2VwdG9yJyk7XHJcblx0fVxyXG5dIiwidmFyIFVzZXIgPSByZXF1aXJlKCcuLi9tb2RlbHMvdXNlcicpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRzY29wZScsXHJcblx0JyRodHRwJyxcclxuXHQnJHJvdXRlUGFyYW1zJyxcclxuXHQnJGxvY2F0aW9uJyxcclxuXHRmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24pIHtcclxuXHRcdCRzY29wZS51c2VyID0gZmFsc2U7XHJcblxyXG5cdFx0Ly8gRXhwb3NlIHVzZXIgdG8gcm9vdCBzY29wZVxyXG5cdFx0JHNjb3BlLiR3YXRjaCgndXNlcicsIGZ1bmN0aW9uICh1c2VyKSB7XHJcblx0XHRcdCRzY29wZS4kcm9vdC51c2VyID0gdXNlcjtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIEdldCB1c2VyIGluZm9cclxuXHRcdHZhciByZXEgPSAkaHR0cC5nZXQoJy9hcGkvdXNlcicpXHJcblx0XHRcdC5zdWNjZXNzICggZnVuY3Rpb24gKGRhdGEpIHtcclxuXHRcdFx0XHQkc2NvcGUudXNlciA9IGRhdGE7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHQvLyBVbmRlcmxpbmUgYWN0aXZlIHBhZ2VcclxuXHRcdCRzY29wZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uIChyb3V0ZSkge1xyXG5cdFx0XHRyZXR1cm4gcm91dGUgPT09ICRsb2NhdGlvbi5wYXRoKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0JHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0JHNjb3BlLnVzZXIgPSBmYWxzZTtcclxuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9sb2dvdXQnKTtcclxuXHRcdH1cclxuXHR9XHJcbl07IiwiLy8gUmVxdWlyZXNcclxudmFyIENvbW1lbnQgPSByZXF1aXJlKCcuLi9tb2RlbHMvY29tbWVudCcpO1xyXG52YXIgVXNlciA9IHJlcXVpcmUoJy4uL21vZGVscy91c2VyJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcclxuXHQnJHNjb3BlJyxcclxuXHQnJGh0dHAnLFxyXG5cdCckcm91dGVQYXJhbXMnLFxyXG5cdGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMpIHtcclxuXHJcblxyXG5cdFx0Ly8gTGlzdCBvZiBhbGwgY29tbWVudHMgZm9yIHRoaXMgcG9zdFxyXG5cdFx0JHNjb3BlLmNvbW1lbnRzID0gW107XHJcblx0XHQvLyBGb3JtIG1vZGVsXHJcblx0XHQkc2NvcGUuY29tbWVudCA9IG5ldyBDb21tZW50KCk7XHJcblx0XHQvLyBJRCBvZiB0aGUgcG9zdFxyXG5cdFx0JHNjb3BlLnBvc3RJZCA9ICRyb3V0ZVBhcmFtcy5pZDtcclxuXHRcdC8vIER1bW15IGRhdGEgZm9yIHVzZXJcclxuXHRcdCRzY29wZS5kdW1teV91c2VyID0gbmV3IFVzZXIoeyBuYW1lOiAnUGhpbGlwcCcsIGpvaW5lZDogRGF0ZS5ub3coKSB9KTtcclxuXHJcblxyXG5cdFx0Ly89PT09PVxyXG5cdFx0Ly8gTElTVFxyXG5cdFx0Ly89PT09PVxyXG5cclxuXHRcdHRoaXMubGlzdCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdC8vIEdldCBjb21tZW50IGxpc3RcclxuXHRcdFx0dmFyIHJlcSA9ICRodHRwLmdldCgnL2FwaS9jb21tZW50cy90by8nICsgJHNjb3BlLnBvc3RJZCk7XHJcblx0XHRcdHJlcS5zdWNjZXNzICggZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcblx0XHRcdFx0JHNjb3BlLmNvbW1lbnRzID0gZGF0YTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJlcS5lcnJvciAoZnVuY3Rpb24gKGVycikgeyBjb25zb2xlLmxvZyhlcnIpOyB9KTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdC8vPT09PT09PVxyXG5cdFx0Ly8gQ1JFQVRFXHJcblx0XHQvLz09PT09PT1cclxuXHJcblx0XHR0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdC8vIEluaXRpYWxpemUgY29tbWVudCBvYmplY3RcclxuXHRcdFx0JHNjb3BlLmNvbW1lbnQudXNlciA9ICRzY29wZS5kdW1teV91c2VyO1xyXG5cdFx0XHQkc2NvcGUuY29tbWVudC5wb3N0SWQgPSAkc2NvcGUucG9zdElkO1xyXG5cclxuXHRcdFx0Ly8gUHVzaCB0byB0aGUgc2VydmVyXHJcblx0XHRcdHZhciByZXEgPSAkaHR0cC5wb3N0KCcvYXBpL2NvbW1lbnQnLCAkc2NvcGUuY29tbWVudCk7XHJcblx0XHRcdHJlcS5zdWNjZXNzICggZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcblx0XHRcdFx0JHNjb3BlLmNvbW1lbnRzLnB1c2goZGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXEuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyBSZXNldFxyXG5cdFx0XHQkc2NvcGUuY29tbWVudCA9IHt9O1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLz09PT09PT1cclxuXHRcdC8vIEFuc3dlclxyXG5cdFx0Ly89PT09PT09XHJcblxyXG5cdFx0dGhpcy5hbnN3ZXIgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCRzY29wZSk7XHJcblx0XHRcdHZhciB0ZW1wbGF0ZSA9IHt9O1xyXG5cdFx0XHR2YXIgcmVxID0gJGh0dHAuZ2V0KCcvY29tbWVudHMvY29tbWVudC10ZW1wbGF0ZScpO1xyXG5cdFx0XHRyZXEuc3VjY2VzcyA9IGZ1bmN0aW9uICggZGF0YSApIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZSA9IGRhdGE7XHJcblx0XHRcdFx0Y29uc29sZS5sb2codGVtcGxhdGUpO1xyXG5cdFx0XHRcdCQoZG9jdW1lbnQpLnByZXBlbmQodGVtcGxhdGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PVxyXG5cdFx0Ly8gVXB2b3RlXHJcblx0XHQvLz09PT09PT1cclxuXHRcdFxyXG5cdFx0dGhpcy51cHZvdGUgPSBmdW5jdGlvbiAoY29tbWVudCkge1xyXG5cdFx0XHR2YXIgJGNvbW1lbnQgPSBuZXcgQ29tbWVudChjb21tZW50KTtcclxuXHJcblx0XHRcdCRjb21tZW50LnNjb3JlLnVwdm90ZXMrKztcclxuXHRcdFx0JGh0dHAucHV0KCcvYXBpL2NvbW1lbnQvJyArICRjb21tZW50Ll9pZCArICcvdXB2b3RlJywgJGNvbW1lbnQpXHJcblx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHQkY29tbWVudC5zY29yZS51cHZvdGVzLS07XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PT09XHJcblx0XHQvLyBEb3dudm90ZVxyXG5cdFx0Ly89PT09PT09PT1cclxuXHRcdFxyXG5cdFx0dGhpcy5kb3dudm90ZSA9IGZ1bmN0aW9uIChjb21tZW50KSB7XHJcblx0XHRcdHZhciAkY29tbWVudCA9IG5ldyBDb21tZW50KGNvbW1lbnQpO1xyXG5cclxuXHRcdFx0JGNvbW1lbnQuc2NvcmUuZG93bnZvdGVzKys7XHJcblx0XHRcdCRodHRwLnB1dCgnL2FwaS9jb21tZW50LycgKyAkY29tbWVudC5faWQgKyAnL2Rvd252b3RlJywgJGNvbW1lbnQpXHJcblx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHQkY29tbWVudC5zY29yZS5kb3dudm90ZXMtLTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly89PT09PT09PT09PT09PVxyXG5cdFx0Ly8gSW5pdGlhbCBjYWxsc1xyXG5cdFx0Ly89PT09PT09PT09PT09PVxyXG5cclxuXHRcdHRoaXMubGlzdCgpO1xyXG5cdH1cclxuXTsiLCJ2YXIgUG9zdCA9IHJlcXVpcmUoJy4uL21vZGVscy9wb3N0Jyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcclxuXHQnJHNjb3BlJyxcclxuXHQnJGh0dHAnLFxyXG5cdCckcm91dGVQYXJhbXMnLFxyXG5cdGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMpIHtcclxuXHJcblx0XHQvLyBGb3JtIG1vZGVsL0RldGFpbCB2aWV3XHJcblx0XHQkc2NvcGUucG9zdCA9IHt9O1xyXG5cclxuXHRcdC8vIEdldCBkZXRhaWxzIG9mIG9uZSBwb3N0XHJcblx0XHQkaHR0cC5nZXQoJy9hcGkvcG9zdC8nICsgJHJvdXRlUGFyYW1zLmlkKVxyXG5cdFx0XHQuc3VjY2VzcyAoIGZ1bmN0aW9uIChkYXRhKSB7XHJcblx0XHRcdFx0JHNjb3BlLnBvc3QgPSBkYXRhO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0Ly9jb25zb2xlLmxvZygkc2NvcGUpO1xyXG5cdH1cclxuXTsiLCJ2YXIgUG9zdCA9IHJlcXVpcmUoJy4uL21vZGVscy9wb3N0Jyk7XHJcbnZhciBTY29yZSA9IHJlcXVpcmUoJy4uL21vZGVscy9zY29yZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRzY29wZScsXHJcblx0JyRodHRwJyxcclxuXHQnJGxvY2F0aW9uJyxcclxuXHQnJHJvdXRlUGFyYW1zJyxcclxuXHRmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJGxvY2F0aW9uLCAkcm91dGVQYXJhbXMpIHtcclxuXHJcblx0XHQvLyBMaXN0IG9mIGFsbCBwb3N0c1xyXG5cdFx0JHNjb3BlLnBvc3RzID0gW107XHJcblx0XHRcclxuXHJcblx0XHQvLyBSZWZyZXNoIGVsZW1lbnQgcG9zaXRpb25zXHJcblx0XHQkc2NvcGUudXBkYXRlUGFja2VyeSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0JCgnLnBvc3RzJykucGFja2VyeSgpO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0Ly89PT09PVxyXG5cdFx0Ly8gTElTVFxyXG5cdFx0Ly89PT09PVxyXG5cclxuXHRcdC8vIEdldCBsaXN0IG9mIHBvc3RzXHJcblx0XHQkaHR0cC5nZXQoJy9hcGkvcG9zdHMnKVxyXG5cdFx0XHQuc3VjY2VzcyAoIGZ1bmN0aW9uIChkYXRhKSB7XHJcblx0XHRcdFx0JHNjb3BlLnBvc3RzID0gZGF0YTtcclxuXHRcdFx0fSlcclxuXHRcdFx0LmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdH0pO1xyXG5cdH1cclxuXTsiLCJ2YXIgUG9zdCA9IHJlcXVpcmUoJy4uL21vZGVscy9wb3N0Jyk7XHJcbnZhciBTY29yZSA9IHJlcXVpcmUoJy4uL21vZGVscy9zY29yZScpO1xyXG52YXIgVXNlciA9IHJlcXVpcmUoJy4uL21vZGVscy91c2VyJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcclxuXHQnJHNjb3BlJyxcclxuXHQnJGh0dHAnLFxyXG5cdCckbG9jYXRpb24nLFxyXG5cdCckcm91dGVQYXJhbXMnLFxyXG5cdGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkbG9jYXRpb24sICRyb3V0ZVBhcmFtcykge1xyXG5cdFx0XHJcblx0XHQvLyBJRCBvZiB0aGUgcG9zdFxyXG5cdFx0JHNjb3BlLnBvc3RJZCA9ICRyb3V0ZVBhcmFtcy5pZDtcclxuXHJcblx0XHQvLz09PT09PT1cclxuXHRcdC8vIENSRUFURVxyXG5cdFx0Ly89PT09PT09XHJcblxyXG5cdFx0JHNjb3BlLmNyZWF0ZSA9IGZ1bmN0aW9uIChwb3N0KSB7XHJcblx0XHRcdHZhciAkcG9zdCA9IG5ldyBQb3N0KHBvc3QpO1xyXG5cdFx0XHQkaHR0cC5wb3N0KCcvYXBpL3Bvc3QnLCAkcG9zdClcclxuXHRcdFx0XHQuc3VjY2VzcyAoIGZ1bmN0aW9uIChkYXRhKSB7XHJcblx0XHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnLycpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcbl07IiwibW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRzY29wZScsXHJcblx0JyRodHRwJyxcclxuXHQnJGxvY2F0aW9uJyxcclxuXHQnJHJvdXRlUGFyYW1zJyxcclxuXHRmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJGxvY2F0aW9uLCAkcm91dGVQYXJhbXMpIHtcclxuXHJcblxyXG5cdFx0Ly89PT09PT09XHJcblx0XHQvLyBVcHZvdGVcclxuXHRcdC8vPT09PT09PVxyXG5cclxuXHRcdCRzY29wZS51cHZvdGUgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHR2YXIgaWQgPSAkc2NvcGUucG9zdC5faWQ7XHJcblxyXG5cdFx0XHQkaHR0cC5wdXQoJy9hcGkvcG9zdC8nICsgaWQgKyAnL3Vwdm90ZS8nLCAkc2NvcGUucG9zdClcclxuXHRcdFx0XHQuc3VjY2VzcyAoIGZ1bmN0aW9uIChwb3N0KSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhwb3N0KTtcclxuXHRcdFx0XHRcdCRzY29wZS5wb3N0LnZvdGVzID0gcG9zdC52b3RlcztcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PT09XHJcblx0XHQvLyBEb3dudm90ZVxyXG5cdFx0Ly89PT09PT09PT1cclxuXHJcblx0XHQkc2NvcGUuZG93bnZvdGUgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHR2YXIgaWQgPSAkc2NvcGUucG9zdC5faWQ7XHJcblxyXG5cdFx0XHQkaHR0cC5wdXQoJy9hcGkvcG9zdC8nICsgaWQgKyAnL2Rvd252b3RlLycsICRzY29wZS5wb3N0KVxyXG5cdFx0XHRcdC5zdWNjZXNzICggZnVuY3Rpb24gKHBvc3QpIHtcclxuXHRcdFx0XHRcdCRzY29wZS5wb3N0LnZvdGVzID0gcG9zdC52b3RlcztcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09XHJcblx0XHQvLyBTY29yZVxyXG5cdFx0Ly89PT09PT1cclxuXHJcblx0XHQkc2NvcGUuc2NvcmUgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHR2YXIgc2NvcmUgPSAwO1xyXG5cclxuXHRcdFx0aWYoISRzY29wZS5wb3N0LnZvdGVzKSByZXR1cm4gc2NvcmU7XHJcblxyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5wb3N0LnZvdGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0c2NvcmUgKz0gJHNjb3BlLnBvc3Qudm90ZXNbaV0udm90ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIHNjb3JlO1xyXG5cdFx0fVxyXG5cclxuXHRcdCRzY29wZS5oYXNVcHZvdGVkID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0aWYoISRzY29wZS5wb3N0IHx8ICEkc2NvcGUuJHJvb3QudXNlciB8fCAhJHNjb3BlLnBvc3Qudm90ZXMpIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRcdHZhciBwb3N0ID0gJHNjb3BlLnBvc3Q7XHJcblx0XHRcdHZhciB1c2VySWQgPSAkc2NvcGUuJHJvb3QudXNlci5faWQ7XHJcblx0XHRcdHZhciB1cHZvdGVkID0gZmFsc2U7XHJcblxyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHBvc3Qudm90ZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRpZihwb3N0LnZvdGVzW2ldLnVzZXJJZCA9PSB1c2VySWQgJiYgcG9zdC52b3Rlc1tpXS52b3RlID09IDEpIHVwdm90ZWQgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdXB2b3RlZDtcclxuXHRcdH1cclxuXHJcblx0XHQkc2NvcGUuaGFzRG93bnZvdGVkID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0aWYoISRzY29wZS5wb3N0IHx8ICEkc2NvcGUuJHJvb3QudXNlciB8fCAhJHNjb3BlLnBvc3Qudm90ZXMpIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRcdHZhciBwb3N0ID0gJHNjb3BlLnBvc3Q7XHJcblx0XHRcdHZhciB1c2VySWQgPSAkc2NvcGUuJHJvb3QudXNlci5faWQ7XHJcblx0XHRcdHZhciBkb3dudm90ZWQgPSBmYWxzZTtcclxuXHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcG9zdC52b3Rlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGlmKHBvc3Qudm90ZXNbaV0udXNlcklkID09IHVzZXJJZCAmJiBwb3N0LnZvdGVzW2ldLnZvdGUgPT0gLTEpIGRvd252b3RlZCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBkb3dudm90ZWQ7XHJcblx0XHR9XHJcblx0fVxyXG5dOyIsIm1vZHVsZS5leHBvcnRzLmF1dGhIZWFkZXIgPSBbJyRsb2NhdGlvbicsIGZ1bmN0aW9uICgkbG9jYXRpb24pIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0cmVzdHJpY3Q6ICdFJ1xyXG5cdFx0LHRlbXBsYXRlVXJsOiAnL2F1dGgvaGVhZGVyJ1xyXG5cdH07XHJcbn1dOyIsImV4cG9ydHMuY29tbWVudCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0dGVtcGxhdGVVcmw6ICcvY29tbWVudHMvY29tbWVudC10ZW1wbGF0ZSdcclxuXHR9O1xyXG59O1xyXG5cclxuZXhwb3J0cy5jb21tZW50Rm9ybSA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0dGVtcGxhdGVVcmw6ICcvY29tbWVudHMvY29tbWVudC1mb3JtJ1xyXG5cdH07XHJcbn07IiwibW9kdWxlLmV4cG9ydHMucG9zdCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0dGVtcGxhdGVVcmw6ICcvcG9zdHMvcG9zdC10ZW1wbGF0ZScsXHJcblx0XHRyZXBsYWNlOiB0cnVlLFxyXG5cdFx0Y29udHJvbGxlcjogJ1Bvc3RDb250cm9sbGVyJ1xyXG5cdH07XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5mb3JtID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiB7XHJcblx0XHR0ZW1wbGF0ZVVybDogJy9wb3N0cy9wb3N0LWZvcm0nLFxyXG5cdFx0Y29udHJvbGxlcjogJ1Bvc3RGb3JtQ29udHJvbGxlcidcclxuXHR9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHR2YXIgbGlua0Z1bmN0aW9uO1xyXG5cdHZhciBjb250cm9sbGVyRnVuY3Rpb247XHJcblxyXG5cdHZhciAkcG9zdHMgPSAkKCcucG9zdHMnKTtcclxuXHJcblx0bGlua0Z1bmN0aW9uID0gZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG5cdFx0aWYoc2NvcGUuJGxhc3Qpe1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRzY29wZS4kZW1pdCgncG9zdHNsb2FkZWQnLCBlbGVtZW50LCBhdHRycyk7XHJcblx0XHRcdH0sIDEpO1xyXG5cdFx0fTtcclxuXHR9O1xyXG5cclxuXHRjb250cm9sbGVyRnVuY3Rpb24gPSBmdW5jdGlvbiAoJHNjb3BlKSB7XHJcblx0XHQkc2NvcGUuJG9uKCdwb3N0c2xvYWRlZCcsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdpbml0aWFsaXplIHBhY2tlcnknKTtcclxuXHRcdFx0Ly8gSW5pdGlhbGl6ZSBwYWNrZXJ5XHJcblx0XHRcdCRwb3N0cy5wYWNrZXJ5KHtcclxuXHRcdFx0XHQvL2l0ZW1TZWxlY3RvcjogJ2xpJyxcclxuXHRcdFx0XHRndXR0ZXI6IDBcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0bGluazogbGlua0Z1bmN0aW9uLFxyXG5cdFx0cmVzdHJpY3Q6ICdBJyxcclxuXHRcdGNvbnRyb2xsZXI6IGNvbnRyb2xsZXJGdW5jdGlvblxyXG5cdH1cclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkcm9vdCkge1xyXG5cdHZhciBzdGF0ZTtcclxuXHJcblx0dmFyIGJyb2FkY2FzdCA9IGZ1bmN0aW9uICggc3RhdGUgKSB7XHJcblx0XHQkcm9vdC4kYnJvYWRjYXN0KCdhdXRoLnVwZGF0ZScsIHN0YXRlKTtcclxuXHR9O1xyXG5cclxuXHR2YXIgdXBkYXRlID0gZnVuY3Rpb24gKCBuZXdTdGF0ZSApIHtcclxuXHRcdHN0YXRlID0gbmV3U3RhdGU7XHJcblx0XHRicm9hZGNhc3QoIHN0YXRlICk7XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdHVwZGF0ZTogdXBkYXRlLFxyXG5cdFx0c3RhdGU6IHN0YXRlXHJcblx0fTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IFtcclxuXHQnJHEnXHJcblx0LCAnJGxvY2F0aW9uJ1xyXG5cdCwgZnVuY3Rpb24gKCRxLCAkbG9jYXRpb24pIHtcclxuXHRcdHZhciBoYW5kbGVyID0ge1xyXG5cdFx0XHRyZXNwb25zZTogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAxKSB7XHJcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UgfHwgJHEud2hlbihyZXNwb25zZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0LCByZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVqZWN0aW9uKSB7XHJcblx0XHRcdFx0aWYgKHJlamVjdGlvbi5zdGF0dXMgPT09IDQwMSkge1xyXG5cdFx0XHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9sb2dpbicpLnNlYXJjaCgncmV0dXJuVG8nLCBKU09OLnBhcnNlKHJlamVjdGlvbi5kYXRhKS5yZXR1cm5Ubyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vcmV0dXJuICRxLnJlamVjdChyZWplY3Rpb24pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGhhbmRsZXI7XHJcblx0fVxyXG5dOyIsIlxyXG4vLz09PT09PT09XHJcbi8vIFRoZSBhcHBcclxuLy89PT09PT09PVxyXG5cclxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdyZWRkaXQnLCBbJ25nUm91dGUnXSk7XHJcblxyXG5cclxuLy89PT09PT09PVxyXG4vLyBJbXBvcnRzXHJcbi8vPT09PT09PT1cclxuXHJcbi8vIFJvdXRlc1xyXG52YXIgcG9zdFJvdXRlcyBcdFx0XHQ9IHJlcXVpcmUoJy4vcm91dGVzL3Bvc3QnKTtcclxudmFyIGF1dGhSb3V0ZXMgXHRcdFx0PSByZXF1aXJlKCcuL3JvdXRlcy9hdXRoJyk7XHJcbnZhciBwcmVzaVJvdXRlc1x0XHRcdD0gcmVxdWlyZSgnLi9yb3V0ZXMvcHJlc2VudGF0aW9uJyk7XHJcblxyXG4vLyBDb250cm9sbGVyc1xyXG52YXIgcG9zdEN0cmwgXHRcdFx0PSByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL3Bvc3QnKTtcclxudmFyIGxpc3RWaWV3Q3RybFx0XHQ9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvbGlzdC12aWV3Jyk7XHJcbnZhciBkZXRhaWxWaWV3Q3RybCBcdFx0PSByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL2RldGFpbC12aWV3Jyk7XHJcbnZhciBwb3N0Rm9ybUN0cmwgXHRcdD0gcmVxdWlyZSgnLi9jb250cm9sbGVycy9wb3N0LWZvcm0nKTtcclxudmFyIGNvbW1lbnRDdHJsIFx0XHQ9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvY29tbWVudCcpO1xyXG52YXIgYXV0aEN0cmwgXHRcdFx0PSByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL2F1dGgnKTtcclxuXHJcbi8vIERpcmVjdGl2ZXNcclxudmFyIHBvc3REaXJlY3RpdmUgXHRcdD0gcmVxdWlyZSgnLi9kaXJlY3RpdmVzL3Bvc3QnKTtcclxudmFyIGNvbW1lbnREaXJlY3RpdmUgXHQ9IHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9jb21tZW50Jyk7XHJcbnZhciBhdXRoRGlyZWN0aXZlIFx0XHQ9IHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9hdXRoJyk7XHJcbnZhciBwb3N0c0xvYWRlZCBcdFx0PSByZXF1aXJlKCcuL2RpcmVjdGl2ZXMvcG9zdHMtbG9hZGVkJyk7XHJcblxyXG4vLyBGYWN0b3JpZXNcclxudmFyIGF1dGhJbnRlcmNlcHRvciBcdD0gcmVxdWlyZSgnLi9mYWN0b3JpZXMvYXV0aC1pbnRlcmNlcHRvcicpO1xyXG52YXIgYXV0aENoYW5nZU5vdGlmaWVyIFx0PSByZXF1aXJlKCcuL2ZhY3Rvcmllcy9hdXRoLWNoYW5nZS1ub3RpZmllcicpO1xyXG5cclxuLy8gQ29uZmlnXHJcbnZhciBpbnRlcmNlcHRvciBcdFx0PSByZXF1aXJlKCcuL2NvbmZpZy9pbnRlcmNlcHRvcicpO1xyXG5cclxuXHJcbi8vPT09PT09PT1cclxuLy8gRmFjdG9yeVxyXG4vLz09PT09PT09XHJcblxyXG5hcHAuZmFjdG9yeSgnYXV0aEludGVyY2VwdG9yJywgYXV0aEludGVyY2VwdG9yKTtcclxuYXBwLmZhY3RvcnkoJ2F1dGhTdGF0ZScsIGF1dGhDaGFuZ2VOb3RpZmllcik7XHJcblxyXG5cclxuLy89PT09PT09XHJcbi8vIENvbmZpZ1xyXG4vLz09PT09PT1cclxuXHJcbmFwcC5jb25maWcoaW50ZXJjZXB0b3IpO1xyXG5cclxuXHJcbi8vPT09PT09PVxyXG4vLyBSb3V0ZXNcclxuLy89PT09PT09XHJcblxyXG5hcHAuY29uZmlnKHBvc3RSb3V0ZXMpO1xyXG5hcHAuY29uZmlnKGF1dGhSb3V0ZXMpO1xyXG5hcHAuY29uZmlnKHByZXNpUm91dGVzKTtcclxuXHJcblxyXG4vLz09PT09PT09PT09PVxyXG4vLyBDb250cm9sbGVyc1xyXG4vLz09PT09PT09PT09PVxyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ1Bvc3RDb250cm9sbGVyJywgcG9zdEN0cmwpO1xyXG5hcHAuY29udHJvbGxlcignRGV0YWlsVmlld0NvbnRyb2xsZXInLCBkZXRhaWxWaWV3Q3RybCk7XHJcbmFwcC5jb250cm9sbGVyKCdMaXN0Vmlld0NvbnRyb2xsZXInLCBsaXN0Vmlld0N0cmwpO1xyXG5hcHAuY29udHJvbGxlcignUG9zdEZvcm1Db250cm9sbGVyJywgcG9zdEZvcm1DdHJsKTtcclxuYXBwLmNvbnRyb2xsZXIoJ0NvbW1lbnRDb250cm9sbGVyJywgY29tbWVudEN0cmwpO1xyXG5hcHAuY29udHJvbGxlcignQXV0aENvbnRyb2xsZXInLCBhdXRoQ3RybCk7XHJcblxyXG5cclxuLy89PT09PT09PT09PVxyXG4vLyBEaXJlY3RpdmVzXHJcbi8vPT09PT09PT09PT1cclxuXHJcbmFwcC5kaXJlY3RpdmUoJ3Bvc3QnLCBwb3N0RGlyZWN0aXZlLnBvc3QpO1xyXG5hcHAuZGlyZWN0aXZlKCdwb3N0Zm9ybScsIHBvc3REaXJlY3RpdmUuZm9ybSk7XHJcbmFwcC5kaXJlY3RpdmUoJ2NvbW1lbnQnLCBjb21tZW50RGlyZWN0aXZlLmNvbW1lbnQpO1xyXG5hcHAuZGlyZWN0aXZlKCdjb21tZW50Zm9ybScsIGNvbW1lbnREaXJlY3RpdmUuY29tbWVudEZvcm0pO1xyXG5hcHAuZGlyZWN0aXZlKCdhdXRoaGVhZGVyJywgYXV0aERpcmVjdGl2ZS5hdXRoSGVhZGVyKTtcclxuYXBwLmRpcmVjdGl2ZSgncG9zdHNMb2FkZWQnLCBwb3N0c0xvYWRlZCk7IiwidmFyIFVzZXIgXHQ9IHJlcXVpcmUoJy4vdXNlcicpO1xyXG52YXIgU2NvcmUgXHQ9IHJlcXVpcmUoJy4vc2NvcmUnKTtcclxudmFyIGV4dGVuZCA9IHJlcXVpcmUoJ2V4dGVuZCcpO1xyXG5cclxuLy89PT09PVxyXG4vLyBEYXRhIG1vZGVsIG9mIGEgY29tbWVudFxyXG4vLz09PT09XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvbnN0cnVjdG9yKSB7XHJcblx0dmFyICRzY29wZSA9IHRoaXM7XHJcblxyXG5cdHZhciBERUZBVUxUID0ge1xyXG5cdFx0dGV4dDogJycsXHJcblx0XHRwYXJlbnQ6IG51bGwsXHJcblx0XHRwb3N0ZWQ6IERhdGUubm93KCksXHJcblx0XHR1c2VyOiBuZXcgVXNlcigpLFxyXG5cdFx0c2NvcmU6IG5ldyBTY29yZSgpLFxyXG5cdFx0cG9zdElkOiAtMVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gZXh0ZW5kKCRzY29wZSwgREVGQVVMVCwgY29uc3RydWN0b3IpO1xyXG59OyIsInZhciBleHRlbmQgPSByZXF1aXJlKCdleHRlbmQnKTtcclxuXHJcbi8vIERhdGEgbW9kZWwgb2YgYSBwb3N0XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvbnN0cnVjdG9yKXtcclxuXHJcblx0dmFyICRzY29wZSA9IHRoaXM7XHJcblxyXG5cdHZhciBERUZBVUxUID0ge1xyXG5cdFx0dGl0bGU6ICcnLFxyXG5cdFx0dGV4dDogJycsXHJcblx0XHRpbWFnZTogJycsXHJcblx0XHRwb3N0ZWQ6IERhdGUubm93KClcclxuXHR9XHJcblxyXG5cdHJldHVybiBleHRlbmQoJHNjb3BlLCBERUZBVUxULCBjb25zdHJ1Y3Rvcik7XHJcbn07IiwidmFyIGV4dGVuZCA9IHJlcXVpcmUoJ2V4dGVuZCcpO1xyXG5cclxuLy8gU2NvcmUgbW9kZWxcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29uc3RydWN0b3Ipe1xyXG5cdHZhciAkc2NvcGUgPSB0aGlzO1xyXG5cclxuXHR2YXIgREVGQVVMVCA9IHtcclxuXHRcdHVwdm90ZXM6IDAsXHJcblx0XHRkb3dudm90ZXM6IDAsXHJcblx0XHRnZXQ6IGZ1bmN0aW9uICgpe1xyXG5cdFx0XHRyZXR1cm4gJHNjb3BlLnVwdm90ZXMgLSAkc2NvcGUuZG93bnZvdGVzO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIGV4dGVuZCgkc2NvcGUsIERFRkFVTFQsIGNvbnN0cnVjdG9yKTtcclxufSIsInZhciBleHRlbmQgPSByZXF1aXJlKCdleHRlbmQnKTtcclxuXHJcbi8vIERhdGEgbW9kZWwgb2YgYSBwb3N0XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvbnN0cnVjdG9yKXtcclxuXHJcbiAgICB2YXIgJHNjb3BlID0gdGhpcztcclxuXHJcbiAgICB2YXIgREVGQVVMVCA9IHtcclxuICAgICAgICBlbWFpbDogJycsXHJcbiAgICAgICAgcGFzc3dvcmQ6ICcnXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGV4dGVuZCgkc2NvcGUsIERFRkFVTFQsIGNvbnN0cnVjdG9yKTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IFtcclxuXHQnJHJvdXRlUHJvdmlkZXInLFxyXG5cdGZ1bmN0aW9uICgkcm91dGVQcm92aWRlcikge1xyXG5cdFx0JHJvdXRlUHJvdmlkZXIuXHJcblx0XHRcclxuXHRcdFx0Ly8gTGlzdCBvZiBhbGwgcG9zdHNcclxuXHRcdFx0d2hlbignL2xvZ2luJywge1xyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnL2F1dGgnXHJcblx0XHRcdFx0LGNvbnRyb2xsZXI6ICdBdXRoQ29udHJvbGxlcidcclxuXHRcdFx0fSkuXHJcblxyXG5cdFx0XHQvLyBEZXRhaWwgb2Ygc3BlY2lmaWMgcG9zdFxyXG5cdFx0XHR3aGVuKCcvcmVnaXN0ZXInLCB7XHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvYXV0aC9yZWdpc3RlcidcclxuXHRcdFx0XHQsY29udHJvbGxlcjogJ0F1dGhDb250cm9sbGVyJ1xyXG5cdFx0XHR9KS5cclxuXHJcblx0XHRcdC8vIExvZ291dFxyXG5cdFx0XHR3aGVuKCcvbG9nb3V0Jywge1xyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnL2F1dGgvbG9nb3V0J1xyXG5cdFx0XHRcdCxjb250cm9sbGVyOiAnQXV0aENvbnRyb2xsZXInXHJcblx0XHRcdH0pLlxyXG5cdFx0XHRcclxuXHRcdFx0b3RoZXJ3aXNlKCB7IHJlZGlyZWN0VG86ICcvNDA0JyB9KVxyXG5cdH1cclxuXTsiLCJtb2R1bGUuZXhwb3J0cyA9IFtcclxuXHQnJHJvdXRlUHJvdmlkZXInLFxyXG5cdGZ1bmN0aW9uICgkcm91dGVQcm92aWRlcikge1xyXG5cdFx0JHJvdXRlUHJvdmlkZXIuXHJcblx0XHRcclxuXHRcdFx0Ly8gTGlzdCBvZiBhbGwgcG9zdHNcclxuXHRcdFx0d2hlbignLycsIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJy9wb3N0cy9saXN0JyxcclxuXHRcdFx0XHRjb250cm9sbGVyOiAnTGlzdFZpZXdDb250cm9sbGVyJ1xyXG5cdFx0XHR9KS5cclxuXHJcblx0XHRcdC8vIERldGFpbCBvZiBzcGVjaWZpYyBwb3N0XHJcblx0XHRcdHdoZW4oJy9wb3N0LzppZCcsIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogZnVuY3Rpb24gKCRwYXJhbXMpIHtcclxuXHRcdFx0XHRcdHJldHVybiAnL3Bvc3RzL3Bvc3QvJyArICRwYXJhbXMuaWRcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdEZXRhaWxWaWV3Q29udHJvbGxlcidcclxuXHRcdFx0fSkuXHJcblxyXG5cdFx0XHQvLyBDcmVhdGUgcG9zdFxyXG5cdFx0XHR3aGVuKCcvYWRkLWxpbmsnLCB7XHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvcG9zdHMvcG9zdC1mb3JtJ1xyXG5cdFx0XHR9KS5cclxuXHJcblx0XHRcdC8vIEVycm9yXHJcblx0XHRcdHdoZW4oJy80MDQnLCB7XHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvcG9zdHMvNDA0J1xyXG5cdFx0XHR9KS5cclxuXHRcdFx0b3RoZXJ3aXNlKCB7IHJlZGlyZWN0VG86ICcvNDA0JyB9KVxyXG5cdH1cclxuXTsiLCJtb2R1bGUuZXhwb3J0cyA9IFtcclxuXHQnJHJvdXRlUHJvdmlkZXInLFxyXG5cdGZ1bmN0aW9uICgkcm91dGVQcm92aWRlcikge1xyXG5cdFx0JHJvdXRlUHJvdmlkZXIuXHJcblx0XHRcclxuXHRcdFx0d2hlbignL3ByZXNlbnRhdGlvbicsIHsgdGVtcGxhdGVVcmw6ICcvcHJlc2VudGF0aW9uJywgY29udHJvbGxlcjogJ0F1dGhDb250cm9sbGVyJ30pLlxyXG5cclxuXHRcdFx0b3RoZXJ3aXNlKCB7IHJlZGlyZWN0VG86ICcvNDA0JyB9KVxyXG5cdH1cclxuXTsiLCJ2YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG52YXIgdW5kZWZpbmVkO1xuXG52YXIgaXNQbGFpbk9iamVjdCA9IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qob2JqKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0aWYgKCFvYmogfHwgdG9TdHJpbmcuY2FsbChvYmopICE9PSAnW29iamVjdCBPYmplY3RdJykge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHZhciBoYXNfb3duX2NvbnN0cnVjdG9yID0gaGFzT3duLmNhbGwob2JqLCAnY29uc3RydWN0b3InKTtcblx0dmFyIGhhc19pc19wcm9wZXJ0eV9vZl9tZXRob2QgPSBvYmouY29uc3RydWN0b3IgJiYgb2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSAmJiBoYXNPd24uY2FsbChvYmouY29uc3RydWN0b3IucHJvdG90eXBlLCAnaXNQcm90b3R5cGVPZicpO1xuXHQvLyBOb3Qgb3duIGNvbnN0cnVjdG9yIHByb3BlcnR5IG11c3QgYmUgT2JqZWN0XG5cdGlmIChvYmouY29uc3RydWN0b3IgJiYgIWhhc19vd25fY29uc3RydWN0b3IgJiYgIWhhc19pc19wcm9wZXJ0eV9vZl9tZXRob2QpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvLyBPd24gcHJvcGVydGllcyBhcmUgZW51bWVyYXRlZCBmaXJzdGx5LCBzbyB0byBzcGVlZCB1cCxcblx0Ly8gaWYgbGFzdCBvbmUgaXMgb3duLCB0aGVuIGFsbCBwcm9wZXJ0aWVzIGFyZSBvd24uXG5cdHZhciBrZXk7XG5cdGZvciAoa2V5IGluIG9iaikge31cblxuXHRyZXR1cm4ga2V5ID09PSB1bmRlZmluZWQgfHwgaGFzT3duLmNhbGwob2JqLCBrZXkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBleHRlbmQoKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIG9wdGlvbnMsIG5hbWUsIHNyYywgY29weSwgY29weUlzQXJyYXksIGNsb25lLFxuXHRcdHRhcmdldCA9IGFyZ3VtZW50c1swXSxcblx0XHRpID0gMSxcblx0XHRsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLFxuXHRcdGRlZXAgPSBmYWxzZTtcblxuXHQvLyBIYW5kbGUgYSBkZWVwIGNvcHkgc2l0dWF0aW9uXG5cdGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnYm9vbGVhbicpIHtcblx0XHRkZWVwID0gdGFyZ2V0O1xuXHRcdHRhcmdldCA9IGFyZ3VtZW50c1sxXSB8fCB7fTtcblx0XHQvLyBza2lwIHRoZSBib29sZWFuIGFuZCB0aGUgdGFyZ2V0XG5cdFx0aSA9IDI7XG5cdH0gZWxzZSBpZiAoKHR5cGVvZiB0YXJnZXQgIT09ICdvYmplY3QnICYmIHR5cGVvZiB0YXJnZXQgIT09ICdmdW5jdGlvbicpIHx8IHRhcmdldCA9PSBudWxsKSB7XG5cdFx0dGFyZ2V0ID0ge307XG5cdH1cblxuXHRmb3IgKDsgaSA8IGxlbmd0aDsgKytpKSB7XG5cdFx0b3B0aW9ucyA9IGFyZ3VtZW50c1tpXTtcblx0XHQvLyBPbmx5IGRlYWwgd2l0aCBub24tbnVsbC91bmRlZmluZWQgdmFsdWVzXG5cdFx0aWYgKG9wdGlvbnMgIT0gbnVsbCkge1xuXHRcdFx0Ly8gRXh0ZW5kIHRoZSBiYXNlIG9iamVjdFxuXHRcdFx0Zm9yIChuYW1lIGluIG9wdGlvbnMpIHtcblx0XHRcdFx0c3JjID0gdGFyZ2V0W25hbWVdO1xuXHRcdFx0XHRjb3B5ID0gb3B0aW9uc1tuYW1lXTtcblxuXHRcdFx0XHQvLyBQcmV2ZW50IG5ldmVyLWVuZGluZyBsb29wXG5cdFx0XHRcdGlmICh0YXJnZXQgPT09IGNvcHkpIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFJlY3Vyc2UgaWYgd2UncmUgbWVyZ2luZyBwbGFpbiBvYmplY3RzIG9yIGFycmF5c1xuXHRcdFx0XHRpZiAoZGVlcCAmJiBjb3B5ICYmIChpc1BsYWluT2JqZWN0KGNvcHkpIHx8IChjb3B5SXNBcnJheSA9IEFycmF5LmlzQXJyYXkoY29weSkpKSkge1xuXHRcdFx0XHRcdGlmIChjb3B5SXNBcnJheSkge1xuXHRcdFx0XHRcdFx0Y29weUlzQXJyYXkgPSBmYWxzZTtcblx0XHRcdFx0XHRcdGNsb25lID0gc3JjICYmIEFycmF5LmlzQXJyYXkoc3JjKSA/IHNyYyA6IFtdO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjbG9uZSA9IHNyYyAmJiBpc1BsYWluT2JqZWN0KHNyYykgPyBzcmMgOiB7fTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBOZXZlciBtb3ZlIG9yaWdpbmFsIG9iamVjdHMsIGNsb25lIHRoZW1cblx0XHRcdFx0XHR0YXJnZXRbbmFtZV0gPSBleHRlbmQoZGVlcCwgY2xvbmUsIGNvcHkpO1xuXG5cdFx0XHRcdC8vIERvbid0IGJyaW5nIGluIHVuZGVmaW5lZCB2YWx1ZXNcblx0XHRcdFx0fSBlbHNlIGlmIChjb3B5ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHR0YXJnZXRbbmFtZV0gPSBjb3B5O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmV0dXJuIHRoZSBtb2RpZmllZCBvYmplY3Rcblx0cmV0dXJuIHRhcmdldDtcbn07XG5cbiJdfQ==

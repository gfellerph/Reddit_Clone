(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var User = require('../models/user');

module.exports = [
	'$scope',
	'$http',
	'$routeParams',
	'$location',
	function ($scope, $http, $routeParams, $location) {

		$scope.isActive = function (route) {
			return route === $location.path();
		}

	}
];
},{"../models/user":12}],2:[function(require,module,exports){
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
},{"../models/comment":9,"../models/user":12}],3:[function(require,module,exports){
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
},{"../models/post":10,"../models/score":11,"../models/user":12}],4:[function(require,module,exports){
var Post = require('../models/post');
var Score = require('../models/score');
var User = require('../models/user');

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
},{"../models/post":10,"../models/score":11,"../models/user":12}],5:[function(require,module,exports){
module.exports.authHeader = ['$location', function ($location) {
	return {
		restrict: 'E'
		,templateUrl: '/auth/header'
		,link: function ($scope, $element, $attrs) {
			console.log('$attrs.href: ', $attrs.href)
			var path = $attrs.href.substring(1);
			$scope.$location = $location;
			$scope.$watch('$location.path()', function (locPath) {
				(path === locPath) ? $element.addClass("current") : $element.removeClass("current");
			});
		}
	};
}];
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
},{"./controllers/auth":1,"./controllers/comment":2,"./controllers/post":4,"./controllers/post-detail":3,"./directives/auth":5,"./directives/comment":6,"./directives/post":7,"./routes/auth":13,"./routes/post":14}],9:[function(require,module,exports){
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
},{"./score":11,"./user":12,"extend":15}],10:[function(require,module,exports){
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
},{"./score":11,"./user":12,"extend":15}],11:[function(require,module,exports){
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
},{"extend":15}],12:[function(require,module,exports){
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
},{"extend":15}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
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


},{}]},{},[8])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxHaXRIdWJcXFJlZGRpdF9DbG9uZVxcZnJvbnRlbmRcXGJ1aWxkc3lzdGVtXFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvY29udHJvbGxlcnMvYXV0aC5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvY29udHJvbGxlcnMvY29tbWVudC5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvY29udHJvbGxlcnMvcG9zdC1kZXRhaWwuanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL2NvbnRyb2xsZXJzL3Bvc3QuanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL2RpcmVjdGl2ZXMvYXV0aC5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvZGlyZWN0aXZlcy9jb21tZW50LmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9kaXJlY3RpdmVzL3Bvc3QuanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL21haW4uanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL21vZGVscy9jb21tZW50LmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9tb2RlbHMvcG9zdC5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvbW9kZWxzL3Njb3JlLmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9tb2RlbHMvdXNlci5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvcm91dGVzL2F1dGguanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL3JvdXRlcy9wb3N0LmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9ub2RlX21vZHVsZXMvZXh0ZW5kL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgVXNlciA9IHJlcXVpcmUoJy4uL21vZGVscy91c2VyJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcclxuXHQnJHNjb3BlJyxcclxuXHQnJGh0dHAnLFxyXG5cdCckcm91dGVQYXJhbXMnLFxyXG5cdCckbG9jYXRpb24nLFxyXG5cdGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRsb2NhdGlvbikge1xyXG5cclxuXHRcdCRzY29wZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uIChyb3V0ZSkge1xyXG5cdFx0XHRyZXR1cm4gcm91dGUgPT09ICRsb2NhdGlvbi5wYXRoKCk7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXTsiLCIvLyBSZXF1aXJlc1xyXG52YXIgQ29tbWVudCA9IHJlcXVpcmUoJy4uL21vZGVscy9jb21tZW50Jyk7XHJcbnZhciBVc2VyID0gcmVxdWlyZSgnLi4vbW9kZWxzL3VzZXInKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gW1xyXG5cdCckc2NvcGUnLFxyXG5cdCckaHR0cCcsXHJcblx0JyRyb3V0ZVBhcmFtcycsXHJcblx0ZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcykge1xyXG5cclxuXHJcblx0XHQvLyBMaXN0IG9mIGFsbCBjb21tZW50cyBmb3IgdGhpcyBwb3N0XHJcblx0XHQkc2NvcGUuY29tbWVudHMgPSBbXTtcclxuXHRcdC8vIEZvcm0gbW9kZWxcclxuXHRcdCRzY29wZS5jb21tZW50ID0gbmV3IENvbW1lbnQoKTtcclxuXHRcdC8vIElEIG9mIHRoZSBwb3N0XHJcblx0XHQkc2NvcGUucG9zdElkID0gJHJvdXRlUGFyYW1zLmlkO1xyXG5cdFx0Ly8gRHVtbXkgZGF0YSBmb3IgdXNlclxyXG5cdFx0JHNjb3BlLmR1bW15X3VzZXIgPSBuZXcgVXNlcih7IG5hbWU6ICdQaGlsaXBwJywgam9pbmVkOiBEYXRlLm5vdygpIH0pO1xyXG5cclxuXHJcblx0XHQvLz09PT09XHJcblx0XHQvLyBMSVNUXHJcblx0XHQvLz09PT09XHJcblxyXG5cdFx0dGhpcy5saXN0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0Ly8gR2V0IGNvbW1lbnQgbGlzdFxyXG5cdFx0XHR2YXIgcmVxID0gJGh0dHAuZ2V0KCcvYXBpL2NvbW1lbnRzL3RvLycgKyAkc2NvcGUucG9zdElkKTtcclxuXHRcdFx0cmVxLnN1Y2Nlc3MgKCBmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuXHRcdFx0XHQkc2NvcGUuY29tbWVudHMgPSBkYXRhO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmVxLmVycm9yIChmdW5jdGlvbiAoZXJyKSB7IGNvbnNvbGUubG9nKGVycik7IH0pO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0Ly89PT09PT09XHJcblx0XHQvLyBDUkVBVEVcclxuXHRcdC8vPT09PT09PVxyXG5cclxuXHRcdHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0Ly8gSW5pdGlhbGl6ZSBjb21tZW50IG9iamVjdFxyXG5cdFx0XHQkc2NvcGUuY29tbWVudC51c2VyID0gJHNjb3BlLmR1bW15X3VzZXI7XHJcblx0XHRcdCRzY29wZS5jb21tZW50LnBvc3RJZCA9ICRzY29wZS5wb3N0SWQ7XHJcblxyXG5cdFx0XHQvLyBQdXNoIHRvIHRoZSBzZXJ2ZXJcclxuXHRcdFx0dmFyIHJlcSA9ICRodHRwLnBvc3QoJy9hcGkvY29tbWVudCcsICRzY29wZS5jb21tZW50KTtcclxuXHRcdFx0cmVxLnN1Y2Nlc3MgKCBmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuXHRcdFx0XHQkc2NvcGUuY29tbWVudHMucHVzaChkYXRhKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJlcS5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIFJlc2V0XHJcblx0XHRcdCRzY29wZS5jb21tZW50ID0ge307XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PVxyXG5cdFx0Ly8gQW5zd2VyXHJcblx0XHQvLz09PT09PT1cclxuXHJcblx0XHR0aGlzLmFuc3dlciA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJHNjb3BlKTtcclxuXHRcdFx0dmFyIHRlbXBsYXRlID0ge307XHJcblx0XHRcdHZhciByZXEgPSAkaHR0cC5nZXQoJy9jb21tZW50cy9jb21tZW50LXRlbXBsYXRlJyk7XHJcblx0XHRcdHJlcS5zdWNjZXNzID0gZnVuY3Rpb24gKCBkYXRhICkge1xyXG5cdFx0XHRcdHRlbXBsYXRlID0gZGF0YTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyh0ZW1wbGF0ZSk7XHJcblx0XHRcdFx0JChkb2N1bWVudCkucHJlcGVuZCh0ZW1wbGF0ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly89PT09PT09XHJcblx0XHQvLyBVcHZvdGVcclxuXHRcdC8vPT09PT09PVxyXG5cdFx0XHJcblx0XHR0aGlzLnVwdm90ZSA9IGZ1bmN0aW9uIChjb21tZW50KSB7XHJcblx0XHRcdHZhciAkY29tbWVudCA9IG5ldyBDb21tZW50KGNvbW1lbnQpO1xyXG5cclxuXHRcdFx0JGNvbW1lbnQuc2NvcmUudXB2b3RlcysrO1xyXG5cdFx0XHQkaHR0cC5wdXQoJy9hcGkvY29tbWVudC8nICsgJGNvbW1lbnQuX2lkICsgJy91cHZvdGUnLCAkY29tbWVudClcclxuXHRcdFx0LmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdCRjb21tZW50LnNjb3JlLnVwdm90ZXMtLTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly89PT09PT09PT1cclxuXHRcdC8vIERvd252b3RlXHJcblx0XHQvLz09PT09PT09PVxyXG5cdFx0XHJcblx0XHR0aGlzLmRvd252b3RlID0gZnVuY3Rpb24gKGNvbW1lbnQpIHtcclxuXHRcdFx0dmFyICRjb21tZW50ID0gbmV3IENvbW1lbnQoY29tbWVudCk7XHJcblxyXG5cdFx0XHQkY29tbWVudC5zY29yZS5kb3dudm90ZXMrKztcclxuXHRcdFx0JGh0dHAucHV0KCcvYXBpL2NvbW1lbnQvJyArICRjb21tZW50Ll9pZCArICcvZG93bnZvdGUnLCAkY29tbWVudClcclxuXHRcdFx0LmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdCRjb21tZW50LnNjb3JlLmRvd252b3Rlcy0tO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLz09PT09PT09PT09PT09XHJcblx0XHQvLyBJbml0aWFsIGNhbGxzXHJcblx0XHQvLz09PT09PT09PT09PT09XHJcblxyXG5cdFx0dGhpcy5saXN0KCk7XHJcblx0fVxyXG5dOyIsInZhciBQb3N0ID0gcmVxdWlyZSgnLi4vbW9kZWxzL3Bvc3QnKTtcclxudmFyIFNjb3JlID0gcmVxdWlyZSgnLi4vbW9kZWxzL3Njb3JlJyk7XHJcbnZhciBVc2VyID0gcmVxdWlyZSgnLi4vbW9kZWxzL3VzZXInKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gW1xyXG5cdCckc2NvcGUnLFxyXG5cdCckaHR0cCcsXHJcblx0JyRyb3V0ZVBhcmFtcycsXHJcblx0ZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcykge1xyXG5cclxuXHRcdC8vIEZvcm0gbW9kZWwvRGV0YWlsIHZpZXdcclxuXHRcdCRzY29wZS5wb3N0ID0gbmV3IFBvc3QoKTtcclxuXHRcdC8vIElEIG9mIHRoZSBwb3N0XHJcblx0XHQkc2NvcGUucG9zdElkID0gJHJvdXRlUGFyYW1zLmlkO1xyXG5cdFx0Ly8gRHVtbXkgZGF0YSBmb3IgdXNlclxyXG5cdFx0JHNjb3BlLmR1bW15X3VzZXIgPSBuZXcgVXNlcih7IG5hbWU6ICdQaGlsaXBwJywgam9pbmVkOiBEYXRlLm5vdygpIH0pO1xyXG5cclxuXHJcblx0XHQvLz09PT09XHJcblx0XHQvLyBSZWFkXHJcblx0XHQvLz09PT09XHJcblxyXG5cdFx0JHNjb3BlLnJlYWQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHQvLyBHZXQgZGV0YWlscyBvZiBvbmUgcG9zdFxyXG5cdFx0XHQkaHR0cC5nZXQoJy9hcGkvcG9zdC8nICsgJHJvdXRlUGFyYW1zLmlkKVxyXG5cdFx0XHRcdC5zdWNjZXNzICggZnVuY3Rpb24gKGRhdGEpIHtcclxuXHRcdFx0XHRcdCRzY29wZS5wb3N0ID0gbmV3IFBvc3QoZGF0YSk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygkc2NvcGUucG9zdCk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0Ly89PT09PT09XHJcblx0XHQvLyBVcHZvdGVcclxuXHRcdC8vPT09PT09PVxyXG5cclxuXHRcdCRzY29wZS51cHZvdGUgPSBmdW5jdGlvbiAocG9zdCkge1xyXG5cdFx0XHR2YXIgJHBvc3QgPSBuZXcgUG9zdChwb3N0KTtcclxuXHRcdFx0JHBvc3Quc2NvcmUudXB2b3RlcysrO1xyXG5cclxuXHRcdFx0JGh0dHAucHV0KCcvYXBpL3Bvc3QvJyArICRwb3N0Ll9pZCArICcvdXB2b3RlLycsICRwb3N0KVxyXG5cdFx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdCRwb3N0LnNjb3JlLnVwdm90ZXMtLTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PT09XHJcblx0XHQvLyBEb3dudm90ZVxyXG5cdFx0Ly89PT09PT09PT1cclxuXHJcblx0XHQkc2NvcGUuZG93bnZvdGUgPSBmdW5jdGlvbiAocG9zdCkge1xyXG5cdFx0XHR2YXIgJHBvc3QgPSBuZXcgUG9zdChwb3N0KTtcclxuXHRcdFx0JHBvc3Quc2NvcmUuZG93bnZvdGVzKys7XHJcblxyXG5cdFx0XHQkaHR0cC5wdXQoJy9hcGkvcG9zdC8nICsgJHBvc3QuX2lkICsgJy9kb3dudm90ZS8nLCAkcG9zdClcclxuXHRcdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0XHQkcG9zdC5zY29yZS5kb3dudm90ZXMtLTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PT09XHJcblx0XHQvLyBJbml0aWF0ZVxyXG5cdFx0Ly89PT09PT09PT1cclxuXHJcblx0XHQkc2NvcGUucmVhZCgpO1xyXG5cdH1cclxuXTsiLCJ2YXIgUG9zdCA9IHJlcXVpcmUoJy4uL21vZGVscy9wb3N0Jyk7XHJcbnZhciBTY29yZSA9IHJlcXVpcmUoJy4uL21vZGVscy9zY29yZScpO1xyXG52YXIgVXNlciA9IHJlcXVpcmUoJy4uL21vZGVscy91c2VyJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcclxuXHQnJHNjb3BlJyxcclxuXHQnJGh0dHAnLFxyXG5cdCckcm91dGVQYXJhbXMnLFxyXG5cdGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMpIHtcclxuXHJcblx0XHQvLyBMaXN0IG9mIGFsbCBwb3N0c1xyXG5cdFx0JHNjb3BlLnBvc3RzID0gW107XHJcblx0XHQvLyBGb3JtIG1vZGVsL0RldGFpbCB2aWV3XHJcblx0XHQkc2NvcGUucG9zdCA9IG5ldyBQb3N0KCk7XHJcblx0XHQvLyBJRCBvZiB0aGUgcG9zdFxyXG5cdFx0JHNjb3BlLnBvc3RJZCA9ICRyb3V0ZVBhcmFtcy5pZDtcclxuXHRcdC8vIER1bW15IGRhdGEgZm9yIHVzZXJcclxuXHRcdCRzY29wZS5kdW1teV91c2VyID0gbmV3IFVzZXIoeyBuYW1lOiAnUGhpbGlwcCcsIGpvaW5lZDogRGF0ZS5ub3coKSB9KTtcclxuXHJcblxyXG5cdFx0Ly89PT09PVxyXG5cdFx0Ly8gTElTVFxyXG5cdFx0Ly89PT09PVxyXG5cclxuXHRcdCRzY29wZS5saXN0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0Ly8gR2V0IGxpc3Qgb2YgcG9zdHNcclxuXHRcdFx0JGh0dHAuZ2V0KCcvYXBpL3Bvc3RzJylcclxuXHRcdFx0XHQuc3VjY2VzcyAoIGZ1bmN0aW9uIChkYXRhKSB7XHJcblx0XHRcdFx0XHQkc2NvcGUucG9zdHMgPSBkYXRhO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdC8vPT09PT09PVxyXG5cdFx0Ly8gQ1JFQVRFXHJcblx0XHQvLz09PT09PT1cclxuXHJcblx0XHQkc2NvcGUuY3JlYXRlID0gZnVuY3Rpb24gKHBvc3QpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ2NyZWF0ZSBwb3N0JywgcG9zdCk7XHJcblx0XHRcdHZhciAkcG9zdCA9IG5ldyBQb3N0KHBvc3QpO1xyXG5cdFx0XHQkaHR0cC5wb3N0KCcvYXBpL3Bvc3QnLCAkcG9zdClcclxuXHRcdFx0XHQuc3VjY2VzcyAoIGZ1bmN0aW9uIChkYXRhKSB7XHJcblx0XHRcdFx0XHQkc2NvcGUucG9zdHMucHVzaChkYXRhKTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PVxyXG5cdFx0Ly8gVXB2b3RlXHJcblx0XHQvLz09PT09PT1cclxuXHJcblx0XHQkc2NvcGUudXB2b3RlID0gZnVuY3Rpb24gKHBvc3QpIHtcclxuXHRcdFx0dmFyICRwb3N0ID0gbmV3IFBvc3QocG9zdCk7XHJcblx0XHRcdCRwb3N0LnNjb3JlLnVwdm90ZXMrKztcclxuXHJcblx0XHRcdCRodHRwLnB1dCgnL2FwaS9wb3N0LycgKyAkcG9zdC5faWQgKyAnL3Vwdm90ZS8nLCAkcG9zdClcclxuXHRcdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0XHQkcG9zdC5zY29yZS51cHZvdGVzLS07XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLz09PT09PT09PVxyXG5cdFx0Ly8gRG93bnZvdGVcclxuXHRcdC8vPT09PT09PT09XHJcblxyXG5cdFx0JHNjb3BlLmRvd252b3RlID0gZnVuY3Rpb24gKHBvc3QpIHtcclxuXHRcdFx0dmFyICRwb3N0ID0gbmV3IFBvc3QocG9zdCk7XHJcblx0XHRcdCRwb3N0LnNjb3JlLmRvd252b3RlcysrO1xyXG5cclxuXHRcdFx0JGh0dHAucHV0KCcvYXBpL3Bvc3QvJyArICRwb3N0Ll9pZCArICcvZG93bnZvdGUvJywgJHBvc3QpXHJcblx0XHRcdFx0LmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0JHBvc3Quc2NvcmUuZG93bnZvdGVzLS07XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLz09PT09PT09PVxyXG5cdFx0Ly8gSW5pdGlhdGVcclxuXHRcdC8vPT09PT09PT09XHJcblxyXG5cdFx0JHNjb3BlLmxpc3QoKTtcclxuXHR9XHJcbl07IiwibW9kdWxlLmV4cG9ydHMuYXV0aEhlYWRlciA9IFsnJGxvY2F0aW9uJywgZnVuY3Rpb24gKCRsb2NhdGlvbikge1xyXG5cdHJldHVybiB7XHJcblx0XHRyZXN0cmljdDogJ0UnXHJcblx0XHQsdGVtcGxhdGVVcmw6ICcvYXV0aC9oZWFkZXInXHJcblx0XHQsbGluazogZnVuY3Rpb24gKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycykge1xyXG5cdFx0XHRjb25zb2xlLmxvZygnJGF0dHJzLmhyZWY6ICcsICRhdHRycy5ocmVmKVxyXG5cdFx0XHR2YXIgcGF0aCA9ICRhdHRycy5ocmVmLnN1YnN0cmluZygxKTtcclxuXHRcdFx0JHNjb3BlLiRsb2NhdGlvbiA9ICRsb2NhdGlvbjtcclxuXHRcdFx0JHNjb3BlLiR3YXRjaCgnJGxvY2F0aW9uLnBhdGgoKScsIGZ1bmN0aW9uIChsb2NQYXRoKSB7XHJcblx0XHRcdFx0KHBhdGggPT09IGxvY1BhdGgpID8gJGVsZW1lbnQuYWRkQ2xhc3MoXCJjdXJyZW50XCIpIDogJGVsZW1lbnQucmVtb3ZlQ2xhc3MoXCJjdXJyZW50XCIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9O1xyXG59XTsiLCJleHBvcnRzLmNvbW1lbnQgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHRlbXBsYXRlVXJsOiAnL2NvbW1lbnRzL2NvbW1lbnQtdGVtcGxhdGUnXHJcblx0fTtcclxufTtcclxuXHJcbmV4cG9ydHMuY29tbWVudEZvcm0gPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHRlbXBsYXRlVXJsOiAnL2NvbW1lbnRzL2NvbW1lbnQtZm9ybSdcclxuXHR9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzLmxpc3QgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHRlbXBsYXRlVXJsOiAnL3Bvc3RzL3Bvc3QtdGVtcGxhdGUnLFxyXG5cdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlbGVtZW50KTtcclxuXHRcdH1cclxuXHR9O1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuZGV0YWlsID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiB7XHJcblx0XHR0ZW1wbGF0ZVVybDogJy9wb3N0cy9wb3N0LWRldGFpbCcsXHJcblx0XHRsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGVsZW1lbnQpO1xyXG5cdFx0fVxyXG5cdH07XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5mb3JtID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiB7XHJcblx0XHR0ZW1wbGF0ZVVybDogJy9wb3N0cy9wb3N0LWZvcm0nLFxyXG5cdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlbGVtZW50KTtcclxuXHRcdH1cclxuXHR9O1xyXG59OyIsInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgncmVkZGl0JywgWyduZ1JvdXRlJ10pO1xyXG5cclxuLy89PT09PT09PVxyXG4vLyBJbXBvcnRzXHJcbi8vPT09PT09PT1cclxuXHJcbi8vIFJvdXRlc1xyXG52YXIgcG9zdFJvdXRlcyBcdFx0XHQ9IHJlcXVpcmUoJy4vcm91dGVzL3Bvc3QnKTtcclxudmFyIGF1dGhSb3V0ZXMgXHRcdFx0PSByZXF1aXJlKCcuL3JvdXRlcy9hdXRoJyk7XHJcblxyXG4vLyBDb250cm9sbGVyc1xyXG52YXIgcG9zdEN0cmwgXHRcdFx0PSByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL3Bvc3QnKTtcclxudmFyIHBvc3REZXRhaWxDdHJsIFx0XHQ9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvcG9zdC1kZXRhaWwnKTtcclxudmFyIGNvbW1lbnRDdHJsIFx0XHQ9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvY29tbWVudCcpO1xyXG52YXIgYXV0aEN0cmwgXHRcdFx0PSByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL2F1dGgnKTtcclxuXHJcbi8vIERpcmVjdGl2ZXNcclxudmFyIHBvc3REaXJlY3RpdmUgXHRcdD0gcmVxdWlyZSgnLi9kaXJlY3RpdmVzL3Bvc3QnKTtcclxudmFyIGNvbW1lbnREaXJlY3RpdmUgXHQ9IHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9jb21tZW50Jyk7XHJcbnZhciBhdXRoRGlyZWN0aXZlIFx0XHQ9IHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9hdXRoJyk7XHJcblxyXG5cclxuLy89PT09PT09XHJcbi8vIFJvdXRlc1xyXG4vLz09PT09PT1cclxuXHJcbmFwcC5jb25maWcocG9zdFJvdXRlcyk7XHJcbmFwcC5jb25maWcoYXV0aFJvdXRlcyk7XHJcblxyXG5cclxuLy89PT09PT09PT09PT1cclxuLy8gQ29udHJvbGxlcnNcclxuLy89PT09PT09PT09PT1cclxuXHJcbmFwcC5jb250cm9sbGVyKCdQb3N0Q29udHJvbGxlcicsIHBvc3RDdHJsKTtcclxuYXBwLmNvbnRyb2xsZXIoJ1Bvc3REZXRhaWxDb250cm9sbGVyJywgcG9zdERldGFpbEN0cmwpO1xyXG5hcHAuY29udHJvbGxlcignQ29tbWVudENvbnRyb2xsZXInLCBjb21tZW50Q3RybCk7XHJcbmFwcC5jb250cm9sbGVyKCdBdXRoQ29udHJvbGxlcicsIGF1dGhDdHJsKTtcclxuXHJcblxyXG4vLz09PT09PT09PT09XHJcbi8vIERpcmVjdGl2ZXNcclxuLy89PT09PT09PT09PVxyXG5cclxuYXBwLmRpcmVjdGl2ZSgncG9zdCcsIHBvc3REaXJlY3RpdmUubGlzdCk7XHJcbmFwcC5kaXJlY3RpdmUoJ3Bvc3RkZXRhaWwnLCBwb3N0RGlyZWN0aXZlLmRldGFpbCk7XHJcbmFwcC5kaXJlY3RpdmUoJ3Bvc3Rmb3JtJywgcG9zdERpcmVjdGl2ZS5mb3JtKTtcclxuYXBwLmRpcmVjdGl2ZSgnY29tbWVudCcsIGNvbW1lbnREaXJlY3RpdmUuY29tbWVudCk7XHJcbmFwcC5kaXJlY3RpdmUoJ2NvbW1lbnRmb3JtJywgY29tbWVudERpcmVjdGl2ZS5jb21tZW50Rm9ybSk7XHJcbmFwcC5kaXJlY3RpdmUoJ2F1dGhoZWFkZXInLCBhdXRoRGlyZWN0aXZlLmF1dGhIZWFkZXIpOyIsInZhciBVc2VyIFx0PSByZXF1aXJlKCcuL3VzZXInKTtcclxudmFyIFNjb3JlIFx0PSByZXF1aXJlKCcuL3Njb3JlJyk7XHJcbnZhciBleHRlbmQgPSByZXF1aXJlKCdleHRlbmQnKTtcclxuXHJcbi8vPT09PT1cclxuLy8gRGF0YSBtb2RlbCBvZiBhIGNvbW1lbnRcclxuLy89PT09PVxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb25zdHJ1Y3Rvcikge1xyXG5cdHZhciAkc2NvcGUgPSB0aGlzO1xyXG5cclxuXHR2YXIgREVGQVVMVCA9IHtcclxuXHRcdHRleHQ6ICcnLFxyXG5cdFx0cGFyZW50OiBudWxsLFxyXG5cdFx0cG9zdGVkOiBEYXRlLm5vdygpLFxyXG5cdFx0dXNlcjogbmV3IFVzZXIoKSxcclxuXHRcdHNjb3JlOiBuZXcgU2NvcmUoKSxcclxuXHRcdHBvc3RJZDogLTFcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIGV4dGVuZCgkc2NvcGUsIERFRkFVTFQsIGNvbnN0cnVjdG9yKTtcclxufTsiLCJ2YXIgVXNlciBcdD0gcmVxdWlyZSgnLi91c2VyJyk7XHJcbnZhciBTY29yZSBcdD0gcmVxdWlyZSgnLi9zY29yZScpO1xyXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgnZXh0ZW5kJyk7XHJcblxyXG4vLyBEYXRhIG1vZGVsIG9mIGEgcG9zdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb25zdHJ1Y3Rvcil7XHJcblxyXG5cdHZhciAkc2NvcGUgPSB0aGlzO1xyXG5cclxuXHR2YXIgREVGQVVMVCA9IHtcclxuXHRcdHRpdGxlOiAnJyxcclxuXHRcdHRleHQ6ICcnLFxyXG5cdFx0aW1hZ2U6ICcnLFxyXG5cdFx0cG9zdGVkOiBEYXRlLm5vdygpLFxyXG5cdFx0c2NvcmU6IG5ldyBTY29yZSgpLFxyXG5cdFx0dXNlcjogbmV3IFVzZXIoKVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIGV4dGVuZCgkc2NvcGUsIERFRkFVTFQsIGNvbnN0cnVjdG9yKTtcclxufTsiLCJ2YXIgZXh0ZW5kID0gcmVxdWlyZSgnZXh0ZW5kJyk7XHJcblxyXG4vLyBTY29yZSBtb2RlbFxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb25zdHJ1Y3Rvcil7XHJcblx0dmFyICRzY29wZSA9IHRoaXM7XHJcblxyXG5cdHZhciBERUZBVUxUID0ge1xyXG5cdFx0dXB2b3RlczogMCxcclxuXHRcdGRvd252b3RlczogMCxcclxuXHRcdGdldDogZnVuY3Rpb24gKCl7XHJcblx0XHRcdHJldHVybiAkc2NvcGUudXB2b3RlcyAtICRzY29wZS5kb3dudm90ZXM7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gZXh0ZW5kKCRzY29wZSwgREVGQVVMVCwgY29uc3RydWN0b3IpO1xyXG59IiwidmFyIGV4dGVuZCA9IHJlcXVpcmUoJ2V4dGVuZCcpO1xyXG5cclxuLy8gRGF0YSBtb2RlbCBvZiBhIHBvc3RcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29uc3RydWN0b3Ipe1xyXG5cclxuICAgIHZhciAkc2NvcGUgPSB0aGlzO1xyXG5cclxuICAgIHZhciBERUZBVUxUID0ge1xyXG4gICAgICAgIGVtYWlsOiAnJyxcclxuICAgICAgICBwYXNzd29yZDogJydcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZXh0ZW5kKCRzY29wZSwgREVGQVVMVCwgY29uc3RydWN0b3IpO1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gW1xyXG5cdCckcm91dGVQcm92aWRlcicsXHJcblx0ZnVuY3Rpb24gKCRyb3V0ZVByb3ZpZGVyKSB7XHJcblx0XHQkcm91dGVQcm92aWRlci5cclxuXHRcdFxyXG5cdFx0XHQvLyBMaXN0IG9mIGFsbCBwb3N0c1xyXG5cdFx0XHR3aGVuKCcvbG9naW4nLCB7XHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvYXV0aCdcclxuXHRcdFx0XHQsY29udHJvbGxlcjogJ0F1dGhDb250cm9sbGVyJ1xyXG5cdFx0XHR9KS5cclxuXHJcblx0XHRcdC8vIERldGFpbCBvZiBzcGVjaWZpYyBwb3N0XHJcblx0XHRcdHdoZW4oJy9yZWdpc3RlcicsIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJy9hdXRoL3JlZ2lzdGVyJ1xyXG5cdFx0XHRcdCxjb250cm9sbGVyOiAnQXV0aENvbnRyb2xsZXInXHJcblx0XHRcdH0pLlxyXG5cclxuXHRcdFx0Ly8gTG9nb3V0XHJcblx0XHRcdHdoZW4oJy9sb2dvdXQnLCB7XHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvYXV0aC9sb2dvdXQnXHJcblx0XHRcdFx0LGNvbnRyb2xsZXI6ICdBdXRoQ29udHJvbGxlcidcclxuXHRcdFx0fSkuXHJcblx0XHRcdFxyXG5cdFx0XHRvdGhlcndpc2UoIHsgcmVkaXJlY3RUbzogJy80MDQnIH0pXHJcblx0fVxyXG5dOyIsIm1vZHVsZS5leHBvcnRzID0gW1xyXG5cdCckcm91dGVQcm92aWRlcicsXHJcblx0ZnVuY3Rpb24gKCRyb3V0ZVByb3ZpZGVyKSB7XHJcblx0XHQkcm91dGVQcm92aWRlci5cclxuXHRcdFxyXG5cdFx0XHQvLyBMaXN0IG9mIGFsbCBwb3N0c1xyXG5cdFx0XHR3aGVuKCcvJywge1xyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3Bvc3RzL2xpc3QnLFxyXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdQb3N0Q29udHJvbGxlcidcclxuXHRcdFx0fSkuXHJcblxyXG5cdFx0XHQvLyBEZXRhaWwgb2Ygc3BlY2lmaWMgcG9zdFxyXG5cdFx0XHR3aGVuKCcvcG9zdC86aWQnLCB7XHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6IGZ1bmN0aW9uICgkcGFyYW1zKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gJy9wb3N0cy9wb3N0LycgKyAkcGFyYW1zLmlkXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRjb250cm9sbGVyOiAnUG9zdERldGFpbENvbnRyb2xsZXInXHJcblx0XHRcdH0pLlxyXG5cclxuXHRcdFx0Ly8gRXJyb3JcclxuXHRcdFx0d2hlbignLzQwNCcsIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJy9wb3N0cy80MDQnXHJcblx0XHRcdH0pLlxyXG5cdFx0XHRvdGhlcndpc2UoIHsgcmVkaXJlY3RUbzogJy80MDQnIH0pXHJcblx0fVxyXG5dOyIsInZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciB1bmRlZmluZWQ7XG5cbnZhciBpc1BsYWluT2JqZWN0ID0gZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmopIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRpZiAoIW9iaiB8fCB0b1N0cmluZy5jYWxsKG9iaikgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0dmFyIGhhc19vd25fY29uc3RydWN0b3IgPSBoYXNPd24uY2FsbChvYmosICdjb25zdHJ1Y3RvcicpO1xuXHR2YXIgaGFzX2lzX3Byb3BlcnR5X29mX21ldGhvZCA9IG9iai5jb25zdHJ1Y3RvciAmJiBvYmouY29uc3RydWN0b3IucHJvdG90eXBlICYmIGhhc093bi5jYWxsKG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsICdpc1Byb3RvdHlwZU9mJyk7XG5cdC8vIE5vdCBvd24gY29uc3RydWN0b3IgcHJvcGVydHkgbXVzdCBiZSBPYmplY3Rcblx0aWYgKG9iai5jb25zdHJ1Y3RvciAmJiAhaGFzX293bl9jb25zdHJ1Y3RvciAmJiAhaGFzX2lzX3Byb3BlcnR5X29mX21ldGhvZCkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIE93biBwcm9wZXJ0aWVzIGFyZSBlbnVtZXJhdGVkIGZpcnN0bHksIHNvIHRvIHNwZWVkIHVwLFxuXHQvLyBpZiBsYXN0IG9uZSBpcyBvd24sIHRoZW4gYWxsIHByb3BlcnRpZXMgYXJlIG93bi5cblx0dmFyIGtleTtcblx0Zm9yIChrZXkgaW4gb2JqKSB7fVxuXG5cdHJldHVybiBrZXkgPT09IHVuZGVmaW5lZCB8fCBoYXNPd24uY2FsbChvYmosIGtleSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGV4dGVuZCgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgb3B0aW9ucywgbmFtZSwgc3JjLCBjb3B5LCBjb3B5SXNBcnJheSwgY2xvbmUsXG5cdFx0dGFyZ2V0ID0gYXJndW1lbnRzWzBdLFxuXHRcdGkgPSAxLFxuXHRcdGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsXG5cdFx0ZGVlcCA9IGZhbHNlO1xuXG5cdC8vIEhhbmRsZSBhIGRlZXAgY29weSBzaXR1YXRpb25cblx0aWYgKHR5cGVvZiB0YXJnZXQgPT09ICdib29sZWFuJykge1xuXHRcdGRlZXAgPSB0YXJnZXQ7XG5cdFx0dGFyZ2V0ID0gYXJndW1lbnRzWzFdIHx8IHt9O1xuXHRcdC8vIHNraXAgdGhlIGJvb2xlYW4gYW5kIHRoZSB0YXJnZXRcblx0XHRpID0gMjtcblx0fSBlbHNlIGlmICgodHlwZW9mIHRhcmdldCAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIHRhcmdldCAhPT0gJ2Z1bmN0aW9uJykgfHwgdGFyZ2V0ID09IG51bGwpIHtcblx0XHR0YXJnZXQgPSB7fTtcblx0fVxuXG5cdGZvciAoOyBpIDwgbGVuZ3RoOyArK2kpIHtcblx0XHRvcHRpb25zID0gYXJndW1lbnRzW2ldO1xuXHRcdC8vIE9ubHkgZGVhbCB3aXRoIG5vbi1udWxsL3VuZGVmaW5lZCB2YWx1ZXNcblx0XHRpZiAob3B0aW9ucyAhPSBudWxsKSB7XG5cdFx0XHQvLyBFeHRlbmQgdGhlIGJhc2Ugb2JqZWN0XG5cdFx0XHRmb3IgKG5hbWUgaW4gb3B0aW9ucykge1xuXHRcdFx0XHRzcmMgPSB0YXJnZXRbbmFtZV07XG5cdFx0XHRcdGNvcHkgPSBvcHRpb25zW25hbWVdO1xuXG5cdFx0XHRcdC8vIFByZXZlbnQgbmV2ZXItZW5kaW5nIGxvb3Bcblx0XHRcdFx0aWYgKHRhcmdldCA9PT0gY29weSkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gUmVjdXJzZSBpZiB3ZSdyZSBtZXJnaW5nIHBsYWluIG9iamVjdHMgb3IgYXJyYXlzXG5cdFx0XHRcdGlmIChkZWVwICYmIGNvcHkgJiYgKGlzUGxhaW5PYmplY3QoY29weSkgfHwgKGNvcHlJc0FycmF5ID0gQXJyYXkuaXNBcnJheShjb3B5KSkpKSB7XG5cdFx0XHRcdFx0aWYgKGNvcHlJc0FycmF5KSB7XG5cdFx0XHRcdFx0XHRjb3B5SXNBcnJheSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0Y2xvbmUgPSBzcmMgJiYgQXJyYXkuaXNBcnJheShzcmMpID8gc3JjIDogW107XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGNsb25lID0gc3JjICYmIGlzUGxhaW5PYmplY3Qoc3JjKSA/IHNyYyA6IHt9O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIE5ldmVyIG1vdmUgb3JpZ2luYWwgb2JqZWN0cywgY2xvbmUgdGhlbVxuXHRcdFx0XHRcdHRhcmdldFtuYW1lXSA9IGV4dGVuZChkZWVwLCBjbG9uZSwgY29weSk7XG5cblx0XHRcdFx0Ly8gRG9uJ3QgYnJpbmcgaW4gdW5kZWZpbmVkIHZhbHVlc1xuXHRcdFx0XHR9IGVsc2UgaWYgKGNvcHkgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHRhcmdldFtuYW1lXSA9IGNvcHk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBSZXR1cm4gdGhlIG1vZGlmaWVkIG9iamVjdFxuXHRyZXR1cm4gdGFyZ2V0O1xufTtcblxuIl19

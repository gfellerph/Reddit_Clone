(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var User = require('../models/user');

module.exports = [
	'$scope',
	'$http',
	'$routeParams',
	function ($scope, $http, $routeParams) {

		console.log('authcontroller');

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
module.exports.authHeader = function () {
	return {
		templateUrl: '/auth/header',
		link: function (scope, element, attrs) {
			console.log(scope, element, attrs);
		}
	};
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxHaXRIdWJcXFJlZGRpdF9DbG9uZVxcZnJvbnRlbmRcXGJ1aWxkc3lzdGVtXFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvY29udHJvbGxlcnMvYXV0aC5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvY29udHJvbGxlcnMvY29tbWVudC5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvY29udHJvbGxlcnMvcG9zdC1kZXRhaWwuanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL2NvbnRyb2xsZXJzL3Bvc3QuanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL2RpcmVjdGl2ZXMvYXV0aC5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvZGlyZWN0aXZlcy9jb21tZW50LmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9kaXJlY3RpdmVzL3Bvc3QuanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL21haW4uanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL21vZGVscy9jb21tZW50LmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9tb2RlbHMvcG9zdC5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvbW9kZWxzL3Njb3JlLmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9tb2RlbHMvdXNlci5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvcm91dGVzL2F1dGguanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL3JvdXRlcy9wb3N0LmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9ub2RlX21vZHVsZXMvZXh0ZW5kL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFVzZXIgPSByZXF1aXJlKCcuLi9tb2RlbHMvdXNlcicpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRzY29wZScsXHJcblx0JyRodHRwJyxcclxuXHQnJHJvdXRlUGFyYW1zJyxcclxuXHRmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zKSB7XHJcblxyXG5cdFx0Y29uc29sZS5sb2coJ2F1dGhjb250cm9sbGVyJyk7XHJcblxyXG5cdH1cclxuXTsiLCIvLyBSZXF1aXJlc1xyXG52YXIgQ29tbWVudCA9IHJlcXVpcmUoJy4uL21vZGVscy9jb21tZW50Jyk7XHJcbnZhciBVc2VyID0gcmVxdWlyZSgnLi4vbW9kZWxzL3VzZXInKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gW1xyXG5cdCckc2NvcGUnLFxyXG5cdCckaHR0cCcsXHJcblx0JyRyb3V0ZVBhcmFtcycsXHJcblx0ZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcykge1xyXG5cclxuXHJcblx0XHQvLyBMaXN0IG9mIGFsbCBjb21tZW50cyBmb3IgdGhpcyBwb3N0XHJcblx0XHQkc2NvcGUuY29tbWVudHMgPSBbXTtcclxuXHRcdC8vIEZvcm0gbW9kZWxcclxuXHRcdCRzY29wZS5jb21tZW50ID0gbmV3IENvbW1lbnQoKTtcclxuXHRcdC8vIElEIG9mIHRoZSBwb3N0XHJcblx0XHQkc2NvcGUucG9zdElkID0gJHJvdXRlUGFyYW1zLmlkO1xyXG5cdFx0Ly8gRHVtbXkgZGF0YSBmb3IgdXNlclxyXG5cdFx0JHNjb3BlLmR1bW15X3VzZXIgPSBuZXcgVXNlcih7IG5hbWU6ICdQaGlsaXBwJywgam9pbmVkOiBEYXRlLm5vdygpIH0pO1xyXG5cclxuXHJcblx0XHQvLz09PT09XHJcblx0XHQvLyBMSVNUXHJcblx0XHQvLz09PT09XHJcblxyXG5cdFx0dGhpcy5saXN0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0Ly8gR2V0IGNvbW1lbnQgbGlzdFxyXG5cdFx0XHR2YXIgcmVxID0gJGh0dHAuZ2V0KCcvYXBpL2NvbW1lbnRzL3RvLycgKyAkc2NvcGUucG9zdElkKTtcclxuXHRcdFx0cmVxLnN1Y2Nlc3MgKCBmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuXHRcdFx0XHQkc2NvcGUuY29tbWVudHMgPSBkYXRhO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmVxLmVycm9yIChmdW5jdGlvbiAoZXJyKSB7IGNvbnNvbGUubG9nKGVycik7IH0pO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0Ly89PT09PT09XHJcblx0XHQvLyBDUkVBVEVcclxuXHRcdC8vPT09PT09PVxyXG5cclxuXHRcdHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0Ly8gSW5pdGlhbGl6ZSBjb21tZW50IG9iamVjdFxyXG5cdFx0XHQkc2NvcGUuY29tbWVudC51c2VyID0gJHNjb3BlLmR1bW15X3VzZXI7XHJcblx0XHRcdCRzY29wZS5jb21tZW50LnBvc3RJZCA9ICRzY29wZS5wb3N0SWQ7XHJcblxyXG5cdFx0XHQvLyBQdXNoIHRvIHRoZSBzZXJ2ZXJcclxuXHRcdFx0dmFyIHJlcSA9ICRodHRwLnBvc3QoJy9hcGkvY29tbWVudCcsICRzY29wZS5jb21tZW50KTtcclxuXHRcdFx0cmVxLnN1Y2Nlc3MgKCBmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuXHRcdFx0XHQkc2NvcGUuY29tbWVudHMucHVzaChkYXRhKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJlcS5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIFJlc2V0XHJcblx0XHRcdCRzY29wZS5jb21tZW50ID0ge307XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PVxyXG5cdFx0Ly8gQW5zd2VyXHJcblx0XHQvLz09PT09PT1cclxuXHJcblx0XHR0aGlzLmFuc3dlciA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJHNjb3BlKTtcclxuXHRcdFx0dmFyIHRlbXBsYXRlID0ge307XHJcblx0XHRcdHZhciByZXEgPSAkaHR0cC5nZXQoJy9jb21tZW50cy9jb21tZW50LXRlbXBsYXRlJyk7XHJcblx0XHRcdHJlcS5zdWNjZXNzID0gZnVuY3Rpb24gKCBkYXRhICkge1xyXG5cdFx0XHRcdHRlbXBsYXRlID0gZGF0YTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyh0ZW1wbGF0ZSk7XHJcblx0XHRcdFx0JChkb2N1bWVudCkucHJlcGVuZCh0ZW1wbGF0ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly89PT09PT09XHJcblx0XHQvLyBVcHZvdGVcclxuXHRcdC8vPT09PT09PVxyXG5cdFx0XHJcblx0XHR0aGlzLnVwdm90ZSA9IGZ1bmN0aW9uIChjb21tZW50KSB7XHJcblx0XHRcdHZhciAkY29tbWVudCA9IG5ldyBDb21tZW50KGNvbW1lbnQpO1xyXG5cclxuXHRcdFx0JGNvbW1lbnQuc2NvcmUudXB2b3RlcysrO1xyXG5cdFx0XHQkaHR0cC5wdXQoJy9hcGkvY29tbWVudC8nICsgJGNvbW1lbnQuX2lkICsgJy91cHZvdGUnLCAkY29tbWVudClcclxuXHRcdFx0LmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdCRjb21tZW50LnNjb3JlLnVwdm90ZXMtLTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly89PT09PT09PT1cclxuXHRcdC8vIERvd252b3RlXHJcblx0XHQvLz09PT09PT09PVxyXG5cdFx0XHJcblx0XHR0aGlzLmRvd252b3RlID0gZnVuY3Rpb24gKGNvbW1lbnQpIHtcclxuXHRcdFx0dmFyICRjb21tZW50ID0gbmV3IENvbW1lbnQoY29tbWVudCk7XHJcblxyXG5cdFx0XHQkY29tbWVudC5zY29yZS5kb3dudm90ZXMrKztcclxuXHRcdFx0JGh0dHAucHV0KCcvYXBpL2NvbW1lbnQvJyArICRjb21tZW50Ll9pZCArICcvZG93bnZvdGUnLCAkY29tbWVudClcclxuXHRcdFx0LmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdCRjb21tZW50LnNjb3JlLmRvd252b3Rlcy0tO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLz09PT09PT09PT09PT09XHJcblx0XHQvLyBJbml0aWFsIGNhbGxzXHJcblx0XHQvLz09PT09PT09PT09PT09XHJcblxyXG5cdFx0dGhpcy5saXN0KCk7XHJcblx0fVxyXG5dOyIsInZhciBQb3N0ID0gcmVxdWlyZSgnLi4vbW9kZWxzL3Bvc3QnKTtcclxudmFyIFNjb3JlID0gcmVxdWlyZSgnLi4vbW9kZWxzL3Njb3JlJyk7XHJcbnZhciBVc2VyID0gcmVxdWlyZSgnLi4vbW9kZWxzL3VzZXInKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gW1xyXG5cdCckc2NvcGUnLFxyXG5cdCckaHR0cCcsXHJcblx0JyRyb3V0ZVBhcmFtcycsXHJcblx0ZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcykge1xyXG5cclxuXHRcdC8vIEZvcm0gbW9kZWwvRGV0YWlsIHZpZXdcclxuXHRcdCRzY29wZS5wb3N0ID0gbmV3IFBvc3QoKTtcclxuXHRcdC8vIElEIG9mIHRoZSBwb3N0XHJcblx0XHQkc2NvcGUucG9zdElkID0gJHJvdXRlUGFyYW1zLmlkO1xyXG5cdFx0Ly8gRHVtbXkgZGF0YSBmb3IgdXNlclxyXG5cdFx0JHNjb3BlLmR1bW15X3VzZXIgPSBuZXcgVXNlcih7IG5hbWU6ICdQaGlsaXBwJywgam9pbmVkOiBEYXRlLm5vdygpIH0pO1xyXG5cclxuXHJcblx0XHQvLz09PT09XHJcblx0XHQvLyBSZWFkXHJcblx0XHQvLz09PT09XHJcblxyXG5cdFx0JHNjb3BlLnJlYWQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHQvLyBHZXQgZGV0YWlscyBvZiBvbmUgcG9zdFxyXG5cdFx0XHQkaHR0cC5nZXQoJy9hcGkvcG9zdC8nICsgJHJvdXRlUGFyYW1zLmlkKVxyXG5cdFx0XHRcdC5zdWNjZXNzICggZnVuY3Rpb24gKGRhdGEpIHtcclxuXHRcdFx0XHRcdCRzY29wZS5wb3N0ID0gbmV3IFBvc3QoZGF0YSk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygkc2NvcGUucG9zdCk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0Ly89PT09PT09XHJcblx0XHQvLyBVcHZvdGVcclxuXHRcdC8vPT09PT09PVxyXG5cclxuXHRcdCRzY29wZS51cHZvdGUgPSBmdW5jdGlvbiAocG9zdCkge1xyXG5cdFx0XHR2YXIgJHBvc3QgPSBuZXcgUG9zdChwb3N0KTtcclxuXHRcdFx0JHBvc3Quc2NvcmUudXB2b3RlcysrO1xyXG5cclxuXHRcdFx0JGh0dHAucHV0KCcvYXBpL3Bvc3QvJyArICRwb3N0Ll9pZCArICcvdXB2b3RlLycsICRwb3N0KVxyXG5cdFx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdCRwb3N0LnNjb3JlLnVwdm90ZXMtLTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PT09XHJcblx0XHQvLyBEb3dudm90ZVxyXG5cdFx0Ly89PT09PT09PT1cclxuXHJcblx0XHQkc2NvcGUuZG93bnZvdGUgPSBmdW5jdGlvbiAocG9zdCkge1xyXG5cdFx0XHR2YXIgJHBvc3QgPSBuZXcgUG9zdChwb3N0KTtcclxuXHRcdFx0JHBvc3Quc2NvcmUuZG93bnZvdGVzKys7XHJcblxyXG5cdFx0XHQkaHR0cC5wdXQoJy9hcGkvcG9zdC8nICsgJHBvc3QuX2lkICsgJy9kb3dudm90ZS8nLCAkcG9zdClcclxuXHRcdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0XHQkcG9zdC5zY29yZS5kb3dudm90ZXMtLTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PT09XHJcblx0XHQvLyBJbml0aWF0ZVxyXG5cdFx0Ly89PT09PT09PT1cclxuXHJcblx0XHQkc2NvcGUucmVhZCgpO1xyXG5cdH1cclxuXTsiLCJ2YXIgUG9zdCA9IHJlcXVpcmUoJy4uL21vZGVscy9wb3N0Jyk7XHJcbnZhciBTY29yZSA9IHJlcXVpcmUoJy4uL21vZGVscy9zY29yZScpO1xyXG52YXIgVXNlciA9IHJlcXVpcmUoJy4uL21vZGVscy91c2VyJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcclxuXHQnJHNjb3BlJyxcclxuXHQnJGh0dHAnLFxyXG5cdCckcm91dGVQYXJhbXMnLFxyXG5cdGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMpIHtcclxuXHJcblx0XHQvLyBMaXN0IG9mIGFsbCBwb3N0c1xyXG5cdFx0JHNjb3BlLnBvc3RzID0gW107XHJcblx0XHQvLyBGb3JtIG1vZGVsL0RldGFpbCB2aWV3XHJcblx0XHQkc2NvcGUucG9zdCA9IG5ldyBQb3N0KCk7XHJcblx0XHQvLyBJRCBvZiB0aGUgcG9zdFxyXG5cdFx0JHNjb3BlLnBvc3RJZCA9ICRyb3V0ZVBhcmFtcy5pZDtcclxuXHRcdC8vIER1bW15IGRhdGEgZm9yIHVzZXJcclxuXHRcdCRzY29wZS5kdW1teV91c2VyID0gbmV3IFVzZXIoeyBuYW1lOiAnUGhpbGlwcCcsIGpvaW5lZDogRGF0ZS5ub3coKSB9KTtcclxuXHJcblxyXG5cdFx0Ly89PT09PVxyXG5cdFx0Ly8gTElTVFxyXG5cdFx0Ly89PT09PVxyXG5cclxuXHRcdCRzY29wZS5saXN0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0Ly8gR2V0IGxpc3Qgb2YgcG9zdHNcclxuXHRcdFx0JGh0dHAuZ2V0KCcvYXBpL3Bvc3RzJylcclxuXHRcdFx0XHQuc3VjY2VzcyAoIGZ1bmN0aW9uIChkYXRhKSB7XHJcblx0XHRcdFx0XHQkc2NvcGUucG9zdHMgPSBkYXRhO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdC8vPT09PT09PVxyXG5cdFx0Ly8gQ1JFQVRFXHJcblx0XHQvLz09PT09PT1cclxuXHJcblx0XHQkc2NvcGUuY3JlYXRlID0gZnVuY3Rpb24gKHBvc3QpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ2NyZWF0ZSBwb3N0JywgcG9zdCk7XHJcblx0XHRcdHZhciAkcG9zdCA9IG5ldyBQb3N0KHBvc3QpO1xyXG5cdFx0XHQkaHR0cC5wb3N0KCcvYXBpL3Bvc3QnLCAkcG9zdClcclxuXHRcdFx0XHQuc3VjY2VzcyAoIGZ1bmN0aW9uIChkYXRhKSB7XHJcblx0XHRcdFx0XHQkc2NvcGUucG9zdHMucHVzaChkYXRhKTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vPT09PT09PVxyXG5cdFx0Ly8gVXB2b3RlXHJcblx0XHQvLz09PT09PT1cclxuXHJcblx0XHQkc2NvcGUudXB2b3RlID0gZnVuY3Rpb24gKHBvc3QpIHtcclxuXHRcdFx0dmFyICRwb3N0ID0gbmV3IFBvc3QocG9zdCk7XHJcblx0XHRcdCRwb3N0LnNjb3JlLnVwdm90ZXMrKztcclxuXHJcblx0XHRcdCRodHRwLnB1dCgnL2FwaS9wb3N0LycgKyAkcG9zdC5faWQgKyAnL3Vwdm90ZS8nLCAkcG9zdClcclxuXHRcdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0XHQkcG9zdC5zY29yZS51cHZvdGVzLS07XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLz09PT09PT09PVxyXG5cdFx0Ly8gRG93bnZvdGVcclxuXHRcdC8vPT09PT09PT09XHJcblxyXG5cdFx0JHNjb3BlLmRvd252b3RlID0gZnVuY3Rpb24gKHBvc3QpIHtcclxuXHRcdFx0dmFyICRwb3N0ID0gbmV3IFBvc3QocG9zdCk7XHJcblx0XHRcdCRwb3N0LnNjb3JlLmRvd252b3RlcysrO1xyXG5cclxuXHRcdFx0JGh0dHAucHV0KCcvYXBpL3Bvc3QvJyArICRwb3N0Ll9pZCArICcvZG93bnZvdGUvJywgJHBvc3QpXHJcblx0XHRcdFx0LmVycm9yICggZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0JHBvc3Quc2NvcmUuZG93bnZvdGVzLS07XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLz09PT09PT09PVxyXG5cdFx0Ly8gSW5pdGlhdGVcclxuXHRcdC8vPT09PT09PT09XHJcblxyXG5cdFx0JHNjb3BlLmxpc3QoKTtcclxuXHR9XHJcbl07IiwibW9kdWxlLmV4cG9ydHMuYXV0aEhlYWRlciA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0dGVtcGxhdGVVcmw6ICcvYXV0aC9oZWFkZXInLFxyXG5cdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhzY29wZSwgZWxlbWVudCwgYXR0cnMpO1xyXG5cdFx0fVxyXG5cdH07XHJcbn07IiwiZXhwb3J0cy5jb21tZW50ID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiB7XHJcblx0XHR0ZW1wbGF0ZVVybDogJy9jb21tZW50cy9jb21tZW50LXRlbXBsYXRlJ1xyXG5cdH07XHJcbn07XHJcblxyXG5leHBvcnRzLmNvbW1lbnRGb3JtID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiB7XHJcblx0XHR0ZW1wbGF0ZVVybDogJy9jb21tZW50cy9jb21tZW50LWZvcm0nXHJcblx0fTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cy5saXN0ID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiB7XHJcblx0XHR0ZW1wbGF0ZVVybDogJy9wb3N0cy9wb3N0LXRlbXBsYXRlJyxcclxuXHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZWxlbWVudCk7XHJcblx0XHR9XHJcblx0fTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmRldGFpbCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0dGVtcGxhdGVVcmw6ICcvcG9zdHMvcG9zdC1kZXRhaWwnLFxyXG5cdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhlbGVtZW50KTtcclxuXHRcdH1cclxuXHR9O1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuZm9ybSA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0dGVtcGxhdGVVcmw6ICcvcG9zdHMvcG9zdC1mb3JtJyxcclxuXHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZWxlbWVudCk7XHJcblx0XHR9XHJcblx0fTtcclxufTsiLCJ2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ3JlZGRpdCcsIFsnbmdSb3V0ZSddKTtcclxuXHJcbi8vPT09PT09PT1cclxuLy8gSW1wb3J0c1xyXG4vLz09PT09PT09XHJcblxyXG4vLyBSb3V0ZXNcclxudmFyIHBvc3RSb3V0ZXMgXHRcdFx0PSByZXF1aXJlKCcuL3JvdXRlcy9wb3N0Jyk7XHJcbnZhciBhdXRoUm91dGVzIFx0XHRcdD0gcmVxdWlyZSgnLi9yb3V0ZXMvYXV0aCcpO1xyXG5cclxuLy8gQ29udHJvbGxlcnNcclxudmFyIHBvc3RDdHJsIFx0XHRcdD0gcmVxdWlyZSgnLi9jb250cm9sbGVycy9wb3N0Jyk7XHJcbnZhciBwb3N0RGV0YWlsQ3RybCBcdFx0PSByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL3Bvc3QtZGV0YWlsJyk7XHJcbnZhciBjb21tZW50Q3RybCBcdFx0PSByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL2NvbW1lbnQnKTtcclxudmFyIGF1dGhDdHJsIFx0XHRcdD0gcmVxdWlyZSgnLi9jb250cm9sbGVycy9hdXRoJyk7XHJcblxyXG4vLyBEaXJlY3RpdmVzXHJcbnZhciBwb3N0RGlyZWN0aXZlIFx0XHQ9IHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9wb3N0Jyk7XHJcbnZhciBjb21tZW50RGlyZWN0aXZlIFx0PSByZXF1aXJlKCcuL2RpcmVjdGl2ZXMvY29tbWVudCcpO1xyXG52YXIgYXV0aERpcmVjdGl2ZSBcdFx0PSByZXF1aXJlKCcuL2RpcmVjdGl2ZXMvYXV0aCcpO1xyXG5cclxuXHJcbi8vPT09PT09PVxyXG4vLyBSb3V0ZXNcclxuLy89PT09PT09XHJcblxyXG5hcHAuY29uZmlnKHBvc3RSb3V0ZXMpO1xyXG5hcHAuY29uZmlnKGF1dGhSb3V0ZXMpO1xyXG5cclxuXHJcbi8vPT09PT09PT09PT09XHJcbi8vIENvbnRyb2xsZXJzXHJcbi8vPT09PT09PT09PT09XHJcblxyXG5hcHAuY29udHJvbGxlcignUG9zdENvbnRyb2xsZXInLCBwb3N0Q3RybCk7XHJcbmFwcC5jb250cm9sbGVyKCdQb3N0RGV0YWlsQ29udHJvbGxlcicsIHBvc3REZXRhaWxDdHJsKTtcclxuYXBwLmNvbnRyb2xsZXIoJ0NvbW1lbnRDb250cm9sbGVyJywgY29tbWVudEN0cmwpO1xyXG5hcHAuY29udHJvbGxlcignQXV0aENvbnRyb2xsZXInLCBhdXRoQ3RybCk7XHJcblxyXG5cclxuLy89PT09PT09PT09PVxyXG4vLyBEaXJlY3RpdmVzXHJcbi8vPT09PT09PT09PT1cclxuXHJcbmFwcC5kaXJlY3RpdmUoJ3Bvc3QnLCBwb3N0RGlyZWN0aXZlLmxpc3QpO1xyXG5hcHAuZGlyZWN0aXZlKCdwb3N0ZGV0YWlsJywgcG9zdERpcmVjdGl2ZS5kZXRhaWwpO1xyXG5hcHAuZGlyZWN0aXZlKCdwb3N0Zm9ybScsIHBvc3REaXJlY3RpdmUuZm9ybSk7XHJcbmFwcC5kaXJlY3RpdmUoJ2NvbW1lbnQnLCBjb21tZW50RGlyZWN0aXZlLmNvbW1lbnQpO1xyXG5hcHAuZGlyZWN0aXZlKCdjb21tZW50Zm9ybScsIGNvbW1lbnREaXJlY3RpdmUuY29tbWVudEZvcm0pO1xyXG5hcHAuZGlyZWN0aXZlKCdhdXRoaGVhZGVyJywgYXV0aERpcmVjdGl2ZS5hdXRoSGVhZGVyKTsiLCJ2YXIgVXNlciBcdD0gcmVxdWlyZSgnLi91c2VyJyk7XHJcbnZhciBTY29yZSBcdD0gcmVxdWlyZSgnLi9zY29yZScpO1xyXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgnZXh0ZW5kJyk7XHJcblxyXG4vLz09PT09XHJcbi8vIERhdGEgbW9kZWwgb2YgYSBjb21tZW50XHJcbi8vPT09PT1cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29uc3RydWN0b3IpIHtcclxuXHR2YXIgJHNjb3BlID0gdGhpcztcclxuXHJcblx0dmFyIERFRkFVTFQgPSB7XHJcblx0XHR0ZXh0OiAnJyxcclxuXHRcdHBhcmVudDogbnVsbCxcclxuXHRcdHBvc3RlZDogRGF0ZS5ub3coKSxcclxuXHRcdHVzZXI6IG5ldyBVc2VyKCksXHJcblx0XHRzY29yZTogbmV3IFNjb3JlKCksXHJcblx0XHRwb3N0SWQ6IC0xXHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiBleHRlbmQoJHNjb3BlLCBERUZBVUxULCBjb25zdHJ1Y3Rvcik7XHJcbn07IiwidmFyIFVzZXIgXHQ9IHJlcXVpcmUoJy4vdXNlcicpO1xyXG52YXIgU2NvcmUgXHQ9IHJlcXVpcmUoJy4vc2NvcmUnKTtcclxudmFyIGV4dGVuZCA9IHJlcXVpcmUoJ2V4dGVuZCcpO1xyXG5cclxuLy8gRGF0YSBtb2RlbCBvZiBhIHBvc3RcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29uc3RydWN0b3Ipe1xyXG5cclxuXHR2YXIgJHNjb3BlID0gdGhpcztcclxuXHJcblx0dmFyIERFRkFVTFQgPSB7XHJcblx0XHR0aXRsZTogJycsXHJcblx0XHR0ZXh0OiAnJyxcclxuXHRcdGltYWdlOiAnJyxcclxuXHRcdHBvc3RlZDogRGF0ZS5ub3coKSxcclxuXHRcdHNjb3JlOiBuZXcgU2NvcmUoKSxcclxuXHRcdHVzZXI6IG5ldyBVc2VyKClcclxuXHR9XHJcblxyXG5cdHJldHVybiBleHRlbmQoJHNjb3BlLCBERUZBVUxULCBjb25zdHJ1Y3Rvcik7XHJcbn07IiwidmFyIGV4dGVuZCA9IHJlcXVpcmUoJ2V4dGVuZCcpO1xyXG5cclxuLy8gU2NvcmUgbW9kZWxcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29uc3RydWN0b3Ipe1xyXG5cdHZhciAkc2NvcGUgPSB0aGlzO1xyXG5cclxuXHR2YXIgREVGQVVMVCA9IHtcclxuXHRcdHVwdm90ZXM6IDAsXHJcblx0XHRkb3dudm90ZXM6IDAsXHJcblx0XHRnZXQ6IGZ1bmN0aW9uICgpe1xyXG5cdFx0XHRyZXR1cm4gJHNjb3BlLnVwdm90ZXMgLSAkc2NvcGUuZG93bnZvdGVzO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIGV4dGVuZCgkc2NvcGUsIERFRkFVTFQsIGNvbnN0cnVjdG9yKTtcclxufSIsInZhciBleHRlbmQgPSByZXF1aXJlKCdleHRlbmQnKTtcclxuXHJcbi8vIERhdGEgbW9kZWwgb2YgYSBwb3N0XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvbnN0cnVjdG9yKXtcclxuXHJcbiAgICB2YXIgJHNjb3BlID0gdGhpcztcclxuXHJcbiAgICB2YXIgREVGQVVMVCA9IHtcclxuICAgICAgICBlbWFpbDogJycsXHJcbiAgICAgICAgcGFzc3dvcmQ6ICcnXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGV4dGVuZCgkc2NvcGUsIERFRkFVTFQsIGNvbnN0cnVjdG9yKTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IFtcclxuXHQnJHJvdXRlUHJvdmlkZXInLFxyXG5cdGZ1bmN0aW9uICgkcm91dGVQcm92aWRlcikge1xyXG5cdFx0JHJvdXRlUHJvdmlkZXIuXHJcblx0XHRcclxuXHRcdFx0Ly8gTGlzdCBvZiBhbGwgcG9zdHNcclxuXHRcdFx0d2hlbignL2xvZ2luJywge1xyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnL2F1dGgnXHJcblx0XHRcdFx0LGNvbnRyb2xsZXI6ICdBdXRoQ29udHJvbGxlcidcclxuXHRcdFx0fSkuXHJcblxyXG5cdFx0XHQvLyBEZXRhaWwgb2Ygc3BlY2lmaWMgcG9zdFxyXG5cdFx0XHR3aGVuKCcvcmVnaXN0ZXInLCB7XHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvYXV0aC9yZWdpc3RlcidcclxuXHRcdFx0XHQsY29udHJvbGxlcjogJ0F1dGhDb250cm9sbGVyJ1xyXG5cdFx0XHR9KS5cclxuXHJcblx0XHRcdC8vIExvZ291dFxyXG5cdFx0XHR3aGVuKCcvbG9nb3V0Jywge1xyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnL2F1dGgvbG9nb3V0J1xyXG5cdFx0XHR9KS5cclxuXHRcdFx0XHJcblx0XHRcdG90aGVyd2lzZSggeyByZWRpcmVjdFRvOiAnLzQwNCcgfSlcclxuXHR9XHJcbl07IiwibW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRyb3V0ZVByb3ZpZGVyJyxcclxuXHRmdW5jdGlvbiAoJHJvdXRlUHJvdmlkZXIpIHtcclxuXHRcdCRyb3V0ZVByb3ZpZGVyLlxyXG5cdFx0XHJcblx0XHRcdC8vIExpc3Qgb2YgYWxsIHBvc3RzXHJcblx0XHRcdHdoZW4oJy8nLCB7XHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvcG9zdHMvbGlzdCcsXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ1Bvc3RDb250cm9sbGVyJ1xyXG5cdFx0XHR9KS5cclxuXHJcblx0XHRcdC8vIERldGFpbCBvZiBzcGVjaWZpYyBwb3N0XHJcblx0XHRcdHdoZW4oJy9wb3N0LzppZCcsIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogZnVuY3Rpb24gKCRwYXJhbXMpIHtcclxuXHRcdFx0XHRcdHJldHVybiAnL3Bvc3RzL3Bvc3QvJyArICRwYXJhbXMuaWRcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdQb3N0RGV0YWlsQ29udHJvbGxlcidcclxuXHRcdFx0fSkuXHJcblxyXG5cdFx0XHQvLyBFcnJvclxyXG5cdFx0XHR3aGVuKCcvNDA0Jywge1xyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3Bvc3RzLzQwNCdcclxuXHRcdFx0fSkuXHJcblx0XHRcdG90aGVyd2lzZSggeyByZWRpcmVjdFRvOiAnLzQwNCcgfSlcclxuXHR9XHJcbl07IiwidmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIHVuZGVmaW5lZDtcblxudmFyIGlzUGxhaW5PYmplY3QgPSBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iaikge1xuXHQndXNlIHN0cmljdCc7XG5cdGlmICghb2JqIHx8IHRvU3RyaW5nLmNhbGwob2JqKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHR2YXIgaGFzX293bl9jb25zdHJ1Y3RvciA9IGhhc093bi5jYWxsKG9iaiwgJ2NvbnN0cnVjdG9yJyk7XG5cdHZhciBoYXNfaXNfcHJvcGVydHlfb2ZfbWV0aG9kID0gb2JqLmNvbnN0cnVjdG9yICYmIG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgJiYgaGFzT3duLmNhbGwob2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSwgJ2lzUHJvdG90eXBlT2YnKTtcblx0Ly8gTm90IG93biBjb25zdHJ1Y3RvciBwcm9wZXJ0eSBtdXN0IGJlIE9iamVjdFxuXHRpZiAob2JqLmNvbnN0cnVjdG9yICYmICFoYXNfb3duX2NvbnN0cnVjdG9yICYmICFoYXNfaXNfcHJvcGVydHlfb2ZfbWV0aG9kKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly8gT3duIHByb3BlcnRpZXMgYXJlIGVudW1lcmF0ZWQgZmlyc3RseSwgc28gdG8gc3BlZWQgdXAsXG5cdC8vIGlmIGxhc3Qgb25lIGlzIG93biwgdGhlbiBhbGwgcHJvcGVydGllcyBhcmUgb3duLlxuXHR2YXIga2V5O1xuXHRmb3IgKGtleSBpbiBvYmopIHt9XG5cblx0cmV0dXJuIGtleSA9PT0gdW5kZWZpbmVkIHx8IGhhc093bi5jYWxsKG9iaiwga2V5KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXh0ZW5kKCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBvcHRpb25zLCBuYW1lLCBzcmMsIGNvcHksIGNvcHlJc0FycmF5LCBjbG9uZSxcblx0XHR0YXJnZXQgPSBhcmd1bWVudHNbMF0sXG5cdFx0aSA9IDEsXG5cdFx0bGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCxcblx0XHRkZWVwID0gZmFsc2U7XG5cblx0Ly8gSGFuZGxlIGEgZGVlcCBjb3B5IHNpdHVhdGlvblxuXHRpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0ZGVlcCA9IHRhcmdldDtcblx0XHR0YXJnZXQgPSBhcmd1bWVudHNbMV0gfHwge307XG5cdFx0Ly8gc2tpcCB0aGUgYm9vbGVhbiBhbmQgdGhlIHRhcmdldFxuXHRcdGkgPSAyO1xuXHR9IGVsc2UgaWYgKCh0eXBlb2YgdGFyZ2V0ICE9PSAnb2JqZWN0JyAmJiB0eXBlb2YgdGFyZ2V0ICE9PSAnZnVuY3Rpb24nKSB8fCB0YXJnZXQgPT0gbnVsbCkge1xuXHRcdHRhcmdldCA9IHt9O1xuXHR9XG5cblx0Zm9yICg7IGkgPCBsZW5ndGg7ICsraSkge1xuXHRcdG9wdGlvbnMgPSBhcmd1bWVudHNbaV07XG5cdFx0Ly8gT25seSBkZWFsIHdpdGggbm9uLW51bGwvdW5kZWZpbmVkIHZhbHVlc1xuXHRcdGlmIChvcHRpb25zICE9IG51bGwpIHtcblx0XHRcdC8vIEV4dGVuZCB0aGUgYmFzZSBvYmplY3Rcblx0XHRcdGZvciAobmFtZSBpbiBvcHRpb25zKSB7XG5cdFx0XHRcdHNyYyA9IHRhcmdldFtuYW1lXTtcblx0XHRcdFx0Y29weSA9IG9wdGlvbnNbbmFtZV07XG5cblx0XHRcdFx0Ly8gUHJldmVudCBuZXZlci1lbmRpbmcgbG9vcFxuXHRcdFx0XHRpZiAodGFyZ2V0ID09PSBjb3B5KSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBSZWN1cnNlIGlmIHdlJ3JlIG1lcmdpbmcgcGxhaW4gb2JqZWN0cyBvciBhcnJheXNcblx0XHRcdFx0aWYgKGRlZXAgJiYgY29weSAmJiAoaXNQbGFpbk9iamVjdChjb3B5KSB8fCAoY29weUlzQXJyYXkgPSBBcnJheS5pc0FycmF5KGNvcHkpKSkpIHtcblx0XHRcdFx0XHRpZiAoY29weUlzQXJyYXkpIHtcblx0XHRcdFx0XHRcdGNvcHlJc0FycmF5ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRjbG9uZSA9IHNyYyAmJiBBcnJheS5pc0FycmF5KHNyYykgPyBzcmMgOiBbXTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y2xvbmUgPSBzcmMgJiYgaXNQbGFpbk9iamVjdChzcmMpID8gc3JjIDoge307XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gTmV2ZXIgbW92ZSBvcmlnaW5hbCBvYmplY3RzLCBjbG9uZSB0aGVtXG5cdFx0XHRcdFx0dGFyZ2V0W25hbWVdID0gZXh0ZW5kKGRlZXAsIGNsb25lLCBjb3B5KTtcblxuXHRcdFx0XHQvLyBEb24ndCBicmluZyBpbiB1bmRlZmluZWQgdmFsdWVzXG5cdFx0XHRcdH0gZWxzZSBpZiAoY29weSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0dGFyZ2V0W25hbWVdID0gY29weTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFJldHVybiB0aGUgbW9kaWZpZWQgb2JqZWN0XG5cdHJldHVybiB0YXJnZXQ7XG59O1xuXG4iXX0=

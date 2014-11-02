(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = [
	'$scope',
	'$http',
	'$routeParams',
	function ($scope, $http, $routeParams) {

		var comments = [];
		var postId = $routeParams.id;
		// Dummy data for user
		var dummy_user = { name: 'Philipp', joined: Date.now() };

		//=====
		// LIST
		//=====
		this.list = function () {

			// Get comment list
			var req = $http.get('/api/comments/to/' + postId);
			req.success ( function (data, status, headers, config) {
				$scope.comments = data;
			});
			req.error (function (err) { console.log(err); });
		}; // (default)

		//=======
		// CREATE
		//=======
		this.create = function (comment) {

			// Initialize comment object
			$scope.comment = {
				posted: Date.now(),
				score: {
					upvotes: 0,
					downvotes: 0
				},
				user: dummy_user,
				postId: postId
			};

			// Push to the server
			var req = $http.post('/api/comment', comment);
			req.success ( function (data, status, headers, config) {
				$scope.comments.push(data);
			});
			req.error ( function (err) {
				console.log(err);
			});
		}
	}
];
},{}],2:[function(require,module,exports){
module.exports = ['$scope', '$http', function ($scope, $http) {

	// Get list of posts
	$http.get('/api/posts')
		.success ( function (data) {
			$scope.posts = data;
		})
		.error ( function (err) {
			console.log(err);
		});
}];
},{}],3:[function(require,module,exports){
module.exports = [
	'$scope',
	'$http',
	'$routeParams',
	function ($scope, $http, $routeParams) {

		$scope.post = {};
		$scope.comments = [];

		// Get list of posts
		$http.get('/api/post/' + $routeParams.id)
			.success ( function (data) {
				$scope.post = data;
			})
			.error ( function (err) {
				console.log(err);
			});

		// Get the comments
		$http.get('/api/comments/to/' + $routeParams.id)
			.success ( function (data) {
				$scope.comments = data;
			})
			.error ( function (err) {
				console.log(err);
			});
	}
];
},{}],4:[function(require,module,exports){
module.exports = function () {
	return {
		templateUrl: '/comments/comment-template'
	};
};
},{}],5:[function(require,module,exports){
module.exports = function () {
	return {
		templateUrl: '/posts/post-template'
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
var postListCtrl = require('./controllers/post-list-ctrl');
var postReadCtrl = require('./controllers/post-read-ctrl');
var commentCtrl = require('./controllers/comment-ctrl');

// Directives
var postDirective = require('./directives/postDirective');
var commentDirective = require('./directives/commentDirective');


//=======
// Routes
//=======
app.config(postRoutes);


//============
// Controllers
//============
app.controller('PostListController', postListCtrl);
app.controller('PostReadController', postReadCtrl);
app.controller('CommentController', commentCtrl);


//===========
// Directives
//===========
app.directive('post', postDirective);
app.directive('comment', commentDirective);
},{"./controllers/comment-ctrl":1,"./controllers/post-list-ctrl":2,"./controllers/post-read-ctrl":3,"./directives/commentDirective":4,"./directives/postDirective":5,"./routes/post":7}],7:[function(require,module,exports){
module.exports = [
	'$routeProvider',
	function ($routeProvider) {
		$routeProvider.
			when('/', {
				templateUrl: '/posts/list',
				controller: 'PostListController'
			}).
			when('/post/:id', {
				templateUrl: function ($params) {
					return '/posts/post/' + $params.id
				},
				controller: 'PostReadController'
			}).
			when('/404', {
				templateUrl: '/posts/404'
			}).
			otherwise( { redirectTo: '/404' })
	}
];
},{}]},{},[6])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxHaXRIdWJcXFJlZGRpdF9DbG9uZVxcZnJvbnRlbmRcXGJ1aWxkc3lzdGVtXFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvY29udHJvbGxlcnMvY29tbWVudC1jdHJsLmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9jb250cm9sbGVycy9wb3N0LWxpc3QtY3RybC5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvY29udHJvbGxlcnMvcG9zdC1yZWFkLWN0cmwuanMiLCJkOi9HaXRIdWIvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL2RpcmVjdGl2ZXMvY29tbWVudERpcmVjdGl2ZS5qcyIsImQ6L0dpdEh1Yi9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvZGlyZWN0aXZlcy9wb3N0RGlyZWN0aXZlLmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9tYWluLmpzIiwiZDovR2l0SHViL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9yb3V0ZXMvcG9zdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRzY29wZScsXHJcblx0JyRodHRwJyxcclxuXHQnJHJvdXRlUGFyYW1zJyxcclxuXHRmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zKSB7XHJcblxyXG5cdFx0dmFyIGNvbW1lbnRzID0gW107XHJcblx0XHR2YXIgcG9zdElkID0gJHJvdXRlUGFyYW1zLmlkO1xyXG5cdFx0Ly8gRHVtbXkgZGF0YSBmb3IgdXNlclxyXG5cdFx0dmFyIGR1bW15X3VzZXIgPSB7IG5hbWU6ICdQaGlsaXBwJywgam9pbmVkOiBEYXRlLm5vdygpIH07XHJcblxyXG5cdFx0Ly89PT09PVxyXG5cdFx0Ly8gTElTVFxyXG5cdFx0Ly89PT09PVxyXG5cdFx0dGhpcy5saXN0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0Ly8gR2V0IGNvbW1lbnQgbGlzdFxyXG5cdFx0XHR2YXIgcmVxID0gJGh0dHAuZ2V0KCcvYXBpL2NvbW1lbnRzL3RvLycgKyBwb3N0SWQpO1xyXG5cdFx0XHRyZXEuc3VjY2VzcyAoIGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG5cdFx0XHRcdCRzY29wZS5jb21tZW50cyA9IGRhdGE7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXEuZXJyb3IgKGZ1bmN0aW9uIChlcnIpIHsgY29uc29sZS5sb2coZXJyKTsgfSk7XHJcblx0XHR9OyAvLyAoZGVmYXVsdClcclxuXHJcblx0XHQvLz09PT09PT1cclxuXHRcdC8vIENSRUFURVxyXG5cdFx0Ly89PT09PT09XHJcblx0XHR0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uIChjb21tZW50KSB7XHJcblxyXG5cdFx0XHQvLyBJbml0aWFsaXplIGNvbW1lbnQgb2JqZWN0XHJcblx0XHRcdCRzY29wZS5jb21tZW50ID0ge1xyXG5cdFx0XHRcdHBvc3RlZDogRGF0ZS5ub3coKSxcclxuXHRcdFx0XHRzY29yZToge1xyXG5cdFx0XHRcdFx0dXB2b3RlczogMCxcclxuXHRcdFx0XHRcdGRvd252b3RlczogMFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0dXNlcjogZHVtbXlfdXNlcixcclxuXHRcdFx0XHRwb3N0SWQ6IHBvc3RJZFxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0Ly8gUHVzaCB0byB0aGUgc2VydmVyXHJcblx0XHRcdHZhciByZXEgPSAkaHR0cC5wb3N0KCcvYXBpL2NvbW1lbnQnLCBjb21tZW50KTtcclxuXHRcdFx0cmVxLnN1Y2Nlc3MgKCBmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuXHRcdFx0XHQkc2NvcGUuY29tbWVudHMucHVzaChkYXRhKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJlcS5lcnJvciAoIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcbl07IiwibW9kdWxlLmV4cG9ydHMgPSBbJyRzY29wZScsICckaHR0cCcsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwKSB7XHJcblxyXG5cdC8vIEdldCBsaXN0IG9mIHBvc3RzXHJcblx0JGh0dHAuZ2V0KCcvYXBpL3Bvc3RzJylcclxuXHRcdC5zdWNjZXNzICggZnVuY3Rpb24gKGRhdGEpIHtcclxuXHRcdFx0JHNjb3BlLnBvc3RzID0gZGF0YTtcclxuXHRcdH0pXHJcblx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHR9KTtcclxufV07IiwibW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0JyRzY29wZScsXHJcblx0JyRodHRwJyxcclxuXHQnJHJvdXRlUGFyYW1zJyxcclxuXHRmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zKSB7XHJcblxyXG5cdFx0JHNjb3BlLnBvc3QgPSB7fTtcclxuXHRcdCRzY29wZS5jb21tZW50cyA9IFtdO1xyXG5cclxuXHRcdC8vIEdldCBsaXN0IG9mIHBvc3RzXHJcblx0XHQkaHR0cC5nZXQoJy9hcGkvcG9zdC8nICsgJHJvdXRlUGFyYW1zLmlkKVxyXG5cdFx0XHQuc3VjY2VzcyAoIGZ1bmN0aW9uIChkYXRhKSB7XHJcblx0XHRcdFx0JHNjb3BlLnBvc3QgPSBkYXRhO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0Ly8gR2V0IHRoZSBjb21tZW50c1xyXG5cdFx0JGh0dHAuZ2V0KCcvYXBpL2NvbW1lbnRzL3RvLycgKyAkcm91dGVQYXJhbXMuaWQpXHJcblx0XHRcdC5zdWNjZXNzICggZnVuY3Rpb24gKGRhdGEpIHtcclxuXHRcdFx0XHQkc2NvcGUuY29tbWVudHMgPSBkYXRhO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQuZXJyb3IgKCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblx0fVxyXG5dOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiB7XHJcblx0XHR0ZW1wbGF0ZVVybDogJy9jb21tZW50cy9jb21tZW50LXRlbXBsYXRlJ1xyXG5cdH07XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHRlbXBsYXRlVXJsOiAnL3Bvc3RzL3Bvc3QtdGVtcGxhdGUnXHJcblx0fTtcclxufTsiLCJ2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ3JlZGRpdCcsIFsnbmdSb3V0ZSddKTtcclxuXHJcbi8vPT09PT09PT1cclxuLy8gSW1wb3J0c1xyXG4vLz09PT09PT09XHJcblxyXG4vLyBSb3V0ZXNcclxudmFyIHBvc3RSb3V0ZXMgPSByZXF1aXJlKCcuL3JvdXRlcy9wb3N0Jyk7XHJcblxyXG4vLyBDb250cm9sbGVyc1xyXG52YXIgcG9zdExpc3RDdHJsID0gcmVxdWlyZSgnLi9jb250cm9sbGVycy9wb3N0LWxpc3QtY3RybCcpO1xyXG52YXIgcG9zdFJlYWRDdHJsID0gcmVxdWlyZSgnLi9jb250cm9sbGVycy9wb3N0LXJlYWQtY3RybCcpO1xyXG52YXIgY29tbWVudEN0cmwgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL2NvbW1lbnQtY3RybCcpO1xyXG5cclxuLy8gRGlyZWN0aXZlc1xyXG52YXIgcG9zdERpcmVjdGl2ZSA9IHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9wb3N0RGlyZWN0aXZlJyk7XHJcbnZhciBjb21tZW50RGlyZWN0aXZlID0gcmVxdWlyZSgnLi9kaXJlY3RpdmVzL2NvbW1lbnREaXJlY3RpdmUnKTtcclxuXHJcblxyXG4vLz09PT09PT1cclxuLy8gUm91dGVzXHJcbi8vPT09PT09PVxyXG5hcHAuY29uZmlnKHBvc3RSb3V0ZXMpO1xyXG5cclxuXHJcbi8vPT09PT09PT09PT09XHJcbi8vIENvbnRyb2xsZXJzXHJcbi8vPT09PT09PT09PT09XHJcbmFwcC5jb250cm9sbGVyKCdQb3N0TGlzdENvbnRyb2xsZXInLCBwb3N0TGlzdEN0cmwpO1xyXG5hcHAuY29udHJvbGxlcignUG9zdFJlYWRDb250cm9sbGVyJywgcG9zdFJlYWRDdHJsKTtcclxuYXBwLmNvbnRyb2xsZXIoJ0NvbW1lbnRDb250cm9sbGVyJywgY29tbWVudEN0cmwpO1xyXG5cclxuXHJcbi8vPT09PT09PT09PT1cclxuLy8gRGlyZWN0aXZlc1xyXG4vLz09PT09PT09PT09XHJcbmFwcC5kaXJlY3RpdmUoJ3Bvc3QnLCBwb3N0RGlyZWN0aXZlKTtcclxuYXBwLmRpcmVjdGl2ZSgnY29tbWVudCcsIGNvbW1lbnREaXJlY3RpdmUpOyIsIm1vZHVsZS5leHBvcnRzID0gW1xyXG5cdCckcm91dGVQcm92aWRlcicsXHJcblx0ZnVuY3Rpb24gKCRyb3V0ZVByb3ZpZGVyKSB7XHJcblx0XHQkcm91dGVQcm92aWRlci5cclxuXHRcdFx0d2hlbignLycsIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJy9wb3N0cy9saXN0JyxcclxuXHRcdFx0XHRjb250cm9sbGVyOiAnUG9zdExpc3RDb250cm9sbGVyJ1xyXG5cdFx0XHR9KS5cclxuXHRcdFx0d2hlbignL3Bvc3QvOmlkJywge1xyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiBmdW5jdGlvbiAoJHBhcmFtcykge1xyXG5cdFx0XHRcdFx0cmV0dXJuICcvcG9zdHMvcG9zdC8nICsgJHBhcmFtcy5pZFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ1Bvc3RSZWFkQ29udHJvbGxlcidcclxuXHRcdFx0fSkuXHJcblx0XHRcdHdoZW4oJy80MDQnLCB7XHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvcG9zdHMvNDA0J1xyXG5cdFx0XHR9KS5cclxuXHRcdFx0b3RoZXJ3aXNlKCB7IHJlZGlyZWN0VG86ICcvNDA0JyB9KVxyXG5cdH1cclxuXTsiXX0=

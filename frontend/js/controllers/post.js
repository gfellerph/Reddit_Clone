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
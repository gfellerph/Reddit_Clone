+function(){
	'use strict';

	var app = angular.module('reddit', []);

	// Dummy data for user
	var dummy_user = { name: 'Philipp', joined: Date.now() };

	// Get the post list from the server
	app.controller('PostController', ['$scope', '$http', function ($scope, $http){

		// Initialize posts collection
		$scope.posts = [];

		// Get data for the post list
		var req = $http.get('/api/posts');
		req.success(function (data, status, headers, config){
			$scope.posts = data;
		});
		req.error(function (data, status, headers, config){
			console.log(data);
		});

		this.add = function (post){

			post.posted = Date.now();
			post.score = {
				upvotes: 0,
				downvotes: 0
			};
			post.user = dummy_user;			

			// Push to the server
			var req = $http.post('/api/post', post);
			req.success(function (data, status, headers, config){
				
				// Push to the list
				$scope.posts.push(data);
			});
			req.error(function (data, status, headers, config){
				console.log(data);
			});

			// Clean up
			post = {};
		};

		this.upvote = function (post){
			if(!post.score.upvotes) post.score.upvotes = 0;
			post.score.upvotes++;
			$http.put('/api/post/' + post._id + '/upvote', post);
		};

		this.downvote = function (post){
			if(!post.score.downvotes) post.score.downvotes = 0;
			post.score.downvotes++;
			$http.put('/api/post/' + post._id + '/downvote', post);
		};

		this.delete = function (post){
			$http.delete('/api/post/' + post._id);
			$scope.posts.splice($scope.posts.indexOf(post), 1);
		}

		this.edit = function (post){
			addPost.post.title = post.title;
			console.log(addPost);
		}

	}]);

	// Save new post
	app.controller('FormController', ['$http', function ($http){
		this.post = {};
		
		this.submit = function (postCtrl){
			
		}
	}]);
}();
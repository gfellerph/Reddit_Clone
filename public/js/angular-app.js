+function(){

	var app = angular.module('reddit', []);

	// Dummy data for user
	var dummy_user = { name: 'Philipp', joined: Date.now() };

	// Get the post list from the server
	app.controller('PostController', ['$http', function($http){

		var $this = this;
		$this.posts = {};

		var req = $http.get('/api/posts');
		req.success(function (data, status, headers, config){
			$this.posts = data;
		});
		req.error(function (data, status, headers, config){
			console.log(data);
		});
	}]);

	// Save new post
	app.controller('FormController', ['$http', function($http){
		this.post = {};
		
		this.submit = function (postCtrl){
			this.post.posted = Date.now();
			this.post.score = {
				upvotes: 0,
				downvotes: 0
			};
			this.post.user = dummy_user;
			this.post.image = '/gfx/footer.jpg';
			
			// Push to the list
			postCtrl.posts.push(this.post);

			// Push to the server
			var req = $http.post('/api/post', this.post);
			req.success(function (data, status, headers, config){
				console.log(data);
			});
			req.error(function (data, status, headers, config){
				console.log(data);
			});

			// Clean up
			this.post = {};
		}
	}]);
}();
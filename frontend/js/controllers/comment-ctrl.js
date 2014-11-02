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
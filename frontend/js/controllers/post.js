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
					$scope.post.votes = post.votes;
				})
				.error ( function (err) {
					//console.log(err);
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
					//console.log(err);
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
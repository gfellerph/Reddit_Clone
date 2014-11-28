// Requires
var Comment = require('../models/comment');

module.exports = [
	'$scope',
	'$http',
	'$routeParams',
	function ($scope, $http, $routeParams) {

		//=======
		// Upvote
		//=======
		
		$scope.upvoteComment = function () {
			var id = $scope.comment._id;

			$http.put('/api/comment/' + id + '/upvote/', $scope.comment)
			.success ( function (comment) {
				$scope.comment.votes = comment.votes;
			})
			.error ( function (err) {
				console.log(err);
			});
		}


		//=========
		// Downvote
		//=========
		
		$scope.downvoteComment = function () {

			var id = $scope.comment._id;

			$http.put('/api/comment/' + id + '/downvote/', $scope.comment)
			.success ( function (comment) {
				$scope.comment.votes = comment.votes;
			})
			.error ( function (err) {
				console.log(err);
			});
		}

		$scope.score = function () {

			var score = 0;

			if(!$scope.comment.votes) return score;

			for (var i = 0; i < $scope.comment.votes.length; i++) {
				score += $scope.comment.votes[i].vote;
			}
			
			return score;
		}

		$scope.hasUpvoted = function () {

			if(!$scope.comment || !$scope.$root.user || !$scope.comment.votes) return false;

			var comment = $scope.comment;
			var userId = $scope.$root.user._id;
			var upvoted = false;

			for (var i = 0; i < comment.votes.length; i++) {
				if(comment.votes[i].userId == userId && comment.votes[i].vote == 1) upvoted = true;
			}

			return upvoted;
		}

		$scope.hasDownvoted = function () {

			if(!$scope.comment || !$scope.$root.user || !$scope.comment.votes) return false;

			var comment = $scope.comment;
			var userId = $scope.$root.user._id;
			var downvoted = false;

			for (var i = 0; i < comment.votes.length; i++) {
				if(comment.votes[i].userId == userId && comment.votes[i].vote == -1) downvoted = true;
			}

			return downvoted;
		}
	}
];
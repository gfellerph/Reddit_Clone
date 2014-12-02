// Requires
var Comment = require('../models/comment');

module.exports = [
	'$scope',
	'$http',
	'$routeParams',
	'SocketIO',
	function ($scope, $http, $routeParams, SocketIO) {

console.log('detailview')
		//=======
		// Delete
		//=======

		$scope.deleteComment = function () {
			var id = $scope.comment._id;

			$http.delete('/api/comment/' + id)
			.success ( function (res){

			})
			.error ( function (err) {
				console.log(err);
			});
		}

		//=======
		// Upvote
		//=======
		
		$scope.upvoteComment = function () {
			var id = $scope.comment._id;

			$http.put('/api/comment/' + id + '/upvote/')
			.success ( function (comment) {
				
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

			$http.put('/api/comment/' + id + '/downvote/')
			.success ( function (comment) {
				
			})
			.error ( function (err) {
				console.log(err);
			});
		}

		// Calculate score
		$scope.score = function () {

			var score = 0;
			//console.log('score called ', $scope.comment);
			if(!$scope.comment.votes) return score;

			for (var i = 0; i < $scope.comment.votes.length; i++) {
				score += $scope.comment.votes[i].vote;
			}
			
			return score;
		}

		$scope.commentScore = $scope.score();
		// Check if user has already upvoted
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

		// Check if user has already downvoted
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

		// Check if user wrote this comment
		$scope.isCommentOwner = function () {
			if (!$scope.user) return false;
			return $scope.comment.user._id == $scope.user._id;
		}
	}
];
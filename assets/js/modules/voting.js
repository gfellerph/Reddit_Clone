+function($){

	$(document).on('click', '.upvote', upvote);
	$(document).on('click', '.downvote', downvote);

	function upvote(e){

		e.preventDefault();

		// Get the data object (post) from the parent <li>
		var $target = $(e.currentTarget);
		var $post = $target.parents('.post');
		var $score = $post.find('.score');
		var postObject = $post.data('post');
		var n = 1;

		// If already downvoted, correct downvote and upvote
		if(postObject.downvoted){
			n = 2;
			postObject.downs -= 1;
			postObject.downvoted = false;
		}

		// If already upvoted, leave
		if(postObject.upvoted) return false;

		postObject.upvoted = true;
		postObject.score += n;
		postObject.ups += 1;
		$score.html(postObject.score);

		return false;
	}

	function downvote(e){

		e.preventDefault();
		
		// Get the data object (post) from the parent <li>
		var $target = $(e.currentTarget);
		var $post = $target.parents('.post');
		var $score = $post.find('.score');
		var postObject = $post.data('post');
		var n = -1;

		// If already upvoted, correct upvote and downvote
		if(postObject.upvoted){
			n = -2;
			postObject.ups -= 1;
			postObject.upvoted = false;
		}

		// If already downvoted, leave
		if(postObject.downvoted) return false;

		postObject.downvoted = true;
		postObject.score += n;
		postObject.downs += 1;
		$score.html(postObject.score);

		return false;
	}
}(require('../vendor/jquery'));
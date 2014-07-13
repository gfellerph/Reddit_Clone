+function($){

	$(document).on('click', '.upvote', upvote);
	$(document).on('click', '.downvote', downvote);

	function upvote(e){

		// Get the data object (post) from the parent <li>
		var $target = $(e.currentTarget);
		var $post = $target.parents('.post');
		var $score = $post.find('.score');
		var postObject = $post.data('post');

		postObject.score += 1;
		postObject.ups += 1;
		$score.html(postObject.score);

		e.preventDefault();
		return false;
	}

	function downvote(e){
		
		// Get the data object (post) from the parent <li>
		var $target = $(e.currentTarget);
		var $post = $target.parents('.post');
		var $score = $post.find('.score');
		var postObject = $post.data('post');

		postObject.score -= 1;
		postObject.downs -= 1;
		$score.html(postObject.score);

		e.preventDefault();
		return false;
	}
}(require('../vendor/jquery'));
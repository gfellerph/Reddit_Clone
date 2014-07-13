+function($){

	$(document).on('click', '.upvote', upvote);
	$(document).on('click', '.downvote', downvote);

	function upvote(e){
		vote(1, $(e.currentTarget));

		e.preventDefault();
		return false;
	}

	function downvote(e){
		vote(-1, $(e.currentTarget));

		e.preventDefault();
		return false;
	}

	function vote(n, target){

		// Get the data object (post) from the parent <li>
		var $post = target.parents('.post');
		var $score = $post.find('.score');
		var postObject = $post.data('post');

		postObject.score += n;
		$score.html(postObject.score);
	}
}(require('../vendor/jquery'));
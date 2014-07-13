+function($, Post){

	$(document).on('click', '#new-post .submit-post', addPost);

	function addPost(e){

		var $form = $('#new-post');
		var $container = $('#posts');
		var $url = $form.find('#post-url');
		var $title = $form.find('#post-title');
		var $rules = $form.find('#post-rules');

		// Error handling

		// Create new post object and pass options
		var post = new Post({
			url: $url.val(),
			title: $title.val()
		});

		// Add post to the list
		$container.prepend(post.html());

		e.preventDefault(); // Prevent page reload on dumb browsers
		return false; // Prevent page reload on very dumb browsers
	}
}(
	require('../vendor/jquery'), 
	require('./post')
);
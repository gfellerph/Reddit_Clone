+function($, Post){

	$(document).on('click', '#new-post .submit-post', addPost);

	function addPost(e){

		e.preventDefault(); // Prevent page reload on dumb browsers

		var $form = $('#new-post');
		var $container = $('#posts');
		var $url = $form.find('#post-url');
		var $title = $form.find('#post-title');
		var $rules = $form.find('#post-rules');

		// Error handling
		if(UrlExists($url.val())){ console.warn('URL does not exist'); return false; }

		// Create new post object and pass options
		var post = new Post({
			url: $url.val(),
			title: $title.val()
		});

		// Add post to the list
		$container.prepend(post.html());

		return false; // Prevent page reload on very dumb browsers
	}

	function UrlExists(url, callback)
	{
	    var http = new XMLHttpRequest();
	    http.open('HEAD', url, false);
	    http.send();
	    return http.status!=404;
	}
}(
	require('../vendor/jquery'), 
	require('./post')
);
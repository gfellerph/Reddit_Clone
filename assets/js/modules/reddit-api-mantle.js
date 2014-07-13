+function($){

	// Load the post object
	var Post = require('./post');
	
	// Reddit API mantle
	$(function(){

		// Attach event handler to all elements with
		// data-subreddit="..." which loads latest
		// posts from this subreddit into #posts
		
		$(document).on('click', '[data-subreddit]', function(e){
			e.preventDefault();
			var subreddit = $(e.currentTarget).attr('data-subreddit');
			getPosts_from_subreddit(subreddit, insertPosts);
		});
	});

	function getPosts_from_subreddit(subreddit, callback){
		var url = "http://www.reddit.com/" + subreddit + ".json";
		$.getJSON(url).done( function(response){
			callback(response.data.children);
		}).fail( function(response){
			console.alert('getPosts_from_subreddit failed: ' + response);
		});
	}

	function insertPosts(posts){
		var $container = $('#posts');
		$container.find('li:not(.template)').remove();

		for(var i = 0; i < posts.length; i++){

			// Create new post object and pass
			// the JSON object from reddit as option
			var post = new Post(posts[i].data);

			// Add the post to the container
			$container.append(post.html());
		}
	}
	
}(require('../vendor/jquery'));
+function($){
	
	// Reddit API mantle
	$(function(){

		// Attach event handler to all elements with
		// data-subreddit="..." which loads latest
		// posts from this subreddit into #posts
		var elements = $('[data-subreddit]');
		
		elements.on('click', function(e){
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

	window.testReddit = getPosts_from_subreddit;

	function insertPosts(posts){
		
	}

	function normalizeThumbnail(thumb){
		if(thumb == 'self'){
			thumb = '/gfx/post.png';
		} else if(thumb == 'nsfw'){
			thumb = '/gfx/post.png';
		} else if(thumb == 'default'){
			thumb = '/gfx/post.png';
		}
		return thumb;
	}

	
}(require('../vendor/jquery'));
define(['jquery', 'masonry'], function ($){

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

	function insertPosts(posts){
		var container = $('#posts'),
			$template = container.find('.template');

		// Prepare
		container.find('article:not(.template)').remove();
		console.log(posts);

		// Loop through posts
		for(var i = 0; i < posts.length; i++){
			var $article = $template.clone(),
				$title = $article.find('.title'),
				$karma = $article.find('.karma'),
				$img = $article.find('.img'),
				$user = $article.find('.user'),
				$subreddit = $article.find('.subreddit'),
				$domain = $article.find('.domain'),
				$time = $article.find('.time'),
				$numOfComments = $article.find('.num-of-comments'),
				post = posts[i].data,
				templateType = 'text';

			// Normalize
			post.thumbnail = normalizeThumbnail(post.thumbnail);

			// Fill values
			$title.html(post.title);
			$title.attr('href', post.url);
			$user.html(post.author);
			$karma.html(post.score);
			$subreddit.html(post.domain);
			var d = new Date(post.created_utc);
			$time.html(d.toString('hh:mm dd.MM.yy'));
			$numOfComments.html(post.num_comments)
			if(isImageLink(post.url)){
				$img.attr('src', post.url);
				templateType = 'pic';
			} else {
				if(post.thumbnail){
					$img.attr('src', post.thumbnail);
					templateType = 'thumb';
				} else {
					templateType = 'text';
				}
			}
			$subreddit.html(post.subreddit);

			// Decide which template to use
			$article.addClass(templateType);

			// Append
			container.append($article);
			$article.removeClass('hidden template');
		}

		// Initialize masonry
		var masonry = new Masonry('#posts', {
			itemSelector: 'article',
			columnWidth: 200
		});
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

	function isImageLink(url){
		var imgTypes = ['.png', '.jpg', '.gif'],
			test = false;
		for(var i = 0; i < imgTypes.length; i++){
			if(url.endsWith(imgTypes[i])){ test = true; }
		}
		return test;
	}

	String.prototype.endsWith = function(suffix) {
	    return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};
});
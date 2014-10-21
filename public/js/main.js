(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

// Basic page functionality
require('./modules/tags'); 				// Toggle class on tag elements
require('./modules/expander'); 			// Show/hide the menu panels
require('./modules/reddit-api-mantle'); // Get data from reddit
require('./modules/add-post');			// Add a post with the form
require('./modules/voting');			// The voting logic
require('./modules/comments');			// Comment logic
},{"./modules/add-post":2,"./modules/comments":3,"./modules/expander":4,"./modules/reddit-api-mantle":6,"./modules/tags":7,"./modules/voting":8}],2:[function(require,module,exports){
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
	jQuery, 
	require('./post')
);
},{"./post":5}],3:[function(require,module,exports){
// +function($){} (require('../vendor/jquery'));
// Diese Notation ist wegen dem Punkt in der Bewertung:
// - jQuery so genutzt, dass es zu keinem Konflikt mit andern Frameworks kommt

// Es ist eine Funktion, die sich wegen den () Klammern am Schluss selbst ausführt.
// Der Funktion kann $ als Attribut übergeben werden, dort wird natürlich jQuery erwartet.

// Die Anweisung require('../vendor/jquery') ist eine Funktion, die mit Browserify genutzt
// werden kann. Der Gulp Task 'browserify' nutzt das Browserify Modul um allen Javascript
// Code in ein File zu packen und stellt die require() Funktion zur Verfügung.

// Damit wird dann der jQuery Code aus dem File im Ordner js/vendor geholt (es ist das
// ganz normale jQuery 2.1.irgendwas) und der Funktion übergeben. So entstehen keine
// Verwechslungen, wenn die Variable $ bereits von irgend einem anderen Script gesetzt 
// worden ist.

// Innerhalb der selbstausführenden Funktion kann jQuery wie gewohnt genutzt werden und
// auch sonst Javascript Code geschrieben werden.

// Im File main.js steht die Anweisung require('./modules/comments.js'); Diese Anweisung
// sorgt dafür, dass der Code in diesem File in das durch Browserify kompilierte File
// eingefügt und bei laden des Scripts ausgeführt wird. Das kompilierte Javascript File
// wird im index.html ganz am Schluss eingefügt und liegt im Ordner /assets/builds/.

+function($){

    // add and delet comments for posts / links
    $(document).ready(function () {
        var commentTextBox = '<textarea class="textComment"></textarea>';
        var commentSubmit = '<button class="submitComment">Kommentar hinzufügen</button>';
        var commentContainer = '<ul class="comment-container"></ul>';
        var commentAdd = '<button class="commentBtn">Kommentar</button>';

        $(document).on('click', '.commentBtn', function (event) {
            var $element = $(event.currentTarget);
            var $parent = $element.parent();
            if($element.hasClass('active')){
                $parent.find('.textComment:first').remove();
                $parent.find('.submitComment:first').remove();
                $element.removeClass('active');

                
            } else {
                $element.after(commentTextBox + commentSubmit);
                $element.addClass('active');
            }
        });

        $(document).on('click', '.submitComment', function (event) {
        	var $element = $(event.currentTarget);
        	var $parent = $element.parent();
            var $ul = $parent.find('.comment-container:first');
            var $newCont = {};
            if($ul.length > 0){
            	$newCont = $ul;
            } else {
            	$newCont = $(commentContainer);
            	$parent.append($newCont);
            }

            $newCont.append('<li>' + $parent.find('.textComment:first').val() + '</li>');
            $newCont.append(commentAdd);
            $parent.find('.textComment').remove();
                $parent.find('.submitComment').remove();
                $parent.find('.commentBtn').removeClass('active');
        });
    });

}(jQuery);
},{}],4:[function(require,module,exports){
/* 
	Require jquery with the CommonJS pattern

	File is rendered on save with gulp.js and 
	the browserify node module.
*/

// Self executing closure function
+function expander($){

	// Live event binding
	$(document).on('click', '[data-expands]', expand);

	// Handler for the click event on a menu point with an expandable panel
	function expand(event){

		// Get the clicked menu point and all folders
		var $target = $(event.currentTarget);
		var	$expander = $('#expander');

		// Look for open panels
		if($expander.hasClass('open')){

			var ident = $expander.data('activePanel').attr('data-expandable');

			// If open panel == new panel, close the open panel
			if($target.attr('data-expands') == ident){
				hidePanel(ident);
			} else {

				// If new panel != old panel, close old panel and
				// in the callback, open the new panel
				$('[data-expands]').removeClass('active');
				hidePanel(
					$expander.data('openPanel'),
					showPanel($target.attr('data-expands'))
				);
			}

		} else {

			// If there are none, show the new panel
			showPanel($target.attr('data-expands'));
		}

		function showPanel(ident, callback){

			var $panel = $('[data-expandable="' + ident + '"]');
			var $button = $('[data-expands="' + ident + '"]');

			// Set expander height to panel height
			$expander.css({'height': $panel.outerHeight()});

			// Show the panel
			$panel.addClass('active');
			$button.addClass('active');

			// Register one event listener to catch transition end
			// with vendor prefixes.
			$expander.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {

				// Keep browsers accepting
				// prefixed and non-prefixed events from firing twice
    			$expander.unbind('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
    			
    			// Set height to auto and save the active panel
    			$expander.addClass('open');
    			$expander.data('activePanel', $panel);

			});

			// Execute callback, if there is any
			if(callback) return callback();
		}

		function hidePanel(ident, callback){

			var $panel = $('[data-expandable="' + ident + '"]');
			var $button = $('[data-expands="' + ident + '"]');

			// Remove the class open (no more height: auto !important)
			$expander.removeClass('open');
			$button.removeClass('active');

			// Set height to current height of the panel
			$expander.css({'height': $panel.outerHeight()});

			// Force rerendering of the expander
			// if not rerendered, transition will be
			// ignored
			$expander.hide().show();

			// Fade out the panel
			$panel.removeClass('active');

			// Animate with css transitions to 0 height
			$expander.css({'height': 0});

			// Remove openPanel from $expander
			$expander.data('activePanel', null);

			// Execute callback, if there is any
			if(callback) return callback();
		}
	}
}(jQuery);
},{}],5:[function(require,module,exports){
module.exports = function Post(options){

	// Unobtrusive jQuery
	var $ = jQuery;

	// Default options object with all the possible variables
	var DEFAULT = {
		created: new Date(),
		$template: $('#posts').find('.template'),
		score: 0,
		selftext: '',
		comments: null,
		url: ''
	}

	// Merge options
	if(typeof options == 'undefined') options = {};
	var o = $.extend({}, DEFAULT, options);
	var t = this;

	// Constructor
	this.url = o.url; // URL of the post
	this.title = o.title; // Title of the post
	this.selftext = o.selftext; // Text of the post
	this.created = o.created; // Time posted
	this.$template = o.$template; // The HTML Template to use
	this.$object = null; // The generated HTML post object reference
	this.score = o.score; // The score of the post
	this.$comments = o.$comments; // jQueried <ul class="comments"> element
	this.autor = o.autor; // Autor of the post
	this.domain = o.domain; // Host of the link
	this.permalink = o.permalink; // Permalink to the post on reddit
	this.subreddit = o.subreddit; // Subreddit the post is in
	this.id = o.id; // Post id
	this.thumbnail = o.thumbnail; // Thumbnail of the post
	this.downs = o.downs; // Number of downvotes
	this.ups = o.ups; // Number of upvotes
	this.num_comments = o.num_comments; // Number of comments
	this.kind = o.kind; // Post kind ('t3' for most posts)
	this.name = name(); // Kind and id of the post
	this.likes = o.likes; // How many likes the post has
	this.over_18 = o.over_18; // NSFW or SFW

	// Takes the template and the options and generates the HTML of the post
	function generatePost(){

		// Security checks
		if(!typeof t.$template == 'object') console.warn('Template must be an object');
		if(!t.$template instanceof $) console.warn('Template must be an jQuery object');

		// Clone the template and remove the class
		t.$object = t.$template.clone();
		t.$object.removeClass('template');

		var $title = t.$object.find('.title');
		var $text = t.$object.find('.text');
		var $created = t.$object.find('.created');
		var $score = t.$object.find('.score');
		var $autor = t.$object.find('.autor');
		var $thumbnail = t.$object.find('.thumbnail');

		// Fill HTML
		$title.html(t.title);
		$text.html(t.selftext);
		$created.html(t.created.toLocaleString());
		$score.html(t.score);
		$autor.html(t.autor);
		if(isImageURL(t.url)) $thumbnail.attr('src', t.url);
		if(t.selftext.length > 0) $text.html(t.selftext);

		// Save the post object to the data property of the html-element
		// for later use. It can be accessed from $('.post').data('post')
		t.$object.data('post', t);

		// Return the jQuery HTML object, so it can be appended to something
		return t.$object;
	}

	// Construct the name property of a post
	function name(){ return this.kind + '_' + this.id; }

	// Check if the URL points to an image resource
	function isImageURL(url){
		var imgTypes = ['.png', '.jpg', '.gif'],
			test = false;
		for(var i = 0; i < imgTypes.length; i++){
			if(url.endsWith(imgTypes[i])){ test = true; }
		}
		return test;
	}

	// Helper function to get filetype of a path/url
	String.prototype.endsWith = function(suffix) {
	    return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};

	return {
		log: function(){
			console.log(t);
		},
		html: generatePost
	}
}
},{}],6:[function(require,module,exports){
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
	
}(jQuery);
},{"./post":5}],7:[function(require,module,exports){
/* 
	Require jquery with the CommonJS pattern

	File is rendered on save with gulp.js and 
	the browserify node module.
*/

+function tags($){

	// Live event binding
	$(document).on('click', '.tag', tag_click);

	function tag_click(event){
		var $target = $(event.currentTarget);
		var dataGroup = $target.attr('data-group');

		// If tag is part of a data-group, reset its siblings
		if(dataGroup){
			var $group = $('[data-group="' + dataGroup + '"]');
			$group.removeClass('active');
		}

		$target.toggleClass('active');

		// Don't follow link or reload page
		event.preventDefault(); 
	}
}(jQuery);
},{}],8:[function(require,module,exports){
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
}(jQuery);
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxQcm9qZWt0ZVxcUmVkZGl0X0Nsb25lXFxmcm9udGVuZFxcYnVpbGRzeXN0ZW1cXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiZDovUHJvamVrdGUvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL21haW4uanMiLCJkOi9Qcm9qZWt0ZS9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvbW9kdWxlcy9hZGQtcG9zdC5qcyIsImQ6L1Byb2pla3RlL1JlZGRpdF9DbG9uZS9mcm9udGVuZC9qcy9tb2R1bGVzL2NvbW1lbnRzLmpzIiwiZDovUHJvamVrdGUvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL21vZHVsZXMvZXhwYW5kZXIuanMiLCJkOi9Qcm9qZWt0ZS9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvbW9kdWxlcy9wb3N0LmpzIiwiZDovUHJvamVrdGUvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL21vZHVsZXMvcmVkZGl0LWFwaS1tYW50bGUuanMiLCJkOi9Qcm9qZWt0ZS9SZWRkaXRfQ2xvbmUvZnJvbnRlbmQvanMvbW9kdWxlcy90YWdzLmpzIiwiZDovUHJvamVrdGUvUmVkZGl0X0Nsb25lL2Zyb250ZW5kL2pzL21vZHVsZXMvdm90aW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXHJcbi8vIEJhc2ljIHBhZ2UgZnVuY3Rpb25hbGl0eVxyXG5yZXF1aXJlKCcuL21vZHVsZXMvdGFncycpOyBcdFx0XHRcdC8vIFRvZ2dsZSBjbGFzcyBvbiB0YWcgZWxlbWVudHNcclxucmVxdWlyZSgnLi9tb2R1bGVzL2V4cGFuZGVyJyk7IFx0XHRcdC8vIFNob3cvaGlkZSB0aGUgbWVudSBwYW5lbHNcclxucmVxdWlyZSgnLi9tb2R1bGVzL3JlZGRpdC1hcGktbWFudGxlJyk7IC8vIEdldCBkYXRhIGZyb20gcmVkZGl0XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9hZGQtcG9zdCcpO1x0XHRcdC8vIEFkZCBhIHBvc3Qgd2l0aCB0aGUgZm9ybVxyXG5yZXF1aXJlKCcuL21vZHVsZXMvdm90aW5nJyk7XHRcdFx0Ly8gVGhlIHZvdGluZyBsb2dpY1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvY29tbWVudHMnKTtcdFx0XHQvLyBDb21tZW50IGxvZ2ljIiwiK2Z1bmN0aW9uKCQsIFBvc3Qpe1xyXG5cclxuXHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnI25ldy1wb3N0IC5zdWJtaXQtcG9zdCcsIGFkZFBvc3QpO1xyXG5cclxuXHRmdW5jdGlvbiBhZGRQb3N0KGUpe1xyXG5cclxuXHRcdGUucHJldmVudERlZmF1bHQoKTsgLy8gUHJldmVudCBwYWdlIHJlbG9hZCBvbiBkdW1iIGJyb3dzZXJzXHJcblxyXG5cdFx0dmFyICRmb3JtID0gJCgnI25ldy1wb3N0Jyk7XHJcblx0XHR2YXIgJGNvbnRhaW5lciA9ICQoJyNwb3N0cycpO1xyXG5cdFx0dmFyICR1cmwgPSAkZm9ybS5maW5kKCcjcG9zdC11cmwnKTtcclxuXHRcdHZhciAkdGl0bGUgPSAkZm9ybS5maW5kKCcjcG9zdC10aXRsZScpO1xyXG5cdFx0dmFyICRydWxlcyA9ICRmb3JtLmZpbmQoJyNwb3N0LXJ1bGVzJyk7XHJcblxyXG5cdFx0Ly8gRXJyb3IgaGFuZGxpbmdcclxuXHRcdGlmKFVybEV4aXN0cygkdXJsLnZhbCgpKSl7IGNvbnNvbGUud2FybignVVJMIGRvZXMgbm90IGV4aXN0Jyk7IHJldHVybiBmYWxzZTsgfVxyXG5cclxuXHRcdC8vIENyZWF0ZSBuZXcgcG9zdCBvYmplY3QgYW5kIHBhc3Mgb3B0aW9uc1xyXG5cdFx0dmFyIHBvc3QgPSBuZXcgUG9zdCh7XHJcblx0XHRcdHVybDogJHVybC52YWwoKSxcclxuXHRcdFx0dGl0bGU6ICR0aXRsZS52YWwoKVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gQWRkIHBvc3QgdG8gdGhlIGxpc3RcclxuXHRcdCRjb250YWluZXIucHJlcGVuZChwb3N0Lmh0bWwoKSk7XHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlOyAvLyBQcmV2ZW50IHBhZ2UgcmVsb2FkIG9uIHZlcnkgZHVtYiBicm93c2Vyc1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gVXJsRXhpc3RzKHVybCwgY2FsbGJhY2spXHJcblx0e1xyXG5cdCAgICB2YXIgaHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdCAgICBodHRwLm9wZW4oJ0hFQUQnLCB1cmwsIGZhbHNlKTtcclxuXHQgICAgaHR0cC5zZW5kKCk7XHJcblx0ICAgIHJldHVybiBodHRwLnN0YXR1cyE9NDA0O1xyXG5cdH1cclxufShcclxuXHRqUXVlcnksIFxyXG5cdHJlcXVpcmUoJy4vcG9zdCcpXHJcbik7IiwiLy8gK2Z1bmN0aW9uKCQpe30gKHJlcXVpcmUoJy4uL3ZlbmRvci9qcXVlcnknKSk7XHJcbi8vIERpZXNlIE5vdGF0aW9uIGlzdCB3ZWdlbiBkZW0gUHVua3QgaW4gZGVyIEJld2VydHVuZzpcclxuLy8gLSBqUXVlcnkgc28gZ2VudXR6dCwgZGFzcyBlcyB6dSBrZWluZW0gS29uZmxpa3QgbWl0IGFuZGVybiBGcmFtZXdvcmtzIGtvbW10XHJcblxyXG4vLyBFcyBpc3QgZWluZSBGdW5rdGlvbiwgZGllIHNpY2ggd2VnZW4gZGVuICgpIEtsYW1tZXJuIGFtIFNjaGx1c3Mgc2VsYnN0IGF1c2bDvGhydC5cclxuLy8gRGVyIEZ1bmt0aW9uIGthbm4gJCBhbHMgQXR0cmlidXQgw7xiZXJnZWJlbiB3ZXJkZW4sIGRvcnQgd2lyZCBuYXTDvHJsaWNoIGpRdWVyeSBlcndhcnRldC5cclxuXHJcbi8vIERpZSBBbndlaXN1bmcgcmVxdWlyZSgnLi4vdmVuZG9yL2pxdWVyeScpIGlzdCBlaW5lIEZ1bmt0aW9uLCBkaWUgbWl0IEJyb3dzZXJpZnkgZ2VudXR6dFxyXG4vLyB3ZXJkZW4ga2Fubi4gRGVyIEd1bHAgVGFzayAnYnJvd3NlcmlmeScgbnV0enQgZGFzIEJyb3dzZXJpZnkgTW9kdWwgdW0gYWxsZW4gSmF2YXNjcmlwdFxyXG4vLyBDb2RlIGluIGVpbiBGaWxlIHp1IHBhY2tlbiB1bmQgc3RlbGx0IGRpZSByZXF1aXJlKCkgRnVua3Rpb24genVyIFZlcmbDvGd1bmcuXHJcblxyXG4vLyBEYW1pdCB3aXJkIGRhbm4gZGVyIGpRdWVyeSBDb2RlIGF1cyBkZW0gRmlsZSBpbSBPcmRuZXIganMvdmVuZG9yIGdlaG9sdCAoZXMgaXN0IGRhc1xyXG4vLyBnYW56IG5vcm1hbGUgalF1ZXJ5IDIuMS5pcmdlbmR3YXMpIHVuZCBkZXIgRnVua3Rpb24gw7xiZXJnZWJlbi4gU28gZW50c3RlaGVuIGtlaW5lXHJcbi8vIFZlcndlY2hzbHVuZ2VuLCB3ZW5uIGRpZSBWYXJpYWJsZSAkIGJlcmVpdHMgdm9uIGlyZ2VuZCBlaW5lbSBhbmRlcmVuIFNjcmlwdCBnZXNldHp0IFxyXG4vLyB3b3JkZW4gaXN0LlxyXG5cclxuLy8gSW5uZXJoYWxiIGRlciBzZWxic3RhdXNmw7xocmVuZGVuIEZ1bmt0aW9uIGthbm4galF1ZXJ5IHdpZSBnZXdvaG50IGdlbnV0enQgd2VyZGVuIHVuZFxyXG4vLyBhdWNoIHNvbnN0IEphdmFzY3JpcHQgQ29kZSBnZXNjaHJpZWJlbiB3ZXJkZW4uXHJcblxyXG4vLyBJbSBGaWxlIG1haW4uanMgc3RlaHQgZGllIEFud2Vpc3VuZyByZXF1aXJlKCcuL21vZHVsZXMvY29tbWVudHMuanMnKTsgRGllc2UgQW53ZWlzdW5nXHJcbi8vIHNvcmd0IGRhZsO8ciwgZGFzcyBkZXIgQ29kZSBpbiBkaWVzZW0gRmlsZSBpbiBkYXMgZHVyY2ggQnJvd3NlcmlmeSBrb21waWxpZXJ0ZSBGaWxlXHJcbi8vIGVpbmdlZsO8Z3QgdW5kIGJlaSBsYWRlbiBkZXMgU2NyaXB0cyBhdXNnZWbDvGhydCB3aXJkLiBEYXMga29tcGlsaWVydGUgSmF2YXNjcmlwdCBGaWxlXHJcbi8vIHdpcmQgaW0gaW5kZXguaHRtbCBnYW56IGFtIFNjaGx1c3MgZWluZ2Vmw7xndCB1bmQgbGllZ3QgaW0gT3JkbmVyIC9hc3NldHMvYnVpbGRzLy5cclxuXHJcbitmdW5jdGlvbigkKXtcclxuXHJcbiAgICAvLyBhZGQgYW5kIGRlbGV0IGNvbW1lbnRzIGZvciBwb3N0cyAvIGxpbmtzXHJcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGNvbW1lbnRUZXh0Qm94ID0gJzx0ZXh0YXJlYSBjbGFzcz1cInRleHRDb21tZW50XCI+PC90ZXh0YXJlYT4nO1xyXG4gICAgICAgIHZhciBjb21tZW50U3VibWl0ID0gJzxidXR0b24gY2xhc3M9XCJzdWJtaXRDb21tZW50XCI+S29tbWVudGFyIGhpbnp1ZsO8Z2VuPC9idXR0b24+JztcclxuICAgICAgICB2YXIgY29tbWVudENvbnRhaW5lciA9ICc8dWwgY2xhc3M9XCJjb21tZW50LWNvbnRhaW5lclwiPjwvdWw+JztcclxuICAgICAgICB2YXIgY29tbWVudEFkZCA9ICc8YnV0dG9uIGNsYXNzPVwiY29tbWVudEJ0blwiPktvbW1lbnRhcjwvYnV0dG9uPic7XHJcblxyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuY29tbWVudEJ0bicsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICB2YXIgJGVsZW1lbnQgPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xyXG4gICAgICAgICAgICB2YXIgJHBhcmVudCA9ICRlbGVtZW50LnBhcmVudCgpO1xyXG4gICAgICAgICAgICBpZigkZWxlbWVudC5oYXNDbGFzcygnYWN0aXZlJykpe1xyXG4gICAgICAgICAgICAgICAgJHBhcmVudC5maW5kKCcudGV4dENvbW1lbnQ6Zmlyc3QnKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICRwYXJlbnQuZmluZCgnLnN1Ym1pdENvbW1lbnQ6Zmlyc3QnKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICRlbGVtZW50LnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRlbGVtZW50LmFmdGVyKGNvbW1lbnRUZXh0Qm94ICsgY29tbWVudFN1Ym1pdCk7XHJcbiAgICAgICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5zdWJtaXRDb21tZW50JywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgXHR2YXIgJGVsZW1lbnQgPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xyXG4gICAgICAgIFx0dmFyICRwYXJlbnQgPSAkZWxlbWVudC5wYXJlbnQoKTtcclxuICAgICAgICAgICAgdmFyICR1bCA9ICRwYXJlbnQuZmluZCgnLmNvbW1lbnQtY29udGFpbmVyOmZpcnN0Jyk7XHJcbiAgICAgICAgICAgIHZhciAkbmV3Q29udCA9IHt9O1xyXG4gICAgICAgICAgICBpZigkdWwubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgIFx0JG5ld0NvbnQgPSAkdWw7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIFx0JG5ld0NvbnQgPSAkKGNvbW1lbnRDb250YWluZXIpO1xyXG4gICAgICAgICAgICBcdCRwYXJlbnQuYXBwZW5kKCRuZXdDb250KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJG5ld0NvbnQuYXBwZW5kKCc8bGk+JyArICRwYXJlbnQuZmluZCgnLnRleHRDb21tZW50OmZpcnN0JykudmFsKCkgKyAnPC9saT4nKTtcclxuICAgICAgICAgICAgJG5ld0NvbnQuYXBwZW5kKGNvbW1lbnRBZGQpO1xyXG4gICAgICAgICAgICAkcGFyZW50LmZpbmQoJy50ZXh0Q29tbWVudCcpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgJHBhcmVudC5maW5kKCcuc3VibWl0Q29tbWVudCcpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgJHBhcmVudC5maW5kKCcuY29tbWVudEJ0bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxufShqUXVlcnkpOyIsIi8qIFxyXG5cdFJlcXVpcmUganF1ZXJ5IHdpdGggdGhlIENvbW1vbkpTIHBhdHRlcm5cclxuXHJcblx0RmlsZSBpcyByZW5kZXJlZCBvbiBzYXZlIHdpdGggZ3VscC5qcyBhbmQgXHJcblx0dGhlIGJyb3dzZXJpZnkgbm9kZSBtb2R1bGUuXHJcbiovXHJcblxyXG4vLyBTZWxmIGV4ZWN1dGluZyBjbG9zdXJlIGZ1bmN0aW9uXHJcbitmdW5jdGlvbiBleHBhbmRlcigkKXtcclxuXHJcblx0Ly8gTGl2ZSBldmVudCBiaW5kaW5nXHJcblx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJ1tkYXRhLWV4cGFuZHNdJywgZXhwYW5kKTtcclxuXHJcblx0Ly8gSGFuZGxlciBmb3IgdGhlIGNsaWNrIGV2ZW50IG9uIGEgbWVudSBwb2ludCB3aXRoIGFuIGV4cGFuZGFibGUgcGFuZWxcclxuXHRmdW5jdGlvbiBleHBhbmQoZXZlbnQpe1xyXG5cclxuXHRcdC8vIEdldCB0aGUgY2xpY2tlZCBtZW51IHBvaW50IGFuZCBhbGwgZm9sZGVyc1xyXG5cdFx0dmFyICR0YXJnZXQgPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xyXG5cdFx0dmFyXHQkZXhwYW5kZXIgPSAkKCcjZXhwYW5kZXInKTtcclxuXHJcblx0XHQvLyBMb29rIGZvciBvcGVuIHBhbmVsc1xyXG5cdFx0aWYoJGV4cGFuZGVyLmhhc0NsYXNzKCdvcGVuJykpe1xyXG5cclxuXHRcdFx0dmFyIGlkZW50ID0gJGV4cGFuZGVyLmRhdGEoJ2FjdGl2ZVBhbmVsJykuYXR0cignZGF0YS1leHBhbmRhYmxlJyk7XHJcblxyXG5cdFx0XHQvLyBJZiBvcGVuIHBhbmVsID09IG5ldyBwYW5lbCwgY2xvc2UgdGhlIG9wZW4gcGFuZWxcclxuXHRcdFx0aWYoJHRhcmdldC5hdHRyKCdkYXRhLWV4cGFuZHMnKSA9PSBpZGVudCl7XHJcblx0XHRcdFx0aGlkZVBhbmVsKGlkZW50KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0Ly8gSWYgbmV3IHBhbmVsICE9IG9sZCBwYW5lbCwgY2xvc2Ugb2xkIHBhbmVsIGFuZFxyXG5cdFx0XHRcdC8vIGluIHRoZSBjYWxsYmFjaywgb3BlbiB0aGUgbmV3IHBhbmVsXHJcblx0XHRcdFx0JCgnW2RhdGEtZXhwYW5kc10nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdFx0aGlkZVBhbmVsKFxyXG5cdFx0XHRcdFx0JGV4cGFuZGVyLmRhdGEoJ29wZW5QYW5lbCcpLFxyXG5cdFx0XHRcdFx0c2hvd1BhbmVsKCR0YXJnZXQuYXR0cignZGF0YS1leHBhbmRzJykpXHJcblx0XHRcdFx0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHQvLyBJZiB0aGVyZSBhcmUgbm9uZSwgc2hvdyB0aGUgbmV3IHBhbmVsXHJcblx0XHRcdHNob3dQYW5lbCgkdGFyZ2V0LmF0dHIoJ2RhdGEtZXhwYW5kcycpKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBzaG93UGFuZWwoaWRlbnQsIGNhbGxiYWNrKXtcclxuXHJcblx0XHRcdHZhciAkcGFuZWwgPSAkKCdbZGF0YS1leHBhbmRhYmxlPVwiJyArIGlkZW50ICsgJ1wiXScpO1xyXG5cdFx0XHR2YXIgJGJ1dHRvbiA9ICQoJ1tkYXRhLWV4cGFuZHM9XCInICsgaWRlbnQgKyAnXCJdJyk7XHJcblxyXG5cdFx0XHQvLyBTZXQgZXhwYW5kZXIgaGVpZ2h0IHRvIHBhbmVsIGhlaWdodFxyXG5cdFx0XHQkZXhwYW5kZXIuY3NzKHsnaGVpZ2h0JzogJHBhbmVsLm91dGVySGVpZ2h0KCl9KTtcclxuXHJcblx0XHRcdC8vIFNob3cgdGhlIHBhbmVsXHJcblx0XHRcdCRwYW5lbC5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdCRidXR0b24uYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuXHRcdFx0Ly8gUmVnaXN0ZXIgb25lIGV2ZW50IGxpc3RlbmVyIHRvIGNhdGNoIHRyYW5zaXRpb24gZW5kXHJcblx0XHRcdC8vIHdpdGggdmVuZG9yIHByZWZpeGVzLlxyXG5cdFx0XHQkZXhwYW5kZXIub25lKCd3ZWJraXRUcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kIG9UcmFuc2l0aW9uRW5kIG1zVHJhbnNpdGlvbkVuZCB0cmFuc2l0aW9uZW5kJywgZnVuY3Rpb24oZSkge1xyXG5cclxuXHRcdFx0XHQvLyBLZWVwIGJyb3dzZXJzIGFjY2VwdGluZ1xyXG5cdFx0XHRcdC8vIHByZWZpeGVkIGFuZCBub24tcHJlZml4ZWQgZXZlbnRzIGZyb20gZmlyaW5nIHR3aWNlXHJcbiAgICBcdFx0XHQkZXhwYW5kZXIudW5iaW5kKCd3ZWJraXRUcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kIG9UcmFuc2l0aW9uRW5kIG1zVHJhbnNpdGlvbkVuZCB0cmFuc2l0aW9uZW5kJyk7XHJcbiAgICBcdFx0XHRcclxuICAgIFx0XHRcdC8vIFNldCBoZWlnaHQgdG8gYXV0byBhbmQgc2F2ZSB0aGUgYWN0aXZlIHBhbmVsXHJcbiAgICBcdFx0XHQkZXhwYW5kZXIuYWRkQ2xhc3MoJ29wZW4nKTtcclxuICAgIFx0XHRcdCRleHBhbmRlci5kYXRhKCdhY3RpdmVQYW5lbCcsICRwYW5lbCk7XHJcblxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIEV4ZWN1dGUgY2FsbGJhY2ssIGlmIHRoZXJlIGlzIGFueVxyXG5cdFx0XHRpZihjYWxsYmFjaykgcmV0dXJuIGNhbGxiYWNrKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gaGlkZVBhbmVsKGlkZW50LCBjYWxsYmFjayl7XHJcblxyXG5cdFx0XHR2YXIgJHBhbmVsID0gJCgnW2RhdGEtZXhwYW5kYWJsZT1cIicgKyBpZGVudCArICdcIl0nKTtcclxuXHRcdFx0dmFyICRidXR0b24gPSAkKCdbZGF0YS1leHBhbmRzPVwiJyArIGlkZW50ICsgJ1wiXScpO1xyXG5cclxuXHRcdFx0Ly8gUmVtb3ZlIHRoZSBjbGFzcyBvcGVuIChubyBtb3JlIGhlaWdodDogYXV0byAhaW1wb3J0YW50KVxyXG5cdFx0XHQkZXhwYW5kZXIucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuXHRcdFx0JGJ1dHRvbi5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0XHQvLyBTZXQgaGVpZ2h0IHRvIGN1cnJlbnQgaGVpZ2h0IG9mIHRoZSBwYW5lbFxyXG5cdFx0XHQkZXhwYW5kZXIuY3NzKHsnaGVpZ2h0JzogJHBhbmVsLm91dGVySGVpZ2h0KCl9KTtcclxuXHJcblx0XHRcdC8vIEZvcmNlIHJlcmVuZGVyaW5nIG9mIHRoZSBleHBhbmRlclxyXG5cdFx0XHQvLyBpZiBub3QgcmVyZW5kZXJlZCwgdHJhbnNpdGlvbiB3aWxsIGJlXHJcblx0XHRcdC8vIGlnbm9yZWRcclxuXHRcdFx0JGV4cGFuZGVyLmhpZGUoKS5zaG93KCk7XHJcblxyXG5cdFx0XHQvLyBGYWRlIG91dCB0aGUgcGFuZWxcclxuXHRcdFx0JHBhbmVsLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHJcblx0XHRcdC8vIEFuaW1hdGUgd2l0aCBjc3MgdHJhbnNpdGlvbnMgdG8gMCBoZWlnaHRcclxuXHRcdFx0JGV4cGFuZGVyLmNzcyh7J2hlaWdodCc6IDB9KTtcclxuXHJcblx0XHRcdC8vIFJlbW92ZSBvcGVuUGFuZWwgZnJvbSAkZXhwYW5kZXJcclxuXHRcdFx0JGV4cGFuZGVyLmRhdGEoJ2FjdGl2ZVBhbmVsJywgbnVsbCk7XHJcblxyXG5cdFx0XHQvLyBFeGVjdXRlIGNhbGxiYWNrLCBpZiB0aGVyZSBpcyBhbnlcclxuXHRcdFx0aWYoY2FsbGJhY2spIHJldHVybiBjYWxsYmFjaygpO1xyXG5cdFx0fVxyXG5cdH1cclxufShqUXVlcnkpOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gUG9zdChvcHRpb25zKXtcclxuXHJcblx0Ly8gVW5vYnRydXNpdmUgalF1ZXJ5XHJcblx0dmFyICQgPSBqUXVlcnk7XHJcblxyXG5cdC8vIERlZmF1bHQgb3B0aW9ucyBvYmplY3Qgd2l0aCBhbGwgdGhlIHBvc3NpYmxlIHZhcmlhYmxlc1xyXG5cdHZhciBERUZBVUxUID0ge1xyXG5cdFx0Y3JlYXRlZDogbmV3IERhdGUoKSxcclxuXHRcdCR0ZW1wbGF0ZTogJCgnI3Bvc3RzJykuZmluZCgnLnRlbXBsYXRlJyksXHJcblx0XHRzY29yZTogMCxcclxuXHRcdHNlbGZ0ZXh0OiAnJyxcclxuXHRcdGNvbW1lbnRzOiBudWxsLFxyXG5cdFx0dXJsOiAnJ1xyXG5cdH1cclxuXHJcblx0Ly8gTWVyZ2Ugb3B0aW9uc1xyXG5cdGlmKHR5cGVvZiBvcHRpb25zID09ICd1bmRlZmluZWQnKSBvcHRpb25zID0ge307XHJcblx0dmFyIG8gPSAkLmV4dGVuZCh7fSwgREVGQVVMVCwgb3B0aW9ucyk7XHJcblx0dmFyIHQgPSB0aGlzO1xyXG5cclxuXHQvLyBDb25zdHJ1Y3RvclxyXG5cdHRoaXMudXJsID0gby51cmw7IC8vIFVSTCBvZiB0aGUgcG9zdFxyXG5cdHRoaXMudGl0bGUgPSBvLnRpdGxlOyAvLyBUaXRsZSBvZiB0aGUgcG9zdFxyXG5cdHRoaXMuc2VsZnRleHQgPSBvLnNlbGZ0ZXh0OyAvLyBUZXh0IG9mIHRoZSBwb3N0XHJcblx0dGhpcy5jcmVhdGVkID0gby5jcmVhdGVkOyAvLyBUaW1lIHBvc3RlZFxyXG5cdHRoaXMuJHRlbXBsYXRlID0gby4kdGVtcGxhdGU7IC8vIFRoZSBIVE1MIFRlbXBsYXRlIHRvIHVzZVxyXG5cdHRoaXMuJG9iamVjdCA9IG51bGw7IC8vIFRoZSBnZW5lcmF0ZWQgSFRNTCBwb3N0IG9iamVjdCByZWZlcmVuY2VcclxuXHR0aGlzLnNjb3JlID0gby5zY29yZTsgLy8gVGhlIHNjb3JlIG9mIHRoZSBwb3N0XHJcblx0dGhpcy4kY29tbWVudHMgPSBvLiRjb21tZW50czsgLy8galF1ZXJpZWQgPHVsIGNsYXNzPVwiY29tbWVudHNcIj4gZWxlbWVudFxyXG5cdHRoaXMuYXV0b3IgPSBvLmF1dG9yOyAvLyBBdXRvciBvZiB0aGUgcG9zdFxyXG5cdHRoaXMuZG9tYWluID0gby5kb21haW47IC8vIEhvc3Qgb2YgdGhlIGxpbmtcclxuXHR0aGlzLnBlcm1hbGluayA9IG8ucGVybWFsaW5rOyAvLyBQZXJtYWxpbmsgdG8gdGhlIHBvc3Qgb24gcmVkZGl0XHJcblx0dGhpcy5zdWJyZWRkaXQgPSBvLnN1YnJlZGRpdDsgLy8gU3VicmVkZGl0IHRoZSBwb3N0IGlzIGluXHJcblx0dGhpcy5pZCA9IG8uaWQ7IC8vIFBvc3QgaWRcclxuXHR0aGlzLnRodW1ibmFpbCA9IG8udGh1bWJuYWlsOyAvLyBUaHVtYm5haWwgb2YgdGhlIHBvc3RcclxuXHR0aGlzLmRvd25zID0gby5kb3duczsgLy8gTnVtYmVyIG9mIGRvd252b3Rlc1xyXG5cdHRoaXMudXBzID0gby51cHM7IC8vIE51bWJlciBvZiB1cHZvdGVzXHJcblx0dGhpcy5udW1fY29tbWVudHMgPSBvLm51bV9jb21tZW50czsgLy8gTnVtYmVyIG9mIGNvbW1lbnRzXHJcblx0dGhpcy5raW5kID0gby5raW5kOyAvLyBQb3N0IGtpbmQgKCd0MycgZm9yIG1vc3QgcG9zdHMpXHJcblx0dGhpcy5uYW1lID0gbmFtZSgpOyAvLyBLaW5kIGFuZCBpZCBvZiB0aGUgcG9zdFxyXG5cdHRoaXMubGlrZXMgPSBvLmxpa2VzOyAvLyBIb3cgbWFueSBsaWtlcyB0aGUgcG9zdCBoYXNcclxuXHR0aGlzLm92ZXJfMTggPSBvLm92ZXJfMTg7IC8vIE5TRlcgb3IgU0ZXXHJcblxyXG5cdC8vIFRha2VzIHRoZSB0ZW1wbGF0ZSBhbmQgdGhlIG9wdGlvbnMgYW5kIGdlbmVyYXRlcyB0aGUgSFRNTCBvZiB0aGUgcG9zdFxyXG5cdGZ1bmN0aW9uIGdlbmVyYXRlUG9zdCgpe1xyXG5cclxuXHRcdC8vIFNlY3VyaXR5IGNoZWNrc1xyXG5cdFx0aWYoIXR5cGVvZiB0LiR0ZW1wbGF0ZSA9PSAnb2JqZWN0JykgY29uc29sZS53YXJuKCdUZW1wbGF0ZSBtdXN0IGJlIGFuIG9iamVjdCcpO1xyXG5cdFx0aWYoIXQuJHRlbXBsYXRlIGluc3RhbmNlb2YgJCkgY29uc29sZS53YXJuKCdUZW1wbGF0ZSBtdXN0IGJlIGFuIGpRdWVyeSBvYmplY3QnKTtcclxuXHJcblx0XHQvLyBDbG9uZSB0aGUgdGVtcGxhdGUgYW5kIHJlbW92ZSB0aGUgY2xhc3NcclxuXHRcdHQuJG9iamVjdCA9IHQuJHRlbXBsYXRlLmNsb25lKCk7XHJcblx0XHR0LiRvYmplY3QucmVtb3ZlQ2xhc3MoJ3RlbXBsYXRlJyk7XHJcblxyXG5cdFx0dmFyICR0aXRsZSA9IHQuJG9iamVjdC5maW5kKCcudGl0bGUnKTtcclxuXHRcdHZhciAkdGV4dCA9IHQuJG9iamVjdC5maW5kKCcudGV4dCcpO1xyXG5cdFx0dmFyICRjcmVhdGVkID0gdC4kb2JqZWN0LmZpbmQoJy5jcmVhdGVkJyk7XHJcblx0XHR2YXIgJHNjb3JlID0gdC4kb2JqZWN0LmZpbmQoJy5zY29yZScpO1xyXG5cdFx0dmFyICRhdXRvciA9IHQuJG9iamVjdC5maW5kKCcuYXV0b3InKTtcclxuXHRcdHZhciAkdGh1bWJuYWlsID0gdC4kb2JqZWN0LmZpbmQoJy50aHVtYm5haWwnKTtcclxuXHJcblx0XHQvLyBGaWxsIEhUTUxcclxuXHRcdCR0aXRsZS5odG1sKHQudGl0bGUpO1xyXG5cdFx0JHRleHQuaHRtbCh0LnNlbGZ0ZXh0KTtcclxuXHRcdCRjcmVhdGVkLmh0bWwodC5jcmVhdGVkLnRvTG9jYWxlU3RyaW5nKCkpO1xyXG5cdFx0JHNjb3JlLmh0bWwodC5zY29yZSk7XHJcblx0XHQkYXV0b3IuaHRtbCh0LmF1dG9yKTtcclxuXHRcdGlmKGlzSW1hZ2VVUkwodC51cmwpKSAkdGh1bWJuYWlsLmF0dHIoJ3NyYycsIHQudXJsKTtcclxuXHRcdGlmKHQuc2VsZnRleHQubGVuZ3RoID4gMCkgJHRleHQuaHRtbCh0LnNlbGZ0ZXh0KTtcclxuXHJcblx0XHQvLyBTYXZlIHRoZSBwb3N0IG9iamVjdCB0byB0aGUgZGF0YSBwcm9wZXJ0eSBvZiB0aGUgaHRtbC1lbGVtZW50XHJcblx0XHQvLyBmb3IgbGF0ZXIgdXNlLiBJdCBjYW4gYmUgYWNjZXNzZWQgZnJvbSAkKCcucG9zdCcpLmRhdGEoJ3Bvc3QnKVxyXG5cdFx0dC4kb2JqZWN0LmRhdGEoJ3Bvc3QnLCB0KTtcclxuXHJcblx0XHQvLyBSZXR1cm4gdGhlIGpRdWVyeSBIVE1MIG9iamVjdCwgc28gaXQgY2FuIGJlIGFwcGVuZGVkIHRvIHNvbWV0aGluZ1xyXG5cdFx0cmV0dXJuIHQuJG9iamVjdDtcclxuXHR9XHJcblxyXG5cdC8vIENvbnN0cnVjdCB0aGUgbmFtZSBwcm9wZXJ0eSBvZiBhIHBvc3RcclxuXHRmdW5jdGlvbiBuYW1lKCl7IHJldHVybiB0aGlzLmtpbmQgKyAnXycgKyB0aGlzLmlkOyB9XHJcblxyXG5cdC8vIENoZWNrIGlmIHRoZSBVUkwgcG9pbnRzIHRvIGFuIGltYWdlIHJlc291cmNlXHJcblx0ZnVuY3Rpb24gaXNJbWFnZVVSTCh1cmwpe1xyXG5cdFx0dmFyIGltZ1R5cGVzID0gWycucG5nJywgJy5qcGcnLCAnLmdpZiddLFxyXG5cdFx0XHR0ZXN0ID0gZmFsc2U7XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgaW1nVHlwZXMubGVuZ3RoOyBpKyspe1xyXG5cdFx0XHRpZih1cmwuZW5kc1dpdGgoaW1nVHlwZXNbaV0pKXsgdGVzdCA9IHRydWU7IH1cclxuXHRcdH1cclxuXHRcdHJldHVybiB0ZXN0O1xyXG5cdH1cclxuXHJcblx0Ly8gSGVscGVyIGZ1bmN0aW9uIHRvIGdldCBmaWxldHlwZSBvZiBhIHBhdGgvdXJsXHJcblx0U3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aCA9IGZ1bmN0aW9uKHN1ZmZpeCkge1xyXG5cdCAgICByZXR1cm4gdGhpcy5pbmRleE9mKHN1ZmZpeCwgdGhpcy5sZW5ndGggLSBzdWZmaXgubGVuZ3RoKSAhPT0gLTE7XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGxvZzogZnVuY3Rpb24oKXtcclxuXHRcdFx0Y29uc29sZS5sb2codCk7XHJcblx0XHR9LFxyXG5cdFx0aHRtbDogZ2VuZXJhdGVQb3N0XHJcblx0fVxyXG59IiwiK2Z1bmN0aW9uKCQpe1xyXG5cclxuXHQvLyBMb2FkIHRoZSBwb3N0IG9iamVjdFxyXG5cdHZhciBQb3N0ID0gcmVxdWlyZSgnLi9wb3N0Jyk7XHJcblx0XHJcblx0Ly8gUmVkZGl0IEFQSSBtYW50bGVcclxuXHQkKGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0Ly8gQXR0YWNoIGV2ZW50IGhhbmRsZXIgdG8gYWxsIGVsZW1lbnRzIHdpdGhcclxuXHRcdC8vIGRhdGEtc3VicmVkZGl0PVwiLi4uXCIgd2hpY2ggbG9hZHMgbGF0ZXN0XHJcblx0XHQvLyBwb3N0cyBmcm9tIHRoaXMgc3VicmVkZGl0IGludG8gI3Bvc3RzXHJcblx0XHRcclxuXHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsICdbZGF0YS1zdWJyZWRkaXRdJywgZnVuY3Rpb24oZSl7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0dmFyIHN1YnJlZGRpdCA9ICQoZS5jdXJyZW50VGFyZ2V0KS5hdHRyKCdkYXRhLXN1YnJlZGRpdCcpO1xyXG5cdFx0XHRnZXRQb3N0c19mcm9tX3N1YnJlZGRpdChzdWJyZWRkaXQsIGluc2VydFBvc3RzKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHRmdW5jdGlvbiBnZXRQb3N0c19mcm9tX3N1YnJlZGRpdChzdWJyZWRkaXQsIGNhbGxiYWNrKXtcclxuXHRcdHZhciB1cmwgPSBcImh0dHA6Ly93d3cucmVkZGl0LmNvbS9cIiArIHN1YnJlZGRpdCArIFwiLmpzb25cIjtcclxuXHRcdCQuZ2V0SlNPTih1cmwpLmRvbmUoIGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuXHRcdFx0Y2FsbGJhY2socmVzcG9uc2UuZGF0YS5jaGlsZHJlbik7XHJcblx0XHR9KS5mYWlsKCBmdW5jdGlvbihyZXNwb25zZSl7XHJcblx0XHRcdGNvbnNvbGUuYWxlcnQoJ2dldFBvc3RzX2Zyb21fc3VicmVkZGl0IGZhaWxlZDogJyArIHJlc3BvbnNlKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gaW5zZXJ0UG9zdHMocG9zdHMpe1xyXG5cdFx0dmFyICRjb250YWluZXIgPSAkKCcjcG9zdHMnKTtcclxuXHRcdCRjb250YWluZXIuZmluZCgnbGk6bm90KC50ZW1wbGF0ZSknKS5yZW1vdmUoKTtcclxuXHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgcG9zdHMubGVuZ3RoOyBpKyspe1xyXG5cclxuXHRcdFx0Ly8gQ3JlYXRlIG5ldyBwb3N0IG9iamVjdCBhbmQgcGFzc1xyXG5cdFx0XHQvLyB0aGUgSlNPTiBvYmplY3QgZnJvbSByZWRkaXQgYXMgb3B0aW9uXHJcblx0XHRcdHZhciBwb3N0ID0gbmV3IFBvc3QocG9zdHNbaV0uZGF0YSk7XHJcblxyXG5cdFx0XHQvLyBBZGQgdGhlIHBvc3QgdG8gdGhlIGNvbnRhaW5lclxyXG5cdFx0XHQkY29udGFpbmVyLmFwcGVuZChwb3N0Lmh0bWwoKSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG59KGpRdWVyeSk7IiwiLyogXHJcblx0UmVxdWlyZSBqcXVlcnkgd2l0aCB0aGUgQ29tbW9uSlMgcGF0dGVyblxyXG5cclxuXHRGaWxlIGlzIHJlbmRlcmVkIG9uIHNhdmUgd2l0aCBndWxwLmpzIGFuZCBcclxuXHR0aGUgYnJvd3NlcmlmeSBub2RlIG1vZHVsZS5cclxuKi9cclxuXHJcbitmdW5jdGlvbiB0YWdzKCQpe1xyXG5cclxuXHQvLyBMaXZlIGV2ZW50IGJpbmRpbmdcclxuXHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnRhZycsIHRhZ19jbGljayk7XHJcblxyXG5cdGZ1bmN0aW9uIHRhZ19jbGljayhldmVudCl7XHJcblx0XHR2YXIgJHRhcmdldCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCk7XHJcblx0XHR2YXIgZGF0YUdyb3VwID0gJHRhcmdldC5hdHRyKCdkYXRhLWdyb3VwJyk7XHJcblxyXG5cdFx0Ly8gSWYgdGFnIGlzIHBhcnQgb2YgYSBkYXRhLWdyb3VwLCByZXNldCBpdHMgc2libGluZ3NcclxuXHRcdGlmKGRhdGFHcm91cCl7XHJcblx0XHRcdHZhciAkZ3JvdXAgPSAkKCdbZGF0YS1ncm91cD1cIicgKyBkYXRhR3JvdXAgKyAnXCJdJyk7XHJcblx0XHRcdCRncm91cC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0JHRhcmdldC50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0Ly8gRG9uJ3QgZm9sbG93IGxpbmsgb3IgcmVsb2FkIHBhZ2VcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IFxyXG5cdH1cclxufShqUXVlcnkpOyIsIitmdW5jdGlvbigkKXtcclxuXHJcblx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJy51cHZvdGUnLCB1cHZvdGUpO1xyXG5cdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuZG93bnZvdGUnLCBkb3dudm90ZSk7XHJcblxyXG5cdGZ1bmN0aW9uIHVwdm90ZShlKXtcclxuXHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0Ly8gR2V0IHRoZSBkYXRhIG9iamVjdCAocG9zdCkgZnJvbSB0aGUgcGFyZW50IDxsaT5cclxuXHRcdHZhciAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xyXG5cdFx0dmFyICRwb3N0ID0gJHRhcmdldC5wYXJlbnRzKCcucG9zdCcpO1xyXG5cdFx0dmFyICRzY29yZSA9ICRwb3N0LmZpbmQoJy5zY29yZScpO1xyXG5cdFx0dmFyIHBvc3RPYmplY3QgPSAkcG9zdC5kYXRhKCdwb3N0Jyk7XHJcblx0XHR2YXIgbiA9IDE7XHJcblxyXG5cdFx0Ly8gSWYgYWxyZWFkeSBkb3dudm90ZWQsIGNvcnJlY3QgZG93bnZvdGUgYW5kIHVwdm90ZVxyXG5cdFx0aWYocG9zdE9iamVjdC5kb3dudm90ZWQpe1xyXG5cdFx0XHRuID0gMjtcclxuXHRcdFx0cG9zdE9iamVjdC5kb3ducyAtPSAxO1xyXG5cdFx0XHRwb3N0T2JqZWN0LmRvd252b3RlZCA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIElmIGFscmVhZHkgdXB2b3RlZCwgbGVhdmVcclxuXHRcdGlmKHBvc3RPYmplY3QudXB2b3RlZCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdHBvc3RPYmplY3QudXB2b3RlZCA9IHRydWU7XHJcblx0XHRwb3N0T2JqZWN0LnNjb3JlICs9IG47XHJcblx0XHRwb3N0T2JqZWN0LnVwcyArPSAxO1xyXG5cdFx0JHNjb3JlLmh0bWwocG9zdE9iamVjdC5zY29yZSk7XHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZG93bnZvdGUoZSl7XHJcblxyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHJcblx0XHQvLyBHZXQgdGhlIGRhdGEgb2JqZWN0IChwb3N0KSBmcm9tIHRoZSBwYXJlbnQgPGxpPlxyXG5cdFx0dmFyICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XHJcblx0XHR2YXIgJHBvc3QgPSAkdGFyZ2V0LnBhcmVudHMoJy5wb3N0Jyk7XHJcblx0XHR2YXIgJHNjb3JlID0gJHBvc3QuZmluZCgnLnNjb3JlJyk7XHJcblx0XHR2YXIgcG9zdE9iamVjdCA9ICRwb3N0LmRhdGEoJ3Bvc3QnKTtcclxuXHRcdHZhciBuID0gLTE7XHJcblxyXG5cdFx0Ly8gSWYgYWxyZWFkeSB1cHZvdGVkLCBjb3JyZWN0IHVwdm90ZSBhbmQgZG93bnZvdGVcclxuXHRcdGlmKHBvc3RPYmplY3QudXB2b3RlZCl7XHJcblx0XHRcdG4gPSAtMjtcclxuXHRcdFx0cG9zdE9iamVjdC51cHMgLT0gMTtcclxuXHRcdFx0cG9zdE9iamVjdC51cHZvdGVkID0gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gSWYgYWxyZWFkeSBkb3dudm90ZWQsIGxlYXZlXHJcblx0XHRpZihwb3N0T2JqZWN0LmRvd252b3RlZCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdHBvc3RPYmplY3QuZG93bnZvdGVkID0gdHJ1ZTtcclxuXHRcdHBvc3RPYmplY3Quc2NvcmUgKz0gbjtcclxuXHRcdHBvc3RPYmplY3QuZG93bnMgKz0gMTtcclxuXHRcdCRzY29yZS5odG1sKHBvc3RPYmplY3Quc2NvcmUpO1xyXG5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcbn0oalF1ZXJ5KTsiXX0=

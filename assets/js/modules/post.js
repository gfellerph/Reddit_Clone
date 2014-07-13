


// Create new link post
/*+function new_link($){
	var posts = $('#posts'),
		postbutton = $('#btn_new_link_post');

	postbutton.on('click', function(e){
		var template = $('#posts .template').clone(),
			url = $('#txt_new_link_url').val(),
			title = $('#txt_new_link_title').val(),
			img = $('#txt_new_link_img').val(),
			tags = $('#txt_new_link_tags').val();

		posts.prepend(template);

		// Fill template with values
		template.find('h3:first').html(title);
		template.find('.source a').html(url);
		template.find('.img img').attr('src', img);
		for(var list = tags.split(' '), i = 0; i < list.length; i++){
			template.find('.tags ul').append('<li>' + list[i] + '</li>');
		}

		template.removeClass('hidden template');
	});

}(jQuery);*/

// Require jQuery
var $ = require('../vendor/jquery');

// Default options object with all the possible variables
var DEFAULT = {
	created: new Date(),
	$template: null,
	score: 0,
	selftext: '',
	comments: null
}

module.exports = function Post(options){

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
	this.subreddit = o.subreddit; // Subreddit, the post is in
	this.id = o.id; // Post id
	this.thumbnail = o.thumbnail; // Thumbnail of the post
	this.downs = o.downs; // Number of downvotes
	this.ups = o.ups; // Number of upvotes
	this.num_comments = o.num_comments; // Number of comments
	this.kind = o.kind; // Post kind ('t3' for most posts)
	this.name = name(); // Kind and id of the post
	this.likes = o.likes;
	this.over_18 = o.over_18; // NSFW or SFW

	// Takes the template and the options and generates the HTML of the post
	function generatePost(){

		// Security checks
		if(!typeof t.$template == 'object') console.warn('Template must be an object');
		t.$template = $(t.$template).clone();
		if(!t.$template instanceof $) console.warn('Template must be an jQuery object');

		var $title = t.$template.find('.title');
		var $text = t.$template.find('.text');
		var $created = t.$template.find('.created');
		var $score = t.$template.find('.score');
		var $upvote = t.$template.find('.upvote');
		var $downvote = t.$template.find('.downvote');
		var $autor = t.$template.find('.autor');
		var $thumbnail = t.$template.find('.thumbnail');

		// Fill HTML
		$title.html(t.title);
		$text.html(t.selftext);
		$created.html(t.created.toLocaleString());
		$score.html(t.score);
		$autor.html(t.autor);
		if(isImageURL(t.url)) $thumbnail.attr('src', t.url);
		if(t.selftext.length > 0) $text.html(t.selftext);
		

		// Register up an downvote events
		$upvote.on('click', function(){ vote(1); });
		$downvote.on('click', function(){ vote(-1); });

		// Save the post object to the data property of the html-element
		t.$template.data('post', t);
		t.$object = t.$template;

		return t.$template;
	}

	function vote(n){
		t.score += n;
		if(!typeof $object == 'object' && $object instanceof $){
			$object.find('.score').html(t.score);
		}
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
	// Helper function for date formatting
	function formatedDate(date){
		var d = date.getDay();
		var M = date.getMonth() + 1; // Month counts begins with 0
		var y = date.getFullYear();
		var m = date.getMinutes();
		var h = date.getHours();

		console.log(date.toLocaleString());

		return d + '.' + M + '.' + y + ' ' + h + ':' + m;
	}

	return {
		log: function(){
			console.log(t);
		},
		generate: generatePost
	}
}
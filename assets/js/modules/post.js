module.exports = function Post(options){

	// Require jQuery
	var $ = require('../vendor/jquery');

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
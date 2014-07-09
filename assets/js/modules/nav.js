/* 
	Require jquery with the CommonJS pattern

	File is rendered on save with gulp.js and 
	the browserify node module.
*/

var jQuery = require('../vendor/jquery');

// Self executing closure function
+function navigation($){

	// Live event binding
	$(document).on('click', '[data-expands]', expand);

	// Handler for the click event on a menu point with a folder
	function expand(event){

		// Get the clicked menu point and all folders
		var $target = $(event.currentTarget);
		var	$expander = $('#expander');

		// Look for open panels
		if($expander.hasClass('open')){

			// If there are any, hide them, and in the callback,
			// show the new panel
			hidePanel(
				$expander.data('openPanel'),
				showPanel($target.attr('data-expands'))
			);
		} else {

			// If there are none, show the new panel
			showPanel($target.attr('data-expands'));
		}

		function showPanel(ident, callback){
			

			// Execute callback, if there is any
			if(callback) return callback();
		}

		function hidePanel($ident, callback){

			// Set height to current height of the panel
			$expander.css({'height': $panel.outerHeight()});

			// Remove the class open (no more height: auto !important)
			$expander.removeClass('open');

			// Fade out the panel
			$ident.removeClass('active');

			// Force rerendering of the expander
			$expander.hide().show();

			// Animate with css transitions to 0 height
			$expander.css({'height': 0});

			// Remove openPanel from $expander
			$expander.data('openPanel', null);

			// Execute callback, if there is any
			if(callback) return callback();
		}
	}
}(jQuery);

+function tags($){

	// Toggle the clicked tag
	var tags = $('.tag');

	// Live event binding
	$(document).on('click', tags, tag_click);

	function tag_click(event){
		var $target = $(event.currentTarget);
		var dataGroup = $target.attr('data-group');

		// If tag is part of a data-group, reset its siblings
		if(dataGroup){
			var $group = $('[data-group="' + dataGroup + '"]');
			$group.removeClass('active');
		}

		$target.toggleClass('active');

		// Don't follow link and reload page
		event.preventDefault(); 
	}
}(jQuery);
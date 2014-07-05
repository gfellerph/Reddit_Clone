/* 
	Require jquery with the CommonJS pattern

	File is rendered on save with gulp.js and 
	the browserify node module.
*/

var jQuery = require('../vendor/jquery');

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

			// If there are any, fade them out and in the callback,
			// fade the new one in
			$expander.data('openPanel').fadeOut(
				200, 
				showPanel($target.attr('data-expands'))
			);
		} else {

			// If there are none, fade in new panel
			showPanel($target.attr('data-expands'));
		}

		function showPanel(ident){
			var $panel = $expander.find('[data-expandable="' + ident + '"]');

			$expander.css({'height': $panel.outerHeight()});
			$expander.addClass('open');
			$panel.fadeIn(200);
			$expander.data('openPanel', $panel);
		}
	}


	// Toggle the clicked tag
	var $tags = $('.tag');

	$tags.on('click', tag_click);

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
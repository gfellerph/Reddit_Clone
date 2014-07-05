var jQuery = require('../vendor/jquery');

+function navigation($){

	// Live event binding
	$(document).on('click', '[data-expands]', expand);

	// Handler for the click event on a menu point with a folder
	function expand(event){
		console.log('expand');
		// Get the clicked menu point and all folders
		var $target = $(event.currentTarget),
			$expander = $('#expander');

		// Look for open panels
		if($expander.hasClass('open')){
			// If there are any, fade them out and in the callback, fade the new one in
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


	// Activate the clicked filter
	var $filters = $('#header .filter');
	$filters.on('click', filter_click);
	function filter_click(e){
		e.preventDefault();
		$filters.removeClass('active');
		$(e.currentTarget).addClass('active');
	}
}(jQuery);
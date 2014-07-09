/* 
	Require jquery with the CommonJS pattern

	File is rendered on save with gulp.js and 
	the browserify node module.
*/

var jQuery = require('../vendor/jquery');

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

			// If open panel == new panel, close this
			if($target.attr('data-expands') == ident){
				hidePanel(ident);
			} else {

				// If there are any, hide them, and in the callback,
				// show the new panel
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

			// Set expander height to panel height
			$expander.css({'height': $panel.outerHeight()});

			// Show the panel
			$panel.addClass('active');

			// Register one event listener to catch transition end
			// with vendor prefixes. Also keep browsers accepting
			// prefixed and non-prefixed events from firing twice
			var fired = false;
			$expander.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
    			if ( ! fired ) {
        			fired = true;
        			console.log('add class open transitionend');
        			$expander.unbind('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
        			// Set height to auto and save the active panel
        			$expander.addClass('open');
        			$expander.data('activePanel', $panel);
    			}
			});

			// Execute callback, if there is any
			if(callback) return callback();
		}

		function hidePanel(ident, callback){

			var $panel = $('[data-expandable="' + ident + '"]');

			// Remove the class open (no more height: auto !important)
			$expander.removeClass('open');

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
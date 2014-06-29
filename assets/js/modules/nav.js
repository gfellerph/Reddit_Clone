var jQuery = require('../vendor/jquery');

+function navigation($){

	// Live event binding
	$(document).on('click', '#menu [data-folder]', folder_click);

	// Handler for the click event on a menu point with a folder
	function folder_click(event){

		// Get the clicked menu point and all folders
		var $target = $(event.currentTarget),
			$folder = $('#menu .folder');

		if($folder.hasClass('open')){
			$folder.css({'height': 0});
			$folder.removeClass('open');
		} else {
			var $section = $folder.find('.' + $target.attr('data-folder'));

			$folder.find('section').hide();
			$target.show();

			$folder.css({'height': $target.outerHeight()});
			$folder.addClass('open');
		}
	}
}(jQuery);
/* 
	Require jquery with the CommonJS pattern

	File is rendered on save with gulp.js and 
	the browserify node module.
*/

var jQuery = require('../vendor/jquery');

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

		// Don't follow link or reload page
		event.preventDefault(); 
	}
}(jQuery);
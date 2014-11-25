module.exports = function ($) {

	// Initialize packery for the frontpage
	$(function() {
		console.log('init packery');
		$('.grid-sizer').css('width', '100%');
		$('.posts').packery({
			itemSelector: 'li',
			gutter: 10,
			columnWidth: '.grid-sizer'
		});
	});
};
define(['vendor/jquery'], function(){
	// Code here, depends on jquery

	function navigation(){
		$('#menu [data-folder]').on('click', function(e){
			var t = $(e.currentTarget),
				f = $('#menu .folder');

			if(f.hasClass('open')){
				f.css({'height': 0});
				f.removeClass('open');
			} else {
				var sec = f.find('.' + t.attr('data-folder'));
				f.find('section').hide();
				sec.show();
				console.log(sec.outerHeight());
				f.css({'height': sec.outerHeight()});
				f.addClass('open');
			}
		});
	}


	// INVOKE
	navigation();
});
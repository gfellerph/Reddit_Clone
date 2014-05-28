define(['vendor/jquery'], function(){
	// Code here, depends on jquery

	// Create new link post
	function new_link(){
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

	}








	// INVOKE
	new_link();
});
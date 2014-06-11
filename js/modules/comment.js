define(['vendor/jquery'], function() {
    // add and delet comments for posts / links
    $(document).ready(function () {
        var commentTextBox = '<textarea class="textComment"></textarea>';
        var commentSubmit = '<button class="submitComment">Kommentar hinzufügen</button>';
        var commentList = '<li>' + $('.textComment').val() + '</li>';

        $('.comment').on('click', function (event) {
            var element = $(event.currentTarget)
            if(element.hasClass('openComment')){
                $(element).parent().find('.textComment').remove();
                $(element).parent().find('.submitComment').remove();
                $(element).removeClass('openComment');
            } else {
                $(element).parent().append(commentTextBox + commentSubmit);
                $(element).addClass('openComment');
            }
        });

        $('.submitComment').on('click', function () {
            $('.commentBox').append(commentList);
        });
    });
});
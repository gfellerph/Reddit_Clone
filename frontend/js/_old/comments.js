// +function($){} (require('../vendor/jquery'));
// Diese Notation ist wegen dem Punkt in der Bewertung:
// - jQuery so genutzt, dass es zu keinem Konflikt mit andern Frameworks kommt

// Es ist eine Funktion, die sich wegen den () Klammern am Schluss selbst ausführt.
// Der Funktion kann $ als Attribut übergeben werden, dort wird natürlich jQuery erwartet.

// Die Anweisung require('../vendor/jquery') ist eine Funktion, die mit Browserify genutzt
// werden kann. Der Gulp Task 'browserify' nutzt das Browserify Modul um allen Javascript
// Code in ein File zu packen und stellt die require() Funktion zur Verfügung.

// Damit wird dann der jQuery Code aus dem File im Ordner js/vendor geholt (es ist das
// ganz normale jQuery 2.1.irgendwas) und der Funktion übergeben. So entstehen keine
// Verwechslungen, wenn die Variable $ bereits von irgend einem anderen Script gesetzt 
// worden ist.

// Innerhalb der selbstausführenden Funktion kann jQuery wie gewohnt genutzt werden und
// auch sonst Javascript Code geschrieben werden.

// Im File main.js steht die Anweisung require('./modules/comments.js'); Diese Anweisung
// sorgt dafür, dass der Code in diesem File in das durch Browserify kompilierte File
// eingefügt und bei laden des Scripts ausgeführt wird. Das kompilierte Javascript File
// wird im index.html ganz am Schluss eingefügt und liegt im Ordner /assets/builds/.

+function($){

    // add and delet comments for posts / links
    $(document).ready(function () {
        var commentTextBox = '<textarea class="textComment"></textarea>';
        var commentSubmit = '<button class="submitComment">Kommentar hinzufügen</button>';
        var commentContainer = '<ul class="comment-container"></ul>';
        var commentAdd = '<button class="commentBtn">Kommentar</button>';

        $(document).on('click', '.commentBtn', function (event) {
            var $element = $(event.currentTarget);
            var $parent = $element.parent();
            if($element.hasClass('active')){
                $parent.find('.textComment:first').remove();
                $parent.find('.submitComment:first').remove();
                $element.removeClass('active');

                
            } else {
                $element.after(commentTextBox + commentSubmit);
                $element.addClass('active');
            }
        });

        $(document).on('click', '.submitComment', function (event) {
        	var $element = $(event.currentTarget);
        	var $parent = $element.parent();
            var $ul = $parent.find('.comment-container:first');
            var $newCont = {};
            if($ul.length > 0){
            	$newCont = $ul;
            } else {
            	$newCont = $(commentContainer);
            	$parent.append($newCont);
            }

            $newCont.append('<li>' + $parent.find('.textComment:first').val() + '</li>');
            $newCont.append(commentAdd);
            $parent.find('.textComment').remove();
                $parent.find('.submitComment').remove();
                $parent.find('.commentBtn').removeClass('active');
        });
    });

}(jQuery);
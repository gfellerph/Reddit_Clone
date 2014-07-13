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

}(require('../vendor/jquery'));
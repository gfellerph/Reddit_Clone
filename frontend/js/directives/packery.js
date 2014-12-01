
module.exports = [ function() {
    return {
        restrict: "A",
        appended: false,
        link: function(scope, element, attrs) {
            
            if (scope.packery === undefined || scope.packery === null) {
                scope.packery = new Packery(element[0].parentElement, {
                    columnWidth: ".grid-sizer",
                    gutter: 0
                });
                scope.packery.bindResize();
            } else {
                scope.packery.appended(element[0]);
            }

            imagesLoaded(element[0], function () {                
                scope.packery.layout();
            });
        }
    };
} ];
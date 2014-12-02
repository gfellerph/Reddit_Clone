
module.exports = [ function() {
    return {
        restrict: "A",
        appended: false,
        link: function(scope, element, attrs) {
            
            // If packery instance is undefined, initialize it
            if (scope.packery === undefined || scope.packery === null) {
                scope.packery = new Packery(element[0].parentElement, {
                    columnWidth: ".grid-sizer",
                    gutter: 0
                });
                scope.packery.bindResize();

            // If not, just append the elements to the api
            } else {
                scope.packery.appended(element[0]);
            }

            // Wait for images being loaded and layout the grid
            imagesLoaded(element[0], function () {                
                scope.packery.layout();
            });
        }
    };
} ];
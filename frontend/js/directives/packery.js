module.exports = [ "$rootScope", function($rootScope) {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            if ($rootScope.packery === undefined || $rootScope.packery === null) {
                console.log('making packery!');
                $rootScope.packery = new Packery(element[0].parentElement, {
                    columnWidth: ".grid-sizer",
                    gutter: 0
                });
                $rootScope.packery.bindResize();
                imagesLoaded(element, function() {
                    $rootScope.packery.appended(element[0]);
                    $rootScope.packery.layout();
                });
            } else {
                //$rootScope.packery.bindResize();
                imagesLoaded(element, function() {
                    $rootScope.packery.appended(element[0]);
                    $rootScope.packery.layout();
                    //$rootScope.packery.items.splice(1,1); // hack to fix a bug where the first element was added twice in two different positions
                    console.log("that");
                });
            }
        }
    };
} ];
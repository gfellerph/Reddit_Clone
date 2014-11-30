module.exports = [ "$rootScope", function($rootScope) {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            if ($rootScope.packery === undefined || $rootScope.packery === null) {
                imagesLoaded($rootScope, function() {
                    //console.log('making packery!');
                    $rootScope.packery = new Packery(element[0].parentElement, {
                        columnWidth: ".grid-sizer",
                        gutter: 0
                    });
                    $rootScope.packery.bindResize();
                    //$rootScope.packery.appended(element[0]);
                    //$rootScope.packery.items.splice(1,1); // hack to fix a bug where the first element was added twice in two different positions
                    $rootScope.packery.layout();
                });
            } else {
                $rootScope.packery.appended(element[0]);
                console.log("that");
                imagesLoaded($rootScope, function() {
                    $rootScope.packery.layout();
                });
            }
        }
    };
} ];
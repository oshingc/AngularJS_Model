'use strict';

define(['app'], function (app) {

    var blurWhenClick = function () {
       return {
            restrict: 'A',
            scope: {
              ngModel: '='
            },

            link: function(scope, elem, attr) {
                scope.$watch('ngModel', function() {
                    if(!scope.ngModel){
                        elem[0].blur();
                    }
                });
            }
        };  
    };


    app.directive('blurWhenClick', blurWhenClick);

});

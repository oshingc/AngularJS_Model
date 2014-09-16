'use strict';

define(['app'], function (app) {

    var fallbackSrc = function () {
        return {
            link: function postLink(scope, iElement, iAttrs) {
              iElement.bind('error', function() {
                angular.element(this).attr("src", iAttrs.fallbackSrc);
              });
            }        
        };
    };

    app.directive('fallbackSrc', fallbackSrc);

});

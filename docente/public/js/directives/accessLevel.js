'use strict';

define(['app'], function (app) {

    var accessLevel = function (Auth) {
        return {
            restrict: 'A',
            link: function($scope, element, attrs) {
                var prevDisp = element.css('display')
                    , userRole
                    , accessLevel;

                $scope.user = Auth.user;
                
                $scope.$watch('user', function(user) {
                    if(user.role)
                        userRole = user.role;
                    updateCSS();
                }, true);

                attrs.$observe('accessLevel', function(al) {
                    if(al) accessLevel = $scope.$eval(al);
                    updateCSS();
                });

                function updateCSS() {
                    if(userRole && accessLevel) {
                        if(!Auth.authorize(accessLevel, userRole))
                            element.css('display', 'none');
                        else              
                            
                            if(element.css('display')!='none')
                                if(prevDisp!="")
                                    element.css('display', prevDisp);
                                else
                                    element.css('display','block');  
                            else
                                element.css('display','block');                        
                    }
                }
            }
        };

    };

    app.directive('accessLevel', ['Auth', accessLevel]);

});
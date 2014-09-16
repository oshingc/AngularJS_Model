'use strict';

define(['app'], function (app) {

    var TimeManager = function ($sessionStorage, $rootScope, $timeout, asistenciaService) {  
        var TimeFactory = {};

        TimeFactory.obtenerHoraDelSistema = function(){
            asistenciaService.obtenerHoraDelSistema();
            changeCurrentTime();            
        };

        var changeCurrentTime = function() {     
            console.log('changeCurrentTime');   
            var t = $rootScope.currentTime;
            t.setSeconds(t.getSeconds() + 1);     
            $rootScope.currentTime = t;            
            $timeout(changeCurrentTime,1000);
        };

         return TimeFactory;

    };

    app.factory('TimeManager', ['$sessionStorage','$rootScope','$timeout','asistenciaService',TimeManager]);

});
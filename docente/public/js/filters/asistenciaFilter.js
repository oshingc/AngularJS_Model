'use strict'

define(['app'], function (app) {
   
    var clasesPorHora = function ($filter,$scope) {
        return function (claseActual, hora) {
        	var clasesNuevas = {};
        	var k = 0;
            if (claseActual.length>0){
            	for(var i=0; i<claseActual.length; i++){
            		if(claseActual[i].horaInicio>=hora){
            			clasesNuevas[k]=claseActual[i];
            			k++;
            		}
            	}
            	$scope.clasesNuevas = clasesNuevas;
            	return clasesNuevas;
            }else{
            	$scope.clasesNuevas = {};
            	return {};
            }
  
        };
    };

    var orderObjectby = function () {
        
        return function (items, field, reverse) {
          var filtered = [];
          angular.forEach(items, function(item) {
            filtered.push(item);
          });
          function index(obj, i) {
            return obj[i];
          }
          filtered.sort(function (a, b) {
            var comparator;
            var reducedA = field.split('.').reduce(index, a);
            var reducedB = field.split('.').reduce(index, b);
            if (reducedA === reducedB) {
              comparator = 0;
            } else {
              comparator = (reducedA > reducedB ? 1 : -1);
            }
            return comparator;
          });
          if (reverse) {
            filtered.reverse();
          }
          return filtered;
        };
    };


    app.filter('clasesPorHora', ['$filter',clasesPorHora]);
    app.filter('orderObjectby', ['$filter',orderObjectby]);

});
'use strict';

define(['app'], function (app) {

    var subGruposController = function ($scope,$filter,$location,$http,$sessionStorage,socket) {
        var appTitle = 'SubGrupos';
        $scope.appTitle = appTitle;
        $scope.highlight = function (path) {
            return $location.path().substr(0, path.length) == path;
        }

        $scope.subgrupos = [];
	    
        socket.on('onSgUpdated', function(sg) {
            // Update if the same note   
           
            $scope.subgrupos.forEach(function(reg) {
                if(reg.id.idPeriodo == sg.id.idPeriodo && reg.id.idGrupo == sg.id.idGrupo 
                    && reg.id.idAdmModalidad== sg.id.idAdmModalidad && reg.id.idCarrera == sg.id.idCarrera){
                    reg.inscritos=sg.inscritos;                    
                }
            });
           

           //tmp.inscritos=sg.inscritos;

        });

        $scope.loadPeople = function() {
	        //console.log(mockDataForThisTest);
	        //$scope.people = mockDataForThisTest;
	        //console.log($scope.people.length);
            var cad = "";
            if($sessionStorage['JSESSIONID']!=null){
                cad="JDSESSIONID="+$sessionStorage['JSESSIONID'];
            }
            if($sessionStorage['remember-me']!=null){
                cad=cad+"; remember-me="+$sessionStorage['remember-me'];
            }            

            $http({
                method  : 'GET',
                url     : '/api/subgrupos',
                headers : { 'Cookie-REST': cad }  
            })
            .success(function(data, status) {
                if(status==200){
                    $scope.subgrupos = data;
                    angular.copy($scope.subgrupos, $scope.copy_subgrupos);
                }                                
            });

            /*
			$http.get('/api/subgrupos')
				.success(function(data, status, headers, config) {
				    $scope.subgrupos = data;
				    angular.copy($scope.subgrupos, $scope.copy_subgrupos);
				});*/

	    };
	    $scope.inscribir = function(sg){
            sg.inscritos=sg.inscritos+1;
            socket.emit('updateSg', sg);            
            //console.log(reg);
	    };        
    };

    app.register.controller('SubGruposController', ['$scope', '$filter','$location','$http','$sessionStorage','socket',subGruposController]);    
    
});
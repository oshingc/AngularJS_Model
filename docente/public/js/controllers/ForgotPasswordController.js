'use strict';

define(['app'], function (app) {

    var forgotPasswordController = function ($scope, $location, $http, $sessionStorage, $modal,$filter, $alert,forgotPasswordService) {
    	
    var modal = $modal({
    		template : '/views/template/ConfirmacionForgotPassword.html',
    		persist : false,
    		show : false,
    		esc: false,
    		backdrop : 'static',
    		scope : $scope
    });

    $scope.alert = {
  		"content": "...",
  		"container" : "#forgotPasswordMensaje",
  		"type": "success",
  		"duration" : 4
    }; 

    $scope.recuperarPassword=function(email){
  		console.log('enviando:');
  		console.log(email);
  		$scope.cargando=true;
  		$('#email').prop('disabled',true);
      $('#btnForgotPassword').prop('disabled',true);
  		forgotPasswordService.recuperaPassword(email)
  		.then(function(data){
  			if(data.result){
				console.log('success envio');
				$scope.showModal();	
				$scope.successMessage=data.message;
  			}else{
  				$('#email').removeAttr('disabled',false);
  				$('#btnForgotPassword').removeAttr('disabled',false);
  				console.log('error envio');
  				var alert = $scope.alert;
  				alert.title = "Error al enviar";
  				alert.content = "<br/>"+data.message;
  				alert.type="danger";
  				$scope.showAlert(alert);
			   }
      });
    }

  $scope.showModal = function() {
		modal.$promise.then(modal.show);
	};

	$scope.showAlert = function(){
    $alert($scope.alert);
 	}
 	$scope.init=function(){
 		$scope.cargando=false;
 		console.log($scope.cargando);
 	}
 	$scope.init();
  };

  app.register.controller('ForgotPasswordController', ['$scope', '$location','$http','$sessionStorage','$modal','$filter','$alert','forgotPasswordService',forgotPasswordController]);

});
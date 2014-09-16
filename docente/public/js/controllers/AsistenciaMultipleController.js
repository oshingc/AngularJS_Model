'use strict';

define(['app','moment'], function (app,moment) {

    var asistenciaController = function ($scope,$timeout,$window,$alert,$location,$rootScope,$sessionStorage,$filter,blockUI,asistenciaService, Auth) {

    	$scope.selectedDate=moment();
		$scope.asistencias = {};
		$scope.defaultValue = false;
		$scope.clickActive = false;
		$scope.tableEmpty='La clase actual no tiene alumnos matriculados.';
		$scope.noHayClases = 'No hay clases en el día';
		$scope.mensajeBotonGrabar = 'Guardar Cambios'; 
		$scope.claseEscogida ={};
		$scope.clasesAnteriores = [];
		$scope.seleccionGlobal = [];
		$scope.asistenciasHabilitadas = {};
		$scope.copy_asistencias = [];
		$scope.mostrarTardanzas = false;

		var initTable = false;
		var mesesValidosMap = [];
		var $table = null;

		var init = function(){			

			moment.locale("es");
			console.log('init asistencia-multiple');
    		$scope.inicializarClasesDelDia();    		
		}

		var convertirAsistenciaASimbolo = function(asistencia){
			
			if(asistencia==null || asistencia==undefined ){
				return "NR";
			}


			var s = "";
			if(asistencia.id==undefined || asistencia.id==null){
				return "NR";
			}

			if(asistencia.asistio){
				s="A";				
			}
			if(asistencia.tardanza){
				s= "T"
			}

			return s;
		}

		var existeListaDeClasesDelDia = function(){
			if($scope.clasesAnteriores != undefined && $scope.clasesAnteriores.length>0){
				return true;
			}else{
				return false;
			}
		}

		var dateToMilitarHour = function(hora){
            
            var militarHour = 0;
            var mydate = new Date(hora);
            var horas = mydate.getHours();
            var minutos = mydate.getMinutes();
            militarHour = horas*100;
            militarHour += minutos;
            return militarHour;
      	}

		var formatAMPM =  function(hour, minutes){
			var hourNumber = hour;
			var minutesNumber = minutes;

			var hourCadena = hour;
			var minutesCadena = minutes;
			if(minutes==0){
				minutesCadena = '00';
			}else{
				if(minutes>0&&minutes<10){
				minutesCadena = '0'+minutesNumber;
				}else{
				minutesCadena = minutesNumber;
				}
			}

			var timeNumber = hourNumber*100+minutesNumber;
			
			if(timeNumber>=100 && timeNumber<=1159){
				return hourNumber+':'+minutesCadena+' AM';
			}else{
				if(timeNumber>=1200 && timeNumber<2359){
					if(timeNumber>=1300 && timeNumber<2359){
						hourNumber -=12;
					}
					
					return hourNumber+':'+minutesCadena+' PM';

				}else{

					if(timeNumber>=0 && timeNumber<=59){
					return '12:'+minutesCadena+'AM';
					}
				}
			}
		}

		var generarMesesDeClase = function(inicioClase,finClase){
			var maxMoment,mesesValidos =[],mesesValidosList=[];
			var ahora = moment($rootScope.currentTime);
			var inicio = moment(inicioClase);
			var fin = moment(finClase);			
			var ahoraMes = moment({year: ahora.year(), month: ahora.month()});
			var inicioMes = moment({year: inicio.year(), month: inicio.month()});
			var finMes =moment({year: fin.year(), month: fin.month()});

			if( (inicio.isBefore(ahora) || inicio.isSame(ahora)) && (inicio.isBefore(fin) || inicio.isSame(fin))){
				var tempMoment = inicioMes.clone();
				if(ahora.isBefore(fin)){
					maxMoment = ahoraMes;
				}else{
					maxMoment = finMes;
				}
				
				var diferenciaMeses = maxMoment.diff(inicioMes, 'months');
				
				do{
					var newMonth = tempMoment.clone();
					mesesValidos[newMonth.year()+"-"+newMonth.month()]=newMonth;
					mesesValidosList.push(newMonth);
					diferenciaMeses--;
					tempMoment.add(1,'months');
				}while(diferenciaMeses>=0);

			}			

			if(mesesValidosList.length>0){
				mesesValidosMap = mesesValidos;
				$scope.mesesClaseEscogida = mesesValidosList;
				$scope.selectedMonth = mesesValidosMap[ahoraMes.year()+"-"+ahoraMes.month()];				
			}

		}

		var formatearAsistencias = function(response){			
			$scope.asistencias = response.data.listaAsistencias;
			$scope.copy_asistencias = angular.copy($scope.asistencias);
			$scope.fechasClaseElegida = response.data.fechasClase;	
			$scope.copy_fechasClaseElegida = angular.copy($scope.fechasClaseElegida);		
			$scope.seleccionGlobal = [];			

			var currentTime = moment($rootScope.currentTime);
			currentTime.subtract(5,'weeks');
			currentTime.startOf('day');
			
			angular.forEach($scope.fechasClaseElegida,function(value){
				var ini = moment(value.horaInicio);
				var end = moment(value.horaFin);

				value.intervaloClase = ini.format("h") + "-"+end.format("h");
				value.fecha = moment(value.fecha);
				
				$scope.seleccionGlobal[value.idAsistencia] =false ;
				if( ini.isAfter(currentTime) )
					$scope.asistenciasHabilitadas[value.idAsistencia]=true;
				else
					$scope.asistenciasHabilitadas[value.idAsistencia]=false;
			});
		}

		var extraerModificados = function(asistencias){
			var obj={};

			var copy_asistencias = $scope.copy_asistencias;
			var estado_asistencias = {};			
			var alumnos_a_procesar = [];
			var contador = 0, nuevaLongitud=0;
			angular.forEach(asistencias,function(value,index){
				var valueAnterior = copy_asistencias[contador];				
				var asistencias_a_procesar = {};
				var noSeAlteroAsistenciaAlumno = true;
				angular.forEach(value.asistencias,function(asis,key){					
					if(valueAnterior.asistencias[key].asistio != asis.asistio ||
						valueAnterior.asistencias[key].tardanza != asis.tardanza || asis.id==null){
						
						if(asis.id==null){
							if(estado_asistencias[key]==null){
								estado_asistencias[key] = 0;
							}else{
								if(estado_asistencias[key] == 1){
									estado_asistencias[key] = 2;
								}
							}
						}else{
							if(estado_asistencias[key]==null){
								estado_asistencias[key] = 1;
							}else{
								if(estado_asistencias[key] == 0){
									estado_asistencias[key] = 2;
								}
							}
						}

						asistencias_a_procesar[key]=asis;
						noSeAlteroAsistenciaAlumno=false;
					}					
				});
				if(!noSeAlteroAsistenciaAlumno){
					var alumno_a_procesar = angular.copy(value);
					alumno_a_procesar.indiceFront = index;
					alumno_a_procesar.asistencias = asistencias_a_procesar;
					alumnos_a_procesar.push(alumno_a_procesar);
				}
				contador++;
			});

			obj.asistencias = alumnos_a_procesar;
			obj.estadoAsistencias = estado_asistencias;
			return obj;
		}

		var initStickyTableAsistencias = function(){
			$timeout(function(){				
				if($table==null && !initTable){
					
					$table= $('table.sticky-header');
					$table.floatThead({
					useAbsolutePositioning: false
						// absolutePositioning is better for
						// highly dynamic sites
						// (which this is not)
					});		
					initTable=true;
				}else{
					$table.floatThead('reflow');
				}
			},100);
		}

		$scope.formatearClaseActual = function(reg){
			var textoSesion = reg.tipoSesion;

			if(textoSesion=='P'){
				textoSesion = "PRÁCTICA";
			}else if(textoSesion=='T'){
				textoSesion = "TEORÍA";
			}

			return reg.aiCurso.nombre+' '+$scope.toHourFormat(reg.horaInicio)+' - '
			+$scope.toHourFormat(reg.horaFin)+' ['+textoSesion+']';
		}

		$scope.etiquetaBtnTardanzas = function(){
			if(!$scope.mostrarTardanzas){
				return 'Ver Tardanzas';
			}else{
				return 'Ocultar Tardanzas';
			}
		}

      	$scope.toHourFormat = function(millis){
			var date = new Date(millis);
			var hour = date.getHours();
			var minutes = date.getMinutes();        
			return formatAMPM(hour,minutes);
		}

		$scope.nombreCompleto = function(apellido1, apellido2,nombre){

			if(apellido1===undefined){
				apellido1='';
			}
			if(apellido2===undefined){
				apellido2 = '';
			}
			if(nombre===undefined){
				nombre = '';
			}

			if(apellido1==undefined){
				apellido1='';
			}
			if(apellido2==undefined){
				apellido2 = '';
			}
			if(nombre==undefined){
				nombre = '';
			}

			if(apellido2=='.' || apellido2=='*'){
				apellido2="";
			}
			return apellido1+' '+apellido2+', '+nombre;
		}

		$scope.esAlumnoBloqueadoPorDPI = function(alumno){
			if(alumno.aiAlumnoMatriculaCurso != undefined && alumno.aiAlumnoMatriculaCurso != null ){				
				if(alumno.aiAlumnoMatriculaCurso.porcentajeInasistencia>=30){
					return true;
				}else{
					return false;
				}
			}else{
				return true;
			}
		}


		$scope.obtenerClasesDelDia = function(buscarRegistro,horaInicio,horaFin,idCursoSeleccionado){			
			
			var classDate = $scope.selectedDate.toDate();

			asistenciaService.obtenerClases(classDate).then(

				function(data){

					$scope.clasesAnteriores = data;
					console.log(data);
					if($scope.clasesAnteriores.length>0){


						if(!buscarRegistro || buscarRegistro ==undefined){
							$scope.claseEscogida = $scope.clasesAnteriores[0];
							$scope.elegirClase($scope.claseEscogida);	
						}else{

							if($scope.clasesAnteriores.length==1){
								$scope.claseEscogida = $scope.clasesAnteriores[0];
								$scope.elegirClase($scope.claseEscogida);		
							}else{

								for(var i=0; i<$scope.clasesAnteriores.length>0; i++){

									/*Elegimos la clase que este de acuerdo a los parámetros enviados desde horario*/
									if($scope.clasesAnteriores[i].horaInicioInt == dateToMilitarHour(horaInicio)
									&& $scope.clasesAnteriores[i].horaFinInt == dateToMilitarHour(horaFin)
									&& $scope.clasesAnteriores[i].aiCurso.idCurso == idCursoSeleccionado){
										$scope.claseEscogida = $scope.clasesAnteriores[i];
										$scope.elegirClase($scope.claseEscogida);

									}
			                    }


							}
						}				

						$scope.showAlert = true;                    

					}else{
						$scope.showAlert = false; 
						$scope.asistencias = {};                                  
					}
				} 

          
			);

		}

		$scope.elegirClase = function(clase){
			var clase = $scope.claseEscogida;
			if(clase!=null){
				$scope.selectedDate = moment(clase.horaInicio);
				generarMesesDeClase(clase.inicioClase,clase.finClase);

				asistenciaService.obtenerAsistenciasPorMes(clase.idAsistencia,clase.aiCurso.idCurso,clase.dia,
					clase.horaInicioInt,clase.horaFinInt,clase.tipoSesion,clase.horaInicio,
					clase.secciones,clase.grupos).then(

					function(response){												
						formatearAsistencias(response);
						if(response.data.listaAsistencias.length>0){							
							initStickyTableAsistencias();
						}			

					}
				);

			}else{
				$scope.asistencias = {};
				$scope.asistencias.length = 0;
			}

		}

    	
    	$scope.inicializarClasesDelDia = function(){

    		
			var accion = $rootScope.vista;
			var date = $rootScope.date;
			var horaInicio = $rootScope.horaInicio;          
			var horaFin = $rootScope.horaFin;
			var idCursoSeleccionado = $rootScope.idCursoSeleccionado;
			var idCursoActualDefault = $rootScope.claseActualDefaultIndex;
			var fromClaseActual = $rootScope.fromClaseActual;

			delete $rootScope.vista;
			delete $rootScope.date;
			delete $rootScope.horaInicio;
			delete $rootScope.horaFin;
			delete $rootScope.idCursoSeleccionado;
			delete $rootScope.fromClaseActual;

			var provieneDeHorario = false;

			if(date==undefined){
				date = $rootScope.currentTime;
			}

			if(fromClaseActual && idCursoActualDefault!=null ){
				var claseActualDefault = $rootScope.clasesActuales[idCursoActualDefault];
				horaInicio = new Date(claseActualDefault.horaInicio);
				horaFin = new Date(claseActualDefault.horaFin);
				idCursoSeleccionado = claseActualDefault.aiCurso.idCurso;
				provieneDeHorario = true;
				console.log("fromClaseActual");
			}

			if(accion!=undefined){
				provieneDeHorario = true;
			}

			var existeListaDeClases = existeListaDeClasesDelDia();
			if(existeListaDeClases){

				$scope.obtenerClasesDelDia(false);

			}else{
            
				//Se recargó la página de asistencias anteriores
				if(!provieneDeHorario && $sessionStorage['fecha-am']!=undefined){

					var fecha_temp = new Date($sessionStorage['fecha-am']);
					date = fecha_temp;

					var horaInicio_temp = new Date($sessionStorage['horaInicio-am']);
					horaInicio = horaInicio_temp;

					var horaFin_temp = new Date($sessionStorage['horaFin-am']);
					horaFin = horaFin_temp;

					var idCursoSeleccionado_temp = $sessionStorage['idCursoSelecionado-am'];
					idCursoSeleccionado = idCursoSeleccionado_temp;
				}

				//Se proviene de la vista de horario
				if(provieneDeHorario){
					//guardo mi fecha y horaInicio y horaFin
					$sessionStorage['fecha-am'] = date;
					$sessionStorage['horaInicio-am'] = horaInicio;
					$sessionStorage['horaFin-am'] = horaFin;
					$sessionStorage['idCursoSelecionado-am'] = idCursoSeleccionado;
				}

				if(date!=undefined){
					$scope.selectedDate = moment(date);
				}
				
				$scope.obtenerClasesDelDia(true,horaInicio,horaFin,idCursoSeleccionado);

			}
    	}

    	$scope.actualizacionAsistenciasHabilitada = function (){
    		if($scope.clasesAnteriores==null || $scope.clasesAnteriores==undefined || 
    			$scope.asistencias==null || $scope.asistencias==undefined){
    			return false;
    		}else{
    			if($scope.clasesAnteriores.length <= 0  || $scope.asistencias.length <= 0){
    				return false;
    			}else{
    				return true;
    			}
    		}
    	}

    	$scope.onMonthChange = function (){
    		
    		if($scope.claseEscogida!=null || $scope.claseEscogida!=undefined){
    			var clase = $scope.claseEscogida;
    			asistenciaService.obtenerAsistenciasPorMes(clase.idAsistencia,clase.aiCurso.idCurso,clase.dia,
					clase.horaInicioInt,clase.horaFinInt,clase.tipoSesion,clase.horaInicio,
					clase.secciones,clase.grupos,$scope.selectedMonth.month()+1).then(

					function(response){												
						formatearAsistencias(response);
						if(response.data.listaAsistencias.length>0){
							initStickyTableAsistencias();
						}	
					}
				);

    		}
    	}

    	$scope.onChangeAsistencia = function (asistencia,fromAsistio) {

    		if(asistencia.tardanza && !asistencia.asistio){
    			if(!fromAsistio){
    				asistencia.asistio = true;
    			}else{
    				asistencia.tardanza = false;
    			}    			
    		}
    	}

    	$scope.onSeleccionGlobalChange = function(idAsistencia){
    		if($scope.asistencias!=null && $scope.asistencias!=undefined){

    			angular.forEach($scope.asistencias,function(reg){
	    			if(!$scope.esAlumnoBloqueadoPorDPI(reg) && reg.matriculado){
	    				reg.asistencias[idAsistencia].asistio = $scope.seleccionGlobal[idAsistencia];
	    				if(!reg.asistencias[idAsistencia].asistio)
	    					reg.asistencias[idAsistencia].tardanza = false;
    				}
    			});
    		}
    	}

    	$scope.procesarAsistencias = function(){
     		if($scope.asistencias.length>0){
    			var resultadoRegistrosModificados = extraerModificados($scope.asistencias);    			
    			var resultado = resultadoRegistrosModificados.asistencias;
    			var fechasClaseElegida = $scope.copy_fechasClaseElegida;

    			if(resultado!=null && resultado!=undefined && resultado.length !=0){
    				blockUI.start();
    				asistenciaService.actualizarAsistenciasPorMes(resultado,
    					resultadoRegistrosModificados.estadoAsistencias,fechasClaseElegida)
    				.then(function(response){
	    				if(response.result)	{
	    					var registrosActualizados = response.data.registrosActualizados;
							angular.forEach(registrosActualizados,function(value){							
								
								var tempAsis = $scope.asistencias[value.indiceFront].asistencias;

								angular.forEach(value.asistencias,function(asis,key){
									tempAsis[key] = asis;
								});

								$scope.asistencias[value.indiceFront]= value;
								$scope.asistencias[value.indiceFront].asistencias = tempAsis;
								
							});
							$scope.copy_asistencias = angular.copy($scope.asistencias);
							
							$scope.alert = {};
							$scope.alert.content = "Asistencias registradas con exito";
							$scope.alert.type='alert alert-color-verde';                      
							$scope.alert.placement='green-alert final-state';
							$scope.alert.duration = 3;
							$alert($scope.alert);
						}else{

							$scope.alert={};
							$scope.alert.content = "Error en el servidor.";
							$scope.alert.type = 'alert alert-color-red ';
							$scope.alert.placement='green-alert final-state';
							$scope.alert.duration = 3;
							$alert($scope.alert);

						}
						blockUI.stop();
    				});
    			}else{
    				$window.scrollTo(0,0);
    				$scope.alert = {};
					$scope.alert.content = "No ha cambiado ninguna asistencia.";
					$scope.alert.type='alert alert-color-celeste';                      
					$scope.alert.placement='green-alert final-state';
					$scope.alert.duration = 3;
					$alert($scope.alert);
    			}

    			
    		}
    	}

    	$scope.exportarAsistenciasPDF = function(){

    		if($scope.asistencias==null || $scope.asistencias==undefined){
    			return;
    		}

    		if($scope.asistencias.length>0 && $scope.fechasClaseElegida.length>0){

				var columns=[];
				var data=[];

				columns.push({title: "N°", key: "n"});
				columns.push({title: "Codigo", key: "cod"});
				columns.push({title: "Alumno", key: "nombre"});

				angular.forEach( $scope.fechasClaseElegida, function(reg){
					
					columns.push({title: reg.fecha.format('DD/MM')+"\n"+reg.intervaloClase+"\n"+reg.fecha.format('dd'), key: reg.idAsistencia});
				} );

				columns.push({title: "% Inasistencia(*)", key: "porc"});

				angular.forEach( $filter('orderBy')($scope.asistencias, 'aiAlumnoAsistencia.aiAlumno.apellidoPaterno'), function(reg,index){
					var alumno = reg.aiAlumnoAsistencia.aiAlumno;
					
					var newElement = { 	"n": index+1,  
						"cod": reg.aiAlumnoAsistencia.aiAlumno.aiAlumnoReg.codigo,
						"nombre" : $scope.nombreCompleto(alumno.apellidoPaterno,alumno.apellidoMaterno,alumno.nombre),
						"porc" : reg.aiAlumnoMatriculaCurso.porcentajeInasistencia + "% (" +reg.clasesAsistidas+"/"+reg.clasesTotales+")"
					};

					angular.forEach( $scope.fechasClaseElegida, function(fecha){
						newElement[fecha.idAsistencia] = convertirAsistenciaASimbolo(reg.asistencias[fecha.idAsistencia]);
					});

					data.push(newElement);				

				});

				var cordonBleuLogoImg = "data:image/png;base64,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";

				var doc = new jsPDF('l', 'pt','a4');
				var actualMonthText = $scope.selectedMonth.format('MMMM');
				var nombreCompletoDocente = $scope.nombreCompleto(Auth.user.apellidoPaterno,Auth.user.apellidoMaterno,Auth.user.nombre);
				var verticalMargin = 20;
				var nombreCurso = $scope.claseEscogida.aiCurso.nombre;
				var tipoSesionText = $scope.claseEscogida.tipoSesion;
				if(tipoSesionText=='T'){
					tipoSesionText = 'TEORÍA';
				}else if(tipoSesionText == 'P'){
					tipoSesionText = 'PRÁCTICA';
				}

				if(nombreCurso.length > 45) nombreCurso = nombreCurso.substring(0,45);

				doc.setFontSize(20);
				doc.text('Listado Asistencia - '+ actualMonthText, 300+actualMonthText.length, 35+verticalMargin);
				doc.setFontSize(15);
				doc.text('Docente:' , 50, 80+verticalMargin);
				doc.text('Curso:', 50, 100+verticalMargin);
				doc.text('Generado:' , 50, 120+verticalMargin);
				
				doc.text(Auth.user.codigo +" - "+nombreCompletoDocente , 150, 80+verticalMargin);
				doc.text(nombreCurso+' - '+tipoSesionText, 150, 100+verticalMargin);
				doc.text(moment($rootScope.currentTime).format('dddd, D MMMM YYYY, h:mm a'), 150, 120+verticalMargin);

				doc.setFontSize(12);
				doc.text('Leyenda',700,60+verticalMargin);
				doc.setFontSize(10);
				doc.text('A:  Asistio',700,80+verticalMargin);
				doc.text('T:  Tardanza',700,100+verticalMargin);
				doc.text('NR: No Registrado',700,120+verticalMargin);

				doc.setFontSize(8);
				doc.text('(*)Número de clases totales = CLASES TEÓRICAS + CLASES PRÁCTICAS',520,565);

				doc.rect(690,65+verticalMargin, 100, 60);

				doc.addImage(cordonBleuLogoImg, 'PNG', 40, 15, 100, 30);

				doc.autoTable(columns, data,  {margins: {horizontal: 40, top: 40, bottom: 40,firstPageTop:140+verticalMargin }});
				
				doc.save('listado_asistencia.pdf');

    		}
    	}

    	init();

    };

    app.register.controller('AsistenciaMultipleController', ['$scope', '$timeout', '$window','$alert','$location','$rootScope','$sessionStorage','$filter','blockUI','asistenciaService','Auth','orderByFilter',asistenciaController]);
    
});

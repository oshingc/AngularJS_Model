'use strict';

define(['app'], function (app) {

    var notasAlumnosController = function ($scope, $location ,$compile, $sessionStorage, Auth, $alert, NotasAlumnosService, HorarioService) {
        
        var appTitle = 'NotasAlumnos';

        $scope.clase = null;
        $scope.nota=0;
        $scope.tipo = 2;
        $scope.practicasP = [];
        $scope.practicasT = [];
        $scope.alert = {
            "content": "Datos actualizados ",
            "type": "success",
            "placement": "top-right"
        };
        $scope.tooltip = {
            'title':"Existen cambios sin guardar",
            'checked':false
        };
        $scope.loading = false;

        var tabPath = 'views/template/Notas/';
        var prueba = false;
        var CopyDataDetallesT;
        var CopyDataDetallesP;
        var change = {};

        var pesos = {
            "promFinal" : "pesoFfin",
            "promFinalP" : "pesoFPra",
            "promFinalT" : "pesoFTeo",
            "promParcial" : "pesoFpar",
            "promParcialP" : "pesoParPra",
            "promParcialT" : "pesoParTeo",
            "promPractica" : "pesoFpr",
            "promPracticaP" : "pesoPrPra",
            "promPracticaT" : "pesoPrTeo"
        };

        $scope.aprobado = function(nota){
            if(nota < $scope.minimo){
                return false;
            }
            else{
                return true;
            }
        }

        /*creación de los tabs (promedio, teoria, practica) para la vista de notas*/

        $scope.initTablas = function(cursoT, cursoP){
            $scope.nroPrTeorico = $scope.alumnos[0].aiMallaCurricular.nroPrTeorico;
            $scope.nroPrPractica = $scope.alumnos[0].aiMallaCurricular.nroPrPractica;
            console.log($scope.nroPractica);
            $scope.tabs = [
                {
                  "title": "Promedios",
                  "template":tabPath + "Promedios.html"               
                },
                
            ];
            if(cursoT){
                $scope.tabs.push({
                    "title": "Teoría",
                    "template": tabPath + "Teoria.html"
                });
                    
            }
            if(cursoP){
                $scope.tabs.push({
                    "title": "Práctica",
                    "template": tabPath + "Practica.html"
                });
            }
            $scope.practicasT = {};
            $scope.practicasP = {};

            $scope.tabs.activeTab = 0;
            $("body").css("cursor", "default");
        };

        /*Edición de notas de practicas segun un alumno, la nota ingresada, 
            el número de práctica, el tipo de nota(practica teoria)
            Se validan los valores que entran*/
        $scope.insertNotaDetalle = function(alumno, nota, nro, tipoNota){
            //tipo de nota teoría(1) o práctica(2)
            if(tipoNota == 1){
                letraNota = 'T';
            } else{
                letraNota = 'P';
            }
            //validación si la nota aún no ha sido guardada
            if($scope['notaDis'+letraNota][alumno.idAlumnoMatriculaCurso][nro].nota == null){

                var i = 0, j = 0, sum = 0, notaEdit, flag =false, letraNota;

                change[alumno.idAlumnoMatriculaCurso.toString()]['change'+letraNota] = 1;
                change[alumno.idAlumnoMatriculaCurso.toString()]['changePPr'] = 1;

                //Si son valores indefinidos, queda en blanco
                if(nota === undefined || nota === ''){
                    flag = true;
                }

                nota = parseInt(nota);

                if(flag){
                    nota = null;
                    change[alumno.idAlumnoMatriculaCurso.toString()]['change'+letraNota] = 0;
                    change[alumno.idAlumnoMatriculaCurso.toString()].changePPr = 0;
                }

                else{
                    //si esta fuera de rango o no es unnuúmero, vuelve al valor anterior
                    if(nota >20 || nota<0 || typeof nota != 'number'||isNaN(nota)){
                        
                        if(tipoNota == 2){
                            notaEdit = CopyDataDetallesP[alumno.idAlumnoMatriculaCurso][nro];
                        }
                        else{
                            notaEdit = CopyDataDetallesT[alumno.idAlumnoMatriculaCurso][nro];    
                        }

                        nota = notaEdit.nota;
                    }

                }
                if(tipoNota == 1){
                    $scope.practicasT[alumno.idAlumnoMatriculaCurso][nro].nota = nota;
                    for(i = 0; i < $scope.practicasT[alumno.idAlumnoMatriculaCurso].length; i++){
                        if($scope.practicasT[alumno.idAlumnoMatriculaCurso][i].nota != null){
                            sum = sum + conversionNaNToZero($scope.practicasT[alumno.idAlumnoMatriculaCurso][i].nota);
                            j++;
                        }
                    }
                    alumno.aiAlumnoMatriculaCursoNota['promPracticaT'] = conversionNaNToZero(Math.round(((sum/j)) * 100) / 100);
                }

                if(tipoNota == 2){
                    $scope.practicasP[alumno.idAlumnoMatriculaCurso][nro].nota = nota;
                    for(i = 0; i < $scope.practicasP[alumno.idAlumnoMatriculaCurso].length; i++){
                        if($scope.practicasP[alumno.idAlumnoMatriculaCurso][i].nota != null){
                            sum = sum + conversionNaNToZero($scope.practicasP[alumno.idAlumnoMatriculaCurso][i].nota);
                            j++;
                        }
                    }
                    alumno.aiAlumnoMatriculaCursoNota['promPracticaP'] = conversionNaNToZero(Math.round(((sum/j)) * 100) / 100);
                }

                //Si se ha editado activa el boton guardar
                var flagCambioTipo = false;
                change[alumno.idAlumnoMatriculaCurso.toString()]['change'+letraNota] = 0;
                for(i = 0; i < $scope['practicas'+letraNota][alumno.idAlumnoMatriculaCurso].length; i++){
                    if($scope['practicas'+letraNota][alumno.idAlumnoMatriculaCurso][i].nota !=  $scope['notaDis'+letraNota][alumno.idAlumnoMatriculaCurso][i].nota){
                        flagCambioTipo = true;
                        break;
                    }
                }
                if(flagCambioTipo == true){
                    change[alumno.idAlumnoMatriculaCurso.toString()]['change'+letraNota] = 1;
                }
                
                if(change[alumno.idAlumnoMatriculaCurso.toString()].changeT == 0 || change[alumno.idAlumnoMatriculaCurso.toString()].changeP == 0){
                    change[alumno.idAlumnoMatriculaCurso.toString()].changePPr = 0;
                }

                actualizarPromedios(alumno);
                //se guardan valores para posibles cambios erroneos
                CopyDataDetallesT = angular.copy($scope.practicasT);
                CopyDataDetallesP = angular.copy($scope.practicasP);
                cambiosNotas();
            } else{
                $scope.practicasT[alumno.idAlumnoMatriculaCurso][nro].nota = CopyDataDetallesT[alumno.idAlumnoMatriculaCurso][nro].nota;
                $scope.practicasP[alumno.idAlumnoMatriculaCurso][nro].nota = CopyDataDetallesP[alumno.idAlumnoMatriculaCurso][nro].nota;
            }

            
        };

        //edición de las notas de promedio, posee similares validadciones que en practica
        $scope.update = function(id, nota, atributo){           
            if((tipoCursoHabilitado($scope.alumnos[id],atributo.charAt(atributo.length-1))==true 
                || atributo == 'promFinal' || atributo == 'promParcial') 
                && ($scope.DataInicial[id].aiAlumnoMatriculaCursoNota[atributo] == null || $scope.DataInicial[id].aiAlumnoMatriculaCursoNota[atributo] === undefined)){

                var flag =false;
                
                change[$scope.alumnos[id].idAlumnoMatriculaCurso.toString()]['changePr'] = 1;
                
                if(nota === undefined || nota === ''){
                    flag = true;
                }
                
                nota = parseInt(nota);

                if(flag){
                    nota = null;
                    change[$scope.alumnos[id].idAlumnoMatriculaCurso.toString()]['changePr'] = 0;
                }
                else{
                    if(nota >20 || nota<0 || typeof nota != 'number'||isNaN(nota)){
                        nota = $scope.CopyData[id].aiAlumnoMatriculaCursoNota[atributo];
                    }

                }

                $scope.alumnos[id].aiAlumnoMatriculaCursoNota[atributo] = nota;

                if($scope.DataInicial[id].aiAlumnoMatriculaCursoNota.promParcialT != $scope.alumnos[id].aiAlumnoMatriculaCursoNota.promParcialT){
                    change[$scope.alumnos[id].idAlumnoMatriculaCurso.toString()]['changePr'] = 1;
                }else if($scope.DataInicial[id].aiAlumnoMatriculaCursoNota.promParcialP != $scope.alumnos[id].aiAlumnoMatriculaCursoNota.promParcialP){
                   change[$scope.alumnos[id].idAlumnoMatriculaCurso.toString()]['changePr'] = 1;
                }else if($scope.DataInicial[id].aiAlumnoMatriculaCursoNota.promFinalT != $scope.alumnos[id].aiAlumnoMatriculaCursoNota.promFinalT){
                    change[$scope.alumnos[id].idAlumnoMatriculaCurso.toString()]['changePr'] = 1;
                }else if($scope.DataInicial[id].aiAlumnoMatriculaCursoNota.promFinalP != $scope.alumnos[id].aiAlumnoMatriculaCursoNota.promFinalP){
                    change[$scope.alumnos[id].idAlumnoMatriculaCurso.toString()]['changePr'] = 1;
                }
                else{
                    change[$scope.alumnos[id].idAlumnoMatriculaCurso.toString()]['changePr'] = 0;
                }

                $scope.CopyData[id].aiAlumnoMatriculaCursoNota[atributo] = nota;
                actualizarPromedios($scope.alumnos[id]);
                
                cambiosNotas();

            } else{
                $scope.alumnos[id].aiAlumnoMatriculaCursoNota[atributo] = $scope.CopyData[id].aiAlumnoMatriculaCursoNota[atributo];
            }
        };

        //guarda los cambios (en caso de precticas las inserta), sólo si es que existen
        $scope.save = function(){
            if($scope.cambios == true){
                NotasAlumnosService.updateNotas($scope.alumnos);
                saveNotasDetalles('T');
                saveNotasDetalles('P');
                $scope.cambios = false;
                $scope.DataInicial = angular.copy($scope.alumnos);
                $scope.notaDisT = angular.copy($scope.practicasT);
                $scope.notaDisP = angular.copy($scope.practicasP);
            }
        };

        //habilita o no un campo segun si en la BD ya estaba previamente con algun valor
        $scope.esDisable = function(id, atributo){

            var alumnoEdit = $scope.DataInicial[id];
            if(alumnoEdit.aiAlumnoMatriculaCursoNota[atributo] === undefined){
                return false;
            }

            return true;
        };

        $scope.showAlert = function(){
            $alert($scope.alert);
        }

        function cambiosNotas(){
            var i;
            $scope.cambios = false;
            for(i = 0; i < $scope.alumnos.length; i++){
                if(change[$scope.alumnos[i].idAlumnoMatriculaCurso.toString()]['changeT'] == 1
                 || change[$scope.alumnos[i].idAlumnoMatriculaCurso.toString()]['changePPr'] == 1 
                 || change[$scope.alumnos[i].idAlumnoMatriculaCurso.toString()]['changePr'] == 1
                 || change[$scope.alumnos[i].idAlumnoMatriculaCurso.toString()]['changeP'] == 1){
                    $scope.cambios = true;
                }
            }
        }

        function tipoCursoHabilitado(alumno,atributo){
            if((atributo == 'T' && alumno.teoria == true) || (atributo == 'P' && alumno.practica == true)){
                return true;
            }
            return false;
        }

        function conversionNaNToZero(number){
            if(isNaN(number) || number == null){
                return 0;
            }
            return number;
        };

        function copiarNotas(notas, tipoP){
            var j;
            for(j = 0; j < notas.length; j++){
                var tempNota = $scope['practicas'+tipoP][notas[j].aiAlumnoMatriculaCurso.idAlumnoMatriculaCurso.toString()][(notas[j].nroPractica-1).toString()];
                tempNota.nota=notas[j].nota;
                tempNota.idAlumnoNotaDetalle=notas[j].idAlumnoNotaDetalle;
            }
        }

        function saveNotasDetalles(tipoP){
             var i, j, notasAlu, datos = [];
            for(j = 0; j < $scope.alumnos.length; j++){
                notasAlu = $scope['practicas'+tipoP][$scope.alumnos[j].idAlumnoMatriculaCurso];
                for(i = 0; i <notasAlu.length; i++){
                    if(notasAlu[i].nota != null && notasAlu[i].idAlumnoNotaDetalle == null){
                        datos.push(notasAlu[i]);
                    }
                }
                
            }
            NotasAlumnosService.insertNotasDetalles(datos,$scope);
        }

        //actualiza los promedios cada vez que cambia un valor
        function actualizarPromedios(alumno){
            var flag1 = false, flag2 = false; //flags para reconocer cuando modificar el promedio
            var notasAlu = alumno.aiAlumnoMatriculaCursoNota;
            if($scope.tipo == 1){

                var notaT = conversionNaNToZero(notasAlu.promPracticaT);
                if(notaT==null){
                    flag1=true
                }
                alumno.aiAlumnoMatriculaCursoNota['promPractica'] = Math.round((notaT) * 100) / 100;
            }
            if($scope.tipo == 2){
                var notaP = conversionNaNToZero(notasAlu.promPracticaP);
                var notaT = conversionNaNToZero(notasAlu.promPracticaT);
                alumno.aiAlumnoMatriculaCursoNota['promPractica'] = Math.round(((notaP+notaT)/2) * 100) / 100;

                notaP = null;
                notaT = null;

                notaP = conversionNaNToZero(notasAlu.promParcialP);
                notaT = conversionNaNToZero(notasAlu.promParcialT);
                if(notasAlu.promParcialP ==null || notasAlu.promParcialT == null){
                    flag2 = true;
                    alumno.aiAlumnoMatriculaCursoNota['promParcial'] = null;
                }else{
                    alumno.aiAlumnoMatriculaCursoNota['promParcial'] = Math.round(((notaP+notaT)/2) * 100) / 100;    
                }
                

                notaP = null;
                notaT = null;                

                notaP = conversionNaNToZero(notasAlu.promFinalP);
                notaT = conversionNaNToZero(notasAlu.promFinalT);
                
                if(notasAlu.promFinalP == null || notasAlu.promFinalT == null){
                    flag2 = true;
                    alumno.aiAlumnoMatriculaCursoNota['promFinal'] = null;
                }else{
                    alumno.aiAlumnoMatriculaCursoNota['promFinal'] = Math.round(((notaP+notaT)/2) * 100) / 100;   
                }
                    
            }
            if(!flag1 && !flag2){
                var promPr = alumno.aiAlumnoMatriculaCursoNota.promPractica*alumno.aiMallaCurricular[pesos.promPractica];
                var promPa = alumno.aiAlumnoMatriculaCursoNota.promParcial*alumno.aiMallaCurricular[pesos.promParcial];
                var promF = alumno.aiAlumnoMatriculaCursoNota.promFinal*alumno.aiMallaCurricular[pesos.promFinal];

                promPr = conversionNaNToZero(promPr);
                promPa = conversionNaNToZero(promPa);
                promF = conversionNaNToZero(promF);
                
                alumno.aiAlumnoMatriculaCursoNota.promedio =  Math.round((promPr+promPa+promF) * 100) / 100;

                if(alumno.aiAlumnoMatriculaCursoNota.promedio>=$scope.minimo){
                    alumno.aiAlumnoMatriculaCursoNota.aprobado = true;
                    //document.getElementById("notas"+alumno.id+"prom").style.color="black";
                }
                else{
                    alumno.aiAlumnoMatriculaCursoNota.aprobado = false;
                    //document.getElementById("notas"+alumno.id+"prom").style.color="red";
                }
            }
            else{
                alumno.aiAlumnoMatriculaCursoNota.aprobado = null;
                alumno.aiAlumnoMatriculaCursoNota.promedio = null;
            }

        }

        //Obtiene notas desde una BD con una lista de alumnos
        $scope.obtenerNotas = function(){
            $scope.loading=prueba;
            var i, cursoP = false, cursoT = false;
            $scope.tabs = [];
            $scope.notasDetalle = null;
            $scope.notaDisP = null;
            $scope.notaDisT = null;
            $scope.nalumnos = $sessionStorage['alumnos'];
            $scope.clase = $sessionStorage['clase'];
            if($scope.clase != null){
                $("body").css("cursor", "wait");
                NotasAlumnosService.obtenerAlumnos($scope,$scope.clase.idCurso,$scope.nalumnos).then(function(data){
                    $scope.tipo = $scope.clase.tipoCurso;
                    $scope.alumnos = data;
                    $scope.minimo = $scope.alumnos[0].aiMallaCurricular.aiCarrera.notaMinimaAprob-0.5;
                    $scope.periodo = $scope.alumnos[0].aiMallaCurricular.aiPeriodo.idPeriodo;
                    $scope.CopyData = angular.copy($scope.alumnos);
                    $scope.DataInicial = angular.copy($scope.alumnos);
                    for(i = 0; i < $scope.alumnos.length; i++){
                        change[$scope.alumnos[i].idAlumnoMatriculaCurso.toString()] = {};
                        if($scope.alumnos[i].teoria == true){
                            cursoT = true;
                        }
                        if($scope.alumnos[i].practica == true){
                            cursoP = true;
                        }
                    }
                    $scope.initTablas(cursoT, cursoP);
                    $scope.loading=false;
                });
            }
            else{
                $scope.alumnos = null;
                $scope.alumno = null;
            }
        };

        //Obtiene las notas de práctica
        $scope.$watch('tabs.activeTab', function(){
            if($scope.tabs.activeTab > 0 && $scope.notasDetalle == null){
                $scope.loading=prueba;
                $("body").css("cursor", "wait");
                var i,j,listaIdAlumnoMatriculaCurso = [];
                var notaAlu;
                for(j = 0; j < $scope.alumnos.length; j++){
                    listaIdAlumnoMatriculaCurso.push($scope.alumnos[j].idAlumnoMatriculaCurso);
                }
                NotasAlumnosService.getNotasDetalles(listaIdAlumnoMatriculaCurso).then(function(data){
                    $scope.notasDetalle = data;
                    for(j = 0; j < $scope.alumnos.length; j++){
                        listaIdAlumnoMatriculaCurso.push($scope.alumnos[j].idAlumnoMatriculaCurso);
                        notaAlu = [];
                        for(i = 0; i < $scope.nroPrTeorico;i++){
                            notaAlu.push({
                                'idAlumnoNotaDetalle': null,
                                'aiPeriodo':{
                                    'idPeriodo': $scope.periodo
                                },
                                'aiDocente': null,
                                'aiAlumnoMatriculaCurso':{
                                    'idAlumnoMatriculaCurso': $scope.alumnos[j].idAlumnoMatriculaCurso
                                },
                                'tipoPractica':1,
                                'nroPractica':i+1,
                                'nota':null
                            });
                        }
                        $scope.practicasT[$scope.alumnos[j].idAlumnoMatriculaCurso.toString()] = notaAlu;
                        notaAlu = [];
                        if($scope.nroPrPractica > 0){
                            for(i = 0; i < $scope.nroPrPractica;i++){
                                notaAlu.push({
                                    'idAlumnoNotaDetalle': null,
                                    'aiPeriodo':{
                                        'idPeriodo': $scope.periodo
                                    },
                                    'aiDocente': null,
                                    'aiAlumnoMatriculaCurso':{
                                        'idAlumnoMatriculaCurso': $scope.alumnos[j].idAlumnoMatriculaCurso
                                    },
                                    'tipoPractica':2,
                                    'nroPractica':i+1,
                                    'nota':null
                                });
                            }
                            $scope.practicasP[$scope.alumnos[j].idAlumnoMatriculaCurso.toString()] = notaAlu;
                        }
                    }
                    copiarNotas(data.notasTeoria,'T');
                    copiarNotas(data.notasPractica,'P');
                    CopyDataDetallesT = angular.copy($scope.practicasT);
                    CopyDataDetallesP = angular.copy($scope.practicasP);
                    $scope.notaDisT = angular.copy($scope.practicasT);
                    $scope.notaDisP = angular.copy($scope.practicasP);
                    $("body").css("cursor", "default");
                    $scope.loading=false;
                });
            }
        });


        $scope.obtenerNotas();

    };

    app.register.controller('NotasAlumnosController', ['$scope', '$location', '$compile', '$sessionStorage', 'Auth', '$alert', 'NotasAlumnosService', 'HorarioService', notasAlumnosController]);
});

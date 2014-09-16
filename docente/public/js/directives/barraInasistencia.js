'use strict';

define(['app'], function (app) {

    var barraInasistencia = function () {
        return {
            restrict: 'A',
            scope: {
              ngPorcentaje: '='
            },
            template: '<div class="progress md" title="{{ngPorcentaje}}%"><div class="progress-bar" role="progressbar" aria-valuenow="{{ngPorcentaje}}" aria-valuemin="0" aria-valuemax="30" style="width: {{(ngPorcentaje/30)*100}}%;" data-original-title="" title=""></div></div><div style="height: 18px; margin-top:-18px;text-align: center;">{{ngPorcentaje}}%</div>',      

            link: function(scope, iElement, iAttrs) {
                try{
                    var bar = iElement.children(0).children(0);
                    var barTitle = iElement.children(1);

                    //var random = Math.floor(Math.random() * (35 - 15 + 1)) + 15;
                    //scope.ngPorcentaje = scope.ngPorcentaje + random;

                    if(scope.ngPorcentaje!=undefined || scope.ngPorcentaje!=null){
                        if(scope.ngPorcentaje>=0 && scope.ngPorcentaje<=100){
                            if(scope.ngPorcentaje<=10){
                                bar.addClass('barSuccess');
                                barTitle.addClass('successTag');
                            }else if(scope.ngPorcentaje<=20){
                                bar.addClass('barWarning');
                                barTitle.addClass('warningTag');
                            }else{
                                bar.addClass('barDanger');
                                barTitle.addClass('dangerTag');
                            }
                        }else{
                            scope.ngPorcentaje=0;
                            bar.addClass('barSuccess');
                            barTitle.addClass('successTag');
                        }
                        
                    }else{
                        scope.ngPorcentaje=0;
                        bar.addClass('barSuccess');
                        barTitle.addClass('successTag');
                    }
                }catch(err){
                    console.log(err);
                }              
            }
        };
    };


    app.directive('ngBarrainasistencia', barraInasistencia);

});

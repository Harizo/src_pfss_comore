(function ()
{
    'use strict';

    var tab = [];
  var mytoast = null;
    angular
        .module('fuse')
        .controller('ToastCtrl', ToastCtrl)
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming, apiFactory, $location, $mdToast, $cookieStore,$mdDialog)
    {
        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;
        var id_user = $cookieStore.get('id');

        if (id_user) 
        {

            apiFactory.getParamsDynamic("Contrat_ugp_agex/index?get_mdp_en_retard=true").then(function(result)
            {
                vm.nbr_mdp_en_retard = result.data.response;
                tab = vm.nbr_mdp_en_retard ;

                    if (tab.length > 0) 
                    {
                        /*$mdToast.show({
                        hideDelay: false,
                        position: 'bottom right',
                        controller: 'ToastCtrl',
                        templateUrl: 'app/main/pfss/gerer_mdp/mdtoast.html'
                      }).then(function(result) {
                       
                      }).catch(function(error) {
                        
                      });*/
                        var option = {
                                            closeButton: true,
                                            tapToDismiss: false,
                                            extendedTimeOut:0,
                                            timeOut: 0,
                                            fadeOut:0, 
                                            //positionClass: "toast-bottom-full-width",
                                            onclick: function()
                                            {
                                                afficher_details(); 
                                            }
                        };

                        var toast = toastr.error("Cliquer ici pour plus de détails","FIN CONTRAT ou AVENANT CONTRAT UGP/AGEX",option);
                    }

       
            });
            
        
        /*apiFactory.getAPIgeneraliserREST("contrat_agep/index",'menu','getallcontrat_alert').then(function(result) 
        {
            var resultat = result.data.response;
            console.log(resultat);
            if (parseInt(resultat.length)!=0)
            {   
              mytoast=$mdToast.show({
                        controller: 'Toast_contrat_agepCtrl',
                        templateUrl: 'app/main/pfss/contrat_agep/toast_contrat_agep.html',
                        hideDelay: 0,
                        position: 'top right',
                        locals:{param: resultat}
                      });
                
            }
            
            console.log(resultat);
                    

        });*/
        }

        function afficher_details ()
        {
            $mdDialog.show({
              controller: DialogController,
              templateUrl: 'app/main/pfss/gerer_mdp/dialog_detail_mdtoast.html',
              parent: angular.element(document.body),
              
              clickOutsideToClose:true
            })
        }


       
        
    }

    

    function ToastCtrl($mdToast, $mdDialog, $scope) 
    {

        $scope.nbr_mdp_en_retard = tab.length;
        $scope.closeToast = function() 
        {
          $mdToast.hide();
        };

        $scope.afficher_details = function()
        {
            $mdDialog.show({
              controller: DialogController,
              templateUrl: 'app/main/pfss/gerer_mdp/dialog_detail_mdtoast.html',
              parent: angular.element(document.body),
              
              clickOutsideToClose:true
            })
        }

   
    }

    function DialogController($scope, $mdDialog) 
    {
      
        $scope.selected_item = {};
          $scope.hide = function() {
            $mdDialog.hide();
          };

          $scope.cancel = function() {
            $mdDialog.cancel();

          };

          $scope.answer = function(answer) {

            
            $mdDialog.hide($scope.selected_item);
          };

  

    

        $scope.all_contrat =  tab ;


        $scope.entete_dialog_art = 
        [ 
            
            {"titre":"N° Contrat"},
            {"titre":"Date prévu fin du contrat"}
        ];

        $scope.dtOptions = {
           dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple_numbers',
            retrieve:'true',
            order:[] 
        };
    }
    

})();
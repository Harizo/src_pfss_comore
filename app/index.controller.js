(function ()
{
    'use strict';

    var tab = [];

    angular
        .module('fuse')
        .controller('ToastCtrl', ToastCtrl)
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming, apiFactory, $location, $mdToast, $cookieStore)
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
                        $mdToast.show({
                        hideDelay: 0,
                        position: 'bottom right',
                        controller: 'ToastCtrl',
                        templateUrl: 'app/main/pfss/gerer_mdp/mdtoast.html'
                      }).then(function(result) {
                       
                      }).catch(function(error) {
                        
                      });
                    }
       
            });
            
     
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
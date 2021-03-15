(function ()
{
    'use strict';

    angular
        .module('app.pfss.communaute.beneficiaire')
        .controller('BeneficiaireController', BeneficiaireController);

    /** @ngInject */
    function BeneficiaireController($scope, $mdDialog, apiFactory, $state, $cookieStore, apiUrl, apiUrlbase)
    {
        var vm = this;
		vm.selectedItem = {} ;
		vm.allBeneficiaire = [] ;                            
        vm.show_bouton_preselection= false; 
        vm.affiche_load = true;
        vm.dtOptions = {
            dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple',
            autoWidth: true ,
            order:[]           
          };
          apiFactory.getAPIgeneraliserREST("communaute/index","menu","getcommunautebeneficiaire").then(function success(response)
        {
            vm.allBeneficiaire=response.data.response;
            console.log(vm.allBeneficiaire);
            vm.affiche_load = false;
        });

        vm.beneficiaire_column =
        [
            {titre:"Zip"},
            {titre:"Commune"},
            {titre:"Code"},
            {titre:"Libelle"},
            {titre:"Nombre personne"},
            {titre:"Representant"},
            {titre:"Téléphone"}
        ];


        vm.selection= function (item)
        {     
            vm.selectedItem = item;                          
            vm.show_bouton_preselection= true; 
            
        };
        $scope.$watch('vm.selectedItem', function()
        {
            if (!vm.allBeneficiaire) return;
            vm.allBeneficiaire.forEach(function(item)
            {
                item.$selected = false;
            });
            vm.selectedItem.$selected = true;
        });
        

        vm.preselection= function ()
        {
            
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de vouloir faire cet action ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('oui')
                    .cancel('annuler');
            $mdDialog.show(confirm).then(function()
            {  
                maj_statu_insert_in_base(vm.selectedItem,0,1,"PRESELECTIONNE");
            }, function() {
            });
        }
        function maj_statu_insert_in_base(entite,suppression,maj_statu,statu)
        {  
			//add
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var datas = $.param({
				supprimer: suppression,
                maj_statu: maj_statu,
				id: entite.id,      
				statut: statu
			});       
			//factory
			apiFactory.add("communaute/index",datas, config).success(function (data)
			{
				vm.allBeneficiaire = vm.allBeneficiaire.filter(function(obj)
                {
                    return obj.id !== entite.id;
                });                         
            vm.show_bouton_preselection= false; 
			}).error(function (data)
            {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
        } 
		
    }
})();
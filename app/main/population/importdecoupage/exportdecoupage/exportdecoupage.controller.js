(function ()
{
    'use strict';

    angular
        .module('app.population.importdecoupage.exportdecoupage')
        .controller('ExportdecoupageController', ExportdecoupageController);
    /** @ngInject */
    function ExportdecoupageController($mdDialog, $scope, apiFactory, $state,apiUrl)  {
		var vm = this;
		var NouvelItem=false;
		var currentItem;
		vm.selectedItem = {} ;
		vm.allregion = [] ;     
		//variale affichage bouton nouveau
		vm.afficherboutonnouveau = 1 ;
		//variable cache masque de saisie
		vm.affichageMasque = 0 ;
		vm.cliquable=1;
		vm.affiche_load=true;
		//style
		vm.dtOptions = {
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple',
			autoWidth: false,
			responsive: true
		};
		//col table
		vm.region_column = [{titre:"Code"},{titre:"Nom"}];
		apiFactory.getAll("region/index").then(function(result) {
			vm.allregion = result.data.response;  
			vm.affiche_load=false;
		});
 		vm.showAlert = function(titre,textcontent) {
			// Appending dialog to document.body to cover sidenav in docs app
			// Modal dialogs should fully cover application
			// to prevent interaction outside of dialog
			$mdDialog.show(
			  $mdDialog.alert()
				.parent(angular.element(document.querySelector('#popupContainer')))
				.clickOutsideToClose(false)
				.parent(angular.element(document.body))
				.title(titre)
				.textContent(textcontent)
				.ariaLabel('Alert Dialog Demo')
				.ok('Fermer')
				.targetEvent()
			);
		}      
		vm.selection= function (item) {
			vm.selectedItem = item;
			vm.nouvelItem = item;
			currentItem = JSON.parse(JSON.stringify(vm.selectedItem));
			vm.afficherboutonModifSupr = 1 ;
			vm.affichageMasque = 0 ;
			vm.afficherboutonnouveau = 1 ;
		};
		$scope.$watch('vm.selectedItem', function() {
			if (!vm.allregion) return;
			vm.allregion.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
		});
        vm.Exporter_decoupage = function() {
			vm.cliquable=0;
			vm.affiche_load=true;
			var bla = $.post(apiUrl + "importerdecoupageadministratif/exportdecoupage",{
				repertoire:'exportdecoupage/',
			},function(data){	
				vm.allregion=[];
				vm.cliquable=1;
				if(data.erreur!="") {
					vm.showAlert("ERREUR !",data.erreur);
				} else {
					vm.showAlert("INFORMATION !",'Exporté avec succès. Merci !');						
				}
				vm.allregion=data.donnees;
				vm.affiche_load=false;
			});
        };
    }
})();

(function ()
{
    'use strict';

    angular
        .module('app.population.importdecoupage.importcoordonneescommune')
        .controller('ImportcoordonneescommuneController', ImportcoordonneescommuneController);
    /** @ngInject */
    function ImportcoordonneescommuneController($mdDialog, $scope, apiFactory, $state,apiUrl)  {
		var vm = this;
		var NouvelItem=false;
		var currentItem;
		vm.selectedItem = {} ;
		vm.allcommune = [] ;     
		//variale affichage bouton nouveau
		vm.afficherboutonnouveau = 1 ;
		//variable cache masque de saisie
		vm.affichageMasque = 0 ;
		vm.cliquable=1;
		vm.affiche_load=false;
		//style
		vm.dtOptions = {
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple',
			autoWidth: false,
			responsive: true
		};
		//col table
		vm.commune_column = [{titre:"Code"},{titre:"Nom"}];
		// apiFactory.getAll("commune/index").then(function(result) {
			// vm.allcommune = result.data.response;  
			// vm.affiche_load=false;
		// });
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
			if (!vm.allcommune) return;
			vm.allcommune.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
		});
        vm.Importer_coordonnees_commune = function() {
			vm.cliquable=0;
			vm.affiche_load=true;
			var bla = $.post(apiUrl + "importercoordonneescommune/importcoordonneescommune",{
				repertoire:'importcoordonneescommune/',
				nom_fichier:"limite_commune_mada_trie.xlsx"
			},function(data){	
				vm.allcommune=[];
				vm.cliquable=1;
				if(parseInt(data.nombre_erreur) > 0) {
					var zz="Nombre d'erreur = " + data.nombre_erreur;
					vm.showAlert("ERREUR !",zz);
				} else {
					vm.showAlert("INFORMATION !",'Sans erreur. Merci !');						
				}
				vm.allcommune=data.donnees;
				vm.affiche_load=false;
			});
        };
       vm.Miseajour_coordonnees_commune = function() {
			vm.cliquable=0;
			vm.affiche_load=true;
			var bla = $.post(apiUrl + "importercoordonneescommune/Mise_a_jour_coordonnees",{
				repertoire:'importcoordonneescommune/',
				nom_fichier:"limite_commune_mada_trie.xlsx"
			},function(data){	
				vm.allcommune=[];
				vm.cliquable=1;
				if(parseInt(data) > 0) {
					var zz="Nombre d'enregistrement mis à jour = " + data;
					vm.showAlert("INFORMATION",zz);
				} else {
					vm.showAlert("ERREUR !",'Erreur lors de la mise à jour. Merci !');						
				}
				// vm.allcommune=data.donnees;
				vm.affiche_load=false;
			});
        };
       vm.Miseajour_coordonnees_tronquees = function() {
			vm.cliquable=0;
			vm.affiche_load=true;
			var bla = $.post(apiUrl + "importercoordonneescommune/Miseajour_coordonnees_tronquees",{
				repertoire:'importcoordonneescommune/',
				nom_fichier:"limite_commune_mada_trie.xlsx"
			},function(data){	
				vm.allcommune=[];
				vm.cliquable=1;
				if(parseInt(data) > 0) {
					var zz="Nombre d'enregistrement mis à jour = " + data;
					vm.showAlert("INFORMATION",zz);
				} else {
					vm.showAlert("ERREUR !",'Erreur lors de la mise à jour. Merci !');						
				}
				// vm.allcommune=data.donnees;
				vm.affiche_load=false;
			});
        };
    }
})();

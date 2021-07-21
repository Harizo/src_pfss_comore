(function ()
{
    'use strict';
    angular
        .module('app.pfss.tdb.tdb_act.tdb_act_tdb')
        .controller('TableaudebordController', TableaudebordController);

    /** @ngInject */
    function TableaudebordController(apiFactory, $state, $mdDialog, $scope, serveur_central,$location,$cookieStore) {
		// Déclaration des variables et fonctions
		var vm = this;

		vm.serveur_central = serveur_central ;
		vm.all_tdb =[];
		vm.all_tdb_grande_comores =[];
		vm.all_tdb_grande_comores2 =[];
		vm.all_tdb_grande_comores3 =[];
		vm.all_tdb_anjouan =[];
		vm.all_tdb_anjouan2 =[];
		vm.all_tdb_anjouan3 =[];
		vm.all_tdb_moheli =[];
		vm.all_tdb_moheli2 =[];
		vm.all_tdb_moheli3 =[];
		vm.all_tdb_comores1 =[];
		vm.all_tdb_comores2 =[];
		vm.all_tdb_comores3 =[];
		vm.selectedItemGrande_comores_vague1={};
		vm.selectedItemGrande_comores_vague2={};
		vm.selectedItemGrande_comores_vague3={};
		vm.selectedItemAnjouan_vague1={};
		vm.selectedItemAnjouan_vague2={};
		vm.selectedItemAnjouan_vague3={};
		vm.selectedItemMoheli_vague1={};
		vm.selectedItemMoheli_vague2={};
		vm.selectedItemMoheli_vague3={};
		vm.selectedItemComores1={};
		vm.selectedItemComores2={};
		vm.selectedItemComores3={};
		vm.affiche_load=true;
		//style
		vm.dtOptions = {
		dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
		pagingType: 'simple',
		autoWidth: true,
		// responsive: true
		};
		//col table
		vm.tdb_column_vague =[
		{titre:"Ile"},
		{titre:"Indicateur"},
		{titre:"Nbr Objectif"},
		{titre:"Nbr Réalisa°"},
		{titre:"Taux réalisa°"},
		{titre:"Nbr Village Obj"},
		{titre:"Nbr Village Réal"},
		{titre:"Nbr Village Non-réal"},
		{titre:"% Non-réalisa°"}
		];
		vm.tdb_column_recap =[
		{titre:""},
		{titre:"Indicateur"},
		{titre:"Nbr Objectif"},
		{titre:"Nbr Réalisa°"},
		{titre:"Taux réalisa°"},
		{titre:"Nbr Village Obj"},
		{titre:"Nbr Village Réal"},
		{titre:"Nbr Village Non-réal"},
		{titre:"% Non-réalisa°"}
		];
		vm.loc = $location ;
		vm.url=vm.loc.path();
		// il ne faut pas exécuter 2 procédures stockées en même temps dans php => ERREUR => appel 2 fois :détail et puis recap
		if(vm.url=='/tableaudebord/act/tableau-de-bord') {
			vm.type_tdb="ACT";
			vm.titre =" ACT";
			apiFactory.getAPIgeneraliserREST("tableau_de_bord/index","type_tdb",vm.type_tdb,"tableau_de_bord",1,"detail",1).then(function(result)	{ 
					vm.all_tdb = result.data.response; 
					vm.all_tdb_moheli = vm.all_tdb.filter(function(obj) {
						return obj.ile_id == 1;
					}); 
					vm.all_tdb_moheli2 =angular.copy(vm.all_tdb_moheli);	
					vm.all_tdb_moheli3 =angular.copy(vm.all_tdb_moheli);	
					vm.all_tdb_grande_comores = vm.all_tdb.filter(function(obj) {
						return obj.ile_id == 2;
					});         
					vm.all_tdb_grande_comores2 =angular.copy(vm.all_tdb_grande_comores);	
					vm.all_tdb_grande_comores3 =angular.copy(vm.all_tdb_grande_comores);	
					vm.all_tdb_anjouan = vm.all_tdb.filter(function(obj) {
						return obj.ile_id == 4;
					});         				
					vm.all_tdb_anjouan2 =angular.copy(vm.all_tdb_anjouan);
					vm.all_tdb_anjouan3 =angular.copy(vm.all_tdb_anjouan);
				apiFactory.getAPIgeneraliserREST("tableau_de_bord/index","type_tdb",vm.type_tdb,"tableau_de_bord",1,"recap",1).then(function(result)	{ 
					// ATTENTION :angular.copy utilisé sinon le même enregistrement sera selectionné en même temps dans les 3 vagues
					vm.temporaire =result.data.response;
					vm.all_tdb_comores1 = angular.copy(vm.temporaire); 
					vm.all_tdb_comores2 = angular.copy(vm.temporaire); 
					vm.all_tdb_comores3 = angular.copy(vm.temporaire); 
					vm.affiche_load=false;
				});
			});
		} else if(vm.url=='/tableaudebord/arse/tableau-de-bord') {
			vm.type_tdb="ARSE";
			vm.titre =" ARSE"
			apiFactory.getAPIgeneraliserREST("tableau_de_bord/index","type_tdb",vm.type_tdb,"tableau_de_bord",1).then(function(result)	{ 
					vm.all_tdb = result.data.response; 
					vm.all_tdb_moheli = vm.all_tdb.filter(function(obj) {
						return obj.ile_id == 1;
					});         
					vm.all_tdb_moheli2 =angular.copy(vm.all_tdb_moheli);	
					vm.all_tdb_moheli3 =angular.copy(vm.all_tdb_moheli);	
					vm.all_tdb_grande_comores = vm.all_tdb.filter(function(obj) {
						return obj.ile_id == 2;
					});         
					vm.all_tdb_grande_comores2 =angular.copy(vm.all_tdb_grande_comores);	
					vm.all_tdb_grande_comores3 =angular.copy(vm.all_tdb_grande_comores);	
					vm.all_tdb_anjouan = vm.all_tdb.filter(function(obj) {
						return obj.ile_id == 4;
					});         
					vm.all_tdb_anjouan2 =angular.copy(vm.all_tdb_anjouan);
					vm.all_tdb_anjouan3 =angular.copy(vm.all_tdb_anjouan);
				apiFactory.getAPIgeneraliserREST("tableau_de_bord/index","type_tdb",vm.type_tdb,"tableau_de_bord",1,"recap",1).then(function(result)	{ 
					vm.temporaire =result.data.response;
					// ATTENTION :angular.copy utilisé sinon le même enregistrement sera selectionné en même temps dans les 3 vagues
					vm.all_tdb_comores1 = angular.copy(vm.temporaire); 
					vm.all_tdb_comores2 = angular.copy(vm.temporaire); 
					vm.all_tdb_comores3 = angular.copy(vm.temporaire); 
					vm.affiche_load=false;
				});
			});
		} else if(vm.url=='/tableaudebord/macc/tableau-de-bord') {
			vm.type_tdb="MACC";
			vm.titre =" MACC";
			apiFactory.getAPIgeneraliserREST("tableau_de_bord/index","type_tdb",vm.type_tdb,"tableau_de_bord",1).then(function(result)	{ 
					vm.all_tdb = result.data.response; 
					vm.all_tdb_moheli = vm.all_tdb.filter(function(obj) {
						return obj.ile_id == 1;
					});         
					vm.all_tdb_moheli2 =angular.copy(vm.all_tdb_moheli);	
					vm.all_tdb_moheli3 =angular.copy(vm.all_tdb_moheli);	
					vm.all_tdb_grande_comores = vm.all_tdb.filter(function(obj) {
						return obj.ile_id == 2;
					});         
					vm.all_tdb_grande_comores2 =angular.copy(vm.all_tdb_grande_comores);	
					vm.all_tdb_grande_comores3 =angular.copy(vm.all_tdb_grande_comores);	
					vm.all_tdb_anjouan = vm.all_tdb.filter(function(obj) {
						return obj.ile_id == 4;
					});         
					vm.all_tdb_anjouan2 =angular.copy(vm.all_tdb_anjouan);
					vm.all_tdb_anjouan3 =angular.copy(vm.all_tdb_anjouan);
				apiFactory.getAPIgeneraliserREST("tableau_de_bord/index","type_tdb",vm.type_tdb,"tableau_de_bord",1,"recap",1).then(function(result)	{ 
					// ATTENTION :angular.copy utilisé sinon le même enregistrement sera selectionné en même temps dans les 3 vagues
					vm.temporaire =result.data.response;
					vm.all_tdb_comores1 = angular.copy(vm.temporaire); 
					vm.all_tdb_comores2 = angular.copy(vm.temporaire); 
					vm.all_tdb_comores3 = angular.copy(vm.temporaire); 
					vm.affiche_load=false;
				});
			});
		}		
		vm.calculer_taux=function(realisation,objectif) {
			if(parseFloat(realisation) >0 && parseFloat(objectif)) {
				return Number((( parseFloat(realisation) / parseFloat(objectif) ) * 100).toFixed(2));
			} else {
				return "";
			}
		}
		// Fin type plainte
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
		// Recapitulatif
        vm.selectionComores1= function (item) {     
            vm.selectedItemComores1 = item;
        };
        $scope.$watch('vm.selectedItemComores1', function() {
			if (!vm.all_tdb_comores1) return;
			vm.all_tdb_comores1.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemComores1.$selected = true;
        });
        vm.selectionComores2= function (item) {     
            vm.selectedItemComores2 = item;
        };
        $scope.$watch('vm.selectedItemComores2', function() {
			if (!vm.all_tdb_comores2) return;
			vm.all_tdb_comores2.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemComores2.$selected = true;
        });
        vm.selectionComores3= function (item) {     
            vm.selectedItemComores3 = item;
        };
        $scope.$watch('vm.selectedItemComores3', function() {
			if (!vm.all_tdb_comores3) return;
			vm.all_tdb_comores3.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemComores3.$selected = true;
        });
		// Détail
        vm.selectionGrande_comores_vague1= function (item) {     
            vm.selectedItemGrande_comores_vague1 = item;
        };
        $scope.$watch('vm.selectedItemGrande_comores_vague1', function() {
			if (!vm.all_tdb_grande_comores) return;
			vm.all_tdb_grande_comores.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemGrande_comores_vague1.$selected = true;
        });
        vm.selectionGrande_comores_vague2= function (item) {     
            vm.selectedItemGrande_comores_vague2 = item;
        };
        $scope.$watch('vm.selectedItemGrande_comores_vague2', function() {
			if (!vm.all_tdb_grande_comores2) return;
			vm.all_tdb_grande_comores2.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemGrande_comores_vague2.$selected = true;
        });
        vm.selectionGrande_comores_vague3= function (item) {     
            vm.selectedItemGrande_comores_vague3 = item;
        };
        $scope.$watch('vm.selectedItemGrande_comores_vague3', function() {
			if (!vm.all_tdb_grande_comores3) return;
			vm.all_tdb_grande_comores3.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemGrande_comores_vague3.$selected = true;
        });
		////
        vm.selectionAnjouan_vague1= function (item) {     
            vm.selectedItemAnjouan_vague1 = item;
        };
        $scope.$watch('vm.selectedItemAnjouan_vague1', function() {
			if (!vm.all_tdb_anjouan) return;
			vm.all_tdb_anjouan.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemAnjouan_vague1.$selected = true;
        });
        vm.selectionAnjouan_vague2= function (item) {     
            vm.selectedItemAnjouan_vague2 = item;
        };
        $scope.$watch('vm.selectedItemAnjouan_vague2', function() {
			if (!vm.all_tdb_anjouan2) return;
			vm.all_tdb_anjouan2.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemAnjouan_vague2.$selected = true;
        });
        vm.selectionAnjouan_vague3= function (item) {     
            vm.selectedItemAnjouan_vague3 = item;
        };
        $scope.$watch('vm.selectedItemAnjouan_vague3', function() {
			if (!vm.all_tdb_anjouan3) return;
			vm.all_tdb_anjouan3.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemAnjouan_vague3.$selected = true;
        });
		////
        vm.selectionMoheli_vague1= function (item) {     
            vm.selectedItemMoheli_vague1 = item;
        };
        $scope.$watch('vm.selectedItemMoheli_vague1', function() {
			if (!vm.all_tdb_moheli) return;
			vm.all_tdb_moheli.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemMoheli_vague1.$selected = true;
        });
        vm.selectionMoheli_vague2= function (item) {     
            vm.selectedItemMoheli_vague2 = item;
        };
        $scope.$watch('vm.selectedItemMoheli_vague2', function() {
			if (!vm.all_tdb_moheli2) return;
			vm.all_tdb_moheli2.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemMoheli_vague2.$selected = true;
        });
        vm.selectionMoheli_vague3= function (item) {     
            vm.selectedItemMoheli_vague3 = item;
        };
        $scope.$watch('vm.selectedItemMoheli_vague3', function() {
			if (!vm.all_tdb_moheli3) return;
			vm.all_tdb_moheli3.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemMoheli_vague3.$selected = true;
        });		
    }
  })();

(function ()
{
    'use strict';
    angular
        .module('app.pfss.tdb.tdb_act.tdb_act_objectif')
        .controller('ObjectifTableaudebordController', ObjectifTableaudebordController);

    /** @ngInject */
    function ObjectifTableaudebordController(apiFactory, $state, $mdDialog, $scope, serveur_central,$location,$cookieStore) {
		// Déclaration des variables et fonctions
		var vm = this;

		vm.serveur_central = serveur_central ;
		var NouvelItemObjectif_tdb=false;
		var currentItemObjectif_tdb;
		vm.selectedItemObjectif_tdb = {} ;
		// vm.all_tdb =[];
		//style
		vm.dtOptions = {
		dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
		pagingType: 'simple',
		autoWidth: true,
		// responsive: true
		};
		//col table
		vm.objectif_column =[
		{titre:"Ile"},
		{titre:"Indicateur"},
		{titre:"Objectif vague1"},
		{titre:"Nbr Village vague1"},
		{titre:"Objectif vague2"},
		{titre:"Nbr Village vague2"},
		{titre:"Objectif vague3"},
		{titre:"Nbr Village vague3"},
		{titre:"Actions"}
		];
		apiFactory.getAll("ile/index").then(function(result) {
	        vm.all_ile= result.data.response;
		});
		vm.loc = $location ;
		vm.url=vm.loc.path();
		if(vm.url=='/tableaudebord/act/objectif') {
			vm.type_tdb="ACT";
			vm.titre =" ACT";
			apiFactory.getAPIgeneraliserREST("tableau_de_bord/index","type_tdb",vm.type_tdb).then(function(result)	{ 
				vm.all_tdb = result.data.response; 
			});
		} else if(vm.url=='/tableaudebord/arse/objectif') {
			vm.type_tdb="ARSE";
			vm.titre =" ARSE"
			apiFactory.getAPIgeneraliserREST("tableau_de_bord/index","type_tdb",vm.type_tdb).then(function(result)	{ 
				vm.all_tdb = result.data.response; 
			});
		} else if(vm.url=='/tableaudebord/macc/objectif') {
			vm.type_tdb="MACC";
			vm.titre =" MACC";
			apiFactory.getAPIgeneraliserREST("tableau_de_bord/index","type_tdb",vm.type_tdb).then(function(result)	{ 
				vm.all_tdb = result.data.response; 
			});
		}		
		apiFactory.getAll("indicateur_tdb/index").then(function(result)	{ 
			vm.all_indicateur = result.data.response; 
		});
	// Debut type plainte
        vm.insert_in_base= function(tableau,suppression) {  
			//add			
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var getId = 0;
			if (NouvelItemObjectif_tdb==false) {
			   getId = vm.selectedItemObjectif_tdb.id; 
			} 
			var datas = $.param({
				supprimer:suppression,
				id:getId,      
				type_tdb: vm.type_tdb,      
				ile_id: tableau.ile_id,      
				indicateur_id: tableau.indicateur_id,      
				objectif_nombre_vague1: tableau.objectif_nombre_vague1,
				objectif_village_vague1: tableau.objectif_village_vague1,
				objectif_nombre_vague2: tableau.objectif_nombre_vague2,
				objectif_village_vague2: tableau.objectif_village_vague2,
				objectif_nombre_vague3: tableau.objectif_nombre_vague3,
				objectif_village_vague3: tableau.objectif_village_vague3,
				rang: tableau.rang,
				visible: tableau.visible,
			});       
			//factory
			apiFactory.add("tableau_de_bord/index",datas, config).success(function (data)	{	
				if (NouvelItemObjectif_tdb == false) {
					if(suppression==0) {
					  vm.selectedItemObjectif_tdb.type_tdb = tableau.type_tdb;
					  vm.selectedItemObjectif_tdb.ile_id = tableau.ile_id;
					  vm.selectedItemObjectif_tdb.indicateur_id = tableau.indicateur_id;
					  vm.selectedItemObjectif_tdb.indicateur = tableau.indicateur;
					  vm.selectedItemObjectif_tdb.objectif_nombre_vague1 = tableau.objectif_nombre_vague1;
					  vm.selectedItemObjectif_tdb.objectif_village_vague1 = tableau.objectif_village_vague1;
					  vm.selectedItemObjectif_tdb.objectif_nombre_vague2 = tableau.objectif_nombre_vague2;
					  vm.selectedItemObjectif_tdb.objectif_village_vague2 = tableau.objectif_village_vague2;
					  vm.selectedItemObjectif_tdb.objectif_nombre_vague3 = tableau.objectif_nombre_vague3;
					  vm.selectedItemObjectif_tdb.objectif_village_vague3 = tableau.objectif_village_vague3;
					  vm.selectedItemObjectif_tdb.rang = tableau.rang;
					  vm.selectedItemObjectif_tdb.visible = tableau.visible;
					  vm.selectedItemObjectif_tdb.$selected = false;
					  vm.selectedItemObjectif_tdb.$edit = false;
					  vm.selectedItemObjectif_tdb ={};
					} else {    
						vm.all_tdb = vm.all_tdb.filter(function(obj) {
							return obj.id !== vm.selectedItemObjectif_tdb.id;
						});
					}
				} else {
					tableau.id=data.response;
					tableau.a_ete_modifie=0;
					NouvelItemObjectif_tdb=false;
				}
				tableau.$selected=false;
				tableau.$edit=false;
			}).error(function (data) {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
        }
        vm.selectionObjectif_tdb= function (item) {     
            vm.selectedItemObjectif_tdb = item;
        };
        $scope.$watch('vm.selectedItemObjectif_tdb', function() {
			if (!vm.all_tdb) return;
			vm.all_tdb.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemObjectif_tdb.$selected = true;
        });
        vm.ajouterObjectif_tdb = function () {
            NouvelItemObjectif_tdb = true ;
			if(vm.all_tdb.length==0) {
				vm.rang=1;
			} else {
				// voir vm.rang dans la fonction modifierIle
			}
		    var items = {
				$edit: true,
				$selected: true,
				supprimer:0,
                type_tdb: vm.type_tdb,
                ile_id: null,
                indicateur: '',
                indicateur_id: null,
                objectif_nombre_vague1: null,
                objectif_village_vague1: null,
                objectif_nombre_vague2: null,
                objectif_village_vague2: null,
                objectif_nombre_vague3: null,
                objectif_village_vague3: null,
                rang: vm.rang,
                visible: 1,
                ile: null,
			};
			vm.all_tdb.push(items);
		    vm.all_tdb.forEach(function(it) {
				if(it.$selected==true) {
					vm.selectedItemObjectif_tdb = it;
				}
			});		
        };
        vm.annulerObjectif_tdb = function(item) {
			if (!item.id) {
				vm.all_tdb.pop();
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItemObjectif_tdb = false;
			item.ile_id = currentItemObjectif_tdb.ile_id;
			item.indicateur_id = currentItemObjectif_tdb.indicateur_id;
			item.indicateur = currentItemObjectif_tdb.indicateur;
			item.objectif_nombre_vague1 = currentItemObjectif_tdb.objectif_nombre_vague1;
			item.objectif_village_vague1 = currentItemObjectif_tdb.objectif_village_vague1;
			item.objectif_nombre_vague2 = currentItemObjectif_tdb.objectif_nombre_vague2;
			item.objectif_village_vague2 = currentItemObjectif_tdb.objectif_village_vague2;
			item.objectif_nombre_vague3 = currentItemObjectif_tdb.objectif_nombre_vague3;
			item.objectif_village_vague3 = currentItemObjectif_tdb.objectif_village_vague3;
			item.rang = currentItemObjectif_tdb.rang;
			item.visible = currentItemObjectif_tdb.visible;
			item.ile = currentItemObjectif_tdb.ile;
			vm.selectedItemObjectif_tdb = {} ;
			vm.selectedItemObjectif_tdb.$selected = false;
       };
        vm.modifierObjectif_tdb = function(item) {
			NouvelItemObjectif_tdb = false ;
			vm.selectedItemObjectif_tdb = item;
			currentItemObjectif_tdb = angular.copy(vm.selectedItemObjectif_tdb);
			$scope.vm.all_tdb.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			item.ile_id = parseInt(vm.selectedItemObjectif_tdb.ile_id);
			item.indicateur_id = parseInt(vm.selectedItemObjectif_tdb.indicateur_id);
			item.indicateur = vm.selectedItemObjectif_tdb.indicateur;
			if(vm.selectedItemObjectif_tdb.objectif_nombre_vague1) {
				item.objectif_nombre_vague1 = parseInt(vm.selectedItemObjectif_tdb.objectif_nombre_vague1);
			} else {
				item.objectif_nombre_vague1 = null;
			}	
			if(vm.selectedItemObjectif_tdb.objectif_village_vague1) {
				item.objectif_village_vague1 = parseInt(vm.selectedItemObjectif_tdb.objectif_village_vague1);
			} else {
				item.objectif_village_vague1 = null;
			}	
			if(vm.selectedItemObjectif_tdb.objectif_nombre_vague2) {
				item.objectif_nombre_vague2 = parseInt(vm.selectedItemObjectif_tdb.objectif_nombre_vague2);
			} else {
				item.objectif_nombre_vague2 = null;
			}	
			if(vm.selectedItemObjectif_tdb.objectif_village_vague2) {
				item.objectif_village_vague2 = parseInt(vm.selectedItemObjectif_tdb.objectif_village_vague2);
			} else {
				item.objectif_village_vague2 = null;
			}	
			if(vm.selectedItemObjectif_tdb.objectif_nombre_vague3) {
				item.objectif_nombre_vague3 = parseInt(vm.selectedItemObjectif_tdb.objectif_nombre_vague3);
			} else {
				item.objectif_nombre_vague3 = null;
			}	
			if(vm.selectedItemObjectif_tdb.objectif_village_vague3) {
				item.objectif_village_vague3 = parseInt(vm.selectedItemObjectif_tdb.objectif_village_vague3);
			} else {
				item.objectif_village_vague3 = null;
			}	
			if(vm.selectedItemObjectif_tdb.visible) {
				item.visible = parseInt(vm.selectedItemObjectif_tdb.visible);
			} else {
				item.visible = null;
			}	
			item.ile = vm.selectedItemObjectif_tdb.ile;
			item.$edit = true;
			console.log(vm.all_tdb);	
        };
        vm.supprimerObjectif_tdb = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() { 
				vm.insert_in_base(vm.selectedItemObjectif_tdb,1);
			}, function() {
			});
        }
		vm.modifierIle = function(item) {
			vm.all_ile.forEach(function(vil) {
				if(parseInt(vil.id)==parseInt(item.ile_id)) {
					item.ile=vil.Ile;
					vm.nontrouvee=false;
				}
			});	
			// rang par ile
			if(vm.all_tdb.length >0) {
				vm.rang=1;
				vm.all_tdb.forEach(function(td) {
					if(parseInt(td.ile_id)==parseInt(item.ile_id) && vm.rang <= td.rang ) {
						vm.rang =parseInt(td.rang) + 1;
					}
				});					
			}	
		}
		vm.modifierIndicateur = function(item) {
			vm.all_indicateur.forEach(function(ind) {
				if(parseInt(ind.id)==parseInt(item.indicateur_id)) {
					item.indicateur = ind.description; 
				}
			});			
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
    }
  })();

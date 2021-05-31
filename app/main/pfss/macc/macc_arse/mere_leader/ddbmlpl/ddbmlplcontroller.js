(function ()
{
    'use strict';

    angular
        .module('app.pfss.macc.macc_arse.mere_leader.ddbmlpl')
        .controller('DdbmlplController', DdbmlplController);
    /** @ngInject */
    function DdbmlplController($mdDialog, $scope, apiFactory, $state,$cookieStore)  {
		var vm = this;
		vm.titrepage ="Ajout Tutelle";
		vm.ajout = ajout ;
		var NouvelItem=false;
		var currentItem;
		vm.selectedItemRaisonvisitedomicile = {} ;     
		vm.selectedItemResolutionvisitedomicile = {} ;     
		vm.selectedItemThemesensibilisation = {} ;     
		vm.selectedItemProjetdugroupe = {} ;
		vm.selectedItemProblemerencontre = {} ;     
		vm.selectedItemResolutionprobleme = {} ;     
		vm.selectedItemEsapcebienetre = {} ;     
		
		vm.allRecordsRaisonvisitedomicile = [] ;     
		vm.allRecordsResolutionvisitedomicile = [] ;     
		vm.allRecordsThemesensibilisation = [] ;    
		vm.allRecordsProjetdugroupe = [] ;     
		vm.allRecordsProblemerencontre = [] ;     
		vm.allRecordsResolutionprobleme = [] ;     
		vm.allRecordsEspacebienetre = [] ;     

		vm.nom_table="raison_visite_domicile";
		vm.cas=1;
		// Récupérer via cookies id utilisateur
		vm.id_utilisateur =$cookieStore.get('id');
		//style
		vm.dtOptions = {
		dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
		pagingType: 'simple',
		autoWidth: false,
		responsive: true
		};
		vm.affiche_load=true;
		//col table
		vm.ddb_column = [{titre:"Description"},{titre:"Actions"}];
		apiFactory.getTable("ddb_mlpl/index","espace_bien_etre").then(function(result){
			vm.allRecordsEspacebienetre = result.data.response;
			apiFactory.getTable("ddb_mlpl/index","resolution_visite_domicile").then(function(result){
				vm.allRecordsResolutionprobleme = result.data.response;
				apiFactory.getTable("ddb_mlpl/index","probleme_rencontres").then(function(result){
					vm.allRecordsProblemerencontre = result.data.response;
					apiFactory.getTable("ddb_mlpl/index","projet_groupe").then(function(result){
						vm.allRecordsProjetdugroupe = result.data.response;
						apiFactory.getTable("ddb_mlpl/index","theme_sensibilisation").then(function(result){
							vm.allRecordsThemesensibilisation = result.data.response;
							apiFactory.getTable("ddb_mlpl/index","resolution_ml_pl").then(function(result){
								vm.allRecordsResolutionvisitedomicile = result.data.response;
								apiFactory.getTable("ddb_mlpl/index","raison_visite_domicile").then(function(result){
									vm.allRecordsRaisonvisitedomicile = result.data.response;
									vm.affiche_load=false;
								});    
							});    
						});    
					});    
				});    
			});    
		});    
		//add historique : consultation DDB Enquete sur ménage
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		};
		var datas = $.param({
			action:"Consultation Données référentielles : ML/PL",
			id_utilisateur:vm.id_utilisateur
		});
		//factory
		apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
		});				
        vm.Select_table= function (nomdetable) {     
            if(parseInt(nomdetable) >0) {
				var nom_de_table=parseInt(nomdetable);
				switch(nom_de_table) {
					case 1:  {
						vm.nom_table="raison_visite_domicile";
						vm.cas=1;
						break;
					}
					case 2:  {
						vm.nom_table="resolution_ml_pl";
						vm.cas=2;
						break;
					}
					case 3:  {
						vm.nom_table="theme_sensibilisation";
						vm.cas=3;
						break;
					}
					case 4:  {
						vm.nom_table="projet_groupe";
						vm.cas=4;
						break;
					}
					case 5:  {
						vm.nom_table="probleme_rencontres";
						vm.cas=5;
						break;
					}
					case 6:  {
						vm.nom_table="resolution_visite_domicile";
						vm.cas=6;
						break;
					}
					case 7:  {
						vm.nom_table="espace_bien_etre";
						vm.cas=7;
						break;
					}
					default: {
						vm.nom_table="raison_visite_domicile";
						vm.cas=1;
						break;
					}
				}				
			} else {
				vm.nom_table="raison_visite_domicile";
				vm.cas=1;
			};
        };
		function ajout(possession,suppression) {
            test_existence (possession,suppression);
        }
        function insert_in_base(possession,suppression) {  
			//add
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var getId = 0;
			if (NouvelItem==false) {
			   getId = possession.id; 
			} 
			var datas = $.param({
				supprimer:suppression,
				id:getId,      
				code: possession.code,
				description: possession.description,
				nom_table: vm.nom_table,
			});       
			//factory
			apiFactory.add("ddb_mlpl/index",datas, config).success(function (data) {
				if (NouvelItem == false) {
					// Update or delete: id exclu                   
					if(suppression==0) {
						switch(vm.cas) {
							case 1:  {
								vm.selectedItemRaisonvisitedomicile.code = possession.code;
								vm.selectedItemRaisonvisitedomicile.description = possession.description;
								vm.selectedItemRaisonvisitedomicile.$selected = false;
								vm.selectedItemRaisonvisitedomicile.$edit = false;
								vm.selectedItemRaisonvisitedomicile ={};
								vm.action="Modification d'un enregistrement de DDB ML/PL : Raison visite domicile" + " ("+ possession.description + ")";
								break;
							}
							case 2:  {
								vm.selectedItemResolutionvisitedomicile.code = possession.code;
								vm.selectedItemResolutionvisitedomicile.description = possession.description;
								vm.selectedItemResolutionvisitedomicile.$selected = false;
								vm.selectedItemResolutionvisitedomicile.$edit = false;
								vm.selectedItemResolutionvisitedomicile ={};
								vm.action="Modification d'un enregistrement de DDB ML/PL : Résolution visite domicile" + " ("+ possession.description + ")";
								break;
							}
							case 3:  {
								vm.selectedItemThemesensibilisation.code = possession.code;
								vm.selectedItemThemesensibilisation.description = possession.description;
								vm.selectedItemThemesensibilisation.$selected = false;
								vm.selectedItemThemesensibilisation.$edit = false;
								vm.selectedItemThemesensibilisation ={};
								vm.action="Modification d'un enregistrement de DDB ML/PL : Thème de sensibilisation" + " ("+ possession.description + ")";
								break;
							}
							case 4:  {
								vm.selectedItemProjetdugroupe.code = possession.code;
								vm.selectedItemProjetdugroupe.description = possession.description;
								vm.selectedItemProjetdugroupe.$selected = false;
								vm.selectedItemProjetdugroupe.$edit = false;
								vm.selectedItemProjetdugroupe ={};
								vm.action="Modification d'un enregistrement de DDB ML/PL : Projet du groupe" + " ("+ possession.description + ")";
								break;
							}
							case 5:  {
								vm.selectedItemProblemerencontre.code = possession.code;
								vm.selectedItemProblemerencontre.description = possession.description;
								vm.selectedItemProblemerencontre.$selected = false;
								vm.selectedItemProblemerencontre.$edit = false;
								vm.selectedItemProblemerencontre ={};
								vm.action="Modification d'un enregistrement de DDB ML/PL : Probleme rencontré" + " ("+ possession.description + ")";
								break;
							}
							case 6:  {
								vm.selectedItemResolutionprobleme.code = possession.code;
								vm.selectedItemResolutionprobleme.description = possession.description;
								vm.selectedItemResolutionprobleme.$selected = false;
								vm.selectedItemResolutionprobleme.$edit = false;
								vm.selectedItemResolutionprobleme ={};
								vm.action="Modification d'un enregistrement de DDB ML/PL : Résolution problème" + " ("+ possession.description + ")";
								break;
							}
							case 7:  {
								vm.selectedItemEsapcebienetre.code = possession.code;
								vm.selectedItemEsapcebienetre.description = possession.description;
								vm.selectedItemEsapcebienetre.$selected = false;
								vm.selectedItemEsapcebienetre.$edit = false;
								vm.selectedItemEsapcebienetre ={};
								vm.action="Modification d'un enregistrement de DDB ML/PL : Espace bien être" + " ("+ possession.description + ")";
								break;
							}
							default: {
								break;
							}
						}	
					} else {    
						switch(vm.cas) {
							case 1:  {
								vm.allRecordsRaisonvisitedomicile = vm.allRecordsRaisonvisitedomicile.filter(function(obj) {
									return obj.id !== vm.selectedItemRaisonvisitedomicile.id;
								});
								vm.action="Suppression d'un enregistrement de DDB ML/PL : Raison visite domicile" + " ("+ possession.description + ")";
								break;
							}
							case 2:  {
								vm.allRecordsResolutionvisitedomicile = vm.allRecordsResolutionvisitedomicile.filter(function(obj) {
									return obj.id !== vm.selectedItemResolutionvisitedomicile.id;
								});
								vm.action="Suppression d'un enregistrement de DDB ML/PL : Résolution visite domicile" + " ("+ possession.description + ")";
								break;
							}
							case 3:  {
								vm.allRecordsThemesensibilisation = vm.allRecordsThemesensibilisation.filter(function(obj) {
									return obj.id !== vm.selectedItemThemesensibilisation.id;
								});
								vm.action="Suppression d'un enregistrement de DDB ML/PL : Thème de sensibilisation" + " ("+ possession.description + ")";
								break;
							}
							case 4:  {
								vm.allRecordsProjetdugroupe = vm.allRecordsProjetdugroupe.filter(function(obj) {
									return obj.id !== vm.selectedItemProjetdugroupe.id;
								});
								vm.action="Suppression d'un enregistrement de DDB ML/PL : Projet du groupe" + " ("+ possession.description + ")";
								break;
							}
							case 5:  {
								vm.allRecordsProblemerencontre = vm.allRecordsProblemerencontre.filter(function(obj) {
									return obj.id !== vm.selectedItemProblemerencontre.id;
								});
								vm.action="Suppression d'un enregistrement de DDB ML/PL : Probleme rencontré" + " ("+ possession.description + ")";
								break;
							}
							case 6:  {
								vm.allRecordsResolutionprobleme = vm.allRecordsResolutionprobleme.filter(function(obj) {
									return obj.id !== vm.selectedItemResolutionprobleme.id;
								});
								vm.action="Suppression d'un enregistrement de DDB ML/PL : Résolution problème" + " ("+ possession.description + ")";
								break;
							}
							case 7:  {
								vm.allRecordsEspacebienetre = vm.allRecordsEspacebienetre.filter(function(obj) {
									return obj.id !== vm.selectedItemEspacebienetre.id;
								});
								vm.action="Suppression d'un enregistrement de DDB ML/PL : Espace bien être" + " ("+ possession.description + ")";
								break;
							}
							default: {
								break;
							}
						}				
					}
				} else {
					possession.id=data.response;	
					NouvelItem=false;
					switch(vm.cas) {
						case 1:  {
							vm.selectedItemRaisonvisitedomicile ={};
							vm.action="Ajout d'un enregistrement de DDB ML/PL : Raison visite domicile" + " ("+ possession.description + ")";
							break;
						}
						case 2:  {
							vm.selectedItemResolutionvisitedomicile ={};
							vm.action="Ajout d'un enregistrement de DDB ML/PL : Occupation de logement" + " ("+ possession.description + ")";
							break;
						}
						case 3:  {
							vm.selectedItemThemesensibilisation ={};
							vm.action="Ajout d'un enregistrement de DDB ML/PL : Thème de sensibilisation" + " ("+ possession.description + ")";
							break;
						}
						case 4:  {
							vm.selectedItemProjetdugroupe ={};
							vm.action="Ajout d'un enregistrement de DDB ML/PL : Projet du groupe" + " ("+ possession.description + ")";
							break;
						}
						case 5:  {
							vm.selectedItemProblemerencontre ={};
							vm.action="Ajout d'un enregistrement de DDB ML/PL : Probleme rencontré" + " ("+ possession.description + ")";
							break;
						}
						case 6:  {
							vm.selectedItemResolutionprobleme ={};
							vm.action="Ajout d'un enregistrement de DDB ML/PL : Résolution problème" + " ("+ possession.description + ")";
							break;
						}
						case 7:  {
							vm.selectedItemEspacebienetre ={};
							vm.action="Ajout d'un enregistrement de DDB ML/PL : Espace bien être" + " ("+ possession.description + ")";
							break;
						}
						default: {
							vm.selectedItemRaisonvisitedomicile ={};
							break;
						}
					}	
				}
				possession.$selected=false;
				possession.$edit=false;
				vm.selectedItem={};
				//add historique : suppresion/modifcation/ajout DDB Enquete sur ménage
				var config = {
					headers : {
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
					}
				};
				var datas = $.param({
					action:vm.action,
					id_utilisateur:vm.id_utilisateur
				});
				//factory
				apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
				});								
			}).error(function (data) {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
        }
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
		// Espace bien etre
        vm.selectionEspacebienetre= function (item) {     
            vm.selectedItemEsapcebienetre = item;
        };
        $scope.$watch('vm.selectedItemEsapcebienetre', function() {
			if (!vm.allRecordsEspacebienetre) return;
			vm.allRecordsEspacebienetre.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemEsapcebienetre.$selected = true;
        });
        vm.ajouterEspacebienetre = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemEsapcebienetre.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsEspacebienetre.push(items);
				vm.allRecordsEspacebienetre.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemEsapcebienetre = it;
					}
				});			
			};
        };
        vm.annulerEspacebienetre = function(item) {
			if (!item.id) {
				vm.allRecordsEspacebienetre.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemEsapcebienetre = {} ;
			vm.selectedItemEsapcebienetre.$selected = false;
       };
        vm.modifierEspacebienetre = function(item) {
			NouvelItem = false ;
			vm.selectedItemEsapcebienetre = item;
			currentItem = angular.copy(vm.selectedItemEsapcebienetre);
			$scope.vm.allRecordsEspacebienetre.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemEsapcebienetre.description = vm.selectedItemEsapcebienetre.description;
			vm.selectedItemEsapcebienetre.$edit = true;	
        };
        vm.supprimerEspacebienetre = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemEsapcebienetre,1);
			}, function() {
			});
        }
		// Espace bien etre
		// Raison visite domicile
        vm.selectionRaisonvisitedomicile= function (item) {     
            vm.selectedItemRaisonvisitedomicile = item;
        };
        $scope.$watch('vm.selectedItemRaisonvisitedomicile', function() {
			if (!vm.allRecordsRaisonvisitedomicile) return;
			vm.allRecordsRaisonvisitedomicile.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemRaisonvisitedomicile.$selected = true;
        });
        vm.ajouterRaisonvisitedomicile = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemRaisonvisitedomicile.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsRaisonvisitedomicile.push(items);
				vm.allRecordsRaisonvisitedomicile.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemRaisonvisitedomicile = it;
					}
				});			
			};
        };
        vm.annulerRaisonvisitedomicile = function(item) {
			if (!item.id) {
				vm.allRecordsRaisonvisitedomicile.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemRaisonvisitedomicile = {} ;
			vm.selectedItemRaisonvisitedomicile.$selected = false;
       };
        vm.modifierRaisonvisitedomicile = function(item) {
			NouvelItem = false ;
			vm.selectedItemRaisonvisitedomicile = item;
			currentItem = angular.copy(vm.selectedItemRaisonvisitedomicile);
			$scope.vm.allRecordsRaisonvisitedomicile.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemRaisonvisitedomicile.description = vm.selectedItemRaisonvisitedomicile.description;
			vm.selectedItemRaisonvisitedomicile.$edit = true;	
        };
        vm.supprimerRaisonvisitedomicile = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemRaisonvisitedomicile,1);
			}, function() {
			});
        }
		// Raison visite domicile
		// Résolution visite domicile
        vm.selectionResolutionvisitedomicile= function (item) {     
            vm.selectedItemResolutionvisitedomicile = item;
        };
        $scope.$watch('vm.selectedItemResolutionvisitedomicile', function() {
			if (!vm.allRecordsResolutionvisitedomicile) return;
			vm.allRecordsResolutionvisitedomicile.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemResolutionvisitedomicile.$selected = true;
        });
        vm.ajouterResolutionvisitedomicile = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemResolutionvisitedomicile.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsResolutionvisitedomicile.push(items);
				vm.allRecordsResolutionvisitedomicile.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemResolutionvisitedomicile = it;
					}
				});			
			};
        };
        vm.annulerResolutionvisitedomicile = function(item) {
			if (!item.id) {
				vm.allRecordsResolutionvisitedomicile.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemResolutionvisitedomicile = {} ;
			vm.selectedItemResolutionvisitedomicile.$selected = false;
       };
        vm.modifierResolutionvisitedomicile = function(item) {
			NouvelItem = false ;
			vm.selectedItemResolutionvisitedomicile = item;
			currentItem = angular.copy(vm.selectedItemResolutionvisitedomicile);
			$scope.vm.allRecordsResolutionvisitedomicile.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemResolutionvisitedomicile.description = vm.selectedItemResolutionvisitedomicile.description;
			vm.selectedItemResolutionvisitedomicile.$edit = true;	
        };
        vm.supprimerResolutionvisitedomicile = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemResolutionvisitedomicile,1);
			}, function() {
			});
        }
		// Résolution visite domicile
		// Thème de sensibilisation
        vm.selectionThemesensibilisation= function (item) {     
            vm.selectedItemThemesensibilisation = item;
        };
        $scope.$watch('vm.selectedItemThemesensibilisation', function() {
			if (!vm.allRecordsThemesensibilisation) return;
			vm.allRecordsThemesensibilisation.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemThemesensibilisation.$selected = true;
        });
        vm.ajouterThemesensibilisation = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemThemesensibilisation.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsThemesensibilisation.push(items);
				vm.allRecordsThemesensibilisation.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemThemesensibilisation = it;
					}
				});			
			};
        };
        vm.annulerThemesensibilisation = function(item) {
			if (!item.id) {
				vm.allRecordsThemesensibilisation.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemThemesensibilisation = {} ;
			vm.selectedItemThemesensibilisation.$selected = false;
       };
        vm.modifierThemesensibilisation = function(item) {
			NouvelItem = false ;
			vm.selectedItemThemesensibilisation = item;
			currentItem = angular.copy(vm.selectedItemThemesensibilisation);
			$scope.vm.allRecordsThemesensibilisation.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemThemesensibilisation.description = vm.selectedItemThemesensibilisation.description;
			vm.selectedItemThemesensibilisation.$edit = true;	
        };
        vm.supprimerThemesensibilisation = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemThemesensibilisation,1);
			}, function() {
			});
        }
		// Thème de sensibilisation
		// Projet du groupe
        vm.selectionProjetdugroupe= function (item) {     
            vm.selectedItemProjetdugroupe = item;
        };
        $scope.$watch('vm.selectedItemProjetdugroupe', function() {
			if (!vm.allRecordsProjetdugroupe) return;
			vm.allRecordsProjetdugroupe.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemProjetdugroupe.$selected = true;
        });
        vm.ajouterProjetdugroupe = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemProjetdugroupe.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsProjetdugroupe.push(items);
				vm.allRecordsProjetdugroupe.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemProjetdugroupe = it;
					}
				});			
			};
        };
        vm.annulerProjetdugroupe = function(item) {
			if (!item.id) {
				vm.allRecordsProjetdugroupe.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemProjetdugroupe = {} ;
			vm.selectedItemProjetdugroupe.$selected = false;
       };
        vm.modifierProjetdugroupe = function(item) {
			NouvelItem = false ;
			vm.selectedItemProjetdugroupe = item;
			currentItem = angular.copy(vm.selectedItemProjetdugroupe);
			$scope.vm.allRecordsProjetdugroupe.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemProjetdugroupe.description = vm.selectedItemProjetdugroupe.description;
			vm.selectedItemProjetdugroupe.$edit = true;	
        };
        vm.supprimerProjetdugroupe = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemProjetdugroupe,1);
			}, function() {
			});
        }
		// Projet du groupe
		// Probleme rencontré     
        vm.selectionProblemerencontre= function (item) {     
            vm.selectedItemProblemerencontre = item;
        };
        $scope.$watch('vm.selectedItemProblemerencontre', function() {
			if (!vm.allRecordsProblemerencontre) return;
			vm.allRecordsProblemerencontre.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemProblemerencontre.$selected = true;
        });
        vm.ajouterProblemerencontre = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemProblemerencontre.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsProblemerencontre.push(items);
				vm.allRecordsProblemerencontre.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemProblemerencontre = it;
					}
				});			
			};
        };
        vm.annulerProblemerencontre = function(item) {
			if (!item.id) {
				vm.allRecordsProblemerencontre.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemProblemerencontre = {} ;
			vm.selectedItemProblemerencontre.$selected = false;
       };
        vm.modifierProblemerencontre = function(item) {
			NouvelItem = false ;
			vm.selectedItemProblemerencontre = item;
			currentItem = angular.copy(vm.selectedItemProblemerencontre);
			$scope.vm.allRecordsProblemerencontre.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemProblemerencontre.description = vm.selectedItemProblemerencontre.description;
			vm.selectedItemProblemerencontre.$edit = true;	
        };
        vm.supprimerProblemerencontre = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemProblemerencontre,1);
			}, function() {
			});
        }
		// Probleme rencontré     
		// Résolution probleme   
        vm.selectionResolutionprobleme= function (item) {     
            vm.selectedItemResolutionprobleme = item;
        };
        $scope.$watch('vm.selectedItemResolutionprobleme', function() {
			if (!vm.allRecordsResolutionprobleme) return;
			vm.allRecordsResolutionprobleme.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemResolutionprobleme.$selected = true;
        });
        vm.ajouterResolutionprobleme = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemResolutionprobleme.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsResolutionprobleme.push(items);
				vm.allRecordsResolutionprobleme.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemResolutionprobleme = it;
					}
				});			
			};
        };
        vm.annulerResolutionprobleme = function(item) {
			if (!item.id) {
				vm.allRecordsResolutionprobleme.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemResolutionprobleme = {} ;
			vm.selectedItemResolutionprobleme.$selected = false;
       };
        vm.modifierResolutionprobleme = function(item) {
			NouvelItem = false ;
			vm.selectedItemResolutionprobleme = item;
			currentItem = angular.copy(vm.selectedItemResolutionprobleme);
			$scope.vm.allRecordsResolutionprobleme.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemResolutionprobleme.description = vm.selectedItemResolutionprobleme.description;
			vm.selectedItemResolutionprobleme.$edit = true;	
        };
        vm.supprimerResolutionprobleme = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemResolutionprobleme,1);
			}, function() {
			});
        }
		// Résolution probleme 
        function test_existence (item,suppression) {    
			if(item.description.length > 0) {
				var doublon = 0;
				if (suppression!=1) {
					switch(vm.cas) {
						case 1:  {
							vm.allRecordsRaisonvisitedomicile.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 2:  {
							vm.allRecordsResolutionvisitedomicile.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 3:  {
							vm.allRecordsThemesensibilisation.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 4:  { 
							vm.allRecordsProjetdugroupe.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 5:  {
							vm.allRecordsProblemerencontre.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 6:  {
							vm.allRecordsResolutionprobleme.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						default: {
							break;
						}
					}				
					if(doublon==1) {
						vm.showAlert('Information !','ERREUR ! : Description déjà utilisé')
					} else {
						insert_in_base(item,0);
					}
				} else {
				  insert_in_base(item,suppression);
				}  
			} else {
				vm.showAlert('Erreur',"Veuillez saisir la description !");
			}		
        }
    }
})();

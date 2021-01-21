(function ()
{
    'use strict';

    angular
        .module('app.population.ddb_adm.variable_individu')
        .controller('EnquetesurindividuController', EnquetesurindividuController);
    /** @ngInject */
    function EnquetesurindividuController($mdDialog, $scope, apiFactory, $state,$cookieStore)  {
		var vm = this;
		vm.titrepage ="Ajout Tutelle";
		vm.ajout = ajout ;
		var NouvelItem=false;
		var currentItem;
		vm.affiche_load =true;
		vm.selectedItemLiendeparente = {} ;
		vm.selectedItemHandicapvisuel = {} ;
		vm.selectedItemHandicapparole = {} ;
		vm.selectedItemHandicapauditif = {} ;
		vm.selectedItemHandicapmental = {} ;
		vm.selectedItemHandicapmoteur = {} ;
		vm.selectedItemNiveaudeclasse = {} ;
		vm.selectedItemLangue = {} ;
		vm.selectedItemTypeecole = {} ;
		vm.selectedItemUsageservicemedical = {} ;
		vm.selectedItemGroupeappartenance = {} ;
		vm.selectedItemSituationmatrimoniale = {} ;
		vm.selectedItemIndicevulnerabilite ={};
		
		vm.allRecordsLiendeparente = [] ;
		vm.allRecordsHandicapvisuel = [] ;
		vm.allRecordsHandicapparole = [] ;
		vm.allRecordsHandicapauditif = [] ;
		vm.allRecordsHandicapmental = [] ;
		vm.allRecordsHandicapmoteur = [] ;
		vm.allRecordsNiveaudeclasse = [] ;
		vm.allRecordsLangue = [] ;
		vm.allRecordsTypeecole = [] ;
		vm.allRecordsUsageservicemedical = [] ;
		vm.allRecordsGroupeappartenance = [] ;
		vm.allRecordsSituationmatrimoniale = [] ;
		vm.allRecordsIndicevulnerabilite =[];
		vm.nom_table ="liendeparente";
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
		
		//col table
		vm.donnateur_column = [{titre:"Code"},{titre:"Description"},{titre:"Actions"}];
		apiFactory.getTable("enquete_menage/index","handicap_moteur").then(function(result){
			vm.allRecordsHandicapmoteur = result.data.response;
			apiFactory.getTable("enquete_menage/index","handicap_mental").then(function(result){
				vm.allRecordsHandicapmental = result.data.response;
				apiFactory.getTable("enquete_menage/index","handicap_auditif").then(function(result){
					vm.allRecordsHandicapauditif = result.data.response;
					apiFactory.getTable("enquete_menage/index","handicap_parole").then(function(result){
						vm.allRecordsHandicapparole = result.data.response;
						apiFactory.getTable("enquete_menage/index","handicap_visuel").then(function(result){
							vm.allRecordsHandicapvisuel = result.data.response;
							apiFactory.getTable("enquete_menage/index","liendeparente").then(function(result){
								vm.allRecordsLiendeparente = result.data.response;
							});    
							apiFactory.getTable("enquete_menage/index","niveau_de_classe").then(function(result){
								vm.allRecordsNiveaudeclasse = result.data.response;
							});    
							apiFactory.getTable("enquete_menage/index","liste_langue").then(function(result){
								vm.allRecordsLangue = result.data.response;
							});    
							apiFactory.getTable("enquete_menage/index","type_ecole").then(function(result){
								vm.allRecordsTypeecole = result.data.response;
							});    
							apiFactory.getTable("enquete_menage/index","type_usage_service_medical").then(function(result){
								vm.allRecordsUsageservicemedical = result.data.response;
							});    
							apiFactory.getTable("enquete_menage/index","groupe_appartenance").then(function(result){
								vm.allRecordsGroupeappartenance = result.data.response;
							});    
							apiFactory.getTable("enquete_menage/index","situation_matrimoniale").then(function(result){
								vm.allRecordsSituationmatrimoniale = result.data.response;
								apiFactory.getTable("enquete_menage/index","indice_vulnerabilite").then(function(result){
									vm.allRecordsIndicevulnerabilite = result.data.response;
									vm.affiche_load =false;
								});    
							});    
						});    
					});    
				});    
			});    
		});    
		//add historique : consultation DDB Enquete sur individu
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		};
		var datas = $.param({
			action:"Consultation DDB : Enquête/Indivudu",
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
						vm.nom_table="liendeparente";
						vm.cas=1;
						break;
					}
					case 2:  {
						vm.nom_table="handicap_visuel";
						vm.cas=2;
						break;
					}
					case 3:  {
						vm.nom_table="handicap_parole";
						vm.cas=3;
						break;
					}
					case 4:  {
						vm.nom_table="handicap_auditif";
						vm.cas=4;
						break;
					}
					case 5:  {
						vm.nom_table="handicap_mental";
						vm.cas=5;
						break;
					}
					case 6:  {
						vm.nom_table="handicap_moteur";
						vm.cas=6;
						break;
					}
					case 7:  {
						vm.nom_table="niveau_de_classe";
						vm.cas=7;
						break;
					}
					case 8:  {
						vm.nom_table="liste_langue";
						vm.cas=8;
						break;
					}
					case 9:  {
						vm.nom_table="type_ecole";
						vm.cas=9;
						break;
					}
					case 10:  {
						vm.nom_table="groupe_appartenance";
						vm.cas=10;
						break;
					}
					case 11:  {
						vm.nom_table="situation_matrimoniale";
						vm.cas=11;
						break;
					}
					case 12:  {
						vm.nom_table="indice_vulnerabilite";
						vm.cas=12;
						break;
					}
					default: {
						vm.nom_table="liendeparente";
						vm.cas=1;
						break;
					}
				}				
			} else {
				vm.nom_table="liendeparente";
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
			apiFactory.add("enquete_menage/index",datas, config).success(function (data) {
				if (NouvelItem == false) {
					// Update or delete: id exclu                   
					if(suppression==0) {
						switch(vm.cas) {
							case 1:  {
								vm.selectedItemLiendeparente.code = possession.code;
								vm.selectedItemLiendeparente.description = possession.description;
								vm.selectedItemLiendeparente.$selected = false;
								vm.selectedItemLiendeparente.$edit = false;
								vm.selectedItemLiendeparente ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Individu : Lien de parenté" + " ("+ possession.description + ")";
								break;
							}
							case 2:  {
								vm.selectedItemHandicapvisuel.code = possession.code;
								vm.selectedItemHandicapvisuel.description = possession.description;
								vm.selectedItemHandicapvisuel.$selected = false;
								vm.selectedItemHandicapvisuel.$edit = false;
								vm.selectedItemHandicapvisuel ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Individu : Handicap visuel" + " ("+ possession.description + ")";
								break;
							}
							case 3:  {
								vm.selectedItemHandicapparole.code = possession.code;
								vm.selectedItemHandicapparole.description = possession.description;
								vm.selectedItemHandicapparole.$selected = false;
								vm.selectedItemHandicapparole.$edit = false;
								vm.selectedItemHandicapparole ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Individu : Handicap sur parole" + " ("+ possession.description + ")";
								break;
							}
							case 4:  {
								vm.selectedItemHandicapauditif.code = possession.code;
								vm.selectedItemHandicapauditif.description = possession.description;
								vm.selectedItemHandicapauditif.$selected = false;
								vm.selectedItemHandicapauditif.$edit = false;
								vm.selectedItemHandicapauditif ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Individu : Handicap auditif" + " ("+ possession.description + ")";
								break;
							}
							case 5:  {
								vm.selectedItemHandicapmental.code = possession.code;
								vm.selectedItemHandicapmental.description = possession.description;
								vm.selectedItemHandicapmental.$selected = false;
								vm.selectedItemHandicapmental.$edit = false;
								vm.selectedItemHandicapmental ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Individu : Handicap mental" + " ("+ possession.description + ")";
								break;
							}
							case 6:  {
								vm.selectedItemHandicapmoteur.code = possession.code;
								vm.selectedItemHandicapmoteur.description = possession.description;
								vm.selectedItemHandicapmoteur.$selected = false;
								vm.selectedItemHandicapmoteur.$edit = false;
								vm.selectedItemHandicapmoteur ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Individu : Handicap moteur" + " ("+ possession.description + ")";
								break;
							}
							case 7:  {
								vm.selectedItemNiveaudeclasse.code = possession.code;
								vm.selectedItemNiveaudeclasse.description = possession.description;
								vm.selectedItemNiveaudeclasse.$selected = false;
								vm.selectedItemNiveaudeclasse.$edit = false;
								vm.selectedItemNiveaudeclasse ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Individu : Niveau de classe" + " ("+ possession.description + ")";
								break;
							}
							case 8:  {
								vm.selectedItemLangue.code = possession.code;
								vm.selectedItemLangue.description = possession.description;
								vm.selectedItemLangue.$selected = false;
								vm.selectedItemLangue.$edit = false;
								vm.selectedItemLangue ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Individu : Langue" + " ("+ possession.description + ")";
								break;
							}
							case 9:  {
								vm.selectedItemTypeecole.code = possession.code;
								vm.selectedItemTypeecole.description = possession.description;
								vm.selectedItemTypeecole.$selected = false;
								vm.selectedItemTypeecole.$edit = false;
								vm.selectedItemTypeecole ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Individu : Type école" + " ("+ possession.description + ")";
								break;
							}
							case 10:  {
								vm.selectedItemGroupeappartenance.code = possession.code;
								vm.selectedItemGroupeappartenance.description = possession.description;
								vm.selectedItemGroupeappartenance.$selected = false;
								vm.selectedItemGroupeappartenance.$edit = false;
								vm.selectedItemGroupeappartenance ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Individu : Groupe d'appartenance" + " ("+ possession.description + ")";
								break;
							}
							case 11:  {
								vm.selectedItemSituationmatrimoniale.code = possession.code;
								vm.selectedItemSituationmatrimoniale.description = possession.description;
								vm.selectedItemSituationmatrimoniale.$selected = false;
								vm.selectedItemSituationmatrimoniale.$edit = false;
								vm.selectedItemSituationmatrimoniale ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Individu : Situation matrimoniale" + " ("+ possession.description + ")";
								break;
							}
							case 12:  {
								vm.selectedItemIndicevulnerabilite.code = possession.code;
								vm.selectedItemIndicevulnerabilite.description = possession.description;
								vm.selectedItemIndicevulnerabilite.$selected = false;
								vm.selectedItemIndicevulnerabilite.$edit = false;
								vm.selectedItemIndicevulnerabilite ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Individu : Indice de vulnérabilité" + " ("+ possession.description + ")";
								break;
							}
							default: {
								break;
							}
						}				
					} else {    
						switch(vm.cas) {
							case 1:  {
								vm.allRecordsLiendeparente = vm.allRecordsLiendeparente.filter(function(obj) {
									return obj.id !== vm.selectedItemLiendeparente.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Individu : Lien de parenté" + " ("+ possession.description + ")";
								break;
							}
							case 2:  {
								vm.allRecordsHandicapvisuel = vm.allRecordsHandicapvisuel.filter(function(obj) {
									return obj.id !== vm.selectedItemHandicapvisuel.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Individu : Handicap visuel" + " ("+ possession.description + ")";
								break;
							}
							case 3:  {
								vm.allRecordsHandicapparole = vm.allRecordsHandicapparole.filter(function(obj) {
									return obj.id !== vm.selectedItemHandicapparole.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Individu : Handicap sur parole" + " ("+ possession.description + ")";
								break;
							}
							case 4:  {
								vm.allRecordsHandicapauditif = vm.allRecordsHandicapauditif.filter(function(obj) {
									return obj.id !== vm.selectedItemHandicapauditif.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Individu : Handicap auditif" + " ("+ possession.description + ")";
								break;
							}
							case 5:  {
								vm.allRecordsHandicapmental = vm.allRecordsHandicapmental.filter(function(obj) {
									return obj.id !== vm.selectedItemHandicapmental.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Individu : Handicap mental" + " ("+ possession.description + ")";
								break;
							}
							case 6:  {
								vm.allRecordsHandicapmoteur = vm.allRecordsHandicapmoteur.filter(function(obj) {
									return obj.id !== vm.selectedItemHandicapmoteur.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Individu : Handicap moteur" + " ("+ possession.description + ")";
								break;
							}
							case 7:  {
								vm.allRecordsNiveaudeclasse = vm.allRecordsNiveaudeclasse.filter(function(obj) {
									return obj.id !== vm.selectedItemNiveaudeclasse.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Individu : Niveaau de classe" + " ("+ possession.description + ")";
								break;
							}
							case 8:  {
								vm.allRecordsLangue = vm.allRecordsLangue.filter(function(obj) {
									return obj.id !== vm.selectedItemLangue.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Individu : Langue" + " ("+ possession.description + ")";
								break;
							}
							case 9:  {
								vm.allRecordsTypeecole = vm.allRecordsTypeecole.filter(function(obj) {
									return obj.id !== vm.selectedItemTypeecole.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Individu : Type d'école" + " ("+ possession.description + ")";
								break;
							}
							case 10:  {
								vm.allRecordsGroupeappartenance = vm.allRecordsGroupeappartenance.filter(function(obj) {
									return obj.id !== vm.selectedItemGroupeappartenance.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Individu : Groupe d'appartenance" + " ("+ possession.description + ")";
								break;
							}
							case 11:  {
								vm.allRecordsSituationmatrimoniale = vm.allRecordsSituationmatrimoniale.filter(function(obj) {
									return obj.id !== vm.selectedItemSituationmatrimoniale.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Individu : Situation matrimoniale" + " ("+ possession.description + ")";
								break;
							}
							case 12:  {
								vm.allRecordsIndicevulnerabilite = vm.allRecordsIndicevulnerabilite.filter(function(obj) {
									return obj.id !== vm.selectedItemIndicevulnerabilite.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Individu : Indice de vulnérabilité" + " ("+ possession.description + ")";
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
							vm.selectedItemLiendeparente ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Individu : Lien de parenté" + " ("+ possession.description + ")";
							break;
						}
						case 2:  {
							vm.selectedItemHandicapvisuel ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Individu : Handicap visuel" + " ("+ possession.description + ")";
							break;
						}
						case 3:  {
							vm.selectedItemHandicapparole ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Individu : Handicap sur parole" + " ("+ possession.description + ")";
							break;
						}
						case 4:  {
							vm.selectedItemHandicapauditif ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Individu : Handicap auditif" + " ("+ possession.description + ")";
							break;
						}
						case 5:  {
							vm.selectedItemHandicapmental ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Individu : Handicap mental" + " ("+ possession.description + ")";
							break;
						}
						case 6:  {
							vm.selectedItemHandicapmoteur ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Individu : Handicap moteur" + " ("+ possession.description + ")";
							break;
						}
						case 7:  {
							vm.selectedItemNiveaudeclasse ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Individu : Niveau de classe" + " ("+ possession.description + ")";
							break;
						}
						case 8:  {
							vm.selectedItemLangue ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Individu : Langue" + " ("+ possession.description + ")";
							break;
						}
						case 9:  {
							vm.selectedItemTypeecole ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Individu : Type d'école" + " ("+ possession.description + ")";
							break;
						}
						case 10:  {
							vm.selectedItemGroupeappartenance ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Individu : Groupe d'appartencance" + " ("+ possession.description + ")";
							break;
						}
						case 11:  {
							vm.selectedItemSituationmatrimoniale ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Individu : Situation matrimoniale" + " ("+ possession.description + ")";
							break;
						}
						case 12:  {
							vm.selectedItemIndicevulnerabilite ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Individu : Indice de vulnérabilité" + " ("+ possession.description + ")";
							break;
						}
						default: {
							vm.selectedItemLiendeparente ={};
							break;
						}
					}				
				}
				possession.$selected=false;
				possession.$edit=false;
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
		// Liendeparente
        vm.selectionLiendeparente= function (item) {     
            vm.selectedItemLiendeparente = item;
        };
        $scope.$watch('vm.selectedItemLiendeparente', function() {
			if (!vm.allRecordsLiendeparente) return;
			vm.allRecordsLiendeparente.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemLiendeparente.$selected = true;
        });
        vm.ajouterLiendeparente = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemLiendeparente.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsLiendeparente.push(items);
				vm.allRecordsLiendeparente.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemLiendeparente = it;
					}
				});	
			}	
        };
        vm.annulerLiendeparente = function(item) {
			if (!item.id) {
				vm.allRecordsLiendeparente.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemLiendeparente = {} ;
			vm.selectedItemLiendeparente.$selected = false;
       };
        vm.modifierLiendeparente = function(item) {
			NouvelItem = false ;
			vm.selectedItemLiendeparente = item;
			currentItem = angular.copy(vm.selectedItemLiendeparente);
			$scope.vm.allRecordsLiendeparente.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemLiendeparente.code = vm.selectedItemLiendeparente.code;
			vm.selectedItemLiendeparente.description = vm.selectedItemLiendeparente.description;
			vm.selectedItemLiendeparente.$edit = true;	
        };
        vm.supprimerLiendeparente = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemLiendeparente,1);
			}, function() {
			});
        }
		// Liendeparente
		// Handicap visuel
        vm.selectionHandicapvisuel= function (item) {     
            vm.selectedItemHandicapvisuel = item;
        };
        $scope.$watch('vm.selectedItemHandicapvisuel', function() {
			if (!vm.allRecordsHandicapvisuel) return;
			vm.allRecordsHandicapvisuel.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemHandicapvisuel.$selected = true;
        });
        vm.ajouterHandicapvisuel = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemHandicapvisuel.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsHandicapvisuel.push(items);
				vm.allRecordsHandicapvisuel.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemHandicapvisuel = it;
					}
				});			
			};
        };
        vm.annulerHandicapvisuel = function(item) {
			if (!item.id) {
				vm.allRecordsHandicapvisuel.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemHandicapvisuel = {} ;
			vm.selectedItemHandicapvisuel.$selected = false;
       };
        vm.modifierHandicapvisuel = function(item) {
			NouvelItem = false ;
			vm.selectedItemHandicapvisuel = item;
			currentItem = angular.copy(vm.selectedItemHandicapvisuel);
			$scope.vm.allRecordsLiendeparente.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemHandicapvisuel.code = vm.selectedItemHandicapvisuel.code;
			vm.selectedItemHandicapvisuel.description = vm.selectedItemHandicapvisuel.description;
			vm.selectedItemHandicapvisuel.$edit = true;	
        };
        vm.supprimerHandicapvisuel = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemHandicapvisuel,1);
			}, function() {
			});
        }
		// Handicap visuel
		// Handicap parole
        vm.selectionHandicapparole= function (item) {     
            vm.selectedItemHandicapparole = item;
        };
        $scope.$watch('vm.selectedItemHandicapparole', function() {
			if (!vm.allRecordsHandicapparole) return;
			vm.allRecordsHandicapparole.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemHandicapparole.$selected = true;
        });
        vm.ajouterHandicapparole = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemHandicapparole.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsHandicapparole.push(items);
				vm.allRecordsHandicapparole.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemHandicapparole = it;
					}
				});			
			};
        };
        vm.annulerHandicapparole = function(item) {
			if (!item.id) {
				vm.allRecordsHandicapparole.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemHandicapparole = {} ;
			vm.selectedItemHandicapparole.$selected = false;
       };
        vm.modifierHandicapparole = function(item) {
			NouvelItem = false ;
			vm.selectedItemHandicapparole = item;
			currentItem = angular.copy(vm.selectedItemHandicapparole);
			$scope.vm.allRecordsLiendeparente.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemHandicapparole.code = vm.selectedItemHandicapparole.code;
			vm.selectedItemHandicapparole.description = vm.selectedItemHandicapparole.description;
			vm.selectedItemHandicapparole.$edit = true;	
        };
        vm.supprimerHandicapparole = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemHandicapparole,1);
			}, function() {
			});
        }
		// Handicap parole
		// Handicap auditif
        vm.selectionHandicapauditif= function (item) {     
            vm.selectedItemHandicapauditif = item;
        };
        $scope.$watch('vm.selectedItemHandicapauditif', function() {
			if (!vm.allRecordsHandicapauditif) return;
			vm.allRecordsHandicapauditif.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemHandicapauditif.$selected = true;
        });
        vm.ajouterHandicapauditif = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemHandicapauditif.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsHandicapauditif.push(items);
				vm.allRecordsHandicapauditif.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemHandicapauditif = it;
					}
				});			
			};
        };
        vm.annulerHandicapauditif = function(item) {
			if (!item.id) {
				vm.allRecordsHandicapauditif.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemHandicapauditif = {} ;
			vm.selectedItemHandicapauditif.$selected = false;
       };
        vm.modifierHandicapauditif= function(item) {
			NouvelItem = false ;
			vm.selectedItemHandicapauditif = item;
			currentItem = angular.copy(vm.selectedItemHandicapauditif);
			$scope.vm.allRecordsLiendeparente.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemHandicapauditif.code = vm.selectedItemHandicapauditif.code;
			vm.selectedItemHandicapauditif.description = vm.selectedItemHandicapauditif.description;
			vm.selectedItemHandicapauditif.$edit = true;	
        };
        vm.supprimerHandicapauditif = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemHandicapauditif,1);
			}, function() {
			});
        }
		// Handicap auditif
		// Handicap mental
        vm.selectionHandicapmental= function (item) {     
            vm.selectedItemHandicapmental = item;
        };
        $scope.$watch('vm.selectedItemHandicapmental', function() {
			if (!vm.allRecordsHandicapmental) return;
			vm.allRecordsHandicapmental.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemHandicapmental.$selected = true;
        });
        vm.ajouterHandicapmental = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemHandicapmental.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsHandicapmental.push(items);
				vm.allRecordsHandicapmental.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemHandicapmental = it;
					}
				});			
			};
        };
        vm.annulerHandicapmental = function(item) {
			if (!item.id) {
				vm.allRecordsHandicapmental.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemHandicapmental = {} ;
			vm.selectedItemHandicapmental.$selected = false;
       };
        vm.modifierHandicapmental = function(item) {
			NouvelItem = false ;
			vm.selectedItemHandicapmental = item;
			currentItem = angular.copy(vm.selectedItemHandicapmental);
			$scope.vm.allRecordsLiendeparente.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemHandicapmental.code = vm.selectedItemHandicapmental.code;
			vm.selectedItemHandicapmental.description = vm.selectedItemHandicapmental.description;
			vm.selectedItemHandicapmental.$edit = true;	
        };
        vm.supprimerHandicapmental = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemHandicapmental,1);
			}, function() {
			});
        }
		// Handicap mental
		// Handicap moteur
        vm.selectionHandicapmoteur= function (item) {     
            vm.selectedItemHandicapmoteur = item;
        };
        $scope.$watch('vm.selectedItemHandicapmoteur', function() {
			if (!vm.allRecordsHandicapmoteur) return;
			vm.allRecordsHandicapmoteur.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemHandicapmoteur.$selected = true;
        });
        vm.ajouterHandicapmoteur = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemHandicapmoteur.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsHandicapmoteur.push(items);
				vm.allRecordsHandicapmoteur.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemHandicapmoteur = it;
					}
				});			
			};
        };
        vm.annulerHandicapmoteur = function(item) {
			if (!item.id) {
				vm.allRecordsHandicapmoteur.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemHandicapmoteur = {} ;
			vm.selectedItemHandicapmoteur.$selected = false;
       };
        vm.modifierHandicapmoteur = function(item) {
			NouvelItem = false ;
			vm.selectedItemHandicapmoteur = item;
			currentItem = angular.copy(vm.selectedItemHandicapmoteur);
			$scope.vm.allRecordsLiendeparente.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemHandicapmoteur.code = vm.selectedItemHandicapmoteur.code;
			vm.selectedItemHandicapmoteur.description = vm.selectedItemHandicapmoteur.description;
			vm.selectedItemHandicapmoteur.$edit = true;	
        };
        vm.supprimerHandicapmoteur = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemHandicapmoteur,1);
			}, function() {
			});
        }
		// Handicap moteur
		// Niveau de classe
        vm.selectionNiveaudeclasse= function (item) {     
            vm.selectedItemNiveaudeclasse = item;
        };
        $scope.$watch('vm.selectedItemNiveaudeclasse', function() {
			if (!vm.allRecordsNiveaudeclasse) return;
			vm.allRecordsNiveaudeclasse.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemNiveaudeclasse.$selected = true;
        });
        vm.ajouterNiveaudeclasse = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemNiveaudeclasse.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsNiveaudeclasse.push(items);
				vm.allRecordsNiveaudeclasse.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemNiveaudeclasse = it;
					}
				});			
			};
        };
        vm.annulerNiveaudeclasse = function(item) {
			if (!item.id) {
				vm.allRecordsNiveaudeclasse.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemNiveaudeclasse = {} ;
			vm.selectedItemNiveaudeclasse.$selected = false;
       };
        vm.modifierNiveaudeclasse = function(item) {
			NouvelItem = false ;
			vm.selectedItemNiveaudeclasse = item;
			currentItem = angular.copy(vm.selectedItemNiveaudeclasse);
			$scope.vm.allRecordsLiendeparente.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemNiveaudeclasse.code = vm.selectedItemNiveaudeclasse.code;
			vm.selectedItemNiveaudeclasse.description = vm.selectedItemNiveaudeclasse.description;
			vm.selectedItemNiveaudeclasse.$edit = true;	
        };
        vm.supprimerNiveaudeclasse = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemNiveaudeclasse,1);
			}, function() {
			});
        }
		// Niveau de classe
		// Langue
        vm.selectionLangue= function (item) {     
            vm.selectedItemLangue = item;
        };
        $scope.$watch('vm.selectedItemLangue', function() {
			if (!vm.allRecordsLangue) return;
			vm.allRecordsLangue.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemLangue.$selected = true;
        });
        vm.ajouterLangue = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemLangue.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsLangue.push(items);
				vm.allRecordsLangue.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemLangue = it;
					}
				});			
			};
        };
        vm.annulerLangue = function(item) {
			if (!item.id) {
				vm.allRecordsLangue.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemLangue = {} ;
			vm.selectedItemLangue.$selected = false;
       };
        vm.modifierLangue = function(item) {
			NouvelItem = false ;
			vm.selectedItemLangue = item;
			currentItem = angular.copy(vm.selectedItemLangue);
			$scope.vm.allRecordsLiendeparente.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemLangue.code = vm.selectedItemLangue.code;
			vm.selectedItemLangue.description = vm.selectedItemLangue.description;
			vm.selectedItemLangue.$edit = true;	
        };
        vm.supprimerLangue = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemLangue,1);
			}, function() {
			});
        }
		// Langue
		// Type école
        vm.selectionTypeecole= function (item) {     
            vm.selectedItemTypeecole = item;
        };
        $scope.$watch('vm.selectedItemTypeecole', function() {
			if (!vm.allRecordsTypeecole) return;
			vm.allRecordsTypeecole.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemTypeecole.$selected = true;
        });
        vm.ajouterTypeecole = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemTypeecole.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsTypeecole.push(items);
				vm.allRecordsTypeecole.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemTypeecole = it;
					}
				});			
			};
        };
        vm.annulerTypeecole = function(item) {
			if (!item.id) {
				vm.allRecordsTypeecole.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemTypeecole = {} ;
			vm.selectedItemTypeecole.$selected = false;
       };
        vm.modifierTypeecole = function(item) {
			NouvelItem = false ;
			vm.selectedItemTypeecole = item;
			currentItem = angular.copy(vm.selectedItemTypeecole);
			$scope.vm.allRecordsLiendeparente.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemTypeecole.code = vm.selectedItemTypeecole.code;
			vm.selectedItemTypeecole.description = vm.selectedItemTypeecole.description;
			vm.selectedItemTypeecole.$edit = true;	
        };
        vm.supprimerTypeecole = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemTypeecole,1);
			}, function() {
			});
        }
		// Type école
		// Usage service medical
        vm.selectionUsageservicemedical= function (item) {     
            vm.selectedItemUsageservicemedical = item;
        };
        $scope.$watch('vm.selectedItemUsageservicemedical', function() {
			if (!vm.allRecordsUsageservicemedical) return;
			vm.allRecordsUsageservicemedical.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemUsageservicemedical.$selected = true;
        });
        vm.ajouterUsageservicemedical = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemUsageservicemedical.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsUsageservicemedical.push(items);
				vm.allRecordsUsageservicemedical.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemUsageservicemedical = it;
					}
				});			
			};
        };
        vm.annulerUsageservicemedical = function(item) {
			if (!item.id) {
				vm.allRecordsUsageservicemedical.pop();
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemUsageservicemedical = {} ;
			vm.selectedItemUsageservicemedical.$selected = false;
       };
        vm.modifierUsageservicemedical = function(item) {
			NouvelItem = false ;
			vm.selectedItemUsageservicemedical = item;
			currentItem = angular.copy(vm.selectedItemUsageservicemedical);
			$scope.vm.allRecordsLiendeparente.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemUsageservicemedical.code = vm.selectedItemUsageservicemedical.code;
			vm.selectedItemUsageservicemedical.description = vm.selectedItemUsageservicemedical.description;
			vm.selectedItemUsageservicemedical.$edit = true;	
        };
        vm.supprimerUsageservicemedical = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemUsageservicemedical,1);
			}, function() {
			});
        }
		// Usage service medical
		// Groupe appartenance
        vm.selectionGroupeappartenance= function (item) {     
            vm.selectedItemGroupeappartenance = item;
        };
        $scope.$watch('vm.selectedItemGroupeappartenance', function() {
			if (!vm.allRecordsGroupeappartenance) return;
			vm.allRecordsGroupeappartenance.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemGroupeappartenance.$selected = true;
        });
        vm.ajouterGroupeappartenance = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemGroupeappartenance.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsGroupeappartenance.push(items);
				vm.allRecordsGroupeappartenance.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemGroupeappartenance = it;
					}
				});			
			};
        };
        vm.annulerGroupeappartenance = function(item) {
			if (!item.id) {
				vm.allRecordsGroupeappartenance.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemGroupeappartenance = {} ;
			vm.selectedItemGroupeappartenance.$selected = false;
       };
        vm.modifierGroupeappartenance = function(item) {
			NouvelItem = false ;
			vm.selectedItemGroupeappartenance = item;
			currentItem = angular.copy(vm.selectedItemGroupeappartenance);
			$scope.vm.allRecordsLiendeparente.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemGroupeappartenance.code = vm.selectedItemGroupeappartenance.code;
			vm.selectedItemGroupeappartenance.description = vm.selectedItemGroupeappartenance.description;
			vm.selectedItemGroupeappartenance.$edit = true;	
        };
        vm.supprimerGroupeappartenance = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemGroupeappartenance,1);
			}, function() {
			});
        }
		// Groupe appartenance
		// Début Situation matrimoniale 
        vm.selectionSituationmatrimoniale= function (item) {     
            vm.selectedItemSituationmatrimoniale = item;
        };
        $scope.$watch('vm.selectedItemSituationmatrimoniale', function() {
			if (!vm.allRecordsSituationmatrimoniale) return;
			vm.allRecordsSituationmatrimoniale.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemSituationmatrimoniale.$selected = true;
        });
        vm.ajouterSituationmatrimoniale = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemSituationmatrimoniale.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					description: '',
				};
				vm.allRecordsSituationmatrimoniale.push(items);
				vm.allRecordsSituationmatrimoniale.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemSituationmatrimoniale = it;
					}
				});			
			};
        };
        vm.annulerSituationmatrimoniale = function(item) {
			if (!item.id) {
				vm.allRecordsSituationmatrimoniale.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.description = currentItem.description;
			vm.selectedItemSituationmatrimoniale = {} ;
			vm.selectedItemSituationmatrimoniale.$selected = false;
       };
        vm.modifierSituationmatrimoniale = function(item) {
			NouvelItem = false ;
			vm.selectedItemSituationmatrimoniale = item;
			currentItem = angular.copy(vm.selectedItemSituationmatrimoniale);
			$scope.vm.allRecordsSituationmatrimoniale.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemSituationmatrimoniale.description = vm.selectedItemSituationmatrimoniale.description;
			vm.selectedItemSituationmatrimoniale.$edit = true;	
        };
        vm.supprimerSituationmatrimoniale = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemSituationmatrimoniale,1);
			}, function() {
			});
        }
		// Fin Situation matrimoniale
		// Début Indice de vulnerabilite 
        vm.selectionIndicevulnerabilite= function (item) {     
            vm.selectedItemIndicevulnerabilite = item;
        };
        $scope.$watch('vm.selectedItemIndicevulnerabilite', function() {
			if (!vm.allRecordsIndicevulnerabilite) return;
			vm.allRecordsIndicevulnerabilite.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemIndicevulnerabilite.$selected = true;
        });
        vm.ajouterIndicevulnerabilite = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemIndicevulnerabilite.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					description: '',
				};
				vm.allRecordsIndicevulnerabilite.push(items);
				vm.allRecordsIndicevulnerabilite.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemIndicevulnerabilite = it;
					}
				});			
			};
        };
        vm.annulerIndicevulnerabilite = function(item) {
			if (!item.id) {
				vm.allRecordsIndicevulnerabilite.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.description = currentItem.description;
			vm.selectedItemIndicevulnerabilite = {} ;
			vm.selectedItemIndicevulnerabilite.$selected = false;
       };
        vm.modifierIndicevulnerabilite = function(item) {
			NouvelItem = false ;
			vm.selectedItemIndicevulnerabilite = item;
			currentItem = angular.copy(vm.selectedItemIndicevulnerabilite);
			$scope.vm.allRecordsIndicevulnerabilite.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemIndicevulnerabilite.description = vm.selectedItemIndicevulnerabilite.description;
			vm.selectedItemIndicevulnerabilite.$edit = true;	
        };
        vm.supprimerIndicevulnerabilite = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemIndicevulnerabilite,1);
			}, function() {
			});
        }
		// Fin Indice de vulnerabilite
		
        function test_existence (item,suppression) {    
			if(item.description.length > 0) {
				var doublon = 0;
				if (suppression!=1) {
					switch(vm.cas) {
						case 1:  {
							vm.allRecordsLiendeparente.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 2:  {
							vm.allRecordsHandicapvisuel.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 3:  {
							vm.allRecordsHandicapparole.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 4:  { 
							vm.allRecordsHandicapauditif.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 5:  {
							vm.allRecordsHandicapmental.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 6:  {
							vm.allRecordsHandicapmoteur.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 7:  {
							vm.allRecordsNiveaudeclasse.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 8:  {
							vm.allRecordsLangue.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 9:  {
							vm.allRecordsTypeecole.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 10:  {
							vm.allRecordsGroupeappartenance.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 11:  {
							vm.allRecordsSituationmatrimoniale.forEach(function(dispo) {   
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

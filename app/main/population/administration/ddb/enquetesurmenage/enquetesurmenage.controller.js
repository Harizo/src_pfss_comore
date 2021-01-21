(function ()
{
    'use strict';

    angular
        .module('app.population.ddb.enquetesurmenage')
        .controller('EnquetesurmenageController', EnquetesurmenageController);
    /** @ngInject */
    function EnquetesurmenageController($mdDialog, $scope, apiFactory, $state,$cookieStore)  {
		var vm = this;
		vm.titrepage ="Ajout Tutelle";
		vm.ajout = ajout ;
		var NouvelItem=false;
		var currentItem;
		vm.selectedItemTypelogement = {} ;     
		vm.selectedItemOccupationlogement = {} ;     
		vm.selectedItemRevetementtoit = {} ;     
		vm.selectedItemRevetementsol = {} ;
		vm.selectedItemRevetementmur = {} ;     
		vm.selectedItemSourceeclairage = {} ;     
		vm.selectedItemCombustible = {} ;     
		vm.selectedItemToilette = {} ;     
		vm.selectedItemSourceeau = {} ;     
		vm.selectedItemBienequipement = {} ;     
		vm.selectedItemMoyenproduction = {} ;     
		vm.selectedItemSourcerevenu = {} ;     
		vm.selectedItemElevage = {} ;     
		vm.selectedItemCulture = {} ;     
		vm.selectedItemAliment = {} ;     
		vm.selectedItemStrategiealimentaire = {} ;     
		vm.selectedItemProblememenage = {} ;     
		vm.selectedItemStrategierevenu = {} ;     
		vm.selectedItemActiviterecoursmenage = {} ;     
		vm.selectedItemServicebeneficie = {} ;     
		vm.selectedItemInfrastructure = {} ;     
		vm.selectedItemSourceobtentionaliment = {} ;     
		
		vm.allRecordsTypelogement = [] ;     
		vm.allRecordsOccupationlogement = [] ;     
		vm.allRecordsRevetementtoit = [] ;    
		vm.allRecordsRevetementsol = [] ;     
		vm.allRecordsRevetementmur = [] ;     
		vm.allRecordsSourceeclairage = [] ;     
		vm.allRecordsCombustible = [] ;     
		vm.allRecordsToilette = [] ;     
		vm.allRecordsSourceeau = [] ;     
		vm.allRecordsBienequipement = [] ;     
		vm.allRecordsMoyenproduction = [] ;     
		vm.allRecordsSourcerevenu = [] ;     
		vm.allRecordsElevage = [] ;     
		vm.allRecordsCulture = [] ;     
		vm.allRecordsAliment = [] ;     
		vm.allRecordsStrategiealimentaire = [] ;     
		vm.allRecordsProblememenage = [] ;     
		vm.allRecordsStrategierevenu = [] ;     
		vm.allRecordsActiviterecoursmenage = [] ;     
		vm.allRecordsServicebeneficie = [] ;     
		vm.allRecordsInfrastructure = [] ;     
		vm.allRecordsSourceobtentionaliment = [] ;     

		vm.nom_table="type_logement";
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
		vm.typelog_titre = [{titre:"Code"},{titre:"Description"},{titre:"Actions"}];
		vm.occup_titre = [{titre:"Code"},{titre:"Description"},{titre:"Actions"}];
		vm.revt_toit_titre = [{titre:"Code"},{titre:"Description"},{titre:"Actions"}];
		vm.revt_sol_titre = [{titre:"Code"},{titre:"Description"},{titre:"Actions"}];
		vm.revt_mur_titre = [{titre:"Code"},{titre:"Description"},{titre:"Actions"}];
		apiFactory.getTable("enquete_menage/index","type_eclairage").then(function(result){
			vm.allRecordsSourceeclairage = result.data.response;
			apiFactory.getTable("enquete_menage/index","type_revetement_mur").then(function(result){
				vm.allRecordsRevetementmur = result.data.response;
				apiFactory.getTable("enquete_menage/index","type_revetement_sol").then(function(result){
					vm.allRecordsRevetementsol = result.data.response;
					apiFactory.getTable("enquete_menage/index","type_revetement_toit").then(function(result){
						vm.allRecordsRevetementtoit = result.data.response;
						apiFactory.getTable("enquete_menage/index","occupation_logement").then(function(result){
							vm.allRecordsOccupationlogement = result.data.response;
							apiFactory.getTable("enquete_menage/index","type_logement").then(function(result){
								vm.allRecordsTypelogement = result.data.response;
							});    
						});    
					});    
				});    
			});    
		});    
		apiFactory.getTable("enquete_menage/index","type_culture").then(function(result){
			vm.allRecordsCulture = result.data.response;
			apiFactory.getTable("enquete_menage/index","type_elevage").then(function(result){
				vm.allRecordsElevage = result.data.response;
				apiFactory.getTable("enquete_menage/index","type_source_revenu").then(function(result){
					vm.allRecordsSourcerevenu = result.data.response;
					apiFactory.getTable("enquete_menage/index","type_moyen_production").then(function(result){
						vm.allRecordsMoyenproduction = result.data.response;
						apiFactory.getTable("enquete_menage/index","type_bien_equipement").then(function(result){
							vm.allRecordsBienequipement = result.data.response;
							apiFactory.getTable("enquete_menage/index","type_source_eau").then(function(result){
								vm.allRecordsSourceeau = result.data.response;
								apiFactory.getTable("enquete_menage/index","type_toilette").then(function(result){
									vm.allRecordsToilette = result.data.response;
									apiFactory.getTable("enquete_menage/index","type_combustible").then(function(result){
										vm.allRecordsCombustible = result.data.response;
									});    
								});    
							});    
						});    
					});    
				});    
			});    
		});    
		apiFactory.getTable("enquete_menage/index","type_infrastructure").then(function(result){
			vm.allRecordsInfrastructure = result.data.response;
			apiFactory.getTable("enquete_menage/index","type_service_beneficie").then(function(result){
				vm.allRecordsServicebeneficie = result.data.response;
				apiFactory.getTable("enquete_menage/index","type_engagement_activite").then(function(result){
					vm.allRecordsActiviterecoursmenage = result.data.response;
					apiFactory.getTable("enquete_menage/index","type_strategie_face_probleme").then(function(result){
						vm.allRecordsStrategierevenu = result.data.response;
						apiFactory.getTable("enquete_menage/index","type_probleme_revenu").then(function(result){
							vm.allRecordsProblememenage = result.data.response;
							apiFactory.getTable("enquete_menage/index","type_difficulte_alimentaire").then(function(result){
								vm.allRecordsStrategiealimentaire = result.data.response;
								apiFactory.getTable("enquete_menage/index","type_aliment").then(function(result){
									vm.allRecordsAliment = result.data.response;
								});    
								apiFactory.getTable("enquete_menage/index","type_source_obtention_aliment").then(function(result){
									vm.allRecordsSourceobtentionaliment = result.data.response;
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
			action:"Consultation DDB : Enquête/Ménage",
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
						vm.nom_table="type_logement";
						vm.cas=1;
						break;
					}
					case 2:  {
						vm.nom_table="occupation_logement";
						vm.cas=2;
						break;
					}
					case 3:  {
						vm.nom_table="type_revetement_toit";
						vm.cas=3;
						break;
					}
					case 4:  {
						vm.nom_table="type_revetement_sol";
						vm.cas=4;
						break;
					}
					case 5:  {
						vm.nom_table="type_revetement_mur";
						vm.cas=5;
						break;
					}
					case 6:  {
						vm.nom_table="type_eclairage";
						vm.cas=6;
						break;
					}
					case 7:  {
						vm.nom_table="type_combustible";
						vm.cas=7;
						break;
					}
					case 8:  {
						vm.nom_table="type_toilette";
						vm.cas=8;
						break;
					}
					case 9:  {
						vm.nom_table="type_source_eau";
						vm.cas=9;
						break;
					}
					case 10:  {
						vm.nom_table="type_bien_equipement";
						vm.cas=10;
						break;
					}
					case 11:  {
						vm.nom_table="type_moyen_production";
						vm.cas=11;
						break;
					}
					case 12:  {
						vm.nom_table="type_source_revenu";
						vm.cas=12;
						break;
					}
					case 13:  {
						vm.nom_table="type_elevage";
						vm.cas=13;
						break;
					}
					case 14:  {
						vm.nom_table="type_culture";
						vm.cas=14;
						break;
					}
					case 15:  {
						vm.nom_table="type_aliment";
						vm.cas=15;
						break;
					}
					case 16:  {
						vm.nom_table="type_difficulte_alimentaire";
						vm.cas=16;
						break;
					}
					case 17:  {
						vm.nom_table="type_probleme_revenu";
						vm.cas=17;
						break;
					}
					case 18:  {
						vm.nom_table="type_strategie_face_probleme";
						vm.cas=18;
						break;
					}
					case 19:  {
						vm.nom_table="type_engagement_activite";
						vm.cas=19;
						break;
					}
					case 20:  {
						vm.nom_table="type_service_beneficie";
						vm.cas=20;
						break;
					}
					case 21:  {
						vm.nom_table="type_infrastructure";
						vm.cas=21;
						break;
					}
					case 22:  {
						vm.nom_table="type_source_obtention_aliment";
						vm.cas=22;
						break;
					}
					default: {
						vm.nom_table="type_logement";
						vm.cas=1;
						break;
					}
				}				
			} else {
				vm.nom_table="type_logement";
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
								vm.selectedItemTypelogement.code = possession.code;
								vm.selectedItemTypelogement.description = possession.description;
								vm.selectedItemTypelogement.$selected = false;
								vm.selectedItemTypelogement.$edit = false;
								vm.selectedItemTypelogement ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Ménage : Type de logement" + " ("+ possession.description + ")";
								break;
							}
							case 2:  {
								vm.selectedItemOccupationlogement.code = possession.code;
								vm.selectedItemOccupationlogement.description = possession.description;
								vm.selectedItemOccupationlogement.$selected = false;
								vm.selectedItemOccupationlogement.$edit = false;
								vm.selectedItemOccupationlogement ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Ménage : Occupation logement" + " ("+ possession.description + ")";
								break;
							}
							case 3:  {
								vm.selectedItemRevetementtoit.code = possession.code;
								vm.selectedItemRevetementtoit.description = possession.description;
								vm.selectedItemRevetementtoit.$selected = false;
								vm.selectedItemRevetementtoit.$edit = false;
								vm.selectedItemRevetementtoit ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Ménage : Revetement toit" + " ("+ possession.description + ")";
								break;
							}
							case 4:  {
								vm.selectedItemRevetementsol.code = possession.code;
								vm.selectedItemRevetementsol.description = possession.description;
								vm.selectedItemRevetementsol.$selected = false;
								vm.selectedItemRevetementsol.$edit = false;
								vm.selectedItemRevetementsol ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Ménage : Revetement sol" + " ("+ possession.description + ")";
								break;
							}
							case 5:  {
								vm.selectedItemRevetementmur.code = possession.code;
								vm.selectedItemRevetementmur.description = possession.description;
								vm.selectedItemRevetementmur.$selected = false;
								vm.selectedItemRevetementmur.$edit = false;
								vm.selectedItemRevetementmur ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Ménage : Revetement mur" + " ("+ possession.description + ")";
								break;
							}
							case 6:  {
								vm.selectedItemSourceeclairage.code = possession.code;
								vm.selectedItemSourceeclairage.description = possession.description;
								vm.selectedItemSourceeclairage.$selected = false;
								vm.selectedItemSourceeclairage.$edit = false;
								vm.selectedItemSourceeclairage ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Ménage : Source d'éclairage" + " ("+ possession.description + ")";
								break;
							}
							case 7:  {
								vm.selectedItemCombustible.code = possession.code;
								vm.selectedItemCombustible.description = possession.description;
								vm.selectedItemCombustible.$selected = false;
								vm.selectedItemCombustible.$edit = false;
								vm.selectedItemCombustible ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Ménage : Combustible" + " ("+ possession.description + ")";
								break;
							}
							case 8:  {
								vm.selectedItemToilette.code = possession.code;
								vm.selectedItemToilette.description = possession.description;
								vm.selectedItemToilette.$selected = false;
								vm.selectedItemToilette.$edit = false;
								vm.selectedItemToilette ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Ménage : Toilette" + " ("+ possession.description + ")";
								break;
							}
							case 9:  {
								vm.selectedItemSourceeau.code = possession.code;
								vm.selectedItemSourceeau.description = possession.description;
								vm.selectedItemSourceeau.$selected = false;
								vm.selectedItemSourceeau.$edit = false;
								vm.selectedItemSourceeau ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Ménage : Source d'eau" + " ("+ possession.description + ")";
								break;
							}
							case 10:  {
								vm.selectedItemBienequipement.code = possession.code;
								vm.selectedItemBienequipement.description = possession.description;
								vm.selectedItemBienequipement.$selected = false;
								vm.selectedItemBienequipement.$edit = false;
								vm.selectedItemBienequipement ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Ménage : Bien équipement" + " ("+ possession.description + ")";
								break;
							}
							case 11:  {
								vm.selectedItemMoyenproduction.code = possession.code;
								vm.selectedItemMoyenproduction.description = possession.description;
								vm.selectedItemMoyenproduction.$selected = false;
								vm.selectedItemMoyenproduction.$edit = false;
								vm.selectedItemMoyenproduction ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Ménage : Moyen de production" + " ("+ possession.description + ")";
								break;
							}
							case 12:  {
								vm.selectedItemSourcerevenu.code = possession.code;
								vm.selectedItemSourcerevenu.description = possession.description;
								vm.selectedItemSourcerevenu.$selected = false;
								vm.selectedItemSourcerevenu.$edit = false;
								vm.selectedItemSourcerevenu ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Ménage : Source de revenu" + " ("+ possession.description + ")";
								break;
							}
							case 13:  {
								vm.selectedItemElevage.code = possession.code;
								vm.selectedItemElevage.description = possession.description;
								vm.selectedItemElevage.$selected = false;
								vm.selectedItemElevage.$edit = false;
								vm.selectedItemElevage ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Ménage : Type élévage" + " ("+ possession.description + ")";
								break;
							}
							case 14:  {
								vm.selectedItemCulture.code = possession.code;
								vm.selectedItemCulture.description = possession.description;
								vm.selectedItemCulture.$selected = false;
								vm.selectedItemCulture.$edit = false;
								vm.selectedItemCulture ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Ménage : Type culture" + " ("+ possession.description + ")";
								break;
							}
							case 15:  {
								vm.selectedItemAliment.code = possession.code;
								vm.selectedItemAliment.description = possession.description;
								vm.selectedItemAliment.$selected = false;
								vm.selectedItemAliment.$edit = false;
								vm.selectedItemAliment ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Ménage : Type aliment" + " ("+ possession.description + ")";
								break;
							}
							case 16:  {
								vm.selectedItemStrategiealimentaire.code = possession.code;
								vm.selectedItemStrategiealimentaire.description = possession.description;
								vm.selectedItemStrategiealimentaire.$selected = false;
								vm.selectedItemStrategiealimentaire.$edit = false;
								vm.selectedItemStrategiealimentaire ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Ménage : Stratégie alimentaire" + " ("+ possession.description + ")";
								break;
							}
							case 17:  {
								vm.selectedItemProblememenage.code = possession.code;
								vm.selectedItemProblememenage.description = possession.description;
								vm.selectedItemProblememenage.$selected = false;
								vm.selectedItemProblememenage.$edit = false;
								vm.selectedItemProblememenage ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Ménage : Problème sur revenu ménage" + " ("+ possession.description + ")";
								break;
							}
							case 18:  {
								vm.selectedItemStrategierevenu.code = possession.code;
								vm.selectedItemStrategierevenu.description = possession.description;
								vm.selectedItemStrategierevenu.$selected = false;
								vm.selectedItemStrategierevenu.$edit = false;
								vm.selectedItemStrategierevenu ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Ménage : Stratégie sur revenu" + " ("+ possession.description + ")";
								break;
							}
							case 19:  {
								vm.selectedItemActiviterecoursmenage.code = possession.code;
								vm.selectedItemActiviterecoursmenage.description = possession.description;
								vm.selectedItemActiviterecoursmenage.$selected = false;
								vm.selectedItemActiviterecoursmenage.$edit = false;
								vm.selectedItemActiviterecoursmenage ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Ménage : Activité de recours" + " ("+ possession.description + ")";
								break;
							}
							case 20:  {
								vm.selectedItemServicebeneficie.code = possession.code;
								vm.selectedItemServicebeneficie.description = possession.description;
								vm.selectedItemServicebeneficie.$selected = false;
								vm.selectedItemServicebeneficie.$edit = false;
								vm.selectedItemServicebeneficie ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Ménage : Service bénéficiée" + " ("+ possession.description + ")";
								break;
							}
							case 21:  {
								vm.selectedItemInfrastructure.code = possession.code;
								vm.selectedItemInfrastructure.description = possession.description;
								vm.selectedItemInfrastructure.$selected = false;
								vm.selectedItemInfrastructure.$edit = false;
								vm.selectedItemInfrastructure ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Ménage : Infrastructure fréquentée" + " ("+ possession.description + ")";
								break;
							}
							case 22:  {
								vm.selectedItemSourceobtentionaliment.code = possession.code;
								vm.selectedItemSourceobtentionaliment.description = possession.description;
								vm.selectedItemSourceobtentionaliment.$selected = false;
								vm.selectedItemSourceobtentionaliment.$edit = false;
								vm.selectedItemSourceobtentionaliment ={};
								vm.action="Modification d'un enregistrement de DDB Enquête/Ménage : Source d'obtention aliment" + " ("+ possession.description + ")";
								break;
							}
							default: {
								break;
							}
						}	
					} else {    
						switch(vm.cas) {
							case 1:  {
								vm.allRecordsTypelogement = vm.allRecordsTypelogement.filter(function(obj) {
									return obj.id !== vm.selectedItemTypelogement.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Ménage : Type logement" + " ("+ possession.description + ")";
								break;
							}
							case 2:  {
								vm.allRecordsOccupationlogement = vm.allRecordsOccupationlogement.filter(function(obj) {
									return obj.id !== vm.selectedItemOccupationlogement.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Ménage : Occupation logement" + " ("+ possession.description + ")";
								break;
							}
							case 3:  {
								vm.allRecordsRevetementtoit = vm.allRecordsRevetementtoit.filter(function(obj) {
									return obj.id !== vm.selectedItemRevetementtoit.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Ménage : Revetement toit" + " ("+ possession.description + ")";
								break;
							}
							case 4:  {
								vm.allRecordsRevetementsol = vm.allRecordsRevetementsol.filter(function(obj) {
									return obj.id !== vm.selectedItemRevetementsol.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Ménage : Revetement sol" + " ("+ possession.description + ")";
								break;
							}
							case 5:  {
								vm.allRecordsRevetementmur = vm.allRecordsRevetementmur.filter(function(obj) {
									return obj.id !== vm.selectedItemRevetementmur.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Ménage : Revetement mur" + " ("+ possession.description + ")";
								break;
							}
							case 6:  {
								vm.allRecordsSourceeclairage = vm.allRecordsSourceeclairage.filter(function(obj) {
									return obj.id !== vm.selectedItemSourceeclairage.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Ménage : Source d'éclairage" + " ("+ possession.description + ")";
								break;
							}
							case 7:  {
								vm.allRecordsCombustible = vm.allRecordsCombustible.filter(function(obj) {
									return obj.id !== vm.selectedItemCombustible.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Ménage : Type de combustible" + " ("+ possession.description + ")";
								break;
							}
							case 8:  {
								vm.allRecordsToilette = vm.allRecordsToilette.filter(function(obj) {
									return obj.id !== vm.selectedItemToilette.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Ménage : Combustible" + " ("+ possession.description + ")";
								break;
							}
							case 9:  {
								vm.allRecordsSourceeau = vm.allRecordsSourceeau.filter(function(obj) {
									return obj.id !== vm.selectedItemSourceeau.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Ménage : Source d'eau" + " ("+ possession.description + ")";
								break;
							}
							case 10:  {
								vm.allRecordsBienequipement = vm.allRecordsBienequipement.filter(function(obj) {
									return obj.id !== vm.selectedItemBienequipement.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Ménage : Bien équipement" + " ("+ possession.description + ")";
								break;
							}
							case 11:  {
								vm.allRecordsMoyenproduction = vm.allRecordsMoyenproduction.filter(function(obj) {
									return obj.id !== vm.selectedItemMoyenproduction.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Ménage : Moyen de production" + " ("+ possession.description + ")";
								break;
							}
							case 12:  {
								vm.allRecordsSourcerevenu = vm.allRecordsSourcerevenu.filter(function(obj) {
									return obj.id !== vm.selectedItemSourcerevenu.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Ménage : Source de revenu" + " ("+ possession.description + ")";
								break;
							}
							case 13:  {
								vm.allRecordsElevage = vm.allRecordsElevage.filter(function(obj) {
									return obj.id !== vm.selectedItemElevage.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Ménage : Type élévage" + " ("+ possession.description + ")";
								break;
							}
							case 14:  {
								vm.allRecordsCulture = vm.allRecordsCulture.filter(function(obj) {
									return obj.id !== vm.selectedItemCulture.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Ménage : Type culture" + " ("+ possession.description + ")";
								break;
							}
							case 15:  {
								vm.allRecordsAliment = vm.allRecordsAliment.filter(function(obj) {
									return obj.id !== vm.selectedItemAliment.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Ménage : Aliment" + " ("+ possession.description + ")";
								break;
							}
							case 16:  {
								vm.allRecordsStrategiealimentaire = vm.allRecordsStrategiealimentaire.filter(function(obj) {
									return obj.id !== vm.selectedItemStrategiealimentaire.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Ménage : Stratégie alimentaire" + " ("+ possession.description + ")";
								break;
							}
							case 17:  {
								vm.allRecordsProblememenage = vm.allRecordsProblememenage.filter(function(obj) {
									return obj.id !== vm.selectedItemProblememenage.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Ménage : Problème sur revenu ménage" + " ("+ possession.description + ")";
								break;
							}
							case 18:  {
								vm.allRecordsStrategierevenu = vm.allRecordsStrategierevenu.filter(function(obj) {
									return obj.id !== vm.selectedItemStrategierevenu.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Ménage : Stratégie sur revenu" + " ("+ possession.description + ")";
								break;
							}
							case 19:  {
								vm.allRecordsActiviterecoursmenage = vm.allRecordsActiviterecoursmenage.filter(function(obj) {
									return obj.id !== vm.selectedItemActiviterecoursmenage.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Ménage : Activité de recours" + " ("+ possession.description + ")";
								break;
							}
							case 20:  {
								vm.allRecordsServicebeneficie = vm.allRecordsServicebeneficie.filter(function(obj) {
									return obj.id !== vm.selectedItemServicebeneficie.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Ménage : Service bénéficiée" + " ("+ possession.description + ")";
								break;
							}
							case 21:  {
								vm.allRecordsInfrastructure = vm.allRecordsInfrastructure.filter(function(obj) {
									return obj.id !== vm.selectedItemInfrastructure.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Ménage : Infrastructure fréquenté" + " ("+ possession.description + ")";
								break;
							}
							case 22:  {
								vm.allRecordsSourceobtentionaliment = vm.allRecordsSourceobtentionaliment.filter(function(obj) {
									return obj.id !== vm.selectedItemSourceobtentionaliment.id;
								});
								vm.action="Suppression d'un enregistrement de DDB Enquête/Ménage : Source d'obtention aliment" + " ("+ possession.description + ")";
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
							vm.selectedItemTypelogement ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Ménage : Type de logement" + " ("+ possession.description + ")";
							break;
						}
						case 2:  {
							vm.selectedItemOccupationlogement ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Ménage : Occupation de logement" + " ("+ possession.description + ")";
							break;
						}
						case 3:  {
							vm.selectedItemRevetementtoit ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Ménage : Revetement toit" + " ("+ possession.description + ")";
							break;
						}
						case 4:  {
							vm.selectedItemRevetementsol ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Ménage : Revetement sol" + " ("+ possession.description + ")";
							break;
						}
						case 5:  {
							vm.selectedItemRevetementmur ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Ménage : Revetement mur" + " ("+ possession.description + ")";
							break;
						}
						case 6:  {
							vm.selectedItemSourceeclairage ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Ménage : Source d'éclairage" + " ("+ possession.description + ")";
							break;
						}
						case 7:  {
							vm.selectedItemCombustible ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Ménage : Type de combustible" + " ("+ possession.description + ")";
							break;
						}
						case 8:  {
							vm.selectedItemToilette ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Ménage : Type de toilette" + " ("+ possession.description + ")";
							break;
						}
						case 9:  {
							vm.selectedItemSourceeau ={};
							vm.action="Ajout d'un enregistrement de DDB : Source d'eau" + " ("+ possession.description + ")";
							break;
						}
						case 10:  {
							vm.selectedItemBienequipement ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Ménage : Bien équipement" + " ("+ possession.description + ")";
							break;
						}
						case 11:  {
							vm.selectedItemMoyenproduction ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Ménage : Moyen de production" + " ("+ possession.description + ")";
							break;
						}
						case 12:  {
							vm.selectedItemSourcerevenu ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Ménage : Source de revenu" + " ("+ possession.description + ")";
							break;
						}
						case 13:  {
							vm.selectedItemElevage ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Ménage : Type d'élévage" + " ("+ possession.description + ")";
							break;
						}
						case 14:  {
							vm.selectedItemCulture ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Ménage : Type de culture" + " ("+ possession.description + ")";
							break;
						}
						case 15:  {
							vm.selectedItemAliment ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Ménage : Aliment" + " ("+ possession.description + ")";
							break;
						}
						case 16:  {
							vm.selectedItemStrategiealimentaire ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Ménage : Stratégie alimentaire" + " ("+ possession.description + ")";
							break;
						}
						case 17:  {
							vm.selectedItemProblememenage ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Ménage : Problème sur revenu ménage" + " ("+ possession.description + ")";
							break;
						}
						case 18:  {
							vm.selectedItemStrategierevenu ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Ménage : Stratégie sur revenu" + " ("+ possession.description + ")";
							break;
						}
						case 19:  {
							vm.selectedItemActiviterecoursmenage ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Ménage : Activité de recours" + " ("+ possession.description + ")";
							break;
						}
						case 20:  {
							vm.selectedItemServicebeneficie ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Ménage : Service bénéficiée" + " ("+ possession.description + ")";
							break;
						}
						case 21:  {
							vm.selectedItemInfrastructure ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Ménage : Infrastructure fréquentée" + " ("+ possession.description + ")";
							break;
						}
						case 22:  {
							vm.selectedItemSourceobtentionaliment ={};
							vm.action="Ajout d'un enregistrement de DDB Enquête/Ménage : Source d'obtention aliment" + " ("+ possession.description + ")";
							break;
						}
						default: {
							vm.selectedItemTypelogement ={};
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
		// Type logement
        vm.selectionTypelogement= function (item) {     
            vm.selectedItemTypelogement = item;
        };
        $scope.$watch('vm.selectedItemTypelogement', function() {
			if (!vm.allRecordsTypelogement) return;
			vm.allRecordsTypelogement.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemTypelogement.$selected = true;
        });
        vm.ajouterTypelogement = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemTypelogement.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsTypelogement.push(items);
				vm.allRecordsTypelogement.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemTypelogement = it;
					}
				});			
			};
        };
        vm.annulerTypelogement = function(item) {
			if (!item.id) {
				vm.allRecordsTypelogement.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemTypelogement = {} ;
			vm.selectedItemTypelogement.$selected = false;
       };
        vm.modifierTypelogement = function(item) {
			NouvelItem = false ;
			vm.selectedItemTypelogement = item;
			currentItem = angular.copy(vm.selectedItemTypelogement);
			$scope.vm.allRecordsTypelogement.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemTypelogement.description = vm.selectedItemTypelogement.description;
			vm.selectedItemTypelogement.$edit = true;	
        };
        vm.supprimerTypelogement = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemTypelogement,1);
			}, function() {
			});
        }
		// Type logement
		// Occupation logement
        vm.selectionOccupationlogement= function (item) {     
            vm.selectedItemOccupationlogement = item;
        };
        $scope.$watch('vm.selectedItemOccupationlogement', function() {
			if (!vm.allRecordsOccupationlogement) return;
			vm.allRecordsOccupationlogement.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemOccupationlogement.$selected = true;
        });
        vm.ajouterOccupationlogement = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemOccupationlogement.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsOccupationlogement.push(items);
				vm.allRecordsOccupationlogement.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemOccupationlogement = it;
					}
				});			
			};
        };
        vm.annulerOccupationlogement = function(item) {
			if (!item.id) {
				vm.allRecordsOccupationlogement.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemOccupationlogement = {} ;
			vm.selectedItemOccupationlogement.$selected = false;
       };
        vm.modifierOccupationlogement = function(item) {
			NouvelItem = false ;
			vm.selectedItemOccupationlogement = item;
			currentItem = angular.copy(vm.selectedItemOccupationlogement);
			$scope.vm.allRecordsOccupationlogement.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemOccupationlogement.description = vm.selectedItemOccupationlogement.description;
			vm.selectedItemOccupationlogement.$edit = true;	
        };
        vm.supprimerOccupationlogement = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemOccupationlogement,1);
			}, function() {
			});
        }
		// Occupation logement
		// Revetement toit
        vm.selectionRevetementtoit= function (item) {     
            vm.selectedItemRevetementtoit = item;
        };
        $scope.$watch('vm.selectedItemRevetementtoit', function() {
			if (!vm.allRecordsRevetementtoit) return;
			vm.allRecordsRevetementtoit.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemRevetementtoit.$selected = true;
        });
        vm.ajouterRevetementtoit = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemRevetementtoit.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsRevetementtoit.push(items);
				vm.allRecordsRevetementtoit.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemRevetementtoit = it;
					}
				});			
			};
        };
        vm.annulerRevetementtoit = function(item) {
			if (!item.id) {
				vm.allRecordsRevetementtoit.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemRevetementtoit = {} ;
			vm.selectedItemRevetementtoit.$selected = false;
       };
        vm.modifierRevetementtoit = function(item) {
			NouvelItem = false ;
			vm.selectedItemRevetementtoit = item;
			currentItem = angular.copy(vm.selectedItemRevetementtoit);
			$scope.vm.allRecordsRevetementtoit.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemRevetementtoit.description = vm.selectedItemRevetementtoit.description;
			vm.selectedItemRevetementtoit.$edit = true;	
        };
        vm.supprimerRevetementtoit = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemRevetementtoit,1);
			}, function() {
			});
        }
		// Revetement toit
		// Revetement sol
        vm.selectionRevetementsol= function (item) {     
            vm.selectedItemRevetementsol = item;
        };
        $scope.$watch('vm.selectedItemRevetementsol', function() {
			if (!vm.allRecordsRevetementsol) return;
			vm.allRecordsRevetementsol.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemRevetementsol.$selected = true;
        });
        vm.ajouterRevetementsol = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemRevetementsol.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsRevetementsol.push(items);
				vm.allRecordsRevetementsol.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemRevetementsol = it;
					}
				});			
			};
        };
        vm.annulerRevetementsol = function(item) {
			if (!item.id) {
				vm.allRecordsRevetementsol.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemRevetementsol = {} ;
			vm.selectedItemRevetementsol.$selected = false;
       };
        vm.modifierRevetementsol = function(item) {
			NouvelItem = false ;
			vm.selectedItemRevetementsol = item;
			currentItem = angular.copy(vm.selectedItemRevetementsol);
			$scope.vm.allRecordsRevetementsol.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemRevetementsol.description = vm.selectedItemRevetementsol.description;
			vm.selectedItemRevetementsol.$edit = true;	
        };
        vm.supprimerRevetementsol = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemRevetementsol,1);
			}, function() {
			});
        }
		// Revetement sol
		// Revetement mur     
        vm.selectionRevetementmur= function (item) {     
            vm.selectedItemRevetementmur = item;
        };
        $scope.$watch('vm.selectedItemRevetementmur', function() {
			if (!vm.allRecordsRevetementmur) return;
			vm.allRecordsRevetementmur.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemRevetementmur.$selected = true;
        });
        vm.ajouterRevetementmur = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemRevetementmur.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsRevetementmur.push(items);
				vm.allRecordsRevetementmur.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemRevetementmur = it;
					}
				});			
			};
        };
        vm.annulerRevetementmur = function(item) {
			if (!item.id) {
				vm.allRecordsRevetementmur.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemRevetementmur = {} ;
			vm.selectedItemRevetementmur.$selected = false;
       };
        vm.modifierRevetementmur = function(item) {
			NouvelItem = false ;
			vm.selectedItemRevetementmur = item;
			currentItem = angular.copy(vm.selectedItemRevetementmur);
			$scope.vm.allRecordsRevetementmur.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemRevetementmur.description = vm.selectedItemRevetementmur.description;
			vm.selectedItemRevetementmur.$edit = true;	
        };
        vm.supprimerRevetementmur = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemRevetementmur,1);
			}, function() {
			});
        }
		// Revetement mur     
		// Source eclairage   
        vm.selectionSourceeclairage= function (item) {     
            vm.selectedItemSourceeclairage = item;
        };
        $scope.$watch('vm.selectedItemSourceeclairage', function() {
			if (!vm.allRecordsSourceeclairage) return;
			vm.allRecordsSourceeclairage.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemSourceeclairage.$selected = true;
        });
        vm.ajouterSourceeclairage = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemSourceeclairage.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsSourceeclairage.push(items);
				vm.allRecordsSourceeclairage.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemSourceeclairage = it;
					}
				});			
			};
        };
        vm.annulerSourceeclairage = function(item) {
			if (!item.id) {
				vm.allRecordsSourceeclairage.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemSourceeclairage = {} ;
			vm.selectedItemSourceeclairage.$selected = false;
       };
        vm.modifierSourceeclairage = function(item) {
			NouvelItem = false ;
			vm.selectedItemSourceeclairage = item;
			currentItem = angular.copy(vm.selectedItemSourceeclairage);
			$scope.vm.allRecordsSourceeclairage.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemSourceeclairage.description = vm.selectedItemSourceeclairage.description;
			vm.selectedItemSourceeclairage.$edit = true;	
        };
        vm.supprimerSourceeclairage = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemSourceeclairage,1);
			}, function() {
			});
        }
		// Source eclairage 
		// Combustible  
        vm.selectionCombustible= function (item) {     
            vm.selectedItemCombustible = item;
        };
        $scope.$watch('vm.selectedItemCombustible', function() {
			if (!vm.allRecordsCombustible) return;
			vm.allRecordsCombustible.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemCombustible.$selected = true;
        });
        vm.ajouterCombustible = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemCombustible.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsCombustible.push(items);
				vm.allRecordsCombustible.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemCombustible = it;
					}
				});			
			};
        };
        vm.annuler = function(item) {
			if (!item.id) {
				vm.allRecordsCombustible.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemCombustible = {} ;
			vm.selectedItemCombustible.$selected = false;
       };
        vm.modifierCombustible = function(item) {
			NouvelItem = false ;
			vm.selectedItemCombustible = item;
			currentItem = angular.copy(vm.selectedICombustibletem);
			$scope.vm.allRecordsCombustible.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemCombustible.description = vm.selectedItemCombustible.description;
			vm.selectedItemCombustible.$edit = true;	
        };
        vm.supprimerCombustible = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemCombustible,1);
			}, function() {
			});
        }
		// Combustible  
		// Toilette 
        vm.selectionToilette= function (item) {     
            vm.selectedItemToilette = item;
        };
        $scope.$watch('vm.selectedItemToilette', function() {
			if (!vm.allRecordsToilette) return;
			vm.allRecordsToilette.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemToilette.$selected = true;
        });
        vm.ajouterToilette = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemToilette.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsToilette.push(items);
				vm.allRecordsToilette.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemToilette = it;
					}
				});			
			};
        };
        vm.annulerToilette = function(item) {
			if (!item.id) {
				vm.allRecordsToilette.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemToilette = {} ;
			vm.selectedItemToilette.$selected = false;
       };
        vm.modifierToilette = function(item) {
			NouvelItem = false ;
			vm.selectedItemToilette = item;
			currentItem = angular.copy(vm.selectedItemToilette);
			$scope.vm.allRecordsToilette.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemToilette.description = vm.selectedItemToilette.description;
			vm.selectedItemToilette.$edit = true;	
        };
        vm.supprimerToilette = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemToilette,1);
			}, function() {
			});
        }
		// Toilette    
		// Source d'eau    
        vm.selectionSourceeau= function (item) {     
            vm.selectedItemSourceeau = item;
        };
        $scope.$watch('vm.selectedItemSourceeau', function() {
			if (!vm.allRecordsSourceeau) return;
			vm.allRecordsSourceeau.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemSourceeau.$selected = true;
        });
        vm.ajouterSourceeau = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemSourceeau.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsSourceeau.push(items);
				vm.allRecordsSourceeau.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemSourceeau = it;
					}
				});			
			};
        };
        vm.annulerSourceeau = function(item) {
			if (!item.id) {
				vm.allRecordsSourceeau.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemSourceeau = {} ;
			vm.selectedItemSourceeau.$selected = false;
       };
        vm.modifierSourceeau = function(item) {
			NouvelItem = false ;
			vm.selectedItemSourceeau = item;
			currentItem = angular.copy(vm.selectedItemSourceeau);
			$scope.vm.allRecordsSourceeau.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemSourceeau.description = vm.selectedItemSourceeau.description;
			vm.selectedItemSourceeau.$edit = true;	
        };
        vm.supprimerSourceeau = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemSourceeau,1);
			}, function() {
			});
        }
		// Source d'eau    
		// Bien equipement
        vm.selectionBienequipement= function (item) {     
            vm.selectedItemBienequipement = item;
        };
        $scope.$watch('vm.selectedItemBienequipement', function() {
			if (!vm.allRecordsBienequipement) return;
			vm.allRecordsBienequipement.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemBienequipement.$selected = true;
        });
        vm.ajouterBienequipement = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemBienequipement.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsBienequipement.push(items);
				vm.allRecordsBienequipement.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemBienequipement = it;
					}
				});			
			};
        };
        vm.annulerBienequipement = function(item) {
			if (!item.id) {
				vm.allRecordsBienequipement.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemBienequipement = {} ;
			vm.selectedItemBienequipement.$selected = false;
       };
        vm.modifierBienequipement = function(item) {
			NouvelItem = false ;
			vm.selectedItemBienequipement = item;
			currentItem = angular.copy(vm.selectedItemBienequipement);
			$scope.vm.allRecordsBienequipement.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemBienequipement.description = vm.selectedItemBienequipement.description;
			vm.selectedItemBienequipement.$edit = true;	
        };
        vm.supprimerBienequipement = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemBienequipement,1);
			}, function() {
			});
        }
		// Bien equipement    
		// Moyen production 
        vm.selectionMoyenproduction= function (item) {     
            vm.selectedItemMoyenproduction = item;
        };
        $scope.$watch('vm.selectedItemMoyenproduction', function() {
			if (!vm.allRecordsMoyenproduction) return;
			vm.allRecordsMoyenproduction.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemMoyenproduction.$selected = true;
        });
        vm.ajouterMoyenproduction = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemMoyenproduction.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsMoyenproduction.push(items);
				vm.allRecordsMoyenproduction.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemMoyenproduction = it;
					}
				});			
			};
        };
        vm.annulerMoyenproduction = function(item) {
			if (!item.id) {
				vm.allRecordsMoyenproduction.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemMoyenproduction = {} ;
			vm.selectedItemMoyenproduction.$selected = false;
       };
        vm.modifierMoyenproduction = function(item) {
			NouvelItem = false ;
			vm.selectedItemMoyenproduction = item;
			currentItem = angular.copy(vm.selectedItemMoyenproduction);
			$scope.vm.allRecordsMoyenproduction.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemMoyenproduction.description = vm.selectedItemMoyenproduction.description;
			vm.selectedItemMoyenproduction.$edit = true;	
        };
        vm.supprimerMoyenproduction = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemMoyenproduction,1);
			}, function() {
			});
        }
		// Moyen production   
		// Source revenu   
        vm.selectionSourcerevenu= function (item) {     
            vm.selectedItemSourcerevenu = item;
        };
        $scope.$watch('vm.selectedItemSourcerevenu', function() {
			if (!vm.allRecordsSourcerevenu) return;
			vm.allRecordsSourcerevenu.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemSourcerevenu.$selected = true;
        });
        vm.ajouterSourcerevenu = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemSourcerevenu.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsSourcerevenu.push(items);
				vm.allRecordsSourcerevenu.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemSourcerevenu = it;
					}
				});			
			};
        };
        vm.annulerSourcerevenu = function(item) {
			if (!item.id) {
				vm.allRecordsSourcerevenu.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemSourcerevenu = {} ;
			vm.selectedItemSourcerevenu.$selected = false;
       };
        vm.modifierSourcerevenu = function(item) {
			NouvelItem = false ;
			vm.selectedItemSourcerevenu = item;
			currentItem = angular.copy(vm.selectedItemSourcerevenu);
			$scope.vm.allRecordsSourcerevenu.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemSourcerevenu.description = vm.selectedItemSourcerevenu.description;
			vm.selectedItemSourcerevenu.$edit = true;	
        };
        vm.supprimerSourcerevenu = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemSourcerevenu,1);
			}, function() {
			});
        }
		// Source revenu   
		// Elevage   
        vm.selectionElevage= function (item) {     
            vm.selectedItemElevage = item;
        };
        $scope.$watch('vm.selectedItemElevage', function() {
			if (!vm.allRecordsElevage) return;
			vm.allRecordsElevage.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemElevage.$selected = true;
        });
        vm.ajouterElevage = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemElevage.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsElevage.push(items);
				vm.allRecordsElevage.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemElevage = it;
					}
				});			
			};
        };
        vm.annulerElevage = function(item) {
			if (!item.id) {
				vm.allRecordsElevage.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemElevage = {} ;
			vm.selectedItemElevage.$selected = false;
       };
        vm.modifierElevage = function(item) {
			NouvelItem = false ;
			vm.selectedItemElevage = item;
			currentItem = angular.copy(vm.selectedItemElevage);
			$scope.vm.allRecordsElevage.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemElevage.description = vm.selectedItemElevage.description;
			vm.selectedItemElevage.$edit = true;	
        };
        vm.supprimerElevage = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemElevage,1);
			}, function() {
			});
        }
		// Elevage 
		// Culture  
        vm.selectionCulture= function (item) {     
            vm.selectedItemCulture = item;
        };
        $scope.$watch('vm.selectedItemCulture', function() {
			if (!vm.allRecordsCulture) return;
			vm.allRecordsCulture.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemCulture.$selected = true;
        });
        vm.ajouterCulture = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemCulture.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsCulture.push(items);
				vm.allRecordsCulture.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemCulture = it;
					}
				});			
			};
        };
        vm.annulerCulture = function(item) {
			if (!item.id) {
				vm.allRecordsCulture.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemCulture = {} ;
			vm.selectedItemCulture.$selected = false;
       };
        vm.modifierCulture = function(item) {
			NouvelItem = false ;
			vm.selectedItemCulture = item;
			currentItem = angular.copy(vm.selectedItemCulture);
			$scope.vm.allRecordsCulture.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemCulture.description = vm.selectedItemCulture.description;
			vm.selectedItemCulture.$edit = true;	
        };
        vm.supprimerCulture = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemCulture,1);
			}, function() {
			});
        }
		// Culture
		// Aliment
        vm.selectionAliment= function (item) {     
            vm.selectedItemAliment = item;
        };
        $scope.$watch('vm.selectedItemAliment', function() {
			if (!vm.allRecordsAliment) return;
			vm.allRecordsAliment.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemAliment.$selected = true;
        });
        vm.ajouterAliment = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemAliment.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsAliment.push(items);
				vm.allRecordsAliment.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemAliment = it;
					}
				});			
			};
        };
        vm.annulerAliment = function(item) {
			if (!item.id) {
				vm.allRecordsAliment.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemAliment = {} ;
			vm.selectedItemAliment.$selected = false;
       };
        vm.modifierAliment = function(item) {
			NouvelItem = false ;
			vm.selectedItemAliment = item;
			currentItem = angular.copy(vm.selectedItemAliment);
			$scope.vm.allRecordsAliment.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemAliment.description = vm.selectedItemAliment.description;
			vm.selectedItemAliment.$edit = true;	
        };
        vm.supprimerAliment = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemAliment,1);
			}, function() {
			});
        }
		// Aliment    
		// Strategie alimentaire
        vm.selectionStrategiealimentaire= function (item) {     
            vm.selectedItemStrategiealimentaire = item;
        };
        $scope.$watch('vm.selectedItemStrategiealimentaire', function() {
			if (!vm.allRecordsStrategiealimentaire) return;
			vm.allRecordsStrategiealimentaire.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemStrategiealimentaire.$selected = true;
        });
        vm.ajouterStrategiealimentaire = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemStrategiealimentaire.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsStrategiealimentaire.push(items);
				vm.allRecordsStrategiealimentaire.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemStrategiealimentaire = it;
					}
				});			
			};
        };
        vm.annulerStrategiealimentaire = function(item) {
			if (!item.id) {
				vm.allRecordsStrategiealimentaire.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemStrategiealimentaire = {} ;
			vm.selectedItemStrategiealimentaire.$selected = false;
       };
        vm.modifierStrategiealimentaire = function(item) {
			NouvelItem = false ;
			vm.selectedItemStrategiealimentaire = item;
			currentItem = angular.copy(vm.selectedItemStrategiealimentaire);
			$scope.vm.allRecordsStrategiealimentaire.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemStrategiealimentaire.description = vm.selectedItemStrategiealimentaire.description;
			vm.selectedItemStrategiealimentaire.$edit = true;	
        };
        vm.supprimerStrategiealimentaire = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemStrategiealimentaire,1);
			}, function() {
			});
        }
		// Strategie alimentaire    
		// Proble memenage
        vm.selectionProblememenage= function (item) {     
            vm.selectedItemProblememenage = item;
        };
        $scope.$watch('vm.selectedItemProblememenage', function() {
			if (!vm.allRecordsProblememenage) return;
			vm.allRecordsProblememenage.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemProblememenage.$selected = true;
        });
        vm.ajouterProblememenage = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemProblememenage.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsProblememenage.push(items);
				vm.allRecordsProblememenage.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemProblememenage = it;
					}
				});			
			};
        };
        vm.annulerProblememenage = function(item) {
			if (!item.id) {
				vm.allRecordsProblememenage.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemProblememenage = {} ;
			vm.selectedItemProblememenage.$selected = false;
       };
        vm.modifierProblememenage = function(item) {
			NouvelItem = false ;
			vm.selectedItemProblememenage = item;
			currentItem = angular.copy(vm.selectedItemProblememenage);
			$scope.vm.allRecordsProblememenage.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemProblememenage.description = vm.selectedItemProblememenage.description;
			vm.selectedItemProblememenage.$edit = true;	
        };
        vm.supprimerProblememenage = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemProblememenage,1);
			}, function() {
			});
        }
		// Probleme menage    
		// Strategie revenu
        vm.selectionStrategierevenu= function (item) {     
            vm.selectedItemStrategierevenu = item;
        };
        $scope.$watch('vm.selectedItemStrategierevenu', function() {
			if (!vm.allRecordsStrategierevenu) return;
			vm.allRecordsStrategierevenu.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemStrategierevenu.$selected = true;
        });
        vm.ajouterStrategierevenu = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemStrategierevenu.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsStrategierevenu.push(items);
				vm.allRecordsStrategierevenu.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemStrategierevenu = it;
					}
				});			
			};
        };
        vm.annulerStrategierevenu = function(item) {
			if (!item.id) {
				vm.allRecordsStrategierevenu.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemStrategierevenu = {} ;
			vm.selectedItemStrategierevenu.$selected = false;
       };
        vm.modifierStrategierevenu = function(item) {
			NouvelItem = false ;
			vm.selectedItemStrategierevenu = item;
			currentItem = angular.copy(vm.selectedItemStrategierevenu);
			$scope.vm.allRecordsStrategierevenu.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemStrategierevenu.description = vm.selectedItemStrategierevenu.description;
			vm.selectedItemStrategierevenu.$edit = true;	
        };
        vm.supprimerStrategierevenu = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemStrategierevenu,1);
			}, function() {
			});
        }
		// Strategierevenu    
		// Activite recours menage
        vm.selectionActiviterecoursmenage= function (item) {     
            vm.selectedItemActiviterecoursmenage = item;
        };
        $scope.$watch('vm.selectedItemActiviterecoursmenage', function() {
			if (!vm.allRecordsActiviterecoursmenage) return;
			vm.allRecordsActiviterecoursmenage.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemActiviterecoursmenage.$selected = true;
        });
        vm.ajouterActiviterecoursmenage = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemActiviterecoursmenage.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsActiviterecoursmenage.push(items);
				vm.allRecordsActiviterecoursmenage.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemActiviterecoursmenage = it;
					}
				});			
			};
        };
        vm.annulerActiviterecoursmenage = function(item) {
			if (!item.id) {
				vm.allRecordsActiviterecoursmenage.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemActiviterecoursmenage = {} ;
			vm.selectedItemActiviterecoursmenage.$selected = false;
       };
        vm.modifierActiviterecoursmenage = function(item) {
			NouvelItem = false ;
			vm.selectedItemActiviterecoursmenage = item;
			currentItem = angular.copy(vm.selectedItemActiviterecoursmenage);
			$scope.vm.allRecordsActiviterecoursmenage.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemActiviterecoursmenage.description = vm.selectedItemActiviterecoursmenage.description;
			vm.selectedItemActiviterecoursmenage.$edit = true;	
        };
        vm.supprimerActiviterecoursmenage = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemActiviterecoursmenage,1);
			}, function() {
			});
        }
		// Activite recours menage    
		// Service beneficie
        vm.selectionServicebeneficie= function (item) {     
            vm.selectedItemServicebeneficie = item;
        };
        $scope.$watch('vm.selectedItemServicebeneficie', function() {
			if (!vm.allRecordsServicebeneficie) return;
			vm.allRecordsServicebeneficie.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemServicebeneficie.$selected = true;
        });
        vm.ajouterServicebeneficie = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemServicebeneficie.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsServicebeneficie.push(items);
				vm.allRecordsServicebeneficie.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemServicebeneficie = it;
					}
				});			
			};
        };
        vm.annulerServicebeneficie = function(item) {
			if (!item.id) {
				vm.allRecordsServicebeneficie.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemServicebeneficie = {} ;
			vm.selectedItemServicebeneficie.$selected = false;
       };
        vm.modifierServicebeneficie = function(item) {
			NouvelItem = false ;
			vm.selectedItemServicebeneficie = item;
			currentItem = angular.copy(vm.selectedItemServicebeneficie);
			$scope.vm.allRecordsServicebeneficie.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemServicebeneficie.description = vm.selectedItemServicebeneficie.description;
			vm.selectedItemServicebeneficie.$edit = true;	
        };
        vm.supprimerServicebeneficie = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemServicebeneficie,1);
			}, function() {
			});
        }
		// Service beneficie    
		// Infrastructure
        vm.selectionInfrastructure= function (item) {     
            vm.selectedItemInfrastructure = item;
        };
        $scope.$watch('vm.selectedItemInfrastructure', function() {
			if (!vm.allRecordsInfrastructure) return;
			vm.allRecordsInfrastructure.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemInfrastructure.$selected = true;
        });
        vm.ajouterInfrastructure = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemInfrastructure.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsInfrastructure.push(items);
				vm.allRecordsInfrastructure.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemInfrastructure = it;
					}
				});			
			};
        };
        vm.annulerInfrastructure = function(item) {
			if (!item.id) {
				vm.allRecordsInfrastructure.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemInfrastructure = {} ;
			vm.selectedItemInfrastructure.$selected = false;
       };
        vm.modifierInfrastructure = function(item) {
			NouvelItem = false ;
			vm.selectedItemInfrastructure = item;
			currentItem = angular.copy(vm.selectedItemInfrastructure);
			$scope.vm.allRecordsInfrastructure.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemInfrastructure.description = vm.selectedItemInfrastructure.description;
			vm.selectedItemInfrastructure.$edit = true;	
        };
        vm.supprimerInfrastructure = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemInfrastructure,1);
			}, function() {
			});
        }
		// Infrastructure    
		// Source obtention aliment
        vm.selectionSourceobtentionaliment= function (item) {     
            vm.selectedItemSourceobtentionaliment = item;
        };
        $scope.$watch('vm.selectedItemSourceobtentionaliment', function() {
			if (!vm.allRecordsSourceobtentionaliment) return;
			vm.allRecordsSourceobtentionaliment.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemSourceobtentionaliment.$selected = true;
        });
        vm.ajouterSourceobtentionaliment = function () {
			if(NouvelItem == true) {
				vm.showAlert("ERREUR LORS DE L'INSERTION","Veuillez annuler ou sauvegarder la dernière insertion que vous avez fait.Merci !");
			} else {	
				vm.selectedItemSourceobtentionaliment.$selected = false;
				NouvelItem = true ;
				var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
					code: '',
					description: '',
				};
				vm.allRecordsSourceobtentionaliment.push(items);
				vm.allRecordsSourceobtentionaliment.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedSourceobtentionaliment = it;
					}
				});			
			};
        };
        vm.annulerSourceobtentionaliment = function(item) {
			if (!item.id) {
				vm.allRecordsSourceobtentionaliment.pop();
				NouvelItem = false;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemSourceobtentionaliment = {} ;
			vm.selectedItemSourceobtentionaliment.$selected = false;
       };
        vm.modifierSourceobtentionaliment = function(item) {
			NouvelItem = false ;
			vm.selectedItemSourceobtentionaliment = item;
			currentItem = angular.copy(vm.selectedItemSourceobtentionaliment);
			$scope.vm.allRecordsSourceobtentionaliment.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemSourceobtentionaliment.description = vm.selectedItemSourceobtentionaliment.description;
			vm.selectedItemSourceobtentionaliment.$edit = true;	
        };
        vm.supprimerSourceobtentionaliment = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemSourceobtentionaliment,1);
			}, function() {
			});
        }
		// Source obtention aliment    
        function test_existence (item,suppression) {    
			if(item.description.length > 0) {
				var doublon = 0;
				if (suppression!=1) {
					switch(vm.cas) {
						case 1:  {
							vm.allRecordsTypelogement.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 2:  {
							vm.allRecordsOccupationlogement.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 3:  {
							vm.allRecordsRevetementtoit.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 4:  { 
							vm.allRecordsRevetementsol.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 5:  {
							vm.allRecordsRevetementmur.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 6:  {
							vm.allRecordsSourceeclairage.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 7:  {
							vm.allRecordsCombustible.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 8:  {
							vm.allRecordsToilette.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 9:  {
							vm.allRecordsSourceeau.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 10:  {
							vm.allRecordsBienequipement.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 11:  {
							vm.allRecordsMoyenproduction.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 12:  {
							vm.allRecordsSourcerevenu.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 13:  {
							vm.allRecordsElevage.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 14:  {
							vm.allRecordsCulture.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 15:  {
							vm.allRecordsAliment.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 16:  {
							vm.allRecordsStrategiealimentaire.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 17:  {
							vm.allRecordsProblememenage.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 18:  {
							vm.allRecordsStrategierevenu.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 19:  {
							vm.allRecordsActiviterecoursmenage.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 20:  {
							vm.allRecordsServicebeneficie.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 21:  {
							vm.allRecordsInfrastructure.forEach(function(dispo) {   
								if((dispo.description==item.description) && dispo.id!=item.id) {
									doublon=1;	
								} 
							});
							break;
						}
						case 22:  {
							vm.allRecordsSourceobtentionaliment.forEach(function(dispo) {   
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

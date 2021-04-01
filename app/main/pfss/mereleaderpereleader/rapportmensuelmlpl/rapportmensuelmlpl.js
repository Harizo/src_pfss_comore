(function ()
{
    'use strict';

    angular
        .module('app.pfss.mereleaderpereleader.rapportmensuelmlpl')
        .controller('RapportmensuelmlplController', RapportmensuelmlplController);
    /** @ngInject */
    function RapportmensuelmlplController($mdDialog, $scope, apiFactory, $state,$cookieStore)  {
		var vm = this;
	   vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        responsive: true
      };

      vm.rapport_mensuel_column = [{titre:"Date rapport"},{titre:"Groupe ML/PL"},{titre:"ML/PL"},{titre:"Réprésentant CPS"}];
      vm.rapport_detail_column = [{titre:"Description"},{titre:"Ménage visité"}];
      //initialisation variable
		vm.currentItem = {};
		vm.currentItemRapportdetail = {};
        vm.affiche_load = false ;
        vm.selectedItem = {} ;
        vm.selectedItem_rapport_detail_mlpl = {} ;
 		
		vm.all_menages =[];
		vm.all_groupe_mlpl =[];
		vm.all_liste_mlpl =[];
        vm.all_rapport_mensuelmlpl = [] ;
        vm.all_rapport_detail_mlpl = [] ;
		vm.allRecordsResolutionprobleme =[];
		vm.allRecordsProblemerencontre = [];
		vm.allRecordsProjetdugroupe = [];
		vm.allRecordsThemesensibilisation = [];
		vm.allRecordsResolutionmlpl = [];
		vm.allRecordsResolutionvisitedomicile = [];
       vm.nouvelle_element = false ;
        vm.affichage_masque = false ;
        vm.date_now = new Date() ;

        vm.disable_button = false ;
		vm.tab_reponse_theme_sensibilisation = [] ;
		vm.tab_reponse_projet_de_groupe = [] ;
		vm.tab_reponse_probleme_rencontres = [] ;
		vm.tab_reponse_solution_prise = [] ;
      //initialisation variable

      //chargement clé etrangère et données de bases
        vm.id_user_cookies = $cookieStore.get('id');
		apiFactory.getOne("utilisateurs/index",vm.id_user_cookies).then(function(result) { 
			vm.user = result.data.response;
			apiFactory.getAll("region/index").then(function(result) { 
				vm.all_region = result.data.response;    
			});
		});
		// DDB ML/PL
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
							});    
						});    
					});    
				});    
			});    
		});    
		
         apiFactory.getAll("ile/index").then(function(result)
        { 
          vm.all_ile = result.data.response;    
          
        });
		// utilitaire

      	// utilitaire
     vm.filtre_region = function()
      {
        apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",vm.filtre.id_ile).then(function(result)
        { 
          vm.all_region = result.data.response;   
          vm.filtre.id_region = null ; 
          vm.filtre.id_commune = null ; 
          vm.filtre.village_id = null ; 
          
        });

      }
      vm.filtre_commune = function()
      {
        apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtre.id_region).then(function(result)
        { 
          vm.all_commune = result.data.response; 
          vm.filtre.id_commune = null ; 
          vm.filtre.village_id = null ;           
        });
      }
      vm.filtre_village = function()
      {
        apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",vm.filtre.id_commune).then(function(result)
        { 
          vm.all_village = result.data.response;    
          vm.filtre.village_id = null ; 
          
          
        });
      }
      vm.filtre_groupe_mlpl = function()
      {
        apiFactory.getAPIgeneraliserREST("groupe_mlpl/index","cle_etrangere",vm.filtre.village_id).then(function(result)
        { 
			vm.all_groupe_mlpl = result.data.response;    
        });
      }
		vm.filtrer = function()	{
			vm.all_rapport_mensuelmlpl = [];
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("menage/index","cle_etrangere",vm.filtre.village_id,"statut","BENEFICIAIRE").then(function(result) { 				
				vm.all_menages = result.data.response;    
				apiFactory.getAPIgeneraliserREST("rapport_mensuel_mlpl/index","cle_etrangere",vm.filtre.id_groupe_ml_pl).then(function(result) { 				
					vm.all_rapport_mensuelmlpl = result.data.response;    
					vm.affiche_load = false ;
				});
			});
		}
		vm.modifier_groupe_mlpl=function() {
			vm.all_liste_mlpl = [];
			vm.affiche_load = true ;
			vm.all_groupe_mlpl.forEach(function(mng) {
				if(parseInt(mng.id)==parseInt(vm.filtre.menage_id)) {
					// Affectation direct et non pas par paramètre : DANGEREUX
					vm.filtre.id_groupe_ml_pl = mng.id; 
					vm.filtre.nom_groupe=mng.nom_groupe;
					vm.nontrouvee=false;
				}
			});			
			apiFactory.getAPIgeneraliserREST("liste_mlpl/index","cle_etrangere",vm.filtre.id_groupe_ml_pl).then(function(result) { 				
				vm.all_liste_mlpl = result.data.response; 				
				vm.affiche_load = false ;
			});
		}
		vm.charger_membre_mlpl=function() {
			vm.all_liste_mlpl = [];
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("liste_mlpl/index","cle_etrangere",vm.filtre.id_groupe_ml_pl).then(function(result) { 				
				vm.all_liste_mlpl = result.data.response;    
				vm.affiche_load = false ;
			});
		}
		vm.modifier_membre_mlpl=function() {
			vm.all_liste_mlpl.forEach(function(mng) {
				if(parseInt(mng.menage_id)==parseInt(vm.filtre.menage_id)) {
					// Affectation direct et non pas par paramètre : DANGEREUX
					vm.filtre.menage_id = mng.menage_id; 
					vm.filtre.NumeroEnregistrement=mng.NumeroEnregistrement;
					vm.filtre.nomchefmenage=mng.nomchefmenage;
					vm.filtre.nom_conjoint=mng.nom_conjoint;
					vm.filtre.Addresse=mng.Addresse;
					vm.filtre.nombre_enfant_non_scolarise=mng.nombre_enfant_non_scolarise;
					vm.filtre.nombre_enfant_moins_six_ans=mng.nombre_enfant_moins_six_ans;
					vm.filtre.nombre_enfant_scolarise=mng.nombre_enfant_scolarise;
					vm.nontrouvee=false;
				}
			});			
		}	
		//CHECK BOK MULTISELECT VARIABLE
        vm.toggle = function (item, list) {
          var idx = list.indexOf(item);
          if (idx > -1) list.splice(idx, 1);
          else list.push(item);    
        };
        $scope.exists = function (item, list) {
          if (list) {
            return list.indexOf(item) > -1;
          }         
        };
		//FIN CHECK BOK MULTISELECT VARIABLE
		
		// Début Fonction Groupe ML/PL	
		vm.save_rapport_mensuel_mlpl = function(groupe_mlpl,suppression) {
			vm.disable_button = true ;
			var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };
			var id_mng = 0 ;
			if (!vm.nouvelle_element) {
				var id_mng = vm.selectedItem.id ;
			}       
			var datas = $.param(
                    {    
                      supprimer:suppression,
                      id: id_mng ,
                      id_groupe_ml_pl: groupe_mlpl.id_groupe_ml_pl,
                      date_rapport: formatDateBDD(groupe_mlpl.date_rapport),
                      menage_id: groupe_mlpl.menage_id,
                      representant_cps: groupe_mlpl.representant_cps,
                    });
			apiFactory.add("rapport_mensuel_mlpl/index",datas, config).success(function (data) {
				vm.affichage_masque = false ;
				vm.disable_button = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
				if (vm.nouvelle_element) {
					var mng={
						id : data.response ,
						id_groupe_ml_pl: groupe_mlpl.id_groupe_ml_pl,
						date_rapport: vm.formatDateListe(groupe_mlpl.date_rapport),
						menage_id: groupe_mlpl.menage_id,
						representant_cps: groupe_mlpl.representant_cps,
						nom_groupe: groupe_mlpl.nom_groupe,
						NumeroEnregistrement: groupe_mlpl.NumeroEnregistrement,
						nomchefmenage: groupe_mlpl.nomchefmenage,
						nom_conjoint: groupe_mlpl.nom_conjoint,
						Addresse: groupe_mlpl.Addresse,
						nombre_enfant_non_scolarise: groupe_mlpl.nombre_enfant_non_scolarise,
						nombre_enfant_moins_six_ans: groupe_mlpl.nombre_enfant_moins_six_ans,
						nombre_enfant_scolarise: groupe_mlpl.nombre_enfant_scolarise,
					}
					vm.all_rapport_mensuelmlpl.push(mng) ;
				} else {
					if(parseInt(suppression)==1) {
						vm.all_rapport_mensuelmlpl = vm.all_rapport_mensuelmlpl.filter(function(obj) {
							return obj.id !== vm.selectedItem.id;
						});
						vm.selectedItem={};						
					} else {
						vm.affichage_masque_liste_mlpl = false ;
						vm.selectedItem.date_rapport =  vm.filtre.date_rapport ;
						vm.selectedItem.id_groupe_ml_pl = vm.filtre.id_groupe_ml_pl  ;
						vm.selectedItem.menage_id = vm.filtre.menage_id  ;
						vm.selectedItem.representant_cps = vm.filtre.representant_cps  ;
						vm.selectedItem.nom_groupe = vm.filtre.nom_groupe  ;
						vm.selectedItem.NumeroEnregistrement = vm.filtre.NumeroEnregistrement  ;
						vm.selectedItem.nomchefmenage = vm.filtre.nomchefmenage  ;
						vm.selectedItem.nom_conjoint = vm.filtre.nom_conjoint  ;
						vm.selectedItem.Addresse = vm.filtre.Addresse  ;
						vm.selectedItem.nombre_enfant_non_scolarise = vm.filtre.nombre_enfant_non_scolarise  ;
						vm.selectedItem.nombre_enfant_moins_six_ans = vm.filtre.nombre_enfant_moins_six_ans  ;
						vm.selectedItem.nombre_enfant_scolarise = vm.filtre.nombre_enfant_scolarise  ;
						vm.selectedItem={};
					}	
  				}      
			}).error(function (data) {
				vm.disable_button = false ;
				console.log('erreur '+data);
				vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
			}); 
		}
		vm.selection= function (item)  {
			if ((!vm.affiche_load)&&(!vm.affichage_masque))  {
				vm.selectedItem = item;
				vm.charger_detail_questionnaires();
			}       
		}
		$scope.$watch('vm.selectedItem', function() {
			if (!vm.all_rapport_mensuelmlpl) return;
			vm.all_rapport_mensuelmlpl.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
		})
		vm.ajouter_rapport_mensuel_mlpl = function() {
			vm.nouvelle_element = true ;
			vm.affichage_masque = true ;
			vm.selectedItem = {} ;
			vm.filtre.date_rapport = new Date();
			vm.filtre.menage_id = "" ;
			vm.filtre.representant_cps = "" ;
			vm.filtre.nom_groupe = vm.filtre.nom_groupe ;
		}
		vm.modifier = function()  {
			vm.nouvelle_element = false ;
			vm.essai={};
			vm.filtre.date_rapport = new Date(vm.selectedItem.date_rapport);
			vm.filtre.id_groupe_ml_pl = vm.selectedItem.id_groupe_ml_pl ;
			vm.filtre.menage_id = vm.selectedItem.menage_id ;
			vm.filtre.representant_cps = vm.selectedItem.representant_cps ;
			vm.filtre.nom_groupe = vm.selectedItem.nom_groupe ;
			vm.filtre.NumeroEnregistrement = vm.selectedItem.NumeroEnregistrement ;
			vm.filtre.nomchefmenage = vm.selectedItem.nomchefmenage ;
			vm.filtre.nom_conjoint = vm.selectedItem.nom_conjoint ;
			vm.filtre.Addresse = vm.selectedItem.Addresse ;
			vm.filtre.nombre_enfant_non_scolarise = vm.selectedItem.nombre_enfant_non_scolarise ;
			vm.filtre.nombre_enfant_moins_six_ans = vm.selectedItem.nombre_enfant_moins_six_ans ;
			vm.filtre.nombre_enfant_scolarise = vm.selectedItem.nombre_enfant_scolarise ;
			vm.affichage_masque = true ;
		}
		vm.annuler = function () {
			vm.nouvelle_element = false ;
			vm.affichage_masque = false ;
			vm.selectedItem={};
		}
		vm.supprimer_rapport_mensuel_mlpl = function() {
			vm.nouvelle_element = false ;
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('ok')
                .cancel('annuler');

			$mdDialog.show(confirm).then(function() {           
				vm.save_rapport_mensuel_mlpl(vm.selectedItem,1);
			}, function() {
            //alert('rien');
			});
        };	  
		// Fin Fonction Groupe ML/PL
		vm.charger_detail_questionnaires= function() {
				vm.affiche_load=true;
				vm.id_rapport=null;
				if(vm.nouvelle_element) {
					vm.id_rapport=99999999; // Impossible : en paramètre seulement pour executer les 6 requetes
				} else {
					vm.id_rapport=vm.selectedItem.id;
				}
				vm.tab_reponse_theme_sensibilisation = [] ;
				vm.tab_reponse_projet_de_groupe = [] ;
				vm.tab_reponse_probleme_rencontres = [] ;
				vm.tab_reponse_solution_prise = [] ;
				apiFactory.getAPIgeneraliserREST("ddb_mlpl/index","nom_table","resolution_visite_domicile","nom_table_rapport","rapport_resolution_visite_domicile","nom_cle_etrangere","id_resolution_visite_domicile","id_rapport",vm.id_rapport).then(function(result){
					vm.allRecordsResolutionvisitedomicile = [];
					vm.temporaire = result.data.response;					
					if(vm.temporaire.length >0) {
						angular.forEach(vm.temporaire, function(value, key)  { 
							if(parseInt(value.menage_sensibilise) >0) {
								value.menage_sensibilise=parseInt(value.menage_sensibilise);
							}	
						});
					}
					vm.allRecordsResolutionvisitedomicile = vm.temporaire;	
					apiFactory.getAPIgeneraliserREST("ddb_mlpl/index","nom_table","probleme_rencontres","nom_table_rapport","rapport_probleme_rencontres","nom_cle_etrangere","id_probleme_rencontres","id_rapport",vm.id_rapport).then(function(result){
						vm.allRecordsProblemerencontre =[];
						vm.allRecordsProblemerencontre = result.data.response.liste_choix;
						vm.tab_reponse_probleme_rencontres = result.data.response.tab_reponse;
						apiFactory.getAPIgeneraliserREST("ddb_mlpl/index","nom_table","projet_groupe","nom_table_rapport","rapport_projet_groupe","nom_cle_etrangere","id_projet_groupe","id_rapport",vm.id_rapport).then(function(result){
							vm.allRecordsProjetdugroupe =[];
							vm.allRecordsProjetdugroupe = result.data.response.liste_choix;
							vm.tab_reponse_projet_de_groupe= result.data.response.tab_reponse;
							apiFactory.getAPIgeneraliserREST("ddb_mlpl/index","nom_table","theme_sensibilisation","nom_table_rapport","rapport_theme_sensibilisation","nom_cle_etrangere","id_theme_sensibilisation","id_rapport",vm.id_rapport).then(function(result){
								vm.allRecordsThemesensibilisation = [];
								vm.allRecordsThemesensibilisation = result.data.response.liste_choix;
								vm.tab_reponse_theme_sensibilisation= result.data.response.tab_reponse;
								apiFactory.getAPIgeneraliserREST("ddb_mlpl/index","nom_table","resolution_ml_pl","nom_table_rapport","rapport_resolution_ml_pl","nom_cle_etrangere","id_resolution_ml_pl","id_rapport",vm.id_rapport).then(function(result){
									vm.allRecordsResolutionmlpl = [];
									vm.allRecordsResolutionmlpl = result.data.response.liste_choix;
									vm.tab_reponse_solution_prise= result.data.response.tab_reponse;
									apiFactory.getAPIgeneraliserREST("ddb_mlpl/index","nom_table","raison_visite_domicile","nom_table_rapport","rapport_raison_visite_domicile","nom_cle_etrangere","id_raison_visite_domicile","id_rapport",vm.id_rapport).then(function(result){
										vm.allRecordsRaisonvisitedomicile =[]; 
										vm.temporaire = result.data.response;
										if(vm.temporaire.length >0) {
											angular.forEach(vm.temporaire, function(value, key)  { 
												if(parseInt(value.menage_sensibilise) >0) {
													value.menage_sensibilise=parseInt(value.menage_sensibilise);
												}	
											});												
										}
										vm.allRecordsRaisonvisitedomicile =vm.temporaire; 
										vm.affiche_load=false;
									});    
								});    
							});    
						});    
					});    
				});    
		}	
		vm.save_reponse_visite_domicile = function() {
			vm.disable_button = true ;
			var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
							}
						};
			// Regrouper les <> valeurs dans txtTmp pour pouvoir poster les valeurs en tableau
			// utilise la fonction eval pour transformer le texte afin d'être posté	
			var txtTmp="";
			txtTmp += "supprimer" +":\"" + 0 + "\",";	
			txtTmp += "id_rapport" +":\"" + vm.selectedItem.id + "\",";	
			txtTmp += "mise_a_jour_rapport" +":\"" + 1 + "\",";	
			txtTmp += "nombre_detail_raison_visite_domicile" +":\"" + vm.allRecordsRaisonvisitedomicile.length + "\",";	
			txtTmp += "nombre_detail_resolution_visite_domicile" +":\"" + vm.allRecordsResolutionvisitedomicile.length + "\",";	
			txtTmp += "nombre_detail_theme_sensibilisation" +":\"" + vm.allRecordsThemesensibilisation.length + "\",";	
			txtTmp += "nombre_detail_projet_de_groupe" +":\"" + vm.allRecordsProjetdugroupe.length + "\",";	
			txtTmp += "nombre_detail_probleme_rencontre" +":\"" + vm.allRecordsProblemerencontre.length + "\",";	
			txtTmp += "nombre_detail_resolution_mlpl" +":\"" + vm.allRecordsResolutionmlpl.length + "\",";	
			var iteration=1;
			angular.forEach(vm.allRecordsRaisonvisitedomicile, function(value, key)  { 
				txtTmp += "id_1_" + iteration +":\"" + value.id + "\",";	
				txtTmp += "id_rapport_1_" + iteration +":\"" + value.id_rapport + "\",";	
				txtTmp += "id_raison_visite_domicile_1_" + iteration +":\"" + value.id_raison_visite_domicile + "\",";	
				txtTmp += "id_table_fille_1_" + iteration +":\"" + value.id_table_fille + "\",";	
				txtTmp += "menage_sensibilise_1_" + iteration +":\"" + value.menage_sensibilise + "\",";	
				iteration=iteration + 1;	
			});	
			var iteration=1;
			angular.forEach(vm.allRecordsResolutionvisitedomicile, function(value, key)  { 
				txtTmp += "id_2_" + iteration +":\"" + value.id + "\",";	
				txtTmp += "id_rapport_2_" + iteration +":\"" + value.id_rapport + "\",";	
				txtTmp += "id_resolution_visite_domicile_2_" + iteration +":\"" + value.id_resolution_visite_domicile + "\",";	
				txtTmp += "id_table_fille_2_" + iteration +":\"" + value.id_table_fille + "\",";	
				txtTmp += "menage_sensibilise_2_" + iteration +":\"" + value.menage_sensibilise + "\",";	
				iteration=iteration + 1;	
			});	
			var iteration=1;
			angular.forEach(vm.allRecordsThemesensibilisation, function(value, key)  { 
				txtTmp += "id_3_" + iteration +":\"" + value.id + "\",";	
				txtTmp += "id_rapport_3_" + iteration +":\"" + value.id_rapport + "\",";	
				txtTmp += "id_theme_sensibilisation_3_" + iteration +":\"" + value.id_theme_sensibilisation + "\",";	
				txtTmp += "id_table_fille_3_" + iteration +":\"" + value.id_table_fille + "\",";	
				txtTmp += "menage_sensibilise_3_" + iteration +":\"" + value.menage_sensibilise + "\",";	
				iteration=iteration + 1;	
			});	
			var iteration=1;
			angular.forEach(vm.allRecordsProjetdugroupe, function(value, key)  { 
				txtTmp += "id_4_" + iteration +":\"" + value.id + "\",";	
				txtTmp += "id_rapport_4_" + iteration +":\"" + value.id_rapport + "\",";	
				txtTmp += "id_projet_groupe_4_" + iteration +":\"" + value.id_projet_groupe + "\",";	
				txtTmp += "id_table_fille_4_" + iteration +":\"" + value.id_table_fille + "\",";	
				txtTmp += "menage_sensibilise_4_" + iteration +":\"" + value.menage_sensibilise + "\",";	
				iteration=iteration + 1;	
			});	
			var iteration=1;
			angular.forEach(vm.allRecordsProblemerencontre, function(value, key)  { 
				txtTmp += "id_5_" + iteration +":\"" + value.id + "\",";	
				txtTmp += "id_rapport_5_" + iteration +":\"" + value.id_rapport + "\",";	
				txtTmp += "id_probleme_rencontres_5_" + iteration +":\"" + value.id_probleme_rencontres + "\",";	
				txtTmp += "id_table_fille_5_" + iteration +":\"" + value.id_table_fille + "\",";	
				txtTmp += "menage_sensibilise_5_" + iteration +":\"" + value.menage_sensibilise + "\",";	
				iteration=iteration + 1;	
			});	
			var iteration=1;
			angular.forEach(vm.allRecordsResolutionmlpl, function(value, key)  { 
				txtTmp += "id_6_" + iteration +":\"" + value.id + "\",";	
				txtTmp += "id_rapport_6_" + iteration +":\"" + value.id_rapport + "\",";	
				txtTmp += "id_resolution_ml_pl_6_" + iteration +":\"" + value.id_resolution_ml_pl + "\",";	
				txtTmp += "id_table_fille_6_" + iteration +":\"" + value.id_table_fille + "\",";	
				txtTmp += "menage_sensibilise_6_" + iteration +":\"" + value.menage_sensibilise + "\",";	
				iteration=iteration + 1;	
			});	
			for (var i = 0; i < vm.tab_reponse_theme_sensibilisation.length; i++) {
				txtTmp += "id_reponse_3_" + (i + 1) +":\"" + vm.tab_reponse_theme_sensibilisation[i] + "\",";	
			}	
			for (var i = 0; i < vm.tab_reponse_projet_de_groupe.length; i++) {
				txtTmp += "id_reponse_4_" + (i + 1) +":\"" + vm.tab_reponse_projet_de_groupe[i] + "\",";	
			}	
			for (var i = 0; i < vm.tab_reponse_probleme_rencontres.length; i++) {
				txtTmp += "id_reponse_5_" + (i + 1) +":\"" + vm.tab_reponse_probleme_rencontres[i] + "\",";	
			}	
			for (var i = 0; i < vm.tab_reponse_solution_prise.length; i++) {
				txtTmp += "id_reponse_6_" + (i + 1) +":\"" + vm.tab_reponse_solution_prise[i] + "\",";	
			}	
			txtTmp += "nombre_reponse_theme_sensibilisation" +":\"" + vm.tab_reponse_theme_sensibilisation + "\",";	
			txtTmp += "nombre_reponse_projet_de_groupe" +":\"" + vm.tab_reponse_projet_de_groupe.length + "\",";	
			txtTmp += "nombre_reponse_probleme_rencontre" +":\"" + vm.tab_reponse_probleme_rencontres.length + "\",";	
			txtTmp += "nombre_reponse_resolution_mlpl" +":\"" + vm.tab_reponse_solution_prise.length + "\",";	
			txtTmp = txtTmp.replace(new RegExp('\'', 'g'),'\\\'');
			txtTmp = txtTmp.replace(new RegExp('(\r\n|\r|\n)', 'g'),'');
			var donnees = $.param(eval('({' + txtTmp + '})'));
			apiFactory.add("ddb_mlpl/index",donnees, config).success(function (data)  {
				// Sauvegarde les <> id 
				vm.allRecordsRaisonvisitedomicile =[];
				vm.allRecordsResolutionvisitedomicile = [];
				vm.allRecordsThemesensibilisation = [];
				vm.allRecordsProjetdugroupe = [];
				vm.allRecordsProblemerencontre = [];
				vm.allRecordsResolutionmlpl = [];

				vm.tab_reponse_theme_sensibilisation = [] ;
				vm.tab_reponse_projet_de_groupe = [] ;
				vm.tab_reponse_probleme_rencontres = [] ;
				vm.tab_reponse_solution_prise = [] ;
				vm.temporaire1= data.response.rapport_raison_visite_domicile;
				vm.temporaire= data.response.rapport_resolution_visite_domicile;
				vm.allRecordsThemesensibilisation= data.response.rapport_theme_sensibilisation;
				vm.allRecordsProjetdugroupe= data.response.rapport_projet_groupe;
				vm.allRecordsProblemerencontre= data.response.rapport_probleme_rencontres;
				vm.allRecordsResolutionmlpl= data.response.rapport_resolution_ml_pl;
				
				vm.tab_reponse_theme_sensibilisation= data.response.tab_reponse_theme_sensibilisation;
				vm.tab_reponse_projet_de_groupe= data.response.tab_reponse_projet_de_groupe;
				vm.tab_reponse_probleme_rencontres= data.response.tab_reponse_probleme_rencontres;
				vm.tab_reponse_solution_prise= data.response.tab_reponse_solution_prise;
				if(vm.temporaire.length >0) {
					angular.forEach(vm.temporaire, function(value, key)  { 
						if(parseInt(value.menage_sensibilise) >0) {
							value.menage_sensibilise=parseInt(value.menage_sensibilise);
						}	
					});												
				}
				vm.allRecordsResolutionvisitedomicile= vm.temporaire;
				if(vm.temporaire1.length >0) {
					angular.forEach(vm.temporaire1, function(value, key)  { 
						if(parseInt(value.menage_sensibilise) >0) {
							value.menage_sensibilise=parseInt(value.menage_sensibilise);
						}	
					});												
				}
				vm.allRecordsRaisonvisitedomicile=vm.temporaire1;
				angular.element('#tab_rapport').triggerHandler('click');	
				vm.disable_button = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
			}).error(function (data) {
				vm.disable_button = false ;
				console.log('erreur '+data);
				vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
			});         
		}		
		// Début Fonction filtre par découpage admin et detail par groupe ML/PM	
		// Fin Fonction filtre par découpage admin et detail par groupe ML/PM	
		// DEBUT FONCTION UTILITAIRE
		vm.showAlert = function(titre,textcontent) {         
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(false)
            .parent(angular.element(document.body))
            .title(titre)
            .textContent(textcontent)
            .ariaLabel('Information')
            .ok('Fermer')
            .targetEvent()
          );
        } 
		function formatDateBDD(dat) {
			if (dat) {
				var date = new Date(dat);
				var mois = date.getMonth()+1;
				var dates = (date.getFullYear()+"-"+mois+"-"+date.getDate());
				return dates;
			}          
		}
		vm.formatDateListe = function (dat) {
			if (dat) {
				var date = new Date(dat);
				var mois = date.getMonth()+1;
				var dates = (date.getDate()+"-"+mois+"-"+date.getFullYear());
				return dates;
			}          
		}
		vm.affichage_sexe_int = function(sexe_int) {      
			switch (sexe_int) {
				case '1':
					return "Homme" ;
					break;
				case '0':
					return "Femme" ;
					break;
				default:
					return "Non identifier"
					break;
			}
		}
		// FIN FONCTION UTILITAIRE

    }
})();

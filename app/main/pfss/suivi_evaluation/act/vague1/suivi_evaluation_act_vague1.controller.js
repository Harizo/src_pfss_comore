(function ()
{
    'use strict';
    angular
        .module('app.pfss.suivi_evaluation.suivi_evaluation_act.vague1')
        .controller('Suivievaluationactvague1Controller', Suivievaluationactvague1Controller);

    /** @ngInject */
    function Suivievaluationactvague1Controller(apiFactory, $state, $mdDialog, $http, $scope,$location,$cookieStore,apiUrl,apiUrlExcel,apiUrlExcelimport) {
		var vm = this;
	   vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        responsive: true
      };
        vm.dtOptions_new =
        {
            dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple_numbers',
            retrieve:'true',
            order:[] 
        };

      vm.suivi_column = [{titre:"Ile"},{titre:"Prefecture"},{titre:"Commune"},{titre:"Zip"},{titre:"Village"},{titre:"Popula° RGPH 2017"},
	  {titre:"Nb bénéf"},{titre:"Liste préselectionné"},{titre:"Statut"},{titre:"Date réalisa°"},{titre:"Nb présel"},
	  {titre:"Rétard"},{titre:"Cause rétard"},{titre:"Dépot plainte"},{titre:"Statut"},{titre:"Réalisa°"},
	  {titre:"Nb plainte"},{titre:"Date rétard"},{titre:"Cause rétard"},{titre:"Traitement plainte"},
	  {titre:"Statut"},{titre:"Réalisa°"},{titre:"Plainte traité"},{titre:"Date rétard"},{titre:"Cause rétard"},
	  {titre:"AG valida° communaut"},{titre:"Statut"},{titre:"Réalisa°"},{titre:"Nb AG"},{titre:"Date rétard"},
	  {titre:"Cause rétard"},{titre:"Liste off bénéf"},{titre:"Statut"},{titre:"Réalisa°"},
	  {titre:"Bénéf enreg"},{titre:"Mén exclus"},{titre:"Date rétard"},{titre:"Cause rétard"},
	  {titre:"Liste travailleur"},{titre:"Statut"},{titre:"Réalisa°"},{titre:"Mén avec trav"},{titre:"Mén inapte"},
	  {titre:"Mén exclus"},{titre:"Date rétard"},{titre:"Cause rétard"},
	  {titre:"Récrutement AGEX"},{titre:"Statut"},{titre:"Réalisa°"},{titre:"Nb AGEX récruté"},{titre:"Date rétard"},{titre:"Cause rétard"},
	  {titre:"Elaboration MDP"},{titre:"Statut"},{titre:"Réalisa°"},{titre:"Nb MDP élaboré"},{titre:"Date rétard"},{titre:"Cause rétard"},
	  {titre:"Premier paiement"},{titre:"Statut"},{titre:"Réalisa°"},{titre:"Mén payé"},{titre:"Mén exclus"},{titre:"Date rétard"},{titre:"Cause rétard"},
	  {titre:"Deuxième paiement"},{titre:"Statut"},{titre:"Réalisa°"},{titre:"Mén payé"},{titre:"Mén exclus"},{titre:"Date rétard"},{titre:"Cause rétard"}];
	  vm.suivi_column_arse = [{titre:"Troisième paiement"},{titre:"Statut"},{titre:"Réalisa°"},{titre:"Mén payé"},{titre:"Mén exclus"},{titre:"Date rétard"},{titre:"Cause rétard"}];	  
	  
      vm.statut_evaluation = [{titre:"réalisé",statut:"réalisé"},{titre:"en cours",statut:"en cours"},{titre:"suspendu",statut:"suspendu"},{titre:"non réalisé",statut:"non réalisé"}];
      //initialisation variable
		vm.fichier="";
        vm.affiche_load = false ;
        vm.selectedItem = {} ;
        vm.selectedItem_individu = {} ;
		
        vm.reponse_individu = {} ;
        vm.all_suivi = [] ;
        vm.all_beneficiaires = [] ;
        vm.all_fiche_presence = [] ;
        vm.all_sous_projet = [] ;
        vm.all_lienparental = [] ;
		vm.all_etatpresence =[];
        vm.all_annee = [] ;
        vm.all_etape = [] ;
        vm.all_agex = [] ;
        vm.all_agep = [] ;
        vm.all_zip = [] ;
        vm.filtre = {} ;
		vm.id_sous_projet =1;
        vm.nouvelle_element = false ;
        vm.nouvelle_element_individu = false ;
        vm.affichage_masque = false ;
        vm.affichage_masque_individu = false ;
        vm.date_now = new Date() ;
		vm.actualise=false;
        vm.disable_button = false ;
		vm.affichage_masque=false;
 		vm.loc = $location ;
		vm.url=vm.loc.path();
		
		if(vm.url=='/suivi-evaluation/act/vague1') {
			vm.titre_sous_projet =" ACT";
			vm.titre_vague = "Vague 1";
			vm.filtre.vague = 1;
			vm.filtre.id_sous_projet = 1;
			vm.filtre.type_suivi="ACT";
		} 
		if(vm.url=='/suivi-evaluation/act/vague2') {
			vm.titre_sous_projet =" ACT";
			vm.titre_vague = "Vague 2";
			vm.filtre.vague = 2;
			vm.filtre.id_sous_projet = 1;
			vm.filtre.type_suivi="ACT";
		}
		if(vm.url=='/suivi-evaluation/act/vague3') {
			vm.titre_sous_projet =" ACT";
			vm.titre_vague = "Vague 3";
			vm.filtre.vague = 3;
			vm.filtre.id_sous_projet = 1;
			vm.filtre.type_suivi="ACT";
		}
		if(vm.url=='/suivi-evaluation/arse/vague1') {
			vm.titre_sous_projet =" ARSE";
			vm.titre_vague = "Vague 1";
			vm.filtre.vague = 1;
			vm.filtre.id_sous_projet = 2;
			vm.filtre.type_suivi="ARSE";
		} 
		if(vm.url=='/suivi-evaluation/arse/vague2') {
			vm.titre_sous_projet =" ARSE";
			vm.titre_vague = "Vague 2";
			vm.filtre.vague = 2;
			vm.filtre.id_sous_projet = 2;
			vm.filtre.type_suivi="ARSE";
		}
		if(vm.url=='/suivi-evaluation/arse/vague3') {
			vm.titre_sous_projet =" ARSE";
			vm.titre_vague = "Vague 3";
			vm.filtre.vague = 3;
			vm.filtre.id_sous_projet = 2;
			vm.filtre.type_suivi="ARSE";
		}
		if(vm.url=='/suivi-evaluation/covid-19/vague1') {
			vm.titre_sous_projet =" COVID-19";
			vm.titre_vague = "Vague 1";
			vm.filtre.vague = 1;
			vm.filtre.id_sous_projet = 4;
			vm.filtre.type_suivi="COVID";
		} 
		if(vm.url=='/suivi-evaluation/covid-19/vague2') {
			vm.titre_sous_projet =" COVID-19";
			vm.titre_vague = "Vague 2";
			vm.filtre.vague = 2;
			vm.filtre.id_sous_projet = 4;
			vm.filtre.type_suivi="COVID";
		}
		if(vm.url=='/suivi-evaluation/covid-19/vague3') {
			vm.titre_sous_projet =" COVID-19";
			vm.titre_vague = "Vague 3";
			vm.filtre.vague = 3;
			vm.filtre.id_sous_projet = 4;
			vm.filtre.type_suivi="COVID";
		}
        vm.id_user_cookies = $cookieStore.get('id');
		apiFactory.getOne("utilisateurs/index",vm.id_user_cookies).then(function(result) { 
			vm.user = result.data.response;
			apiFactory.getAll("sous_projet/index").then(function(result) { 
				vm.all_sous_projet = result.data.response;    
			});
			apiFactory.getAll("annee/index").then(function(result) { 
				vm.all_annee = result.data.response;    
			});
			apiFactory.getAll("agent_ex/index").then(function(result) { 
				vm.all_agex= result.data.response;    
			});
			apiFactory.getAll("agence_p/index").then(function(result) { 
				vm.all_agep= result.data.response; 
			});
			apiFactory.getAll("zip/index").then(function(result) { 
				vm.all_zip= result.data.response; 
			});
			apiFactory.getAPIgeneraliserREST("phaseexecution/index","cle_etrangere",vm.id_sous_projet).then(function(result) {
				vm.all_etape = result.data.response;    
			});
	  
		});
         apiFactory.getAll("ile/index").then(function(result)
        { 
          vm.all_ile = result.data.response;    
          vm.all_ile_detail = result.data.response;    
          
        });
     vm.filtre_region = function()
      {
        apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",vm.filtre.id_ile).then(function(result)
        { 
          vm.all_region = result.data.response;   
          vm.filtre.id_region = null ; 
          vm.filtre.id_commune = null ; 
          vm.filtre.village_id = null ; 
		  vm.actualise=false;
          
        });

      }

      vm.filtre_commune = function()
      {
        apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtre.id_region).then(function(result)
        { 
          vm.all_commune = result.data.response; 
          vm.filtre.id_commune = null ; 
          vm.filtre.village_id = null ; 
		  vm.actualise=false;
          
        });
      }
      vm.filtre_village = function()
      {
        apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",vm.filtre.id_commune).then(function(result)
        { 
          vm.all_village = result.data.response;    
          vm.filtre.village_id = null ;
			vm.actualise=false;
          
          
        });
      }
		vm.filtrer = function()	{
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("suivi_evaluation/index","id_sous_projet",vm.filtre.id_sous_projet,"vague",vm.filtre.vague).then(function(result) { 
				if(result.data.response.length==0) {
					$mdDialog.show(
						$mdDialog.alert()
						.parent(angular.element(document.querySelector('#popupContainer')))
						.clickOutsideToClose(false)
						.parent(angular.element(document.body))
						.title("INFORMATION")
						.textContent("Aucun enregistrement pour le filtre choisi !.")
						.ariaLabel('Information')
						.ok('Fermer')
						.targetEvent()					
					);
				}
					vm.actualise=true;
					vm.all_suivi = result.data.response; 
					console.log(vm.all_suivi);	
					vm.affiche_load = false ;
			});
		}
		// FIN POUR IMPORT ETAT	
		vm.export_excel = function() {
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("requete_export/index",
                                                "id_ile",vm.filtre.id_ile,
                                                "id_region",vm.filtre.id_region,                                               
                                                "id_commune",vm.filtre.id_commune,
                                                "village_id",vm.filtre.village_id,
                                                "id_sous_projet",vm.filtre.id_sous_projet,
                                                "agex_id",vm.filtre.agex_id,
                                                "id_annee",vm.filtre.id_annee,
                                                "etape_id",vm.filtre.etape_id,
                                                "fiche_presence",1,
                                                "export",1
                                                ).then(function(result) {               
					vm.status =  result.data.status ;
					if(vm.status)  {
						var ile =	result.data.ile;
						var region =result.data.region;
						var commune =result.data.commune;
						var village =result.data.village;
						var nom_ile =result.data.nom_ile;
						var microprojet =result.data.microprojet;
						var nom_agex =result.data.nom_agex;
						var date_edition=result.data.date_edition;
						var chemin=result.data.chemin;
						var name_file1=result.data.name_file1;
						var name_file2=result.data.name_file2;
						// Ménage Apte
						window.location = apiUrlExcel + chemin + name_file1;  
						window.location = apiUrlExcelimport + chemin + name_file2;  
						// Ménage INAPTE
						if(result.data.fichier3=="OK") {
							var name_file3=result.data.name_file3;
							window.location = apiUrlExcel + chemin + name_file3; 
						}
						if(result.data.fichier4=="OK") {
							var name_file4=result.data.name_file4;
							window.location = apiUrlExcelimport + chemin + name_file4;  
						}
						vm.affiche_load =false; 
					} else {
						vm.affiche_load =false;
						var message=result.data.message;
						vm.showAlert('Export en excel',message);
					}                      
			});
		}
		vm.selection= function (item)  {
			vm.selectedItem = item;
		}
		$scope.$watch('vm.selectedItem', function() {
			if (!vm.all_suivi) return;
			vm.all_suivi.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
		})
		vm.modifier = function()  {
			vm.affiche_load=true; 
			vm.filtre.population_rgph_2017 = parseInt(vm.selectedItem.population_rgph_2017);
			vm.filtre.menage_beneficiaire = parseInt(vm.selectedItem.menage_beneficiaire);
			if(vm.selectedItem.debut_affichage_menage_preselectionne)
			vm.filtre.debut_affichage_menage_preselectionne = new Date(vm.selectedItem.debut_affichage_menage_preselectionne);
			if(vm.selectedItem.fin_affichage_menage_preselectionne)
			vm.filtre.fin_affichage_menage_preselectionne = new Date(vm.selectedItem.fin_affichage_menage_preselectionne);
			vm.filtre.statut_affichage_menage_preselectionne = vm.selectedItem.statut_affichage_menage_preselectionne;
			if(vm.selectedItem.date_realistaion_affichage_menage_preselectionne)
			vm.filtre.date_realistaion_affichage_menage_preselectionne = new Date(vm.selectedItem.date_realistaion_affichage_menage_preselectionne);
			vm.filtre.menage_preselectionne = parseInt(vm.selectedItem.menage_preselectionne);
			if(vm.selectedItem.date_retard_affichage_menage_preselectionne)
			vm.filtre.date_retard_affichage_menage_preselectionne = new Date(vm.selectedItem.date_retard_affichage_menage_preselectionne);
			vm.filtre.cause_retard_affichage_menage_preselectionne = vm.selectedItem.cause_retard_affichage_menage_preselectionne;
			vm.filtre.date_debut_depot_plainte = vm.selectedItem.date_debut_depot_plainte;
			vm.filtre.date_fin_depot_plainte = vm.selectedItem.date_fin_depot_plainte;
			vm.filtre.statut_reception_enregitrement_plainte = vm.selectedItem.statut_reception_enregitrement_plainte;
			if(vm.selectedItem.date_realisation_enregitrement_plainte)
			vm.filtre.date_realisation_enregitrement_plainte = new Date(vm.selectedItem.date_realisation_enregitrement_plainte);
			vm.filtre.nombre_plainte = parseInt(vm.selectedItem.nombre_plainte);
			if(vm.selectedItem.date_retard_enregitrement_plainte)
			vm.filtre.date_retard_enregitrement_plainte = new Date(vm.selectedItem.date_retard_enregitrement_plainte);
			vm.filtre.cause_retard_enregitrement_plainte = vm.selectedItem.cause_retard_enregitrement_plainte;
			vm.filtre.date_debut_traitement_plainte = (vm.selectedItem.date_debut_traitement_plainte);
			vm.filtre.date_fin_traitement_plainte = (vm.selectedItem.date_fin_traitement_plainte);
			vm.filtre.statut_traitement_plainte = vm.selectedItem.statut_traitement_plainte;
			if(vm.selectedItem.date_realisation_traitement_plainte)
			vm.filtre.date_realisation_traitement_plainte = new Date(vm.selectedItem.date_realisation_traitement_plainte);
			vm.filtre.nombre_plainte_traite = parseInt(vm.selectedItem.nombre_plainte_traite);
			if(vm.selectedItem.date_retard_traitement_plainte)
			vm.filtre.date_retard_traitement_plainte = new Date(vm.selectedItem.date_retard_traitement_plainte);
			vm.filtre.cause_retard_traitement_plainte = vm.selectedItem.cause_retard_traitement_plainte;
			vm.filtre.debut_ag_validation_communautaire = vm.selectedItem.debut_ag_validation_communautaire;
			vm.filtre.fin_ag_validation_communautaire = vm.selectedItem.fin_ag_validation_communautaire;
			vm.filtre.statut_validation_ag_communautaire = vm.selectedItem.statut_validation_ag_communautaire;
			if(vm.selectedItem.date_realisation_validation_ag_communautaire)
			vm.filtre.date_realisation_validation_ag_communautaire = new Date(vm.selectedItem.date_realisation_validation_ag_communautaire);
			vm.filtre.nombre_ag_tenue = parseInt(vm.selectedItem.nombre_ag_tenue);
			if(vm.selectedItem.date_retard_validation_ag_communautaire)
			vm.filtre.date_retard_validation_ag_communautaire = new Date(vm.selectedItem.date_retard_validation_ag_communautaire);
			vm.filtre.cause_retard_validation_ag_communautaire = vm.selectedItem.cause_retard_validation_ag_communautaire;
			if(vm.selectedItem.date_debut_liste_officielle_beneficiaire)
			vm.filtre.date_debut_liste_officielle_beneficiaire = new Date(vm.selectedItem.date_debut_liste_officielle_beneficiaire);
			if(vm.selectedItem.date_fin_liste_officielle_beneficiaire)
			vm.filtre.date_fin_liste_officielle_beneficiaire = new Date(vm.selectedItem.date_fin_liste_officielle_beneficiaire);
			vm.filtre.statut_liste_officielle_beneficiaire = vm.selectedItem.statut_liste_officielle_beneficiaire;
			if(vm.selectedItem.date_realisaion_liste_officielle_beneficiaire)
			vm.filtre.date_realisaion_liste_officielle_beneficiaire = new Date(vm.selectedItem.date_realisaion_liste_officielle_beneficiaire);
			vm.filtre.nombre_menage_beneficiaire_enregistre = parseInt(vm.selectedItem.nombre_menage_beneficiaire_enregistre);
			vm.filtre.nombre_menage_exclus = parseInt(vm.selectedItem.nombre_menage_exclus);	
			if(vm.selectedItem.date_retard_liste_officielle_beneficiaire)
			vm.filtre.date_retard_liste_officielle_beneficiaire = new Date(vm.selectedItem.date_retard_liste_officielle_beneficiaire);
			vm.filtre.cause_retard_liste_officielle_beneficiaire = vm.selectedItem.cause_retard_liste_officielle_beneficiaire;
			if(vm.selectedItem.date_debut_liste_tavailleur)
			vm.filtre.date_debut_liste_tavailleur = new Date(vm.selectedItem.date_debut_liste_tavailleur);
			if(vm.selectedItem.date_fin_liste_tavailleur)
			vm.filtre.date_fin_liste_tavailleur = new Date(vm.selectedItem.date_fin_liste_tavailleur);
			vm.filtre.statut_liste_officielle_beneficiaire = vm.selectedItem.statut_liste_officielle_beneficiaire;	
			vm.filtre.statut_liste_travailleur = vm.selectedItem.statut_liste_travailleur;			
			if(vm.selectedItem.date_realisation_liste_travailleur)
			vm.filtre.date_realisation_liste_travailleur = new Date(vm.selectedItem.date_realisation_liste_travailleur);
			vm.filtre.menage_avec_travailleur = parseInt(vm.selectedItem.menage_avec_travailleur);
			vm.filtre.menage_inapte = parseInt(vm.selectedItem.menage_inapte);
			vm.filtre.menage_exclus = parseInt(vm.selectedItem.menage_exclus);
			if(vm.selectedItem.date_retard_etablissement_liste_travailleur)
			vm.filtre.date_retard_etablissement_liste_travailleur = new Date(vm.selectedItem.date_retard_etablissement_liste_travailleur);
			vm.filtre.cause_retard_etablissement_liste_travailleur = vm.selectedItem.cause_retard_etablissement_liste_travailleur;
			vm.filtre.debut_recrutement_agex = vm.selectedItem.debut_recrutement_agex;
			vm.filtre.fin_recrutement_agex = vm.selectedItem.fin_recrutement_agex;
			vm.filtre.statut_recrutement_agex = vm.selectedItem.statut_recrutement_agex;
			if(vm.selectedItem.date_realisation_recrutement_agex)
			vm.filtre.date_realisation_recrutement_agex = new Date(vm.selectedItem.date_realisation_recrutement_agex);
			vm.filtre.nombre_agex_recrute = parseInt(vm.selectedItem.nombre_agex_recrute);
			if(vm.selectedItem.date_retard_recrutement_agex)
			vm.filtre.date_retard_recrutement_agex = new Date(vm.selectedItem.date_retard_recrutement_agex);
			vm.filtre.cause_retard_recrutement_agex = vm.selectedItem.cause_retard_recrutement_agex;
			vm.filtre.debut_elaboration_mdp = vm.selectedItem.debut_elaboration_mdp;
			vm.filtre.fin_elaboration_mdp = vm.selectedItem.fin_elaboration_mdp;
			vm.filtre.statut_elaboration_mdp = vm.selectedItem.statut_elaboration_mdp;
			if(vm.selectedItem.date_realisation_elaboration_mdp)
			vm.filtre.date_realisation_elaboration_mdp = new Date(vm.selectedItem.date_realisation_elaboration_mdp);
			vm.filtre.nombre_mdp_elabore = parseInt(vm.selectedItem.nombre_mdp_elabore);
			if(vm.selectedItem.date_retard_elaboration_mdp)
			vm.filtre.date_retard_elaboration_mdp = new Date(vm.selectedItem.date_retard_elaboration_mdp);
			vm.filtre.cause_retard_elaboration_mdp = vm.selectedItem.cause_retard_elaboration_mdp;
			vm.filtre.debut_premier_paiement = vm.selectedItem.debut_premier_paiement;
			vm.filtre.fin_premier_paiement = vm.selectedItem.fin_premier_paiement;
			vm.filtre.nombre_menage_premier_paiement = parseInt(vm.selectedItem.nombre_menage_premier_paiement);
			vm.filtre.menage_exclus_premier_paiement = parseInt(vm.selectedItem.menage_exclus_premier_paiement);
			vm.filtre.statut_premier_paiement = vm.selectedItem.statut_premier_paiement;
			if(vm.selectedItem.date_realisation_premier_paiement)
			vm.filtre.date_realisation_premier_paiement = new Date(vm.selectedItem.date_realisation_premier_paiement);
			if(vm.selectedItem.date_retard_premier_paiement)
			vm.filtre.date_retard_premier_paiement = new Date(vm.selectedItem.date_retard_premier_paiement);
			vm.filtre.cause_retard_premier_paiement = vm.selectedItem.cause_retard_premier_paiement;						
			vm.filtre.debut_deuxieme_paiement = vm.selectedItem.debut_deuxieme_paiement;
			vm.filtrefin_deuxieme_paiement = vm.selectedItem.fin_deuxieme_paiement;
			vm.filtre.nombre_menage_deuxieme_paiement = parseInt(vm.selectedItem.nombre_menage_deuxieme_paiement);
			vm.filtre.menage_exclus_deuxieme_paiement = parseInt(vm.selectedItem.menage_exclus_deuxieme_paiement);
			vm.filtre.statut_deuxieme_paiement = vm.selectedItem.statut_deuxieme_paiement;
			if(vm.selectedItem.date_realisation_deuxieme_paiement)
			vm.filtre.date_realisation_deuxieme_paiement = new Date(vm.selectedItem.date_realisation_deuxieme_paiement);
			if(vm.selectedItem.date_retard_deuxieme_paiement)
			vm.filtre.date_retard_deuxieme_paiement = new Date(vm.selectedItem.date_retard_deuxieme_paiement);
			vm.filtre.cause_retard_deuxieme_paiement = vm.selectedItem.cause_retard_deuxieme_paiement;			
			vm.filtre.debut_troisieme_paiement = vm.selectedItem.debut_troisieme_paiement;
			vm.filtre.fin_troisieme_paiement = vm.selectedItem.fin_troisieme_paiement;
			vm.filtre.nombre_menage_troisieme_paiement = parseInt(vm.selectedItem.nombre_menage_troisieme_paiement);
			vm.filtre.menage_exclus_troisieme_paiement = parseInt(vm.selectedItem.menage_exclus_troisieme_paiement);
			vm.filtre.statut_troisieme_paiement = vm.selectedItem.statut_troisieme_paiement;
			if(vm.selectedItem.date_realisation_troisieme_paiement)
			vm.filtre.date_realisation_troisieme_paiement = new Date(vm.selectedItem.date_realisation_troisieme_paiement);
			if(vm.selectedItem.date_retard_troisieme_paiement)
			vm.filtre.date_retard_troisieme_paiement = new Date(vm.selectedItem.date_retard_troisieme_paiement);
			vm.filtre.cause_retard_troisieme_paiement = vm.selectedItem.cause_retard_troisieme_paiement;
			vm.affiche_load=false;
			vm.affichage_masque=true;
		}	
		vm.annuler= function (item)  {
			vm.affichage_masque=false;
			vm.selectedItem={};
		}
		vm.save_suivi_evaluation = function(item) {
			vm.disable_button = true ;
			var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };
				vm.test_id = item.id 
			var datas = $.param(
                    {    
						supprimer:0,
						id: item.id ,
						type_suivi: vm.filtre.type_suivi,
						population_rgph_2017: item.population_rgph_2017,
						debut_affichage_menage_preselectionne: item.debut_affichage_menage_preselectionne,                                                 
						fin_affichage_menage_preselectionne: item.fin_affichage_menage_preselectionne,                                                 
						statut_affichage_menage_preselectionne: item.statut_affichage_menage_preselectionne,                                                 
						date_realistaion_affichage_menage_preselectionne: formatDateBDD(item.date_realistaion_affichage_menage_preselectionne),                                                 
						date_retard_affichage_menage_preselectionne: formatDateBDD(item.date_retard_affichage_menage_preselectionne),                                                 
						cause_retard_affichage_menage_preselectionne: item.cause_retard_affichage_menage_preselectionne,                                                 
						statut_reception_enregitrement_plainte: item.statut_reception_enregitrement_plainte,                                                 
						date_realisation_enregitrement_plainte: formatDateBDD(item.date_realisation_enregitrement_plainte),                                                 
						date_retard_enregitrement_plainte: formatDateBDD(item.date_retard_enregitrement_plainte),                                                 
						cause_retard_enregitrement_plainte: item.cause_retard_enregitrement_plainte,                                                 
						statut_traitement_plainte: item.statut_traitement_plainte,                                                 
						date_realisation_traitement_plainte: formatDateBDD(item.date_realisation_traitement_plainte),                                                 
						date_retard_traitement_plainte: formatDateBDD(item.date_retard_traitement_plainte),                                                 
						cause_retard_traitement_plainte: item.cause_retard_traitement_plainte,                                                 
						statut_validation_ag_communautaire: item.statut_validation_ag_communautaire,                                                 
						date_realisation_validation_ag_communautaire: formatDateBDD(item.date_realisation_validation_ag_communautaire),                                                 
						date_retard_validation_ag_communautaire: formatDateBDD(item.date_retard_validation_ag_communautaire),                                                 
						cause_retard_validation_ag_communautaire: item.cause_retard_validation_ag_communautaire,					  
						date_debut_liste_officielle_beneficiaire : item.date_debut_liste_officielle_beneficiaire,    
						date_fin_liste_officielle_beneficiaire  : item.date_fin_liste_officielle_beneficiaire,          
						statut_liste_officielle_beneficiaire : item.statut_liste_officielle_beneficiaire,            
						date_realisaion_liste_officielle_beneficiaire : item.date_realisaion_liste_officielle_beneficiaire,    
						nombre_menage_beneficiaire_enregistre : item.nombre_menage_beneficiaire_enregistre,           
						nombre_menage_exclus  : item.nombre_menage_exclus,                            
						date_retard_liste_officielle_beneficiaire  : item.date_retard_liste_officielle_beneficiaire,       
						cause_retard_liste_officielle_beneficiaire : item.cause_retard_liste_officielle_beneficiaire,       
						date_debut_liste_tavailleur  : item.date_debut_liste_tavailleur,                     
						date_fin_liste_tavailleur : item.date_fin_liste_tavailleur,                        
						statut_liste_travailleur  : item.statut_liste_travailleur,                        
						date_realisation_liste_travailleur : item.date_realisation_liste_travailleur, 
						menage_avec_travailleur : item.menage_avec_travailleur, 
						menage_inapte : item.menage_inapte, 
						menage_exclus : item.menage_exclus, 
						date_retard_etablissement_liste_travailleur : item.date_retard_etablissement_liste_travailleur, 
						cause_retard_etablissement_liste_travailleur : item.cause_retard_etablissement_liste_travailleur, 
						statut_recrutement_agex : item.statut_recrutement_agex, 
						date_realisation_recrutement_agex : item.date_realisation_recrutement_agex, 
						date_retard_recrutement_agex : item.date_retard_recrutement_agex, 
						cause_retard_recrutement_agex : item.cause_retard_recrutement_agex, 
						statut_elaboration_mdp : item.statut_elaboration_mdp, 
						date_realisation_elaboration_mdp : item.date_realisation_elaboration_mdp, 
						date_retard_elaboration_mdp : item.date_retard_elaboration_mdp, 
						cause_retard_elaboration_mdp : item.cause_retard_elaboration_mdp, 
						statut_premier_paiement  : item.statut_premier_paiement,
						date_realisation_premier_paiement : item.date_realisation_premier_paiement,
						date_retard_premier_paiement : item.date_retard_premier_paiement,
						cause_retard_premier_paiement : item.cause_retard_premier_paiement,						
						statut_deuxieme_paiement : item.statut_deuxieme_paiement,
						date_realisation_deuxieme_paiement : item.date_realisation_deuxieme_paiement,
						date_retard_deuxieme_paiement : item.date_retard_deuxieme_paiement,
						cause_retard_deuxieme_paiement : item.cause_retard_deuxieme_paiement,
						statut_troisieme_paiement : item.statut_troisieme_paiement,
						date_realisation_troisieme_paiement : item.date_realisation_troisieme_paiement,
						date_retard_troisieme_paiement : item.date_retard_troisieme_paiement,
						cause_retard_troisieme_paiement : item.cause_retard_troisieme_paiement,
						
                    });

			apiFactory.add("suivi_evaluation/index",datas, config).success(function (data) {
				if(vm.test_id ==0) {
					vm.selectedItem.id=data.response;
				}
				vm.disable_button = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
			}).error(function (data) {
				vm.disable_button = false ;
				vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
			}); 
		}
		//FIN CHECK BOK MULTISELECT
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
		vm.modifierVillage = function() {
			vm.filtre.vague=null;
			vm.filtre.zip=null;
			vm.all_village.forEach(function(vil) {
				if(parseInt(vil.id)==parseInt(vm.filtre.village_id)) {
					vm.filtre.village = vil.Village; 
					vm.filtre.vague=vil.vague;
					vm.filtre.zip=vil.id_zip;
					vm.nontrouvee=false;
				}
			});			
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
		vm.formatMillier = function (nombre) 
		{
            if (typeof nombre != 'undefined' && parseInt(nombre) >= 0) {
                nombre += '';
                var sep = ' ';
                var reg = /(\d+)(\d{3})/;
                while (reg.test(nombre)) {
                    nombre = nombre.replace(reg, '$1' + sep + '$2');
                }
                return nombre;
            } else {
                return "";
            }
		}
	}
  })();

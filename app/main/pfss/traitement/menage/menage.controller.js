(function ()
{
    'use strict';
    angular
        .module('app.population.traitement.menage')
        .controller('MenageController', MenageController);

    /** @ngInject */
    function MenageController(apiFactory, $state, $mdDialog, $scope,$cookieStore) {
		var vm = this;
	   vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        responsive: true
      };

      vm.menage_column = [{titre:"Code"},{titre:"Nom & prénoms"},{titre:"Sexe"},{titre:"C.I.N"},{titre:"Fokontany"},{titre:"Adresse"}];
      // vm.menage_column = [{titre:"Numero d'enregistrement"},{titre:"Chef Ménage"},
      // {titre:"Age chef de ménage"},{titre:"Sexe"},{titre:"Addresse"},{titre:"Personne inscrire"},{titre:"Etat envoie"}];
      vm.individu_column = [{titre:"Nom"},{titre:"Date de naissance"},{titre:"Lien de parenté"},{titre:"Sexe"}];
      //initialisation variable
        vm.affiche_load = false ;
        vm.selectedItem = {} ;
        vm.selectedItem_individu = {} ;
		
        vm.tab_reponse_revetement_toit = [] ;
        vm.tab_reponse_revetement_sol = [] ;
        vm.tab_reponse_revetement_mur = [] ;
        vm.tab_reponse_source_eclairage = [] ;
        vm.tab_reponse_combustible = [] ;
        vm.tab_reponse_toilette = [] ;
        vm.tab_reponse_source_eau = [] ;
        vm.tab_reponse_bien_equipement = [] ;
        vm.tab_reponse_moyen_production = [] ;
        vm.tab_reponse_source_revenu = [] ;
        vm.tab_reponse_elevage = [] ;
        vm.tab_reponse_culture = [] ;
        vm.tab_reponse_aliment = [] ;
        vm.tab_source_aliment = [] ;
        vm.tab_strategie_alimentaire = [] ;
        vm.tab_probleme_sur_revenu = [] ;
        vm.tab_strategie_sur_revenu = [] ;
        vm.tab_activite_recours = [] ;
        vm.tab_service_beneficie = [] ;
        vm.tab_infrastructure_frequente = [] ;
		
        vm.tab_intervention = [] ;//liste intervention associé au menage
        vm.tab_intervention_individu = [] ;//liste intervention associé au individu
        vm.reponse_individu = {} ;
        vm.all_individus = [] ;
        vm.all_menages = [] ;

        vm.nouvelle_element = false ;
        vm.nouvelle_element_individu = false ;
        vm.affichage_masque = false ;
        vm.affichage_masque_individu = false ;
        vm.date_now = new Date() ;

        vm.disable_button = false ;
      //initialisation variable

      //test check radio button

		var type_logement_checked = 0 ;
		var occupation_logement_checked = 0 ;
		var toillete_checked = 0 ;
		var checked_id_lien_parente = 0 ;
		var checked_situation_matrimoniale = 0 ;
		var checked_id_handicap_visuel = 0 ;
		var checked_id_handicap_parole = 0 ;
		var checked_id_handicap_auditif = 0 ;
		var checked_id_handicap_mental = 0 ;
		var checked_id_handicap_moteur = 0 ;
		var checked_id_langue = 0 ;
		var checked_id_type_ecole = 0 ;
		var checked_id_niveau_de_classe = 0 ;
		var checked_id_groupe_appartenace = 0 ;
        vm.tab_reponse_langue = [] ;
		vm.test_check_type_logement = function() {
			if (type_logement_checked == vm.id_type_logement) {
				vm.id_type_logement = null ;
			}  else {
				type_logement_checked = vm.id_type_logement ;
			}
		}
		vm.test_check_occupation_logement = function() {
			if (occupation_logement_checked == vm.id_occupation_logement) {
				vm.id_occupation_logement = null ;
			}  else {
				occupation_logement_checked = vm.id_occupation_logement ;
			}
		}
		vm.test_check_id_lien_parente = function() {
			if (checked_id_lien_parente == vm.reponse_individu.id_lien_de_parente) {
				vm.reponse_individu.id_lien_de_parente = null ;
			} else {
				checked_id_lien_parente = vm.reponse_individu.id_lien_de_parente ;
			}
		}
		vm.test_check_situation_matrimoniale = function() {
			if (checked_situation_matrimoniale == vm.reponse_individu.situation_matrimoniale) {
				vm.reponse_individu.situation_matrimoniale = null ;
			} else {
			checked_situation_matrimoniale = vm.reponse_individu.situation_matrimoniale ;
			}
		}
		vm.test_check_id_handicap_visuel = function() {
			if (checked_id_handicap_visuel == vm.reponse_individu.id_handicap_visuel) {
				vm.reponse_individu.id_handicap_visuel = null ;
			} else {
				checked_id_handicap_visuel = vm.reponse_individu.id_handicap_visuel ;
			}
		}
		vm.test_check_id_handicap_parole = function()  {
			if (checked_id_handicap_parole == vm.reponse_individu.id_handicap_parole) {
				vm.reponse_individu.id_handicap_parole = null ;
			} else {
				checked_id_handicap_parole = vm.reponse_individu.id_handicap_parole ;
			}
		}
		vm.test_check_id_handicap_auditif = function() {
			if (checked_id_handicap_auditif == vm.reponse_individu.id_handicap_auditif) {
				vm.reponse_individu.id_handicap_auditif = null ;
			} else {
				checked_id_handicap_auditif = vm.reponse_individu.id_handicap_auditif ;
			}
		}
		vm.test_check_id_handicap_mental = function() {
			if (checked_id_handicap_mental == vm.reponse_individu.id_handicap_mental) {
				vm.reponse_individu.id_handicap_mental = null ;
			} else {
				checked_id_handicap_mental = vm.reponse_individu.id_handicap_mental ;
			}
		}
		vm.test_check_id_handicap_moteur = function() {
			if (checked_id_handicap_moteur == vm.reponse_individu.id_handicap_moteur) {
				vm.reponse_individu.id_handicap_moteur = null ;
			} else {
				checked_id_handicap_moteur = vm.reponse_individu.id_handicap_moteur ;
			}
		}
		vm.test_check_langue = function() {
			if (checked_id_langue == vm.reponse_individu.langue) {
				vm.reponse_individu.id_langue = null ;
			} else {
				checked_langue = vm.reponse_individu.langue ;
			}
		}
		vm.test_check_id_type_ecole = function() {
			if (checked_id_type_ecole == vm.reponse_individu.id_type_ecole) {
				vm.reponse_individu.id_type_ecole = null ;
			} else {
				checked_id_type_ecole = vm.reponse_individu.id_type_ecole ;
			}
		}
		vm.test_check_id_niveau_de_classe = function() {
			if (checked_id_niveau_de_classe == vm.reponse_individu.id_niveau_de_classe) {
				vm.reponse_individu.id_niveau_de_classe = null ;
			} else {
				checked_id_niveau_de_classe = vm.reponse_individu.id_niveau_de_classe ;
			}
		}
		vm.test_check_id_groupe_appartenace = function() {
			if (checked_id_groupe_appartenace == vm.reponse_individu.id_groupe_appartenace) {
				vm.reponse_individu.id_groupe_appartenace = null ;
			} else {
				checked_id_groupe_appartenace = vm.reponse_individu.id_groupe_appartenace ;
			}
		}
      //fin test check radio button
      //chargement clé etrangère et données de bases
        vm.id_user_cookies = $cookieStore.get('id');
		apiFactory.getOne("utilisateurs/index",vm.id_user_cookies).then(function(result) { 
			vm.user = result.data.response;
			apiFactory.getAll("region/index").then(function(result) { 
				vm.all_region = result.data.response;    
			});
	  
		});
		apiFactory.getTable("enquete_menage/index","type_logement").then(function(result){
			vm.all_type_logement = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","occupation_logement").then(function(result){
			vm.all_occupation_logement = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","type_revetement_toit").then(function(result){
			vm.all_revetement_toit = result.data.response;
		}); 
		apiFactory.getTable("enquete_menage/index","type_revetement_sol").then(function(result){
			vm.all_revetement_sol = result.data.response;
		}); 
		apiFactory.getTable("enquete_menage/index","type_revetement_mur").then(function(result){
			vm.all_revetement_mur = result.data.response;
		}); 
		apiFactory.getTable("enquete_menage/index","type_eclairage").then(function(result){
			vm.all_source_eclairage = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","type_combustible").then(function(result){
			vm.all_combustible = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","type_toilette").then(function(result){
			vm.all_toilette = result.data.response;
		}); 
		apiFactory.getTable("enquete_menage/index","type_source_eau").then(function(result){
			vm.all_source_eau = result.data.response;
		}); 
		apiFactory.getTable("enquete_menage/index","type_bien_equipement").then(function(result){
			vm.all_bien_equipement = result.data.response;
		}); 
		apiFactory.getTable("enquete_menage/index","type_moyen_production").then(function(result){
			vm.all_moyen_production = result.data.response;
		}); 
		apiFactory.getTable("enquete_menage/index","type_source_revenu").then(function(result){
			vm.all_source_revenu = result.data.response;
		}); 
		apiFactory.getTable("enquete_menage/index","type_elevage").then(function(result){
			vm.all_elevage = result.data.response;
		}); 
		apiFactory.getTable("enquete_menage/index","type_culture").then(function(result){
			vm.all_culture = result.data.response;
		}); 
		apiFactory.getTable("enquete_menage/index","type_aliment").then(function(result){
			vm.all_aliment = result.data.response;
		}); 
		apiFactory.getTable("enquete_menage/index","type_source_obtention_aliment").then(function(result){
			vm.all_source_aliment = result.data.response;
		}); 
		apiFactory.getTable("enquete_menage/index","type_difficulte_alimentaire").then(function(result){
			vm.all_strategie_alimentaire = result.data.response;
		}); 
		apiFactory.getTable("enquete_menage/index","type_probleme_revenu").then(function(result){
			vm.all_probleme_sur_revenu = result.data.response;
		}); 
		apiFactory.getTable("enquete_menage/index","type_strategie_face_probleme").then(function(result){
			vm.all_strategie_sur_revenu = result.data.response;
		}); 
		apiFactory.getTable("enquete_menage/index","type_engagement_activite").then(function(result){
			vm.all_activite_recours = result.data.response;
		}); 
		apiFactory.getTable("enquete_menage/index","type_service_beneficie").then(function(result){
			vm.all_service_beneficie = result.data.response;
		}); 
		apiFactory.getTable("enquete_menage/index","type_infrastructure").then(function(result){
			vm.all_infrastructure_frequente = result.data.response;
		}); 
		//chargement clé etrangère et données de bases
		//QUESTIONNAIRE INDIVIDU
		apiFactory.getTable("enquete_menage/index","liendeparente").then(function(result){
			vm.allRecordsLiendeparente = result.data.response;
		}); 
		apiFactory.getTable("enquete_menage/index","situation_matrimoniale").then(function(result){
			vm.allRecordssituation_matrimoniale = result.data.response;      
		}); 
		apiFactory.getTable("enquete_menage/index","handicap_visuel").then(function(result){
			vm.allRecordsHandicapvisuel = result.data.response;
		});  
		apiFactory.getTable("enquete_menage/index","handicap_parole").then(function(result){
			vm.allRecordsHandicapparole = result.data.response;
		}); 
		apiFactory.getTable("enquete_menage/index","handicap_auditif").then(function(result){
			vm.allRecordsHandicapauditif = result.data.response;
		});  
		apiFactory.getTable("enquete_menage/index","handicap_mental").then(function(result){
			vm.allRecordsHandicapmental = result.data.response;
		}); 
		apiFactory.getTable("enquete_menage/index","handicap_moteur").then(function(result){
			vm.allRecordsHandicapmoteur = result.data.response;
		});   
		apiFactory.getTable("enquete_menage/index","niveau_de_classe").then(function(result){
			vm.allRecordsNiveaudeclasse = result.data.response;
		});  
		apiFactory.getTable("enquete_menage/index","situation_matrimoniale").then(function(result){
			vm.allRecordsSituationmatrimoniale = result.data.response;
		});  
		apiFactory.getTable("enquete_menage/index","liste_langue").then(function(result){
			vm.allRecordsLangue = result.data.response;
		});  
		apiFactory.getTable("enquete_menage/index","type_ecole").then(function(result){
			vm.allRecordsTypeecole = result.data.response;
		});  
		apiFactory.getTable("enquete_menage/index","groupe_appartenance").then(function(result){
			vm.allRecordsGroupeappartenance = result.data.response;
		});  
		//FIN QUESTIONNAIRE INDIVIDU   
        apiFactory.getAll("intervention/index").then(function(result) { 
			vm.all_intervention = result.data.response;            
        });
		
		vm.get_max_id_generer_ref = function() {
			apiFactory.getAPIgeneraliserREST("menage/index","max_id",1).then(function(result)  { 
				vm.max_id =  result.data.response.id;          
				var tab_region = vm.all_region ;
				var tab_reg = [] ;
				var tab_com = [] ;
				var tab_vil = [] ;
				tab_reg = vm.all_region ;
				tab_com = vm.all_commune ;
				tab_vil = vm.all_village ;
				var region ;
				var reg ;
				var com ;
				var vill ;
				if (vm.filtre.id_region)  {
					region = tab_region.filter(function(obj) {
						return obj.id == vm.filtre.id_region;
					});
				}
				if (vm.filtre.id_region && (tab_reg.length > 0 ))  {
					reg = tab_reg.filter(function(obj)	{
						return obj.id == vm.filtre.id_region;
					});
				}
				if (vm.filtre.id_commune && tab_com.length > 0)  {
					com = tab_com.filter(function(obj) {
						return obj.id == vm.filtre.id_commune;
					});
				}
				if (vm.filtre.id_fokontany && tab_vil.length > 0) {
					vill = tab_vil.filter(function(obj)	{
						return obj.id == vm.filtre.id_fokontany;
					});
				}
				if (tab_vil) {
					if (tab_vil.length > 0)  {
						if (vm.nouvelle_element) {
							vm.filtre.NumeroEnregistrement = region[0].Code + "/"+reg[0].Code+"/"+ com[0].Code+"/"+vill[0].Code+"/" + (Number(vm.max_id)+1) ;
						}	else {
							vm.filtre.NumeroEnregistrement = region[0].Code + "/"+reg[0].Code+"/"+ com[0].Code+"/"+vill[0].Code+"/" + vm.selectedItem.id ;
						}				
					}
				}
			});
		}    
		vm.afficher_masque_ajout = function() {
			vm.nouvelle_element = true ;
			vm.affichage_masque = true ;
			vm.selectedItem = {} ;
			vm.filtre.NumeroEnregistrement = '' ;
			vm.filtre.nomchefmenage = '' ;
			vm.filtre.PersonneInscription = '' ;
			vm.filtre.agechefdemenage = '' ;
			vm.filtre.SexeChefMenage = '' ;
			vm.filtre.Addresse = '' ;
			vm.filtre.DateInscription = new Date() ;
			vm.get_max_id_generer_ref();
		}
		vm.modifier = function()  {
			vm.nouvelle_element = false ;
			vm.affichage_masque = true ;
			vm.filtre.DateInscription = new Date(vm.selectedItem.DateInscription);
			vm.filtre.id_fokontany = vm.selectedItem.id_fokontany ;
			vm.filtre.nomchefmenage = vm.selectedItem.nomchefmenage ;
			vm.filtre.PersonneInscription = vm.selectedItem.PersonneInscription ;
			vm.filtre.agechefdemenage = Number(vm.selectedItem.agechefdemenage) ;
			vm.filtre.SexeChefMenage = vm.selectedItem.SexeChefMenage ;
			vm.filtre.Addresse = vm.selectedItem.Addresse ;
			vm.get_max_id_generer_ref();
		}
		vm.annuler = function () {
			vm.nouvelle_element = false ;
			vm.affichage_masque = false ;
		}
		vm.annuler_individu = function()  {
			vm.nouvelle_element_individu = false ;
			vm.affichage_masque_individu = false ;
		}
		vm.ajout_individu = function()  {
			vm.affichage_masque_individu = true ;
			vm.nouvelle_element_individu = true ;
			vm.individu_masque = {} ;
		}
		vm.modifier_individu = function()  {
			vm.nouvelle_element_individu = false ;
			vm.affichage_masque_individu = true ;
			vm.individu_masque.Nom = vm.selectedItem_individu.Nom ;
			vm.individu_masque.Activite = vm.selectedItem_individu.Activite ;
			vm.individu_masque.travailleur = vm.selectedItem_individu.travailleur ;
			vm.individu_masque.sexe = vm.selectedItem_individu.sexe ;
			vm.individu_masque.DateNaissance = new Date(vm.selectedItem_individu.DateNaissance) ;
		}
		vm.filtre_region = function() {
			apiFactory.getAPIgeneraliserREST("district/index","cle_etrangere",vm.filtre.id_region).then(function(result) { 
				vm.all_district = result.data.response;   
				vm.filtre.id_district = null ; 
				vm.filtre.id_commune = null ; 
				vm.filtre.id_fokontany = null ; 
				vm.get_max_id_generer_ref();          
			});
		}
		vm.filtre_commune = function() {
			apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtre.id_district).then(function(result) { 
				vm.all_commune = result.data.response; 
				vm.filtre.id_commune = null ; 
				vm.filtre.id_fokontany = null ; 
				vm.get_max_id_generer_ref();           
			});
		}
		vm.generer_ref = function()  {
			vm.get_max_id_generer_ref();
		}
		vm.filtre_fokontany = function() {
			apiFactory.getAPIgeneraliserREST("fokontany/index","cle_etrangere",vm.filtre.id_commune).then(function(result) { 
				vm.all_fokontany = result.data.response;    
				vm.filtre.id_fokontany = null ;          
			});
		}
		vm.filtrer = function()	{
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("menage/index","cle_etrangere",vm.filtre.id_fokontany).then(function(result) { 
				vm.all_menages = result.data.response;    
				vm.affiche_load = false ;
			});
		}
		vm.get_individus_by_menage = function(menage_id) {
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("individu/index","cle_etrangere",menage_id).then(function(result) 	{ 
				vm.all_individus = result.data.response;    
				console.log(vm.all_individus);
				vm.affiche_load = false ;
			});
		}
		vm.get_enquete_by_menage = function(menage_id) {			
			vm.tab_reponse_revetement_toit = [] ;
			vm.tab_reponse_revetement_sol = [] ;
			vm.tab_reponse_revetement_mur = [] ;
			vm.tab_reponse_source_eclairage = [] ;
			vm.tab_reponse_combustible = [] ;
			vm.tab_reponse_toilette = [] ;
			vm.tab_reponse_source_eau = [] ;
			vm.tab_reponse_bien_equipement = [] ;
			vm.tab_reponse_moyen_production = [] ;
			vm.tab_reponse_source_revenu = [] ;
			vm.tab_reponse_elevage = [] ;
			vm.tab_reponse_culture = [] ;
			vm.tab_reponse_aliment = [] ;
			vm.tab_source_aliment = [] ;
			vm.tab_strategie_alimentaire = [] ;
			vm.tab_probleme_sur_revenu = [] ;
			vm.tab_strategie_sur_revenu = [] ;
			vm.tab_activite_recours = [] ;
			vm.tab_service_beneficie = [] ;
			vm.tab_infrastructure_frequente = [] ;
			apiFactory.getAPIgeneraliserREST("enquete_sur_menage/index","cle_etrangere",menage_id).then(function(result)  { 
				vm.enquete_by_menage = result.data.response;   
				console.log(vm.enquete_by_menage);
				vm.id_type_logement=vm.enquete_by_menage.id_type_logement;
				vm.id_occupation_logement=vm.enquete_by_menage.id_occupation_logement;
				if (vm.enquete_by_menage.revetement_toit) {
					vm.tab_reponse_revetement_toit = vm.enquete_by_menage.revetement_toit ;
				}
				if (vm.enquete_by_menage.revetement_sol) {
					vm.tab_reponse_revetement_sol = vm.enquete_by_menage.revetement_sol ;
				}
				if (vm.enquete_by_menage.revetement_mur) {
					vm.tab_reponse_revetement_mur = vm.enquete_by_menage.revetement_mur ;
				}
				if (vm.enquete_by_menage.source_eclairage) {
					vm.tab_reponse_source_eclairage = vm.enquete_by_menage.source_eclairage ;
				}
				if (vm.enquete_by_menage.combustible) {
					vm.tab_reponse_combustible = vm.enquete_by_menage.combustible ;
				}
				if (vm.enquete_by_menage.toilette) {
					vm.tab_reponse_toilette = vm.enquete_by_menage.toilette ;
				}				
				if (vm.enquete_by_menage.source_eau) {
					vm.tab_reponse_source_eau = vm.enquete_by_menage.source_eau ;
				}
				if (vm.enquete_by_menage.bien_equipement) {
					vm.tab_reponse_bien_equipement = vm.enquete_by_menage.bien_equipement ;
				}
				if (vm.enquete_by_menage.moyen_production) {
					vm.tab_reponse_moyen_production = vm.enquete_by_menage.moyen_production ;
				}
				if (vm.enquete_by_menage.source_revenu) {
					vm.tab_reponse_source_revenu = vm.enquete_by_menage.source_revenu ;
				}
				if (vm.enquete_by_menage.elevage) {
					vm.tab_reponse_elevage = vm.enquete_by_menage.elevage ;
				}
				if (vm.enquete_by_menage.culture) {
					vm.tab_reponse_culture = vm.enquete_by_menage.culture ;
				}
				if (vm.enquete_by_menage.aliment) {
					vm.tab_reponse_aliment = vm.enquete_by_menage.aliment ;
				}
				if (vm.enquete_by_menage.source_aliment) {
					vm.tab_source_aliment = vm.enquete_by_menage.source_aliment ;
				}
				if (vm.enquete_by_menage.strategie_alimentaire) {
					vm.tab_strategie_alimentaire = vm.enquete_by_menage.strategie_alimentaire ;
				}
				if (vm.enquete_by_menage.probleme_sur_revenu) {
					vm.tab_probleme_sur_revenu = vm.enquete_by_menage.probleme_sur_revenu ;
				}
				if (vm.enquete_by_menage.strategie_sur_revenu) {
					vm.tab_strategie_sur_revenu = vm.enquete_by_menage.strategie_sur_revenu ;
				}
				if (vm.enquete_by_menage.activite_recours) {
					vm.tab_activite_recours = vm.enquete_by_menage.activite_recours ;
				}
				if (vm.enquete_by_menage.service_beneficie) {
					vm.tab_service_beneficie = vm.enquete_by_menage.service_beneficie ;
				}
				if (vm.enquete_by_menage.infrastructure_frequente) {
					vm.tab_infrastructure_frequente = vm.enquete_by_menage.infrastructure_frequente ;
				}
				vm.id_toilette = vm.enquete_by_menage.toilette ;
				if (vm.enquete_by_menage.id) {
					vm.id_enquete_menage = vm.enquete_by_menage.id ;
				} else {
					vm.id_enquete_menage = 0 ; 
				}        
			});        
		}
		vm.get_menage_intervetion_by_menage = function(menage_id) {
			vm.tab_intervention = [] ;
			apiFactory.getAPIgeneraliserREST("menage_beneficiaire/index","cle_etrangere",menage_id).then(function(result) {
				vm.menage_intervention_liaisons = result.data.response; 
				if (vm.menage_intervention_liaisons.id_intervention)  {
					vm.tab_intervention = vm.menage_intervention_liaisons.id_intervention ;
				}
				if (vm.menage_intervention_liaisons.id) {
					vm.id_menage_intervention = vm.menage_intervention_liaisons.id ;
				} else{
					vm.id_menage_intervention = 0 ; 
				}       
			});
		}
		vm.get_enquete_individu_by_individu = function(id_individu) {
			vm.tab_reponse_langue = [] ;
			vm.reponse_individu.id_lien_de_parente = null ;
			// vm.reponse_individu.situation_matrimoniale = null ;
			vm.reponse_individu.id_groupe_appartenance = null ;
			vm.reponse_individu.id_type_ecole = null ;
			vm.reponse_individu.id_niveau_de_classe = null ;
			vm.reponse_individu.id_handicap_auditif = null ;
			vm.reponse_individu.id_handicap_mental = null ;
			vm.reponse_individu.id_handicap_moteur = null ;
			vm.reponse_individu.id_handicap_parole = null ;
			vm.reponse_individu.id_handicap_visuel = null ;         
			apiFactory.getAPIgeneraliserREST("enquete_sur_individu/index","cle_etrangere",id_individu).then(function(result) {
				vm.enquete_individu = result.data.response ;
				console.log(vm.enquete_individu);
				vm.reponse_individu.id_lien_de_parente = vm.enquete_individu.id_lien_de_parente ;
				// vm.reponse_individu.situation_matrimoniale = vm.enquete_individu.situation_matrimoniale ;
				vm.reponse_individu.id_groupe_appartenance = vm.enquete_individu.id_groupe_appartenance ;
				vm.reponse_individu.id_type_ecole = vm.enquete_individu.id_type_ecole ;
				vm.reponse_individu.id_niveau_de_classe = vm.enquete_individu.id_niveau_de_classe ;
				vm.reponse_individu.id_handicap_auditif = vm.enquete_individu.id_handicap_auditif ;
				vm.reponse_individu.id_handicap_mental = vm.enquete_individu.id_handicap_mental ;
				vm.reponse_individu.id_handicap_moteur = vm.enquete_individu.id_handicap_moteur ;
				vm.reponse_individu.id_handicap_parole = vm.enquete_individu.id_handicap_parole ;
				vm.reponse_individu.id_handicap_visuel = vm.enquete_individu.id_handicap_visuel ;         
				if (vm.enquete_individu.langue) {
					vm.tab_reponse_langue = vm.enquete_individu.langue ;
				}
				if (vm.enquete_individu.id) {
					vm.id_enquete_individu = vm.enquete_individu.id ;
				} else {
					vm.id_enquete_individu = 0 ; 
				}
			});
		}
		vm.get_individu_intervention_by_individu = function(id_individu) {
			vm.tab_intervention_individu = [] ;
			apiFactory.getAPIgeneraliserREST("individu_beneficiaire/index","cle_etrangere",id_individu).then(function(result) {
				vm.individu_intervention_liaisons = result.data.response; 
				if (vm.individu_intervention_liaisons.id_intervention) {
					vm.tab_intervention_individu = vm.individu_intervention_liaisons.id_intervention ;
				}
				if (vm.individu_intervention_liaisons.id) {
					vm.id_individu_intervention = vm.individu_intervention_liaisons.id ;
				} else {
					vm.id_individu_intervention = 0 ; 
				}        
			});
		}
		vm.selection= function (item)  {
			if ((!vm.affiche_load)&&(!vm.affichage_masque))  {
				//vidage tab reponse
				vm.all_individus = [] ;
				//vidage tab reponse
				vm.selectedItem_individu = {} ;//raz individu_selected
				vm.selectedItem = item;
				vm.nouvelItem   = item;
				//get individu
				vm.get_individus_by_menage(item.id);
				vm.get_enquete_by_menage(item.id);
				vm.get_menage_intervetion_by_menage(item.id);
				//get individu
			}       
		}
		$scope.$watch('vm.selectedItem', function() {
			if (!vm.all_menages) return;
			vm.all_menages.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
		})
		vm.selection_individu= function (item) {
			console.log(item);
			if (!vm.affichage_masque_individu)  {
				vm.reponse_individu.enfant_femme = {};
				vm.selectedItem_individu = item;
				vm.nouvelItem_individu   = item;
				vm.get_enquete_individu_by_individu(item.id) ;
				vm.get_individu_intervention_by_individu(item.id);
			}       
		}
		$scope.$watch('vm.selectedItem_individu', function() {
			if (!vm.all_individus) return;
			vm.all_individus.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem_individu.$selected = true;
		})
		//CHECK BOK MULTISELECT
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
		vm.save_reponse_menage = function() {
			vm.disable_button = true ;
			var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
							}
						};
			var datas = $.param({    
                      supprimer:0,
                      id: vm.id_enquete_menage ,
                      id_menage: vm.selectedItem.id,
					  id_type_logement:vm.id_type_logement,
					  id_occupation_logement:vm.id_occupation_logement,
                      revetement_toit: vm.tab_reponse_revetement_toit,                              
                      revetement_sol: vm.tab_reponse_revetement_sol,                              
                      revetement_mur: vm.tab_reponse_revetement_mur,                              
                      source_eclairage: vm.tab_reponse_source_eclairage,                              
                      combustible: vm.tab_reponse_combustible,                              
                      toilette: vm.tab_reponse_toilette,                              
                      source_eau: vm.tab_reponse_source_eau,
                      bien_equipement: vm.tab_reponse_bien_equipement,                              
                      moyen_production: vm.tab_reponse_moyen_production,                              
                      source_revenu: vm.tab_reponse_source_revenu,                              
                      elevage: vm.tab_reponse_elevage,                         
                      culture: vm.tab_reponse_culture,                              
                      aliment: vm.tab_reponse_aliment,                              
                      source_aliment: vm.tab_source_aliment,                              
                      strategie_alimentaire: vm.tab_strategie_alimentaire,                              
                      probleme_sur_revenu: vm.tab_probleme_sur_revenu,                              
                      strategie_sur_revenu: vm.tab_strategie_sur_revenu,                              
                      activite_recours: vm.tab_activite_recours,                              
                      service_beneficie: vm.tab_service_beneficie,                              
                      infrastructure_frequente: vm.tab_infrastructure_frequente,                              
                    });
			apiFactory.add("enquete_sur_menage/index",datas, config).success(function (data)  {
				vm.disable_button = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
				if (vm.id_enquete_menage == 0) {
					vm.id_enquete_menage = data.response ;
				}        
			}).error(function (data) {
				vm.disable_button = false ;
				console.log('erreur '+data);
				vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
			});         
		}
		vm.save_reponse_menage_intervention = function() {
			vm.disable_button = true ;
			var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };

			var datas = $.param(
                    {    
                      supprimer:0,
                      id: vm.id_menage_intervention ,
                      id_menage: vm.selectedItem.id,
                      id_intervention: vm.tab_intervention                                                 
                    });

			apiFactory.add("menage_beneficiaire/index",datas, config).success(function (data) {
				vm.disable_button = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
				if (vm.id_menage_intervention == 0) {
					vm.id_menage_intervention = data.response ;
				}        
			}).error(function (data) {
				vm.disable_button = false ;
				console.log('erreur '+data);
				vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
			}); 
		}
		vm.save_reponse_individu = function(reponse_individu) {
			vm.disable_button = true ;
			var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };

			var datas = $.param(
                    {    
                      supprimer:0,
                      id: vm.id_enquete_individu ,
                      id_individu: vm.selectedItem_individu.id,
                      id_lien_de_parente: reponse_individu.id_lien_de_parente,
                      id_groupe_appartenance: reponse_individu.id_groupe_appartenance,
                      id_type_ecole: reponse_individu.id_type_ecole,
                      id_niveau_de_classe: reponse_individu.id_niveau_de_classe,
                      id_handicap_visuel: reponse_individu.id_handicap_visuel,
                      id_handicap_parole: reponse_individu.id_handicap_parole,
                      id_handicap_auditif: reponse_individu.id_handicap_auditif,
                      id_handicap_mental: reponse_individu.id_handicap_mental,
                      id_handicap_moteur: reponse_individu.id_handicap_moteur,
                      langue: vm.tab_reponse_langue,
                    });
			apiFactory.add("enquete_sur_individu/index",datas, config).success(function (data)  {
				vm.disable_button = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
				if (vm.id_enquete_individu == 0) {
					vm.id_enquete_individu = data.response ;
				}
			}).error(function (data) {
				vm.disable_button = false ;
				console.log('erreur '+data);
				vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
			});    
		}
		vm.save_reponse_individu_intervention = function() {
			vm.disable_button = true ;
			var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };

			var datas = $.param({    
                      supprimer:0,
                      id: vm.id_individu_intervention ,
                      id_individu: vm.selectedItem_individu.id,
                      id_intervention: vm.tab_intervention_individu
                                                 
                    });
			apiFactory.add("individu_beneficiaire/index",datas, config).success(function (data) {
				vm.disable_button = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
				if (vm.id_individu_intervention == 0) {
					vm.id_individu_intervention = data.response ;
				}       
			}).error(function (data) {
				vm.disable_button = false ;
				console.log('erreur '+data);
				vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
			}); 
		}
		vm.save_menage = function(menage) {
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
                      supprimer:0,
                      id: id_mng ,
                      id_fokontany: menage.id_fokontany,
                      DateInscription: formatDateBDD(menage.DateInscription),
                      NumeroEnregistrement: menage.NumeroEnregistrement,
                      nomchefmenage: menage.nomchefmenage,
                      PersonneInscription: menage.PersonneInscription,
                      agechefdemenage: menage.agechefdemenage,
                      SexeChefMenage: menage.SexeChefMenage,
                      Addresse: menage.Addresse
                                                 
                    });
			apiFactory.add("menage/index",datas, config).success(function (data) {
				vm.affichage_masque = false ;
				vm.disable_button = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
				if (vm.nouvelle_element) {
					var mng={
						id : data.response ,
						id_fokontany: menage.id_fokontany,
						DateInscription: (menage.DateInscription),
						NumeroEnregistrement: menage.NumeroEnregistrement,
						nomchefmenage: menage.nomchefmenage,
						PersonneInscription: menage.PersonneInscription,
						agechefdemenage: menage.agechefdemenage,
						SexeChefMenage: menage.SexeChefMenage,
						Addresse: menage.Addresse
					}
						   console.log(menage);
					vm.all_menages.push(mng) ;
				} else {
					vm.affichage_masque_individu = false ;
					vm.selectedItem.DateInscription =  vm.filtre.DateInscription ;
					vm.selectedItem.id_fokontany = vm.filtre.id_fokontany  ;
					vm.selectedItem.NumeroEnregistrement = vm.filtre.NumeroEnregistrement  ;
					vm.selectedItem.nomchefmenage = vm.filtre.nomchefmenage  ;
					vm.selectedItem.PersonneInscription = vm.filtre.PersonneInscription  ;
					vm.selectedItem.agechefdemenage = vm.filtre.agechefdemenage  ;
					vm.selectedItem.SexeChefMenage = vm.filtre.SexeChefMenage  ;
					vm.selectedItem.Addresse = vm.filtre.Addresse  ;
				}      
			}).error(function (data) {
				vm.disable_button = false ;
				console.log('erreur '+data);
				vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
			}); 
		}
		vm.save_individu = function(individu) {
			vm.disable_button = true ;
			var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };

			var id_idv = 0 ;
			if (!vm.nouvelle_element_individu) {
				var id_idv = vm.selectedItem_individu.id ;
			}
			var datas = $.param(
                    {    
                      supprimer:0,
                      id: id_idv ,
                      menage_id: vm.selectedItem.id,
                      DateNaissance: formatDateBDD(individu.DateNaissance),
                      Activite: individu.Activite,
                      travailleur: individu.travailleur,
                      sexe: individu.sexe,
                      Nom: individu.Nom
                    
                                                 
                    });
			apiFactory.add("individu/index",datas, config).success(function (data) {
				vm.disable_button = false ;
				vm.affichage_masque_individu = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
				if (vm.nouvelle_element_individu) {
					var indiv = {
							id:data.response ,
							menage_id: vm.selectedItem.id,
							DateNaissance: (individu.DateNaissance),
							Activite: individu.Activite,
							travailleur: individu.travailleur,
							sexe: individu.sexe,
							Nom: individu.Nom
						}
						vm.all_individus.push(indiv);
				} else {
					vm.affichage_masque_individu = false ;
					vm.selectedItem_individu.Nom = vm.individu_masque.Nom  ;
					vm.selectedItem_individu.Activite = vm.individu_masque.Activite   ;
					vm.selectedItem_individu.travailleur = vm.individu_masque.travailleur  ;
					vm.selectedItem_individu.sexe = vm.individu_masque.sexe  ;
					vm.selectedItem_individu.DateNaissance = vm.individu_masque.DateNaissance   ;
				}       
			}).error(function (data) {
				vm.disable_button = false ;
				console.log('erreur '+data);
				vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
			});
		}
    }
  })();

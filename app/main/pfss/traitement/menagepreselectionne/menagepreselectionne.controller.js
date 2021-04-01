(function ()
{
    'use strict';
    angular
        .module('app.pfss.traitement.menagepreselectionne')
        .controller('MenagepreselectionneController', MenagepreselectionneController);

    /** @ngInject */
    function MenagepreselectionneController(apiFactory, $state, $mdDialog, $scope,$cookieStore) {
		var vm = this;
	   vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        responsive: true
      };

      vm.menage_column = [{titre:"Numero d'enregistrement"},{titre:"Chef Ménage"},
      {titre:"Age chef de ménage"},{titre:"Sexe"},{titre:"Addresse"},{titre:"Personne inscrire"},{titre:"Etat envoie"}];
      // vm.menage_column = [{titre:"Numero d'enregistrement"},{titre:"Chef Ménage"},
      // {titre:"Age chef de ménage"},{titre:"Sexe"},{titre:"Addresse"},{titre:"Personne inscrire"},{titre:"Etat envoie"}];
      vm.individu_column = [{titre:"Nom et prénom"},{titre:"Date de naissance"},{titre:"Sexe"},{titre:"Lien de parenté"},{titre:"Scolarisé"},{titre:"Activite"},{titre:"Aptitude"},{titre:"Travailleur"}];
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
        vm.all_sous_projet = [] ;
        vm.all_lienparental = [] ;

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
			apiFactory.getAll("sous_projet/index").then(function(result) { 
				vm.all_sous_projet = result.data.response;    
			});
	  
		});
         apiFactory.getAll("ile/index").then(function(result)
        { 
          vm.all_ile = result.data.response;    
          
        });
         apiFactory.getAll("lienparental/index").then(function(result)
        { 
          vm.all_lienparental = result.data.response;    
          
        });
		// utilitaire
		vm.affiche_sexe = function(parametre) {
			if(parametre==0) {
				return "F";
			} else if(parametre==1){
				return "H";
			} else {
				return "";
			}
        };

      	// utilitaire
     vm.filtre_region = function()
      {
        apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",vm.filtre.id_ile).then(function(result)
        { 
          vm.all_region = result.data.response;   
          vm.filtre.id_region = null ; 
          vm.filtre.id_commune = null ; 
          vm.filtre.village_id = null ; 
          vm.get_max_id_generer_ref();
          
        });

      }

      vm.filtre_commune = function()
      {
        apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtre.id_region).then(function(result)
        { 
          vm.all_commune = result.data.response; 
          vm.filtre.id_commune = null ; 
          vm.filtre.village_id = null ; 
          vm.get_max_id_generer_ref();  
          
        });
      }

      vm.generer_ref = function()
      {
        vm.get_max_id_generer_ref();
      }

      vm.filtre_village = function()
      {
        apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",vm.filtre.id_commune).then(function(result)
        { 
          vm.all_village = result.data.response;    
          vm.filtre.village_id = null ; 
          
          
        });
      }
		apiFactory.getAll("liste_variable/index").then(function(result){
			vm.allRecordsListevariable = result.data.response;
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
				if (vm.filtre.village_id && tab_vil.length > 0) {
					vill = tab_vil.filter(function(obj)	{
						return obj.id == vm.filtre.village_id;
					});
				}
				if (tab_vil) {
					if (tab_vil.length > 0)  {
						if (vm.nouvelle_element) {
							vm.filtre.identifiant_menage = region[0].Code + "/"+reg[0].Code+"/"+ com[0].Code+"/"+vill[0].Code+"/" + (Number(vm.max_id)+1) ;
						}	else {
							vm.filtre.identifiant_menage = region[0].Code + "/"+reg[0].Code+"/"+ com[0].Code+"/"+vill[0].Code+"/" + vm.selectedItem.id ;
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
		vm.ajouter_menage = function() {
			vm.nouvelle_element = true ;
			vm.affichage_masque = true ;
			vm.selectedItem = {} ;
			vm.filtre.DateInscription = new Date();
			// vm.filtre.village_id = null ;
			vm.filtre.NumeroEnregistrement = "" ;
			vm.filtre.identifiant_menage = null ;
			vm.filtre.nomchefmenage = "" ;
			vm.filtre.PersonneInscription = "" ;
			vm.filtre.agechefdemenage = null ;
			vm.filtre.SexeChefMenage = "" ;
			vm.filtre.Addresse = "" ;
			vm.filtre.NumeroCIN = "" ;
			vm.filtre.NumeroCarteElectorale = "" ;
			vm.filtre.datedenaissancechefdemenage = "" ;
			vm.filtre.chef_frequente_ecole = "" ;
			vm.filtre.conjoint_frequente_ecole = "" ;
			vm.filtre.point_inscription = "" ;
			vm.filtre.niveau_instruction_chef = "" ;
			vm.filtre.niveau_instruction_conjoint = "" ;
			vm.filtre.chef_menage_travail = "" ;
			vm.filtre.conjoint_travail = "" ;
			vm.filtre.activite_chef_menage = "" ;
			vm.filtre.activite_conjoint = "" ;
			vm.filtre.id_sous_projet = null ;
			vm.filtre.nom_conjoint = "" ;
			vm.filtre.sexe_conjoint = "" ;
			vm.filtre.age_conjoint = "" ;
			vm.filtre.nin_conjoint = "" ;
			vm.filtre.carte_electorale_conjoint = "" ;
			vm.filtre.telephone_chef_menage = "" ;
			vm.filtre.telephone_conjoint = "" ;
			vm.filtre.nombre_personne_plus_soixantedixans = "" ;
			vm.filtre.taille_menage = "" ;
			vm.filtre.nombre_enfant_moins_quinze_ans = "" ;
			vm.filtre.nombre_enfant_non_scolarise = "" ;
			vm.filtre.nombre_enfant_scolarise = "" ;
			vm.filtre.nombre_enfant_moins_six_ans = "" ;
			vm.filtre.nombre_personne_handicape = "" ;
			vm.filtre.nombre_adulte_travail = "" ;
			vm.filtre.nombre_membre_a_etranger = "" ;
			vm.filtre.maison_non_dure = "" ;
			vm.filtre.acces_electricite = "" ;
			vm.filtre.acces_eau_robinet = "" ;
			vm.filtre.logement_endommage = "" ;
			vm.filtre.niveau_degat_logement = "" ;
			vm.filtre.rehabilitation  = "" ;
			vm.filtre.beneficiaire_autre_programme  = "" ;
			vm.filtre.membre_fonctionnaire  = "" ;
			vm.filtre.antenne_parabolique  = "" ;
			vm.filtre.possede_frigo  = "" ;
			vm.filtre.score_obtenu  = "" ;
			vm.filtre.rang_obtenu  = "" ;
			vm.filtre.statut  = "INSCRIT" ;
			vm.filtre.inapte  = '0' ;
			vm.filtre.NomTravailleur  = "" ;
			vm.filtre.SexeTravailleur  = null ;
			vm.filtre.datedenaissancetravailleur  = new Date() ;
			vm.filtre.agetravailleur  =null  ;
			vm.filtre.NomTravailleurSuppliant  =""  ;
			vm.filtre.SexeTravailleurSuppliant  = null ;
			vm.filtre.datedenaissancesuppliant  = new Date() ;
			vm.filtre.agesuppliant  = null ;
			vm.filtre.quartier  = null ;
			vm.filtre.milieu  = null ;
			vm.filtre.zip  = null ;
			vm.get_max_id_generer_ref();		  
		}
		vm.modifier = function()  {
			vm.nouvelle_element = false ;
			vm.essai={};
			vm.filtre.DateInscription = new Date(vm.selectedItem.DateInscription);
			vm.filtre.village_id = vm.selectedItem.village_id ;
			vm.filtre.nomchefmenage = vm.selectedItem.nomchefmenage ;
			vm.filtre.PersonneInscription = vm.selectedItem.PersonneInscription ;
			vm.filtre.agechefdemenage = parseInt(vm.selectedItem.agechefdemenage) ;
			vm.filtre.SexeChefMenage = vm.selectedItem.SexeChefMenage ;
			vm.filtre.Addresse = vm.selectedItem.Addresse ;

			vm.filtre.NumeroEnregistrement =  vm.selectedItem.NumeroEnregistrement ;
			vm.filtre.identifiant_menage =  vm.selectedItem.identifiant_menage ;
			vm.filtre.NumeroCIN =  vm.selectedItem.NumeroCIN ;
			vm.filtre.NumeroCarteElectorale =  vm.selectedItem.NumeroCarteElectorale ;
			vm.filtre.datedenaissancechefdemenage =  vm.selectedItem.datedenaissancechefdemenage ;
			vm.filtre.chef_frequente_ecole =  vm.selectedItem.chef_frequente_ecole ;
			vm.filtre.conjoint_frequente_ecole =  vm.selectedItem.conjoint_frequente_ecole ;
			vm.filtre.point_inscription =  vm.selectedItem.point_inscription ;
			vm.filtre.niveau_instruction_chef =  vm.selectedItem.niveau_instruction_chef ;
			vm.filtre.niveau_instruction_conjoint =  vm.selectedItem.niveau_instruction_conjoint ;
			vm.filtre.chef_menage_travail =  vm.selectedItem.chef_menage_travail ;
			vm.filtre.conjoint_travail =  vm.selectedItem.conjoint_travail ;
			vm.filtre.activite_chef_menage =  vm.selectedItem.activite_chef_menage ;
			vm.filtre.activite_conjoint =  vm.selectedItem.activite_conjoint ;
			vm.filtre.id_sous_projet =  parseInt(vm.selectedItem.id_sous_projet) ;
			vm.filtre.nom_conjoint =  vm.selectedItem.nom_conjoint ;
			vm.filtre.sexe_conjoint =  vm.selectedItem.sexe_conjoint ;
			vm.filtre.age_conjoint =  parseInt(vm.selectedItem.age_conjoint) ;
			vm.filtre.nin_conjoint =  vm.selectedItem.nin_conjoint ;
			vm.filtre.carte_electorale_conjoint =  vm.selectedItem.carte_electorale_conjoint ;
			vm.filtre.telephone_chef_menage =  vm.selectedItem.telephone_chef_menage ;
			vm.filtre.telephone_conjoint =  vm.selectedItem.telephone_conjoint ;
			vm.filtre.statut  =  vm.selectedItem.statut ;
			vm.filtre.NomTravailleur  =  vm.selectedItem.NomTravailleur ;
			vm.filtre.SexeTravailleur  =  vm.selectedItem.SexeTravailleur ;
			if(vm.selectedItem.datedenaissancetravailleur) {
				vm.filtre.datedenaissancetravailleur  =  new Date(vm.selectedItem.datedenaissancetravailleur) ;
			} else {
				vm.filtre.datedenaissancetravailleur  =  new Date();
			}
			vm.filtre.agetravailleur  =  parseInt(vm.selectedItem.agetravailleur) ;
			vm.filtre.NomTravailleurSuppliant  =  vm.selectedItem.NomTravailleurSuppliant ;
			vm.filtre.SexeTravailleurSuppliant  =  vm.selectedItem.SexeTravailleurSuppliant ;
			if(vm.selectedItem.datedenaissancesuppliant) {
				vm.filtre.datedenaissancesuppliant  =  new Date(vm.selectedItem.datedenaissancesuppliant) ;
			} else {
				vm.filtre.datedenaissancesuppliant  =  new Date();
			}
			vm.filtre.agesuppliant  =  parseInt(vm.selectedItem.agesuppliant) ;
			vm.filtre.quartier  =  vm.selectedItem.quartier ;
			vm.filtre.milieu  =  vm.selectedItem.milieu ;
			vm.filtre.zip  =  vm.selectedItem.zip ;
			if(vm.selectedItem.nombre_personne_plus_soixantedixans)
			vm.filtre.nombre_personne_plus_soixantedixans =  parseInt(vm.selectedItem.nombre_personne_plus_soixantedixans) ;
			if(vm.selectedItem.taille_menage)
			vm.filtre.taille_menage =  parseInt(vm.selectedItem.taille_menage) ;
			if(vm.selectedItem.nombre_enfant_moins_quinze_ans)
			vm.filtre.nombre_enfant_moins_quinze_ans =  parseInt(vm.selectedItem.nombre_enfant_moins_quinze_ans) ;
			if(vm.selectedItem.nombre_enfant_non_scolarise)
			vm.filtre.nombre_enfant_non_scolarise =  parseInt(vm.selectedItem.nombre_enfant_non_scolarise) ;
			if(vm.selectedItem.nombre_enfant_scolarise)
			vm.filtre.nombre_enfant_scolarise =  parseInt(vm.selectedItem.nombre_enfant_scolarise) ;
			if(vm.selectedItem.nombre_enfant_moins_six_ans)
			vm.filtre.nombre_enfant_moins_six_ans =  parseInt(vm.selectedItem.nombre_enfant_moins_six_ans) ;
			if(vm.selectedItem.nombre_personne_handicape)
			vm.filtre.nombre_personne_handicape =  parseInt(vm.selectedItem.nombre_personne_handicape) ;
			if(vm.selectedItem.nombre_adulte_travail)
			vm.filtre.nombre_adulte_travail =  parseInt(vm.selectedItem.nombre_adulte_travail) ;
			if(vm.selectedItem.nombre_membre_a_etranger)
			vm.filtre.nombre_membre_a_etranger =  parseInt(vm.selectedItem.nombre_membre_a_etranger) ;
			if(vm.selectedItem.maison_non_dure)
			vm.filtre.maison_non_dure =  parseInt(vm.selectedItem.maison_non_dure) ;
			if(vm.selectedItem.acces_electricite)
			vm.filtre.acces_electricite =  parseInt(vm.selectedItem.acces_electricite) ;
			if(vm.selectedItem.acces_eau_robinet)
			vm.filtre.acces_eau_robinet =  parseInt(vm.selectedItem.acces_eau_robinet) ;
			if(vm.selectedItem.logement_endommage)
			vm.filtre.logement_endommage =  parseInt(vm.selectedItem.logement_endommage) ;
			if(vm.selectedItem.niveau_degat_logement)
			vm.filtre.niveau_degat_logement =  parseInt(vm.selectedItem.niveau_degat_logement) ;
			if(vm.selectedItem.rehabilitation)
			vm.filtre.rehabilitation  =  parseInt(vm.selectedItem.rehabilitation) ;
			if(vm.selectedItem.beneficiaire_autre_programme)
			vm.filtre.beneficiaire_autre_programme  =  parseInt(vm.selectedItem.beneficiaire_autre_programme) ;
			if(vm.selectedItem.membre_fonctionnaire)
			vm.filtre.membre_fonctionnaire  =  parseInt(vm.selectedItem.membre_fonctionnaire) ;
			if(vm.selectedItem.antenne_parabolique)
			vm.filtre.antenne_parabolique  =  parseInt(vm.selectedItem.antenne_parabolique) ;
			if(vm.selectedItem.possede_frigo)
			vm.filtre.possede_frigo  =  parseInt(vm.selectedItem.possede_frigo) ;
			if(vm.selectedItem.score_obtenu)
			vm.filtre.score_obtenu  =  parseInt(vm.selectedItem.score_obtenu) ;
			if(vm.selectedItem.rang_obtenu)
			vm.filtre.rang_obtenu  =  parseInt(vm.selectedItem.rang_obtenu) ;
			if(vm.selectedItem.inapte) 
			vm.affichage_masque = true ;
			vm.get_max_id_generer_ref();
		}
		vm.modifier_statut = function (etat_statut) {
			if(parseInt(vm.selectedItem.id_sous_projet)>0) {						
				if(etat_statut=='INSCRIT') {
					vm.titre_statut="retourner dans la liste des inscrits "
				} else {
					vm.titre_statut="bénéficier "				
				}
				var temp = "Etes-vous sûr de faire " + vm.titre_statut + " le ménage, " + vm.selectedItem.NumeroEnregistrement + "  chef ménage : " + vm.selectedItem.nomchefmenage + " ?";
				var confirm = $mdDialog.confirm()
					.title(temp)
					.textContent('')
					.ariaLabel('Lucky day')
					.clickOutsideToClose(true)
					.parent(angular.element(document.body))
					.ok('ok')
					.cancel('annuler');

				$mdDialog.show(confirm).then(function() {           
					var config =  {
								headers : {
								  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
									}
								};
					var datas = $.param({    
							  supprimer:0,
							  id: vm.selectedItem.id ,
							  mise_a_jour_statut: 1,
							  statut: etat_statut,
							  menage_id: vm.selectedItem.id,
							  identifiant_menage: vm.filtre.identifiant_menage,
							  id_sous_projet: vm.selectedItem.id_sous_projet,
							  DateInscription: vm.selectedItem.DateInscription,
							});
						vm.filtre.statut=etat_statut;	
					apiFactory.add("menage/index",datas, config).success(function (data)  {
						// Enlever de la liste inscrit
							vm.all_menages = vm.all_menages.filter(function(obj) {
								return obj.id !== vm.selectedItem.id;
							});
							vm.selectedItem={};
						vm.disable_button = false ;
						vm.showAlert("Information",'Enregistrement réussi!');
					}).error(function (data) {
						vm.disable_button = false ;
						console.log('erreur '+data);
						vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
					});         
				}, function() {
				//alert('rien');
				});
			} else {
				vm.showAlert("Information",'Veuillez choisir le sous-projet à affecter à ce ménage !');		
			}	
				
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
			vm.individu_masque={};
			vm.individu_masque.nom = vm.selectedItem_individu.nom ;
			vm.individu_masque.prenom = vm.selectedItem_individu.prenom ;
			vm.individu_masque.aptitude = vm.selectedItem_individu.aptitude ;
			vm.individu_masque.lienparental = vm.selectedItem_individu.lienparental ;
			vm.individu_masque.lien_de_parente = vm.selectedItem_individu.lien_de_parente ;
			vm.individu_masque.sexe = vm.selectedItem_individu.sexe ;
			vm.individu_masque.activite = vm.selectedItem_individu.activite ;
			vm.individu_masque.travailleur = vm.selectedItem_individu.travailleur ;
			vm.individu_masque.scolarise = vm.selectedItem_individu.scolarise ;
			vm.individu_masque.date_naissance = new Date(vm.selectedItem_individu.date_naissance) ;
		}
		vm.generer_ref = function()  {
			vm.get_max_id_generer_ref();
		}
		vm.filtrer = function()	{
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("menage/index","cle_etrangere",vm.filtre.village_id,"statut","PRESELECTIONNE").then(function(result) { 
				vm.all_menages = result.data.response;    
				vm.affiche_load = false ;
			});
		}
		vm.get_individus_by_menage = function(menage_id) {
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("individu/index","cle_etrangere",menage_id).then(function(result) 	{ 
				vm.all_individus =[];
				vm.all_individus = result.data.response; 
				vm.all_individus.forEach(function(obj) {
					vm.lien_de_parente="";
					vm.all_lienparental.forEach(function(lie) {
						if(parseInt(lie.id)==parseInt(obj.lienparental)) {
							vm.lien_de_parente=lie.description;
						}
					});
					obj.lien_de_parente=vm.lien_de_parente;
				});				
				console.log(vm.all_individus);
				vm.affiche_load = false ;
			});
		}
		vm.get_enquete_by_menage = function(menage_id) {			
			apiFactory.getAPIgeneraliserREST("reponse_menage/index","cle_etrangere",menage_id).then(function(result)  { 
				vm.enquete_by_menage = result.data.response;   
				console.log(vm.enquete_by_menage);
				vm.id_type_logement=vm.enquete_by_menage.id_type_logement;
				vm.id_occupation_logement=vm.enquete_by_menage.id_occupation_logement;
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
		
		// Fonction modif lien de parenté
        vm.modifier_lienparental = function (item) { 
			vm.nontrouvee=true;
			vm.all_lienparental.forEach(function(umes) {
				if(parseInt(umes.id)==parseInt(item.lienparental)) {
					item.lienparental = umes.id; 
					item.lien_de_parente=umes.description;
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.acteur.lienparental = null; 
					vm.acteur.lien_de_parente=null;
			}
		}
		
		vm.selection= function (item)  {
			if ((!vm.affiche_load)&&(!vm.affichage_masque))  {
				//vidage tab reponse
				vm.all_individus = [] ;
				//vidage tab reponse
				vm.selectedItem_individu = {} ;//raz individu_selected
				vm.selectedItem = item;
				console.log(vm.selectedItem);
				//get individu
				vm.get_individus_by_menage(item.id);
				vm.charger_detail_reponse_menage(item);
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
				// vm.get_enquete_individu_by_individu(item.id) ;
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
                      village_id: menage.village_id,
                      DateInscription: formatDateBDD(menage.DateInscription),
                      NumeroEnregistrement: menage.NumeroEnregistrement,
                      identifiant_menage: menage.identifiant_menage,
                      nomchefmenage: menage.nomchefmenage,
                      PersonneInscription: menage.PersonneInscription,
                      agechefdemenage: menage.agechefdemenage,
                      SexeChefMenage: menage.SexeChefMenage,
                      Addresse: menage.Addresse,
                      NumeroCIN: menage.NumeroCIN,
                      NumeroCarteElectorale: menage.NumeroCarteElectorale,
                      datedenaissancechefdemenage: menage.datedenaissancechefdemenage,
                      chef_frequente_ecole: menage.chef_frequente_ecole,
                      conjoint_frequente_ecole: menage.conjoint_frequente_ecole,
                      point_inscription: menage.point_inscription,
                      niveau_instruction_chef: menage.niveau_instruction_chef,
                      niveau_instruction_conjoint: menage.niveau_instruction_conjoint,
                      chef_menage_travail: menage.chef_menage_travail,
                      conjoint_travail: menage.conjoint_travail,
                      activite_chef_menage: menage.activite_chef_menage,
                      activite_conjoint: menage.activite_conjoint,
                      id_sous_projet: menage.id_sous_projet,
                      nom_conjoint: menage.nom_conjoint,
                      sexe_conjoint: menage.sexe_conjoint,
                      age_conjoint: menage.age_conjoint,
                      nin_conjoint: menage.nin_conjoint,
                      carte_electorale_conjoint: menage.carte_electorale_conjoint,
                      telephone_chef_menage: menage.telephone_chef_menage,
                      telephone_conjoint: menage.telephone_conjoint,
                      nombre_personne_plus_soixantedixans: menage.nombre_personne_plus_soixantedixans,
                      taille_menage: menage.taille_menage,
                      nombre_enfant_moins_quinze_ans: menage.nombre_enfant_moins_quinze_ans,
                      nombre_enfant_non_scolarise: menage.nombre_enfant_non_scolarise,
                      nombre_enfant_scolarise: menage.nombre_enfant_scolarise,
                      nombre_enfant_moins_six_ans: menage.nombre_enfant_moins_six_ans,
                      nombre_personne_handicape: menage.nombre_personne_handicape,
                      nombre_adulte_travail: menage.nombre_adulte_travail,
                      nombre_membre_a_etranger: menage.nombre_membre_a_etranger,
                      maison_non_dure: menage.maison_non_dure,
                      acces_electricite: menage.acces_electricite,
                      acces_eau_robinet: menage.acces_eau_robinet,
                      logement_endommage: menage.logement_endommage,
                      niveau_degat_logement: menage.niveau_degat_logement,
                      rehabilitation: menage.rehabilitation,
                      beneficiaire_autre_programme: menage.beneficiaire_autre_programme,
                      membre_fonctionnaire: menage.membre_fonctionnaire,
                      antenne_parabolique: menage.antenne_parabolique,
                      possede_frigo: menage.possede_frigo,
                      score_obtenu: menage.score_obtenu,
                      rang_obtenu: menage.rang_obtenu,
                      NomTravailleur: menage.NomTravailleur,
                      SexeTravailleur: menage.SexeTravailleur,
                      datedenaissancetravailleur: formatDateBDD(menage.datedenaissancetravailleur),
                      agetravailleur: menage.agetravailleur,
                      NomTravailleurSuppliant: menage.NomTravailleurSuppliant,
                      SexeTravailleurSuppliant: menage.SexeTravailleurSuppliant,
                      datedenaissancesuppliant: formatDateBDD(menage.datedenaissancesuppliant),
                      agesuppliant: menage.agesuppliant,
                      quartier: menage.quartier,
                      milieu: menage.milieu,
                      zip: menage.zip,
                      statut: menage.statut,
                      inapte: menage.inapte,
                                                 
                    });
			apiFactory.add("menage/index",datas, config).success(function (data) {
				vm.affichage_masque = false ;
				vm.disable_button = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
				if (vm.nouvelle_element) {
					var mng={
						id : data.response ,
						village_id: menage.village_id,
						DateInscription: (menage.DateInscription),
						NumeroEnregistrement: menage.NumeroEnregistrement,
						identifiant_menage: menage.identifiant_menage,
						nomchefmenage: menage.nomchefmenage,
						PersonneInscription: menage.PersonneInscription,
						agechefdemenage: menage.agechefdemenage,
						SexeChefMenage: menage.SexeChefMenage,
						Addresse: menage.Addresse,
						NumeroCIN: menage.NumeroCIN,
						NumeroCarteElectorale: menage.NumeroCarteElectorale,
						datedenaissancechefdemenage: menage.datedenaissancechefdemenage,
						chef_frequente_ecole: menage.chef_frequente_ecole,
						conjoint_frequente_ecole: menage.conjoint_frequente_ecole,
						point_inscription: menage.point_inscription,
						niveau_instruction_chef: menage.niveau_instruction_chef,
						niveau_instruction_conjoint: menage.niveau_instruction_conjoint,
						chef_menage_travail: menage.chef_menage_travail,
						conjoint_travail: menage.conjoint_travail,
						activite_chef_menage: menage.activite_chef_menage,
						activite_conjoint: menage.activite_conjoint,
						id_sous_projet: menage.id_sous_projet,
						nom_conjoint: menage.nom_conjoint,
						sexe_conjoint: menage.sexe_conjoint,
						age_conjoint: menage.age_conjoint,
						nin_conjoint: menage.nin_conjoint,
						carte_electorale_conjoint: menage.carte_electorale_conjoint,
						telephone_chef_menage: menage.telephone_chef_menage,
						telephone_conjoint: menage.telephone_conjoint,
						nombre_personne_plus_soixantedixans: menage.nombre_personne_plus_soixantedixans,
						taille_menage: menage.taille_menage,
						nombre_enfant_moins_quinze_ans: menage.nombre_enfant_moins_quinze_ans,
						nombre_enfant_non_scolarise: menage.nombre_enfant_non_scolarise,
						nombre_enfant_scolarise: menage.nombre_enfant_scolarise,
						nombre_enfant_moins_six_ans: menage.nombre_enfant_moins_six_ans,
						nombre_personne_handicape: menage.nombre_personne_handicape,
						nombre_adulte_travail: menage.nombre_adulte_travail,
						nombre_membre_a_etranger: menage.nombre_membre_a_etranger,
						acces_electricite: menage.acces_electricite,
						acces_eau_robinet: menage.acces_eau_robinet,
						logement_endommage: menage.logement_endommage,
						niveau_degat_logement: menage.niveau_degat_logement,
						rehabilitation: menage.rehabilitation,
						beneficiaire_autre_programme: menage.beneficiaire_autre_programme,
						membre_fonctionnaire: menage.membre_fonctionnaire,
						antenne_parabolique: menage.antenne_parabolique,
						possede_frigo: menage.possede_frigo,
						score_obtenu: menage.score_obtenu,
						rang_obtenu: menage.rang_obtenu,
						statut: menage.statut,
						NomTravailleur: menage.NomTravailleur,
						SexeTravailleur: menage.SexeTravailleur,
						datedenaissancetravailleur: menage.datedenaissancetravailleur,
						agetravailleur: menage.agetravailleur,
						NomTravailleurSuppliant: menage.NomTravailleurSuppliant,
						SexeTravailleurSuppliant: menage.SexeTravailleurSuppliant,
						datedenaissancesuppliant: menage.datedenaissancesuppliant,
						agesuppliant: menage.agesuppliant,
						quartier: menage.quartier,
						milieu: menage.milieu,
						zip: menage.zip,
						inapte: menage.inapte,
					}
						   console.log(menage);
					vm.all_menages.push(mng) ;
				} else {
					vm.affichage_masque_individu = false ;
					vm.selectedItem.DateInscription =  vm.filtre.DateInscription ;
					vm.selectedItem.village_id = vm.filtre.village_id  ;
					vm.selectedItem.NumeroEnregistrement = vm.filtre.NumeroEnregistrement  ;
					vm.selectedItem.identifiant_menage = vm.filtre.identifiant_menage  ;
					vm.selectedItem.nomchefmenage = vm.filtre.nomchefmenage  ;
					vm.selectedItem.PersonneInscription = vm.filtre.PersonneInscription  ;
					vm.selectedItem.agechefdemenage = vm.filtre.agechefdemenage  ;
					vm.selectedItem.SexeChefMenage = vm.filtre.SexeChefMenage  ;
					vm.selectedItem.Addresse = vm.filtre.Addresse  ;
					vm.selectedItem.NumeroCIN = vm.filtre.NumeroCIN  ;
					vm.selectedItem.NumeroCarteElectorale = vm.filtre.NumeroCarteElectorale  ;
					vm.selectedItem.datedenaissancechefdemenage = vm.filtre.datedenaissancechefdemenage  ;
					vm.selectedItem.chef_frequente_ecole = vm.filtre.chef_frequente_ecole  ;
					vm.selectedItem.conjoint_frequente_ecole = vm.filtre.conjoint_frequente_ecole  ;
					vm.selectedItem.point_inscription = vm.filtre.point_inscription  ;
					vm.selectedItem.niveau_instruction_chef = vm.filtre.niveau_instruction_chef  ;
					vm.selectedItem.niveau_instruction_conjoint = vm.filtre.niveau_instruction_conjoint  ;
					vm.selectedItem.chef_menage_travail = vm.filtre.chef_menage_travail  ;
					vm.selectedItem.conjoint_travail = vm.filtre.conjoint_travail  ;
					vm.selectedItem.activite_chef_menage = vm.filtre.activite_chef_menage  ;
					vm.selectedItem.activite_conjoint = vm.filtre.activite_conjoint  ;
					vm.selectedItem.id_sous_projet = vm.filtre.id_sous_projet  ;
					vm.selectedItem.nom_conjoint = vm.filtre.nom_conjoint  ;
					vm.selectedItem.sexe_conjoint = vm.filtre.sexe_conjoint  ;
					vm.selectedItem.age_conjoint = vm.filtre.age_conjoint  ;
					vm.selectedItem.nin_conjoint = vm.filtre.nin_conjoint  ;
					vm.selectedItem.carte_electorale_conjoint = vm.filtre.carte_electorale_conjoint  ;
					vm.selectedItem.telephone_chef_menage = vm.filtre.telephone_chef_menage  ;
					vm.selectedItem.telephone_conjoint = vm.filtre.telephone_conjoint  ;
					vm.selectedItem.nombre_personne_plus_soixantedixans = vm.filtre.nombre_personne_plus_soixantedixans  ;
					vm.selectedItem.taille_menage = vm.filtre.taille_menage  ;
					vm.selectedItem.nombre_enfant_moins_quinze_ans = vm.filtre.nombre_enfant_moins_quinze_ans  ;
					vm.selectedItem.nombre_enfant_non_scolarise = vm.filtre.nombre_enfant_non_scolarise  ;
					vm.selectedItem.nombre_enfant_scolarise = vm.filtre.nombre_enfant_scolarise  ;
					vm.selectedItem.nombre_enfant_moins_six_ans = vm.filtre.nombre_enfant_moins_six_ans  ;
					vm.selectedItem.nombre_personne_handicape = vm.filtre.nombre_personne_handicape  ;
					vm.selectedItem.nombre_adulte_travail = vm.filtre.nombre_adulte_travail  ;
					vm.selectedItem.nombre_membre_a_etranger = vm.filtre.nombre_membre_a_etranger  ;
					vm.selectedItem.acces_electricite = vm.filtre.acces_electricite  ;
					vm.selectedItem.acces_eau_robinet = vm.filtre.acces_eau_robinet  ;
					vm.selectedItem.logement_endommage = vm.filtre.logement_endommage  ;
					vm.selectedItem.niveau_degat_logement = vm.filtre.niveau_degat_logement  ;
					vm.selectedItem.rehabilitation = vm.filtre.rehabilitation  ;
					vm.selectedItem.beneficiaire_autre_programme = vm.filtre.beneficiaire_autre_programme  ;
					vm.selectedItem.membre_fonctionnaire = vm.filtre.membre_fonctionnaire  ;
					vm.selectedItem.antenne_parabolique = vm.filtre.antenne_parabolique  ;
					vm.selectedItem.possede_frigo = vm.filtre.possede_frigo  ;
					vm.selectedItem.score_obtenu = vm.filtre.score_obtenu  ;
					vm.selectedItem.rang_obtenu = vm.filtre.rang_obtenu  ;
					vm.selectedItem.inapte = vm.filtre.inapte  ;
					vm.selectedItem.statut = vm.filtre.statut  ;
					vm.selectedItem.NomTravailleur = vm.filtre.NomTravailleur  ;
					vm.selectedItem.SexeTravailleur = vm.filtre.SexeTravailleur  ;
					vm.selectedItem.datedenaissancetravailleur = vm.filtre.datedenaissancetravailleur  ;
					vm.selectedItem.agetravailleur = vm.filtre.agetravailleur  ;
					vm.selectedItem.NomTravailleurSuppliant = vm.filtre.NomTravailleurSuppliant  ;
					vm.selectedItem.SexeTravailleurSuppliant = vm.filtre.SexeTravailleurSuppliant  ;
					vm.selectedItem.datedenaissancesuppliant = vm.filtre.datedenaissancesuppliant  ;
					vm.selectedItem.agesuppliant = vm.filtre.agesuppliant  ;
					vm.selectedItem.quartier = vm.filtre.quartier  ;
					vm.selectedItem.milieu = vm.filtre.milieu  ;
					vm.selectedItem.zip = vm.filtre.zip  ;
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
                      date_naissance: formatDateBDD(individu.date_naissance),
                      activite: individu.activite,
                      travailleur: individu.travailleur,
                      sexe: individu.sexe,
                      nom: individu.nom,
                      prenom: individu.prenom,
                      lienparental: individu.lienparental,
                      aptitude: individu.aptitude,
                      scolarise: individu.scolarise,
                      a_ete_modifie: 0,
                    
                                                 
                    });
			apiFactory.add("individu/index",datas, config).success(function (data) {
				vm.disable_button = false ;
				vm.affichage_masque_individu = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
				if (vm.nouvelle_element_individu) {
					var indiv = {
							id:data.response ,
							menage_id: vm.selectedItem.id,
							date_naissance: (individu.date_naissance),
							activite: individu.activite,
							travailleur: individu.travailleur,
							sexe: individu.sexe,
							nom: individu.nom,
							prenom: individu.prenom,
							lienparental: individu.lienparental,
							lien_de_parente: individu.lien_de_parente,
							aptitude: individu.aptitude,
							scolarise: individu.scolarise,
							a_ete_modifie: 0,
						}
						vm.all_individus.push(indiv);
				} else {
					vm.affichage_masque_individu = false ;
					vm.selectedItem_individu.nom = vm.individu_masque.nom  ;
					vm.selectedItem_individu.prenom = vm.individu_masque.prenom  ;
					vm.selectedItem_individu.lienparental = vm.individu_masque.lienparental  ;
					vm.selectedItem_individu.lien_de_parente = vm.individu_masque.lien_de_parente  ;
					vm.selectedItem_individu.aptitude = vm.individu_masque.aptitude  ;
					vm.selectedItem_individu.activite = vm.individu_masque.activite   ;
					vm.selectedItem_individu.travailleur = vm.individu_masque.travailleur  ;
					vm.selectedItem_individu.sexe = vm.individu_masque.sexe  ;
					vm.selectedItem_individu.date_naissance = vm.individu_masque.date_naissance   ;
					vm.selectedItem_individu.scolarise = vm.individu_masque.scolarise   ;
					vm.selectedItem_individu.a_ete_modifie = 0;
				}       
			}).error(function (data) {
				vm.disable_button = false ;
				console.log('erreur '+data);
				vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
			});
		}
		vm.charger_detail_reponse_menage= function(item) {
				vm.affiche_load=true;
				apiFactory.getAPIgeneraliser("reponse_menage/index","cle_etrangere",vm.selectedItem.id).then(function(result) {
					console.log(result.data.response);
					item.detail_reponse_menage_multiple = result.data.response.variable_choix_multiple; 
					item.detail_reponse_menage_unique = result.data.response.variable_choix_unique; 
					vm.selectedItem.detail_reponse_menage_multiple = result.data.response.variable_choix_multiple; 
					vm.selectedItem.detail_reponse_menage_unique = result.data.response.variable_choix_unique; 
					vm.menage_prevu=result.data.response.menage_prevu;
					vm.individu_prevu=result.data.response.individu_prevu;
					vm.groupe_prevu=result.data.response.groupe_prevu;
					if(parseInt(vm.menage_prevu)==1) {
						vm.afficher_cible="MENAGE";
					} else if(parseInt(vm.individu_prevu)==1) {
						vm.afficher_cible="INDIVIDU";
					} else {
						vm.afficher_cible="GROUPE";
					}
					vm.tab_reponse_variable=[];
					vm.choix_unique=[];
					if(item.detail_reponse_menage_multiple.length >0 || item.detail_reponse_menage_unique.length >0) {
						vm.tab_reponse_variable = result.data.response.variable_choix_multiple; 
						vm.choix_unique=result.data.response.variable_choix_unique;
						vm.id_enquete_menage=1;
					} else {
						vm.id_enquete_menage=1;
					}
					item.detail_variable_charge=1;
					vm.selectedItem.detail_variable_charge=1;
					if(vm.selectedItem.nombre_personne_plus_soixantedixans)
					vm.filtre.nombre_personne_plus_soixantedixans =  parseInt(vm.selectedItem.nombre_personne_plus_soixantedixans) ;
					if(vm.selectedItem.taille_menage)
					vm.filtre.taille_menage =  parseInt(vm.selectedItem.taille_menage) ;
					if(vm.selectedItem.nombre_enfant_moins_quinze_ans)
					vm.filtre.nombre_enfant_moins_quinze_ans =  parseInt(vm.selectedItem.nombre_enfant_moins_quinze_ans) ;
					if(vm.selectedItem.nombre_enfant_non_scolarise)
					vm.filtre.nombre_enfant_non_scolarise =  parseInt(vm.selectedItem.nombre_enfant_non_scolarise) ;
					if(vm.selectedItem.nombre_enfant_scolarise)
					vm.filtre.nombre_enfant_scolarise =  parseInt(vm.selectedItem.nombre_enfant_scolarise) ;
					if(vm.selectedItem.nombre_enfant_moins_six_ans)
					vm.filtre.nombre_enfant_moins_six_ans =  parseInt(vm.selectedItem.nombre_enfant_moins_six_ans) ;
					if(vm.selectedItem.nombre_personne_handicape)
					vm.filtre.nombre_personne_handicape =  parseInt(vm.selectedItem.nombre_personne_handicape) ;
					if(vm.selectedItem.nombre_adulte_travail)
					vm.filtre.nombre_adulte_travail =  parseInt(vm.selectedItem.nombre_adulte_travail) ;
					if(vm.selectedItem.nombre_membre_a_etranger)
					vm.filtre.nombre_membre_a_etranger =  parseInt(vm.selectedItem.nombre_membre_a_etranger) ;
					if(vm.selectedItem.maison_non_dure)
					vm.filtre.maison_non_dure =  parseInt(vm.selectedItem.maison_non_dure) ;
					if(vm.selectedItem.acces_electricite)
					vm.filtre.acces_electricite =  parseInt(vm.selectedItem.acces_electricite) ;
					if(vm.selectedItem.acces_eau_robinet)
					vm.filtre.acces_eau_robinet =  parseInt(vm.selectedItem.acces_eau_robinet) ;
					if(vm.selectedItem.logement_endommage)
					vm.filtre.logement_endommage =  parseInt(vm.selectedItem.logement_endommage) ;
					if(vm.selectedItem.niveau_degat_logement)
					vm.filtre.niveau_degat_logement =  parseInt(vm.selectedItem.niveau_degat_logement) ;
					if(vm.selectedItem.rehabilitation)
					vm.filtre.rehabilitation  =  parseInt(vm.selectedItem.rehabilitation) ;
					if(vm.selectedItem.beneficiaire_autre_programme)
					vm.filtre.beneficiaire_autre_programme  =  parseInt(vm.selectedItem.beneficiaire_autre_programme) ;
					if(vm.selectedItem.membre_fonctionnaire)
					vm.filtre.membre_fonctionnaire  =  parseInt(vm.selectedItem.membre_fonctionnaire) ;
					if(vm.selectedItem.antenne_parabolique)
					vm.filtre.antenne_parabolique  =  parseInt(vm.selectedItem.antenne_parabolique) ;
					if(vm.selectedItem.possede_frigo)
					vm.filtre.possede_frigo  =  parseInt(vm.selectedItem.possede_frigo) ;
					if(vm.selectedItem.score_obtenu)
					vm.filtre.score_obtenu  =  parseInt(vm.selectedItem.score_obtenu) ;
					if(vm.selectedItem.rang_obtenu)
					vm.filtre.rang_obtenu  =  parseInt(vm.selectedItem.rang_obtenu) ;
					if(vm.selectedItem.inapte)
					vm.filtre.inapte  =  parseInt(vm.selectedItem.inapte) ;
					vm.affiche_load=false;
				})
		}	
		// DEBUT DIFFRENTES FONCTIONS UTILES POUR LA SAUVEGARDE VARIABLE INTERVENTION
		vm.sauvegarder_reponse_menage=function(id_intervention) {
			if(id_intervention && parseInt(id_intervention) >0) {
				// Double sauvegarde : menage et reponse_menage
				// Stocker dans une variable texte temporaire : txtTmp les valeurs à poster ultérieurement
				// Tableau détail variable intervention : vm.tab_reponse_variable et vm.choix_unique à stocker dans des variables indexées id_variable_(index)
				// Puis on utilise la fonction eval afin que l'on puisse poster normalement txtTmp
				// C'est une façon de contourner la récupération impossible de variable tableau dans le serveur PHP	
				vm.nombre_reponse_menage_choix_multiple = vm.tab_reponse_variable.length; // nombre valeur selectionnée multiple
				vm.nombre_reponse_menage_choix_unique = 0; // nombre valeur selectionnée unique
				var intitule_intervention = vm.selectedItem.intitule;
				var txtTmp="";
				// Début réponse table menage
				txtTmp += "id_menage" +":\"" + vm.selectedItem.id + "\",";
				txtTmp += "nombre_personne_plus_soixantedixans" +":\"" + vm.filtre.nombre_personne_plus_soixantedixans + "\",";
				txtTmp += "taille_menage" +":\"" + vm.filtre.taille_menage + "\",";
				txtTmp += "nombre_enfant_moins_quinze_ans" +":\"" + vm.filtre.nombre_enfant_moins_quinze_ans + "\",";
				txtTmp += "nombre_enfant_non_scolarise" +":\"" + vm.filtre.nombre_enfant_non_scolarise + "\",";
				txtTmp += "nombre_enfant_scolarise" +":\"" + vm.filtre.nombre_enfant_scolarise + "\",";
				txtTmp += "nombre_enfant_moins_six_ans" +":\"" + vm.filtre.nombre_enfant_moins_six_ans + "\",";
				txtTmp += "nombre_personne_handicape" +":\"" + vm.filtre.nombre_personne_handicape + "\",";
				txtTmp += "nombre_adulte_travail" +":\"" + vm.filtre.nombre_adulte_travail + "\",";
				txtTmp += "nombre_membre_a_etranger" +":\"" + vm.filtre.nombre_membre_a_etranger + "\",";
				txtTmp += "maison_non_dure" +":\"" + vm.filtre.maison_non_dure + "\",";
				txtTmp += "acces_electricite" +":\"" + vm.filtre.acces_electricite + "\",";
				txtTmp += "acces_eau_robinet" +":\"" + vm.filtre.acces_eau_robinet + "\",";
				txtTmp += "logement_endommage" +":\"" + vm.filtre.logement_endommage + "\",";
				txtTmp += "niveau_degat_logement" +":\"" + vm.filtre.niveau_degat_logement + "\",";
				txtTmp += "rehabilitation" +":\"" + vm.filtre.rehabilitation + "\",";
				txtTmp += "beneficiaire_autre_programme" +":\"" + vm.filtre.beneficiaire_autre_programme + "\",";
				txtTmp += "membre_fonctionnaire" +":\"" + vm.filtre.membre_fonctionnaire + "\",";
				txtTmp += "antenne_parabolique" +":\"" + vm.filtre.antenne_parabolique + "\",";
				txtTmp += "possede_frigo" +":\"" + vm.filtre.possede_frigo + "\",";
				txtTmp += "score_obtenu" +":\"" + vm.filtre.score_obtenu + "\",";
				txtTmp += "rang_obtenu" +":\"" + vm.filtre.rang_obtenu + "\",";
				txtTmp += "inapte" +":\"" + vm.filtre.inapte + "\",";
				// Fin réponse table menage
				// Début réponse table reponse_menage : choix unique/multiple
				txtTmp += "id_intervention" +":\"" + id_intervention + "\",";	
				txtTmp += "intitule_intervention" +":\"" + intitule_intervention + "\",";	
				txtTmp += "nombre_reponse_menage_choix_multiple" +":\"" + vm.nombre_reponse_menage_choix_multiple + "\",";	
				for(var i=0;i < vm.nombre_reponse_menage_choix_multiple;i++) {
					txtTmp += "id_variable_" + (i+1) + ":\"" + vm.tab_reponse_variable[i] + "\",";	
				}
				var iteration=1;
				angular.forEach(vm.choix_unique, function(value, key)  { 
					txtTmp += "id_liste_variable_" + iteration + ":\"" + key + "\",";
					txtTmp += "id_variable_unique_" + iteration + ":\"" + value + "\",";
					iteration=iteration + 1;	
				});				
				vm.nombre_reponse_menage_choix_unique =iteration; // nombre valeur selectionnée unique
				txtTmp += "nombre_reponse_menage_choix_unique" +":\"" + (iteration - 1) + "\",";	
				var donnees = $.param(eval('({' + txtTmp + '})'));
				var config = {
					headers : {
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
					}
				};
				apiFactory.add("reponse_menage/index",donnees, config).success(function (data) {
					// Ecraser les valeurs dans vm.selectedItem 
					vm.selectedItem.detail_reponse_menage_multiple = []; 
					vm.selectedItem.detail_reponse_menage_unique = []; 	
					vm.selectedItem.detail_reponse_menage_multiple = data.response.variable_choix_multiple; 
					vm.selectedItem.detail_reponse_menage_unique = data.response.variable_choix_unique; 
					vm.menage_prevu=data.response.menage_prevu;
					vm.individu_prevu=data.response.individu_prevu;
					vm.groupe_prevu=data.response.groupe_prevu;
					if(parseInt(vm.menage_prevu)==1) {
						vm.afficher_cible="MENAGE";
					} else if(parseInt(vm.individu_prevu)==1) {
						vm.afficher_cible="INDIVIDU";
					} else {
						vm.afficher_cible="GROUPE";
					}
					vm.selectedItem.detail_charge=1;
					vm.showAlert("INFORMATION","Réponse ménage sauvegardé avec succès");
					//add historique : suppresion/modifcation/ajout DDB Annuaire : variable d'intervention
					var datas = $.param({
						action:data.response.message_retour,
						id_utilisateur:vm.id_utilisateur
					});
					//factory historique_utilisateur
					apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
					});							
				}).error(function (data) {
					vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
				});  
			} else {
				vm.showAlert("Erreur lors de la sauvegarde","Veuillez choisir le ménage correspondant aux différents choix !");
			}	
		}
		vm.ModifierChoixUnique=function() {
			if(vm.choix_unique.length >0) {
				angular.forEach(vm.choix_unique, function(value, key)  { 
					if(parseInt(value)==1) {
						vm.afficher_cible="MENAGE";
						vm.menage_prevu = 1;
					} else if(parseInt(value)==2) {
						vm.afficher_cible="INDIVIDU";
						vm.individu_prevu = 1;
					} else if(parseInt(value)==3) {
						vm.afficher_cible="GROUPE";
						vm.groupe_prevu = 1;
					}		
				});				
			}
		}		
		// FIN DIFFRENTES FONCTIONS UTILES POUR LA SAUVEGARDE VARIABLE INTERVENTION

	}
  })();

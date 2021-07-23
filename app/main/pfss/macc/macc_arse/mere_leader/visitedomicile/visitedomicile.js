(function ()
{
    'use strict';

    angular
        .module('app.pfss.macc.macc_arse.mere_leader.visitedomicile')
        .controller('VisitedomicileController', VisitedomicileController);
    /** @ngInject */
    function VisitedomicileController($mdDialog, $scope, apiFactory, $state,$cookieStore)  {
		var vm = this;
	   vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        responsive: true
      };

      vm.visite_domicile_column = [{titre:"N°"},{titre:"Visite 1"},{titre:"Raison visite"},{titre:"Ménage visité"},{titre:"Objet"},{titre:"Nom ML/PL"},
	  {titre:"Visite 2"},{titre:"Résultat"},{titre:"Récommandation"}];
      //initialisation variable
		vm.currentItem = {};
        vm.affiche_load = false ;
        vm.selectedItem = {} ;
 		
		vm.all_menages =[];
		vm.all_groupe_mlpl =[];
        vm.all_visite_domicile = [] ;
		vm.all_raison_visite_domicile=[];
       vm.nouvelle_element = false ;
        vm.affichage_masque = false ;
        vm.date_now = new Date() ;
		vm.tab_reponse_visite=[];
		vm.tab_reponse_menage_visite=[];
        vm.disable_button = false ;
      //initialisation variable

      //chargement clé etrangère et données de bases
        vm.id_user_cookies = $cookieStore.get('id');
		apiFactory.getOne("utilisateurs/index",vm.id_user_cookies).then(function(result) { 
			vm.user = result.data.response;
			apiFactory.getTable("enquete_menage/index","raison_visite_domicile").then(function(result){
				vm.all_raison_visite_domicile = result.data.response;    
			});
		});
         apiFactory.getAll("ile/index").then(function(result)
        { 
          vm.all_ile = result.data.response;    
          
        });
		// utilitaire
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
			vm.filtre.id_groupe_ml_pl = null ; 
			vm.all_village.forEach(function(vil) {
				if(parseInt(vil.id)==parseInt(vm.filtre.village_id)) {
					vm.filtre.village = vil.Village; 
					vm.filtre.vague=vil.vague;
					vm.filtre.zip=vil.id_zip;
				}
			});			
        });
      }
		vm.filtrer = function()	{
			vm.all_visite_domicile = [];
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("menage/index","cle_etrangere",vm.filtre.village_id,"statut","BENEFICIAIRE").then(function(result) { 				
				vm.all_menages = result.data.response;    
				apiFactory.getAPIgeneraliserREST("visite_domicile/index","cle_etrangere",vm.filtre.id_groupe_ml_pl).then(function(result) { 				
					vm.all_visite_domicile = result.data.response;    
					vm.affiche_load = false ;
					var msg ="Aucune visite à domicile dans le village de  " +vm.filtre.village  + ". Merci !";	
					if(result.data.response.length==0) {
						vm.showAlert("INFORMATION",msg);
					}	
				});
			});
		}
		// Début Fonction Groupe ML/PL	
		vm.save_visite_domicile = function(groupe_mlpl,suppression) {
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
                      numero: groupe_mlpl.numero,
                      date_visite1: formatDateBDD(groupe_mlpl.date_visite1),
                      objet_visite: groupe_mlpl.objet_visite,
                      nom_prenom_mlpl: groupe_mlpl.nom_prenom_mlpl,
                      //date_visite2: formatDateBDD(groupe_mlpl.date_visite2),
                      resultat_visite: groupe_mlpl.resultat_visite,
                      recommandation: groupe_mlpl.recommandation,
                    });
				// Stocker dans une variable texte temporaire : txtTmp les valeurs à poster ultérieurement
				// Tableau détail  : vm.tab_reponse_menage_visite et vm.tab_reponse_visite à stocker dans des variables indexées id_variable_(index)
				// Puis on utilise la fonction eval afin que l'on puisse poster normalement txtTmp
				// C'est une façon de contourner la récupération impossible de variable tableau dans le serveur PHP	
				vm.nombre_menage_visite = vm.tab_reponse_menage_visite.length; // nombre ménage visité
				vm.nombre_raison_visite = vm.tab_reponse_visite.length; // nombre raison visite
				var intitule_intervention = vm.selectedItem.intitule;
				var txtTmp="";
				// Début table visite domicile
				txtTmp += "supprimer" +":\"" + suppression + "\",";
				txtTmp += "id" +":\"" + id_mng + "\",";
				txtTmp += "id_groupe_ml_pl" +":\"" + vm.filtre.id_groupe_ml_pl + "\",";
				txtTmp += "numero" +":\"" + vm.filtre.numero + "\",";
				txtTmp += "date_visite1" +":\"" + formatDateBDD(vm.filtre.date_visite1) + "\",";
				txtTmp += "objet_visite" +":\"" + vm.filtre.objet_visite + "\",";
				txtTmp += "nom_prenom_mlpl" +":\"" + vm.filtre.nom_prenom_mlpl + "\",";
				//txtTmp += "date_visite2" +":\"" + formatDateBDD(vm.filtre.date_visite2) + "\",";
				txtTmp += "resultat_visite" +":\"" + vm.filtre.resultat_visite + "\",";
				txtTmp += "recommandation" +":\"" + vm.filtre.recommandation + "\",";
				// Fin  table visite domicile
				// Début réponse table visite_raison et menage_visite : choix multiple
				txtTmp += "nombre_menage_visite" +":\"" + vm.nombre_menage_visite + "\",";	
				txtTmp += "nombre_raison_visite" +":\"" + vm.nombre_raison_visite + "\",";	
				for(var i=0;i < vm.nombre_menage_visite;i++) {
					txtTmp += "id_menage_" + (i+1) + ":\"" + vm.tab_reponse_menage_visite[i] + "\",";	
				}
				for(var i=0;i < vm.nombre_raison_visite;i++) {
					txtTmp += "id_raison_visite_domicile_" + (i+1) + ":\"" + vm.tab_reponse_visite[i] + "\",";	
				}
				txtTmp = txtTmp.replace(new RegExp('\'', 'g'),'\\\'');
				txtTmp = txtTmp.replace(new RegExp('(\r\n|\r|\n)', 'g'),'');
				var donnees = $.param(eval('({' + txtTmp + '})'));
			apiFactory.add("visite_domicile/index",donnees, config).success(function (data) {
				vm.affichage_masque = false ;
				vm.disable_button = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
				if (vm.nouvelle_element) {
					var mng={
						id : data.response ,
						id_groupe_ml_pl: groupe_mlpl.id_groupe_ml_pl,
						numero: groupe_mlpl.numero,
						date_visite1: formatDateBDD(groupe_mlpl.date_visite1),
						objet_visite: groupe_mlpl.objet_visite,
						nom_prenom_mlpl: groupe_mlpl.nom_prenom_mlpl,
						//date_visite2: vm.formatDateListe(groupe_mlpl.date_visite2),
						resultat_visite: groupe_mlpl.resultat_visite,
						recommandation: groupe_mlpl.recommandation,
						identifiant_menage: groupe_mlpl.identifiant_menage,
						nomchefmenage: groupe_mlpl.nomchefmenage,
						menage_visite: data.donnees_retour.menage_visite,
						raison_visite: data.donnees_retour.raison_visite,
					}
					vm.all_visite_domicile.push(mng) ;
				} else {
					if(parseInt(suppression)==1) {
						vm.all_visite_domicile = vm.all_visite_domicile.filter(function(obj) {
							return obj.id != groupe_mlpl.id;
						});						 
						vm.selectedItem={};
					} else {
						vm.affichage_masque_liste_mlpl = false ;
						vm.selectedItem.date_visite1 =  vm.filtre.date_visite1 ;
						vm.selectedItem.id_groupe_ml_pl = vm.filtre.id_groupe_ml_pl  ;
						vm.selectedItem.numero = vm.filtre.numero  ;
						vm.selectedItem.objet_visite = vm.filtre.objet_visite  ;
						vm.selectedItem.nom_prenom_mlpl = vm.filtre.nom_prenom_mlpl  ;
						//vm.selectedItem.date_visite2 = vm.filtre.date_visite2  ;
						vm.selectedItem.resultat_visite = vm.filtre.resultat_visite  ;
						vm.selectedItem.recommandation = vm.filtre.recommandation  ;
						vm.selectedItem.identifiant_menage = vm.filtre.identifiant_menage  ;
						vm.selectedItem.nomchefmenage = vm.filtre.nomchefmenage  ;
						vm.selectedItem.menage_visite = data.donnees_retour.menage_visite  ;
						vm.selectedItem.raison_visite = data.donnees_retour.raison_visite  ;
						vm.selectedItem={};
					}	
  				}      
			}).error(function (data) {
				vm.disable_button = false ;
				console.log('erreur '+data);
				vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
			}); 
		}
		vm.deselection= function (item)
		{
			item.$selected = false;
			vm.selectedItem = {};
		}
		vm.selection= function (item)
		{
			if ((!vm.affiche_load)&&(!vm.affichage_masque))
			{
				vm.selectedItem = item;
				apiFactory.getAPIgeneraliserREST("visite_domicile_raison/index","cle_etrangere",vm.selectedItem.id).then(function(result) {
					vm.tab_reponse_visite=result.data.response.raison_visite;
					vm.tab_reponse_menage_visite=result.data.response.menage_visite;
				});					
			}  console.log(vm.selectedItem);     
		}
		$scope.$watch('vm.selectedItem', function() {
			if (!vm.all_visite_domicile) return;
			vm.all_visite_domicile.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
		})
		vm.ajouter_visite_domicile = function() {
			apiFactory.getAPIgeneraliserREST("visite_domicile/index","cle_etrangere",vm.filtre.id_groupe_ml_pl, "visite_domicile",1).then(function(result) { 
				vm.temp = result.data.response;
				vm.temp.forEach(function(mng) {
					vm.filtre.numero=mng.nombre;
				});			
			});			
			vm.nouvelle_element = true ;
			vm.affichage_masque = true ;
			vm.selectedItem = {} ;
			vm.filtre.date_visite1 = new Date();
			vm.filtre.menage_id = "" ;
			vm.filtre.objet_visite = "" ;
			// vm.filtre.nom_prenom_mlpl = "" ;
			vm.filtre.date_visite2 = new Date() ;
			vm.filtre.resultat_visite = "" ;
			vm.filtre.recommandation = "" ;
			vm.filtre.numero = null ;
			vm.tab_reponse_visite=[];
			vm.tab_reponse_menage_visite=[];
		}
		vm.modifier = function()  {
			vm.nouvelle_element = false ;
			vm.essai={};
			vm.filtre.date_visite1 = new Date(vm.selectedItem.date_visite1);
			vm.filtre.id_groupe_ml_pl = vm.selectedItem.id_groupe_ml_pl ;
			vm.filtre.numero = vm.selectedItem.numero ;
			vm.filtre.menage_id = vm.selectedItem.menage_id ;
			vm.filtre.objet_visite = vm.selectedItem.objet_visite ;
			// vm.filtre.nom_prenom_mlpl = vm.selectedItem.nom_prenom_mlpl ;
			//vm.filtre.date_visite2 = new Date(vm.selectedItem.date_visite2) ;
			vm.filtre.resultat_visite = vm.selectedItem.resultat_visite ;
			vm.filtre.recommandation = vm.selectedItem.recommandation ;
			vm.filtre.identifiant_menage = vm.selectedItem.identifiant_menage ;
			vm.filtre.nomchefmenage = vm.selectedItem.nomchefmenage ;
			vm.affichage_masque = true ;
		}
		vm.annuler = function () {
			vm.nouvelle_element = false ;
			vm.affichage_masque = false ;
			vm.selectedItem={};
		}
		vm.supprimerVisite_domicile = function() {
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
				vm.save_visite_domicile(vm.selectedItem,1);
			}, function() {
            //alert('rien');
			});
        };	  
		
		vm.modifier_membre_menage =function(item) {
			vm.all_menages.forEach(function(mng) {
				if(parseInt(mng.id)==parseInt(vm.filtre.menage_id)) {
					// Affectation direct et non pas par paramètre : DANGEREUX
					vm.filtre.menage_id = mng.id; 
					vm.filtre.identifiant_menage=mng.identifiant_menage;
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
		vm.Modifier_groupeMLPL=function(id_groupe) {
			if(id_groupe) {
				vm.all_groupe_mlpl.forEach(function(mng) {
					if(parseInt(mng.id)==parseInt(id_groupe)) {
						vm.filtre.nom_mere_leader = mng.nom_prenom_ml_pl; 
						vm.filtre.nom_prenom_mlpl = mng.nom_prenom_ml_pl; 
					}
				});						
			}
		} 
		// Fin Fonction Groupe ML/PL
		
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
		function formatDateBDD(dat)
		{
			if (dat)
			{
				var date = new Date(dat);
				var jour  = date.getDate();
				var mois = date.getMonth()+1;
				if(mois <10)
                {
                    mois = '0' + mois;
                }
                if(jour <10)
                {
                        jour = '0' + jour;
                }
				var dates = (date.getFullYear()+"-"+mois+"-"+jour);
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
		vm.charger_detail_reponse_menage= function(item) {
				vm.affiche_load=true;
				apiFactory.getAPIgeneraliser("reponse_menage/index","cle_etrangere",vm.selectedItem.id).then(function(result) {
					vm.tab_reponse_visite=[];
					vm.choix_unique=[];
					// if(item.detail_reponse_menage_multiple.length >0 || item.detail_reponse_menage_unique.length >0) {
					if(result.data.response.variable_choix_multiple.length >0 || result.data.response.variable_choix_unique.length >0) {
						vm.tab_reponse_visite = result.data.response.variable_choix_multiple; 
						vm.choix_unique=result.data.response.variable_choix_unique;
						vm.id_enquete_menage=1;
					} else {
						vm.id_enquete_menage=1;
					}
					vm.affiche_load=false;
				})
		}	
		// DEBUT DIFFRENTES FONCTIONS UTILES POUR LA SAUVEGARDE VARIABLE INTERVENTION
		vm.sauvegarder_reponse_menage=function(id_intervention) {
			if(id_intervention && parseInt(id_intervention) >0) {
				// Double sauvegarde : menage et reponse_menage
				// Stocker dans une variable texte temporaire : txtTmp les valeurs à poster ultérieurement
				// Tableau détail variable intervention : vm.tab_reponse_visite et vm.choix_unique à stocker dans des variables indexées id_variable_(index)
				// Puis on utilise la fonction eval afin que l'on puisse poster normalement txtTmp
				// C'est une façon de contourner la récupération impossible de variable tableau dans le serveur PHP	
				vm.nombre_reponse_menage_choix_multiple = vm.tab_reponse_visite.length; // nombre valeur selectionnée multiple
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
				txtTmp += "nombre_personne_plus_soixantedixans_enquete" +":\"" + vm.filtre.nombre_personne_plus_soixantedixans_enquete + "\",";
				txtTmp += "taille_menage_enquete" +":\"" + vm.filtre.taille_menage_enquete + "\",";
				txtTmp += "nombre_enfant_moins_quinze_ans_enquete" +":\"" + vm.filtre.nombre_enfant_moins_quinze_ans_enquete + "\",";
				txtTmp += "nombre_enfant_non_scolarise_enquete" +":\"" + vm.filtre.nombre_enfant_non_scolarise_enquete + "\",";
				txtTmp += "nombre_enfant_scolarise_enquete" +":\"" + vm.filtre.nombre_enfant_scolarise_enquete + "\",";
				txtTmp += "nombre_enfant_moins_six_ans_enquete" +":\"" + vm.filtre.nombre_enfant_moins_six_ans_enquete + "\",";
				txtTmp += "nombre_personne_handicape_enquete" +":\"" + vm.filtre.nombre_personne_handicape_enquete + "\",";
				txtTmp += "nombre_adulte_travail_enquete" +":\"" + vm.filtre.nombre_adulte_travail_enquete + "\",";
				txtTmp += "nombre_membre_a_etranger_enquete" +":\"" + vm.filtre.nombre_membre_a_etranger_enquete + "\",";
				txtTmp += "maison_non_dure_enquete" +":\"" + vm.filtre.maison_non_dure_enquete + "\",";
				txtTmp += "acces_electricite_enquete" +":\"" + vm.filtre.acces_electricite_enquete + "\",";
				txtTmp += "acces_eau_robinet_enquete" +":\"" + vm.filtre.acces_eau_robinet_enquete + "\",";
				txtTmp += "logement_endommage_enquete" +":\"" + vm.filtre.logement_endommage_enquete + "\",";
				txtTmp += "niveau_degat_logement_enquete" +":\"" + vm.filtre.niveau_degat_logement_enquete + "\",";
				txtTmp += "rehabilitation_enquete" +":\"" + vm.filtre.rehabilitation_enquete + "\",";
				txtTmp += "beneficiaire_autre_programme_enquete" +":\"" + vm.filtre.beneficiaire_autre_programme_enquete + "\",";
				txtTmp += "membre_fonctionnaire_enquete" +":\"" + vm.filtre.membre_fonctionnaire_enquete + "\",";
				txtTmp += "antenne_parabolique_enquete" +":\"" + vm.filtre.antenne_parabolique_enquete + "\",";
				txtTmp += "possede_frigo_enquete" +":\"" + vm.filtre.possede_frigo_enquete + "\",";
				txtTmp += "score_obtenu" +":\"" + vm.filtre.score_obtenu + "\",";
				txtTmp += "rang_obtenu" +":\"" + vm.filtre.rang_obtenu + "\",";
				txtTmp += "inapte" +":\"" + vm.filtre.inapte + "\",";
				// Fin réponse table menage
				// Début réponse table reponse_menage : choix unique/multiple
				txtTmp += "id_intervention" +":\"" + id_intervention + "\",";	
				txtTmp += "intitule_intervention" +":\"" + intitule_intervention + "\",";	
				txtTmp += "nombre_reponse_menage_choix_multiple" +":\"" + vm.nombre_reponse_menage_choix_multiple + "\",";	
				for(var i=0;i < vm.nombre_reponse_menage_choix_multiple;i++) {
					txtTmp += "id_variable_" + (i+1) + ":\"" + vm.tab_reponse_visite[i] + "\",";	
				}
				var iteration=1;
				angular.forEach(vm.choix_unique, function(value, key)  { 
					txtTmp += "id_liste_variable_" + iteration + ":\"" + key + "\",";
					txtTmp += "id_variable_unique_" + iteration + ":\"" + value + "\",";
					iteration=iteration + 1;	
				});				
				vm.nombre_reponse_menage_choix_unique =iteration; // nombre valeur selectionnée unique
				txtTmp += "nombre_reponse_menage_choix_unique" +":\"" + (iteration - 1) + "\",";	
				txtTmp = txtTmp.replace(new RegExp('\'', 'g'),'\\\'');
				txtTmp = txtTmp.replace(new RegExp('(\r\n|\r|\n)', 'g'),'');
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
					vm.selectedItem.nombre_personne_plus_soixantedixans= vm.filtre.nombre_personne_plus_soixantedixans ;
					vm.selectedItem.taille_menage= vm.filtre.taille_menage ;
					vm.selectedItem.nombre_enfant_moins_quinze_ans= vm.filtre.nombre_enfant_moins_quinze_ans ;
					vm.selectedItem.nombre_enfant_non_scolarise= vm.filtre.nombre_enfant_non_scolarise ;
					vm.selectedItem.nombre_enfant_scolarise= vm.filtre.nombre_enfant_scolarise ;
					vm.selectedItem.nombre_enfant_moins_six_ans= vm.filtre.nombre_enfant_moins_six_ans ;
					vm.selectedItem.nombre_personne_handicape= vm.filtre.nombre_personne_handicape ;
					vm.selectedItem.nombre_adulte_travail= vm.filtre.nombre_adulte_travail ;
					vm.selectedItem.nombre_membre_a_etranger= vm.filtre.nombre_membre_a_etranger ;
					vm.selectedItem.maison_non_dure= vm.filtre.maison_non_dure ;
					vm.selectedItem.acces_electricite= vm.filtre.acces_electricite ;
					vm.selectedItem.acces_eau_robinet= vm.filtre.acces_eau_robinet ;
					vm.selectedItem.logement_endommage= vm.filtre.logement_endommage ;
					vm.selectedItem.niveau_degat_logement= vm.filtre.niveau_degat_logement ;
					vm.selectedItem.rehabilitation= vm.filtre.rehabilitation ;
					vm.selectedItem.beneficiaire_autre_programme =vm.filtre.beneficiaire_autre_programme ;
					vm.selectedItem.membre_fonctionnaire= vm.filtre.membre_fonctionnaire ;
					vm.selectedItem.antenne_parabolique= vm.filtre.antenne_parabolique ;
					vm.selectedItem.possede_frigo= vm.filtre.possede_frigo ;
					vm.selectedItem.nombre_personne_plus_soixantedixans_enquete= vm.filtre.nombre_personne_plus_soixantedixans_enquete ;
					vm.selectedItem.taille_menage_enquete= vm.filtre.taille_menage_enquete ;
					vm.selectedItem.nombre_enfant_moins_quinze_ans_enquete= vm.filtre.nombre_enfant_moins_quinze_ans_enquete ;
					vm.selectedItem.nombre_enfant_non_scolarise_enquete= vm.filtre.nombre_enfant_non_scolarise_enquete ;
					vm.selectedItem.nombre_enfant_scolarise_enquete= vm.filtre.nombre_enfant_scolarise_enquete ;
					vm.selectedItem.nombre_enfant_moins_six_ans_enquete= vm.filtre.nombre_enfant_moins_six_ans_enquete ;
					vm.selectedItem.nombre_personne_handicape_enquete =vm.filtre.nombre_personne_handicape_enquete ;
					vm.selectedItem.nombre_adulte_travail_enquete= vm.filtre.nombre_adulte_travail_enquete ;
					vm.selectedItem.nombre_membre_a_etranger_enquete= vm.filtre.nombre_membre_a_etranger_enquete ;
					vm.selectedItem.maison_non_dure_enquete= vm.filtre.maison_non_dure_enquete ;
					vm.selectedItem.acces_electricite_enquete= vm.filtre.acces_electricite_enquete ;
					vm.selectedItem.acces_eau_robinet_enquete= vm.filtre.acces_eau_robinet_enquete ;
					vm.selectedItem.logement_endommage_enquete= vm.filtre.logement_endommage_enquete ;
					vm.selectedItem.niveau_degat_logement_enquete= vm.filtre.niveau_degat_logement_enquete ;
					vm.selectedItem.rehabilitation_enquete= vm.filtre.rehabilitation_enquete ;
					vm.selectedItem.beneficiaire_autre_programme_enquete= vm.filtre.beneficiaire_autre_programme_enquete ;
					vm.selectedItem.membre_fonctionnaire_enquete= vm.filtre.membre_fonctionnaire_enquete ;
					vm.selectedItem.antenne_parabolique_enquete= vm.filtre.antenne_parabolique_enquete ;
					vm.selectedItem.possede_frigo_enquete= vm.filtre.possede_frigo_enquete ;
																			
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

    }
})();

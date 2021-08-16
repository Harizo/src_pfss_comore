(function ()
{
    'use strict';
    angular
        .module('app.pfss.suiviactivite.suivi_arse.suivi_evaluation.informationmereleader')
        .controller('InformationmereleaderController', InformationmereleaderController);

    /** @ngInject */
    function InformationmereleaderController(apiFactory, $state, $mdDialog, $scope,$rootScope,$cookieStore,$http,$location,apiUrl,apiUrlExcel ,apiUrlbase,serveur_central) {
		var vm = this;
	   vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        responsive: true
      };
      vm.rep_quantifiee_column = [{titre:"Code/Desscription"},{titre:"Nombre"}];
      vm.groupe_mlpl_column = [{titre:"Date création"},{titre:"Ménage"},{titre:"Nom ML/PL"},{titre:"Sexe"},{titre:"Age"},{titre:"Lien de parenté"},{titre:"Contact"},{titre:"Nom groupe"}];
      vm.menage_column = [{titre:"Identifiant"},{titre:"N° d'enreg"},{titre:"Chef Ménage"},{titre:"Age"},{titre:"Sexe"},{titre:"Conjoint"},
      {titre:"Adresse"},{titre:"Inscr"},{titre:"Presél"},{titre:"Bénéf"},{titre:"Etat envoie"}];
      // vm.menage_column = [{titre:"Numero d'enregistrement"},{titre:"Chef Ménage"},
      // {titre:"Age chef de ménage"},{titre:"Sexe"},{titre:"Addresse"},{titre:"Personne inscrire"},{titre:"Etat envoie"}];
      vm.individu_column = [{titre:"Nom et prénom"},{titre:"Date de naissance"},{titre:"Sexe"},{titre:"Lien de parenté"},{titre:"Scolarisé"},{titre:"Activite"},{titre:"Aptitude"},{titre:"Travailleur"}];
      //initialisation variable
        vm.affiche_load = false ;
        vm.selectedItem = {} ;
        vm.selectedItemReponseQuantifie = {} ;
        vm.selectedItem_individu = {} ;
		  vm.apiUrlbase=apiUrlbase; 		
        vm.tab_intervention = [] ;//liste intervention associé au menage
        vm.tab_intervention_individu = [] ;//liste intervention associé au individu
        vm.reponse_individu = {} ;
        vm.all_individus = [] ;
        vm.all_menages = [] ;
		vm.all_reponse_quantifiee=[];
        vm.nouvelle_element = false ;
        vm.nouvelle_element_individu = false ;
        vm.affichage_masque = false ;
        vm.affichage_masque_individu = false ;
        vm.date_now = new Date() ;
        vm.disable_button = false ;
		vm.filtre={};	
		vm.all_groupe_mlpl = [];
		vm.serveur_central = serveur_central ;	
		vm.tab=[];
      //chargement clé etrangère et données de bases
        vm.id_user_cookies = $cookieStore.get('id');
		apiFactory.getOne("utilisateurs/index",vm.id_user_cookies).then(function(result) { 
			vm.user = result.data.response;
			apiFactory.getAll("region/index").then(function(result) { 
				vm.all_region = result.data.response;    
			});
		});
         apiFactory.getAll("ile/index").then(function(result)
        { 
          vm.all_ile = result.data.response;    
          
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
          // vm.get_max_id_generer_ref();
          
        });

      }

      vm.filtre_commune = function()
      {
        apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtre.id_region).then(function(result)
        { 
          vm.all_commune = result.data.response; 
          vm.filtre.id_commune = null ; 
          vm.filtre.village_id = null ; 
          // vm.get_max_id_generer_ref();  
          
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
		vm.filtrer = function()	{
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("groupe_mlpl/index","cle_etrangere",vm.filtre.village_id).then(function(result) { 				
				vm.all_groupe_mlpl = result.data.response;    
				var msg ="Aucun groupe ML/PL dans le village de " +vm.filtre.village  + ". Merci !";	
				if(result.data.response.length==0) {
					vm.showAlert("INFORMATION",msg);
				}	
				vm.affiche_load = false ;
			});
		}
		apiFactory.getAPIgeneraliserREST("liste_variable_menage/index","choix_multiple",1).then(function(result){
			vm.allRecordsListevariable = result.data.response;
		});    
		apiFactory.getAPIgeneraliserREST("variable_menage/index","quantifie",1).then(function(result){
			vm.all_reponse_quantifiee = result.data.response;
			console.log(vm.all_reponse_quantifiee);
		});    
		
		vm.modifierVillage = function(filtre) {
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
		vm.selection= function (item)  {
				vm.selectedItem = item;
				vm.charger_detail_reponse_mereleader(item.id);
		}
		$scope.$watch('vm.selectedItem', function() {
			if (!vm.all_groupe_mlpl) return;
			vm.all_groupe_mlpl.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
		})
		vm.selectionReponseQuantifie= function (item)  {
			vm.selectedItemReponseQuantifie = item;
		}
		$scope.$watch('vm.selectedItemReponseQuantifie', function() {
			if (!vm.all_reponse_quantifiee) return;
			vm.all_reponse_quantifiee.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemReponseQuantifie.$selected = true;
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
		vm.charger_detail_reponse_mereleader= function(item) {
				vm.affiche_load=true;
				apiFactory.getAPIgeneraliser("reponse_mere_leader/index","cle_etrangere",vm.selectedItem.id).then(function(result) {
					vm.tab_reponse_variable=result.data.response.variable_choix_multiple; ;
					vm.choix_unique=result.data.response.variable_choix_unique;
					vm.temp=result.data.response.variable_quantifiee;					
					angular.forEach(vm.temp, function(value, key)  { 
						vm.tab[key] = Number(value);
					});			
					vm.affiche_load=false;
				})
		}	
		vm.browse=function() {
			console.log(vm.tab);
				angular.forEach(vm.tab, function(value, key)  { 
					var k = 'key = ' + key;
					var v = 'value=' + value;
					console.log(k);
					console.log(v);
				});				
		}
		// DEBUT DIFFRENTES FONCTIONS UTILES POUR LA SAUVEGARDE VARIABLE INTERVENTION
		vm.sauvegarder_reponse_mereleader=function(id_intervention) {
			if(id_intervention && parseInt(id_intervention) >0) {
				// Double sauvegarde : menage et reponse_mere_leader
				// Stocker dans une variable texte temporaire : txtTmp les valeurs à poster ultérieurement
				// Tableau détail variable intervention : vm.tab_reponse_variable et vm.choix_unique à stocker dans des variables indexées id_variable_(index)
				// Puis on utilise la fonction eval afin que l'on puisse poster normalement txtTmp
				// C'est une façon de contourner la récupération impossible de variable tableau dans le serveur PHP	
				
				var datas = $.param({
					id_menage:vm.selectedItem.id,      
					mere_leader_id:vm.selectedItem.id,      
					tab_multiple: JSON.stringify(vm.tab_reponse_variable),      
					tab_unique: JSON.stringify(vm.choix_unique),      
					tab_quantifie: JSON.stringify(vm.tab),      
				});       
				var config = {
					headers : {
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
					}
				};
				// apiFactory.add("reponse_mere_leader/index",donnees, config).success(function (data) {
				apiFactory.add("reponse_mere_leader/index",datas, config).success(function (data) {
					// Ecraser les valeurs dans vm.selectedItem 
					vm.selectedItem.detail_charge=1;
					vm.showAlert("INFORMATION","Réponse ML/PL sauvegardé avec succès");
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
				vm.showAlert("Erreur lors de la sauvegarde","Veuillez choisir le ML/PL correspondant aux différents choix !");
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
		// Début Fonction concernant la fenetre modal
	}
  })();

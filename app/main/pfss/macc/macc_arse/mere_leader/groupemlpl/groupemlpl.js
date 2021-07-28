(function ()
{
    'use strict';

    angular
        .module('app.pfss.macc.macc_arse.mere_leader.groupemlpl')
        .controller('GroupemlplController', GroupemlplController);
    /** @ngInject */
    function GroupemlplController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrlReporting)  {
		var vm = this;
	   vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        order: []
      };

      vm.groupe_mlpl_column = [{titre:"Date création"},{titre:"Ménage"},{titre:"Nom ML/PL"},{titre:"Sexe"},{titre:"Age"},{titre:"Lien de parenté"},{titre:"Contact"},{titre:"Nom groupe"}];
      vm.liste_mlpl_column = [{titre:"Nom et prénom"},{titre:"Sexe"},{titre:"Age"},{titre:"Lien de parenté"},{titre:"Ménage"},{titre:"Adresse"},{titre:"Contact"}];
      vm.listemenage_mlpl_column = [{titre:"Chef de ménage"},{titre:"Conjoint(e)"},{titre:"Adresse"},
	  {titre:"-6 ans"},{titre:"+6 ans non scolarisé"},{titre:"+6 ans scolarisé"}];
      //initialisation variable
		vm.currentItem = {};
        vm.affiche_load = false ;
        vm.selectedItem = {} ;
        vm.selectedItem_liste_mlpl = {} ;
        vm.selectedItem_listemenage_mlpl = {} ;
		
		vm.all_menages =[];
        vm.all_liste_mlpl = [] ;
        vm.all_groupe_mlpl = [] ;
		vm.all_listemenage_mlpl =[];
		vm.all_menage_mlpl =[];
        vm.nouvelle_element = false ;
        vm.nouvelle_element_liste_mlpl = false ;
        vm.nouvelle_element_listemenage_mlpl = false ;
        vm.affichage_masque = false ;
        vm.affichage_masque_liste_mlpl = false ;
        vm.affichage_masque_listemenage_mlpl = false ;
        vm.affichage_masque_fiche_presence = false ;
		
        vm.date_now = new Date() ;

        vm.disable_button = false ;

		vm.selectedItemFichepresencebienetre = {} ;
        var current_selectedItemFichepresencebienetre = {} ;
        vm.nouvelItemFichepresencebienetre = false ;
        vm.allFichepresencebienetre = [] ;

		vm.selectedItemFiche_supervision_mlpl = {} ;
        var current_selectedItemFiche_supervision_mlpl = {} ;
        vm.nouvelItemFiche_supervision_mlpl = false ;
        vm.allFiche_supervision_mlpl = [] ;

		vm.selectedItemPoint_a_verifier_mlpl = {} ;
        var current_selectedItemPoint_a_verifier_mlpl = {} ;
        vm.nouvelItemPoint_a_verifier_mlpl = false ;
        vm.allPoint_a_verifier_mlpl = [] ;

		vm.selectedItemProbleme_solution_mlpl = {} ;
        var current_selectedItemProbleme_solution_mlpl = {} ;
        vm.nouvelItemProbleme_solution_mlpl = false ;
        vm.allProbleme_solution_mlpl = [] ;

		vm.selectedItemLivrable_mlpl = {} ;
        var current_selectedItemLivrable_mlpl = {} ;
        vm.nouvelItemLivrable_mlpl = false ;
        vm.allLivrable_mlpl = [] ;

		vm.selectedItemPoint_controle_mlpl = {} ;
        var current_selectedItemPoint_controle_mlpl = {} ;
        vm.nouvelItemPoint_controle_mlpl = false ;
		
		vm.selectedItemPresence_menage ={};
		
        vm.allPoint_controle_mlpl = [] ;
		vm.tab_reponse_menage_ml_pl=[];
		vm.tab_reponse_presence_bienetre=[];
		vm.fiche_presence={};
		vm.max_date = new Date();
      //initialisation variable

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
		
		apiFactory.getAll("contrat_consultant_ong/index").then(function(result)
        { 
          vm.allContrat_consultant = result.data.response;    
          
        });
		apiFactory.getTable("ddb_mlpl/index","espace_bien_etre").then(function(result){
			vm.allRecordsEspacebienetre = result.data.response;
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
		apiFactory.getAPIgeneraliserREST("consultant_ong/index","cle_etrangere",vm.filtre.id_ile).then(function(result)
        { 
          vm.allConsultant_ong = result.data.response;
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
		// Début Fonction Groupe ML/PL	
		vm.save_groupe_mlpl = function(groupe_mlpl,suppression) {
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
                      village_id: groupe_mlpl.village_id,
                      date_creation: formatDateBDD(groupe_mlpl.date_creation),
                      chef_village: groupe_mlpl.chef_village,
                      id_menage: groupe_mlpl.id_menage,
                      nom_prenom_ml_pl: groupe_mlpl.nom_prenom_ml_pl,
                      nom_groupe: groupe_mlpl.nom_groupe,
                      sexe: groupe_mlpl.sexe,
                      age: groupe_mlpl.age,
                      lien_de_parente: groupe_mlpl.lien_de_parente,
                      telephone: groupe_mlpl.telephone,
                    });
			apiFactory.add("groupe_mlpl/index",datas, config).success(function (data) {
				vm.affichage_masque = false ;
				vm.disable_button = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
				if (vm.nouvelle_element) {
					var mng={
						id : data.response ,
						village_id: groupe_mlpl.village_id,
						date_creation: vm.formatDateListeJJMMYYYY(groupe_mlpl.date_creation),
						chef_village: groupe_mlpl.chef_village,
						id_menage: groupe_mlpl.id_menage,
						nom_prenom_ml_pl: groupe_mlpl.nom_prenom_ml_pl,
						nom_groupe: groupe_mlpl.nom_groupe,
						identifiant_menage: groupe_mlpl.identifiant_menage,
						nomchefmenage: groupe_mlpl.nomchefmenage,
						sexe: groupe_mlpl.sexe,
						age: groupe_mlpl.age,
						lien_de_parente: groupe_mlpl.lien_de_parente,
						telephone: groupe_mlpl.telephone,
						lienparental: groupe_mlpl.lienparental,
					}
					vm.all_groupe_mlpl.push(mng) ;
					// Nouveau => enlever de la liste de ménage le ménage selectionné élue ML/PL : pour éviter rafraichissement
					vm.all_menages = vm.all_menages.filter(function(obj) {
						return obj.id !== groupe_mlpl.id_menage;
					});	
				} else {
					if(suppression==1) {
						vm.affiche_load=true;
						// Réintégrer dans la liste des ménages à choisir le ménage supprimé tout à l'heure
						apiFactory.getAPIgeneraliserREST("menage/index","cle_etrangere",vm.filtre.village_id,"etat_statut","beneficiaire","id_sous_projet",vm.filtre.id_sous_projet,"beneficiaire",1,"groupe_ml_pl",1).then(function(result) { 
							vm.all_menages = result.data.response; 
							var msg ="Aucun ménage bénéficiaire dans le village de " +vm.filtre.village + ". Merci !";				
							if(result.data.response.length==0) {
								vm.showAlert("INFORMATION",msg);
							}
							// Suppression de l'enregistrement selectionné	de la liste
							vm.all_groupe_mlpl = vm.all_groupe_mlpl.filter(function(obj) {
								return obj.id !== vm.currentItem.id;
							});	
							vm.affiche_load = false ;
						});
						vm.selectedItem	={};
					} else {
						vm.affichage_masque_liste_mlpl = false ;
						vm.selectedItem.date_creation =  vm.filtre.date_creation ;
						vm.selectedItem.village_id = vm.filtre.village_id  ;
						vm.selectedItem.chef_village = vm.filtre.chef_village  ;
						vm.selectedItem.id_menage = vm.filtre.id_menage  ;
						vm.selectedItem.nom_prenom_ml_pl = vm.filtre.nom_prenom_ml_pl  ;
						vm.selectedItem.nom_groupe = vm.filtre.nom_groupe  ;
						vm.selectedItem.identifiant_menage = vm.filtre.identifiant_menage  ;
						vm.selectedItem.nomchefmenage = vm.filtre.nomchefmenage  ;
						vm.selectedItem.sexe = vm.filtre.sexe  ;
						vm.selectedItem.age = vm.filtre.age  ;
						vm.selectedItem.lien_de_parente = vm.filtre.lien_de_parente  ;
						vm.selectedItem.telephone = vm.filtre.telephone  ;
						vm.selectedItem.lienparental = vm.filtre.lienparental  ;
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
				// vm.all_liste_mlpl = [] ;
				vm.selectedItem_liste_mlpl = {} ;//raz individu_selected
				vm.selectedItem = item;
				vm.get_liste_mlpl_by_groupe(item.id);
				vm.get_listemenage_mlpl_by_groupe(item.id);
				vm.click_tab_livrable_mlpl();
			} 
			vm.selectedItemFiche_supervision_mlpl = {}; 
			vm.selectedItemLivrable_mlpl = {};     
		}
		$scope.$watch('vm.selectedItem', function() {
			if (!vm.all_groupe_mlpl) return;
			vm.all_groupe_mlpl.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
		})
		vm.ajouter_groupe_mlpl = function() {
			vm.nouvelle_element = true ;
			vm.affichage_masque = true ;
			vm.selectedItem = {} ;
			vm.filtre.date_creation = new Date();
			vm.filtre.chef_village = "" ;
			vm.filtre.nom_groupe = "" ;
			vm.filtre.id_menage = null ;
			vm.filtre.nom_prenom_ml_pl = null ;
			vm.filtre.identifiant_menage = null ;
			vm.filtre.nomchefmenage = null ;
			vm.filtre.sexe = null ;
			vm.filtre.age = null ;
			vm.filtre.lien_de_parente = null ;
			vm.filtre.telephone = null ;
		}
		vm.modifier = function()  {
			vm.nouvelle_element = false ;
			vm.essai={};
			vm.filtre.date_creation = new Date(vm.selectedItem.date_creation);
			vm.filtre.village_id = vm.selectedItem.village_id ;
			vm.filtre.chef_village = vm.selectedItem.chef_village ;
			vm.filtre.nom_groupe = vm.selectedItem.nom_groupe ;
			vm.filtre.id_menage = vm.selectedItem.id_menage ;
			vm.filtre.nom_prenom_ml_pl = vm.selectedItem.nom_prenom_ml_pl ;
			vm.filtre.identifiant_menage = vm.selectedItem.identifiant_menage ;
			vm.filtre.nomchefmenage = vm.selectedItem.nomchefmenage ;
			vm.filtre.sexe = vm.selectedItem.sexe ;
			vm.filtre.lien_de_parente = vm.selectedItem.lien_de_parente ;
			if(vm.selectedItem.age) {
				vm.filtre.age=parseInt(vm.selectedItem.age);
			} else vm.filtre.age=null;
			vm.filtre.telephone = vm.selectedItem.telephone ;
			vm.affichage_masque = true ;
		}
		vm.annuler = function () {
			vm.nouvelle_element = false ;
			vm.affichage_masque = false ;
			vm.selectedItem={};
		}
		vm.supprimer = function() {
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
				vm.save_groupe_mlpl(vm.selectedItem,1);
			}, function() {
            //alert('rien');
			});
        };	  
		vm.Modifier_Menage =function() {
			vm.all_menages.forEach(function(mng) {
				if(parseInt(mng.id)==parseInt(vm.filtre.id_menage)) {
					vm.filtre.identifiant_menage = mng.identifiant_menage; 
					vm.filtre.nomchefmenage = mng.nomchefmenage; 
				}
			});			
			
		}
		vm.Modifier_Espace_bienetre =function() {
			vm.allRecordsEspacebienetre.forEach(function(mng) {
				if(parseInt(mng.id)==parseInt(vm.fiche_presence.id_espace_bienetre)) {
					vm.fiche_presence.espace_bien_etre = mng.description; 
				}
			});			
			
		}
		vm.modifier_lien_de_parente_groupe_mlpl =function(item) {
			vm.all_lienparental.forEach(function(lp) {
				if(parseInt(lp.id)==parseInt(vm.filtre.lien_de_parente)) {
					vm.filtre.lienparental = lp.description; 
				}
			});			
		}
		// Fin Fonction Groupe ML/PL
		
		// Début Fonction Liste ML/PL	
		vm.save_liste_mlpl = function(liste_mlpl,suppression) {
			vm.disable_button = true ;
			var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };

			var id_idv = 0 ;
			if (!vm.nouvelle_element_liste_mlpl) {
				var id_idv = vm.selectedItem_liste_mlpl.id ;
			}
			var datas = $.param(
                    {    
                      supprimer:suppression,
                      id: id_idv ,
                      id_groupe_ml_pl: vm.selectedItem.id,
                      menage_id:liste_mlpl.menage_id,
                      nom_prenom: liste_mlpl.nom_prenom,
                      adresse: liste_mlpl.adresse,
                      contact: liste_mlpl.contact,
                      fonction: liste_mlpl.fonction,
                      sexe: liste_mlpl.sexe,
                      age: liste_mlpl.age,
                      lien_de_parente: liste_mlpl.lien_de_parente,
                    });
			apiFactory.add("liste_mlpl/index",datas, config).success(function (data) {
				vm.disable_button = false ;
				vm.affichage_masque_liste_mlpl = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
				if (vm.nouvelle_element_liste_mlpl) {
					var indiv = {
							id:data.response ,
							id_groupe_ml_pl: vm.selectedItem.id,
							menage_id: liste_mlpl.menage_id,
							nom_prenom: liste_mlpl.nom_prenom,
							adresse: liste_mlpl.adresse,
							contact: liste_mlpl.contact,
							fonction: liste_mlpl.fonction,
							NumeroEnregistrement: liste_mlpl.NumeroEnregistrement,
							nomchefmenage: liste_mlpl.nomchefmenage,
							nom_conjoint: liste_mlpl.nom_conjoint,
							Addresse: liste_mlpl.Addresse,
							nombre_enfant_non_scolarise: liste_mlpl.nombre_enfant_non_scolarise,
							nombre_enfant_moins_six_ans: liste_mlpl.nombre_enfant_moins_six_ans,
							nombre_enfant_scolarise: liste_mlpl.nombre_enfant_scolarise,
							sexe: liste_mlpl.sexe,
							age: liste_mlpl.age,
							lien_de_parente: liste_mlpl.lien_de_parente,
							lienparental: liste_mlpl.lienparental,
						}
						vm.all_liste_mlpl.push(indiv);
				} else {
					if(suppression==1) {
						vm.all_liste_mlpl = vm.all_liste_mlpl.filter(function(obj) {
							return obj.id !== vm.selectedItem_liste_mlpl.id;
						});	
						vm.selectedItem_liste_mlpl={};	
					} else {
						vm.affichage_masque_liste_mlpl = false ;
						vm.selectedItem_liste_mlpl.id_groupe_ml_pl = vm.selectedItem.id  ;
						vm.selectedItem_liste_mlpl.menage_id = liste_mlpl.menage_id  ;
						vm.selectedItem_liste_mlpl.nom_prenom = liste_mlpl.nom_prenom  ;
						vm.selectedItem_liste_mlpl.adresse = liste_mlpl.adresse  ;
						vm.selectedItem_liste_mlpl.contact = liste_mlpl.contact  ;
						vm.selectedItem_liste_mlpl.fonction = liste_mlpl.fonction  ;
						vm.selectedItem_liste_mlpl.NumeroEnregistrement=liste_mlpl.NumeroEnregistrement;
						vm.selectedItem_liste_mlpl.nomchefmenage=liste_mlpl.nomchefmenage;
						vm.selectedItem_liste_mlpl.nom_conjoint=liste_mlpl.nom_conjoint;
						vm.selectedItem_liste_mlpl.Addresse=liste_mlpl.Addresse;
						vm.selectedItem_liste_mlpl.nombre_enfant_non_scolarise=liste_mlpl.nombre_enfant_non_scolarise;
						vm.selectedItem_liste_mlpl.nombre_enfant_moins_six_ans=liste_mlpl.nombre_enfant_moins_six_ans;
						vm.selectedItem_liste_mlpl.nombre_enfant_scolarise=liste_mlpl.nombre_enfant_scolarise;
						vm.selectedItem_liste_mlpl.sexe=liste_mlpl.sexe;
						vm.selectedItem_liste_mlpl.age=liste_mlpl.age;
						vm.selectedItem_liste_mlpl.lien_de_parente=liste_mlpl.lien_de_parente;
						vm.selectedItem_liste_mlpl.lienparental=liste_mlpl.lienparental;
					}	
				}       
			}).error(function (data) {
				vm.disable_button = false ;
				console.log('erreur '+data);
				vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
			});
		}
		vm.selection_liste_mlpl= function (item) {
			if (!vm.affichage_masque_liste_mlpl)  {
				vm.selectedItem_liste_mlpl = item;
				vm.nouvelItem_liste_mlpl   = item;
			}       
		}
		$scope.$watch('vm.selectedItem_liste_mlpl', function() {
			if (!vm.all_liste_mlpl) return;
			vm.all_liste_mlpl.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem_liste_mlpl.$selected = true;
		});
		vm.ajout_liste_mlpl = function()  {
			vm.affichage_masque_liste_mlpl = true ;
			vm.nouvelle_element_liste_mlpl = true ;
			vm.liste_mlpl_masque = {} ;
		}
		vm.modifier_liste_mlpl = function()  {
			vm.nouvelle_element_liste_mlpl = false ;
			vm.affichage_masque_liste_mlpl = true ;
			vm.liste_mlpl_masque={};
			vm.liste_mlpl_masque.menage_id = vm.selectedItem_liste_mlpl.menage_id ;
			vm.liste_mlpl_masque.nom_prenom = vm.selectedItem_liste_mlpl.nom_prenom ;
			vm.liste_mlpl_masque.adresse = vm.selectedItem_liste_mlpl.adresse ;
			vm.liste_mlpl_masque.contact = vm.selectedItem_liste_mlpl.contact ;
			vm.liste_mlpl_masque.fonction = vm.selectedItem_liste_mlpl.fonction ;
			vm.liste_mlpl_masque.NumeroEnregistrement=vm.selectedItem_liste_mlpl.NumeroEnregistrement;
			vm.liste_mlpl_masque.nomchefmenage=vm.selectedItem_liste_mlpl.nomchefmenage;
			vm.liste_mlpl_masque.nom_conjoint=vm.selectedItem_liste_mlpl.nom_conjoint;
			vm.liste_mlpl_masque.Addresse=vm.selectedItem_liste_mlpl.Addresse;
			vm.liste_mlpl_masque.nombre_enfant_non_scolarise=vm.selectedItem_liste_mlpl.nombre_enfant_non_scolarise;
			vm.liste_mlpl_masque.nombre_enfant_moins_six_ans=vm.selectedItem_liste_mlpl.nombre_enfant_moins_six_ans;
			vm.liste_mlpl_masque.nombre_enfant_scolarise=vm.selectedItem_liste_mlpl.nombre_enfant_scolarise;
			vm.liste_mlpl_masque.sexe=vm.selectedItem_liste_mlpl.sexe;
			if(vm.selectedItem_liste_mlpl.age) {
				vm.liste_mlpl_masque.age=parseInt(vm.selectedItem_liste_mlpl.age);
			}	
			vm.liste_mlpl_masque.lien_de_parente=vm.selectedItem_liste_mlpl.lien_de_parente;
			vm.liste_mlpl_masque.lienparental=vm.selectedItem_liste_mlpl.lienparental;
		}
		vm.annuler_liste_mlpl = function()  {
			vm.nouvelle_element_liste_mlpl = false ;
			vm.affichage_masque_liste_mlpl = false ;
			vm.selectedItem_liste_mlpl={};
		}
		vm.supprimer_liste_mlpl = function() {
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
				vm.save_liste_mlpl(vm.selectedItem_liste_mlpl,1);
			}, function() {
            //alert('rien');
			});
        };	  
		// Fin Fonction Liste ML/PL	
		
		// Début Fonction Liste ménage ML/PL	
		vm.save_listemenage_mlpl = function() {
			vm.disable_button = true ;
			var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };

			var id_idv = 0 ;
			if (!vm.nouvelle_element_listemenage_mlpl) {
				var id_idv = vm.selectedItem_listemenage_mlpl.id ;
			}
			// Stocker dans une variable texte temporaire : txtTmp les valeurs à poster ultérieurement
			// Tableau détail  : vm.tab_reponse_menage_ml_pl et  à stocker dans des variables indexées id_variable_(index)
			// Puis on utilise la fonction eval afin que l'on puisse poster normalement txtTmp
			// C'est une façon de contourner la récupération impossible de variable tableau dans le serveur PHP	
			vm.nombre_menage_membre = vm.tab_reponse_menage_ml_pl.length; // nombre ménage membre groupe ML/PL
			var txtTmp="";
			// Début colonne id_groupe_ml_pl dans la table liste_menage_mlpl
			txtTmp += "supprimer" +":\"" + "0" + "\",";
			txtTmp += "id_groupe_ml_pl" +":\"" + vm.selectedItem.id + "\",";
			// Fin  colonne id_groupe_ml_pl dans la table liste_menage_mlpl
			// Début réponse menage membre groupe ML/PL : choix multiple
			txtTmp += "nombre_menage_membre" +":\"" + vm.nombre_menage_membre + "\",";	
			for(var i=0;i < vm.nombre_menage_membre;i++) {
				txtTmp += "id_menage_" + (i+1) + ":\"" + vm.tab_reponse_menage_ml_pl[i] + "\",";	
			}
			// Fin réponse menage membre groupe ML/PL
			txtTmp = txtTmp.replace(new RegExp('\'', 'g'),'\\\'');
			txtTmp = txtTmp.replace(new RegExp('(\r\n|\r|\n)', 'g'),'');
			var donnees = $.param(eval('({' + txtTmp + '})'));										
			apiFactory.add("liste_menage_mlpl/index",donnees, config).success(function (data) {
				vm.disable_button = false ;
				vm.affichage_masque_listemenage_mlpl = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
				// if (vm.nouvelle_element_listemenage_mlpl) {
					// vm.selectedItem_listemenage_mlpl.id_groupe_ml_pl =vm.selectedItem.id;
					// vm.selectedItem_listemenage_mlpl.menage_id = menage_mlpl.menage_id;
					// vm.selectedItem_listemenage_mlpl.$selected = false;
					// vm.selectedItem_listemenage_mlpl.$edit = false;
					// vm.selectedItem_listemenage_mlpl ={};
				// } else {
					// menage_mlpl.id=data.response;	
					// vm.selectedItem_listemenage_mlpl= {}  ;
				// }       
			}).error(function (data) {
				vm.disable_button = false ;
				vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
			});
		}
		vm.selection_listemenage_mlpl= function (item) {
			if (!vm.affichage_masque_listemenage_mlpl)  {
				vm.selectedItem_listemenage_mlpl = item;
				vm.nouvelItem_listemenage_mlpl   = item;
			}       
		}
		$scope.$watch('vm.selectedItem_listemenage_mlpl', function() {
			if (!vm.all_menage_mlpl) return;
			vm.all_menage_mlpl.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem_listemenage_mlpl.$selected = true;
		});
		vm.ajout_listemenage_mlpl = function()  {
			vm.affichage_masque_listemenage_mlpl = true ;
			vm.nouvelle_element_listemenage_mlpl = true ;
			var items = {
				$edit: true,
				$selected: true,
				supprimer:0,
				id_groupe_ml_pl: vm.selectedItem.id,
				menage_id:null,
				id:null,
			};
			vm.all_listemenage_mlpl.push(items);
			vm.all_listemenage_mlpl.forEach(function(it) {
				if(it.$selected==true) {
					vm.selectedItem_listemenage_mlpl = it;
				}
			});						
		}
		vm.modifier_listemenage_mlpl = function(item)  {
			// vm.affichage_masque_listemenage_mlpl = true ;
			// vm.menage_mlpl_masque={};
			// vm.menage_mlpl_masque.menage_id = vm.selectedItem_listemenage_mlpl.menage_id ;
			vm.nouvelle_element_listemenage_mlpl= false ;
			vm.selectedItem_listemenage_mlpl = item;
			vm.currentItem = angular.copy(vm.selectedItem_listemenage_mlpl);
			$scope.vm.all_listemenage_mlpl.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItem_listemenage_mlpl.menage_id = parseInt(vm.selectedItem_listemenage_mlpl.description);
			vm.selectedItem_listemenage_mlpl.$edit = true;	

		}
		vm.annuler_listemenage_mlpl = function(item)  {
			if (!item.id) {
				vm.all_listemenage_mlpl.pop();
				vm.nouvelle_element_listemenage_mlpl = false ;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			vm.nouvelle_element_listemenage_mlpl = false ;
			
			 item.menage_id = currentItem.menage_id;
			vm.selectedItem_listemenage_mlpl = {} ;
			vm.selectedItem_listemenage_mlpl.$selected = false;
			
		}
        vm.supprimer_listemenage_mlpl = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				vm.save_listemenage_mlpl(vm.selectedItem_listemenage_mlpl,1);
			}, function() {
			});
        }
		// Fin Fonction Liste ménage ML/PL			
		// Début Fonction filtre par découpage admin et detail par groupe ML/PM	
		vm.filtrer = function()	{
			vm.all_groupe_mlpl = [];
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
		vm.get_liste_mlpl_by_groupe = function(id_groupe_ml_pl) {
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("liste_mlpl/index","cle_etrangere",id_groupe_ml_pl).then(function(result) 	{ 
				// vm.all_liste_mlpl =[];
				vm.all_liste_mlpl = result.data.response; 
				vm.affiche_load = false ;
			});
		}
		vm.get_listemenage_mlpl_by_groupe = function(id_groupe_ml_pl) {
			vm.affiche_load = true ;
			// Liste ménage par village et liste ménage par groupe ML/PL
			apiFactory.getAPIgeneraliserREST("menage/index","cle_etrangere",vm.filtre.village_id,"id_groupe_ml_pl",id_groupe_ml_pl).then(function(result) { 
				// vm.all_menages = result.data.response.menage;   
				vm.all_menage_mlpl = result.data.response.menage; 
				vm.tab_reponse_menage_ml_pl = result.data.response.tab_reponse_menage_ml_pl; 
				apiFactory.getAPIgeneraliserREST("menage/index","cle_etrangere",vm.filtre.village_id,"etat_statut","beneficiaire","id_sous_projet",vm.filtre.id_sous_projet,"beneficiaire",1,"groupe_ml_pl",1,"id_menage",vm.selectedItem.id_menage).then(function(result) { 
					vm.all_menages = result.data.response; 
					var msg ="Aucun ménage bénéficiaire dans le village de " +vm.filtre.village + ". Merci !";				
					if(result.data.response.length==0) {
						vm.showAlert("INFORMATION",msg);
					}
					apiFactory.getAPIgeneraliserREST("liste_menage_mlpl/index","cle_etrangere",id_groupe_ml_pl).then(function(resultat) 	{ 
						vm.all_listemenage_mlpl = resultat.data.response; 
						vm.affiche_load = false;
					});
				});
			});
		}
		vm.modifier_membre_menage =function(item,rang) {
			console.log(vm.all_menages[0]);
			vm.all_menages.forEach(function(mng) {
				if(parseInt(mng.id)==parseInt(item.menage_id)) {
					item.menage_id = mng.id; 
					item.NumeroEnregistrement=mng.NumeroEnregistrement;
					item.identifiant_menage=mng.identifiant_menage;
					item.nomchefmenage=mng.nomchefmenage;
					item.nom_conjoint=mng.nom_conjoint;
					item.adresse=mng.Addresse;
					vm.liste_mlpl_masque.identifiant_menage=mng.identifiant_menage;
					vm.liste_mlpl_masque.adresse=mng.Addresse;
					item.nombre_enfant_non_scolarise=mng.nombre_enfant_non_scolarise;
					item.nombre_enfant_moins_six_ans=mng.nombre_enfant_moins_six_ans;
					item.nombre_enfant_scolarise=mng.nombre_enfant_scolarise;
					if( rang==2) {
						// Saisie en ligne (menage ML/PL) l'autre c'est dans une forme(ML/PL)
						vm.selectedItem_listemenage_mlpl.menage_id = mng.id; 
						vm.selectedItem_listemenage_mlpl.NumeroEnregistrement=mng.NumeroEnregistrement;
						vm.selectedItem_listemenage_mlpl.identifiant_menage=mng.identifiant_menage;
						vm.selectedItem_listemenage_mlpl.nomchefmenage=mng.nomchefmenage;
						vm.selectedItem_listemenage_mlpl.nom_conjoint=mng.nom_conjoint;
						vm.selectedItem_listemenage_mlpl.Addresse=mng.Addresse;
						vm.selectedItem_listemenage_mlpl.nombre_enfant_non_scolarise=mng.nombre_enfant_non_scolarise;
						vm.selectedItem_listemenage_mlpl.nombre_enfant_moins_six_ans=mng.nombre_enfant_moins_six_ans;
						vm.selectedItem_listemenage_mlpl.nombre_enfant_scolarise=mng.nombre_enfant_scolarise;
					}	
					vm.nontrouvee=false;
				}
			});			
		}
		vm.modifier_lien_de_parente =function(item) {
			vm.all_lienparental.forEach(function(lp) {
				if(parseInt(lp.id)==parseInt(vm.liste_mlpl_masque.lien_de_parente)) {
					vm.liste_mlpl_masque.lienparental = lp.description; 
				}
			});			
		}
		// Fin Fonction filtre par découpage admin et detail par groupe ML/PM

		//DEBUT FICHE PRESENCE BIEN ETRE

		vm.fichepresencebienetre_column = 
		[
			{titre:"Numero ligne"},
			{titre:"Date présence"},
			{titre:"Espace bien-être"},
			{titre:"Nombre ménage présent"},
		]; 

		vm.selectionFichepresencebienetre = function(item) {
			vm.affiche_load=true;
			apiFactory.getAPIgeneraliserREST("fichepresence_bienetre_menage/index","cle_etrangere",item.id,"id_seulement",100).then(function(result)	{ 
				vm.selectedItemFichepresencebienetre = item ;
				vm.nouvelItemFichepresencebienetre = false ;
				vm.tab_reponse_presence_bienetre = result.data.response.tab_reponse_presence_bienetre; 
				vm.affiche_load=false;
			});						
		}
		$scope.$watch('vm.selectedItemFichepresencebienetre', function() {
			if (!vm.allFichepresencebienetre) return;
			vm.allFichepresencebienetre.forEach(function(item)	{
				item.$selected = false;
			});
			vm.selectedItemFichepresencebienetre.$selected = true;
		});
		vm.ajouterFichepresencebienetre = function() {
			apiFactory.getAPIgeneraliserREST("fichepresence_bienetre/index","cle_etrangere",vm.selectedItem.id,"numeroligne",100).then(function(result)	{ 
				vm.fiche_presence.numero_ligne= parseInt(result.data.response[0].nombre);
				vm.affichage_masque_fiche_presence=true;
				vm.nouvelItemFichepresencebienetre = true ;
				vm.fiche_presence.id=0;
				vm.fiche_presence.date_presence=new Date();
				vm.tab_reponse_presence_bienetre=[];
			});			
		}
		vm.modifierFichepresencebienetre = function()	{
			vm.affichage_masque_fiche_presence=true;
			vm.nouvelItemFichepresencebienetre = false ;
			vm.fiche_presence.id      = parseInt(vm.selectedItemFichepresencebienetre.id);
			vm.fiche_presence.numero_ligne      = parseInt(vm.selectedItemFichepresencebienetre.numero_ligne);
			vm.fiche_presence.id_espace_bienetre      = parseInt(vm.selectedItemFichepresencebienetre.id_espace_bienetre);
			vm.fiche_presence.espace_bien_etre      = vm.selectedItemFichepresencebienetre.espace_bien_etre;
			vm.fiche_presence.nombre_menage_present  = vm.selectedItemFichepresencebienetre.nombre_menage_present;      
			vm.fiche_presence.date_presence    = new Date(vm.selectedItemFichepresencebienetre.date_presence);  
		}
		vm.supprimerFichepresencebienetre = function()	{			
			var confirm = $mdDialog.confirm()
			  .title('Etes-vous sûr de supprimer cet enregistrement ?')
			  .textContent('Cliquer sur OK pour confirmer')
			  .ariaLabel('Lucky day')
			  .clickOutsideToClose(true)
			  .parent(angular.element(document.body))
			  .ok('OK')
			  .cancel('Annuler');
			$mdDialog.show(confirm).then(function() {

			vm.enregistrerFichepresencebienetre(1);
			}, function() {
			//alert('rien');
			});
		}
		vm.annulerFichepresencebienetre = function() {
				vm.selectedItemFichepresencebienetre = {} ;
				vm.nouvelItemFichepresencebienetre = false ;
				vm.affichage_masque_fiche_presence=false;
		}
		vm.enregistrerFichepresencebienetre = function(etat_suppression) {
			vm.affiche_load = true ;
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var id_enreg=0;
			if(!vm.nouvelItemFichepresencebienetre) {
				id_enreg=vm.selectedItemFichepresencebienetre.id;
			}

			var datas = $.param(
			{                        
				supprimer        :etat_suppression,
				id               : vm.fiche_presence.id,
				numero_ligne     : vm.fiche_presence.numero_ligne,      
				id_espace_bienetre        : vm.fiche_presence.id_espace_bienetre,
				nombre_menage_present    : vm.fiche_presence.nombre_menage_present, 
				date_presence    : formatDateBDD(vm.fiche_presence.date_presence),       
				id_groupe_ml_pl  : vm.selectedItem.id
			});
			// Stocker dans une variable texte temporaire : txtTmp les valeurs à poster ultérieurement
			// Tableau détail  : vm.tab_reponse_menage_ml_pl et  à stocker dans des variables indexées id_variable_(index)
			// Puis on utilise la fonction eval afin que l'on puisse poster normalement txtTmp
			// C'est une façon de contourner la récupération impossible de variable tableau dans le serveur PHP	
			vm.nombre_menage_present = vm.tab_reponse_presence_bienetre.length; // nombre ménage membre groupe ML/PL
			var txtTmp="";
			// Début colonne id_groupe_ml_pl dans la table liste_menage_mlpl
			txtTmp += "supprimer" +":\"" + etat_suppression + "\",";
			txtTmp += "id" +":\"" + id_enreg + "\",";
			txtTmp += "id_groupe_ml_pl" +":\"" + vm.selectedItem.id + "\",";
			txtTmp += "numero_ligne" +":\"" + vm.fiche_presence.numero_ligne + "\",";
			txtTmp += "id_espace_bienetre" +":\"" + vm.fiche_presence.id_espace_bienetre + "\",";
			txtTmp += "date_presence" +":\"" + formatDateBDD(vm.fiche_presence.date_presence) + "\",";
			// Fin  colonne id_groupe_ml_pl dans la table liste_menage_mlpl
			// Début réponse menage membre groupe ML/PL : choix multiple
			txtTmp += "nombre_menage_present" +":\"" + vm.nombre_menage_present + "\",";	
			for(var i=0;i < vm.nombre_menage_present;i++) {
				txtTmp += "id_menage_" + (i+1) + ":\"" + vm.tab_reponse_presence_bienetre[i] + "\",";	
			}
			// Fin réponse menage membre groupe ML/PL
			txtTmp = txtTmp.replace(new RegExp('\'', 'g'),'\\\'');
			txtTmp = txtTmp.replace(new RegExp('(\r\n|\r|\n)', 'g'),'');
			var donnees = $.param(eval('({' + txtTmp + '})'));										

			apiFactory.add("fichepresence_bienetre/index",donnees, config).success(function (data)
			{
				vm.affiche_load = false ;
				if (vm.nouvelItemFichepresencebienetre) {
					var mng={
						id : data.response ,
						id_groupe_ml_pl: vm.selectedItem.id,
						numero_ligne: vm.fiche_presence.numero_ligne,
						id_espace_bienetre: vm.fiche_presence.id_espace_bienetre,
						espace_bien_etre: vm.fiche_presence.espace_bien_etre,
						date_presence: vm.formatDateListe(vm.fiche_presence.date_presence),
						nombre_menage_present: vm.nombre_menage_present,
					}
					vm.allFichepresencebienetre.push(mng) ;
				} else {
					if(etat_suppression==1) {
						vm.allFichepresencebienetre = vm.allFichepresencebienetre.filter(function(obj) {
							return obj.id !== vm.selectedItemFichepresencebienetre.id;
						});	
						vm.selectedItemFichepresencebienetre	={};
					} else {
						vm.affichage_masque_liste_mlpl = false ;
						vm.selectedItemFichepresencebienetre.id =  vm.fiche_presence.id ;
						vm.selectedItemFichepresencebienetre.id_groupe_ml_pl = vm.fiche_presence.id_groupe_ml_pl  ;
						vm.selectedItemFichepresencebienetre.numero_ligne = vm.fiche_presence.numero_ligne  ;
						vm.selectedItemFichepresencebienetre.id_espace_bienetre = vm.fiche_presence.id_espace_bienetre  ;
						vm.selectedItemFichepresencebienetre.espace_bien_etre = vm.fiche_presence.espace_bien_etre  ;
						vm.selectedItemFichepresencebienetre.date_presence = vm.formatDateListe(vm.fiche_presence.date_presence);
						vm.selectedItemFichepresencebienetre.nombre_menage_present = vm.nombre_menage_present ;
					}      
  				}      				
				vm.affichage_masque_fiche_presence=false
				vm.nouvelItemFichepresencebienetre = false ;
				vm.selectedItemFichepresencebienetre = {};
			}).error(function (data) {
				alert("Une erreur s'est produit");
			});
		}
		vm.click_tab_fichepresencebienetre = function()
		{
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("fichepresence_bienetre/index","menu","getfichepresencebygroupe","id_groupe_ml_pl",vm.selectedItem.id).then(function(result){
				vm.allFichepresencebienetre= result.data.response;
				console.log(vm.allFichepresencebienetre);
				vm.affiche_load = false ;

			});
		}
		vm.modifier_menage = function(item)
		{ 	
			item.nombre_enfant_moins_six_ans = 0;
			var men = vm.all_menages.filter(function(obj)
			{
				return obj.id == item.menage_id;
			});
			console.log(men[0]);
			if (parseInt(men[0].nombre_enfant_moins_six_ans)>0)
			{
				item.enfant_moins_six_ans = men[0].nombre_enfant_moins_six_ans;
			}
			
		}
		//FIN FICHE PRESENCE BIEN ETRE

		//DEBUT FICHE SUPERVISION MLPL

		vm.fiche_supervision_mlpl_column = 
		[
			{titre:"Consultant ONG"},
			{titre:"Type supervision"},
			{titre:"Personne rencontree"},
			{titre:"Organisation consultant"},
			{titre:"Planning activite consultant"},
			{titre:"Nom missionnaire"},
			{titre:"Date supervision"},
			{titre:"Date prevue debut"},
			{titre:"Date prevue fin"},
			{titre:"Nom representant"}
		]; 
		// DEBUT PRESENCE BIEN ETRE MENAGE DETAIL
		vm.selection_presence_menage_bienetre = function(item) {
			vm.selectedItemPresence_menage = item ;
		}
		$scope.$watch('vm.selectedItemPresence_menage', function() {
			if (!vm.all_listemenage_mlpl) return;
			vm.all_listemenage_mlpl.forEach(function(item)
			{
				item.$selected = false;
			});
			vm.selectedItemPresence_menage.$selected = true;

		});
		// FIN PRESENCE BIEN ETRE MENAGE DETAIL
		vm.selectionFiche_supervision_mlpl = function(item)
		{
			vm.selectedItemFiche_supervision_mlpl = item ;

			if (!vm.selectedItemFiche_supervision_mlpl.$edit) 
			{
				vm.nouvelItemFiche_supervision_mlpl = false ;
			}

		}

		$scope.$watch('vm.selectedItemFiche_supervision_mlpl', function()
		{
			if (!vm.allFiche_supervision_mlpl) return;
			vm.allFiche_supervision_mlpl.forEach(function(item)
			{
				item.$selected = false;
			});
			vm.selectedItemFiche_supervision_mlpl.$selected = true;

		});

		vm.ajouterFiche_supervision_mlpl = function()
		{
			vm.nouvelItemFiche_supervision_mlpl = true ;
			var item = 
				{                            
					$edit: true,
					$selected: true,
					id:'0',
					id_consultant_ong: '',
					type_supervision: '',
					personne_rencontree: '',
					organisation_consultant: '',
					planning_activite_consultant: '',
					nom_missionnaire: '',
					date_supervision: null,
					date_prevue_debut: null,
					date_prevue_fin: null,
					nom_representant_mlpl: '',
					id_groupemlpl: vm.selectedItem.id,
					
				} ;

			vm.allFiche_supervision_mlpl.unshift(item);
			vm.allFiche_supervision_mlpl.forEach(function(af)
			{
			  if(af.$selected == true)
			  {
				vm.selectedItemFiche_supervision_mlpl = af;
				
			  }
			});
		}

		vm.modifierFiche_supervision_mlpl = function()
		{
			vm.nouvelItemFiche_supervision_mlpl = false ;
			vm.selectedItemFiche_supervision_mlpl.$edit = true;
		
			current_selectedItemFiche_supervision_mlpl = angular.copy(vm.selectedItemFiche_supervision_mlpl);
			
			vm.selectedItemFiche_supervision_mlpl.id_consultant_ong 	= vm.selectedItemFiche_supervision_mlpl.consultant_ong.id;
			vm.selectedItemFiche_supervision_mlpl.type_supervision 		= vm.selectedItemFiche_supervision_mlpl.type_supervision;
			vm.selectedItemFiche_supervision_mlpl.personne_rencontree 	= vm.selectedItemFiche_supervision_mlpl.personne_rencontree;
			vm.selectedItemFiche_supervision_mlpl.organisation_consultant = vm.selectedItemFiche_supervision_mlpl.organisation_consultant;
			vm.selectedItemFiche_supervision_mlpl.planning_activite_consultant = vm.selectedItemFiche_supervision_mlpl.planning_activite_consultant;
			vm.selectedItemFiche_supervision_mlpl.nom_missionnaire 		= vm.selectedItemFiche_supervision_mlpl.nom_missionnaire;
			vm.selectedItemFiche_supervision_mlpl.date_supervision 		= new Date(vm.selectedItemFiche_supervision_mlpl.date_supervision);
			vm.selectedItemFiche_supervision_mlpl.date_prevue_debut 	= new Date(vm.selectedItemFiche_supervision_mlpl.date_prevue_debut);
			vm.selectedItemFiche_supervision_mlpl.date_prevue_fin 		= new Date(vm.selectedItemFiche_supervision_mlpl.date_prevue_fin);
			vm.selectedItemFiche_supervision_mlpl.nom_representant_mlpl = vm.selectedItemFiche_supervision_mlpl.nom_representant_mlpl;
			vm.selectedItemFiche_supervision_mlpl.id_groupemlpl = vm.selectedItemFiche_supervision_mlpl.id_groupemlpl;
		}

		vm.supprimerFiche_supervision_mlpl = function()
		{

			
			var confirm = $mdDialog.confirm()
			  .title('Etes-vous sûr de supprimer cet enregistrement ?')
			  .textContent('Cliquer sur OK pour confirmer')
			  .ariaLabel('Lucky day')
			  .clickOutsideToClose(true)
			  .parent(angular.element(document.body))
			  .ok('OK')
			  .cancel('Annuler');
			$mdDialog.show(confirm).then(function() {

			vm.enregistrerFiche_supervision_mlpl(1);
			}, function() {
			//alert('rien');
			});
		}

		vm.annulerFiche_supervision_mlpl = function()
		{
			if (vm.nouvelItemFiche_supervision_mlpl) 
			{
				
				vm.allFiche_supervision_mlpl.shift();
				vm.selectedItemFiche_supervision_mlpl = {} ;
				vm.nouvelItemFiche_supervision_mlpl = false ;
			}
			else
			{
				

				if (!vm.selectedItemFiche_supervision_mlpl.$edit) //annuler selection
				{
					vm.selectedItemFiche_supervision_mlpl.$selected = false;
					vm.selectedItemFiche_supervision_mlpl = {};
				}
				else
				{
					vm.selectedItemFiche_supervision_mlpl.$selected = false;
					vm.selectedItemFiche_supervision_mlpl.$edit = false;

					vm.selectedItemFiche_supervision_mlpl.id_consultant_ong 	= current_selectedItemFiche_supervision_mlpl.consultant_ong.id;
					vm.selectedItemFiche_supervision_mlpl.type_supervision 		= current_selectedItemFiche_supervision_mlpl.type_supervision;
					vm.selectedItemFiche_supervision_mlpl.personne_rencontree 	= current_selectedItemFiche_supervision_mlpl.personne_rencontree;
					vm.selectedItemFiche_supervision_mlpl.organisation_consultant = current_selectedItemFiche_supervision_mlpl.organisation_consultant;
					vm.selectedItemFiche_supervision_mlpl.planning_activite_consultant = current_selectedItemFiche_supervision_mlpl.planning_activite_consultant;
					vm.selectedItemFiche_supervision_mlpl.nom_missionnaire 		= current_selectedItemFiche_supervision_mlpl.nom_missionnaire;
					vm.selectedItemFiche_supervision_mlpl.date_supervision 		= current_selectedItemFiche_supervision_mlpl.date_supervision;
					vm.selectedItemFiche_supervision_mlpl.date_prevue_debut 	= current_selectedItemFiche_supervision_mlpl.date_prevue_debut;
					vm.selectedItemFiche_supervision_mlpl.date_prevue_fin 		= current_selectedItemFiche_supervision_mlpl.date_prevue_fin;
					vm.selectedItemFiche_supervision_mlpl.nom_representant_mlpl = current_selectedItemFiche_supervision_mlpl.nom_representant_mlpl;
					vm.selectedItemFiche_supervision_mlpl.id_groupemlpl = current_selectedItemFiche_supervision_mlpl.id_groupemlpl;
					
					vm.selectedItemFiche_supervision_mlpl = {};
				}

				

			}
		}

		vm.enregistrerFiche_supervision_mlpl = function(etat_suppression)
		{
			vm.affiche_load = true ;
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};


			var datas = $.param(
			{                        
				supprimer        :etat_suppression,
				id               : vm.selectedItemFiche_supervision_mlpl.id,
				id_consultant_ong 	: vm.selectedItemFiche_supervision_mlpl.id_consultant_ong,
				type_supervision 		: vm.selectedItemFiche_supervision_mlpl.type_supervision,
				personne_rencontree 	: vm.selectedItemFiche_supervision_mlpl.personne_rencontree,
				organisation_consultant : vm.selectedItemFiche_supervision_mlpl.organisation_consultant,
				planning_activite_consultant : vm.selectedItemFiche_supervision_mlpl.planning_activite_consultant,
				nom_missionnaire 		: vm.selectedItemFiche_supervision_mlpl.nom_missionnaire,
				date_supervision 		: formatDateBDD(vm.selectedItemFiche_supervision_mlpl.date_supervision),
				date_prevue_debut 		: formatDateBDD(vm.selectedItemFiche_supervision_mlpl.date_prevue_debut),
				date_prevue_fin 		: formatDateBDD(vm.selectedItemFiche_supervision_mlpl.date_prevue_fin),
				nom_representant_mlpl : vm.selectedItemFiche_supervision_mlpl.nom_representant_mlpl,
				id_groupemlpl  		: vm.selectedItem.id

			});

			apiFactory.add("fiche_supervision_mlpl/index",datas, config).success(function (data)
			{
				vm.affiche_load = false ;
				if (!vm.nouvelItemFiche_supervision_mlpl) 
				{
					if (etat_suppression == 0) 
					{    var consu = vm.allConsultant_ong.filter(function(obj)
						{
							return obj.id == vm.selectedItemFiche_supervision_mlpl.id_consultant_ong;
						});                             
						vm.selectedItemFiche_supervision_mlpl.consultant_ong = consu[0] ;                             
						vm.selectedItemFiche_supervision_mlpl.$edit = false ;
						vm.selectedItemFiche_supervision_mlpl.$selected = false ;
						vm.selectedItemFiche_supervision_mlpl = {} ;
					}
					else
					{
						vm.allFiche_supervision_mlpl = vm.allFiche_supervision_mlpl.filter(function(obj)
						{
							return obj.id !== vm.selectedItemFiche_supervision_mlpl.id;
						});

						vm.selectedItemFiche_supervision_mlpl = {} ;
					}

				}
				else
				{   
					var consu = vm.allConsultant_ong.filter(function(obj)
					{
						return obj.id == vm.selectedItemFiche_supervision_mlpl.id_consultant_ong;
					});                             
					vm.selectedItemFiche_supervision_mlpl.consultant_ong = consu[0] ; 
					vm.selectedItemFiche_supervision_mlpl.$edit = false ;
					vm.selectedItemFiche_supervision_mlpl.$selected = false ;
					vm.selectedItemFiche_supervision_mlpl.id = String(data.response) ;

					vm.nouvelItemFiche_supervision_mlpl = false ;
					vm.selectedItemFiche_supervision_mlpl = {};

				}
			})
			.error(function (data) {alert("Une erreur s'est produit");});
		}

		vm.click_tab_fiche_supervision_mlpl = function()
		{
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("fiche_supervision_mlpl/index","menu","getfiche_previsionbygroupe","id_groupemlpl",vm.selectedItem.id).then(function(result){
				vm.allFiche_supervision_mlpl= result.data.response;
				console.log(vm.allFiche_supervision_mlpl);
				vm.affiche_load = false ;

			});
			vm.selectedItemFiche_supervision_mlpl = {};
		}
		//FIN FICHE SUPERVISION MLPL

		//DEBUT POINT A VERIFIER MLPL

		vm.point_a_verifier_mlpl_column = 
		[
			{titre:"Intitulé du point à vérifier"},
			{titre:"Appréciation"},
			{titre:"Solution/Recommandation"},
			{titre:"Observation"}
		]; 

		vm.selectionPoint_a_verifier_mlpl = function(item)
		{
			vm.selectedItemPoint_a_verifier_mlpl = item ;

			if (!vm.selectedItemPoint_a_verifier_mlpl.$edit) 
			{
				vm.nouvelItemPoint_a_verifier_mlpl = false ;
			}

		}

		$scope.$watch('vm.selectedItemPoint_a_verifier_mlpl', function()
		{
			if (!vm.allPoint_a_verifier_mlpl) return;
			vm.allPoint_a_verifier_mlpl.forEach(function(item)
			{
				item.$selected = false;
			});
			vm.selectedItemPoint_a_verifier_mlpl.$selected = true;

		});

		vm.ajouterPoint_a_verifier_mlpl = function()
		{
			vm.nouvelItemPoint_a_verifier_mlpl = true ;
			var item = 
				{                            
					$edit: true,
					$selected: true,
					id:'0',
					intitule_verifie: '',
					appreciation: '',
					solution: '',
					observation: '' 
					
				} ;

			vm.allPoint_a_verifier_mlpl.unshift(item);
			vm.allPoint_a_verifier_mlpl.forEach(function(af)
			{
			  if(af.$selected == true)
			  {
				vm.selectedItemPoint_a_verifier_mlpl = af;
				
			  }
			});
		}

		vm.modifierPoint_a_verifier_mlpl = function()
		{
			vm.nouvelItemPoint_a_verifier_mlpl = false ;
			vm.selectedItemPoint_a_verifier_mlpl.$edit = true;
		
			current_selectedItemPoint_a_verifier_mlpl = angular.copy(vm.selectedItemPoint_a_verifier_mlpl);
			
			/*vm.selectedItemPoint_a_verifier_mlpl.id_fiche_supervision_mlpl 	= vm.selectedItemPoint_a_verifier_mlpl.fiche_supervision_mlpl.id;
			vm.selectedItemPoint_a_verifier_mlpl.intitule_verifie 		= vm.selectedItemPoint_a_verifier_mlpl.intitule_verifie;
			vm.selectedItemPoint_a_verifier_mlpl.appreciation 	= vm.selectedItemPoint_a_verifier_mlpl.appreciation;
			vm.selectedItemPoint_a_verifier_mlpl.solution = vm.selectedItemPoint_a_verifier_mlpl.solution;
			vm.selectedItemPoint_a_verifier_mlpl.observation = vm.selectedItemPoint_a_verifier_mlpl.observation;*/
		}

		vm.supprimerPoint_a_verifier_mlpl = function()
		{

			
			var confirm = $mdDialog.confirm()
			  .title('Etes-vous sûr de supprimer cet enregistrement ?')
			  .textContent('Cliquer sur OK pour confirmer')
			  .ariaLabel('Lucky day')
			  .clickOutsideToClose(true)
			  .parent(angular.element(document.body))
			  .ok('OK')
			  .cancel('Annuler');
			$mdDialog.show(confirm).then(function() {

			vm.enregistrerPoint_a_verifier_mlpl(1);
			}, function() {
			//alert('rien');
			});
		}

		vm.annulerPoint_a_verifier_mlpl = function()
		{
			if (vm.nouvelItemPoint_a_verifier_mlpl) 
			{
				
				vm.allPoint_a_verifier_mlpl.shift();
				vm.selectedItemPoint_a_verifier_mlpl = {} ;
				vm.nouvelItemPoint_a_verifier_mlpl = false ;
			}
			else
			{
				

				if (!vm.selectedItemPoint_a_verifier_mlpl.$edit) //annuler selection
				{
					vm.selectedItemPoint_a_verifier_mlpl.$selected = false;
					vm.selectedItemPoint_a_verifier_mlpl = {};
				}
				else
				{
					vm.selectedItemPoint_a_verifier_mlpl.$selected = false;
					vm.selectedItemPoint_a_verifier_mlpl.$edit = false;

					vm.selectedItemPoint_a_verifier_mlpl.intitule_verifie 		= current_selectedItemPoint_a_verifier_mlpl.intitule_verifie;
					vm.selectedItemPoint_a_verifier_mlpl.appreciation 	= current_selectedItemPoint_a_verifier_mlpl.appreciation;
					vm.selectedItemPoint_a_verifier_mlpl.solution = current_selectedItemPoint_a_verifier_mlpl.solution;
					vm.selectedItemPoint_a_verifier_mlpl.observation = current_selectedItemPoint_a_verifier_mlpl.observation;
					
					vm.selectedItemPoint_a_verifier_mlpl = {};
				}

				

			}
		}

		vm.enregistrerPoint_a_verifier_mlpl = function(etat_suppression)
		{
			vm.affiche_load = true ;
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};


			var datas = $.param(
			{                        
				supprimer        :etat_suppression,
				id               : vm.selectedItemPoint_a_verifier_mlpl.id,
				intitule_verifie 			: vm.selectedItemPoint_a_verifier_mlpl.intitule_verifie,
				appreciation 				: vm.selectedItemPoint_a_verifier_mlpl.appreciation,
				solution 					: vm.selectedItemPoint_a_verifier_mlpl.solution,
				observation 				: vm.selectedItemPoint_a_verifier_mlpl.observation,
				id_fiche_supervision_mlpl  	: vm.selectedItemFiche_supervision_mlpl.id

			});

			apiFactory.add("point_a_verifier_mlpl/index",datas, config).success(function (data)
			{
				vm.affiche_load = false ;
				if (!vm.nouvelItemPoint_a_verifier_mlpl) 
				{
					if (etat_suppression == 0) 
					{                                
						vm.selectedItemPoint_a_verifier_mlpl.$edit = false ;
						vm.selectedItemPoint_a_verifier_mlpl.$selected = false ;
						vm.selectedItemPoint_a_verifier_mlpl = {} ;
					}
					else
					{
						vm.allPoint_a_verifier_mlpl = vm.allPoint_a_verifier_mlpl.filter(function(obj)
						{
							return obj.id !== vm.selectedItemPoint_a_verifier_mlpl.id;
						});

						vm.selectedItemPoint_a_verifier_mlpl = {} ;
					}

				}
				else
				{  
					vm.selectedItemPoint_a_verifier_mlpl.$edit = false ;
					vm.selectedItemPoint_a_verifier_mlpl.$selected = false ;
					vm.selectedItemPoint_a_verifier_mlpl.id = String(data.response) ;

					vm.nouvelItemPoint_a_verifier_mlpl = false ;
					vm.selectedItemPoint_a_verifier_mlpl = {};

				}
			})
			.error(function (data) {alert("Une erreur s'est produit");});
		}

		vm.click_tab_point_a_verifier_mlpl = function()
		{
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("point_a_verifier_mlpl/index","cle_etrangere",vm.selectedItemFiche_supervision_mlpl.id).then(function(result){
				vm.allPoint_a_verifier_mlpl= result.data.response;
				console.log(vm.allPoint_a_verifier_mlpl);
				vm.affiche_load = false ;

			});
		}
		//FIN POINT A VERIFIER MLPL
		
		//DEBUT PROBLEME SOLUTION MLPL

		vm.probleme_solution_mlpl_column = 
		[
			{titre:"Problème"},
			{titre:"Solution"}
		]; 

		vm.selectionProbleme_solution_mlpl = function(item)
		{
			vm.selectedItemProbleme_solution_mlpl = item ;

			if (!vm.selectedItemProbleme_solution_mlpl.$edit) 
			{
				vm.nouvelItemProbleme_solution_mlpl = false ;
			}

		}

		$scope.$watch('vm.selectedItemProbleme_solution_mlpl', function()
		{
			if (!vm.allProbleme_solution_mlpl) return;
			vm.allProbleme_solution_mlpl.forEach(function(item)
			{
				item.$selected = false;
			});
			vm.selectedItemProbleme_solution_mlpl.$selected = true;

		});

		vm.ajouterProbleme_solution_mlpl = function()
		{
			vm.nouvelItemProbleme_solution_mlpl = true ;
			var item = 
				{                            
					$edit: true,
					$selected: true,
					id:'0',
					probleme: '',
					solution: ''
					
				} ;

			vm.allProbleme_solution_mlpl.unshift(item);
			vm.allProbleme_solution_mlpl.forEach(function(af)
			{
			  if(af.$selected == true)
			  {
				vm.selectedItemProbleme_solution_mlpl = af;
				
			  }
			});
		}

		vm.modifierProbleme_solution_mlpl = function()
		{
			vm.nouvelItemProbleme_solution_mlpl = false ;
			vm.selectedItemProbleme_solution_mlpl.$edit = true;
		
			current_selectedItemProbleme_solution_mlpl = angular.copy(vm.selectedItemProbleme_solution_mlpl);
		}

		vm.supprimerProbleme_solution_mlpl = function()
		{

			
			var confirm = $mdDialog.confirm()
			  .title('Etes-vous sûr de supprimer cet enregistrement ?')
			  .textContent('Cliquer sur OK pour confirmer')
			  .ariaLabel('Lucky day')
			  .clickOutsideToClose(true)
			  .parent(angular.element(document.body))
			  .ok('OK')
			  .cancel('Annuler');
			$mdDialog.show(confirm).then(function() {

			vm.enregistrerProbleme_solution_mlpl(1);
			}, function() {
			//alert('rien');
			});
		}

		vm.annulerProbleme_solution_mlpl = function()
		{
			if (vm.nouvelItemProbleme_solution_mlpl) 
			{
				
				vm.allProbleme_solution_mlpl.shift();
				vm.selectedItemProbleme_solution_mlpl = {} ;
				vm.nouvelItemProbleme_solution_mlpl = false ;
			}
			else
			{
				

				if (!vm.selectedItemProbleme_solution_mlpl.$edit) //annuler selection
				{
					vm.selectedItemProbleme_solution_mlpl.$selected = false;
					vm.selectedItemProbleme_solution_mlpl = {};
				}
				else
				{
					vm.selectedItemProbleme_solution_mlpl.$selected = false;
					vm.selectedItemProbleme_solution_mlpl.$edit = false;

					vm.selectedItemProbleme_solution_mlpl.probleme 		= current_selectedItemProbleme_solution_mlpl.probleme;
					vm.selectedItemProbleme_solution_mlpl.solution = current_selectedItemProbleme_solution_mlpl.solution;
					
					vm.selectedItemProbleme_solution_mlpl = {};
				}

				

			}
		}

		vm.enregistrerProbleme_solution_mlpl = function(etat_suppression)
		{
			vm.affiche_load = true ;
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};


			var datas = $.param(
			{                        
				supprimer        :etat_suppression,
				id               : vm.selectedItemProbleme_solution_mlpl.id,
				probleme 			: vm.selectedItemProbleme_solution_mlpl.probleme,
				solution 					: vm.selectedItemProbleme_solution_mlpl.solution,
				id_fiche_supervision_mlpl  	: vm.selectedItemFiche_supervision_mlpl.id

			});

			apiFactory.add("probleme_solution_mlpl/index",datas, config).success(function (data)
			{
				vm.affiche_load = false ;
				if (!vm.nouvelItemProbleme_solution_mlpl) 
				{
					if (etat_suppression == 0) 
					{                                
						vm.selectedItemProbleme_solution_mlpl.$edit = false ;
						vm.selectedItemProbleme_solution_mlpl.$selected = false ;
						vm.selectedItemProbleme_solution_mlpl = {} ;
					}
					else
					{
						vm.allProbleme_solution_mlpl = vm.allProbleme_solution_mlpl.filter(function(obj)
						{
							return obj.id !== vm.selectedItemProbleme_solution_mlpl.id;
						});

						vm.selectedItemProbleme_solution_mlpl = {} ;
					}

				}
				else
				{  
					vm.selectedItemProbleme_solution_mlpl.$edit = false ;
					vm.selectedItemProbleme_solution_mlpl.$selected = false ;
					vm.selectedItemProbleme_solution_mlpl.id = String(data.response) ;

					vm.nouvelItemProbleme_solution_mlpl = false ;
					vm.selectedItemProbleme_solution_mlpl = {};

				}
			})
			.error(function (data) {alert("Une erreur s'est produit");});
		}

		vm.click_tab_probleme_solution_mlpl = function()
		{
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("probleme_solution_mlpl/index","cle_etrangere",vm.selectedItemFiche_supervision_mlpl.id).then(function(result){
				vm.allProbleme_solution_mlpl= result.data.response;
				console.log(vm.allProbleme_solution_mlpl);
				vm.affiche_load = false ;

			});
		}
		//FIN PROBLEME ET SOLUTION MLPL

		//DEBUT LIVRABLE MLPL
		vm.livrable_mlpl_column = 
		[			
			{titre:"Contrat consultant"},
			{titre:"Activité concernée "},
			{titre:"Intitulé du livrable"},
			{titre:"Date prévu de remise"},
			{titre:"Date effective de réception"},
			{titre:"Intervenant"},
			{titre:"Nombre de commune touchée"},
			{titre:"Nombre de village touchée"},
			{titre:"Observation"}
		]; 

		vm.selectionLivrable_mlpl = function(item)
		{
			vm.selectedItemLivrable_mlpl = item ;

			if (!vm.selectedItemLivrable_mlpl.$edit) 
			{
				vm.nouvelItemLivrable_mlpl = false ;
			}

		}

		$scope.$watch('vm.selectedItemLivrable_mlpl', function()
		{
			if (!vm.allLivrable_mlpl) return;
			vm.allLivrable_mlpl.forEach(function(item)
			{
				item.$selected = false;
			});
			vm.selectedItemLivrable_mlpl.$selected = true;

		});

		vm.ajouterLivrable_mlpl = function()
		{
			vm.nouvelItemLivrable_mlpl = true ;
			var item = 
				{                            
					$edit: true,
					$selected: true,
					id:'0',
					id_contrat_consultant: '',
					activite_concernee: '',
					intitule_livrable: '',
					date_prevue_remise: '',
					date_effective_reception: '',
					intervenant: '',
					nbr_commune_touchee: '',
					nbr_village_touchee: '',
					observation: '' 
					
				} ;

			vm.allLivrable_mlpl.unshift(item);
			vm.allLivrable_mlpl.forEach(function(af)
			{
			  if(af.$selected == true)
			  {
				vm.selectedItemLivrable_mlpl = af;
				
			  }
			});
		}

		vm.modifierLivrable_mlpl = function()
		{
			vm.nouvelItemLivrable_mlpl = false ;
			vm.selectedItemLivrable_mlpl.$edit = true;
		
			current_selectedItemLivrable_mlpl = angular.copy(vm.selectedItemLivrable_mlpl);
			
			vm.selectedItemLivrable_mlpl.id_contrat_consultant 	= vm.selectedItemLivrable_mlpl.contrat_consultant.id;
			//vm.selectedItemLivrable_mlpl.activite_concernee 	= vm.selectedItemLivrable_mlpl.activite_concernee;
			//vm.selectedItemLivrable_mlpl.intitule_livrable 		= vm.selectedItemLivrable_mlpl.intitule_livrable;
			vm.selectedItemLivrable_mlpl.date_prevue_remise 	= new Date(vm.selectedItemLivrable_mlpl.date_prevue_remise);
			vm.selectedItemLivrable_mlpl.date_effective_reception = new Date(vm.selectedItemLivrable_mlpl.date_effective_reception);
			//vm.selectedItemLivrable_mlpl.intervenant 			= vm.selectedItemLivrable_mlpl.intervenant;
			vm.selectedItemLivrable_mlpl.nbr_commune_touchee 	= parseInt(vm.selectedItemLivrable_mlpl.nbr_commune_touchee);
			vm.selectedItemLivrable_mlpl.nbr_village_touchee 	= parseInt(vm.selectedItemLivrable_mlpl.nbr_village_touchee);
			//vm.selectedItemLivrable_mlpl.observation 			= vm.selectedItemLivrable_mlpl.observation;
		}

		vm.supprimerLivrable_mlpl = function()
		{

			
			var confirm = $mdDialog.confirm()
			  .title('Etes-vous sûr de supprimer cet enregistrement ?')
			  .textContent('Cliquer sur OK pour confirmer')
			  .ariaLabel('Lucky day')
			  .clickOutsideToClose(true)
			  .parent(angular.element(document.body))
			  .ok('OK')
			  .cancel('Annuler');
			$mdDialog.show(confirm).then(function() {

			vm.enregistrerLivrable_mlpl(1);
			}, function() {
			//alert('rien');
			});
		}

		vm.annulerLivrable_mlpl = function()
		{
			if (vm.nouvelItemLivrable_mlpl) 
			{
				
				vm.allLivrable_mlpl.shift();
				vm.selectedItemLivrable_mlpl = {} ;
				vm.nouvelItemLivrable_mlpl = false ;
			}
			else
			{
				

				if (!vm.selectedItemLivrable_mlpl.$edit) //annuler selection
				{
					vm.selectedItemLivrable_mlpl.$selected = false;
					vm.selectedItemLivrable_mlpl = {};
				}
				else
				{
					vm.selectedItemLivrable_mlpl.$selected = false;
					vm.selectedItemLivrable_mlpl.$edit = false;

					vm.selectedItemLivrable_mlpl.id_contrat_consultant 	= current_selectedItemLivrable_mlp.contrat_consultant.id;
					vm.selectedItemLivrable_mlpl.activite_concernee 	= current_selectedItemLivrable_mlp.activite_concernee;
					vm.selectedItemLivrable_mlpl.intitule_livrable 		= current_selectedItemLivrable_mlp.intitule_livrable;
					vm.selectedItemLivrable_mlpl.date_prevue_remise 	= current_selectedItemLivrable_mlpl.date_prevue_remise;
					vm.selectedItemLivrable_mlpl.date_effective_reception = current_selectedItemLivrable_mlpl.date_effective_reception;
					vm.selectedItemLivrable_mlpl.intervenant 			= current_selectedItemLivrable_mlp.intervenant;
					vm.selectedItemLivrable_mlpl.nbr_commune_touchee 	= current_selectedItemLivrable_mlpl.nbr_commune_touchee;
					vm.selectedItemLivrable_mlpl.nbr_village_touchee 	= current_selectedItemLivrable_mlpl.nbr_village_touchee;
					vm.selectedItemLivrable_mlpl.observation 			= current_selectedItemLivrable_mlp.observation;
					
					vm.selectedItemLivrable_mlpl = {};
				}

				

			}
		}

		vm.enregistrerLivrable_mlpl = function(etat_suppression)
		{
			vm.affiche_load = true ;
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};


			var datas = $.param(
			{                        
				supprimer        :etat_suppression,
				id               : vm.selectedItemLivrable_mlpl.id,
				id_contrat_consultant 	: vm.selectedItemLivrable_mlpl.id_contrat_consultant,
				activite_concernee 		: vm.selectedItemLivrable_mlpl.activite_concernee,
				intitule_livrable 		: vm.selectedItemLivrable_mlpl.intitule_livrable,
				date_prevue_remise 		: formatDateBDD(vm.selectedItemLivrable_mlpl.date_prevue_remise),
				date_effective_reception : formatDateBDD(vm.selectedItemLivrable_mlpl.date_effective_reception),
				intervenant 			: vm.selectedItemLivrable_mlpl.intervenant,
				nbr_commune_touchee 	: vm.selectedItemLivrable_mlpl.nbr_commune_touchee,
				nbr_village_touchee 	: vm.selectedItemLivrable_mlpl.nbr_village_touchee,
				observation 			: vm.selectedItemLivrable_mlpl.observation,
				id_groupemlpl  			: vm.selectedItem.id

			});

			apiFactory.add("livrable_mlpl/index",datas, config).success(function (data)
			{
				vm.affiche_load = false ;
				if (!vm.nouvelItemLivrable_mlpl) 
				{
					if (etat_suppression == 0) 
					{    var consu = vm.allContrat_consultant.filter(function(obj)
						{
							return obj.id == vm.selectedItemLivrable_mlpl.id_contrat_consultant;
						});                             
						vm.selectedItemLivrable_mlpl.contrat_consultant = consu[0] ;                             
						vm.selectedItemLivrable_mlpl.$edit = false ;
						vm.selectedItemLivrable_mlpl.$selected = false ;
						vm.selectedItemLivrable_mlpl = {} ;
					}
					else
					{
						vm.allLivrable_mlpl = vm.allLivrable_mlpl.filter(function(obj)
						{
							return obj.id !== vm.selectedItemLivrable_mlpl.id;
						});

						vm.selectedItemLivrable_mlpl = {} ;
					}

				}
				else
				{   
					var consu = vm.allContrat_consultant.filter(function(obj)
					{
						return obj.id == vm.selectedItemLivrable_mlpl.id_contrat_consultant;
					});                             
					vm.selectedItemLivrable_mlpl.contrat_consultant = consu[0] ;
					vm.selectedItemLivrable_mlpl.$edit = false ;
					vm.selectedItemLivrable_mlpl.$selected = false ;
					vm.selectedItemLivrable_mlpl.id = String(data.response) ;

					vm.nouvelItemLivrable_mlpl = false ;
					vm.selectedItemLivrable_mlpl = {};

				}
			})
			.error(function (data) {alert("Une erreur s'est produit");});
		}

		vm.click_tab_livrable_mlpl = function()
		{
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("livrable_mlpl/index","cle_etrangere",vm.selectedItem.id).then(function(result){
				vm.allLivrable_mlpl= result.data.response;
				console.log(vm.allLivrable_mlpl);
				vm.affiche_load = false ;

			});
			vm.selectedItemLivrable_mlpl = {};
		}
		//FIN LIVRABLE MLPL

		//DEBUT POINT DE CONTROLE MLPL

		vm.point_controle_mlpl_column = 
		[
			{titre:"Intitulé"},
			{titre:"Resultat"}
		]; 

		vm.selectionPoint_controle_mlpl = function(item)
		{
			vm.selectedItemPoint_controle_mlpl = item ;

			if (!vm.selectedItemPoint_controle_mlpl.$edit) 
			{
				vm.nouvelItemPoint_controle_mlpl = false ;
			}

		}

		$scope.$watch('vm.selectedItemPoint_controle_mlpl', function()
		{
			if (!vm.allPoint_controle_mlpl) return;
			vm.allPoint_controle_mlpl.forEach(function(item)
			{
				item.$selected = false;
			});
			vm.selectedItemPoint_controle_mlpl.$selected = true;

		});

		vm.ajouterPoint_controle_mlpl = function()
		{
			vm.nouvelItemPoint_controle_mlpl = true ;
			var item = 
				{                            
					$edit: true,
					$selected: true,
					id:'0',
					intitule: '',
					resultat: ''
					
				} ;

			vm.allPoint_controle_mlpl.unshift(item);
			vm.allPoint_controle_mlpl.forEach(function(af)
			{
			  if(af.$selected == true)
			  {
				vm.selectedItemPoint_controle_mlpl = af;
				
			  }
			});
		}

		vm.modifierPoint_controle_mlpl = function()
		{
			vm.nouvelItemPoint_controle_mlpl = false ;
			vm.selectedItemPoint_controle_mlpl.$edit = true;
		
			current_selectedItemPoint_controle_mlpl = angular.copy(vm.selectedItemPoint_controle_mlpl);
		}

		vm.supprimerPoint_controle_mlpl = function()
		{

			
			var confirm = $mdDialog.confirm()
			  .title('Etes-vous sûr de supprimer cet enregistrement ?')
			  .textContent('Cliquer sur OK pour confirmer')
			  .ariaLabel('Lucky day')
			  .clickOutsideToClose(true)
			  .parent(angular.element(document.body))
			  .ok('OK')
			  .cancel('Annuler');
			$mdDialog.show(confirm).then(function() {

			vm.enregistrerPoint_controle_mlpl(1);
			}, function() {
			//alert('rien');
			});
		}

		vm.annulerPoint_controle_mlpl = function()
		{
			if (vm.nouvelItemPoint_controle_mlpl) 
			{
				
				vm.allPoint_controle_mlpl.shift();
				vm.selectedItemPoint_controle_mlpl = {} ;
				vm.nouvelItemPoint_controle_mlpl = false ;
			}
			else
			{
				

				if (!vm.selectedItemPoint_controle_mlpl.$edit) //annuler selection
				{
					vm.selectedItemPoint_controle_mlpl.$selected = false;
					vm.selectedItemPoint_controle_mlpl = {};
				}
				else
				{
					vm.selectedItemPoint_controle_mlpl.$selected = false;
					vm.selectedItemPoint_controle_mlpl.$edit = false;

					vm.selectedItemPoint_controle_mlpl.intitule 		= current_selectedItemPoint_controle_mlpl.intitule;
					vm.selectedItemPoint_controle_mlpl.resultat = current_selectedItemPoint_controle_mlpl.resultat;
					
					vm.selectedItemPoint_controle_mlpl = {};
				}

				

			}
		}

		vm.enregistrerPoint_controle_mlpl = function(etat_suppression)
		{
			vm.affiche_load = true ;
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};


			var datas = $.param(
			{                        
				supprimer        	:etat_suppression,
				id               	: vm.selectedItemPoint_controle_mlpl.id,
				intitule 			: vm.selectedItemPoint_controle_mlpl.intitule,
				resultat 			: vm.selectedItemPoint_controle_mlpl.resultat,
				id_livrable_mlpl  	: vm.selectedItemLivrable_mlpl.id

			});

			apiFactory.add("point_controle_mlpl/index",datas, config).success(function (data)
			{
				vm.affiche_load = false ;
				if (!vm.nouvelItemPoint_controle_mlpl) 
				{
					if (etat_suppression == 0) 
					{                                
						vm.selectedItemPoint_controle_mlpl.$edit = false ;
						vm.selectedItemPoint_controle_mlpl.$selected = false ;
						vm.selectedItemPoint_controle_mlpl = {} ;
					}
					else
					{
						vm.allPoint_controle_mlpl = vm.allPoint_controle_mlpl.filter(function(obj)
						{
							return obj.id !== vm.selectedItemPoint_controle_mlpl.id;
						});

						vm.selectedItemPoint_controle_mlpl = {} ;
					}

				}
				else
				{  
					vm.selectedItemPoint_controle_mlpl.$edit = false ;
					vm.selectedItemPoint_controle_mlpl.$selected = false ;
					vm.selectedItemPoint_controle_mlpl.id = String(data.response) ;

					vm.nouvelItemPoint_controle_mlpl = false ;
					vm.selectedItemPoint_controle_mlpl = {};

				}
			})
			.error(function (data) {alert("Une erreur s'est produit");});
		}

		vm.click_tab_point_controle_mlpl = function()
		{
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("point_controle_mlpl/index","cle_etrangere",vm.selectedItemLivrable_mlpl.id).then(function(result){
				vm.allPoint_controle_mlpl= result.data.response;
				console.log(vm.allPoint_controle_mlpl);
				vm.affiche_load = false ;

			});
		}
		//FIN PROBLEME ET SOLUTION

		// DEBUT FONCTION UTILITAIRE
		vm.modifierVillage = function(filtre) {
			vm.affiche_load = true ;
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
			apiFactory.getAPIgeneraliserREST("menage/index","cle_etrangere",vm.filtre.village_id,"etat_statut","beneficiaire","id_sous_projet",vm.filtre.id_sous_projet,"beneficiaire",1,"groupe_ml_pl",1).then(function(result) { 
				vm.all_menages = result.data.response; 
				var msg ="Aucun ménage bénéficiaire dans le village de " +vm.filtre.village + ". Merci !";				
				if(result.data.response.length==0) {
					vm.showAlert("INFORMATION",msg);
				}	
				vm.affiche_load = false ;
			});
			
		}
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
		vm.formatDateListeJJMMYYYY = function (dat) {
			if (dat) {
				var date = new Date(dat);
				var mois = date.getMonth()+1;
				var dates = (date.getDate()+"/"+mois+"/"+date.getFullYear());
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
		vm.export_excel = function() {
			vm.affiche_export_excel = true ;
			apiFactory.getAPIgeneraliserREST("groupe_mlpl/index","cle_etrangere",vm.filtre.village_id,"export_excel",100).then(function(result) { 				
				vm.status=result.data.status;
				if(vm.status)  {
					alert("tao a");
					var nom_file=result.data.nom_file;
					window.location = apiUrlReporting + nom_file; 
					vm.affiche_export_excel =false; 
				} else {
					vm.msg=result.data.message;
					vm.affiche_export_excel =false;
					vm.showAlert('INFORMATION',vm.msg);
				}                      
			});
		}

    }
})();

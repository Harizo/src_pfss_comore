(function ()
{
    'use strict';

    angular
        .module('app.pfss.mereleaderpereleader.groupemlpl')
        .controller('GroupemlplController', GroupemlplController);
    /** @ngInject */
    function GroupemlplController($mdDialog, $scope, apiFactory, $state,$cookieStore)  {
		var vm = this;
	   vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        responsive: true
      };

      vm.groupe_mlpl_column = [{titre:"Date création"},{titre:"Chef Village"},{titre:"Nom groupe"}];
      vm.liste_mlpl_column = [{titre:"Nom et prénom"},{titre:"Adresse"},{titre:"Contact"},{titre:"Fonction"}];
      vm.listemenage_mlpl_column = [{titre:"Chef de ménage"},{titre:"Conjoint(e)"},{titre:"Adresse"},
	  {titre:"-6 ans"},{titre:"+6 ans non scolarisé"},{titre:"+6 ans scolarisé"},{titre:"Actions"}];
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
        vm.nouvelle_element = false ;
        vm.nouvelle_element_liste_mlpl = false ;
        vm.nouvelle_element_listemenage_mlpl = false ;
        vm.affichage_masque = false ;
        vm.affichage_masque_liste_mlpl = false ;
        vm.affichage_masque_listemenage_mlpl = false ;
        vm.date_now = new Date() ;

        vm.disable_button = false ;
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
		vm.save_groupe_mlpl = function(groupe_mlpl) {
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
                      village_id: groupe_mlpl.village_id,
                      date_creation: formatDateBDD(groupe_mlpl.date_creation),
                      chef_village: groupe_mlpl.chef_village,
                      nom_groupe: groupe_mlpl.nom_groupe,
                    });
			apiFactory.add("groupe_mlpl/index",datas, config).success(function (data) {
				vm.affichage_masque = false ;
				vm.disable_button = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
				if (vm.nouvelle_element) {
					var mng={
						id : data.response ,
						village_id: groupe_mlpl.village_id,
						date_creation: formatDateBDD(groupe_mlpl.date_creation),
						chef_village: groupe_mlpl.chef_village,
						nom_groupe: groupe_mlpl.nom_groupe,
					}
					vm.all_groupe_mlpl.push(mng) ;
				} else {
					vm.affichage_masque_liste_mlpl = false ;
					vm.selectedItem.date_creation =  vm.filtre.date_creation ;
					vm.selectedItem.village_id = vm.filtre.village_id  ;
					vm.selectedItem.chef_village = vm.filtre.chef_village  ;
					vm.selectedItem.nom_groupe = vm.filtre.nom_groupe  ;
  				}      
			}).error(function (data) {
				vm.disable_button = false ;
				console.log('erreur '+data);
				vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
			}); 
		}
		vm.selection= function (item)  {
			if ((!vm.affiche_load)&&(!vm.affichage_masque))  {
				vm.all_liste_mlpl = [] ;
				vm.selectedItem_liste_mlpl = {} ;//raz individu_selected
				vm.selectedItem = item;
				vm.get_liste_mlpl_by_groupe(item.id);
				vm.get_listemenage_mlpl_by_groupe(item.id);
			}       
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
		}
		vm.modifier = function()  {
			vm.nouvelle_element = false ;
			vm.essai={};
			vm.filtre.date_creation = new Date(vm.selectedItem.date_creation);
			vm.filtre.village_id = vm.selectedItem.village_id ;
			vm.filtre.chef_village = vm.selectedItem.chef_village ;
			vm.filtre.nom_groupe = vm.selectedItem.nom_groupe ;
			vm.affichage_masque = true ;
		}
		vm.annuler = function () {
			vm.nouvelle_element = false ;
			vm.affichage_masque = false ;
		}
		// Fin Fonction Groupe ML/PL
		
		// Début Fonction Liste ML/PL	
		vm.save_liste_mlpl = function(liste_mlpl) {
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
                      supprimer:0,
                      id: id_idv ,
                      id_groupe_ml_pl: vm.selectedItem.id,
                      nom_prenom: liste_mlpl.nom_prenom,
                      adresse: liste_mlpl.adresse,
                      contact: liste_mlpl.contact,
                      fonction: liste_mlpl.fonction,
                    });
			apiFactory.add("liste_mlpl/index",datas, config).success(function (data) {
				vm.disable_button = false ;
				vm.affichage_masque_liste_mlpl = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
				if (vm.nouvelle_element_liste_mlpl) {
					var indiv = {
							id:data.response ,
							id_groupe_ml_pl: vm.selectedItem.id,
							nom_prenom: liste_mlpl.nom_prenom,
							adresse: liste_mlpl.adresse,
							contact: liste_mlpl.contact,
							fonction: liste_mlpl.fonction,
						}
						vm.all_liste_mlpl.push(indiv);
				} else {
					vm.affichage_masque_liste_mlpl = false ;
					vm.selectedItem_liste_mlpl.nom_prenom = vm.liste_mlpl_masque.nom_prenom  ;
					vm.selectedItem_liste_mlpl.adresse = vm.liste_mlpl_masque.adresse  ;
					vm.selectedItem_liste_mlpl.contact = vm.liste_mlpl_masque.contact  ;
					vm.selectedItem_liste_mlpl.fonction = vm.liste_mlpl_masque.fonction  ;
				}       
			}).error(function (data) {
				vm.disable_button = false ;
				console.log('erreur '+data);
				vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
			});
		}
		vm.selection_liste_mlpl= function (item) {
			console.log(item);
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
			vm.liste_mlpl_masque.nom_prenom = vm.selectedItem_liste_mlpl.nom_prenom ;
			vm.liste_mlpl_masque.adresse = vm.selectedItem_liste_mlpl.adresse ;
			vm.liste_mlpl_masque.contact = vm.selectedItem_liste_mlpl.contact ;
			vm.liste_mlpl_masque.fonction = vm.selectedItem_liste_mlpl.fonction ;
		}
		vm.annuler_liste_mlpl = function()  {
			vm.nouvelle_element_liste_mlpl = false ;
			vm.affichage_masque_liste_mlpl = false ;
		}
		// Fin Fonction Liste ML/PL	
		
		// Début Fonction Liste ménage ML/PL	
		vm.save_listemenage_mlpl = function(menage_mlpl,suppr) {
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
			var datas = $.param(
                    {    
                      supprimer:suppr,
                      id: id_idv ,
                      id_groupe_ml_pl: vm.selectedItem.id,
                      menage_id: menage_mlpl.menage_id,
                    });
			apiFactory.add("liste_menage_mlpl/index",datas, config).success(function (data) {
				vm.disable_button = false ;
				vm.affichage_masque_listemenage_mlpl = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
				if (vm.nouvelle_element_listemenage_mlpl) {
					vm.selectedItem_listemenage_mlpl.id_groupe_ml_pl =vm.selectedItem.id;
					vm.selectedItem_listemenage_mlpl.menage_id = menage_mlpl.menage_id;
					vm.selectedItem_listemenage_mlpl.$selected = false;
					vm.selectedItem_listemenage_mlpl.$edit = false;
					vm.selectedItem_listemenage_mlpl ={};
				} else {
					menage_mlpl.id=data.response;	
					vm.selectedItem_listemenage_mlpl= {}  ;
				}       
			}).error(function (data) {
				vm.disable_button = false ;
				vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
			});
		}
		vm.selection_listemenage_mlpl= function (item) {
			console.log(item);
			if (!vm.affichage_masque_listemenage_mlpl)  {
				vm.selectedItem_listemenage_mlpl = item;
				vm.nouvelItem_listemenage_mlpl   = item;
			}       
		}
		$scope.$watch('vm.selectedItem_listemenage_mlpl', function() {
			if (!vm.all_listemenage_mlpl) return;
			vm.all_listemenage_mlpl.forEach(function(item) {
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
			vm.selectedItemRaisonvisitedomicile = {} ;
			vm.selectedItem_listemenage_mlpl.$selected = false;
			
		}
		// Fin Fonction Liste ménage ML/PL			
		// Début Fonction filtre par découpage admin et detail par groupe ML/PM	
		vm.filtrer = function()	{
			vm.all_groupe_mlpl = [];
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("groupe_mlpl/index","cle_etrangere",vm.filtre.village_id).then(function(result) { 				
				vm.all_groupe_mlpl = result.data.response;    
				vm.affiche_load = false ;
				console.log(vm.all_groupe_mlpl);
			});
		}
		vm.get_liste_mlpl_by_groupe = function(id_groupe_ml_pl) {
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("liste_mlpl/index","cle_etrangere",id_groupe_ml_pl).then(function(result) 	{ 
				vm.all_liste_mlpl =[];
				vm.all_liste_mlpl = result.data.response; 
				vm.affiche_load = false ;
			});
		}
		vm.get_listemenage_mlpl_by_groupe = function(id_groupe_ml_pl) {
			vm.affiche_load = true ;
			// Liste ménage par village et liste ménage par groupe ML/PL
			apiFactory.getAPIgeneraliserREST("menage/index","cle_etrangere",vm.filtre.village_id,"statut","BENEFICIAIRE").then(function(result) { 
				vm.all_menages =[];
				vm.all_menages = result.data.response;   
				console.log(vm.all_menages);
				apiFactory.getAPIgeneraliserREST("liste_menage_mlpl/index","cle_etrangere",id_groupe_ml_pl).then(function(result) 	{ 
					vm.all_listemenage_mlpl =[];
					vm.all_listemenage_mlpl = result.data.response; 
					vm.affiche_load = false;
				});
			});
		}
		vm.modifier_membre_menage =function(item) {
			vm.all_menages.forEach(function(mng) {
				if(parseInt(mng.id)==parseInt(item.menage_id)) {
					item.menage_id = mng.id; 
					item.NumeroEnregistrement=mng.NumeroEnregistrement;
					item.nomchefmenage=mng.nomchefmenage;
					item.nom_conjoint=mng.nom_conjoint;
					item.Addresse=mng.Addresse;
					item.nombre_enfant_non_scolarise=mng.nombre_enfant_non_scolarise;
					item.nombre_enfant_moins_six_ans=mng.nombre_enfant_moins_six_ans;
					item.nombre_enfant_scolarise=mng.nombre_enfant_scolarise;
					
					vm.selectedItem_listemenage_mlpl.menage_id = mng.id; 
					vm.selectedItem_listemenage_mlpl.NumeroEnregistrement=mng.NumeroEnregistrement;
					vm.selectedItem_listemenage_mlpl.nomchefmenage=mng.nomchefmenage;
					vm.selectedItem_listemenage_mlpl.nom_conjoint=mng.nom_conjoint;
					vm.selectedItem_listemenage_mlpl.Addresse=mng.Addresse;
					vm.selectedItem_listemenage_mlpl.nombre_enfant_non_scolarise=mng.nombre_enfant_non_scolarise;
					vm.selectedItem_listemenage_mlpl.nombre_enfant_moins_six_ans=mng.nombre_enfant_moins_six_ans;
					vm.selectedItem_listemenage_mlpl.nombre_enfant_scolarise=mng.nombre_enfant_scolarise;
					vm.nontrouvee=false;
				}
			});			
		}
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

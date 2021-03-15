(function ()
{
    'use strict';

    angular
        .module('app.pfss.contratconsultant')
        .controller('ContratconsultantController', ContratconsultantController);
    /** @ngInject */
    function ContratconsultantController($mdDialog, $scope, apiFactory, $state,$cookieStore)  {
		var vm = this;
	   vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        responsive: true
      };

      vm.contrat_consultant_column = [{titre:"Sous-projet"},{titre:"Référence"},{titre:"Date contrat"},{titre:"Objet"}];
      vm.livrable_consultant_column = [{titre:"Nom et prénom"},{titre:"Adresse"},{titre:"Contact"},{titre:"Fonction"}];
      vm.point_controle_column = [{titre:"Chef de ménage"},{titre:"Conjoint(e)"},{titre:"Adresse"},
	  {titre:"-6 ans"},{titre:"+6 ans non scolarisé"},{titre:"+6 ans scolarisé"},{titre:"Actions"}];
      //initialisation variable
		vm.currentItem = {};
        vm.affiche_load = false ;
        vm.selectedItem = {} ;
        vm.selectedItem_livrable_consultant = {} ;
        vm.selectedItem_point_controle = {} ;
		
		vm.all_menages =[];
        vm.all_livrable_consultant = [] ;
        vm.all_contrat_consultant = [] ;
		vm.all_point_controle =[];
        vm.nouvelle_element = false ;
        vm.nouvelle_element_livrable_consultant = false ;
        vm.nouvelle_element_point_controle = false ;
        vm.affichage_masque = false ;
        vm.affichage_masque_livrable_consultant = false ;
        vm.affichage_masque_point_controle = false ;
        vm.date_now = new Date() ;

        vm.disable_button = false ;
      //initialisation variable

      //chargement clé etrangère et données de bases
        vm.id_user_cookies = $cookieStore.get('id');
		apiFactory.getOne("utilisateurs/index",vm.id_user_cookies).then(function(result) { 
			vm.user = result.data.response;
			apiFactory.getAll("sous_projet/index").then(function(result) { 
				vm.all_sous_projet = result.data.response;    
			});
			apiFactory.getAll("contrat_consultant_ong/index").then(function(result) { 
				vm.all_contrat_consultant = result.data.response;    
			});
	  
		});
		// utilitaire
      	// utilitaire
		// Début Fonction contrat consultant
		vm.save_contrat_consultant = function(contrat_consultant) {
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
                      id_sous_projet: contrat_consultant.id_sous_projet,
                      date_contrat: formatDateBDD(contrat_consultant.date_contrat),
                      reference: contrat_consultant.reference,
                      objet: contrat_consultant.objet,
                    });
			apiFactory.add("contrat_consultant_ong/index",datas, config).success(function (data) {
				vm.affichage_masque = false ;
				vm.disable_button = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
				if (vm.nouvelle_element) {
					var mng={
						id : data.response ,
						id_sous_projet: contrat_consultant.id_sous_projet,
						date_contrat: formatDateBDD(contrat_consultant.date_contrat),
						reference: contrat_consultant.reference,
						objet: contrat_consultant.objet,
					}
					vm.all_contrat_consultant.push(mng) ;
				} else {
					vm.affichage_masque_livrable_consultant = false ;
					vm.selectedItem.date_contrat =  vm.filtre.date_contrat ;
					vm.selectedItem.id_sous_projet = vm.filtre.id_sous_projet  ;
					vm.selectedItem.reference = vm.filtre.reference  ;
					vm.selectedItem.objet = vm.filtre.objet  ;
  				}      
			}).error(function (data) {
				vm.disable_button = false ;
				console.log('erreur '+data);
				vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
			}); 
		}
		vm.selection= function (item)  {
			if ((!vm.affiche_load)&&(!vm.affichage_masque))  {
				vm.all_livrable_consultant = [] ;
				vm.selectedItem_livrable_consultant = {} ;//raz individu_selected
				vm.selectedItem = item;
				vm.get_livrable_consultant_by_consultant(item.id);
				vm.get_point_controle_by_consultant(item.id);
			}       
		}
		$scope.$watch('vm.selectedItem', function() {
			if (!vm.all_contrat_consultant) return;
			vm.all_contrat_consultant.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
		})
		vm.ajouter_contrat_consultant = function() {
			vm.nouvelle_element = true ;
			vm.affichage_masque = true ;
			vm.selectedItem = {} ;
			vm.filtre={};
			vm.filtre.date_contrat = new Date();
			vm.filtre.reference = "" ;
			vm.filtre.objet = "" ;
			vm.filtre.id_sous_projet = null ;
		}
		vm.modifier = function()  {
			vm.nouvelle_element = false ;
			vm.essai={};
			vm.filtre.date_contrat = new Date(vm.selectedItem.date_contrat);
			vm.filtre.id_sous_projet = vm.selectedItem.id_sous_projet ;
			vm.filtre.reference = vm.selectedItem.reference ;
			vm.filtre.objet = vm.selectedItem.objet ;
			vm.affichage_masque = true ;
		}
		vm.annuler = function () {
			vm.nouvelle_element = false ;
			vm.affichage_masque = false ;
		}
		// Fin Fonction contrat consultant
		
		// Début Fonction Livrable consultant	
		vm.save_livrable_consultant = function(livrable_consultant) {
			vm.disable_button = true ;
			var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };

			var id_idv = 0 ;
			if (!vm.nouvelle_element_livrable_consultant) {
				var id_idv = vm.selectedItem_livrable_consultant.id ;
			}
			var datas = $.param(
                    {    
                      supprimer:0,
                      id: id_idv ,
                      id_contrat: vm.selectedItem.id,
                      intitule: livrable_consultant.intitule,
                      date_prevue_remise: formatDateBDD(livrable_consultant.date_prevue_remise),
                      date_effective_reception: formatDateBDD(livrable_consultant.date_effective_reception),
                    });
			apiFactory.add("livrable_consultant/index",datas, config).success(function (data) {
				vm.disable_button = false ;
				vm.affichage_masque_livrable_consultant = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
				if (vm.nouvelle_element_livrable_consultant) {
					var indiv = {
							id:data.response ,
							id_contrat: vm.selectedItem.id,
							intitule: livrable_consultant.intitule,
							date_prevue_remise:formatDateListe(livrable_consultant.date_prevue_remise),
							date_effective_reception: formatDateListe(livrable_consultant.date_effective_reception),
						}
						vm.all_livrable_consultant.push(indiv);
				} else {
					vm.affichage_masque_livrable_consultant = false ;
					vm.selectedItem_livrable_consultant.intitule = vm.livrable_consultant_masque.intitule  ;
					vm.selectedItem_livrable_consultant.date_prevue_remise = vm.livrable_consultant_masque.date_prevue_remise  ;
					vm.selectedItem_livrable_consultant.date_effective_reception = vm.livrable_consultant_masque.date_effective_reception  ;
				}       
			}).error(function (data) {
				vm.disable_button = false ;
				console.log('erreur '+data);
				vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
			});
		}
		vm.selection_livrable_consultant= function (item) {
			if (!vm.affichage_masque_livrable_consultant)  {
				vm.selectedItem_livrable_consultant = item;
				vm.nouvelItem_livrable_consultant   = item;
			}       
		}
		$scope.$watch('vm.selectedItem_livrable_consultant', function() {
			if (!vm.all_livrable_consultant) return;
			vm.all_livrable_consultant.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem_livrable_consultant.$selected = true;
		});
		vm.ajout_livrable_consultant = function()  {
			vm.affichage_masque_livrable_consultant = true ;
			vm.nouvelle_element_livrable_consultant = true ;
			vm.livrable_consultant_masque = {} ;
			vm.livrable_consultant.id_contrat=vm.selectedItem.id;
		}
		vm.modifier_livrable_consultant = function()  {
			vm.nouvelle_element_livrable_consultant = false ;
			vm.affichage_masque_livrable_consultant = true ;
			vm.livrable_consultant_masque={};
			vm.livrable_consultant_masque.intitule = vm.selectedItem_livrable_consultant.intitule ;
			vm.livrable_consultant_masque.date_prevue_remise = new Date(vm.selectedItem_livrable_consultant.date_prevue_remise) ;
			vm.livrable_consultant_masque.date_effective_reception = new Date(vm.selectedItem_livrable_consultant.date_effective_reception) ;
		}
		vm.annuler_livrable_consultant = function()  {
			vm.nouvelle_element_livrable_consultant = false ;
			vm.affichage_masque_livrable_consultant = false ;
		}
		// Fin Fonction Livrable consultant	
		
		// Début Fonction point de controle
		vm.save_point_controle = function(menage_mlpl,suppr) {
			vm.disable_button = true ;
			var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };

			var id_idv = 0 ;
			if (!vm.nouvelle_element_point_controle) {
				var id_idv = vm.selectedItem_point_controle.id ;
			}
			var datas = $.param(
                    {    
                      supprimer:suppr,
                      id: id_idv ,
                      id_livrable: vm.selectedItem.id,
                      intitule: menage_mlpl.intitule,
                    });
			apiFactory.add("liste_menage_mlpl/index",datas, config).success(function (data) {
				vm.disable_button = false ;
				vm.affichage_masque_point_controle = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
				if (vm.nouvelle_element_point_controle) {
					vm.selectedItem_point_controle.id_sous_projet =vm.selectedItem.id;
					vm.selectedItem_point_controle.intitule = menage_mlpl.intitule;
					vm.selectedItem_point_controle.$selected = false;
					vm.selectedItem_point_controle.$edit = false;
					vm.selectedItem_point_controle ={};
				} else {
					menage_mlpl.id=data.response;	
					vm.selectedItem_point_controle= {}  ;
				}       
			}).error(function (data) {
				vm.disable_button = false ;
				vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
			});
		}
		vm.selection_point_controle= function (item) {
			console.log(item);
			if (!vm.affichage_masque_point_controle)  {
				vm.selectedItem_point_controle = item;
				vm.nouvelItem_point_controle   = item;
			}       
		}
		$scope.$watch('vm.selectedItem_point_controle', function() {
			if (!vm.all_point_controle) return;
			vm.all_point_controle.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem_point_controle.$selected = true;
		});
		vm.ajout_point_controle = function()  {
			vm.affichage_masque_point_controle = true ;
			vm.nouvelle_element_point_controle = true ;
			var items = {
				$edit: true,
				$selected: true,
				supprimer:0,
				id_livrable: vm.selectedItem.id,
				intitule:null,
				id:null,
			};
			vm.all_point_controle.push(items);
			vm.all_point_controle.forEach(function(it) {
				if(it.$selected==true) {
					vm.selectedItem_point_controle = it;
				}
			});						
		}
		vm.modifier_point_controle = function(item)  {
			// vm.affichage_masque_point_controle = true ;
			// vm.menage_mlpl_masque={};
			// vm.menage_mlpl_masque.intitule = vm.selectedItem_point_controle.intitule ;
			vm.nouvelle_element_point_controle= false ;
			vm.selectedItem_point_controle = item;
			vm.currentItem = angular.copy(vm.selectedItem_point_controle);
			$scope.vm.all_point_controle.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItem_point_controle.id_livrable = parseInt(vm.selectedItem_point_controle.id_livrable);
			vm.selectedItem_point_controle.intitule = (vm.selectedItem_point_controle.intitule);
			vm.selectedItem_point_controle.resultat = (vm.selectedItem_point_controle.resultat);
			vm.selectedItem_point_controle.$edit = true;	

		}
		vm.annuler_point_controle = function(item)  {
			if (!item.id) {
				vm.all_point_controle.pop();
				vm.nouvelle_element_point_controle = false ;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			vm.nouvelle_element_point_controle = false ;
			
			 item.id_livrable = currentItem.id_livrable;
			 item.intitule = currentItem.intitule;
			 item.resultat = currentItem.resultat;
			vm.selectedItem_point_controle = {} ;
			vm.selectedItem_point_controle.$selected = false;
			
		}
		// Fin Fonction point de controle		
		// Début Fonction filtre par découpage admin et detail par groupe ML/PM	
		vm.filtrer = function()	{
			vm.all_contrat_consultant = [];
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("contrat_consultant/index","cle_etrangere",vm.filtre.id_sous_projet).then(function(result) { 				
				vm.all_contrat_consultant = result.data.response;    
				vm.affiche_load = false ;
				console.log(vm.all_contrat_consultant);
			});
		}
		vm.get_livrable_consultant_by_consultant = function(id_sous_projet) {
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("livrable_consultant/index","cle_etrangere",id_sous_projet).then(function(result) 	{ 
				vm.all_livrable_consultant =[];
				vm.all_livrable_consultant = result.data.response; 
				vm.affiche_load = false ;
			});
		}
		vm.get_point_controle_by_consultant = function(id_sous_projet) {
			vm.affiche_load = true ;
			// Liste ménage par village et liste ménage par groupe ML/PL
			apiFactory.getAPIgeneraliserREST("point_controle/index","cle_etrangere",vm.selectedItem_livrable_consultant).then(function(result) { 
				vm.all_point_controle =[];
				vm.all_point_controle = result.data.response;   
				vm.affiche_load = false;
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
		// FIN FONCTION UTILITAIRE

    }
})();

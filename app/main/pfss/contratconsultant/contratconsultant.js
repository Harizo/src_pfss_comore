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

      vm.contrat_consultant_column = [{titre:"Consultant"},{titre:"Sous-projet"},{titre:"Référence"},{titre:"Date contrat"},{titre:"Objet"}];
      vm.livrable_consultant_column = [{titre:"Intitulé"},{titre:"Date prévue remise"},{titre:"Date effective reception"}];
      vm.point_controle_column = [{titre:"Intitulé"},{titre:"Résultat"},{titre:"Actions"}];
      vm.point_verifie_column = [{titre:"Intitulé"},{titre:"Résultat"},{titre:"Actions"}];
      vm.fiche_supervision_column = [{titre:"Date"},{titre:"Type supérvision"},{titre:"Milieu"},{titre:"Pers rencontrée"}
	  ,{titre:"Pers rencontrée"},{titre:"Planning"},{titre:"Date prév déb"},{titre:"Date fin"}
	  ,{titre:"Missionnaire"},{titre:"Consultant"},{titre:"Répresent. CPS"}];
      vm.point_verifie_column = [{titre:"Thème activité"},{titre:"Description"},{titre:"Prévision"},{titre:"Réelle"},{titre:"Observation"}];
      //initialisation variable
		vm.currentItem = {};
		vm.currentItemLivrableconsultant = {};
		vm.currentItemPointcontrole = {};
		vm.currentItemFichesupervision = {};
		vm.currentItemPointverifie = {};
		vm.currentItemProblemesolution = {};
        vm.affiche_load = false ;
        vm.selectedItem = {} ;
        vm.selectedItem_livrable_consultant = {} ;
        vm.selectedItem_point_controle = {} ;
        vm.selectedItem_fiche_supervision = {} ;
        vm.selectedItem_point_verifie = {} ;
        vm.selectedItem_probleme_solution = {} ;
		
		vm.all_menages =[];
        vm.all_livrable_consultant = [] ;
        vm.all_contrat_consultant = [] ;
		vm.all_point_controle =[];
		vm.all_consultant = [];
		vm.all_fiche_supervision = [];
		vm.all_point_verifie = [];
		vm.all_probleme_solution = [];
        vm.nouvelle_element = false ;
        vm.nouvelle_element_livrable_consultant = false ;
        vm.nouvelle_element_point_controle = false ;
        vm.nouvelle_element_fiche_supervision = false ;
        vm.nouvelle_element_point_verifie = false ;
        vm.nouvelle_element_probleme_solution = false ;
        vm.affichage_masque = false ;
        vm.affichage_masque_livrable_consultant = false ;
        vm.affichage_masque_point_controle = false ;
        vm.affichage_masque_point_verifie = false ;
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
			apiFactory.getAll("consultant_ong/index").then(function(result) { 
				vm.all_consultant = result.data.response;   
			});
	  
		});
		// utilitaire
      	// utilitaire
		// Début Fonction contrat consultant
		vm.save_contrat_consultant = function(contrat_consultant,suppression) {
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
                      id_consultant: contrat_consultant.id_consultant,
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
						id_consultant: contrat_consultant.id_consultant,
						id_sous_projet: contrat_consultant.id_sous_projet,
						date_contrat: formatDateBDD(contrat_consultant.date_contrat),
						reference: contrat_consultant.reference,
						objet: contrat_consultant.objet,
						sous_projet: contrat_consultant.sous_projet,
						consultant: contrat_consultant.consultant,
					}
					vm.all_contrat_consultant.push(mng) ;
					vm.nouvelle_element=false;
				} else {
					if(suppression==1) {
						vm.all_contrat_consultant = vm.all_contrat_consultant.filter(function(obj) {
							return obj.id !== vm.currentItem.id;
						});
						vm.all_livrable_consultant = vm.all_livrable_consultant.filter(function(obj) {
							return obj.id_contrat !== vm.currentItem.id;
						});
						vm.all_point_controle = vm.all_point_controle.filter(function(obj) {
							return obj.id_livrable !== vm.currentItemLivrableconsultant.id;
						});
						vm.nouvelle_element=false;						
					} else {
						vm.affichage_masque_livrable_consultant = false ;
						vm.nouvelle_element=false;
						vm.selectedItem.date_contrat =  vm.filtre.date_contrat ;
						vm.selectedItem.id_sous_projet = vm.filtre.id_sous_projet  ;
						vm.selectedItem.id_consultant = vm.filtre.id_consultant  ;
						vm.selectedItem.reference = vm.filtre.reference  ;
						vm.selectedItem.objet = vm.filtre.objet  ;
						vm.selectedItem.sous_projet = vm.filtre.sous_projet  ;
						vm.selectedItem.consultant = vm.filtre.consultant  ;
						vm.selectedItem = {};
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
				vm.all_livrable_consultant = [] ;
				vm.selectedItem_livrable_consultant = {} ;//raz individu_selected
				vm.selectedItem = item;
				vm.currentItem = angular.copy(vm.selectedItem);
				vm.get_livrable_consultant_by_contrat(item.id);
				vm.get_fiche_supervision_by_contrat(item.id);
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
			vm.filtre.id_consultant = null ;
			vm.filtre.sous_projet = "" ;
			vm.filtre.consultant = "" ;
		}
		vm.modifier = function()  {
			vm.nouvelle_element = false ;
			vm.filtre={};
			vm.filtre.date_contrat = new Date(vm.selectedItem.date_contrat);
			vm.filtre.id_sous_projet = vm.selectedItem.id_sous_projet ;
			vm.filtre.id_consultant = vm.selectedItem.id_consultant ;
			vm.filtre.reference = vm.selectedItem.reference ;
			vm.filtre.objet = vm.selectedItem.objet ;
			vm.filtre.sous_projet = vm.selectedItem.sous_projet ;
			vm.filtre.consultant = vm.selectedItem.consultant ;
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
				vm.save_contrat_consultant(vm.selectedItem,1);
			}, function() {
            //alert('rien');
			});
        };	  
		vm.modifierSous_projet =function(item) {
			vm.all_sous_projet.forEach(function(mng) {
				if(parseInt(mng.id)==parseInt(vm.filtre.id_sous_projet)) {
					// Affectation direct et non pas par paramètre : DANGEREUX
					vm.filtre.id_sous_projet = mng.id; 
					vm.filtre.sous_projet=mng.description;
					vm.nontrouvee=false;
				}
			});			
		}
		vm.modifierConsultant =function(item) {
			vm.all_consultant.forEach(function(mng) {
				if(parseInt(mng.id)==parseInt(vm.filtre.id_consultant)) {
					// Affectation direct et non pas par paramètre : DANGEREUX
					vm.filtre.id_consultant = mng.id; 
					vm.filtre.consultant=mng.raison_social;
					vm.nontrouvee=false;
				}
			});			
		}
		// Fin Fonction contrat consultant
		
		// Début Fonction Livrable consultant	
		vm.save_livrable_consultant = function(livrable_consultant,suppression) {
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
                      supprimer:suppression,
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
							date_prevue_remise:vm.formatDateListe(livrable_consultant.date_prevue_remise),
							date_effective_reception: vm.formatDateListe(livrable_consultant.date_effective_reception),
						}
						vm.all_livrable_consultant.push(indiv);
				} else {
					if(suppression==1) {
						vm.all_livrable_consultant = vm.all_livrable_consultant.filter(function(obj) {
							return obj.id !== vm.currentItemLivrableconsultant.id;
						});	
						vm.all_point_controle = vm.all_point_controle.filter(function(obj) {
							return obj.id_livrable !== vm.currentItemLivrableconsultant.id;
						});
						vm.selectedItem_livrable_consultant={};						
					} else {
						vm.affichage_masque_livrable_consultant = false ;
						vm.selectedItem_livrable_consultant.intitule = vm.livrable_consultant_masque.intitule  ;
						vm.selectedItem_livrable_consultant.date_prevue_remise = vm.livrable_consultant_masque.date_prevue_remise  ;
						vm.selectedItem_livrable_consultant.date_effective_reception = vm.livrable_consultant_masque.date_effective_reception  ;
					}	
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
				vm.currentItemLivrableconsultant =angular.copy(vm.selectedItem_livrable_consultant);
				console.log(vm.selectedItem_livrable_consultant);
				console.log(vm.selectedItem_livrable_consultant.id);
				vm.get_point_controle_by_consultant(vm.selectedItem_livrable_consultant.id);
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
			vm.livrable_consultant_masque.id_contrat=vm.selectedItem.id;
			vm.livrable_consultant_masque.date_prevue_remise=new Date();
			vm.livrable_consultant_masque.date_effective_reception=new Date();
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
			vm.selectedItem_livrable_consultant = {} ;
		}
		vm.supprimer_livrable_consultant = function(item) {
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
				vm.save_livrable_consultant(vm.selectedItem_livrable_consultant,1);
			}, function() {
            //alert('rien');
			});
        };	  
		// Fin Fonction Livrable consultant	
		
		// Début Fonction point de controle
		vm.save_point_controle = function(point_cont,suppression) {
			vm.disable_button = true ;
			var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };

			var id_idv = 0 ;
			if (!vm.nouvelle_element_point_controle) {
				var id_idv = point_cont.id ;
			}
			var datas = $.param(
                    {    
                      supprimer:suppression,
                      id: id_idv ,
                      id_livrable: vm.selectedItem_livrable_consultant.id,
                      intitule: point_cont.intitule,
                      resultat: point_cont.resultat,
                    });
			apiFactory.add("point_controle/index",datas, config).success(function (data) {
				vm.disable_button = false ;
				vm.affichage_masque_point_controle = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
				console.log(vm.nouvelle_element_point_controle);
				if (!vm.nouvelle_element_point_controle) {
					if(suppression==1) {
						vm.all_point_controle = vm.all_point_controle.filter(function(obj) {
							return obj.id !== vm.currentItemPointcontrole.id;
						});
						vm.selectedItem_point_controle ={};
					} else {
						vm.selectedItem_point_controle.id =point_cont.id;
						vm.selectedItem_point_controle.id_livrable =vm.selectedItem_livrable_consultant.id;
						vm.selectedItem_point_controle.intitule = point_cont.intitule;
						vm.selectedItem_point_controle.resultat = point_cont.resultat;
						vm.selectedItem_point_controle.$selected = false;
						vm.selectedItem_point_controle.$edit = false;
						vm.selectedItem_point_controle ={};
					}	
				} else {
						point_cont.id=data.response;	
						vm.selectedItem_point_controle.$selected=false;
						vm.selectedItem_point_controle.$edit=false;
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
				vm.currentItemPointcontrole = angular.copy(vm.selectedItem_point_controle);
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
				resultat:null,
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
			
			 item.id_livrable = vm.currentItemPointcontrole.id_livrable;
			 item.intitule = vm.currentItemPointcontrole.intitule;
			 item.resultat = vm.currentItemPointcontrole.resultat;
			vm.selectedItem_point_controle = {} ;
			vm.selectedItem_point_controle.$selected = false;
			
		}
		vm.supprimer_point_controle = function(item) {
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
				vm.save_point_controle(vm.selectedItem_point_controle,1);
			}, function() {
            //alert('rien');
			});
        };	  
		// Fin Fonction point de controle		
		// Début Fonction Fiche supérvisiont	
		vm.save_fiche_supervision = function(fiche_supervision,suppression) {
			vm.disable_button = true ;
			var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };

			var id_idv = 0 ;
			if (!vm.nouvelle_element_fiche_supervision) {
				var id_idv = vm.selectedItem_fiche_supervision.id ;
			}
			var datas = $.param(
                    {    
                      supprimer:suppression,
                      id: id_idv ,
                      id_contrat: vm.selectedItem.id,
                      type_supervision: fiche_supervision.type_supervision,
                      date_supervision: formatDateBDD(fiche_supervision.date_supervision),
                      milieu: fiche_supervision.milieu,
                      personne_rencontree: fiche_supervision.personne_rencontree,
                      planning_activite: fiche_supervision.planning_activite,
                      nom_missionnaire: fiche_supervision.nom_missionnaire,
                      nom_consultant: fiche_supervision.nom_consultant,
                      representant_cps: fiche_supervision.representant_cps,
                      date_prevue_debut: formatDateBDD(fiche_supervision.date_prevue_debut),
                      date_fin: formatDateBDD(fiche_supervision.date_fin),
                    });
			apiFactory.add("fiche_supervision/index",datas, config).success(function (data) {
				vm.disable_button = false ;
				vm.affichage_masque_fiche_supervision = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
				if (vm.nouvelle_element_fiche_supervision) {
					var indiv = {
							id:data.response ,
							id_contrat: vm.selectedItem.id,
							type_supervision: fiche_supervision.type_supervision,
							date_supervision:vm.formatDateListe(fiche_supervision.date_supervision),
							milieu:fiche_supervision.milieu,
							personne_rencontree:fiche_supervision.personne_rencontree,
							planning_activite:fiche_supervision.planning_activite,
							nom_missionnaire:fiche_supervision.nom_missionnaire,
							nom_consultant:fiche_supervision.nom_consultant,
							representant_cps:fiche_supervision.representant_cps,
							date_prevue_debut: vm.formatDateListe(fiche_supervision.date_prevue_debut),
							date_fin: vm.formatDateListe(fiche_supervision.date_fin),
						}
						vm.all_fiche_supervision.push(indiv);
				} else {
					if(suppression==1) {
						vm.all_fiche_supervision = vm.all_fiche_supervision.filter(function(obj) {
							return obj.id !== vm.currentItemLivrableconsultant.id;
						});	
						vm.all_point_controle = vm.all_point_controle.filter(function(obj) {
							return obj.id_livrable !== vm.currentItemLivrableconsultant.id;
						});
						vm.selectedItem_fiche_supervision={};						
					} else {
						vm.affichage_masque_fiche_supervision = false ;
						vm.selectedItem_fiche_supervision.type_supervision = vm.fiche_supervision_masque.type_supervision  ;
						vm.selectedItem_fiche_supervision.date_supervision = vm.fiche_supervision_masque.date_supervision  ;
						vm.selectedItem_fiche_supervision.milieu = vm.fiche_supervision_masque.milieu  ;
						vm.selectedItem_fiche_supervision.personne_rencontree = vm.fiche_supervision_masque.personne_rencontree  ;
						vm.selectedItem_fiche_supervision.planning_activite = vm.fiche_supervision_masque.planning_activite  ;
						vm.selectedItem_fiche_supervision.nom_missionnaire = vm.fiche_supervision_masque.nom_missionnaire  ;
						vm.selectedItem_fiche_supervision.nom_consultant = vm.fiche_supervision_masque.nom_consultant  ;
						vm.selectedItem_fiche_supervision.representant_cps = vm.fiche_supervision_masque.representant_cps  ;
						vm.selectedItem_fiche_supervision.date_prevue_debut = vm.fiche_supervision_masque.date_prevue_debut  ;
						vm.selectedItem_fiche_supervision.date_fin = vm.fiche_supervision_masque.date_fin  ;
					}	
				}       
			}).error(function (data) {
				vm.disable_button = false ;
				console.log('erreur '+data);
				vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
			});
		}
		vm.selection_fiche_supervision= function (item) {
			if (!vm.affichage_masque_fiche_supervision)  {
				vm.selectedItem_fiche_supervision = item;
				vm.nouvelItem_fiche_supervision   = item;
				vm.currentItemLivrableconsultant =angular.copy(vm.selectedItem_fiche_supervision);
				vm.get_point_verifie_et_probleme_solution_by_supervision(vm.selectedItem_fiche_supervision.id);
			}       
		}
		$scope.$watch('vm.selectedItem_fiche_supervision', function() {
			if (!vm.all_fiche_supervision) return;
			vm.all_fiche_supervision.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem_fiche_supervision.$selected = true;
		});
		vm.ajout_fiche_supervision = function()  {
			vm.affichage_masque_fiche_supervision = true ;
			vm.nouvelle_element_fiche_supervision = true ;
			vm.fiche_supervision_masque = {} ;
			vm.fiche_supervision_masque.id_contrat=vm.selectedItem.id;
			vm.fiche_supervision_masque.date_supervision=new Date();
			vm.fiche_supervision_masque.milieu="";
			vm.fiche_supervision_masque.personne_rencontree="";
			vm.fiche_supervision_masque.planning_activite="";
			vm.fiche_supervision_masque.nom_missionnaire="";
			vm.fiche_supervision_masque.nom_consultant="";
			vm.fiche_supervision_masque.representant_cps="";
			vm.fiche_supervision_masque.date_prevue_debut=new Date();
			vm.fiche_supervision_masque.date_fin=new Date();
		}
		vm.modifier_fiche_supervision = function()  {
			vm.nouvelle_element_fiche_supervision = false ;
			vm.affichage_masque_fiche_supervision = true ;
			vm.fiche_supervision_masque={};
			vm.fiche_supervision_masque.type_supervision = vm.selectedItem_fiche_supervision.type_supervision ;
			vm.fiche_supervision_masque.date_supervision = new Date(vm.selectedItem_fiche_supervision.date_supervision) ;
			vm.fiche_supervision_masque.milieu = vm.selectedItem_fiche_supervision.milieu ;
			vm.fiche_supervision_masque.personne_rencontree = vm.selectedItem_fiche_supervision.personne_rencontree ;
			vm.fiche_supervision_masque.planning_activite = vm.selectedItem_fiche_supervision.planning_activite ;
			vm.fiche_supervision_masque.nom_missionnaire = vm.selectedItem_fiche_supervision.nom_missionnaire ;
			vm.fiche_supervision_masque.nom_consultant = vm.selectedItem_fiche_supervision.nom_consultant ;
			vm.fiche_supervision_masque.representant_cps = vm.selectedItem_fiche_supervision.representant_cps ;
			vm.fiche_supervision_masque.date_prevue_debut = new Date(vm.selectedItem_fiche_supervision.date_prevue_debut) ;
			vm.fiche_supervision_masque.date_fin = new Date(vm.selectedItem_fiche_supervision.date_fin) ;
		}
		vm.annuler_fiche_supervision = function()  {
			vm.nouvelle_element_fiche_supervision = false ;
			vm.affichage_masque_fiche_supervision = false ;
			vm.selectedItem_fiche_supervision = {} ;
			vm.fiche_supervision_masque = {} ;
		}
		vm.supprimer_fiche_supervision = function(item) {
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
				vm.save_fiche_supervision(vm.selectedItem_fiche_supervision,1);
			}, function() {
            //alert('rien');
			});
        };	  
		// Fin Fonction Fiche supérvisiont	
		// Début Fonction points vérifiés
		vm.save_point_verifie = function(point_cont,suppression) {
			vm.disable_button = true ;
			var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };

			var id_idv = 0 ;
			if (!vm.nouvelle_element_point_verifie) {
				var id_idv = point_cont.id ;
			}
			var datas = $.param(
                    {    
                      supprimer:suppression,
                      id: id_idv ,
                      id_fiche_supervision: vm.selectedItem_fiche_supervision.id,
                      theme_activite: point_cont.theme_activite,
                      intitule_verifie: point_cont.intitule_verifie,
                      prevision: point_cont.prevision,
                      reelle: point_cont.reelle,
                      observation: point_cont.observation,
                    });
			apiFactory.add("point_verifies/index",datas, config).success(function (data) {
				vm.disable_button = false ;
				vm.affichage_masque_point_verifie = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
				console.log(vm.nouvelle_element_point_verifie);
				if (!vm.nouvelle_element_point_verifie) {
					if(suppression==1) {
						vm.all_point_verifie = vm.all_point_verifie.filter(function(obj) {
							return obj.id !== vm.currentItemPointverifie.id;
						});
						vm.selectedItem_point_verifie ={};
					} else {
						vm.selectedItem_point_verifie.id =point_cont.id;
						vm.selectedItem_point_verifie.id_fiche_supervision =vm.selectedItem_fiche_supervision.id;
						vm.selectedItem_point_verifie.theme_activite = point_cont.theme_activite;
						vm.selectedItem_point_verifie.intitule_verifie = point_cont.intitule_verifie;
						vm.selectedItem_point_verifie.prevision = point_cont.prevision;
						vm.selectedItem_point_verifie.reelle = point_cont.reelle;
						vm.selectedItem_point_verifie.observation = point_cont.observation;
						vm.selectedItem_point_verifie.$selected = false;
						vm.selectedItem_point_verifie.$edit = false;
						vm.selectedItem_point_verifie ={};
					}	
				} else {
						point_cont.id=data.response;	
						vm.selectedItem_point_verifie.$selected=false;
						vm.selectedItem_point_verifie.$edit=false;
						vm.selectedItem_point_verifie= {}  ;
				}       
			}).error(function (data) {
				vm.disable_button = false ;
				vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
			});
		}
		vm.selection_point_verifie= function (item) {
			console.log(item);
			if (!vm.affichage_masque_point_verifie)  {
				vm.selectedItem_point_verifie = item;
				vm.nouvelItem_point_verifie   = item;
				vm.currentItemPointverifie = angular.copy(vm.selectedItem_point_verifie);
			}       
		}
		$scope.$watch('vm.selectedItem_point_verifie', function() {
			if (!vm.all_point_verifie) return;
			vm.all_point_verifie.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem_point_verifie.$selected = true;
		});
		vm.ajout_point_verifie = function()  {
			vm.affichage_masque_point_verifie = true ;
			vm.nouvelle_element_point_verifie = true ;
			var items = {
				$edit: true,
				$selected: true,
				supprimer:0,
				id_fiche_supervision: vm.selectedItem_fiche_supervision.id,
				theme_activite:null,
				intitule_verifie:null,
				prevision:null,
				reelle:null,
				observation:null,
				id:null,
			};
			vm.all_point_verifie.push(items);
			vm.all_point_verifie.forEach(function(it) {
				if(it.$selected==true) {
					vm.selectedItem_point_verifie = it;
				}
			});						
		}
		vm.modifier_point_verifie = function(item)  {
			// vm.affichage_masque_point_verifie = true ;
			// vm.menage_mlpl_masque={};
			// vm.menage_mlpl_masque.theme_activite = vm.selectedItem_point_verifie.theme_activite ;
			vm.nouvelle_element_point_verifie= false ;
			vm.selectedItem_point_verifie = item;
			vm.currentItem = angular.copy(vm.selectedItem_point_verifie);
			$scope.vm.all_point_verifie.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItem_point_verifie.id_fiche_supervision = parseInt(vm.selectedItem_point_verifie.id_fiche_supervision);
			vm.selectedItem_point_verifie.theme_activite = (vm.selectedItem_point_verifie.theme_activite);
			vm.selectedItem_point_verifie.intitule_verifie = (vm.selectedItem_point_verifie.intitule_verifie);
			vm.selectedItem_point_verifie.prevision = vm.selectedItem_point_verifie.prevision;
			vm.selectedItem_point_verifie.reelle = vm.selectedItem_point_verifie.reelle;
			vm.selectedItem_point_verifie.observation = vm.selectedItem_point_verifie.observation;
			vm.selectedItem_point_verifie.$edit = true;	

		}
		vm.annuler_point_verifie = function(item)  {
			if (!item.id) {
				vm.all_point_verifie.pop();
				vm.nouvelle_element_point_verifie = false ;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			vm.nouvelle_element_point_verifie = false ;
			
			 item.id_fiche_supervision = vm.currentItemPointverifie.id_fiche_supervision;
			 item.theme_activite = vm.currentItemPointverifie.theme_activite;
			 item.intitule_verifie = vm.currentItemPointverifie.intitule_verifie;
			 item.prevision = vm.currentItemPointverifie.prevision;
			 item.reelle = vm.currentItemPointverifie.reelle;
			 item.observation = vm.currentItemPointverifie.observation;
			vm.selectedItem_point_verifie = {} ;
			vm.selectedItem_point_verifie.$selected = false;
			
		}
		vm.supprimer_point_verifie = function(item) {
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
				vm.save_point_verifie(vm.selectedItem_point_verifie,1);
			}, function() {
            //alert('rien');
			});
        };	  
		// Fin Fonction points vérifiés		
		// Début Fonction probleme solution
		vm.save_probleme_solution = function(probleme_solution,suppression) {
			vm.disable_button = true ;
			var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };

			var id_idv = 0 ;
			if (!vm.nouvelle_element_probleme_solution) {
				var id_idv = probleme_solution.id ;
			}
			var datas = $.param(
                    {    
                      supprimer:suppression,
                      id: id_idv ,
                      id_fiche_supervision: vm.selectedItem_fiche_supervision.id,
                      probleme_constate: probleme_solution.probleme_constate,
                      solution_proposee: probleme_solution.solution_proposee,
                    });
			apiFactory.add("probleme_solutionrole/index",datas, config).success(function (data) {
				vm.disable_button = false ;
				vm.affichage_masque_probleme_solution = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
				console.log(vm.nouvelle_element_probleme_solution);
				if (!vm.nouvelle_element_probleme_solution) {
					if(suppression==1) {
						vm.all_probleme_solution = vm.all_probleme_solution.filter(function(obj) {
							return obj.id !== vm.currentItemPointcontrole.id;
						});
						vm.selectedItem_probleme_solution ={};
					} else {
						vm.selectedItem_probleme_solution.id =probleme_solution.id;
						vm.selectedItem_probleme_solution.id_fiche_supervision =vm.selectedItem_fiche_supervision.id;
						vm.selectedItem_probleme_solution.probleme_constate = probleme_solution.probleme_constate;
						vm.selectedItem_probleme_solution.solution_proposee = probleme_solution.solution_proposee;
						vm.selectedItem_probleme_solution.$selected = false;
						vm.selectedItem_probleme_solution.$edit = false;
						vm.selectedItem_probleme_solution ={};
					}	
				} else {
						probleme_solution.id=data.response;	
						vm.selectedItem_probleme_solution.$selected=false;
						vm.selectedItem_probleme_solution.$edit=false;
						vm.selectedItem_probleme_solution= {}  ;
				}       
			}).error(function (data) {
				vm.disable_button = false ;
				vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
			});
		}
		vm.selection_probleme_solution= function (item) {
			console.log(item);
			if (!vm.affichage_masque_probleme_solution)  {
				vm.selectedItem_probleme_solution = item;
				vm.nouvelItem_probleme_solution   = item;
				vm.currentItemPointcontrole = angular.copy(vm.selectedItem_probleme_solution);
			}       
		}
		$scope.$watch('vm.selectedItem_probleme_solution', function() {
			if (!vm.all_probleme_solution) return;
			vm.all_probleme_solution.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem_probleme_solution.$selected = true;
		});
		vm.ajout_probleme_solution = function()  {
			vm.affichage_masque_probleme_solution = true ;
			vm.nouvelle_element_probleme_solution = true ;
			var items = {
				$edit: true,
				$selected: true,
				supprimer:0,
				id_fiche_supervision: vm.selectedItem_fiche_supervision.id,
				probleme_constate:null,
				solution_proposee:null,
				id:null,
			};
			vm.all_probleme_solution.push(items);
			vm.all_probleme_solution.forEach(function(it) {
				if(it.$selected==true) {
					vm.selectedItem_probleme_solution = it;
				}
			});						
		}
		vm.modifier_probleme_solution = function(item)  {
			vm.nouvelle_element_probleme_solution= false ;
			vm.selectedItem_probleme_solution = item;
			vm.currentItem = angular.copy(vm.selectedItem_probleme_solution);
			$scope.vm.all_probleme_solution.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItem_probleme_solution.id_fiche_supervision = parseInt(vm.selectedItem_probleme_solution.id_fiche_supervision);
			vm.selectedItem_probleme_solution.probleme_constate = (vm.selectedItem_probleme_solution.probleme_constate);
			vm.selectedItem_probleme_solution.solution_proposee = (vm.selectedItem_probleme_solution.solution_proposee);
			vm.selectedItem_probleme_solution.$edit = true;	

		}
		vm.annuler_probleme_solution = function(item)  {
			if (!item.id) {
				vm.all_probleme_solution.pop();
				vm.nouvelle_element_probleme_solution = false ;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			vm.nouvelle_element_probleme_solution = false ;
			
			 item.id_fiche_supervision = vm.currentItemPointcontrole.id_fiche_supervision;
			 item.probleme_constate = vm.currentItemPointcontrole.probleme_constate;
			 item.solution_proposee = vm.currentItemPointcontrole.solution_proposee;
			vm.selectedItem_probleme_solution = {} ;
			vm.selectedItem_probleme_solution.$selected = false;
			
		}
		vm.supprimer_probleme_solution = function(item) {
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
				vm.save_probleme_solution(vm.selectedItem_probleme_solution,1);
			}, function() {
            //alert('rien');
			});
        };	  
		// Fin Fonction probleme solution				
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
		vm.get_livrable_consultant_by_contrat = function(id_sous_projet) {
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("livrable_consultant/index","cle_etrangere",id_sous_projet).then(function(result) 	{ 
				vm.all_livrable_consultant =[];
				vm.all_livrable_consultant = result.data.response; 
				vm.affiche_load = false ;
			});
		}
		vm.get_point_controle_by_consultant = function(id_livrable) {
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("point_controle/index","cle_etrangere",id_livrable).then(function(result) { 
				vm.all_point_controle =[];
				vm.all_point_controle = result.data.response;   
				vm.affiche_load = false;
			});
		}
		vm.get_fiche_supervision_by_contrat = function(id_sous_projet) {
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("fiche_supervision/index","cle_etrangere",id_sous_projet).then(function(result) 	{ 
				vm.all_fiche_supervision =[];
				vm.all_fiche_supervision = result.data.response; 
				vm.affiche_load = false ;
			});
		}
		vm.get_point_verifie_et_probleme_solution_by_supervision = function(id_fiche_supervision) {
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("point_verifies/index","cle_etrangere",id_fiche_supervision).then(function(result) { 
				vm.all_point_verifie =[];
				vm.all_point_verifie = result.data.response;   
				vm.affiche_load = false;
				apiFactory.getAPIgeneraliserREST("probleme_solution/index","cle_etrangere",id_fiche_supervision).then(function(result) { 
					vm.all_probleme_solution =[];
					vm.all_probleme_solution = result.data.response;   
					vm.affiche_load = false;
				});
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

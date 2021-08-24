(function ()
{
    'use strict';
    angular
        .module('app.pfss.suivi_evaluation.suivi_evaluation_planning.planning_ddb')
        .controller('PlanningddbController', PlanningddbController);

    /** @ngInject */
    function PlanningddbController(apiFactory, $state, $mdDialog, $scope, serveur_central,$cookieStore) 
    {
		var vm = this;
		vm.serveur_central = serveur_central ;    
		vm.all_planning_ddb = [] ;
		vm.planning_ddb_column =[{titre:"Description "},{titre:"Vague "},{titre:"Resp exécution"},{titre:"Resp supervision"},{titre:"Couleur"}];
		// ,{titre:"Affichage"}
		vm.dtOptions_new = {
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple_numbers',
			retrieve:'true',
			order:[] 
		};
	   vm.dtOptions =
      {
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple',
			// autoWidth: false,
			order: []
      };
      vm.code_couleur = [{titre:"Vert foncé",statut:"#31CB17"},{titre:"Vert clair",statut:"#93FF12"},
	  {titre:"Jaune",statut:"#FFFF33"},{titre:"Bleu",statut:"#2E76FF"},{titre:"Rouge",statut:"#FF0000"},{titre:"Rouge foncé",statut:"#C6082A"}];
		vm.formatMillier = function (nombre) {
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
		vm.affiche_reponse = function(parametre) {
			if(parametre==0) {
				return "Non";
			} else if(parametre==1){
				return "Oui";
			} else {
				return "";
			}
        };
      vm.code_couleur = [{valeur_affiche:"Rouge",valeur:"#FF0000"},{valeur_affiche:"Rouge foncé",valeur:"#C6082A"},
	  {valeur_affiche:"Bleu",valeur:"#2E76FF"},{valeur_affiche:"Vert clair",valeur:"#93FF12"},
	  {valeur_affiche:"Vert foncé",valeur:"#31CB17"},{valeur_affiche:"Jaune",valeur:"#FFFF33"}];
		vm.affiche_couleur = function(couleur) {
			switch (couleur) {
				case '#FF0000':
					return 'Rouge';
					break;
				case '#C6082A':
					return 'Rouge foncé';
					break;
				case '#2E76FF':
					return 'Bleu';
					break;
				case '#93FF12':
					return 'Vert clair';
					break;
				case '#31CB17':
					return 'Vert foncé';
					break;
				case '#FFFF33':
					return 'Jaune';
					break;
				default:
					return '';
					break;
			}		
			if(parametre==0) {
				return "Non";
			} else if(parametre==1){
				return "Oui";
			} else {
				return "";
			}
        };
        vm.affiche_load = true ;
		vm.selected_planning_ddb = {} ;
		var current_selected_planning_ddb = {} ;
		vm.nouvelle_planning_ddb = false ;      
        apiFactory.getAll("planning_ddb/index").then(function(result){
			vm.all_planning_ddb = result.data.response;
			vm.affiche_load = false ;
        });        
		vm.selection_planning_ddb = function(item)  {
			vm.selected_planning_ddb = item ;
			if (!vm.selected_planning_ddb.$edit) { //si simple selection        
				vm.nouvelle_planning_ddb = false ;  
			}
        }
        $scope.$watch('vm.selected_planning_ddb', function() {
			if (!vm.all_planning_ddb) return;
			vm.all_planning_ddb.forEach(function(item) {
				item.$selected = false;
			});
			vm.selected_planning_ddb.$selected = true;
        });
        vm.ajouter_planning_ddb = function() {
          vm.nouvelle_planning_ddb = true ;
          var item = {            
              $edit: true,
              $selected: true,
                      id:'0',                     
                      description:'',
                      vague:1,
                      responsable_execution:'',
                      responsable_supervision:'',
                      couleur:''                    
            } ;
			vm.all_planning_ddb.unshift(item);
			vm.all_planning_ddb.forEach(function(af) {
				if(af.$selected == true) {
					vm.selected_planning_ddb = af;                  
				}
			});
		}
        vm.modifier_planning_ddb = function()  {
			vm.nouvelle_planning_ddb = false ;
			vm.selected_planning_ddb.$edit = true;       
			current_selected_planning_ddb = angular.copy(vm.selected_planning_ddb);
			vm.selected_planning_ddb.vague = Number( vm.selected_planning_ddb.vague);
        }
        vm.supprimer_planning_ddb = function()   {         
          var confirm = $mdDialog.confirm()
            .title('Etes-vous sûr de supprimer cet enregistrement ?')
            .textContent('Cliquer sur OK pour confirmer')
            .ariaLabel('Lucky day')
            .clickOutsideToClose(true)
            .parent(angular.element(document.body))
            .ok('OK')
            .cancel('Annuler');
			$mdDialog.show(confirm).then(function() {
				vm.enregistrer_planning_ddb(1);
			}, function() {
				//alert('rien');
			});
        }
        vm.annuler_planning_ddb = function() {
			if (vm.nouvelle_planning_ddb) {         
				vm.all_planning_ddb.shift();
				vm.selected_planning_ddb = {} ;
				vm.nouvelle_planning_ddb = false ;
			} else {
				if (!vm.selected_planning_ddb.$edit) { //annuler selection            
					vm.selected_planning_ddb.$selected = false;
					vm.selected_planning_ddb = {};
				}  else {
					vm.selected_planning_ddb.$selected = false;
					vm.selected_planning_ddb.$edit = false;              
					vm.selected_planning_ddb.description = current_selected_planning_ddb.description ;
					vm.selected_planning_ddb.vague = current_selected_planning_ddb.vague ;
					vm.selected_planning_ddb.responsable_execution = current_selected_planning_ddb.responsable_execution 
					vm.selected_planning_ddb.responsable_supervision = current_selected_planning_ddb.responsable_supervision 
					vm.selected_planning_ddb.couleur = current_selected_planning_ddb.couleur             
					vm.selected_planning_ddb = {};
				}           
			}
        }
        vm.enregistrer_planning_ddb = function(etat_suppression)  {
          vm.affiche_load = true ;
          var config = {
                    headers : {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                };
                var datas = $.param({                 
                    supprimer:etat_suppression,
                    id:vm.selected_planning_ddb.id,                 
                    description : vm.selected_planning_ddb.description ,
                    vague : vm.selected_planning_ddb.vague ,
                    responsable_execution : vm.selected_planning_ddb.responsable_execution,
                    responsable_supervision : vm.selected_planning_ddb.responsable_supervision,
                    couleur : vm.selected_planning_ddb.couleur,                                      
                });
                apiFactory.add("planning_ddb/index",datas, config).success(function (data)  {
					vm.affiche_load = false ;
					if (!vm.nouvelle_planning_ddb) {
						if (etat_suppression == 0) {
							vm.selected_planning_ddb.$edit = false ;
							vm.selected_planning_ddb.$selected = false ;
							vm.selected_planning_ddb = {} ;
						} else  {
							vm.all_planning_ddb = vm.all_planning_ddb.filter(function(obj) {
								return obj.id !== vm.selected_planning_ddb.id;
							});
							vm.selected_planning_ddb = {} ;
						}
					}  else  {
						vm.selected_planning_ddb.$edit = false ;
						vm.selected_planning_ddb.$selected = false ;
						vm.selected_planning_ddb.id = String(data.response) ;
						vm.nouvelle_planning_ddb = false ;
						vm.selected_planning_ddb = {};
					}
				})
				.error(function (data) {alert("Une erreur s'est produit");}); 
        }
    }
})();

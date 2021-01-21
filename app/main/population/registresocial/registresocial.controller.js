(function ()
{
    'use strict';

    angular
        .module('app.population.registresocial')
        .controller('RegistresocialController', RegistresocialController);

    /** @ngInject */
    function RegistresocialController($scope, $mdDialog, apiFactory,$state)
    {
        var vm = this;
        vm.ajout = ajout ;

        var NouvelItem=false;
        var currentItem;
        var nomvl='';
        var nomsitep='';
        vm.selectedItem = {} ;
        vm.allpersonnel = [] ;
        vm.allbeneficiaire = [] ;
        vm.alltypebeneficiaire = [] ;
        vm.allzone = [] ;
        vm.allregion = [] ;
        vm.listedistrict = [] ;
        vm.listecommune = [] ;
        vm.listefokontany = [] ;
        
        //variale affichage bouton nouveau
        vm.afficherboutonnouveau = 1 ;

        //variable cache masque de saisie
        vm.affichageMasque = 0 ;

        vm.sexes = ("Homme;Femme").split(';').map(function (state)
        {
            return {sexe: state};
        });
        //style
		vm.dtOptions = {
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple',
			autoWidth: false,
			responsive: true
		};
		//col table
		vm.personnel_column = [{titre:"Code unique"},{titre:"Nom & Pénom"},{titre:"Date naissance"},{titre:"Date d'inscription"},{titre:"Type bénéf."},{titre:"Fokontany"}];
		vm.membre_column = [{titre:"Nom & Pénom"},{titre:"Date naissance"},{titre:"Date d'inscription"},{titre:"Type bénéf."},{titre:"Fokontany"}];
		apiFactory.getAll("region/index").then(function(result) {
			vm.allregion= result.data.response;
		});
		apiFactory.getAll("fokontany/index").then(function(result) {
			vm.listefokontany= result.data.response;
			apiFactory.getAll("type_beneficiaire/index").then(function(result){
				vm.alltypebeneficiaire = result.data.response;
				console.log(vm.alltypebeneficiaire);
			});
		});
		apiFactory.getAll("beneficiaire/index").then(function(result){
			vm.allbeneficiaire = result.data.response;
			console.log(vm.allbeneficiaire);
		});
        //Debut
        function ajout(beneficiaire,suppression) {
            if (NouvelItem==false) {
                test_existance (beneficiaire,suppression); 
            } else {
              
                insert_in_base(beneficiaire,suppression);
            }                                        
        }
        function test_existance (item,suppression) {          
            if (suppression!=1) {
                vm.allbeneficiaire.forEach(function(indic) {               
                  if (indic.id==item.id) {
                      insert_in_base(item,suppression);
                      vm.affichageMasque = 0 ;
                     }
                     else {
                    vm.affichageMasque = 0 ;
                    }
                  
                });
            } else {        
				insert_in_base(item,suppression);
			} 
        } 
        function insert_in_base(beneficiaire,suppression) {
            //add
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            var getId = 0;
            if (NouvelItem==false) {
               getId = vm.selectedItem.id; 
            } 
            var datas = $.param({
                    id:getId,
                    supprimer:suppression,
                    code: beneficiaire.code,
                    nom: beneficiaire.nom,
                    prenom: beneficiaire.prenom,
                    cin: beneficiaire.cin,
                    chef_menage: beneficiaire.chef_menage,
                    adresse: beneficiaire.adresse,
                    date_naissance: beneficiaire.date_naissance,
                    profession: beneficiaire.profession,
                    situation_matrimoniale: beneficiaire.situation_matrimoniale,
                    sexe: beneficiaire.sexe,
                    date_inscription: beneficiaire.date_inscription,
                    revenu_mensuel: beneficiaire.revenu_mensuel,
                    depense_mensuel: beneficiaire.depense_mensuel,
                    id_fokontany: beneficiaire.id_fokontany,
                    id_type_beneficiaire: beneficiaire.id_type_beneficiaire,
            });  
            //factory
            apiFactory.add("beneficiaire/index",datas, config).success(function (data) {
				if (NouvelItem == false) {                 
                    // Update or delete: id exclu                    
                    if(suppression==0) { 
						vm.selectedItem.code=beneficiaire.code;
						vm.selectedItem.nom=beneficiaire.nom;                 
						vm.selectedItem.prenom=beneficiaire.prenom;                 
						vm.selectedItem.cin=beneficiaire.cin; 
						vm.selectedItem.chef_menage=beneficiaire.chef_menage;
						vm.selectedItem.adresse=beneficiaire.adresse;
						vm.selectedItem.date_naissance=beneficiaire.date_naissance;
						vm.selectedItem.profession=beneficiaire.profession; 
						vm.selectedItem.situation_matrimoniale=beneficiaire.situation_matrimoniale;  
						vm.selectedItem.sexe=beneficiaire.sexe; 
						vm.selectedItem.date_inscription=beneficiaire.date_inscription; 
						vm.selectedItem.revenu_mensuel=beneficiaire.revenu_mensuel; 
						vm.selectedItem.depense_mensuel=beneficiaire.depense_mensuel; 
						vm.selectedItem.id_fokontany=beneficiaire.fokontany; 
						vm.selectedItem.id_type_beneficiaire=beneficiaire.id_type_beneficiaire; 
						vm.selectedItem.fokontany=beneficiaire.fokontany; 
						vm.selectedItem.type_beneficiaire=beneficiaire.type_beneficiaire; 
						vm.afficherboutonModifSupr = 0 ;
						vm.afficherboutonnouveau = 1 ;
						vm.selectedItem.$selected = false;
						vm.selectedItem ={};
						console.log(beneficiaire);
                    } else {                      
						vm.allbeneficiaire = vm.allbeneficiaire.filter(function(obj) {
							return obj.id !== currentItem.id;
						});
                    }
				} else {                               
                    var item = {
						code: beneficiaire.code,
						nom: beneficiaire.nom,
						prenom:beneficiaire.prenom,
						cin: beneficiaire.cin,
						chef_menage: beneficiaire.chef_menage,
						adresse: beneficiaire.adresse,
						date_naissance: beneficiaire.date_naissance,
						profession: beneficiaire.profession,
						situation_matrimoniale: beneficiaire.situation_matrimoniale,
						sexe: beneficiaire.sexe,
						date_inscription: beneficiaire.date_inscription,
						revenu_mensuel: beneficiaire.revenu_mensuel,
						depense_mensuel: beneficiaire.depense_mensuel,
						id_fokontany: beneficiaire.id_fokontany,
						id_type_beneficiaire: beneficiaire.id_type_beneficiaire,
						fokontany: beneficiaire.fokontany,
						type_beneficiaire: beneficiaire.type_beneficiaire,
						id:String(data.response) ,
					};
					vm.allbeneficiaire.push(item); 
                    NouvelItem=false;
				}
                  vm.affichageMasque = 0 ;
			})
        }
        //Fin
		function test_sexe(stp) {
			switch (stp) {
				case "1": {
					return 1 ;
					break ;
				}
				case "0": {
					return 0 ;
					break ;
				}
			}
		}
		function formatDate(date) {
			var mois = date.getMonth()+1;
			var dateSQL = (date.getFullYear()+"/"+mois+"/"+date.getDate());
			return dateSQL;

		}
		function parseDate(date) {
			var d = moment(date, 'YYYY-MM-DD', true);
			return d.isValid() ? d.toDate() : new Date(NaN);
		}
        function affichage_sexe(stp) {
            var s = (stp);          
            switch (s) {
                case "1": {
                    return "Homme" ;
                    break ;
                }
                case "0": {
                    return "Femme" ;
                    break ;
                }
                default: {
                  return "???" ;
                  break;
                }                          
            }
        }
		function affichage_editsexe(stp) {
            var s = (stp);         
            switch (s) {
                case "1": {
                    return 1 ;
                    break ;
                }
                case "0":  {
                    return 0 ;
                    break ;
                }
                default: {
                  return "???" ;
                  break;
                }                        
            }
        }
		//Début modif
		vm.selection= function (item) {     
            vm.selectedItem = item;
            vm.nouvelItem = item;
            currentItem = JSON.parse(JSON.stringify(vm.selectedItem));       
            vm.afficherboutonModifSupr = 1 ;
            vm.affichageMasque = 0 ;
            vm.afficherboutonnouveau = 1 ;
            NouvelItem=false;
        };
        $scope.$watch('vm.selectedItem', function() {
			if (!vm.allbeneficiaire) return;
			vm.allbeneficiaire.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
        });
        vm.ajouter = function () {
			vm.selectedItem.$selected = false;
			vm.affichageMasque = 1 ;
			vm.beneficiaire.code='';
			vm.beneficiaire.nom='';
			vm.beneficiaire.prenom='';
			vm.beneficiaire.cin='';
			vm.beneficiaire.chef_menage=0;
			vm.beneficiaire.adresse='';
			vm.beneficiaire.date_naissance='';
			vm.beneficiaire.profession='';
			vm.beneficiaire.situation_matrimoniale='';
			vm.beneficiaire.sexe='';
			vm.beneficiaire.date_inscription='';
			vm.beneficiaire.revenu_mensuel='';
			vm.beneficiaire.depense_mensuel='';
			vm.beneficiaire.id_fokontany='';
			vm.beneficiaire.id_type_beneficiaire='';
			NouvelItem = true ;
        };
        vm.annuler = function() {
			vm.selectedItem = {} ;
			vm.selectedItem.$selected = false;
			vm.affichageMasque = 0 ;
			vm.afficherboutonnouveau = 1 ;
			vm.afficherboutonModifSupr = 0 ;
			NouvelItem = false;
        };
		vm.modifier = function() {
			NouvelItem = false ;
			vm.affichageMasque = 1 ;
			vm.beneficiaire.code = vm.selectedItem.code ;
			vm.beneficiaire.nom = vm.selectedItem.nom ;
			vm.beneficiaire.prenom=vm.selectedItem.prenom;
			vm.beneficiaire.cin = vm.selectedItem.cin ;
			if(vm.selectedItem.chef_menage) {
				vm.beneficiaire.chef_menage=parseInt(vm.selectedItem.chef_menage);
			}
			vm.beneficiaire.adresse = vm.selectedItem.adresse ;
			if(vm.selectedItem.date_naissance) {
				vm.beneficiaire.date_naissance=new Date(vm.selectedItem.date_naissance);
			}
			vm.beneficiaire.profession = vm.selectedItem.profession ;
			vm.beneficiaire.situation_matrimoniale = vm.selectedItem.situation_matrimoniale ;
			vm.beneficiaire.sexe = vm.selectedItem.sexe ;
			if(vm.selectedItem.date_inscription) {
				vm.beneficiaire.date_inscription=new Date(vm.selectedItem.date_inscription);
			}
			if(vm.selectedItem.revenu_mensuel) {
				vm.beneficiaire.revenu_mensuel=parseFloat(vm.selectedItem.revenu_mensuel);
			}
			if(vm.selectedItem.depense_mensuel) {
				vm.beneficiaire.depense_mensuel=parseFloat(vm.selectedItem.depense_mensuel);
			}
			vm.beneficiaire.id_fokontany = vm.selectedItem.id_fokontany ;
			vm.beneficiaire.id_type_beneficiaire = vm.selectedItem.id_type_beneficiaire ;
			vm.beneficiaire.id = vm.selectedItem.id ;
			vm.afficherboutonModifSupr = 0;
			vm.afficherboutonnouveau = 0;  
        };
		vm.supprimer = function() {
			NouvelItem = false ;
			vm.affichageMasque = 0 ;
			vm.afficherboutonModifSupr = 0 ;
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('ok')
                .cancel('annuler');

			$mdDialog.show(confirm).then(function() {           
				ajout(vm.selectedItem,1);
			}, function() {
            //alert('rien');
			});
        };
        vm.modifierFokontany = function (item) { 
			vm.nontrouvee=true;
			vm.listefokontany.forEach(function(fkt) {
				if(fkt.id==item.id_fokontany) {
					vm.beneficiaire.id_fokontany = fkt.id; 
					vm.beneficiaire.fokontany=[];
					var itemss = {
						id: fkt.id,
						fokontany: fkt.code,
						id_commune: fkt.id_commune,
						code: fkt.code,
					};
					vm.beneficiaire.fokontany.push(itemss);
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.beneficiaire.id_fokontany = ''; 
					vm.beneficiaire.fokontany=[];
			}
		}
        vm.modifierTypeBeneficiaire = function (item) { 
			vm.nontrouvee=true;
			vm.alltypebeneficiaire.forEach(function(benef) {
				if(benef.id==item.id_type_beneficiaire) {
					vm.beneficiaire.id_type_beneficiaire = benef.id; 
					vm.beneficiaire.type_beneficiaire=[];
					var itemss = {
						id: benef.id,
						description: benef.description,
					};
					vm.beneficiaire.type_beneficiaire.push(itemss);
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.beneficiaire.id_type_beneficiaire = ''; 
					vm.beneficiaire.type_beneficiaire=[];
			}
		}
    }
})();

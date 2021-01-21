(function ()
{
    'use strict';

    angular
        .module('app.population.importdecoupage.decoupagecommune')
        .controller('DecoupagecommuneController', DecoupagecommuneController);
    /** @ngInject */
    function DecoupagecommuneController($mdDialog, $scope, apiFactory, $state,apiUrl)  {
		var vm = this;
		vm.ajout = ajout ;
		var NouvelItem=false;
		var currentItem;
		vm.selectedItem = {} ;
		vm.allcommune = [] ;     
		//variale affichage bouton nouveau
		vm.afficherboutonnouveau = 1 ;
		//variable cache masque de saisie
		vm.affichageMasque = 0 ;
		vm.cliquable=1;
		//style
		vm.dtOptions = {
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple',
			autoWidth: false,
			responsive: true
		};
		//col table
		vm.region_column = [{titre:"Code"},{titre:"Nom"}];
		apiFactory.getAll("commune/index").then(function(result) {
			vm.allcommune = result.data.response;    
		});
 		vm.showAlert = function(titre,textcontent) {
			// Appending dialog to document.body to cover sidenav in docs app
			// Modal dialogs should fully cover application
			// to prevent interaction outside of dialog
			$mdDialog.show(
			  $mdDialog.alert()
				.parent(angular.element(document.querySelector('#popupContainer')))
				.clickOutsideToClose(false)
				.parent(angular.element(document.body))
				.title(titre)
				.textContent(textcontent)
				.ariaLabel('Alert Dialog Demo')
				.ok('Fermer')
				.targetEvent()
			);
		}      
      function ajout(region,suppression) {
              if (NouvelItem==false) {
                test_existance (region,suppression); 
              } else {
                insert_in_base(region,suppression);
              }
        }
        function insert_in_base(region,suppression) {
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
                supprimer:suppression,
                id:getId,      
                code: region.code,
                nom: region.nom,
                surface:region.surface,               
            });
            //factory
            apiFactory.add("region/index",datas, config).success(function (data) {
				if (NouvelItem == false) {
                    // Update or delete: id exclu                 
                    if(suppression==0) {
						vm.selectedItem.nom = vm.region.nom;
						vm.selectedItem.code = vm.region.code;
						vm.selectedItem.surface = vm.region.surface;
						vm.afficherboutonModifSupr = 0 ;
						vm.afficherboutonnouveau = 1 ;
						vm.selectedItem.$selected = false;
						vm.selectedItem ={};
                    } else {    
						vm.allcommune = vm.allcommune.filter(function(obj) {
							return obj.id !== currentItem.id;
						});
                    }
				}  else {
                    var item = {
                        nom: region.nom,
                        code: region.code,
                        id:String(data.response) ,
                        surface:region.surface 
                    };                
                    vm.allcommune.push(item);
                    vm.region = {} ;                   
                    NouvelItem=false;
				}
					vm.affichageMasque = 0 ;
                }).error(function (data) {
                    alert('Error');
                });                
        }
		vm.selection= function (item) {
			vm.selectedItem = item;
			vm.nouvelItem = item;
			currentItem = JSON.parse(JSON.stringify(vm.selectedItem));
			vm.afficherboutonModifSupr = 1 ;
			vm.affichageMasque = 0 ;
			vm.afficherboutonnouveau = 1 ;
		};
		$scope.$watch('vm.selectedItem', function() {
			if (!vm.allcommune) return;
			vm.allcommune.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
		});
      //function cache masque de saisie
        vm.ajouter = function () {
			vm.selectedItem.$selected = false;
			vm.affichageMasque = 1 ;
			vm.region = {} ;
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
          vm.region.id = vm.selectedItem.id ;
          vm.region.code = vm.selectedItem.code ;
          vm.region.nom = vm.selectedItem.nom ;
		  if(vm.selectedItem.surface) {
			vm.region.surface = parseInt(vm.selectedItem.surface) ;
		  }
          vm.afficherboutonModifSupr = 0;
          vm.afficherboutonnouveau = 0;  
        };
        vm.supprimer = function() {
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
            vm.ajout(vm.selectedItem,1);
          }, function() {
            //alert('rien');
          });
        };
        function test_existance (item,suppression) {          
            if (suppression!=1) {
                vm.allcommune.forEach(function(reg) {               
					if (reg.id==item.id) {
						// if((reg.nom!=item.nom) || (reg.code!=item.code) || (reg.surface!=item.surface)) {
							insert_in_base(item,suppression);
							vm.affichageMasque = 0 ;
					/*	} else {
							vm.affichageMasque = 0 ;
						}*/
					}
                });
            }  else
              insert_in_base(item,suppression);
        }
        vm.Importer_Region = function() {
			vm.cliquable=0;
			var bla = $.post(apiUrl + "importerdecoupageadministratif/importfichierdecoupageadministratifcommune",{
				repertoire:'importdecoupage/',
				nomfichier : "commune.xlsx"
			},function(data){	
				vm.allcommune=[];
				vm.cliquable=1;
				if(data.erreur!="") {
					vm.showAlert("ERREUR !",data.erreur);
				} else {
					vm.showAlert("INFORMATION !",'Importé avec succès. Merci !');						
				}
				vm.allcommune=data.donnees;
			});
        };
    }
})();

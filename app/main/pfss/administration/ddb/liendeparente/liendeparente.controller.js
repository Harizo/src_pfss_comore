(function ()
{
    'use strict';
    angular
        .module('app.pfss.ddb_adm.liendeparente')
        .controller('LiendeparenteController', LiendeparenteController);

    /** @ngInject */
    function LiendeparenteController(apiFactory, $state, $mdDialog, $scope, serveur_central,$cookieStore) {
		// Déclaration des variables et fonctions
		var vm = this;

		vm.serveur_central = serveur_central ;
		console.log(vm.serveur_central);
		vm.titrepage ="Ajout Tutelle";
		vm.ajout = ajout ;
		var NouvelItemLien_de_parente=false;
		var currentItemLien_de_parente;
		vm.selectedItemLien_de_parente = {} ;
		vm.ileSelected = false;

		vm.currentId_ile=0;
		//vm.allregion =[];
		vm.allRecordsliendeparente = [] ;
		vm.nom_table="liendeparente";
		//vm.cas=1;
		//variale affichage bouton nouveau
		//variable cache masque de saisie
		//style
		vm.dtOptions = {
		dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
		pagingType: 'simple',
		autoWidth: false,
		responsive: true
		};
		//col table
		vm.Lien_de_parente_column =[
		{titre:"description"},
		{titre:"Actions"}
		];
         apiFactory.getAll("lienparental/index").then(function(result)
        { 
          vm.allRecordsliendeparente = result.data.response;    
          
        });
		vm.download_ddb = function(controller,table)
		{
			var nbr_data_insert = 0 ;
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};

			apiFactory.getAll_acteur_serveur_central(controller).then(function(result){
				var ddb = result.data.response;

				console.log(ddb);
				var datas_suppr = $.param({
						supprimer:1,
						nom_table: table,
					}); 

				apiFactory.add("delete_ddb/index",datas_suppr, config).success(function (data) {
						//add ddb
							ddb.forEach( function(element, index) {
								switch (table) {
									case "liendeparente":
										// statements_1
										var datas = $.param({
											supprimer:0,
											etat_download:true,
											id:element.id,      
											description: element.description,
											a_ete_modifie: 0,
										});   
										break;
									default:
										// statements_def
										break;
								}

								apiFactory.add(controller,datas, config).success(function (data) {
									nbr_data_insert++ ;
									if ((index+1) == ddb.length) //affichage Popup
									{
										vm.showAlert('Information',nbr_data_insert+' enregistrement ajoutÃ© avec SuccÃ¨s !');
									}
								}).error(function (data) {
									vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
								});
							});
						//add ddb

				}).error(function (data) {
					vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
				});
				switch (table) 
				{
					case "see_typeplainte":
						vm.allRecordsliendeparente = ddb ;
						break;
					default:

						break;
				}
			});  
		}
	// Debut lien de parenté
		function ajout(agent_e,suppression) {
            
            if (NouvelItemLien_de_parente==false) 
              {
                test_existence (agent_e,suppression); 
              }
              else
              {
                insert_in_base(agent_e,suppression);
              }
        }
        function insert_in_base(type_pl,suppression) {  
			//add
			
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var getId = 0;
			if (NouvelItemLien_de_parente==false) {
			   getId = vm.selectedItemLien_de_parente.id; 
			} 
			var datas = $.param({
				supprimer:suppression,
				id:getId,      
				description: type_pl.description,      
				a_ete_modifie: 0,
			});       
			//factory
			apiFactory.add("lienparental/index",datas, config).success(function (data)
			{	
				if (NouvelItemLien_de_parente == false) {
					// Update or delete: id exclu 
					//console.log('noufalse');                  
					if(suppression==0) {
					  vm.selectedItemLien_de_parente.description = type_pl.description;
					  vm.selectedItemLien_de_parente.a_ete_modifie = 0;
					  vm.selectedItemLien_de_parente.$selected = false;
					  vm.selectedItemLien_de_parente.$edit = false;
					  vm.selectedItemLien_de_parente ={};
					} else {    
						vm.allRecordsliendeparente = vm.allRecordsliendeparente.filter(function(obj) {
							return obj.id !== vm.selectedItemLien_de_parente.id;
						});
					}
				} else {
					type_pl.id=data.response;
					// type_pl.programme=prog[0];
					// type_pl.ile=il[0];
					type_pl.a_ete_modifie=0;
					NouvelItemLien_de_parente=false;
				}
				type_pl.$selected=false;
				type_pl.$edit=false;
			}).error(function (data) {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
        }
        vm.selectionLien_de_parente= function (item) {     
            vm.selectedItemLien_de_parente = item;
        };
        $scope.$watch('vm.selectedItemLien_de_parente', function() {
			if (!vm.allRecordsliendeparente) return;
			vm.allRecordsliendeparente.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemLien_de_parente.$selected = true;
			//console.log(vm.allRecordsliendeparente);
        });
        //function cache masque de saisie
        vm.ajouterLien_de_parente = function () {
            vm.selectedItemLien_de_parente.$selected = false;
            NouvelItemLien_de_parente = true ;
		    var items = {
				$edit: true,
				$selected: true,
				supprimer:0,
                description: '',
                a_ete_modifie: '0',
			};
			vm.allRecordsliendeparente.push(items);
		    vm.allRecordsliendeparente.forEach(function(it) {
				if(it.$selected==true) {
					vm.selectedItemLien_de_parente = it;
				}
			});			
        };
        vm.annulerLien_de_parente = function(item) {
			if (!item.id) {
				vm.allRecordsliendeparente.pop();
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItemLien_de_parente = false;
			item.description = currentItemLien_de_parente.description;
			item.a_ete_modifie = currentItemLien_de_parente.a_ete_modifie;
			vm.selectedItemLien_de_parente = {} ;
			vm.selectedItemLien_de_parente.$selected = false;
       };
        vm.modifierLien_de_parente = function(item) {
			NouvelItemLien_de_parente = false ;
			vm.selectedItemLien_de_parente = item;
			currentItemLien_de_parente = angular.copy(vm.selectedItemLien_de_parente);
			$scope.vm.allRecordsliendeparente.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			item.description = vm.selectedItemLien_de_parente.description;
			item.a_ete_modifie = vm.selectedItemLien_de_parente.a_ete_modifie;
			item.$edit = true;
        };
        vm.supprimerLien_de_parente = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemLien_de_parente,1);
			}, function() {
			});
        }
        function test_existence (item,suppression) {
			if (suppression!=1) {
                var ag = vm.allRecordsliendeparente.filter(function(obj) {
                   return obj.id == item.id;
                });
                if(ag[0]) {
					if(ag[0].description!=currentItemLien_de_parente.description) { 
						insert_in_base(item,suppression);                         
					} else { 
                        item.$selected=false;
						item.$edit=false;
					}
                }
            }
            else
              insert_in_base(item,suppression);		
        }
		// Fin Lien de parenté
		
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
    }
  })();

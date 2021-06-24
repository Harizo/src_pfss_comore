(function ()
{
    'use strict';
    angular
        .module('app.pfss.tdb.tdb_indicateur')
        .controller('TableaudebordindicateurController', TableaudebordindicateurController);

    /** @ngInject */
    function TableaudebordindicateurController(apiFactory, $state, $mdDialog, $scope, serveur_central,$location,$cookieStore) {
		// Déclaration des variables et fonctions
		var vm = this;

		vm.serveur_central = serveur_central ;
		vm.titrepage ="Ajout Tutelle";
		vm.ajout = ajout ;
		var NouvelItemIndicateur=false;
		var currentItemIndicateur;
		vm.selectedItemIndicateur = {} ;
		vm.ileSelected = false;

		vm.currentId_ile=0;
		//vm.allregion =[];
		vm.allRecordsindicateur = [] ;
		vm.nom_table="indicateur_tdb";
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
		vm.Indicateur_column =[
		{titre:"description"},
		{titre:"Actions"}
		];
         apiFactory.getAll("indicateur_tdb/index").then(function(result)
        { 
          vm.allRecordsindicateur = result.data.response;    
          
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
									case "indicateur_tdb":
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
					case "indicateur_tdb":
						vm.allRecordsindicateur = ddb ;
						break;
					default:

						break;
				}
			});  
		}
	// Debut lien de parenté
		function ajout(indicat,suppression) {
            
            if (NouvelItemIndicateur==false) 
              {
                test_existence (indicat,suppression); 
              }
              else
              {
                insert_in_base(indicat,suppression);
              }
        }
        function insert_in_base(indicateur,suppression) {  
			//add
			
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var getId = 0;
			if (NouvelItemIndicateur==false) {
			   getId = vm.selectedItemIndicateur.id; 
			} 
			var datas = $.param({
				supprimer:suppression,
				id:getId,      
				description: indicateur.description,      
				a_ete_modifie: 0,
			});       
			//factory
			apiFactory.add("indicateur_tdb/index",datas, config).success(function (data)
			{	
				if (NouvelItemIndicateur == false) {
					// Update or delete: id exclu 
					//console.log('noufalse');                  
					if(suppression==0) {
					  vm.selectedItemIndicateur.description = indicateur.description;
					  vm.selectedItemIndicateur.a_ete_modifie = 0;
					  vm.selectedItemIndicateur.$selected = false;
					  vm.selectedItemIndicateur.$edit = false;
					  vm.selectedItemIndicateur ={};
					} else {    
						vm.allRecordsindicateur = vm.allRecordsindicateur.filter(function(obj) {
							return obj.id !== vm.selectedItemIndicateur.id;
						});
					}
				} else {
					indicateur.id=data.response;
					// indicateur.programme=prog[0];
					// indicateur.ile=il[0];
					indicateur.a_ete_modifie=0;
					NouvelItemIndicateur=false;
				}
				indicateur.$selected=false;
				indicateur.$edit=false;
			}).error(function (data) {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
        }
        vm.selectionIndicateur= function (item) {     
            vm.selectedItemIndicateur = item;
        };
        $scope.$watch('vm.selectedItemIndicateur', function() {
			if (!vm.allRecordsindicateur) return;
			vm.allRecordsindicateur.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemIndicateur.$selected = true;
			//console.log(vm.allRecordsindicateur);
        });
        //function cache masque de saisie
        vm.ajouterIndicateur = function () {
            vm.selectedItemIndicateur.$selected = false;
            NouvelItemIndicateur = true ;
		    var items = {
				$edit: true,
				$selected: true,
				supprimer:0,
                description: '',
                a_ete_modifie: '0',
			};
			vm.allRecordsindicateur.push(items);
		    vm.allRecordsindicateur.forEach(function(it) {
				if(it.$selected==true) {
					vm.selectedItemIndicateur = it;
				}
			});			
        };
        vm.annulerIndicateur = function(item) {
			if (!item.id) {
				vm.allRecordsindicateur.pop();
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItemIndicateur = false;
			item.description = currentItemIndicateur.description;
			item.a_ete_modifie = currentItemIndicateur.a_ete_modifie;
			vm.selectedItemIndicateur = {} ;
			vm.selectedItemIndicateur.$selected = false;
       };
        vm.modifierIndicateur = function(item) {
			NouvelItemIndicateur = false ;
			vm.selectedItemIndicateur = item;
			currentItemIndicateur = angular.copy(vm.selectedItemIndicateur);
			$scope.vm.allRecordsindicateur.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			item.description = vm.selectedItemIndicateur.description;
			item.a_ete_modifie = vm.selectedItemIndicateur.a_ete_modifie;
			item.$edit = true;
        };
        vm.supprimerIndicateur = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemIndicateur,1);
			}, function() {
			});
        }
        function test_existence (item,suppression) {
			if (suppression!=1) {
                var ag = vm.allRecordsindicateur.filter(function(obj) {
                   return obj.id == item.id;
                });
                if(ag[0]) {
					if(ag[0].description!=currentItemIndicateur.description) { 
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

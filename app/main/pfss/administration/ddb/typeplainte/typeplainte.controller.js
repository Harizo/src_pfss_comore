(function ()
{
    'use strict';
    angular
        .module('app.pfss.ddb_adm.typeplainte')
        .controller('TypeplainteController', TypeplainteController);

    /** @ngInject */
    function TypeplainteController(apiFactory, $state, $mdDialog, $scope, serveur_central,$cookieStore) {
		// Déclaration des variables et fonctions
		var vm = this;

		vm.serveur_central = serveur_central ;
		console.log(vm.serveur_central);
		vm.titrepage ="Ajout Tutelle";
		vm.ajout = ajout ;
		vm.ajoutresultatplainte = ajoutresultatplainte ;
		var NouvelItemType_plainte=false;
		var currentItemType_plainte;
		vm.selectedItemType_plainte = {} ;
		var NouvelItemResultat_plainte=false;
		var currentItemResultat_plainte;
		vm.selectedItemResultat_plainte = {} ;
		vm.ileSelected = false;

		vm.currentId_ile=0;
		//vm.allregion =[];
		vm.allRecordstypeplainte = [] ;
		vm.allRecordsresultatplainte = [] ;
		vm.listevillage = [] ;
		vm.ListePrefecture = [] ;
		vm.ListeCommune = [] ;
		vm.communetmp= [];
		vm.nom_table="type_acteur";
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
		vm.type_plainte_column =[
		{titre:"Code"},
		{titre:"Libellé"},
		{titre:"Actions"}
		];
		apiFactory.getAll("ile/index").then(function(result) {
	        vm.allile= result.data.response;
		});
		apiFactory.getAll("programme/index").then(function(result){
	        vm.allprogramme= result.data.response;
		});
		apiFactory.getAll("type_plainte/index").then(function(result){
			vm.allRecordstypeplainte = result.data.response;
			apiFactory.getAll("resultat_plainte/index").then(function(result){
				vm.allRecordsresultatplainte = result.data.response;
			});    
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
									case "see_typeplainte":
										// statements_1
										var datas = $.param({
											supprimer:0,
											etat_download:true,
											id:element.id,      
											Code: element.Code,
											TypePlainte: element.TypePlainte,
											a_ete_modifie: 0,
										});   
										break;
									case "resultat_plainte":
										// statements_1
										var datas = $.param({
											supprimer:0,
											etat_download:true,
											id:element.id,      
											code: element.code,
											libelle: element.libelle,
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
						vm.allRecordstypeplainte = ddb ;
						break;
					default:

						break;
				}
			});  
		}
	// Debut type plainte
		function ajout(agent_e,suppression) {
            
            if (NouvelItemType_plainte==false) 
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
			if (NouvelItemType_plainte==false) {
			   getId = vm.selectedItemType_plainte.id; 
			} 
			var datas = $.param({
				supprimer:suppression,
				id:getId,      
				Code: type_pl.Code,      
				TypePlainte: type_pl.TypePlainte,      
				a_ete_modifie: 0,
			});       
			//factory
			apiFactory.add("type_plainte/index",datas, config).success(function (data)
			{	
				var prog = vm.allprogramme.filter(function(obj)
                {
                    return obj.id == type_pl.programme_id;
                });
            //console.log(prog[0]);
                var il = vm.allile.filter(function(obj)
                {
                    return obj.id == type_pl.ile_id;
                });
//console.log(il[0]);
				if (NouvelItemType_plainte == false) {
					// Update or delete: id exclu 
					//console.log('noufalse');                  
					if(suppression==0) {
					  vm.selectedItemType_plainte.Code = type_pl.Code;
					  vm.selectedItemType_plainte.TypePlainte = type_pl.TypePlainte;
					  vm.selectedItemType_plainte.a_ete_modifie = 0;
					  // vm.selectedItemType_plainte.ile = il[0];
					  // vm.selectedItemType_plainte.programme = prog[0];
					  vm.selectedItemType_plainte.$selected = false;
					  vm.selectedItemType_plainte.$edit = false;
					  vm.selectedItemType_plainte ={};
					} else {    
						vm.allRecordstypeplainte = vm.allRecordstypeplainte.filter(function(obj) {
							return obj.id !== vm.selectedItemType_plainte.id;
						});
					}
				} else {
					type_pl.id=data.response;
					// type_pl.programme=prog[0];
					// type_pl.ile=il[0];
					type_pl.a_ete_modifie=0;
					NouvelItemType_plainte=false;
				}
				type_pl.$selected=false;
				type_pl.$edit=false;
			}).error(function (data) {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
        }
        vm.selectionType_plainte= function (item) {     
            vm.selectedItemType_plainte = item;
        };
        $scope.$watch('vm.selectedItemType_plainte', function() {
			if (!vm.allRecordstypeplainte) return;
			vm.allRecordstypeplainte.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemType_plainte.$selected = true;
			//console.log(vm.allRecordstypeplainte);
        });
        //function cache masque de saisie
        vm.ajouterType_plainte = function () {
            vm.selectedItemType_plainte.$selected = false;
            NouvelItemType_plainte = true ;
		    var items = {
				$edit: true,
				$selected: true,
				supprimer:0,
                Code: '',
                TypePlainte: '',
                ile_id: '',
                programme_id: '',
                a_ete_modifie: '0',
			};
			vm.allRecordstypeplainte.push(items);
		    vm.allRecordstypeplainte.forEach(function(it) {
				if(it.$selected==true) {
					vm.selectedItemType_plainte = it;
				}
			});			
        };
        vm.annulerType_plainte = function(item) {
			if (!item.id) {
				vm.allRecordstypeplainte.pop();
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItemType_plainte = false;
			item.Code = currentItemType_plainte.Code;
			item.TypePlainte = currentItemType_plainte.TypePlainte;
			item.a_ete_modifie = currentItemType_plainte.a_ete_modifie;
			vm.selectedItemType_plainte = {} ;
			vm.selectedItemType_plainte.$selected = false;
       };
        vm.modifierType_plainte = function(item) {
			NouvelItemType_plainte = false ;
			vm.selectedItemType_plainte = item;
			currentItemType_plainte = angular.copy(vm.selectedItemType_plainte);
			$scope.vm.allRecordstypeplainte.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			item.Code = vm.selectedItemType_plainte.Code;
			item.TypePlainte = vm.selectedItemType_plainte.TypePlainte;
			item.a_ete_modifie = vm.selectedItemType_plainte.a_ete_modifie;
			item.$edit = true;
			console.log(vm.allRecordstypeplainte);	
        };
        vm.supprimerType_plainte = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemType_plainte,1);
			}, function() {
			});
        }
        function test_existence (item,suppression)
        {
			if (suppression!=1) 
            {
                var ag = vm.allRecordstypeplainte.filter(function(obj)
                {
                   return obj.id == item.id;
                });
                if(ag[0])
                {
                  if((ag[0].Code!=currentItemType_plainte.Code)
                        ||(ag[0].TypePlainte!=currentItemType_plainte.TypePlainte)
                        ||(ag[0].ile.id!=currentItemType_plainte.ile_id)
                        ||(ag[0].programme.id!=currentItemType_plainte.programme_id))                    
                      { 
                         insert_in_base(item,suppression);                         
                      }
                      else
                      { 
                        item.$selected=false;
						item.$edit=false;
                      }
                }
            }
            else
              insert_in_base(item,suppression);		
        }
		// Fin type plainte
	// Debut résultat plainte
		function ajoutresultatplainte(agent_e,suppression) {
            
            if (NouvelItemResultat_plainte==false) 
              {
                test_existence_resultat_plainte (agent_e,suppression); 
              }
              else
              {
                insert_in_base_resultat_plainte(agent_e,suppression);
              }
        }
        function insert_in_base_resultat_plainte(type_pl,suppression) {  
			//add
			
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var getId = 0;
			if (NouvelItemResultat_plainte==false) {
			   getId = vm.selectedItemResultat_plainte.id; 
			} 
			var datas = $.param({
				supprimer:suppression,
				id:getId,      
				code: type_pl.code,      
				libelle: type_pl.libelle,      
				a_ete_modifie: 0,
			});       
			//factory
			apiFactory.add("resultat_plainte/index",datas, config).success(function (data)
			{	
				var prog = vm.allprogramme.filter(function(obj)
                {
                    return obj.id == type_pl.programme_id;
                });
                var il = vm.allile.filter(function(obj)
                {
                    return obj.id == type_pl.ile_id;
                });
				if (NouvelItemResultat_plainte == false) {
					// Update or delete: id exclu 
					if(suppression==0) {
					  vm.selectedItemResultat_plainte.code = type_pl.code;
					  vm.selectedItemResultat_plainte.libelle = type_pl.libelle;
					  vm.selectedItemResultat_plainte.a_ete_modifie = 0;
					  vm.selectedItemResultat_plainte.$selected = false;
					  vm.selectedItemResultat_plainte.$edit = false;
					  vm.selectedItemResultat_plainte ={};
					} else {    
						vm.allRecordsresultatplainte = vm.allRecordsresultatplainte.filter(function(obj) {
							return obj.id !== vm.selectedItemResultat_plainte.id;
						});
					}
				} else {
					type_pl.id=data.response;
					type_pl.a_ete_modifie=0;
					NouvelItemResultat_plainte=false;
				}
				type_pl.$selected=false;
				type_pl.$edit=false;
			}).error(function (data) {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
        }
        vm.selectionResultat_plainte= function (item) {     
            vm.selectedItemResultat_plainte = item;
        };
        $scope.$watch('vm.selectedItemResultat_plainte', function() {
			if (!vm.allRecordsresultatplainte) return;
			vm.allRecordsresultatplainte.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemResultat_plainte.$selected = true;
			//console.log(vm.allRecordsresultatplainte);
        });
        //function cache masque de saisie
        vm.ajouterResultat_plainte = function () {
            vm.selectedItemResultat_plainte.$selected = false;
            NouvelItemResultat_plainte = true ;
		    var items = {
				$edit: true,
				$selected: true,
				supprimer:0,
                code: '',
                libelle: '',
                ile_id: '',
                programme_id: '',
                a_ete_modifie: '0',
			};
			vm.allRecordsresultatplainte.push(items);
		    vm.allRecordsresultatplainte.forEach(function(it) {
				if(it.$selected==true) {
					vm.selectedItemResultat_plainte = it;
				}
			});			
        };
        vm.annulerResultat_plainte = function(item) {
			if (!item.id) {
				vm.allRecordsresultatplainte.pop();
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItemResultat_plainte = false;
			item.code = currentItemResultat_plainte.code;
			item.libelle = currentItemResultat_plainte.libelle;
			item.a_ete_modifie = currentItemResultat_plainte.a_ete_modifie;
			vm.selectedItemResultat_plainte = {} ;
			vm.selectedItemResultat_plainte.$selected = false;
       };
        vm.modifierResultat_plainte = function(item) {
			NouvelItemResultat_plainte = false ;
			vm.selectedItemResultat_plainte = item;
			currentItemResultat_plainte = angular.copy(vm.selectedItemResultat_plainte);
			$scope.vm.allRecordsresultatplainte.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			item.code = vm.selectedItemResultat_plainte.code;
			item.libelle = vm.selectedItemResultat_plainte.libelle;
			item.a_ete_modifie = vm.selectedItemResultat_plainte.a_ete_modifie;
			item.$edit = true;
			console.log(vm.allRecordsresultatplainte);	
        };
        vm.supprimerResultat_plainte = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajoutresultatplainte(vm.selectedItemResultat_plainte,1);
			}, function() {
			});
        }
        function test_existence_resultat_plainte (item,suppression)
        {
			if (suppression!=1) 
            {
                var ag = vm.allRecordsresultatplainte.filter(function(obj)
                {
                   return obj.id == item.id;
                });
                if(ag[0])
                {
                  if((ag[0].code!=currentItemResultat_plainte.code)
                        ||(ag[0].libelle!=currentItemResultat_plainte.libelle)
                        ||(ag[0].ile.id!=currentItemResultat_plainte.ile_id)
                        ||(ag[0].programme.id!=currentItemResultat_plainte.programme_id))                    
                      { 
                         insert_in_base_resultat_plainte(item,suppression);                         
                      }
                      else
                      { 
                        item.$selected=false;
						item.$edit=false;
                      }
                }
            }
            else
              insert_in_base_resultat_plainte(item,suppression);		
        }
		// Fin résultat plainte
		
        vm.modifierile = function (item) 
        {
          var ile = vm.allile.filter(function(obj)
          {
              return obj.id == item.ile_id;
          });
          //console.log(ile);
          item.programme_id=ile[0].programme.id;
        }
		
    vm.nouveauVillage = function (ev,item)
	{	//console.log('eto');
		if (item.ile_id)
		{
			var confirm = $mdDialog.confirm({
			controller: DialogController,
			templateUrl: 'app/main/comores/ddb/acteurs/dialog.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			
			})

						$mdDialog.show(confirm).then(function(data)
						{	//console.log('lasa');
							if(data.village_id)
							{
								vm.selectedItemProtection_sociale.village_id=data.village_id;
							}else
							{
								
							}
							
							//console.log(data.village_id);
						}, function(){//alert('rien');
					});
		} else {
		
         $mdDialog.show(
      		$mdDialog.alert()
	        .parent(angular.element(document.querySelector('#popupContainer')))
	        .clickOutsideToClose(true)
	        .parent(angular.element(document.body))
	        .title('Erreur: champ vide')
	        .textContent('Vous devez d\'abord remplir le champ Ile')
	        .ariaLabel('Alert Dialog Demo')
	        .ok('Ok')
	        .targetEvent(ev)
    		);
		}
		

	}
	function DialogController($mdDialog, $scope,$state)	{ 
		  var dg=$scope;
		  dg.dialog = {} ;

		dg.PrefectureListe =vm.ListePrefecture;
		dg.CommuneListe= vm.ListeCommune;
		dg.VillageListe= vm.listevillage;

		dg.choixprefecture=false;
		dg.choixcommune=false;

		function recuperationListe() {
			return new Promise(function(resolve, reject){	        
				dg.PrefectureListe = vm.ListePrefecture;
				dg.CommuneListe= vm.ListeCommune;
				dg.VillageListe= vm.listevillage;
				resolve();
			   // console.log(dg.PrefectureListe);
			});
		}

		function affectationValueFormulaire()
		{
		   //console.log('affectationValueFormulaire');
		   if (vm.ileSelected){

			dg.dialog.commune_id='';
			dg.dialog.village_id='';
			dg.choixprefecture=false;
			dg.choixcommune=false;
			}
			else
			{
				dg.dialog.prefecture_id=vm.communetmp.prefecture.id;
				dg.dialog.commune_id=vm.selectedItemProtection_sociale.village.commune_id;
				dg.dialog.village_id=vm.selectedItemProtection_sociale.village.id;
				dg.choixprefecture=true;
				dg.choixcommune=true;
				// console.log(dg.dialog.prefecture_id);
			}
		   
		}

		if (NouvelItemProtection_sociale==false)
		{
			recuperationListe().then(function(result)
				{
					affectationValueFormulaire();
				});
				
		}
		

		  dg.cancel = function()
		  {	dg.dialog={};
			$mdDialog.cancel();};

		  dg.modifierprefecture = function (item) 
			{//console.log(item.prefecture_id);
			  apiFactory.getCommuneByPrefecture("commune/index",item.prefecture_id).then(function(result)
			  {
				dg.CommuneListe= result.data.response;
				dg.choixprefecture=true;
				dg.choixcommune=false;
				dg.dialog.commune_id='';	        
			   //console.log(dg.CommuneListe);
			  });

			}
			dg.modifiercommune = function (item) 
			{	//console.log(item.commune_id);
			  apiFactory.getVillageByCommune("village/index",item.commune_id).then(function(result)
			  {
				dg.VillageListe= result.data.response;
				vm.listevillage= result.data.response;
				dg.choixcommune=true;
			   //console.log(dg.VillageListe);
			  });

			}
			dg.dialogResponse = function(response)
			{
				$mdDialog.hide(response);
				dg.dialog={};
			}

	}

      /*  vm.modifierRegion = function (item) { 
			vm.allregion.forEach(function(prg) {
				if(prg.id==item.id_region) {
					item.region=[];
					var itemss = {
						id: prg.id,
						code: prg.code,
						nom: prg.nom,
					};
					item.region.push(itemss);
				}
			});
		}	
        vm.modifierTypeacteur = function (item) { 
			vm.allRecordstypeplainte.forEach(function(prg) {
				if(prg.id==item.id_type_acteur) {
					item.typeacteur=[];
					var itemss = {
						id: prg.id,
						description: prg.description,
					};
					item.typeacteur.push(itemss);
				}
			});
			console.log(item.typeacteur);
		}*/	
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

(function ()
{
    'use strict';
    angular
        .module('app.pfss.ddb_adm.acteurs')
        .controller('ActeursController', ActeursController);

    /** @ngInject */
    function ActeursController(apiFactory, $state, $mdDialog, $scope, serveur_central,$cookieStore) {
		// Déclaration des variables et fonctions
		var vm = this;

		vm.serveur_central = serveur_central ;
		
		vm.titrepage ="Ajout Tutelle";
		vm.ajout = ajout ;
		vm.ajoutConsultant_ong = ajoutConsultant_ong ;
		vm.ajoutAgence_p = ajoutAgence_p ;
		vm.ajoutProtection_sociale = ajoutProtection_sociale ;
		vm.ajoutTypetransfert = ajoutTypetransfert ;
		vm.ajoutUnitemesure = ajoutUnitemesure ;
		vm.ajoutDetailtypetransfert = ajoutDetailtypetransfert ;
		vm.ajoutFrequencetransfert = ajoutFrequencetransfert ;
		var NouvelItemConsultant_ong=false;
		var NouvelItemAgent_ex=false;
		var NouvelItemAgence_p=false;
		var NouvelItemProtection_sociale=false;
		var NouvelItemUnitemesure=false;
		var NouvelItemTypetransfert=false;
		var NouvelItemDetailtypetransfert=false;
		var NouvelItemFrequencetransfert=false;
		var currentItemConsultant_ong;
		var currentItemAgent_ex;
		var currentItemAgence_p;
		var currentItemProtection_sociale;
		vm.selectedItemConsultant_ong = {} ;
		vm.selectedItemAgent_ex = {} ;
		vm.selectedItemAgence_p = {} ;
		vm.selectedItemProtection_sociale = {};
		vm.selectedItemTypetransfert = {} ;     
		vm.selectedItemUnitemesure = {} ;   
		vm.selectedItemFrequencetransfert = {} ;   
		vm.selectedItemTypetransfert.detail_type_transfert	={};	
		vm.ileSelected = false;

		vm.currentId_ile=0;
		//vm.allregion =[];
		vm.allRecordsConsultant_ong = [] ;
		vm.allRecordsAgent_ex = [] ;
		vm.allRecordsAgence_p = [] ;
		vm.allProtection_sociale = [] ;
		vm.allRecordsTypetransfert = [] ;
		vm.allRecordsUnitemesure = [] ;
		vm.allRecordsDetailtypetransfert = [] ;
		vm.allRecordsFrequencetransfert = [] ;
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
		vm.consultant_ong_column =[
		{titre:"Code"},
		{titre:"Nom"},
		{titre:"Contact"},
		{titre:"Fonction"},
		{titre:"Tél contact"},
		{titre:"Adresse"},
		{titre:"Ile"},
		{titre:"Action"}
		];
		vm.agent_ex_column =[
		{titre:"Code"},
		{titre:"Nom"},
		{titre:"Contact"},
		{titre:"Representant"},
		{titre:"Ile"},
		{titre:"Programme"},
		{titre:"Action"}
		];
		vm.agence_p_column = [
		{titre:"Code"},
		{titre:"Nom"},
		{titre:"Contact"},
		{titre:"Telephone"},
		{titre:"Representant"},
		{titre:"Ile"},
		{titre:"Programme"},
		{titre:"Action"}
		];
		vm.protection_sociale_column = [
		{titre:"Code"},
		{titre:"Nom"},
		{titre:"Contact"},
		{titre:"NumeroTelephone"},
		{titre:"Representant"},
		{titre:"Ile"},
		{titre:"Village"},
		{titre:"Programme"},
		{titre:"Action"}
		];
		vm.detailtypetransfert_column = [{titre:"Type transfert"},{titre:"Code"},{titre:"Description"},{titre:"Unité mésure"},{titre:"Actions"}];
		vm.unite_mesure_column = [{titre:"Code"},{titre:"Description"},{titre:"Actions"}];
		vm.typetransfert_column = [{titre:"Code"},{titre:"Description"},{titre:"Actions"}];
		apiFactory.getAll("ile/index").then(function(result)
	      {
	        vm.allile= result.data.response;
	      });
	      apiFactory.getAll("programme/index").then(function(result)
	      {
	        vm.allprogramme= result.data.response;
	      });
			apiFactory.getAll("agent_ex/index").then(function(result){
				vm.allRecordsAgent_ex = result.data.response;
				apiFactory.getAll("agence_p/index").then(function(result){
					vm.allRecordsAgence_p = result.data.response;
					apiFactory.getAll("protection_sociale/index").then(function(result){
						vm.allProtection_sociale = result.data.response;
						apiFactory.getAll("consultant_ong/index").then(function(result){
							vm.allRecordsConsultant_ong = result.data.response;
						});    
					});    
				});    
			});    
		apiFactory.getAll("type_transfert/index").then(function(result){
			vm.allRecordsTypetransfert = result.data.response;
			if(vm.allRecordsTypetransfert.length >0) {
				// Trié par code et appel fonction selectionTypetransfert par défaut premier enregistrement s'il existe
				vm.selectionTypetransfert(vm.allRecordsTypetransfert[0]);
			}
		});    
		apiFactory.getAll("frequence_transfert/index").then(function(result){
			vm.allRecordsFrequencetransfert = result.data.response;
		});    
		apiFactory.getAll("unite_mesure/index").then(function(result){
			vm.allRecordsUnitemesure = result.data.response;
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
				
				var datas_suppr = $.param({
						supprimer:1,
						nom_table: table,
					}); 
				apiFactory.add("delete_ddb/index",datas_suppr, config).success(function (data) {
						//add ddb
							ddb.forEach( function(element, index) {
								switch (table) {
									case "consultant_ong":
										// statements_1
										var datas = $.param({
											supprimer:0,
											etat_download:true,
											id:element.id,      
											code: element.code,
											raison_social: element.raison_social,
											contact: element.contact,
											fonction_contact: element.fonction_contact,
											telephone_contact: element.telephone_contact,
											adresse: element.adresse,
											ile_id: element.ile.id,
											programme_id: element.programme.id
										});   
										break;
									case "see_agex":
										// statements_1
										var datas = $.param({
											supprimer:0,
											etat_download:true,
											id:element.id,      
											Code: element.Code,
											Nom: element.Nom,
											Contact: element.Contact,
											Representant: element.Representant,
											ile_id: element.ile.id,
											programme_id: element.programme.id
										});   
										break;
									case "see_agent":
										// statements_1
										var datas = $.param({
											supprimer:0,
											etat_download:true,
											id:element.id,      
											Code: element.Code,
											Nom: element.Nom,
											Contact: element.Contact,
											Telephone: element.Telephone,
											Representant: element.Representant,
											ile_id: element.ile.id,
											programme_id: element.programme.id
										}); 
										break;
									case "see_celluleprotectionsociale":

										if (!element.village) 
										{
											element.village = {} ;
											element.village.id = null ;

										}
										if (!element.ile) 
										{
											element.ile = {} ;
											element.ile.id = null ;

										}
										if (!element.programme) 
										{
											element.programme = {} ;
											element.programme.id = null ;

										}
										// statements_1
										var datas = $.param({
											supprimer:0,
											etat_download:true,
											id:element.id,      
											Code: element.Code,
											Representant: element.Representant,
											Nom: element.Nom,
											Contact: element.Contact,
											NumeroTelephone: element.NumeroTelephone,
											ile_id: element.ile.id,
											village_id: element.village.id,
											programme_id: element.programme.id
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
					case "consultant_ong":
						vm.allRecordsConsultant_ong = ddb ;
						break;
					case "see_agex":
						vm.allRecordsAgent_ex = ddb ;
						break;
					case "see_agent":
						vm.allRecordsAgence_p = ddb ;
						break;
					case "see_celluleprotectionsociale":
						vm.allProtection_sociale = ddb ;
						break;
					
					default:

						break;
				}

			});  
		}
		function ajout(agent_e,suppression) {
            
            if (NouvelItemAgent_ex==false) 
              {
                test_existence (agent_e,suppression); 
              }
              else
              {
                insert_in_base(agent_e,suppression);
              }
        }
        function insert_in_base(agent_ex,suppression) {  
			//add
			
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var getId = 0;
			if (NouvelItemAgent_ex==false) {
			   getId = vm.selectedItemAgent_ex.id; 
			} 
			var datas = $.param({
				supprimer:suppression,
				id:getId,      
				Code: agent_ex.Code,      
				Nom: agent_ex.Nom,      
				Contact: agent_ex.Contact,      
				Representant: agent_ex.Representant,      
				ile_id: agent_ex.ile_id,      
				programme_id: agent_ex.programme_id
			});       
			//factory
			apiFactory.add("agent_ex/index",datas, config).success(function (data)
			{	
				var prog = vm.allprogramme.filter(function(obj)
                {
                    return obj.id == agent_ex.programme_id;
                });
            //console.log(prog[0]);
                var il = vm.allile.filter(function(obj)
                {
                    return obj.id == agent_ex.ile_id;
                });
//console.log(il[0]);
				if (NouvelItemAgent_ex == false) {
					// Update or delete: id exclu 
					//console.log('noufalse');                  
					if(suppression==0) {
					  vm.selectedItemAgent_ex.Code = agent_ex.Code;
					  vm.selectedItemAgent_ex.Nom = agent_ex.Nom;
					  vm.selectedItemAgent_ex.Contact = agent_ex.Contact;
					  vm.selectedItemAgent_ex.Representant = agent_ex.Representant;
					  vm.selectedItemAgent_ex.ile = il[0];
					  vm.selectedItemAgent_ex.programme = prog[0];
					  vm.selectedItemAgent_ex.$selected = false;
					  vm.selectedItemAgent_ex.$edit = false;
					  vm.selectedItemAgent_ex ={};
					} else {    
						vm.allRecordsAgent_ex = vm.allRecordsAgent_ex.filter(function(obj) {
							return obj.id !== vm.selectedItemAgent_ex.id;
						});
					}
				} else {
					agent_ex.id=data.response;
					agent_ex.programme=prog[0];
					agent_ex.ile=il[0]
					NouvelItemAgent_ex=false;
				}
				agent_ex.$selected=false;
				agent_ex.$edit=false;
			}).error(function (data) {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
        }
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
		// début Consultant ong
		function ajoutConsultant_ong(consultant,suppression) {
            if (NouvelItemConsultant_ong==false) 
              {
                test_existenceConsultant_ong (consultant,suppression); 
              }
              else
              {
                insert_in_baseConsultant_ong(consultant,suppression);
              }

        }
        function insert_in_baseConsultant_ong(entite,suppression) {  
			//add
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var getId = 0;
			if (NouvelItemConsultant_ong==false) {
			   getId = vm.selectedItemConsultant_ong.id; 
			} 
			var datas = $.param({
				supprimer:suppression,
				id:getId,      
				code: entite.code,      
				raison_social: entite.raison_social,      
				contact: entite.contact,
				fonction_contact: entite.fonction_contact,      
				telephone_contact: entite.telephone_contact,      
				adresse: entite.adresse,      
				ile_id: entite.ile_id,      
			});       
			//factory
			apiFactory.add("consultant_ong/index",datas, config).success(function (data)
			{	
				var prog = vm.allprogramme.filter(function(obj)
                {
                    return obj.id == entite.programme_id;
                });
            	//console.log(prog[0]);
                var il = vm.allile.filter(function(obj)
                {
                    return obj.id == entite.ile_id;
                });
				if (NouvelItemConsultant_ong == false) {
					// Update or delete: id exclu                   
					if(suppression==0) {
					   vm.selectedItemConsultant_ong.code = entite.code;
					  vm.selectedItemConsultant_ong.raison_social = entite.raison_social;
					  vm.selectedItemConsultant_ong.contact = entite.contact;
					  vm.selectedItemConsultant_ong.fonction_contact = entite.fonction_contact;
					  vm.selectedItemConsultant_ong.telephone_contact = entite.telephone_contact;
					  vm.selectedItemConsultant_ong.adresse = entite.adresse;
					  vm.selectedItemConsultant_ong.ile = il[0];
					  vm.selectedItemConsultant_ong.$selected = false;
					  vm.selectedItemConsultant_ong.$edit = false;
					  vm.selectedItemConsultant_ong ={};
					  vm.selectedItemConsultant_ong.$selected = false;
					  vm.selectedItemConsultant_ong.$edit = false;
					  vm.selectedItemConsultant_ong ={};
					} else {    
						vm.allRecordsConsultant_ong = vm.allRecordsConsultant_ong.filter(function(obj) {
							return obj.id !== vm.selectedItemConsultant_ong.id;
						});
					}
				} else {
					entite.id=data.response;
					entite.programme=prog[0];
					entite.ile=il[0];	
					NouvelItemConsultant_ong=false;
				}
				entite.$selected=false;
				entite.$edit=false;
			}).error(function (data) {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
        }
        function test_existenceConsultant_ong (item,suppression)
        {
			if (suppression!=1) 
            {
                var ag = vm.allRecordsConsultant_ong.filter(function(obj)
                {
                   return obj.id == currentItemConsultant_ong.id;
                });
                if(ag[0])
                {
                   if((ag[0].code!=currentItemConsultant_ong.code)
                        ||(ag[0].raison_social!=currentItemConsultant_ong.raison_social)
                        ||(ag[0].contact!=currentItemConsultant_ong.contact)
                        ||(ag[0].fonction_contact!=currentItemConsultant_ong.fonction_contact)
                        ||(ag[0].ile.id!=currentItemConsultant_ong.ile_id)
                        ||(ag[0].adresse!=currentItemConsultant_ong.adresse)
                        ||(ag[0].telephone_contact.id!=currentItemConsultant_ong.telephone_contact))                    
                      { 
                        insert_in_baseConsultant_ong(item,suppression);
                      }
                      else
                      {
                        item.$selected=false;
						item.$edit=false;
                      }                    
                }
            }
            else
              insert_in_baseConsultant_ong(item,suppression);			
        }				
        vm.selectionConsultant_ong= function (item) {     
            vm.selectedItemConsultant_ong = item;
        };
        $scope.$watch('vm.selectedItemConsultant_ong', function() {
			if (!vm.allRecordsConsultant_ong) return;
			vm.allRecordsConsultant_ong.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemConsultant_ong.$selected = true;
        });
        //function cache masque de saisie
        vm.ajouterConsultant_ong = function () {
            vm.selectedItemConsultant_ong.$selected = false;
            NouvelItemConsultant_ong = true ;
		    var items = {
				$edit: true,
				$selected: true,
				supprimer:0,
                code: '',
                raison_social: '',
                contact: '',
                fonction_contact: '',
                telephone_contact: '',
                adresse: '',
                ile_id: '',
			};
			vm.allRecordsConsultant_ong.push(items);
		    vm.allRecordsConsultant_ong.forEach(function(it) {
				if(it.$selected==true) {
					vm.selectedItemConsultant_ong = it;
				}
			});			
        };
        vm.annulerConsultant_ong = function(item) {
			if (!item.id) {
				vm.allRecordsConsultant_ong.pop();
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItemConsultant_ong = false;
			item.code = currentItemConsultant_ong.code;
			item.raison_social = currentItemConsultant_ong.raison_social;
			item.contact = currentItemConsultant_ong.contact;
			item.fonction_contact = currentItemConsultant_ong.fonction_contact;
			item.telephone_contact = currentItemConsultant_ong.telephone_contact;
			item.adresse = currentItemConsultant_ong.adresse;
			item.ile_id = currentItemConsultant_ong.ile.id;
			item.programme_id = currentItemConsultant_ong.programme.id;
			vm.selectedItemConsultant_ong = {} ;
			vm.selectedItemConsultant_ong.$selected = false;
       };
        vm.modifierConsultant_ong = function(item) {
        	console.log(vm.selectedItemConsultant_ong);
			NouvelItemConsultant_ong = false ;
			vm.selectedItemConsultant_ong = item;
			currentItemConsultant_ong = angular.copy(vm.selectedItemConsultant_ong);
			$scope.vm.allRecordsConsultant_ong.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			item.code = vm.selectedItemConsultant_ong.code;
			item.raison_social = vm.selectedItemConsultant_ong.raison_social;
			item.contact = vm.selectedItemConsultant_ong.contact;
			item.fonction_contact = vm.selectedItemConsultant_ong.fonction_contact;
			item.telephone_contact = vm.selectedItemConsultant_ong.telephone_contact;
			item.adresse = vm.selectedItemConsultant_ong.adresse;
			item.ile_id = vm.selectedItemConsultant_ong.ile.id;
			item.$edit = true;
			console.log(vm.allRecordsConsultant_ong);	
        };
        vm.supprimerConsultant_ong = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajoutConsultant_ong(vm.selectedItemConsultant_ong,1);
			}, function() {
			});
        }
		// fin Consultant ong
					
		
		// début Agence dexecution
	        /*vm.selectionAgent_ex= function (item) {     
	            vm.selectedItemAgent_ex = item;
	        };
	        $scope.$watch('vm.selectedItemAgent_ex', function() {
				if (!vm.allRecordsAgent_ex) return;
				vm.allRecordsAgent_ex.forEach(function(item) {
					item.$selected = false;
				});
				vm.selectedItemAgent_ex.$selected = true;
				//console.log(vm.allRecordsAgent_ex);
	        });
	        //function cache masque de saisie
	        vm.ajouterAgent_ex = function () {
	            vm.selectedItemAgent_ex.$selected = false;
	            NouvelItemAgent_ex = true ;
			    var items = {
					$edit: true,
					$selected: true,
					supprimer:0,
	                Code: '',
	                Nom: '',
	                Contact: '',
	                Representant: '',
	                ile_id: '',
	                programme_id: ''
				};
				vm.allRecordsAgent_ex.push(items);
			    vm.allRecordsAgent_ex.forEach(function(it) {
					if(it.$selected==true) {
						vm.selectedItemAgent_ex = it;
					}
				});			
	        };
	        vm.annulerAgent_ex = function(item) {
				if (!item.id) {
					vm.allRecordsAgent_ex.pop();
					return;
				}          
				item.$selected=false;
				item.$edit=false;
				NouvelItemAgent_ex = false;
				item.Code = currentItemAgent_ex.Code;
				item.Nom = currentItemAgent_ex.Nom;
				item.Contact = currentItemAgent_ex.Contact;
				item.Representant = currentItemAgent_ex.Representant;
				item.ile_id = currentItemAgent_ex.ile.id;
				item.programme_id = currentItemAgent_ex.programme.id;
				vm.selectedItemAgent_ex = {} ;
				vm.selectedItemAgent_ex.$selected = false;
	       };
	        vm.modifierAgent_ex = function(item) {
	        	console.log(vm.selectedItemAgent_ex);
				NouvelItemAgent_ex = false ;
				vm.selectedItemAgent_ex = item;
				currentItemAgent_ex = angular.copy(vm.selectedItemAgent_ex);
				$scope.vm.allRecordsAgent_ex.forEach(function(it) {
					it.$edit = false;
				});        
				item.$edit = true;	
				item.$selected = true;	
				item.Code = vm.selectedItemAgent_ex.Code;
				item.Nom = vm.selectedItemAgent_ex.Nom;
				item.Contact = vm.selectedItemAgent_ex.Contact;
				item.Representant = vm.selectedItemAgent_ex.Representant;
				item.ile_id = vm.selectedItemAgent_ex.ile.id;
				item.programme_id = vm.selectedItemAgent_ex.programme.id;
				item.$edit = true;
				console.log(vm.allRecordsAgent_ex);	
	        };
	        vm.supprimerAgent_ex = function() {
				var confirm = $mdDialog.confirm()
	                .title('Etes-vous sûr de supprimer cet enregistrement ?')
	                .textContent('')
	                .ariaLabel('Lucky day')
	                .clickOutsideToClose(true)
	                .parent(angular.element(document.body))
	                .ok('supprimer')
	                .cancel('annuler');
				$mdDialog.show(confirm).then(function() {          
					ajout(vm.selectedItemAgent_ex,1);
				}, function() {
				});
	        }*/
		// fin Agence dexecution

		vm.dtOptions_new =
		{
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple_numbers',
			retrieve:'true',
			order:[] 
		};

		//AGEX NEW CODE

			vm.all_agex = [] ;

			vm.agent_ex_column =
			[
				{titre:"Identifiant AGEX"},
				{titre:"Dénomination AGEX"},
				{titre:"Intervenant AGEX"},
				{titre:"Nom de contact AGEX"},
				{titre:"Titre du contact"},
				{titre:"Numéro de téléphone contact"},
				{titre:"Adresse AGEX"}
			];

			vm.affiche_load = false ;

			vm.get_all_agex = function () 
			{
				vm.affiche_load = true ;
				apiFactory.getAll("Agent_ex/index").then(function(result){
					vm.all_agex = result.data.response;
					
					vm.affiche_load = false ;

				});  
			}

			//AGEX..
				
	    		vm.selected_agex = {} ;
	    		var current_selected_agex = {} ;
	    		 vm.nouvelle_agex = false ;

	    	
				vm.selection_agex = function(item)
				{
					vm.selected_agex = item ;

					if (!vm.selected_agex.$edit) //si simple selection
					{
						vm.nouvelle_agex = false ;	

					}

				}

				$scope.$watch('vm.selected_agex', function()
				{
					if (!vm.all_agex) return;
					vm.all_agex.forEach(function(item)
					{
						item.$selected = false;
					});
					vm.selected_agex.$selected = true;

				});

				vm.ajouter_agex = function()
				{
					vm.nouvelle_agex = true ;
					var item = 
						{
							
							$edit: true,
							$selected: true,
		              		id:'0',
		              		identifiant_agex:'',
		              		Nom:'',
		              		intervenant_agex:'',
		              		nom_contact_agex:'',
		              		titre_contact:'',
		              		numero_phone_contact:'',
		              		adresse_agex:''
		              		
						} ;

					vm.all_agex.unshift(item);
		            vm.all_agex.forEach(function(af)
		            {
		              if(af.$selected == true)
		              {
		                vm.selected_agex = af;
		                
		              }
	            	});
				}

				vm.modifier_agex = function()
				{
					vm.nouvelle_agex = false ;
					vm.selected_agex.$edit = true;
				
					current_selected_agex = angular.copy(vm.selected_agex);
				}

				vm.supprimer_agex = function()
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

					vm.enregistrer_agex(1);
					}, function() {
					//alert('rien');
					});
				}

				vm.annuler_agex = function()
				{
					if (vm.nouvelle_agex) 
					{
						
						vm.all_agex.shift();
						vm.selected_agex = {} ;
						vm.nouvelle_agex = false ;
					}
					else
					{
						

						if (!vm.selected_agex.$edit) //annuler selection
						{
							vm.selected_agex.$selected = false;
							vm.selected_agex = {};
						}
						else
						{
							vm.selected_agex.$selected = false;
							vm.selected_agex.$edit = false;
							vm.selected_agex.identifiant_agex = current_selected_agex.identifiant_agex ;
							vm.selected_agex.Nom = current_selected_agex.Nom ;
							vm.selected_agex.intervenant_agex = current_selected_agex.intervenant_agex ;
							vm.selected_agex.nom_contact_agex = current_selected_agex.nom_contact_agex ;
							vm.selected_agex.titre_contact = current_selected_agex.titre_contact ;
							vm.selected_agex.numero_phone_contact = current_selected_agex.numero_phone_contact ;
							vm.selected_agex.adresse_agex = current_selected_agex.adresse_agex ;
							
							vm.selected_agex = {};
						}

						

					}
				}

				vm.enregistrer_agex = function(etat_suppression)
				{
					vm.affiche_load = true ;
					var config = {
		                headers : {
		                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
		                }
		            };


		            var datas = $.param(
		            {
		            	
		                supprimer:etat_suppression,
		                id:vm.selected_agex.id,

		                identifiant_agex : vm.selected_agex.identifiant_agex ,
						Nom : vm.selected_agex.Nom ,
						intervenant_agex : vm.selected_agex.intervenant_agex ,
						nom_contact_agex : vm.selected_agex.nom_contact_agex ,
						titre_contact : vm.selected_agex.titre_contact ,
						numero_phone_contact : vm.selected_agex.numero_phone_contact ,
						adresse_agex : vm.selected_agex.adresse_agex 
		                
		                
		            });

		            apiFactory.add("Agent_ex/index",datas, config).success(function (data)
	        		{
	        			vm.affiche_load = false ;
	        			if (!vm.nouvelle_agex) 
	        			{
	        				if (etat_suppression == 0) 
	        				{
	        					vm.selected_agex.$edit = false ;
	        					vm.selected_agex.$selected = false ;
	        					vm.selected_agex = {} ;
	        				}
	        				else
	        				{
	        					vm.all_agex = vm.all_agex.filter(function(obj)
								{
									return obj.id !== vm.selected_agex.id;
								});

								vm.selected_agex = {} ;
	        				}

	        			}
	        			else
	        			{
	        				vm.selected_agex.$edit = false ;
	        				vm.selected_agex.$selected = false ;
	        				vm.selected_agex.id = String(data.response) ;

	        				vm.nouvelle_agex = false ;
	        				vm.selected_agex = {};

	        			}
	        		})
	        		.error(function (data) {alert("Une erreur s'est produit");});
				}

			

			//fin AGEX..
		//FIN AGEX NEW CODE
		
        vm.modifierile = function (item) 
        {
          var ile = vm.allile.filter(function(obj)
          {
              return obj.id == item.ile_id;
          });
          //console.log(ile);
          item.programme_id=ile[0].programme.id;
        }
        function test_existence (item,suppression)
        {
			if (suppression!=1) 
            {
                var ag = vm.allRecordsAgent_ex.filter(function(obj)
                {
                   return obj.id == item.id;
                });
                if(ag[0])
                {
                  if((ag[0].Code!=currentItemAgent_ex.Code)
                        ||(ag[0].Nom!=currentItemAgent_ex.Nom)
                        ||(ag[0].Contact!=currentItemAgent_ex.Contact)
                        ||(ag[0].Representant!=currentItemAgent_ex.Representant)
                        ||(ag[0].ile.id!=currentItemAgent_ex.ile_id)
                        ||(ag[0].programme.id!=currentItemAgent_ex.programme_id))                    
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
		
	// ACTEURS	
		function ajoutAgence_p(agence_p,suppression) {
            	
            if (NouvelItemAgence_p==false) 
              {
                test_existenceAgence_p (agence_p,suppression); 
              }
              else
              {
                insert_in_baseAgence_p(agence_p,suppression);
              }

        }
        function insert_in_baseAgence_p(entite,suppression) {  
			//add
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var getId = 0;
			if (NouvelItemAgence_p==false) {
			   getId = vm.selectedItemAgence_p.id; 
			} 
			var datas = $.param({
				supprimer:suppression,
				id:getId,      
				Code: entite.Code,      
				Nom: entite.Nom,      
				Contact: entite.Contact,
				Telephone: entite.Telephone,      
				Representant: entite.Representant,      
				ile_id: entite.ile_id,      
				programme_id: entite.programme_id
			});       
			//factory
			apiFactory.add("agence_p/index",datas, config).success(function (data)
			{	
				var prog = vm.allprogramme.filter(function(obj)
                {
                    return obj.id == entite.programme_id;
                });
            	//console.log(prog[0]);
                var il = vm.allile.filter(function(obj)
                {
                    return obj.id == entite.ile_id;
                });
				if (NouvelItemAgence_p == false) {
					// Update or delete: id exclu                   
					if(suppression==0) {
					   vm.selectedItemAgence_p.Code = entite.Code;
					  vm.selectedItemAgence_p.Nom = entite.Nom;
					  vm.selectedItemAgence_p.Contact = entite.Contact;
					  vm.selectedItemAgence_p.Telephone = entite.Telephone;
					  vm.selectedItemAgence_p.Representant = entite.Representant;
					  vm.selectedItemAgence_p.ile = il[0];
					  vm.selectedItemAgence_p.programme = prog[0];
					  vm.selectedItemAgence_p.$selected = false;
					  vm.selectedItemAgence_p.$edit = false;
					  vm.selectedItemAgence_p ={};
					  vm.selectedItemAgence_p.$selected = false;
					  vm.selectedItemAgence_p.$edit = false;
					  vm.selectedItemAgence_p ={};
					} else {    
						vm.allRecordsAgence_p = vm.allRecordsAgence_p.filter(function(obj) {
							return obj.id !== vm.selectedItemAgence_p.id;
						});
					}
				} else {
					entite.id=data.response;
					entite.programme=prog[0];
					entite.ile=il[0];	
					NouvelItemAgence_p=false;
				}
				entite.$selected=false;
				entite.$edit=false;
			}).error(function (data) {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
        }
        vm.selectionAgence_p= function (item) {     
            vm.selectedItemAgence_p = item;
        };
        $scope.$watch('vm.selectedItemAgence_p', function() {
			if (!vm.allRecordsAgence_p) return;
			vm.allRecordsAgence_p.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemAgence_p.$selected = true;
        });
        vm.ajouterAgence_p = function () {
            vm.selectedItemAgence_p.$selected = false;
            NouvelItemAgence_p = true ;
		    var items = {
				$edit: true,
				$selected: true,
				supprimer:0,
                Code: '',
                Nom: '',
                Contact: '',
                Telephone: '',
                Representant: '',
                ile_id: '',
                programme_id: ''
			};
			vm.allRecordsAgence_p.push(items);
		    vm.allRecordsAgence_p.forEach(function(it) {
				if(it.$selected==true) {
					vm.selectedItemAgence_p = it;
				}
			});			
        };
        vm.annulerAgence_p = function(item) {
			if (!item.id) {
				vm.allRecordsAgence_p.pop();
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItemAgence_p = false;
			item.Code = currentItemAgence_p.Code;
			item.Nom = currentItemAgence_p.Nom;
			item.Contact = currentItemAgence_p.Contact;
			item.Telephone = currentItemAgence_p.Telephone;
			item.Representant = currentItemAgence_p.Representant;
			item.ile_id = currentItemAgence_p.ile.id;
			item.programme_id = currentItemAgence_p.programme.id;
			vm.selectedItemActeur = {} ;
			vm.selectedItemActeur.$selected = false;
       };
        vm.modifierAgence_p = function(item) {
			NouvelItemAgence_p = false ;
			vm.selectedItemAgence_p = item;			
			currentItemAgence_p = angular.copy(vm.selectedItemAgence_p);
			$scope.vm.allRecordsAgence_p.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			item.Code = vm.selectedItemAgence_p.Code;
			item.Nom = vm.selectedItemAgence_p.Nom;
			item.Contact = vm.selectedItemAgence_p.Contact;
			item.Telephone = vm.selectedItemAgence_p.Telephone;
			item.Representant = vm.selectedItemAgence_p.Representant;
			item.ile_id = vm.selectedItemAgence_p.ile.id;
			item.programme_id = vm.selectedItemAgence_p.programme.id;
			
			vm.selectedItemAgence_p.$edit = true;	
        };
        vm.supprimerAgence_p = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajoutAgence_p(vm.selectedItemAgence_p,1);
			}, function() {
			});
        }
        function test_existenceAgence_p (item,suppression)
        {
			if (suppression!=1) 
            {
                var ag = vm.allRecordsAgence_p.filter(function(obj)
                {
                   return obj.id == currentItemAgence_p.id;
                });
                if(ag[0])
                {
                   if((ag[0].Code!=currentItemAgence_p.Code)
                        ||(ag[0].Nom!=currentItemAgence_p.Nom)
                        ||(ag[0].Contact!=currentItemAgence_p.Contact)
                        ||(ag[0].Telephone!=currentItemAgence_p.Telephone)
                        ||(ag[0].Representant!=currentItemAgence_p.Representant)
                        ||(ag[0].ile.id!=currentItemAgence_p.ile_id)
                        ||(ag[0].programme.id!=currentItemAgence_p.programme_id))                    
                      { 
                        insert_in_baseAgence_p(item,suppression);
                      }
                      else
                      {
                        item.$selected=false;
						item.$edit=false;
                      }                    
                }
            }
            else
              insert_in_baseAgence_p(item,suppression);			
        }		
	// ACTEURS REGIONAL	
		function ajoutProtection_sociale(entite,suppression) {
           
            if (NouvelItemProtection_sociale==false) 
              {
                test_existenceProtection_sociale (entite,suppression); 
              }
              else
              {
                insert_in_baseProtection_sociale(entite,suppression);
              } 
        }
        function insert_in_baseProtection_sociale(entite,suppression) {  
			//add
			
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var getId = 0;
			if (NouvelItemProtection_sociale==false) {
			   getId = vm.selectedItemProtection_sociale.id; 
			} 
			var datas = $.param({
				supprimer:suppression,
				id:getId,      
				Code: entite.Code,      
				Nom: entite.Nom,      
				Contact: entite.Contact,
				NumeroTelephone: entite.NumeroTelephone,      
				Representant: entite.Representant,      
				ile_id: entite.ile_id,
				village_id: entite.village_id,      
				programme_id: entite.programme_id
			});       
			//factory
			apiFactory.add("protection_sociale/index",datas, config).success(function (data)
			{	
				var prog = vm.allprogramme.filter(function(obj)
                {
                    return obj.id == entite.programme_id;
                });
            	//console.log(prog[0]);
                var il = vm.allile.filter(function(obj)
                {
                    return obj.id == entite.ile_id;
                });
                var vil = vm.listevillage.filter(function(obj)
                {
                    return obj.id == entite.village_id;
                });
				if (NouvelItemProtection_sociale == false) {
					// Update or delete: id exclu                   
					if(suppression==0) {
					  vm.selectedItemProtection_sociale.Code = entite.Code;
					  vm.selectedItemProtection_sociale.Nom = entite.Nom;
					  vm.selectedItemProtection_sociale.Contact = entite.Contact;
					  vm.selectedItemProtection_sociale.NumeroTelephone = entite.NumeroTelephone;
					  vm.selectedItemProtection_sociale.Representant = entite.Representant;
					  vm.selectedItemProtection_sociale.ile = il[0];
					  vm.selectedItemProtection_sociale.village = vil[0];
					  vm.selectedItemProtection_sociale.programme = prog[0];

					  vm.selectedItemProtection_sociale.$selected = false;
					  vm.selectedItemProtection_sociale.$edit = false;
					  vm.selectedItemProtection_sociale ={};
					} else {    
						vm.allProtection_sociale = vm.allProtection_sociale.filter(function(obj) {
							return obj.id !== vm.selectedItemProtection_sociale.id;
						});
					}
				} else {
					entite.id=data.response;
					entite.programme=prog[0];
					entite.ile=il[0];
					entite.village=vil[0]	
					NouvelItemProtection_sociale=false;
				}
				entite.$selected=false;
				entite.$edit=false;
			}).error(function (data) {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
        }
        vm.selectionProtection_sociale= function (item) {     
            vm.selectedItemProtection_sociale = item;
        };
        $scope.$watch('vm.selectedItemProtection_sociale', function() {
			if (!vm.allProtection_sociale) return;
			vm.allProtection_sociale.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemProtection_sociale.$selected = true;
        });
        //function cache masque de saisie
        vm.ajouterProtection_sociale = function () {
            vm.selectedItemProtection_sociale.$selected = false;
            NouvelItemProtection_sociale = true ;
		    var items = {
				$edit: true,
				$selected: true,
				supprimer:0,
                Code: '',
                Nom: '',
                Contact: '',
                NumeroTelephone: '',
                Representant: '',
                ile_id: '',
                village_id: '',
                programme_id: ''
			};
			vm.allProtection_sociale.push(items);
		    vm.allProtection_sociale.forEach(function(it) {
				if(it.$selected==true) {
					vm.selectedItemProtection_sociale = it;
				}
			});			
        };
        vm.annulerProtection_sociale = function(item) {
			if (!item.id) {
				vm.allProtection_sociale.pop();
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItemProtection_sociale = false;
			item.Code = currentItemProtection_sociale.Code;
			item.Nom = currentItemProtection_sociale.Nom;
			item.Contact = currentItemProtection_sociale.Contact;
			item.NumeroTelephone = currentItemProtection_sociale.NumeroTelephone;
			item.Representant = currentItemProtection_sociale.Representant;
			item.ile_id = currentItemProtection_sociale.ile.id;
			item.village_id = currentItemProtection_sociale.village.id;
			item.programme_id = currentItemProtection_sociale.programme.id;
			vm.selectedItemProtection_sociale = {} ;
			vm.selectedItemProtection_sociale.$selected = false;
			vm.ileSelected=false;
       };
        vm.modifierProtection_sociale = function(item) {
			NouvelItemProtection_sociale = false ;
			vm.selectedItemProtection_sociale = item;
			currentItemProtection_sociale = angular.copy(vm.selectedItemProtection_sociale);
			$scope.vm.allProtection_sociale.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			item.Code = vm.selectedItemProtection_sociale.Code;
			item.Nom = vm.selectedItemProtection_sociale.Nom;
			item.Contact = vm.selectedItemProtection_sociale.Contact;
			item.NumeroTelephone = vm.selectedItemProtection_sociale.NumeroTelephone;
			item.Representant = vm.selectedItemProtection_sociale.Representant;
			item.ile_id = vm.selectedItemProtection_sociale.ile.id;
			item.village_id = vm.selectedItemProtection_sociale.village.id;
			item.programme_id = vm.selectedItemProtection_sociale.programme.id;
			vm.selectedItemProtection_sociale.$edit = true;
			
            	apiFactory.getVillageByCommune("village/index",item.village.commune_id).then(function(res)
			      {
			        vm.listevillage= res.data.response;
			        vm.currentId_ile=item.ile.id;
			      // console.log(vm.listevillage);
			       
			      });
		          apiFactory.getPrefectureByIle("region/index",item.ile.id).then(function(result)
			      {vm.ListePrefecture = result.data.response;
			      	//console.log(vm.ListePrefecture);

			      });
		          //console.log(item.village);
			      apiFactory.getOne("commune/index",item.village.commune_id).then(function(result)
			      { 
			      	vm.communetmp = result.data.response;
			      	//console.log(item.village.commune_id);
			     // console.log(vm.communetmp);
			      	apiFactory.getCommuneByPrefecture("commune/index",vm.communetmp.prefecture.id).then(function(result)
				      {
				        vm.ListeCommune= result.data.response;	        
				      // console.log(vm.ListeCommune);
				      });

			      });
            	
        };
        vm.supprimerProtection_sociale = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajoutProtection_sociale(vm.selectedItemProtection_sociale,1);
			}, function() {
			});
        }
        vm.modifierileprotection = function (item) 
        {
          var ile = vm.allile.filter(function(obj)
          {
              return obj.id == item.ile_id;
          });
          //console.log(ile);
          item.programme_id=ile[0].programme.id;
          item.village_id='';
          //console.log(item.ile_id);
          vm.currentId_ile=item.ile_id;

	      apiFactory.getPrefectureByIle("region/index",item.ile_id).then(function(result)
	       {vm.ListePrefecture = result.data.response;
	       //	console.log(vm.PrefectureListe);
	       });
	      vm.ileSelected = true;

        }

        function test_existenceProtection_sociale (item,suppression)
        {    //console.log(currentItemProtection_sociale);
			if (suppression!=1) 
            {
                var ps = vm.allProtection_sociale.filter(function(obj)
                {
                   return obj.id == currentItemProtection_sociale.id;
                });
                if(ps[0])
                {
                   if((ps[0].Code!=currentItemProtection_sociale.Code)
                        ||(ps[0].Nom!=currentItemProtection_sociale.Nom)
                        ||(ps[0].Contact!=currentItemProtection_sociale.Contact)
                        ||(ps[0].NumeroTelephone!=currentItemProtection_sociale.NumeroTelephone)
                        ||(ps[0].Representant!=currentItemProtection_sociale.Representant)
                        ||(ps[0].ile.id!=currentItemProtection_sociale.ile_id)
                        ||(ps[0].programme.id!=currentItemProtection_sociale.programme_id)
                        ||(ps[0].village.id!=currentItemProtection_sociale.village_id))                    
                      { 
                        insert_in_baseProtection_sociale(item,suppression);
                      }
                      else
                      {
                        item.$selected=false;
						item.$edit=false;
                      }                    
             	} 
            }else
              insert_in_baseProtection_sociale(item,suppression);		
        }
		// DEBUT UNITE DE MESURE
		// Fonction Insertion,modif,suppression table unite_mesure
		function ajoutUnitemesure(typeact,suppression) {
            test_existenceUnitemesure (typeact,suppression);
        }
        function insert_in_baseUnitemesure(typeact,suppression) {  
			//add
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var getId = 0;
			if (NouvelItemUnitemesure==false) {
			   getId = vm.selectedItemUnitemesure.id; 
			} 
			var datas = $.param({
				supprimer:suppression,
				id:getId,      
				code: typeact.code,
				description: typeact.description,
			});       
			//factory
			apiFactory.add("unite_mesure/index",datas, config).success(function (data) {
				if (NouvelItemUnitemesure == false) {
					// Update or delete: id exclu                   
					if(suppression==0) {
					  vm.selectedItemUnitemesure.code = typeact.code;
					  vm.selectedItemUnitemesure.description = typeact.description;
					  vm.selectedItemUnitemesure.$selected = false;
					  vm.selectedItemUnitemesure.$edit = false;
					  vm.selectedItemUnitemesure ={};
					  vm.action="Modification d'un erengistrement de DDB : Unité de mésure" + " ("+ typeact.description + ")";
					} else {    
						vm.allRecordsUnitemesure = vm.allRecordsUnitemesure.filter(function(obj) {
							return obj.id !== vm.selectedItemUnitemesure.id;
						});
						vm.action="Suppression d'un erengistrement de DDB : Unité de mésure" + " ("+ typeact.description + ")";
					}
				} else {
					typeact.id=data.response;	
					NouvelItemUnitemesure=false;
					vm.action="Ajout d'un erengistrement de DDB : Unité de mésure" + " ("+ typeact.description + ")";
				}
				typeact.$selected=false;
				typeact.$edit=false;
				//add historique
				var config = {
					headers : {
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
					}
				};
				var datas = $.param({
					action:vm.action,
					id_utilisateur:vm.id_utilisateur
				});
				//factory
				apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
				});
			}).error(function (data) {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
        }
		// Clic sur un enregistrement unité de mesure
        vm.selectionUnitemesure= function (item) {     
            vm.selectedItemUnitemesure = item;
        };
		// $watch pour sélectionner ou désélectionner automatiquement un item unité de mesure
        $scope.$watch('vm.selectedItemUnitemesure', function() {
			if (!vm.allRecordsUnitemesure) return;
			vm.allRecordsUnitemesure.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemUnitemesure.$selected = true;
        });
        // Ajout d'un nouvel item unité de mesure
        vm.ajouterUnitemesure = function () {
            vm.selectedItemUnitemesure.$selected = false;
            NouvelItemUnitemesure = true ;
		    var items = {
				$edit: true,
				$selected: true,
				supprimer:0,
                code: '',
                description: '',
			};
			vm.allRecordsUnitemesure.push(items);
		    vm.allRecordsUnitemesure.forEach(function(it) {
				if(it.$selected==true) {
					vm.selectedItemUnitemesure = it;
				}
			});			
        };
		// Annulation modification d'un item  unité de mesure
        vm.annulerUnitemesure = function(item) {
			if (!item.id) {
				vm.allRecordsUnitemesure.pop();
				vm.selectedItemUnitemesure = {} ;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItemUnitemesure = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemUnitemesure = {} ;
			vm.selectedItemUnitemesure.$selected = false;
       };
	   // Modification d'un item d'unité de mesure
        vm.modifierUnitemesure = function(item) {
			NouvelItemUnitemesure = false ;
			vm.selectedItemUnitemesure = item;
			currentItem = angular.copy(vm.selectedItemUnitemesure);
			$scope.vm.allRecordsUnitemesure.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemUnitemesure.code = vm.selectedItemUnitemesure.code;
			vm.selectedItemUnitemesure.description = vm.selectedItemUnitemesure.description;
			vm.selectedItemUnitemesure.$edit = true;	
        };
		// Suppression d'un item unité de mesure
        vm.supprimerUnitemesure = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajoutUnitemesure(vm.selectedItemUnitemesure,1);
			}, function() {
			});
        }
		// Test doublon description unité de mesure
        function test_existenceUnitemesure (item,suppression) {    
			if(item.description.length > 0) {
				var doublon = 0;
				if (suppression!=1) {
					vm.allRecordsUnitemesure.forEach(function(dispo) {   
						if((dispo.description==item.description) && dispo.id!=item.id) {
							doublon=1;	
						} 
					});
					if(doublon==1) {
						vm.showAlert('Information !','ERREUR ! : Déscription déjà utilisé')
					} else {
						insert_in_baseUnitemesure(item,0);
					}
				} else {
				  insert_in_baseUnitemesure(item,suppression);
				}  
			} else {
				vm.showAlert('Erreur',"Veuillez saisir la déscription du type de financement !");
			}		
        }
	// FIN UNITE DE MESURE	
		// DEBUT TYPE TRANSFERT
		// Fonction Insertion,modif,suppression table type_transfert
		function ajoutTypetransfert(typeact,suppression) {
            test_existenceTypetransfert (typeact,suppression);
        }
        function insert_in_baseTypetransfert(typeact,suppression) {  
			//add
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var getId = 0;
			if (NouvelItemTypetransfert==false) {
			   getId = vm.selectedItemTypetransfert.id; 
			} 
			var datas = $.param({
				supprimer:suppression,
				id:getId,      
				code: typeact.code,
				description: typeact.description,
			});       
			//factory
			vm.action="";
			apiFactory.add("type_transfert/index",datas, config).success(function (data) {
				if (NouvelItemTypetransfert == false) {
					// Update or delete: id exclu                   
					if(suppression==0) {
						vm.selectedItemTypetransfert.code = typeact.code;
						vm.selectedItemTypetransfert.description = typeact.description;
						vm.selectedItemTypetransfert.$selected = false;
						vm.selectedItemTypetransfert.$edit = false;
						vm.selectedItemTypetransfert.detail_type_transfert.forEach(function(it) {
							// Si description modifiée : rafraichir table détail à droite
							if(it.id_type_transfert== vm.selectedItemTypetransfert.id) {
								it.typedetransfert=[];
								it.typedetransfert.push(typeact);
							}
						});	
						vm.action="Modification d'un enregistrement DDB : Type de transfert" + " ("+ typeact.description + ")";		
						vm.selectedItemTypetransfert ={};
					} else {  
						// Suppression type_transfert
						vm.allRecordsTypetransfert = vm.allRecordsTypetransfert.filter(function(obj) {
							return obj.id !== vm.selectedItemTypetransfert.id;
						});
						vm.action="Suppression d'un enregistrement DDB : Type de transfert" + " ("+ typeact.description + ")";
					}
				} else {
					typeact.id=data.response;	
					NouvelItemTypetransfert=false;
					vm.action="Ajout d'un enregistrement DDB : Type de transfert" + " ("+ typeact.description + ")";
				}
				typeact.$selected=true;
				typeact.$edit=false;
				//add historique
				var config = {
					headers : {
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
					}
				};
				var datas = $.param({
					action:vm.action,
					id_utilisateur:vm.id_utilisateur
				});
				//factory
				apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
				});				
			}).error(function (data) {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
        }
		// Clic sur un item type_transfert
        vm.selectionTypetransfert= function (item) {     
           vm.selectedItemTypetransfert = item;
			if(item.detail_charge==0) {
				vm.affiche_load=true;
				item.detail_type_transfert =[];
				setTimeout(function(){
					apiFactory.getAPIgeneraliserREST("detail_type_transfert/index","cle_etrangere",vm.selectedItemTypetransfert.id).then(function(result) {
						item.detail_type_transfert = result.data.response;
						item.detail_charge=1;
						vm.affiche_load=false;
					});
				},600);	
			} 		
        };
		// $watch pour sélectionner ou désélectionner automatiquement un item type_transfert
        $scope.$watch('vm.selectedItemTypetransfert', function() {
			if (!vm.allRecordsTypetransfert) return;
			vm.allRecordsTypetransfert.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemTypetransfert.$selected = true;
        });
        // Ajout d'un nouvel item type_transfert
        vm.ajouterTypetransfert = function () {
            vm.selectedItemTypetransfert.$selected = false;
            NouvelItemTypetransfert = true ;
		    var items = {
				$edit: true,
				$selected: true,
				supprimer:0,
                code: null,
                description: null,
                detail_type_transfert : []
			};
			vm.allRecordsTypetransfert.push(items);
		    vm.allRecordsTypetransfert.forEach(function(it) {
				if(it.$selected==true) {
					vm.selectedItemTypetransfert = it;
				}
			});			
        };
		// Annulation modification d'un item type_transfert
        vm.annulerTypetransfert = function(item) {
			if (!item.id) {
				vm.allRecordsTypetransfert.pop();
				vm.selectedItemTypetransfert = {} ;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItemTypetransfert = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemTypetransfert = {} ;
			vm.selectedItemTypetransfert.$selected = false;
       };
	   // Modification d'un item type_transfert
        vm.modifierTypetransfert = function(item) {
			NouvelItemTypetransfert = false ;
			vm.selectedItemTypetransfert = item;
			currentItem = angular.copy(vm.selectedItemTypetransfert);
			$scope.vm.allRecordsTypetransfert.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemTypetransfert.code = vm.selectedItemTypetransfert.code;
			vm.selectedItemTypetransfert.description = vm.selectedItemTypetransfert.description;
			vm.selectedItemTypetransfert.$edit = true;	
        };
		// Suppression d'un item type_transfert
        vm.supprimerTypetransfert = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajoutTypetransfert(vm.selectedItemTypetransfert,1);
			}, function() {
			});
        }
		// Test doublon description type_transfert
        function test_existenceTypetransfert (item,suppression) {    
			if(item.description.length > 0) {
				var doublon = 0;
				if (suppression!=1) {
					vm.allRecordsTypetransfert.forEach(function(dispo) {   
						if((dispo.description==item.description) && dispo.id!=item.id) {
							doublon=1;	
						} 
					});
					if(doublon==1) {
						vm.showAlert('Information !','ERREUR ! : Déscription déjà utilisé')
					} else {
						insert_in_baseTypetransfert(item,0);
					}
				} else {
				  insert_in_baseTypetransfert(item,1);
				}  
			} else {
				vm.showAlert('Erreur',"Veuillez saisir la déscription du type de financement !");
			}		
        }
		// FIN TYPE TRANSFERT	
		// DEBUT DETAIL TYPE TRANSFERT
		// Fonction Insertion,modif,suppression table detail_type_transfert
		function ajoutDetailtypetransfert(typeact,suppression) {
            test_existenceDetailtypetransfert (typeact,suppression);
        }
        function insert_in_baseDetailtypetransfert(typeact,suppression) {  
			//add
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var getId = 0;
			if (NouvelItemDetailtypetransfert==false) {
			   getId = vm.selectedItemDetailtypetransfert.id; 
			} 
			var datas = $.param({
				supprimer:suppression,
				id:getId,      
				code: typeact.code,
				description: typeact.description,
				id_unite_mesure: typeact.id_unite_mesure,
				id_type_transfert: typeact.id_type_transfert,
			});       
			//factory
			apiFactory.add("detail_type_transfert/index",datas, config).success(function (data) {
				if (NouvelItemDetailtypetransfert == false) {
					// Update or delete: id exclu                   
					if(suppression==0) {
						for (var i = 0; i < vm.selectedItemTypetransfert.detail_type_transfert.length; i++) {
							if(vm.selectedItemTypetransfert.detail_type_transfert[i].$selected==true) {
								vm.selectedItemTypetransfert.detail_type_transfert[i]=typeact;
								vm.selectedItemTypetransfert.detail_type_transfert[i].$selected=false;
								vm.selectedItemDetailtypetransfert=typeact;
								vm.selectedItemDetailtypetransfert.$selected = false;
								vm.selectedItemDetailtypetransfert ={};
							}          
						}							
						vm.selectedItemDetailtypetransfert.$selected = false;
						vm.selectedItemDetailtypetransfert.$edit = false;
						vm.selectedItemDetailtypetransfert ={};	
						vm.action="Modification d'un enregistrement de DDB : Détail type de transfert";		
					} else {    
						vm.selectedItemTypetransfert.detail_type_transfert = vm.selectedItemTypetransfert.detail_type_transfert.filter(function(obj) {
							return obj.id !== vm.selectedItemDetailtypetransfert.id;
						});
						vm.action="Suppression d'un enregistrement de DDB : Détail type de transfert";
					}
				} else {					
					typeact.id=data.response;	
					NouvelItemDetailtypetransfert=false;
					vm.action="Ajout d'un enregistrement de DDB : Détail type de transfert";
				}

				typeact.$selected=true;
				typeact.$edit=false;
				//add historique
				var config = {
					headers : {
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
					}
				};
				var datas = $.param({
					action:vm.action,
					id_utilisateur:vm.id_utilisateur
				});
				//factory
				apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
				});				
			}).error(function (data) {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
        }
		// Clic sur un item detail_type_transfert
        vm.selectionDetailtypetransfert= function (item) {     
            vm.selectedItemDetailtypetransfert = item;
        };
		// $watch pour sélectionner ou désélectionner automatiquement un item  detail_type_transfert
        $scope.$watch('vm.selectedItemDetailtypetransfert', function() {
			if (!vm.selectedItemDetailtypetransfert) return;
			vm.selectedItemTypetransfert.detail_type_transfert.forEach(function(it) {
				it.$selected = false;
			});			
			vm.selectedItemDetailtypetransfert.$selected = true;
        });
        // Ajout d'un nouvel item detail_type_transfert
        vm.ajouterDetailtypetransfert = function () {
            // vm.selectedItemDetailtypetransfert.$selected = false;
			var xx={description:vm.selectedItemTypetransfert.description};
			vm.tmp =[];
			vm.tmp.push(xx);
            NouvelItemDetailtypetransfert = true ;
		    var items = {
				$edit: true,
				$selected: true,
				supprimer:0,
                code: null,
                description: null,
                id_unite_mesure: null,
                unitedemesure: [],
                id_type_transfert: vm.selectedItemTypetransfert.id,
                typedetransfert: vm.tmp,
			};
			vm.selectedItemTypetransfert.detail_type_transfert.push(items);
		    vm.selectedItemTypetransfert.detail_type_transfert.forEach(function(it) {
				if(it.$selected==true) {
					vm.selectedItemDetailtypetransfert = it;
				}
			});			
        };
		// Annulation modification d'un item detail_type_transfert
        vm.annulerDetailtypetransfert = function(item) {
			if (!item.id) {
				vm.selectedItemTypetransfert.detail_type_transfert = vm.selectedItemTypetransfert.detail_type_transfert.filter(function(obj) {
					return parseInt(obj.id) > 0;
				});
				vm.selectedItemDetailtypetransfert = {} ;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItemDetailtypetransfert = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemDetailtypetransfert = {} ;
			vm.selectedItemDetailtypetransfert.$selected = false;
       };
	   // Modification d'un item  detail_type_transfert
        vm.modifierDetailtypetransfert = function(item) {
			NouvelItemDetailtypetransfert = false ;
			vm.selectedItemDetailtypetransfert = item;
			currentItem = angular.copy(vm.selectedItemDetailtypetransfert);
			vm.selectedItemTypetransfert.detail_type_transfert.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemDetailtypetransfert.code = vm.selectedItemDetailtypetransfert.code;
			vm.selectedItemDetailtypetransfert.description = vm.selectedItemDetailtypetransfert.description;
			vm.selectedItemDetailtypetransfert.$edit = true;	
        };
		// Suppression d'un item detail_type_transfert
        vm.supprimerDetailtypetransfert = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajoutDetailtypetransfert(vm.selectedItemDetailtypetransfert,1);
			}, function() {
			});
        }
		// Test doublon detail_type_transfert
        function test_existenceDetailtypetransfert (item,suppression) {    
			if(item.description.length > 0) {
				var doublon = 0;
				if (suppression!=1) {
					vm.allRecordsDetailtypetransfert.forEach(function(dispo) {   
						if((dispo.description==item.description) && dispo.id!=item.id) {
							doublon=1;	
						} 
					});
					if(doublon==1) {
						vm.showAlert('Information !','ERREUR ! : Déscription déjà utilisé')
					} else {
						insert_in_baseDetailtypetransfert(item,0);
					}
				} else {
				  insert_in_baseDetailtypetransfert(item,suppression);
				}  
			} else {
				vm.showAlert('Erreur',"Veuillez saisir la déscription du type de financement !");
			}		
        }
		// Fonction modif type unité de mésure
        vm.modifierTypeunitemesure = function (item) { 
			vm.nontrouvee=true;
			vm.allRecordsUnitemesure.forEach(function(umes) {
				if(parseInt(umes.id)==parseInt(item.id_unite_mesure)) {
					item.id_unite_mesure = umes.id; 
					item.unitedemesure=[];
					item.unitedemesure.push(umes);
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.acteur.id_unite_mesure = null; 
					vm.acteur.unitedemesure=[];
			}
		}
	// FIN DETAIL TYPE TRANSFERT	
		// DEBUT FREQUENCE TRANSFERT
		// Fonction Insertion,modif,suppression table frequence_transfert
		function ajoutFrequencetransfert(typeact,suppression) {
            test_existenceFrequencetransfert (typeact,suppression);
        }
        function insert_in_baseFrequencetransfert(typeact,suppression) {  
			//add
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var getId = 0;
			if (NouvelItemFrequencetransfert==false) {
			   getId = vm.selectedItemFrequencetransfert.id; 
			} 
			var datas = $.param({
				supprimer:suppression,
				id:getId,      
				code: typeact.code,
				description: typeact.description,
			});       
			//factory
			apiFactory.add("frequence_transfert/index",datas, config).success(function (data) {
				if (NouvelItemFrequencetransfert == false) {
					// Update or delete: id exclu                   
					if(suppression==0) {
						vm.selectedItemFrequencetransfert.code = typeact.code;
						vm.selectedItemFrequencetransfert.description = typeact.description;
						vm.selectedItemFrequencetransfert.$selected = false;
						vm.selectedItemFrequencetransfert.$edit = false;
						vm.selectedItemFrequencetransfert ={};
						vm.action="Modification d'un enregistrement de DDB : Fréquence de transfert" + " ("+ typeact.description + ")";
					} else { 
						// Suppression
						vm.allRecordsFrequencetransfert = vm.allRecordsFrequencetransfert.filter(function(obj) {
							return obj.id !== vm.selectedItemFrequencetransfert.id;
						});
						vm.action="Suppression d'un enregistrement de DDB : Fréquence de transfert" + " ("+ typeact.description + ")";
					}
				} else {
					// Nouvel item
					typeact.id=data.response;	
					NouvelItemFrequencetransfert=false;
					vm.action="Ajout d'un enregistrement de DDB : Fréquence de transfert" + " ("+ typeact.description + ")";
				}
				typeact.$selected=false;
				typeact.$edit=false;
				//add historique
				var config = {
					headers : {
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
					}
				};
				var datas = $.param({
					action:vm.action,
					id_utilisateur:vm.id_utilisateur
				});
				//factory
				apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
				});				
			}).error(function (data) {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
        }
		// Clic sur un item frequence_transfert
        vm.selectionFrequencetransfert= function (item) {     
            vm.selectedItemFrequencetransfert = item;
			if(item.detail_charge==0) {
				item.detail_type_transfert =[];
				setTimeout(function(){
					apiFactory.getAPIgeneraliserREST("detail_type_transfert/index","cle_etrangere",vm.selectedItemFrequencetransfert.id).then(function(result) {
						item.detail_type_transfert = result.data.response;
						item.detail_charge=1;
					});
				},600);	
			} 		
        };
		// $watch pour sélectionner ou désélectionner automatiquement un item frequence_transfert
        $scope.$watch('vm.selectedItemFrequencetransfert', function() {
			if (!vm.allRecordsFrequencetransfert) return;
			vm.allRecordsFrequencetransfert.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemFrequencetransfert.$selected = true;
        });
        // Ajout d'un nouvel item frequence_transfert
        vm.ajouterFrequencetransfert = function () {
            vm.selectedItemFrequencetransfert.$selected = false;
            NouvelItemFrequencetransfert = true ;
		    var items = {
				$edit: true,
				$selected: true,
				supprimer:0,
                code: null,
                description: null,
			};
			vm.allRecordsFrequencetransfert.push(items);
		    vm.allRecordsFrequencetransfert.forEach(function(it) {
				if(it.$selected==true) {
					vm.selectedItemFrequencetransfert = it;
				}
			});			
        };
		// Annulation modification d'un item frequence_transfert
        vm.annulerFrequencetransfert = function(item) {
			if (!item.id) {
				vm.allRecordsFrequencetransfert.pop();
				vm.selectedItemFrequencetransfert = {} ;
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItemFrequencetransfert = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemFrequencetransfert = {} ;
			vm.selectedItemFrequencetransfert.$selected = false;
       };
	   // Modification d'un item frequence_transfert
        vm.modifierFrequencetransfert = function(item) {
			NouvelItemFrequencetransfert = false ;
			vm.selectedItemFrequencetransfert = item;
			currentItem = angular.copy(vm.selectedItemFrequencetransfert);
			$scope.vm.allRecordsFrequencetransfert.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemFrequencetransfert.code = vm.selectedItemFrequencetransfert.code;
			vm.selectedItemFrequencetransfert.description = vm.selectedItemFrequencetransfert.description;
			vm.selectedItemFrequencetransfert.$edit = true;	
        };
		// Suppression d'un item frequence_transfert
        vm.supprimerFrequencetransfert = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajoutFrequencetransfert(vm.selectedItemFrequencetransfert,1);
			}, function() {
			});
        }
		// Test doublon description frequence_transfert
        function test_existenceFrequencetransfert (item,suppression) {    
			if(item.description.length > 0) {
				var doublon = 0;
				if (suppression!=1) {
					vm.allRecordsFrequencetransfert.forEach(function(dispo) {   
						if((dispo.description==item.description) && dispo.id!=item.id) {
							doublon=1;	
						} 
					});
					if(doublon==1) {
						vm.showAlert('Information !','ERREUR ! : Déscription déjà utilisé')
					} else {
						insert_in_baseFrequencetransfert(item,0);
					}
				} else {
				  insert_in_baseFrequencetransfert(item,suppression);
				}  
			} else {
				vm.showAlert('Erreur',"Veuillez saisir la déscription de la fréquence de transfert !");
			}		
        }
		// FIN FREQUENCE TRANSFERT		
		
		
		
		
    vm.nouveauVillage = function (ev,item)
	{	//console.log('eto');
		if (item.ile_id)
		{
			var confirm = $mdDialog.confirm({
			controller: DialogController,
			templateUrl: 'app/main/pfss/administration/ddb/acteurs/dialog.html',
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
   function DialogController($mdDialog, $scope,$state)
  	{ 
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
			vm.allRecordsAgent_ex.forEach(function(prg) {
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
    }
  })();

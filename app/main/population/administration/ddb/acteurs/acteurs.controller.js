(function ()
{
    'use strict';
    angular
        .module('app.population.ddb_adm.acteurs')
        .controller('ActeursController', ActeursController);

    /** @ngInject */
    function ActeursController(apiFactory, $state, $mdDialog, $scope,$cookieStore) {
		// Déclaration des variables et fonctions
		var vm = this;
		vm.titrepage ="Ajout Tutelle";
		vm.ajout = ajout ;
		vm.ajoutActeur = ajoutActeur ;
		vm.ajoutTypetransfert = ajoutTypetransfert ;
		vm.ajoutUnitemesure = ajoutUnitemesure ;
		vm.ajoutDetailtypetransfert = ajoutDetailtypetransfert ;
		vm.ajoutFrequencetransfert = ajoutFrequencetransfert ;
		var NouvelItem=false;
		var NouvelItemActeur=false;
		var NouvelItemActeurregional=false;
		var currentItem;
		vm.selectedItemTypeacteur = {} ;
		vm.selectedItemActeur = {} ;
		vm.selectedItemActeurregional = {} ;
		vm.selectedItemTypetransfert = {} ;     
		vm.selectedItemUnitemesure = {} ;   
		vm.selectedItemFrequencetransfert = {} ;   
		vm.selectedItemTypetransfert.detail_type_transfert	={};	
		vm.all_region =[];
		vm.all_district =[];
		vm.all_commune =[];
		vm.all_fokontany =[];
		vm.acteur =[];
		vm.allRecordsTypeacteur = [] ;
		vm.allRecordsActeur = [] ;
		vm.allRecordsTypetransfert = [] ;
		vm.allRecordsUnitemesure = [] ;
		vm.allRecordsDetailtypetransfert = [] ;
		vm.allRecordsFrequencetransfert = [] ;
		vm.allRecordsActeurregional = [] ;
		vm.nom_table="type_acteur";
		vm.cas=1;
        vm.afficherboutonnouveau = 1 ;
		vm.afficherboutonModifSupr = 0 ;
        vm.affichageMasque = 0 ;
		vm.titreacteur="Ajout Acteur";
		vm.filtre=[];
		vm.filtre.id_region ={};
		vm.filtre.id_district ={};
		vm.filtre.id_commune ={};
		vm.acteur.id_fokontany ={};
		vm.afficher_onglet=true;
		vm.affiche_load=false;
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
		// Récupération via cookies id utilisateur
        vm.id_utilisateur = $cookieStore.get('id');		
		vm.detailtypetransfert_column = [{titre:"Type transfert"},{titre:"Code"},{titre:"Description"},{titre:"Unité mésure"},{titre:"Actions"}];
		vm.typeacteur_column = [{titre:"Code"},{titre:"Description"},{titre:"Actions"}];
		vm.unite_mesure_column = [{titre:"Code"},{titre:"Description"},{titre:"Actions"}];
		vm.typetransfert_column = [{titre:"Code"},{titre:"Description"},{titre:"Actions"}];
		vm.acteur_column = [{titre:"Type Act"},{titre:"Code"},{titre:"Nom"},{titre:"Représentant"},{titre:"Tél"},{titre:"Adresse"},{titre:"Fokontany"}];
		vm.acteurregional_column = [{titre:"Type Act"},{titre:"Nom"},{titre:"Région"},{titre:"Représentant"},{titre:"Contact"},{titre:"Adresse"},{titre:"Actions"}];
		// Début Récupération données référentielles
		apiFactory.getAll("region/index").then(function(result){
			vm.all_region = result.data.response;
		});    
		apiFactory.getAll("type_acteur/index").then(function(result){
			vm.allRecordsTypeacteur = result.data.response;
			apiFactory.getAll("acteur/index").then(function(result){
				vm.allRecordsActeur = result.data.response;
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
		// Fin Récupération données référentielles
		//add historique utilisateur : consultation
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		};
		var datas = $.param({
			action:"Consultation DDB : Acteurs/Type transfert",
			id_utilisateur:vm.id_utilisateur
		});
		//factory
		apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
		});				
		
      vm.filtre_region = function() {
		  // Récupération des districts correspondant à une région donnée (id_region passée en paramètre)
        apiFactory.getAPIgeneraliserREST("district/index","cle_etrangere",vm.filtre.id_region).then(function(result) { 
          vm.all_district = result.data.response;   
          vm.filtre.id_district = null ; 
          vm.filtre.id_commune = null ; 
          vm.acteur.id_fokontany = null ; 
        });

      }
      vm.filtre_commune = function() {
		  // Récupération des  communes correspondant à un district donnée (id_district passée en paramètre)
        apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtre.id_district).then(function(result)  { 
          vm.all_commune = result.data.response; 
          vm.filtre.id_commune = null ; 
          vm.acteur.id_fokontany = null ;           
        });
      }
      vm.filtre_fokontany = function() {
		  // Récupération des  fokontany correspondant à un commune donnée (id_commune passée en paramètre)
        apiFactory.getAPIgeneraliserREST("fokontany/index","cle_etrangere",vm.filtre.id_commune).then(function(result) { 
          vm.all_fokontany = result.data.response;    
          vm.acteur.id_fokontany = null ; 
        });
      }
		function ajout(typeact,suppression) {
            test_existence (typeact,suppression);
        }
        function insert_in_base(typeact,suppression) {  
			//add
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var getId = 0;
			if (NouvelItem==false) {
			   getId = vm.selectedItemTypeacteur.id; 
			} 
			var datas = $.param({
				supprimer:suppression,
				id:getId,      
				code: typeact.code,
				description: typeact.description,
			});       
			//factory type_acteur
			apiFactory.add("type_acteur/index",datas, config).success(function (data) {
				if (NouvelItem == false) {
					// Update or delete: id exclu                   
					if(suppression==0) {
					  vm.selectedItemTypeacteur.code = typeact.code;
					  vm.selectedItemTypeacteur.description = typeact.description;
					  vm.selectedItemTypeacteur.$selected = false;
					  vm.selectedItemTypeacteur.$edit = false;
					  vm.selectedItemTypeacteur ={};
					  vm.action="Modification d'un enregistrement de DDB : Type acteur" + " ("+ typeact.code + " " +  typeact.description + ")";
					} else {    
						// Suppression type acteur
						vm.allRecordsTypeacteur = vm.allRecordsTypeacteur.filter(function(obj) {
							return obj.id !== vm.selectedItemTypeacteur.id;
						});
						vm.action="Suppression d'un enregistrement de DDB : Type acteur" + " ("+ typeact.code + " " + typeact.description + ")";
					}
				} else {
					typeact.id=data.response;	
					NouvelItem=false;
					vm.action="Ajout d'un enregistrement de DDB : Type acteur" + " ("+ typeact.code + " " + typeact.description + ")";
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
		// DEBUT TYPE ACTEUR
		// Clic sur un enregistrement type acteur
        vm.selectionTypeacteur= function (item) {     
            vm.selectedItemTypeacteur = item;
        };
		// $watch pour sélectionner ou désélectionner automatiquement un item du type acteur
        $scope.$watch('vm.selectedItemTypeacteur', function() {
			if (!vm.allRecordsTypeacteur) return;
			vm.allRecordsTypeacteur.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemTypeacteur.$selected = true;
        });

        function generer_code_type_acteur()
        {
        	var code = (vm.allRecordsTypeacteur.length + 1);
        	if (code > 0 && code < 10) 
        	{
        		return '00'+code ;
        	}
        	if (code >= 10 && code < 100) 
        	{
        		return '0'+code ;
        	}
        	if (code >= 100) 
        	{
        		return ''+code ;
        	}
        	
        }
        // Ajout d'un nouvel item type acteur
        vm.ajouterTypeacteur = function () {
            vm.selectedItemTypeacteur.$selected = false;
            NouvelItem = true ;
		    var items = {
		    	id:0,
				$edit: true,
				$selected: true,
				supprimer:0,
                code: generer_code_type_acteur(),
                description: '',
			};
			vm.allRecordsTypeacteur.push(items);
		    vm.allRecordsTypeacteur.forEach(function(it) {
				if(it.$selected==true) {
					vm.selectedItemTypeacteur = it;
				}
			});			
        };
		// Annulation modification d'un item type acteur
        vm.annulerTypeacteur = function(item) {
			if (!item.id) {
				vm.allRecordsTypeacteur.pop();
				vm.selectedItemTypeacteur ={};
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemTypeacteur = {} ;
			vm.selectedItemTypeacteur.$selected = false;
       };
	   // Modification d'un item type acteur
        vm.modifierTypeacteur = function(item) {
			NouvelItem = false ;
			vm.selectedItemTypeacteur = item;
			currentItem = angular.copy(vm.selectedItemTypeacteur);
			$scope.vm.allRecordsTypeacteur.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			vm.selectedItemTypeacteur.code = vm.selectedItemTypeacteur.code;
			vm.selectedItemTypeacteur.description = vm.selectedItemTypeacteur.description;
			vm.selectedItemTypeacteur.$edit = true;	
        };
		// Suppression d'un item type acteur
        vm.supprimerTypeacteur = function(item_a_supprimer) {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {  
				vm.selectedItemTypeacteur=item_a_supprimer;
				ajout(item_a_supprimer,1);
				vm.selectedItemTypeacteur=item_a_supprimer;
			}, function() {
			});
        }
		// Test existence doublon description
        function test_existence (item,suppression) {    
			if(item.description.length > 0) {
				var doublon = 0;
				if (suppression!=1) {
					vm.allRecordsTypeacteur.forEach(function(dispo) {   
						if((dispo.description==item.description) && dispo.id!=item.id) {
							doublon=1;	
						} 
					});
					if(doublon==1) {
						vm.showAlert('Information !','ERREUR ! : Intitulé déjà utilisé')
					} else {
						insert_in_base(item,0);
					}
				} else {
				  insert_in_base(item,suppression);
				}  
			} else {
				vm.showAlert('Erreur',"Veuillez saisir l'intitulé du type de financement !");
			}		
        }
	// FIN TYPE ACTEUR	
	// DEBUT ACTEURS	
		function ajoutActeur(entite,suppression) {
            test_existenceActeur (entite,suppression);
        }
		// Fonction Insertion,modif,suppression table acteur
        function insert_in_baseActeur(entite,suppression) {  
			//add
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var getId = 0;
			if (NouvelItemActeur==false) {
			   getId = vm.selectedItemActeur.id; 
			} 
			var datas = $.param({
				supprimer:suppression,
				id:getId,      
				code: entite.code,
				nom: entite.nom,
				nif: entite.nif,
				stat: entite.stat,
				adresse: entite.adresse,
				id_fokontany: entite.id_fokontany,
				representant: entite.representant,
				fonction: entite.fonction,
				telephone: entite.telephone,
				email: entite.email,
				rcs: entite.rcs,
				id_type_acteur: entite.id_type_acteur,
				typeacteurs: entite.typeacteurs,
			});       
			//factory
			apiFactory.add("acteur/index",datas, config).success(function (data) {
				if (NouvelItemActeur == false) {
					// Update or delete: id exclu                   
					if(suppression==0) {
					  vm.selectedItemActeur.id = entite.id;
					  vm.selectedItemActeur.code = entite.code;
					  vm.selectedItemActeur.nom = entite.nom;
					  vm.selectedItemActeur.nif = entite.nif;
					  vm.selectedItemActeur.stat = entite.stat;
					  vm.selectedItemActeur.adresse = entite.adresse;
					  vm.selectedItemActeur.id_fokontany = entite.id_fokontany;
					  vm.selectedItemActeur.fokontany = entite.fokontany;
					  vm.selectedItemActeur.representant = entite.representant;
					  vm.selectedItemActeur.fonction = entite.fonction;
					  vm.selectedItemActeur.telephone = entite.telephone;
					  vm.selectedItemActeur.email = entite.email;
					  vm.selectedItemActeur.rcs = entite.rcs;
					  vm.selectedItemActeur.id_type_acteur = entite.id_type_acteur;
					  vm.selectedItemActeur.typeacteurs = entite.typeacteurs;
					  vm.selectedItemActeur.$selected = false;
					  vm.selectedItemActeur.$edit = false;
					  // vm.selectedItemActeur ={};
						vm.afficherboutonModifSupr = 0 ;
						vm.afficherboutonnouveau = 1 ;
						vm.action="Modification d'un enregistrement de DDB : Acteur" + " ("+ entite.nom + ")";
					} else {  
						// Suppression acteur
						vm.allRecordsActeur = vm.allRecordsActeur.filter(function(obj) {
							return obj.id !== vm.selectedItemActeur.id;
						});
						vm.action="Suppression d'un enregistrement de DDB : Acteur" + " ("+ entite.nom + ")";
					}
				} else {
					// Nouvel item : ajout sur la liste sur écran
                    var item = {
						id:String(data.response) ,
						code: entite.code,
						nom: entite.nom,
						nif:entite.nif,
						stat: entite.stat,
						adresse: entite.adresse,
						id_fokontany: entite.id_fokontany,
						fokontany: entite.fokontany,
						representant: entite.representant,
						fonction: entite.fonction,
						telephone: entite.telephone,
						email: entite.email,
						rcs: entite.rcs,
						id_type_acteur: entite.id_type_acteur,
						typeacteurs: entite.typeacteurs,
					};
					vm.allRecordsActeur.push(item); 
					NouvelItemActeur=false;
					vm.action="Ajout d'un enregistrement de DDB : Acteur" + " (" + entite.code + " " + entite.nom + ")";
				}
				vm.afficher_onglet=true;
				entite.$selected=false;
				entite.$edit=false;
				vm.affichageMasque =0;
				//add historique utilisateur
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
		// Clic sur un enregistrement acteur
        vm.selectionActeur= function (item) {     
            vm.selectedItemActeur = item;
            currentItem = JSON.parse(JSON.stringify(vm.selectedItemActeur));       
            vm.afficherboutonModifSupr = 1 ;
            vm.affichageMasque = 0 ;
            vm.afficherboutonnouveau = 1 ;
            NouvelItemActeur=false;
        };
		// $watch pour sélectionner ou désélectionner automatiquement un item acteur
        $scope.$watch('vm.selectedItemActeur', function() {
			if (!vm.allRecordsActeur) return;
			vm.allRecordsActeur.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemActeur.$selected = true;
        });
		// Ajout d'un nouvel item acteur
        vm.ajouterActeur = function () {
			vm.afficher_onglet=false;
			vm.titreacteur="Ajout Acteur";
			vm.selectedItemActeur.$selected = false;
			vm.affichageMasque = 1 ;
			vm.acteur.code=null;
			vm.acteur.nom=null;
			vm.acteur.nif=null;
			vm.acteur.stat=null;
			vm.acteur.adresse=null;
			vm.acteur.id_fokontany=null;
			vm.acteur.representant=null;
			vm.acteur.fonction=null;
			vm.acteur.telephone=null;
			vm.acteur.email=null;
			vm.acteur.rcs=null;
			vm.acteur.id_type_acteur=null;
			vm.acteur.typeacteurs=null;
			vm.acteur.fokontany=null;
			NouvelItemActeur = true ;			
            vm.selectedItemActeur.$selected = false;
        };
		// Annulation modification d'un item acteur
        vm.annulerActeur = function(item) {
			vm.afficher_onglet=true;
			vm.selectedItemActeur = {} ;
			vm.selectedItemActeur.$selected = false;
			vm.affichageMasque = 0 ;
			vm.afficherboutonnouveau = 1 ;
			vm.afficherboutonModifSupr = 0 ;
			NouvelItemActeur = false;
       };
	   // Modification d'un item de acteur
        vm.modifierActeur = function(item) {
			vm.afficher_onglet=false;
			vm.titreacteur="Modification Acteur";
			NouvelItemActeur = false ;
			vm.affichageMasque = 1 ;
			vm.acteur.code = vm.selectedItemActeur.code ;
			vm.acteur.nom = vm.selectedItemActeur.nom ;
			vm.acteur.nif=vm.selectedItemActeur.nif;
			vm.acteur.stat = vm.selectedItemActeur.stat ;
			vm.acteur.adresse = vm.selectedItemActeur.adresse ;
			vm.acteur.representant = vm.selectedItemActeur.representant ;
			vm.acteur.fonction = vm.selectedItemActeur.fonction ;
			vm.acteur.telephone = vm.selectedItemActeur.telephone ;
			vm.acteur.email = vm.selectedItemActeur.email ;
			vm.acteur.rcs = vm.selectedItemActeur.rcs ;
			if(vm.selectedItemActeur.id_fokontany) {
				// REMPLISSAGE FILTRE : Région / District / Commune / Fokontany (retour en arrière)
				var int_id_commune = vm.selectedItemActeur.fokontany[0].id_commune;
				apiFactory.getAPIgeneraliserREST("fokontany/index","cle_etrangere",int_id_commune).then(function(result) { 
					vm.all_fokontany = result.data.response;    
					vm.acteur.id_fokontany=parseInt(vm.selectedItemActeur.id_fokontany);
					vm.filtre.id_commune = parseInt(int_id_commune);
					apiFactory.getOne("commune/index",vm.filtre.id_commune).then(function(result)  { 
						vm.district_id = result.data.response[0].district_id; 
						vm.filtre.id_district = parseInt(vm.district_id);
						apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.district_id).then(function(result) { 
							vm.all_commune = result.data.response;  
							apiFactory.getOne("district/index",vm.filtre.id_district).then(function(result)  { 
								vm.region_id = result.data.response[0].region_id; 
								vm.filtre.id_region = parseInt(vm.region_id);
								apiFactory.getAPIgeneraliserREST("district/index","cle_etrangere",vm.region_id).then(function(result) { 
									vm.all_district = result.data.response;  
								});
							});
						});
					});
				});
				
			} else {
				vm.acteur.id_fokontany =null;
				vm.filtre.id_region =null;
				vm.filtre.id_district =null;
				vm.filtre.id_commune =null;
			}	
			if(vm.selectedItemActeur.id_type_acteur) {
				vm.acteur.id_type_acteur=parseInt(vm.selectedItemActeur.id_type_acteur);
			} else vm.acteur.id_type_acteur =null;
			vm.acteur.fokontany = vm.selectedItemActeur.fokontany
			vm.acteur.typeacteurs = vm.selectedItemActeur.typeacteurs
			vm.acteur.id = vm.selectedItemActeur.id ;
			vm.afficherboutonModifSupr = 0;
			vm.afficherboutonnouveau = 0;  
        };
		// Suppression d'un item acteur
        vm.supprimerActeur = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajoutActeur(vm.selectedItemActeur,1);
			}, function() {
			});
        }
		// Test existence doublon nom acteur
        function test_existenceActeur (item,suppression) {    
			if(item.nom.length > 0) {
				var doublon = 0;
				if (suppression!=1) {
					vm.allRecordsActeur.forEach(function(dispo) {   
						if((dispo.nom==item.nom) && dispo.id!=item.id) {
							doublon=1;	
						} 
					});
					if(doublon==1) {
						vm.showAlert('Information !','ERREUR ! : Nom déjà utilisé')
					} else {
						insert_in_baseActeur(item,0);
					}
				} else {
				  insert_in_baseActeur(item,suppression);
				}  
			} else {
				vm.showAlert('Erreur',"Veuillez saisir le nom de l'AGEX !");
			}		
        }	
	// FIN ACTEUR	
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
			if (NouvelItem==false) {
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
				if (NouvelItem == false) {
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
					NouvelItem=false;
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
            NouvelItem = true ;
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
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemUnitemesure = {} ;
			vm.selectedItemUnitemesure.$selected = false;
       };
	   // Modification d'un item d'unité de mesure
        vm.modifierUnitemesure = function(item) {
			NouvelItem = false ;
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
			if (NouvelItem==false) {
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
				if (NouvelItem == false) {
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
					NouvelItem=false;
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
            NouvelItem = true ;
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
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemTypetransfert = {} ;
			vm.selectedItemTypetransfert.$selected = false;
       };
	   // Modification d'un item type_transfert
        vm.modifierTypetransfert = function(item) {
			NouvelItem = false ;
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
			if (NouvelItem==false) {
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
				if (NouvelItem == false) {
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
					NouvelItem=false;
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
            NouvelItem = true ;
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
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemDetailtypetransfert = {} ;
			vm.selectedItemDetailtypetransfert.$selected = false;
       };
	   // Modification d'un item  detail_type_transfert
        vm.modifierDetailtypetransfert = function(item) {
			NouvelItem = false ;
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
			if (NouvelItem==false) {
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
				if (NouvelItem == false) {
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
					NouvelItem=false;
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
            NouvelItem = true ;
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
			NouvelItem = false;
			 item.code = currentItem.code;
			 item.description = currentItem.description;
			vm.selectedItemFrequencetransfert = {} ;
			vm.selectedItemFrequencetransfert.$selected = false;
       };
	   // Modification d'un item frequence_transfert
        vm.modifierFrequencetransfert = function(item) {
			NouvelItem = false ;
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
        vm.modifierRegion = function (item) { 
			vm.all_region.forEach(function(prg) {
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
		// Controle modif type acteur
        vm.modifierTypeacteurActeur = function (item) { 
			vm.nontrouvee=true;
			vm.allRecordsTypeacteur.forEach(function(prg) {
				if(parseInt(prg.id)==parseInt(item.id_type_acteur)) {
					vm.nontrouvee=false;
					vm.acteur.id_type_acteur=prg.id;
					item.id_type_acteur=prg.id;
					vm.acteur.typeacteurs=[];
					var itemss = {
						id: prg.id,
						description: prg.description,
					};
					vm.acteur.typeacteurs.push(itemss);
				}
			});
			if(vm.nontrouvee==true) {				
					vm.acteur.id_type_acteur = null; 
					vm.acteur.typeacteurs=[];
			}
		}
		// Controle modif fokontany	
        vm.modifierFokontany = function (item) { 
			vm.nontrouvee=true;
			vm.all_fokontany.forEach(function(fkt) {
				if(parseInt(fkt.id)==parseInt(item.id_fokontany)) {
					vm.acteur.id_fokontany = fkt.id; 
					vm.acteur.fokontany=[];
					var itemss = {
						id: fkt.id,
						id_commune: fkt.id_commune,
						nom: fkt.nom,
						code: fkt.code,
					};
					vm.acteur.fokontany.push(itemss);
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.acteur.id_fokontany = null; 
					vm.acteur.fokontany=[];
			}
		}
    }
  })();

(function ()
{
    'use strict';

    angular
        .module('app.population.administration.utilisateur')
        .controller('UserController', UserController);

    /** @ngInject */
    function UserController(apiFactory, $location, $mdDialog, $scope,$cookieStore)  {
		var vm = this;
		vm.allSite = [];
		vm.selectedItem = {} ;
		vm.infoAssuj = {} ;
		vm.all_region =[];
		vm.all_district =[];
		vm.all_commune =[];
		vm.all_fokontany =[];
		vm.all_intervention =[];
		vm.NouvelItem = false;
		vm.titre="Nouveau utilisateur";
		vm.afficherboutonnouveau = 1 ;
		vm.afficherboutonModifSupr = 0 ;
		vm.afficherliste =1;

		vm.affiche_load = false ;
		// Récupérer via cookies id utilisateur
		vm.id_utilisateur =$cookieStore.get('id');
		vm.column = 
		[
			{"titre":"Nom et Prénom"},
			{"titre":"Fonction"},
			{"titre":"Tel"},
			{"titre":"Email"},
			{"titre":"Etat"},
			//{"titre":"Envoi des données"},
			{"titre":"Groupes"},
			{"titre":"Status"}

		];

		vm.dtOptions = {
			dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple',
			autoWidth : false,
			responsive: true
		};
		// Récupération des données référentielles
		
		apiFactory.getAll("region/index").then(function(result) { 
			vm.all_region = result.data.response;    
		});
		apiFactory.getAll("intervention/index").then(function(result) { 
			vm.all_intervention = result.data.response;    
		});

		apiFactory.getAll("groupe_utilisateur/index").then(function(result) 
		{ 
			vm.all_groupe = result.data.response;  

			apiFactory.getAll("utilisateurs/index").then(function(result) 
			{
				vm.listes_utilisateurs = result.data.response;
			});  

			vm.affichage_groupe = function(id_groupe)
			{
				var tab = vm.all_groupe ;

				var groupe = tab.filter(function(obj) {            
							return obj.id == id_groupe;
						});

				return groupe[0].nom ;
			}
		});


		



		
		//add historique : consultation DDB annuaire d'intervention
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		};
		var datas = $.param({
			action:"Consultation Administration / Utilisateurs / Gestion utilisateur",
			id_utilisateur:vm.id_utilisateur
		});
		//factory
		apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
		});				
		vm.formatMillier = function (nombre) {
			// Fonction de formatage millier
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
		//LIste check box
		vm.tab_selected = [];

		$scope.toggle = function (item, list) 
		{
			var idx = list.indexOf(item);
			if (idx > -1) list.splice(idx, 1);
			else list.push(item);

			vm.get_roles_user();
			
		};

		$scope.exists = function (item, list) 
		{
			return list.indexOf(item) > -1;
		};

		function retourne_false()
    	{

    		vm.acces.spr_adm = false ;
    		vm.acces.ges_user = false ;
			vm.acces.grp_user = false ;
			vm.acces.his_user = false ;
			vm.acces.var_ind = false ;
			vm.acces.act_typ = false ;
			vm.acces.prog = false ;
			vm.acces.dec_adm = false ;
			vm.acces.nom_int = false ;
			vm.acces.var_int = false ;
			vm.acces.anr_int = false ;
			vm.acces.sui_dec = false ;
			vm.acces.sim_ben = false ;
			vm.acces.sim_int = false ;
			vm.acces.imp_ben = false ;
			vm.acces.imp_int = false ;
			vm.acces.rpt = false ;
			vm.acces.reg_ben = false ;
			vm.acces.cr_change = false ;
    	}

		vm.get_roles_user = function()
		{
			var tab_str = String(vm.tab_selected);
			retourne_false();
			apiFactory.getAPIgeneraliserREST("utilisateurs/index","tab_groupe",tab_str).then(function(result) 
			{
				vm.roles_user = result.data.response;

				
				angular.forEach(vm.roles_user, function(value, key)  
				{           
				switch(value)   {

					case 'SPR_ADM':  {
                      vm.acces.spr_adm = true ;
                      break ;
					}
					case 'USER':  {
                      vm.acces.user = true ;
                      break ;
					}
					case 'GES_USER':  {
			          vm.acces.ges_user = true ;
			          break ;
					}
					case 'GRP_USER':  {
			          vm.acces.grp_user = true ;
			          break ;
					}
					case 'HIS_USER' :  {
			          vm.acces.his_user = true ;
			          break;
					}
					case 'VAR_IND': {
			          vm.acces.var_ind = true ;
			          break;
					}
					case 'ACT_TYP': {
			          vm.acces.act_typ = true ;
			          break;
					}
					case 'PROG':  {
			          vm.acces.prog = true ;
			          break;
					}
					case 'DEC_ADM':  {
			          vm.acces.dec_adm = true ;
			          break;
					}
					case 'NOM_INT':  {
			          vm.acces.nom_int = true ;
			          break;
					}
					case 'VAR_INT':  {
			          vm.acces.var_int = true ;
			          break;
					}
					case 'ANR_INT':  {
			          vm.acces.anr_int = true ;
			          break;
					}
					case 'SUI_DEC':  {
			          vm.acces.sui_dec = true ;
			          break;
					}
					case 'SIM_BEN':  {
			          vm.acces.sim_ben = true ;
			          break;
					}
					case 'SIM_INT':  {
			          vm.acces.sim_int = true ;
			          break;
					}
					case 'IMP_BEN':  {
			          vm.acces.imp_ben = true ;
			          break;
					}
					case 'IMP_INT':  {
			          vm.acces.imp_int = true ;
			          break;
					}
					case 'RPT':  {
			          vm.acces.rpt = true ;
			          break;
					}
					case 'REG_BEN':  {
			          vm.acces.reg_ben = true ;
			          break;
					}
					case 'CR_CHANGE':  {
			          vm.acces.cr_change = true ;
			          break;
					}
					default:  {
			          break ;
					}
				}  

				
			});
			});
		}


		//fin LIste check box
		vm.sexe = function (s)  {
			var x = Number(s);
			switch(x)  {
				case 1:  {
					return "Mr";
					break;
				}
				case 0: {
					return "Mme";
					break;
				}
				default: {
					return "Mr/Mme ...?";
					break;
				}
			}
		}
		vm.filtre_region = function() {
			// Récupération des districts correspondant à une région donnée (id_region passée en paramètre)
			apiFactory.getAPIgeneraliserREST("district/index","cle_etrangere",vm.user.id_region).then(function(result) { 
				vm.all_district = result.data.response;   
				vm.user.id_district = null ; 
				vm.user.id_commune = null ; 
				vm.user.id_fokontany = null ; 
			});
		}
		vm.filtre_commune = function() {
			// Récupération des  communes correspondant à un district donnée (id_district passée en paramètre)
			apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.user.id_district).then(function(result) { 
				vm.all_commune = result.data.response; 
				vm.user.id_commune = null ; 
				vm.user.id_fokontany = null ; 
			});
		}
		vm.filtre_fokontany = function() {
			// Récupération des  fokontany correspondant à un commune donnée (id_commune passée en paramètre)
			apiFactory.getAPIgeneraliserREST("fokontany/index","cle_etrangere",vm.user.id_commune).then(function(result) { 
				vm.all_fokontany = result.data.response;    
				vm.user.id_fokontany = null ;          
			});
		}
		vm.selection = function (item) {   
			// Clis sur un enregistrement
			vm.selectedItem = item; 
			vm.afficherboutonModifSupr = 1 ;
			vm.user = {} ;
			vm.affichageMasque = 0 ;       
		};
		$scope.$watch('vm.selectedItem', function() {
			// Fonction selection et déselection d'un enregistrement
			if (!vm.listes_utilisateurs) return;
			vm.listes_utilisateurs.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
		});
		// Annulation modification
		vm.annuler = function()  {
			vm.user = {} ;
			vm.affichageMasque = 0 ;
			vm.afficherboutonnouveau = 1 ;
			vm.afficherboutonModifSupr =0;
			vm.NouvelItem =false;
			vm.afficherliste =1;
			vm.selectedItem={};
		}     
		function loadAll()  {
			var repos = vm.assujettis ;
			return repos.map( function (repo) {
				repo.value = repo.nom.toLowerCase();      
				return repo;
			});
		}
		function loadAllforPersonnel()  {
			var repos = vm.personnels ;
			return repos.map( function (repo) {
				repo.value = repo.nom.toLowerCase();     
				return repo;
			});
		}
        // Fonction utilisées par balise autocomplete
        vm.querySearch = function  (query) {
            vm.repos = loadAll();
          var results = query ? vm.repos.filter( createFilterFor(query) ) : vm.repos,
              deferred;
          if (vm.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            return deferred.promise;
          } else {
            return results;
          }
        }
        vm.querySearchPersonnel = function  (query) {
            vm.reposPers = loadAllforPersonnel();
          var results = query ? vm.reposPers.filter( createFilterFor(query) ) : vm.reposPers,
              deferred;
          if (vm.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            return deferred.promise;
          } else {
            return results;
          }
        }
        function createFilterFor(query) {
          var lowercaseQuery = angular.lowercase(query);
          return function filterFn(item) {
            return (item.value.indexOf(lowercaseQuery) === 0);
          };
        }
		vm.testEnabled = function(valeur) {
          switch(valeur) {
              case '1':  {
                  return 'Actif' ;
                  break;
              }
              case '0':  {
                  return 'Inactif' ;
                  break;
              }
              case '2':  {
                  return 'Suspendu' ;
                  break;
              }
              default : {
                  return 'Inactif' ;
                  break;
              }
          }
		}

		vm.test_statut = function(valeur) {
          switch(valeur) {
              case '1':  {
                  return 'Connecté' ;
                  break;
              }
              case '0':  {
                  return 'Déconnecté' ;
                  break;
              }
              default : {
                  return 'Déconnecté' ;
                  break;
              }
          }
		}
		// Ajout d'un nouvel utilisateur
        vm.ajouterUtilisateur = function () {
			vm.titre="Nouveau utilisateur";
			vm.affichageMasquefinancementprogramme = 1 ;
			vm.afficherboutonnouveau = 0 ;
			vm.afficherboutonModifSupr =0;
			vm.affichageMasque = 1 ;
			vm.afficherliste =0;
			vm.user.id=0;
			vm.user.nom=null;
			vm.user.user=true;
			vm.user.prenom=null;
			vm.user.email=null;
			vm.user.enabled=0;
			vm.user.etat_connexion=0;
			vm.user.sigle=null;
			vm.user.envoi_donnees=null;
			vm.user.password=null;
			vm.user.default_password=1;
			vm.user.id_region=null;
			vm.user.id_district=null;
			vm.user.id_commune=null;
			vm.user.id_fokontany=null;
			vm.user.id_intervention=null;
			vm.user.piece_identite= null;
			vm.user.adresse= null;               
			vm.user.fonction=null;                 
			vm.user.telephone= null;                 
			vm.user.raison_sociale= null;                 
			vm.user.adresse_hote= null;             
			vm.user.nom_responsable= null;                 
			vm.user.fonction_responsable= null;
			vm.user.email_hote= null;
			vm.user.telephone_hote= null;
			vm.user.description_hote= null;
			vm.user.user=true;
			vm.user.ddb=false;
			vm.user.admin=false;
			vm.user.ajout=false;
			vm.user.modif=false;
			vm.user.suppr=false;
			vm.user.imp=false;
			vm.user.vld=false;
			vm.NouvelItem = true ;			

			vm.tab_selected = [];
        };
		// Modification d'un utilisateur
		vm.modifier = function()   {
			retourne_false();
			vm.NouvelItem = false ;	
			vm.titre="Modification utilisateur";
			vm.affichageMasque = 1 ;
			vm.afficherboutonnouveau =0;
			vm.afficherboutonModifSupr =0;
			vm.afficherliste =0;
			vm.user.id = vm.selectedItem.id ;
			vm.user.nom = vm.selectedItem.nom ;
			vm.user.prenom = vm.selectedItem.prenom ;
			vm.user.email = vm.selectedItem.email ;
			vm.user.enabled = vm.selectedItem.enabled ;
			vm.user.etat_connexion = vm.selectedItem.etat_connexion ;
			vm.user.sigle = vm.selectedItem.sigle ;
			vm.user.password = vm.selectedItem.password ;
			vm.user.default_password = parseInt(vm.selectedItem.default_password) ;
			vm.user.envoi_donnees = parseInt(vm.selectedItem.envoi_donnees) ;      
			vm.searchText="";
			vm.searchTextPers=""; 
			if(vm.selectedItem.id_region) {
				vm.user.id_region=parseInt(vm.selectedItem.id_region);
			} else vm.user.id_region=null;
			if(vm.selectedItem.id_district) {
				if(vm.selectedItem.id_region) {
					apiFactory.getAPIgeneraliserREST("district/index","cle_etrangere",vm.selectedItem.id_region).then(function(result) { 
						vm.all_district = result.data.response;   
					});					
				}
				vm.user.id_district=parseInt(vm.selectedItem.id_district);
			} else vm.user.id_district=null;
			if(vm.selectedItem.id_commune) {
				if(vm.selectedItem.id_district) {
					apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.selectedItem.id_district).then(function(result) { 
						vm.all_commune = result.data.response; 
					});
				}	
				vm.user.id_commune=parseInt(vm.selectedItem.id_commune);
			} else vm.user.id_commune=null;
			if(vm.selectedItem.id_fokontany) {
				if(vm.selectedItem.id_commune) {
					apiFactory.getAPIgeneraliserREST("fokontany/index","cle_etrangere",vm.selectedItem.id_commune).then(function(result) { 
						vm.all_fokontany = result.data.response; 
					});
				}	
				vm.user.id_fokontany=parseInt(vm.selectedItem.id_fokontany);
			} else vm.user.id_fokontany=null;
			if(vm.selectedItem.id_intervention) {
				vm.user.id_intervention=parseInt(vm.selectedItem.id_intervention);
			} else vm.user.id_intervention=null;
			vm.user.piece_identite= vm.selectedItem.piece_identite;
			vm.user.adresse= vm.selectedItem.adresse;               
			vm.user.fonction= vm.selectedItem.fonction;                 
			vm.user.telephone= vm.selectedItem.telephone;                 
			vm.user.raison_sociale= vm.selectedItem.raison_sociale;                 
			vm.user.adresse_hote= vm.selectedItem.adresse_hote;             
			vm.user.nom_responsable= vm.selectedItem.nom_responsable;                 
			vm.user.fonction_responsable= vm.selectedItem.fonction_responsable;
			vm.user.email_hote= vm.selectedItem.email_hote;
			vm.user.telephone_hote= vm.selectedItem.telephone_hote;
			vm.user.description_hote= vm.selectedItem.description_hote;

			vm.tab_selected = vm.selectedItem.groupes ;
			angular.forEach(vm.selectedItem.roles, function(value, key)  {           
				switch(value)   {

					case 'SPR_ADM':  {
                      vm.acces.spr_adm = true ;
                      break ;
					}
					case 'USER':  {
                      vm.acces.user = true ;
                      break ;
					}
					case 'GES_USER':  {
			          vm.acces.ges_user = true ;
			          break ;
					}
					case 'GRP_USER':  {
			          vm.acces.grp_user = true ;
			          break ;
					}
					case 'HIS_USER' :  {
			          vm.acces.his_user = true ;
			          break;
					}
					case 'VAR_IND': {
			          vm.acces.var_ind = true ;
			          break;
					}
					case 'ACT_TYP': {
			          vm.acces.act_typ = true ;
			          break;
					}
					case 'PROG':  {
			          vm.acces.prog = true ;
			          break;
					}
					case 'DEC_ADM':  {
			          vm.acces.dec_adm = true ;
			          break;
					}
					case 'NOM_INT':  {
			          vm.acces.nom_int = true ;
			          break;
					}
					case 'VAR_INT':  {
			          vm.acces.var_int = true ;
			          break;
					}
					case 'ANR_INT':  {
			          vm.acces.anr_int = true ;
			          break;
					}
					case 'SUI_DEC':  {
			          vm.acces.sui_dec = true ;
			          break;
					}
					case 'SIM_BEN':  {
			          vm.acces.sim_ben = true ;
			          break;
					}
					case 'SIM_INT':  {
			          vm.acces.sim_int = true ;
			          break;
					}
					case 'IMP_BEN':  {
			          vm.acces.imp_ben = true ;
			          break;
					}
					case 'IMP_INT':  {
			          vm.acces.imp_int = true ;
			          break;
					}
					case 'RPT':  {
			          vm.acces.rpt = true ;
			          break;
					}
					case 'REG_BEN':  {
			          vm.acces.reg_ben = true ;
			          break;
					}
					case 'CR_CHANGE':  {
			          vm.acces.cr_change = true ;
			          break;
					}
					default:  {
			          break ;
					}
				}  

				
			});
		}
		// Suppression d'un utilisateur
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
		}
		// Enregistrement dans la BDD
		vm.ajout = function(user,suppression)  
		{
		
			vm.affiche_load = true ;
			if (suppression == 0) 
			{ 
				var config = {
					headers : {
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
					}
				};
				var getId = 0;
				var etat_connexion = 0 ;
				if (vm.NouvelItem==false) 
				{
				   getId = vm.selectedItem.id; 

				   etat_connexion = user.etat_connexion ;
				} 
				if (!vm.infoAssuj) 
				{
					vm.infoAssuj = {};
					vm.infoAssuj.id = "";
				};
				if (!vm.pers) 
				{
					vm.pers = {};
					vm.pers.id = "";
				};
				var datas = $.param({ 
					id:getId,		
					gestion_utilisateur:1,
					supprimer:suppression,
					nom: user.nom,
					prenom: user.prenom,                           
					sigle: user.sigle,                           
					email: user.email ,
					enabled: user.enabled ,
					envoi_donnees: user.envoi_donnees ,
					password: user.password ,
					default_password: user.default_password ,
					roles: vm.tab_selected,                 
					id_region: user.id_region,                 
					id_district: user.id_district,                 
					id_commune: user.id_commune,                 
					id_fokontany: user.id_fokontany,                 
					id_intervention: user.id_intervention,                 
					piece_identite: user.piece_identite,                 
					adresse: user.adresse,                 
					fonction: user.fonction,                 
					telephone: user.telephone,                 
					raison_sociale: user.raison_sociale,                 
					adresse_hote: user.adresse_hote,                 
					nom_responsable: user.nom_responsable,                 
					fonction_responsable: user.fonction_responsable,                 
					email_hote: user.email_hote,                 
					telephone_hote: user.telephone_hote,                 
					description_hote: user.description_hote,                 
					etat_connexion: etat_connexion                
				});
				apiFactory.add("utilisateurs/index",datas, config).success(function (data) 
				{

					vm.affiche_load = false ;
					if (getId==0) { 
						// Nouvel utilisateur	
						// Et envoi e-mail pour signaler que le compte utilisateur a été ouvert
					   var items = {
							id:String(data.response),
							nom:user.nom,
							prenom:user.prenom,
							email:user.email,
							sigle:user.sigle,
							//enabled:user.enabled,
							enabled:0,
							etat_connexion:etat_connexion,
							envoi_donnees:user.envoi_donnees,
							password:user.password,
							default_password:user.default_password,
							id_region: user.id_region,                 
							id_district: user.id_district,                 
							id_commune: user.id_commune,                 
							id_fokontany: user.id_fokontany,                 
							id_intervention: user.id_intervention,                 
							piece_identite: user.piece_identite,                 
							adresse: user.adresse,                 
							fonction: user.fonction,                 
							telephone: user.telephone,                 
							raison_sociale: user.raison_sociale,                 
							adresse_hote: user.adresse_hote,                 
							nom_responsable: user.nom_responsable,                 
							fonction_responsable: user.fonction_responsable,                 
							email_hote: user.email_hote,                 
							telephone_hote: user.telephone_hote,                 
							description_hote: user.description_hote, 
							roles: vm.tab_selected,
						};
						vm.listes_utilisateurs.push(items); 
						vm.action="Ajout compte utilisateur ("+ user.raison_sociale + ") au nom de : " + user.prenom + " " + user.nom + "("+ user.email + ")";
						if(data.message=="OK") {
							var msg ="Un e-mail a été envoyé a l'adresse : " + user.email + " . Et en copie le responsable : " + user.email_hote;
							vm.showAlert("INFORMATION",msg);
						} else {
							vm.showAlert("ERREUR","Une erreur s'est produite lors de l'envoi d'e-mail du titulaire de compte. Veuillez vérifier à nouveau s'il vous plait");
						}
					} else {
						// Mise à jour d'un utlisateur
						vm.selectedItem.roles = vm.tab_selected ;
						vm.selectedItem.nom = user.nom;
						vm.selectedItem.email = user.email;
						vm.selectedItem.prenom = user.prenom;
						vm.selectedItem.sigle = user.sigle;
						vm.selectedItem.enabled = user.enabled;
						vm.selectedItem.etat_connexion = user.etat_connexion;
						vm.selectedItem.envoi_donnees = user.envoi_donnees;
						vm.selectedItem.password = user.password;
						vm.selectedItem.default_password = user.default_password;
						vm.selectedItem.id_region= user.id_region;                
						vm.selectedItem.id_district= user.id_district;                
						vm.selectedItem.id_commune= user.id_commune;                 
						vm.selectedItem.id_fokontany= user.id_fokontany;                 
						vm.selectedItem.id_intervention= user.id_intervention;                 
						vm.selectedItem.piece_identite= user.piece_identite;                 
						vm.selectedItem.adresse= user.adresse;               
						vm.selectedItem.fonction= user.fonction;               
						vm.selectedItem.telephone= user.telephone;       
						vm.selectedItem.raison_sociale= user.raison_sociale;
						vm.selectedItem.adresse_hote= user.adresse_hote;           
						vm.selectedItem.nom_responsable= user.nom_responsable;       
						vm.selectedItem.fonction_responsable= user.fonction_responsable;
						vm.selectedItem.email_hote= user.email_hote         
						vm.selectedItem.telephone_hote= user.telephone_hote;             
						vm.selectedItem.description_hote= user.description_hote;
						vm.user = {} ;
						vm.selectedItem.$selected=false;
						vm.action="Modification compte utilisateur ("+ user.raison_sociale + ") au nom de : " + user.prenom + " " + user.nom + "("+ user.email + ")";
					}	
					//add historique : suppresion/modifcation/ajout Gestion utilisateur
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
					});
			} 
			else 
			{  //delete
				var config = {
					headers : {
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
					}
				};
				var datas = $.param({ 
					gestion_utilisateur:1,
					supprimer:suppression,
					id:vm.selectedItem.id
				});
				apiFactory.add("utilisateurs/index",datas, config).success(function (data) 
				{
					vm.affiche_load = false ;
					vm.listes_utilisateurs = vm.listes_utilisateurs.filter(function(obj) 
					{            
						return obj.id !== vm.selectedItem.id;
					});
				}).error(function (data) {
	              
				});
			}
			vm.afficherboutonnouveau = 1 ;
			vm.affichageMasque = 0 ;
			vm.afficherliste =1;
			vm.NouvelItem=false;
		}
		// Message box : alert, information
        vm.showAlert = function(titre,textcontent) {
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

(function ()
{
    'use strict';
    angular
        .module('app.pfss.enquete.individus')
        .controller('IndividusController', IndividusController);

    /** @ngInject */
    function IndividusController(apiFactory, $state, $mdDialog, $scope) 
    {
		var vm = this;
		vm.Enregistrer_suivi_menage	=Enregistrer_suivi_menage;	
		vm.Enregistrer_suivi_individu	=Enregistrer_suivi_individu;	
		var NouvelItemSuiviMenage=false; 
		var NouvelItemSuiviIndividu=false; 
		var currentItemSuiviMenage={};
		var currentItemSuiviIndividu={};
		vm.allRecordsSourcefinancement = [];
		vm.allRecordsTypedetransfert = [];
		vm.allRecordsAgencepaiement = [];
		vm.tab_beneficiaire = [] ;
		vm.all_menage_programme=[];
		vm.all_individu_programme=[];
		vm.allDetailSuiviMenage = [] ;
		vm.allDetailSuiviIndividu = [] ;
        vm.selectedItemMenage = {} ;
        vm.selectedItemIndividu = {} ;
        vm.selectedItemDetailSuiviMenage = {} ;
        vm.selectedItemDetailSuiviIndividu = {} ;
        vm.affichageMasque = 0 ;
        vm.affichageMasqueIndividu = 0 ;
		vm.afficherboutonModifSupr = 0 ;
		vm.afficherboutonModifSuprIndividu = 0 ;
		vm.afficherboutonnouveau = 1 ;
		vm.afficherboutonnouveauIndividu = 1 ;
		vm.suivimenage={};
		vm.suiviindividu={};
		vm.affichesuiviindividupardefaut =1;
		vm.affichesuiviindividunutrition =0;
		vm.menage_column = [{titre:"Numero d'enregistrement"},{titre:"Chef Ménage"},{titre:"Personne inscrire"},{titre:"Age"},{titre:"Addresse"}];
		vm.individu_column = [{titre:"N° d'enregistrement"},{titre:"Chef Ménage"},{titre:"Nom"},{titre:"Date Naissance"},{titre:"Addresse"}];
		vm.suivi_menage_column = [{titre:"Nom"},{titre:"Partenaire"},{titre:"Acteur"},{titre:"Type-Transf"},{titre:"Date"},{titre:"Montant"}];
		vm.suivi_nutrition_menage_column = [{titre:"Nom"},{titre:"Poids"},{titre:"Périm-Bra"},{titre:"Age:mois"},{titre:"Taille"},{titre:"Z-score"},{titre:"Mois-grossesse"}];
		vm.dtOptions =
		{
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple',
			autoWidth: false,
			responsive: true
		};
	     //DDB , CLE ETRANGERE
        apiFactory.getAll("ile/index").then(function(result)
        { 
          vm.all_ile = result.data.response;    
          
        });
		apiFactory.getAll("programme/index").then(function(result)
		{ 
        vm.all_programme = result.data.response;           
		});
		apiFactory.getAll("source_financement/index").then(function(result){
			vm.allRecordsSourcefinancement = result.data.response;
		});  
		apiFactory.getAll("type_transfert/index").then(function(result){
			vm.allRecordsTypedetransfert = result.data.response;
		});    
		apiFactory.getAll("Agence_p/index").then(function(result){
			vm.allRecordsAgencepaiement = result.data.response;
		});    
		//FIN DDB , CLE ETRANGERE	
		vm.filtre_region = function() {
			apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",vm.filtre.id_ile).then(function(result) { 
				vm.all_region = result.data.response;
			});
		}
		vm.filtre_commune = function() {
			apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtre.id_region).then(function(result) { 
				vm.all_commune = result.data.response;              
			});
		}
		vm.filtre_village = function() {
			apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",vm.filtre.id_commune).then(function(result) { 
				vm.all_village = result.data.response;              
			});
		}
		vm.filtrer = function() {
			apiFactory.getAPIgeneraliserREST("menage_programme/index","id_programme",vm.id_programme,"id_village",vm.filtre.id_village).then(function(result) { 
				if(result.data.response.length >0) {
					vm.all_menage_programme = result.data.response;   
				} else {
					vm.all_menage_programme = []; 
					vm.showAlert("INFORMATION","Aucun enregistrement trouvé !")	
				}			
			});
		}
		vm.filtrer_Individu = function() {
			apiFactory.getAPIgeneraliserREST("individu_programme/index","id_programme",vm.id_programme,"id_village",vm.filtre.id_village).then(function(result) { 
				if(result.data.response.length >0) {
					vm.all_individu_programme = result.data.response;   
				} else {
					vm.all_individu_programme = []; 
					vm.showAlert("INFORMATION","Aucun enregistrement trouvé !")	
				}			
				if(parseInt(vm.id_programme)==3) {
					// Nutrition
					vm.affichesuiviindividupardefaut =0;
					vm.affichesuiviindividunutrition =1;				
				} else {
					vm.affichesuiviindividupardefaut =1;
					vm.affichesuiviindividunutrition =0;				
				}
				var zz = " par défaut= " + vm.affichesuiviindividupardefaut + "   nutrition= " +vm.affichesuiviindividunutrition;
			});
		}
        function formatDate(date) {
            if (date) {
                var mois = date.getMonth()+1;
                var dateSQL = (date.getFullYear()+"/"+mois+"/"+date.getDate());
                return dateSQL;
            };
        }
		// DEBUT FONCTION CONCERNANT MENAGE
		vm.selection= function (item) {
			vm.selectedItemMenage = item;
			if(parseInt(vm.selectedItemMenage.detail_charge)==0) {
				apiFactory.getAPIgeneraliserREST("suivi_menage/index","id_programme",vm.id_programme,"id_menage",vm.selectedItemMenage.id_menage).then(function(result)
				{ 
					if(result.data.response.length >0) {
						item.detail_suivi_menage = result.data.response; 
						vm.selectedItemMenage.detail_suivi_menage = result.data.response; 	
					} else {
						item.detail_suivi_menage = []; 
						vm.selectedItemMenage.detail_suivi_menage = [];
						vm.showAlert("INFORMATION","Aucun détail d'enregistrement trouvé !")	
					}			
					item.detail_charge=1;
				});
			}	
		}
		$scope.$watch('vm.selectedItemMenage', function() {
			if (!vm.all_menage_programme) return;
			vm.all_menage_programme.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemMenage.$selected = true;
		});
		// FIN FONCTION CONCERNANT MENAGE
		// DEBUT SUIVI MENAGE
		vm.selectionDetailSuiviMenage= function (item) {
			vm.selectedItemDetailSuiviMenage = item;
            currentItemSuiviMenage = angular.copy(vm.selectedItemDetailSuiviMenage);       
            vm.afficherboutonModifSupr = 1 ;
            vm.affichageMasque = 0 ;
            vm.afficherboutonnouveau = 1 ;
		}
		$scope.$watch('vm.selectedItemDetailSuiviMenage', function() {
			if (!vm.selectedItemMenage.detail_suivi_menage) return;
			vm.selectedItemMenage.detail_suivi_menage.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemDetailSuiviMenage.$selected = true;
		});
        vm.ajouterSuiviMenage = function () {
			vm.affichageMasque = 1 ;
			NouvelItemSuiviMenage = true ;
			vm.suivimenage.id=0;
			vm.suivimenage.id_menage=vm.selectedItemMenage.id_menage;
			vm.suivimenage.date_suivi=null;
			vm.suivimenage.montant=null;
		}      
        vm.annulerSuiviMenage = function() {
			vm.selectedItemDetailSuiviMenage = {} ;
			vm.selectedItemDetailSuiviMenage.$selected = false;
			vm.affichageMasque = 0 ;
			vm.afficherboutonnouveau = 1 ;
			vm.afficherboutonModifSupr = 0 ;
			NouvelItemSuiviMenage = false;
        };
		vm.modifierSuiviMenage = function() {
			NouvelItemSuiviMenage = false ;
			vm.suivimenage.id=vm.selectedItemDetailSuiviMenage.id;
			vm.suivimenage.id_menage=vm.selectedItemMenage.id_menage;
			if(vm.selectedItemDetailSuiviMenage.date_suivi) {
				vm.suivimenage.date_suivi=new Date(vm.selectedItemDetailSuiviMenage.date_suivi);
			}
			if(vm.selectedItemDetailSuiviMenage.montant) {
				vm.suivimenage.montant=parseFloat(vm.selectedItemDetailSuiviMenage.montant);
			}
			vm.suivimenage.id_partenaire=parseInt(vm.selectedItemDetailSuiviMenage.id_partenaire);
			vm.suivimenage.id_acteur=parseInt(vm.selectedItemDetailSuiviMenage.id_acteur);
			vm.suivimenage.id_type_transfert=parseInt(vm.selectedItemDetailSuiviMenage.id_type_transfert);
			vm.affichageMasque = 1 ;
			vm.afficherboutonModifSupr = 0;
			vm.afficherboutonnouveau = 0;  
        };
		vm.supprimerSuiviMenage = function() {
			NouvelItemSuiviMenage = false ;
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
				Enregistrer_suivi_menage(vm.selectedItemDetailSuiviMenage,1);
			}, function() {
            //alert('rien');
			});
        };	  
        function Enregistrer_suivi_menage(suivimenage,suppression) {
            //add
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            var getId = 0;
            if (NouvelItemSuiviMenage==false) {
               getId = vm.selectedItemDetailSuiviMenage.id; 
            } 
            var datas = $.param({
                    id:getId,
                    supprimer:suppression,
                    id_menage: vm.selectedItemMenage.id_menage,
                    id_programme: vm.selectedItemMenage.id_programme,
                    id_partenaire: suivimenage.id_partenaire,
                    id_acteur: suivimenage.id_acteur,
                    id_type_transfert: suivimenage.id_type_transfert,
                    date_suivi: formatDate(suivimenage.date_suivi),
                    montant: suivimenage.montant,
            });  
            //factory
            apiFactory.add("suivi_menage/index",datas, config).success(function (data) {
				if (NouvelItemSuiviMenage == false) {                 
                   // Update or delete: id exclu                    
                    if(suppression==0) { 
						vm.selectedItemDetailSuiviMenage.id_partenaire=suivimenage.id_partenaire;
						vm.selectedItemDetailSuiviMenage.partenaire=suivimenage.partenaire;
						vm.selectedItemDetailSuiviMenage.id_acteur=suivimenage.id_acteur;                 
						vm.selectedItemDetailSuiviMenage.acteur=suivimenage.acteur;                 
						vm.selectedItemDetailSuiviMenage.id_type_transfert=suivimenage.id_type_transfert;                 
						vm.selectedItemDetailSuiviMenage.typetransfert=suivimenage.typetransfert;                 
						vm.selectedItemDetailSuiviMenage.date_suivi=suivimenage.date_suivi; 
						vm.selectedItemDetailSuiviMenage.montant=suivimenage.montant;
						vm.afficherboutonModifSupr = 0 ;
						vm.afficherboutonnouveau = 1 ;
						vm.selectedItemDetailSuiviMenage.$selected = false;
						vm.selectedItemDetailSuiviMenage ={};
                    } else {                      
						vm.allsuivimenage = vm.allsuivimenage.filter(function(obj) {
							return obj.id !== currentItem.id;
						});
                    }
				} else {                               
                    var item = {
						id_menage: vm.selectedItemMenage.id_menage,
						nomchefmenage: vm.selectedItemMenage.nomchefmenage,
						id_programme: vm.selectedItemMenage.id_programme,
						id_partenaire: suivimenage.id_partenaire,
						partenaire: suivimenage.partenaire,
						id_acteur:suivimenage.id_acteur,
						acteur:suivimenage.acteur,
						id_type_transfert: suivimenage.id_type_transfert,
						typetransfert: suivimenage.typetransfert,
						date_suivi: (suivimenage.date_suivi),
						montant: suivimenage.montant,
						id:String(data.response) ,
					};
					vm.selectedItemMenage.detail_suivi_menage.push(item); 
                    NouvelItemSuiviMenage=false;
				}
                  vm.affichageMasque = 0 ;
			})
        }
		// FIN SUIVI MENAGE
		// DEBUT FONCTION CONCERNANT INDIVIDU
		vm.selectionIndividu= function (item) {
			vm.selectedItemIndividu = item;
			if(parseInt(vm.selectedItemIndividu.detail_charge)==0) {
				apiFactory.getAPIgeneraliserREST("suivi_individu/index","id_programme",vm.id_programme,"id_individu",vm.selectedItemIndividu.id_individu).then(function(result)
				{ 
					if(result.data.response.length >0) {
						item.detail_suivi_individu = result.data.response; 
						vm.selectedItemIndividu.detail_suivi_individu = result.data.response; 	
					} else {
						item.detail_suivi_individu = []; 
						vm.selectedItemIndividu.detail_suivi_individu = [];
						vm.showAlert("INFORMATION","Aucun détail d'enregistrement trouvé !")	
					}			
					item.detail_charge=1;
				});
			}	
		}
		$scope.$watch('vm.selectedItemIndividu', function() {
			if (!vm.all_individu_programme) return;
			vm.all_individu_programme.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemIndividu.$selected = true;
		});
		// FIN FONCTION CONCERNANT INDIVIDU
		// DEBUT SUIVI INDIVIDU
		vm.selectionDetailSuiviIndividu= function (item) {
			vm.selectedItemDetailSuiviIndividu = item;
            currentItemSuiviIndividu = angular.copy(vm.selectedItemDetailSuiviIndividu);       
            vm.afficherboutonModifSuprIndividu = 1 ;
            vm.affichageMasqueIndividu = 0 ;
            vm.afficherboutonnouveauIndividu = 1 ;
		}
		$scope.$watch('vm.selectedItemDetailSuiviIndividu', function() {
			if (!vm.selectedItemIndividu.detail_suivi_individu) return;
			vm.selectedItemIndividu.detail_suivi_individu.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemDetailSuiviIndividu.$selected = true;
		});
        vm.ajouterSuiviIndividu = function () {
			vm.affichageMasqueIndividu = 1 ;
			if(parseInt(vm.id_programme)==3) {
				// Nutrition
				vm.affichesuiviindividupardefaut =0;
				vm.affichesuiviindividunutrition =1;				
			} else {
				vm.affichesuiviindividupardefaut =1;
				vm.affichesuiviindividunutrition =0;				
			}
			NouvelItemSuiviIndividu = true ;
			vm.suiviindividu.id=0;
			vm.suiviindividu.id_individu=vm.selectedItemIndividu.id_individu;
			vm.suiviindividu.id_acteur=null;
			vm.suiviindividu.id_partenaire=null;
			vm.suiviindividu.id_type_transfert=null;
			vm.suiviindividu.date_suivi=null;
			vm.suiviindividu.montant=null;
			vm.suiviindividu.poids=null;
			vm.suiviindividu.taille=null;
			vm.suiviindividu.perimetre_bracial=null;
			vm.suiviindividu.age_mois=null;
			vm.suiviindividu.zscore=null;
			vm.suiviindividu.mois_grossesse=null;
		}      
        vm.annulerSuiviIndividu = function() {
			vm.selectedItemDetailSuiviIndividu = {} ;
			vm.selectedItemDetailSuiviIndividu.$selected = false;
			vm.affichageMasqueIndividu = 0 ;
			vm.afficherboutonnouveauIndividu = 1 ;
			vm.afficherboutonModifSuprIndividu = 0 ;
			NouvelItemSuiviIndividu = false;
        };
		vm.modifierSuiviIndividu = function() {
			if(parseInt(vm.id_programme)==3) {
				// Nutrition
				vm.affichesuiviindividupardefaut =0;
				vm.affichesuiviindividunutrition =1;				
			} else {
				vm.affichesuiviindividupardefaut =1;
				vm.affichesuiviindividunutrition =0;				
			}
			NouvelItemSuiviIndividu = false ;
			vm.suiviindividu.id=vm.selectedItemDetailSuiviIndividu.id;
			vm.suiviindividu.id_individu=vm.selectedItemIndividu.id_individu;
			if(vm.selectedItemDetailSuiviIndividu.date_suivi) {
				vm.suiviindividu.date_suivi=new Date(vm.selectedItemDetailSuiviIndividu.date_suivi);
			}
			if(vm.selectedItemDetailSuiviIndividu.montant) {
				vm.suiviindividu.montant=parseFloat(vm.selectedItemDetailSuiviIndividu.montant);
			}
			vm.suiviindividu.id_partenaire=parseInt(vm.selectedItemDetailSuiviIndividu.id_partenaire);
			vm.suiviindividu.id_acteur=parseInt(vm.selectedItemDetailSuiviIndividu.id_acteur);
			vm.suiviindividu.id_type_transfert=parseInt(vm.selectedItemDetailSuiviIndividu.id_type_transfert);
			
			vm.suiviindividu.perimetre_bracial=parseFloat(vm.selectedItemDetailSuiviIndividu.perimetre_bracial);
			if(vm.selectedItemDetailSuiviIndividu.taille) {
				vm.suiviindividu.taille=parseInt(vm.selectedItemDetailSuiviIndividu.taille);
			}	
			if(vm.selectedItemDetailSuiviIndividu.poids) {
				vm.suiviindividu.poids=parseFloat(vm.selectedItemDetailSuiviIndividu.poids);
			}	
			if(vm.selectedItemDetailSuiviIndividu.zscore) {
				vm.suiviindividu.zscore=parseFloat(vm.selectedItemDetailSuiviIndividu.zscore);
			}	
			if(vm.selectedItemDetailSuiviIndividu.age_mois) {
				vm.suiviindividu.age_mois=parseInt(vm.selectedItemDetailSuiviIndividu.age_mois);
			}	
			if(vm.selectedItemDetailSuiviIndividu.mois_grossesse) {
				vm.suiviindividu.mois_grossesse=parseInt(vm.selectedItemDetailSuiviIndividu.mois_grossesse);
			}	
			vm.affichageMasqueIndividu = 1 ;
			vm.afficherboutonModifSuprIndividu = 0;
			vm.afficherboutonnouveauIndividu = 0;  
        };
		vm.supprimerSuiviIndividu = function() {
			NouvelItemSuiviIndividu = false ;
			vm.affichageMasqueIndividu = 0 ;
			vm.afficherboutonModifSuprIndividu = 0 ;
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('ok')
                .cancel('annuler');

			$mdDialog.show(confirm).then(function() {           
				Enregistrer_suivi_individu(vm.selectedItemDetailSuiviIndividu,1);
			}, function() {
            //alert('rien');
			});
        };	  
        function Enregistrer_suivi_individu(suiviindividu,suppression) {
            //add
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            var getId = 0;
            if (NouvelItemSuiviIndividu==false) {
               getId = vm.selectedItemDetailSuiviIndividu.id; 
            } 
            var datas = $.param({
                    id:getId,
                    supprimer:suppression,
                    id_individu: vm.selectedItemIndividu.id_individu,
                    id_programme: vm.selectedItemIndividu.id_programme,
                    id_partenaire: suiviindividu.id_partenaire,
                    id_acteur: suiviindividu.id_acteur,
                    id_type_transfert: suiviindividu.id_type_transfert,
                    date_suivi: formatDate(suiviindividu.date_suivi),
                    montant: suiviindividu.montant,
                    poids: suiviindividu.poids,
                    perimetre_bracial: suiviindividu.perimetre_bracial,
                    age_mois: suiviindividu.age_mois,
                    taille: suiviindividu.taille,
                    zscore: suiviindividu.zscore,
                    mois_grossesse: suiviindividu.mois_grossesse,
            });  
            //factory
            apiFactory.add("suivi_individu/index",datas, config).success(function (data) {
				if (NouvelItemSuiviIndividu == false) {                 
                   // Update or delete: id exclu                    
                    if(suppression==0) { 
						vm.selectedItemDetailSuiviIndividu.id_partenaire=suiviindividu.id_partenaire;
						vm.selectedItemDetailSuiviIndividu.partenaire=suiviindividu.partenaire;
						vm.selectedItemDetailSuiviIndividu.id_acteur=suiviindividu.id_acteur;                 
						vm.selectedItemDetailSuiviIndividu.acteur=suiviindividu.acteur;                 
						vm.selectedItemDetailSuiviIndividu.id_type_transfert=suiviindividu.id_type_transfert;                 
						vm.selectedItemDetailSuiviIndividu.typetransfert=suiviindividu.typetransfert;                 
						vm.selectedItemDetailSuiviIndividu.date_suivi=suiviindividu.date_suivi; 
						vm.selectedItemDetailSuiviIndividu.montant=suiviindividu.montant;
						vm.selectedItemDetailSuiviIndividu.poids=suiviindividu.poids;
						vm.selectedItemDetailSuiviIndividu.perimetre_bracial=suiviindividu.perimetre_bracial;
						vm.selectedItemDetailSuiviIndividu.age_mois=suiviindividu.age_mois;
						vm.selectedItemDetailSuiviIndividu.taille=suiviindividu.taille;
						vm.selectedItemDetailSuiviIndividu.zscore=suiviindividu.zscore;
						vm.selectedItemDetailSuiviIndividu.mois_grossesse=suiviindividu.mois_grossesse;
						vm.afficherboutonModifSuprIndividu = 0 ;
						vm.afficherboutonnouveauIndividu = 1 ;
						vm.selectedItemDetailSuiviIndividu.$selected = false;
						vm.selectedItemDetailSuiviIndividu ={};
                    } else {                      
						vm.allsuivimenage = vm.allsuivimenage.filter(function(obj) {
							return obj.id !== currentItem.id;
						});
                    }
				} else {                               
                    var item = {
						id_individu: vm.selectedItemIndividu.id_individu,
						nomchefmenage: vm.selectedItemIndividu.nomchefmenage,
						Nom: vm.selectedItemIndividu.Nom,
						id_programme: vm.selectedItemIndividu.id_programme,
						id_partenaire: suiviindividu.id_partenaire,
						partenaire: suiviindividu.partenaire,
						id_acteur:suiviindividu.id_acteur,
						acteur:suiviindividu.acteur,
						id_type_transfert: suiviindividu.id_type_transfert,
						typetransfert: suiviindividu.typetransfert,
						date_suivi: (suiviindividu.date_suivi),
						montant: suiviindividu.montant,
						id:String(data.response) ,
						poids: suiviindividu.poids,
						perimetre_bracial: suiviindividu.perimetre_bracial,
						age_mois: suiviindividu.age_mois,
						taille: suiviindividu.taille,
						zscore: suiviindividu.zscore,
						mois_grossesse: suiviindividu.mois_grossesse,
					};
					vm.selectedItemIndividu.detail_suivi_individu.push(item); 
                    NouvelItemSuiviIndividu=false;
				}
                  vm.affichageMasqueIndividu = 0 ;
			})
        }
		// FIN SUIVI INDIVIDU
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
        vm.modifierPartenaireSuiviMenage = function (item) { 
			vm.nontrouvee=true;
			vm.allRecordsSourcefinancement.forEach(function(srcf) {
				if(srcf.id==item.id_partenaire) {
					vm.suivimenage.id_partenaire = srcf.id; 
					vm.suivimenage.partenaire=[];
					var itemss = {
						id: srcf.id,
						nom: srcf.nom,
					};
					vm.suivimenage.partenaire.push(itemss);
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.suivimenage.id_partenaire = ''; 
					vm.suivimenage.partenaire=[];
			}
		}
        vm.modifierTypeTransfertSuiviMenage = function (item) { 
			vm.nontrouvee=true;
			vm.allRecordsTypedetransfert.forEach(function(srcf) {
				if(srcf.id==item.id_type_transfert) {
					vm.suivimenage.id_type_transfert = srcf.id; 
					vm.suivimenage.typetransfert=[];
					var itemss = {
						id: srcf.id,
						description: srcf.description,
					};
					vm.suivimenage.typetransfert.push(itemss);
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.suivimenage.id_type_transfert = ''; 
					vm.suivimenage.typetransfert=[];
			}
		}
        vm.modifierAgencePaiementSuiviMenage = function (item) { 
			vm.nontrouvee=true;
			vm.allRecordsAgencepaiement.forEach(function(srcf) {
				if(srcf.id==item.id_acteur) {
					vm.suivimenage.id_acteur = srcf.id; 
					vm.suivimenage.acteur=[];
					var itemss = {
						id: srcf.id,
						Nom: srcf.Nom,
						Contact: srcf.Contact,
						Code: srcf.Code,
						Representant: srcf.Representant,
					};
					vm.suivimenage.acteur.push(itemss);
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.suivimenage.id_acteur = ''; 
					vm.suivimenage.acteur=[];
			}
		}
        vm.modifierPartenaireSuiviIndividu = function (item) { 
			vm.nontrouvee=true;
			vm.allRecordsSourcefinancement.forEach(function(srcf) {
				if(srcf.id==item.id_partenaire) {
					vm.suiviindividu.id_partenaire = srcf.id; 
					vm.suiviindividu.partenaire=[];
					var itemss = {
						id: srcf.id,
						nom: srcf.nom,
					};
					vm.suiviindividu.partenaire.push(itemss);
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.suiviindividu.id_partenaire = ''; 
					vm.suiviindividu.partenaire=[];
			}
		}
        vm.modifierTypeTransfertSuiviIndividu = function (item) { 
			vm.nontrouvee=true;
			vm.allRecordsTypedetransfert.forEach(function(srcf) {
				if(srcf.id==item.id_type_transfert) {
					vm.suiviindividu.id_type_transfert = srcf.id; 
					vm.suiviindividu.typetransfert=[];
					var itemss = {
						id: srcf.id,
						description: srcf.description,
					};
					vm.suiviindividu.typetransfert.push(itemss);
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.suiviindividu.id_type_transfert = ''; 
					vm.suiviindividu.typetransfert=[];
			}
		}
		vm.modifierAgencePaiementSuiviIndividu = function (item) { 
			vm.nontrouvee=true;
			vm.allRecordsAgencepaiement.forEach(function(srcf) {
				if(srcf.id==item.id_acteur) {
					vm.suiviindividu.id_acteur = srcf.id; 
					vm.suiviindividu.acteur=[];
					var itemss = {
						id: srcf.id,
						Nom: srcf.Nom,
						Contact: srcf.Contact,
						Code: srcf.Code,
						Representant: srcf.Representant,
					};
					vm.suiviindividu.acteur.push(itemss);
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.suiviindividu.id_acteur = ''; 
					vm.suiviindividu.acteur=[];
			}
		}
     }
  })();

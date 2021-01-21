(function ()
{
    'use strict';
    angular
        .module('app.population.traitement.suivi')
        .controller('SuiviController', SuiviController);

    /** @ngInject */
    function SuiviController(apiFactory, $state, $mdDialog, $scope) 
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
		vm.allRecordsSituationMatrimoniale = [];
		vm.allRecordsTypeMariage = [];
		vm.allRecordsTypeViolence = [];
		vm.allRecordsActeur =[];
		vm.tab_beneficiaire = [] ;
		vm.all_menage_intervention=[];
		vm.all_individu_intervention=[];
		vm.allDetailSuiviMenage = [] ;
		vm.allDetailSuiviIndividu = [] ;
		vm.all_intervention=[];
		vm.all_intervention_temp=[];
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
		vm.affichesuiviindividugenre =0;
		vm.affichesuiviindividumariageprecoce =0;
		vm.mariage_precode_ou_promotion_genre ="1";
		vm.selectedItemIndividu.mariage_precoce = [];
		vm.selectedItemIndividu.detail_suivi_individu = [];
		vm.affichesuivimenagepardefaut =1;
		vm.affichesuivimenagenutrition =0;
		vm.selectedItemMenage.detail_suivi_menage =[];
		vm.affiche_load =false;
		vm.menage_column = [{titre:"Nom & prénom"},{titre:"Date naissance"},{titre:"C.I.N"},{titre:"Profession"},{titre:"date_inscription"}];
		vm.individu_column = [{titre:"Nom"},{titre:"Date Naissance"},{titre:"C.I.N"},{titre:"Addresse"}];
		vm.suivi_menage_column = [{titre:"Nom"},{titre:"Date"},{titre:"Type-Transf"},{titre:"Montant"}];
		vm.suivi_individu_transfert_column = [{titre:"Eto"},{titre:"Nom"},{titre:"Date"},{titre:"Type-Transf"},{titre:"Montant"}];
		vm.suivi_nutrition_menage_column = [{titre:"Nom"},{titre:"Poids"},{titre:"Périm-Bra"},{titre:"Age:mois"},{titre:"Taille"},{titre:"Z-score"},{titre:"Mois-grossesse"}];
		vm.suivi_promotion_genre_column = [{titre:"Nom"},{titre:"Sexe"},{titre:"Age"},{titre:"Date/Infr"},{titre:"Infraction"},{titre:"Lieu"},{titre:"T-Violence"}];
		vm.suivi_mariage_precode_column = [{titre:"Nom"},{titre:"Sexe"},{titre:"Age"},{titre:"Date"},{titre:"Type-mariage"},{titre:"Cause"}];
		vm.dtOptions =
		{
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple',
			autoWidth: false,
			responsive: true
		};
	     //DDB , CLE ETRANGERE
        apiFactory.getAll("region/index").then(function(result) { 
          vm.all_region = result.data.response;    
          
        });
		apiFactory.getAll("intervention/index").then(function(result) { 
			vm.all_intervetion = result.data.response; 
console.log(vm.all_intervetion);	
		});
		apiFactory.getAll("source_financement/index").then(function(result){
			vm.allRecordsSourcefinancement = result.data.response;
		});  
		apiFactory.getAll("type_transfert/index").then(function(result){
			vm.allRecordsTypedetransfert = result.data.response;
		});    
		/*apiFactory.getAll("Agence_p/index").then(function(result){
			vm.allRecordsAgencepaiement = result.data.response;
		}); */   
		apiFactory.getTable("enquete_menage/index","situation_matrimoniale").then(function(result){
			vm.allRecordsSituationMatrimoniale = result.data.response;
		});    
		apiFactory.getAll("acteur/index").then(function(result){
			vm.allRecordsActeur = result.data.response;
		});    
		/*apiFactory.getTable("enquete_menage/index","type_mariage").then(function(result){
			vm.allRecordsTypeMariage = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","type_violence").then(function(result){
			vm.allRecordsTypeViolence = result.data.response;
		});*/    
		//FIN DDB , CLE ETRANGERE	
		vm.filtre_region = function() {
			// apiFactory.getAPIgeneraliserREST("district/index","cle_etrangere",vm.filtre.id_region).then(function(result) { 
			apiFactory.getAPIgeneraliserREST("district/index","cle_etrangere",22).then(function(result) { 
				vm.all_district = result.data.response;
			});
		}
		vm.filtre_commune = function() {
			// apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtre.id_district).then(function(result) { 
			apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",111).then(function(result) { 
				vm.all_commune = result.data.response;              
			});
		}
		vm.filtre_fokontany = function() {
			// apiFactory.getAPIgeneraliserREST("fokontany/index","cle_etrangere",vm.filtre.id_commune).then(function(result) { 
			apiFactory.getAPIgeneraliserREST("fokontany/index","cle_etrangere",1505).then(function(result) { 
				vm.all_fokontany = result.data.response;              
			});
		}
		// A SUPPRIMER APRES
		vm.filtre={};
		vm.filtre.id_region=22;
		vm.filtre_region();
		vm.filtre.id_district=111;
		vm.filtre_commune();
		vm.filtre.id_commune=1505;
		vm.filtre_fokontany();
		vm.filtre.id_fokontany=1701;
		// A SUPPRIMER APRES
		vm.filtrer = function() {
			apiFactory.getAPIgeneraliserREST("menage_beneficiaire/index","id_intervention",vm.id_intervention,"id_fokontany",vm.filtre.id_fokontany).then(function(result) { 
				if(result.data.response.length >0) {
					vm.all_menage_intervention = result.data.response;   
				} else {
					vm.all_menage_intervention = []; 
					vm.showAlert("INFORMATION","Aucun enregistrement trouvé !")	
				}			
				// vm.filtrer_DataTable_et_masque_saisie_menage();
				// 5 lignes Dangereux : toujours à réinitialiser sinon bonjour le dégat lors du réaffichage du datatable
				vm.selectedItemMenage.detail_suivi_menage = [];
			});
		}
		vm.filtrer_DataTable_et_masque_saisie_menage = function() {
			if(parseInt(vm.id_intervention)==3) {
				vm.affichesuivimenagepardefaut =0;
				vm.affichesuivimenagenutrition =1;				
			} else if (parseInt(vm.id_intervention)==1) {
				// Transfert monétaire
				vm.affichesuivimenagepardefaut =1;
				vm.affichesuivimenagenutrition =0;				
			}			
		}
		vm.filtrer_DataTable_et_masque_saisie_individu = function() {
			if(parseInt(vm.id_intervention)==3) {
				// Nutrition n'oubliez pas de faire une copie coller vers vm.ajouterSuiviIndividu et vm.modifierSuiviIndividu
				vm.affichesuiviindividupardefaut =0;
				vm.affichesuiviindividunutrition =1;				
				vm.affichesuiviindividugenre =0;	
				vm.affichesuiviindividumariageprecoce=0;
			} else if (parseInt(vm.id_intervention)==1) {
				// Transfert monétaire
				vm.affichesuiviindividupardefaut =1;
				vm.affichesuiviindividunutrition =0;				
				vm.affichesuiviindividugenre =0;	
				vm.affichesuiviindividumariageprecoce=0;
			} else if (parseInt(vm.id_intervention)==5){
				// Promotion du genre et mariage précoce
				if(parseInt(vm.mariage_precode_ou_promotion_genre)==1) { 
					vm.affichesuiviindividupardefaut =2;
					vm.affichesuiviindividunutrition =0;				
					vm.affichesuiviindividugenre =1;
					vm.affichesuiviindividumariageprecoce=0;
				} else {
					vm.affichesuiviindividupardefaut =2;
					vm.affichesuiviindividunutrition =0;				
					vm.affichesuiviindividugenre =0;
					vm.affichesuiviindividumariageprecoce=1;					
				}
			}			
		}
		vm.filtrer_Individu = function() {
			apiFactory.getAPIgeneraliserREST("individu_beneficiaire/index","id_intervention",vm.id_intervention,"id_fokontany",vm.filtre.id_fokontany).then(function(result) { 
				if(result.data.response.length >0) {
					vm.all_individu_intervention = result.data.response;   
				} else {
					vm.all_individu_intervention = []; 
					vm.showAlert("INFORMATION","Aucun enregistrement trouvé !")	
				}	
				// vm.filtrer_DataTable_et_masque_saisie_individu();
				// 5 lignes Dangereux : toujours à réinitialiser sinon bonjour le dégat lors du réaffichage du datatable
				vm.selectedItemIndividu.detail_suivi_individu = [];
			});
		}
		vm.Filtrer_Item_Promotion_Genre_et_Nutrition= function(value) {
			// Rétirer de la liste du intervention la promotion du genre pour le ménage : disponible seulement pour les individus
			if(parseInt(value)==1) {
				vm.all_intervention = vm.all_intervention_temp.filter(function(obj) {
					return (obj.id != 5 );
				});				
			} else {
				vm.all_intervention=vm.all_intervention_temp;
			}
		}
        function formatDate(date) {
            if (date) {
                var mois = date.getMonth()+1;
                var dateSQL = (date.getFullYear()+"/"+mois+"/"+date.getDate());
                return dateSQL;
            };
        }
		vm.ChangerPromotiongenre_Mariageprecoce = function (value) {
			if(parseInt(value)==1) {
				if(vm.selectedItemDetailSuiviIndividu) {
					vm.selectedItemDetailSuiviIndividu.$selected=false;
					vm.selectedItemDetailSuiviIndividu={};
					vm.afficherboutonModifSuprIndividu = 0 ;
				} 
			} else if(parseInt(value)==2){
				if(vm.selectedItemDetailSuiviIndividu) {
					vm.selectedItemDetailSuiviIndividu.$selected=false;
					vm.selectedItemDetailSuiviIndividu={};
					vm.afficherboutonModifSuprIndividu = 0 ;
				}			
			}
		}
		// DEBUT FONCTION CONCERNANT MENAGE
		vm.selection= function (item) {
			vm.selectedItemMenage = item;
			var xx = "vm.selectedItemMenage.id = " + vm.selectedItemMenage.id;
			console.log(xx);
			console.log(item);
			if(parseInt(vm.selectedItemMenage.detail_charge)==0) {
				apiFactory.getAPIgeneraliserREST("suivi_menage/index","id_intervention",vm.id_intervention,"id_menage",vm.selectedItemMenage.id_menage).then(function(result)
				{ 
					item.detail_suivi_menage = []; 
					if(result.data.response.length >0) {
						item.detail_suivi_menage = result.data.response[0].detail_suivi_menage; 
					} else {
						vm.showAlert("INFORMATION","Aucun détail d'enregistrement trouvé !")	
					}			
					item.detail_charge=1;
					// vm.selectedItemmenage.detail_charge=1;
					console.log(item.detail_suivi_menage);
				});
			}	
		}
		$scope.$watch('vm.selectedItemMenage', function() {
			if (!vm.all_menage_intervention) return;
			vm.all_menage_intervention.forEach(function(item) {
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
			// vm.filtrer_DataTable_et_masque_saisie_menage();
			vm.suivimenage.id=0;
			vm.suivimenage.id_menage=vm.selectedItemMenage.id_menage;
			vm.suivimenage.nom=vm.selectedItemMenage.nom;
			vm.suivimenage.prenom=vm.selectedItemMenage.prenom;
			vm.suivimenage.date_suivi=null;
			vm.suivimenage.id_type_transfert=null;
			vm.suivimenage.montant=null;
			vm.suivimenage.observation=null;
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
			vm.suivimenage.observation=vm.selectedItemMenage.observation;
			vm.suivimenage.typetransfert=vm.selectedItemDetailSuiviMenage.typetransfert;
			vm.suivimenage.nom=vm.selectedItemDetailSuiviMenage.nom;
			vm.suivimenage.prenom=vm.selectedItemDetailSuiviMenage.prenom;
			if(vm.selectedItemDetailSuiviMenage.date_suivi) {
				vm.suivimenage.date_suivi=new Date(vm.selectedItemDetailSuiviMenage.date_suivi);
			} else {
				vm.suivimenage.date_suivi=null;
			}
			if(vm.selectedItemDetailSuiviMenage.id_type_transfert) {
				vm.suivimenage.id_type_transfert=parseInt(vm.selectedItemDetailSuiviMenage.id_type_transfert);
			} else {
				vm.suivimenage.id_type_transfert=null;
			}
			if(vm.selectedItemDetailSuiviMenage.montant) {
				vm.suivimenage.montant=parseFloat(vm.selectedItemDetailSuiviMenage.montant);
			} else {
				vm.suivimenage.montant=null;
			}
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
			if(parseInt(suppression)==0) {
				var daty = formatDate(suivimenage.date_suivi);
			} else {
				// ignorer formatDate lors de la suppression
				var daty = suivimenage.date_suivi;
			}
            var getId = 0;
            if (NouvelItemSuiviMenage==false) {
               getId = vm.selectedItemDetailSuiviMenage.id; 
            } 
            var datas = $.param({
                    id:getId,
                    supprimer:suppression,
                    id_menage: suivimenage.id_menage,
                    id_intervention: vm.id_intervention,
                    id_type_transfert: suivimenage.id_type_transfert,
                    date_suivi: daty,
                    montant: suivimenage.montant,
                    observation: suivimenage.observation,
           });  
            //factory
            apiFactory.add("suivi_menage/index",datas, config).success(function (data) {
				if (NouvelItemSuiviMenage == false) {                 
                   // Update or delete: id exclu                    
                    if(suppression==0) { 
						for (var i = 0; i < vm.selectedItemMenage.detail_suivi_menage.length; i++) {
							if(parseInt(vm.selectedItemMenage.detail_suivi_menage[i].id)==parseInt(suivimenage.id)) {
								vm.selectedItemMenage.detail_suivi_menage[i]=vm.suivimenage;
								vm.selectedItemDetailSuiviMenage=vm.suivimenage;
								console.log(vm.suivimenage);
							}          
						}							
						vm.afficherboutonModifSupr = 0 ;
						vm.afficherboutonnouveau = 1 ;
						vm.selectedItemDetailSuiviMenage.$selected = false;
						vm.selectedItemDetailSuiviMenage ={};
                    } else {                      
						vm.selectedItemMenage.detail_suivi_menage = vm.selectedItemMenage.detail_suivi_menage.filter(function(obj) {
							return obj.id !== currentItem.id;
						});
                    }
				} else {                               
                    var item = {
						id_menage: vm.selectedItemMenage.id_menage,
						nom: vm.selectedItemMenage.nom,
						prenom: vm.selectedItemMenage.prenom,
						id_intervention: vm.id_intervention,
						id_type_transfert: suivimenage.id_type_transfert,
						typetransfert: suivimenage.typetransfert,
						date_suivi: (suivimenage.date_suivi),
						montant: suivimenage.montant,
						observation: suivimenage.observation,
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
				apiFactory.getAPIgeneraliserREST("suivi_individu/index","id_intervention",vm.id_intervention,"id_individu",vm.selectedItemIndividu.id_individu).then(function(result)
				{ 
					item.detail_suivi_individu = []; 
					// vm.selectedItemIndividu.detail_suivi_individu = [];
					if(result.data.response.length >0) {
						item.detail_suivi_individu = result.data.response[0].detail_suivi_individu; 
						// vm.selectedItemIndividu.detail_suivi_individu = result.data.response[0].detail_suivi_individu; 	
						console.log(vm.selectedItemIndividu.detail_suivi_individu);
					} else {
						vm.showAlert("INFORMATION","Aucun détail d'enregistrement trouvé !")	
					}			
					item.detail_charge=1;
					vm.selectedItemIndividu.detail_charge=1;
				});
			}	
		}
		$scope.$watch('vm.selectedItemIndividu', function() {
			if (!vm.all_individu_intervention) return;
			vm.all_individu_intervention.forEach(function(item) {
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
			vm.disable_radiobutton_promotiongenre_marriage_precoce=1;
			// vm.filtrer_DataTable_et_masque_saisie_individu();
			NouvelItemSuiviIndividu = true ;

			vm.suiviindividu.nom= vm.selectedItemIndividu.nom; 
			vm.suiviindividu.prenom= vm.selectedItemIndividu.prenom; 
			
			vm.suiviindividu.id=0;
			vm.suiviindividu.id_individu=vm.selectedItemIndividu.id_individu;
			vm.suiviindividu.date_suivi=null;
			vm.suiviindividu.id_type_transfert=null;
			vm.suiviindividu.montant=null;
			vm.suiviindividu.observation=null;
		}      
        vm.annulerSuiviIndividu = function() {
			vm.selectedItemDetailSuiviIndividu = {} ;
			vm.selectedItemDetailSuiviIndividu.$selected = false;
			vm.affichageMasqueIndividu = 0 ;
			vm.afficherboutonnouveauIndividu = 1 ;
			vm.afficherboutonModifSuprIndividu = 0 ;
			NouvelItemSuiviIndividu = false;
			vm.disable_radiobutton_promotiongenre_marriage_precoce=0;
        };
		vm.modifierSuiviIndividu = function() {
			vm.disable_radiobutton_promotiongenre_marriage_precoce=1;
			// vm.filtrer_DataTable_et_masque_saisie_individu();
			NouvelItemSuiviIndividu = false ;
			
			vm.suiviindividu.id=vm.selectedItemDetailSuiviIndividu.id;
			vm.suiviindividu.id_individu=vm.selectedItemIndividu.id_individu;
			vm.suiviindividu.typetransfert=vm.selectedItemDetailSuiviIndividu.typetransfert;
			vm.suiviindividu.nom=vm.selectedItemDetailSuiviIndividu.nom;
			vm.suiviindividu.prenom=vm.selectedItemDetailSuiviIndividu.prenom;
			if(vm.selectedItemDetailSuiviIndividu.date_suivi) {
				vm.suiviindividu.date_suivi=new Date(vm.selectedItemDetailSuiviIndividu.date_suivi);
			} else {
				vm.suiviindividu.date_suivi=null;
			}
			if(vm.selectedItemDetailSuiviIndividu.id_type_transfert) {
				vm.suiviindividu.id_type_transfert=parseInt(vm.selectedItemDetailSuiviIndividu.id_type_transfert);
			} else {
				vm.suiviindividu.id_type_transfert=null;
			}
			if(vm.selectedItemDetailSuiviIndividu.montant) {
				vm.suiviindividu.montant=parseFloat(vm.selectedItemDetailSuiviIndividu.montant);
			} else {
				vm.suiviindividu.montant=null;
			}
			vm.suiviindividu.observation=vm.selectedItemDetailSuiviIndividu.observation;
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
			if(parseInt(suppression)==0) {
				var daty = formatDate(suiviindividu.date_suivi);
			} else {
				// ignorer formatDate lors de la suppression
				var daty = suiviindividu.date_suivi;
			}
            var getId = 0;
            if (NouvelItemSuiviIndividu==false) {
               getId = vm.selectedItemDetailSuiviIndividu.id; 
            } 
            var datas = $.param({
                    id:getId,
                    supprimer:suppression,
                    id_individu: suiviindividu.id_individu,
                    id_intervention: vm.id_intervention,
                    id_type_transfert: suiviindividu.id_type_transfert,
                    date_suivi: daty,
                    montant: suiviindividu.montant,
                    observation: suiviindividu.observation,
            });  
            //factory
            apiFactory.add("suivi_individu/index",datas, config).success(function (data) {
				if (NouvelItemSuiviIndividu == false) {                 
                   // Update or delete: id exclu                    
                    if(suppression==0) { 
						for (var i = 0; i < vm.selectedItemIndividu.detail_suivi_individu.length; i++) {
							if(parseInt(vm.selectedItemIndividu.detail_suivi_individu[i].id)==parseInt(suiviindividu.id)) {
								vm.selectedItemIndividu.detail_suivi_individu[i]=suiviindividu;
								vm.selectedItemDetailSuiviIndividu=suiviindividu;
							}          
						}							
						vm.afficherboutonModifSuprIndividu = 0 ;
						vm.afficherboutonnouveauIndividu = 1 ;
						 vm.selectedItemDetailSuiviIndividu.$selected = false;
						vm.selectedItemDetailSuiviIndividu ={};
                    } else {                      
						vm.selectedItemIndividu.detail_suivi_individu = vm.selectedItemIndividu.detail_suivi_individu.filter(function(obj) {
							return obj.id !== currentItemSuiviIndividu.id;
						});
                    }
				} else {                               
                    var item = {
						id_individu: vm.selectedItemIndividu.id_individu,
						nom: vm.selectedItemIndividu.nom,
						prenom: vm.selectedItemIndividu.prenom,
						id_intervention: vm.id_intervention,
						id_type_transfert: suiviindividu.id_type_transfert,
						typetransfert: suiviindividu.typetransfert,
						date_suivi: (suiviindividu.date_suivi),
						montant: suiviindividu.montant,
						id:String(data.response) ,
						observation: suiviindividu.observation,
					};
					vm.selectedItemIndividu.detail_suivi_individu.push(item); 
                    NouvelItemSuiviIndividu=false;
				}
					vm.affichageMasqueIndividu = 0 ;
					vm.disable_radiobutton_promotiongenre_marriage_precoce=0;
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
        vm.modifierActeurSuiviMenage = function (item) { 
			vm.nontrouvee=true;
			vm.allRecordsActeur.forEach(function(srcf) {
				if(srcf.id==item.id_acteur) {
					vm.suivimenage.id_acteur = srcf.id; 
					vm.suivimenage.acteur=[];
					vm.suivimenage.acteur.push(srcf);
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
		vm.modifierSituationMatrimonialeSuiviIndividu = function (item) { 
			vm.nontrouvee=true;
			vm.allRecordsSituationMatrimoniale.forEach(function(srcf) {
				if(srcf.id==item.id_situation_matrimoniale) {
					vm.suiviindividu.id_situation_matrimoniale = srcf.id; 
					vm.suiviindividu.situation_matrimoniale =[];
					var itemss = {
						id: srcf.id,
						description: srcf.description,
					};
					vm.suiviindividu.situation_matrimoniale .push(itemss);
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.suiviindividu.id_situation_matrimoniale = null; 
					vm.suiviindividu.situation_matrimoniale =[];
			}
		}
		vm.modifierTypeMariageSuiviIndividu = function (item) { 
			vm.nontrouvee=true;
			vm.allRecordsTypeMariage.forEach(function(srcf) {
				if(srcf.id==item.id_type_mariage) {
					vm.suiviindividu.id_type_mariage = srcf.id; 
					vm.suiviindividu.type_mariage =[];
					var itemss = {
						id: srcf.id,
						description: srcf.description,
					};
					vm.suiviindividu.type_mariage .push(itemss);
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.suiviindividu.id_type_mariage = null; 
					vm.suiviindividu.type_mariage =[];
			}
		}
		vm.modifierTypeViolenceSuiviIndividu = function (item) { 
			vm.nontrouvee=true;
			vm.allRecordsTypeViolence.forEach(function(srcf) {
				if(srcf.id==item.id_type_violence) {
					vm.suiviindividu.id_type_violence = srcf.id; 
					vm.suiviindividu.type_violence =[];
					var itemss = {
						id: srcf.id,
						description: srcf.description,
					};
					vm.suiviindividu.type_violence .push(itemss);
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.suiviindividu.id_type_violence = null; 
					vm.suiviindividu.type_violence =[];
			}
		}
     }
  })();

(function ()
{
    'use strict';

    angular
        .module('app.pfss.mereleaderpereleader.visitedomicile')
        .controller('VisitedomicileController', VisitedomicileController);
    /** @ngInject */
    function VisitedomicileController($mdDialog, $scope, apiFactory, $state,$cookieStore)  {
		var vm = this;
	   vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        responsive: true
      };

      vm.visite_domicile_column = [{titre:"N°"},{titre:"Visite 1"},{titre:"Ménage"},{titre:"Objet"},{titre:"Nom ML/PL"},
	  {titre:"Visite 2"},{titre:"Résultat"},{titre:"Récommandation"}];
      //initialisation variable
		vm.currentItem = {};
        vm.affiche_load = false ;
        vm.selectedItem = {} ;
 		
		vm.all_menages =[];
		vm.all_groupe_mlpl =[];
        vm.all_visite_domicile = [] ;
       vm.nouvelle_element = false ;
        vm.affichage_masque = false ;
        vm.date_now = new Date() ;

        vm.disable_button = false ;
      //initialisation variable

      //chargement clé etrangère et données de bases
        vm.id_user_cookies = $cookieStore.get('id');
		apiFactory.getOne("utilisateurs/index",vm.id_user_cookies).then(function(result) { 
			vm.user = result.data.response;
			apiFactory.getAll("region/index").then(function(result) { 
				vm.all_region = result.data.response;    
			});
		});
         apiFactory.getAll("ile/index").then(function(result)
        { 
          vm.all_ile = result.data.response;    
          
        });
		// utilitaire

      	// utilitaire
     vm.filtre_region = function()
      {
        apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",vm.filtre.id_ile).then(function(result)
        { 
          vm.all_region = result.data.response;   
          vm.filtre.id_region = null ; 
          vm.filtre.id_commune = null ; 
          vm.filtre.village_id = null ; 
          
        });

      }
      vm.filtre_commune = function()
      {
        apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtre.id_region).then(function(result)
        { 
          vm.all_commune = result.data.response; 
          vm.filtre.id_commune = null ; 
          vm.filtre.village_id = null ;           
        });
      }
      vm.filtre_village = function()
      {
        apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",vm.filtre.id_commune).then(function(result)
        { 
          vm.all_village = result.data.response;    
          vm.filtre.village_id = null ; 
          
          
        });
      }
      vm.filtre_groupe_mlpl = function()
      {
        apiFactory.getAPIgeneraliserREST("groupe_mlpl/index","cle_etrangere",vm.filtre.village_id).then(function(result)
        { 
          vm.all_groupe_mlpl = result.data.response;    
          vm.filtre.id_groupe_ml_pl = null ; 
          
          
        });
      }
		vm.filtrer = function()	{
			vm.all_visite_domicile = [];
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("menage/index","cle_etrangere",vm.filtre.village_id,"statut","BENEFICIAIRE").then(function(result) { 				
				vm.all_menages = result.data.response;    
				apiFactory.getAPIgeneraliserREST("visite_domicile/index","cle_etrangere",vm.filtre.id_groupe_ml_pl).then(function(result) { 				
					vm.all_visite_domicile = result.data.response;    
					vm.affiche_load = false ;
					console.log(vm.all_visite_domicile);
				});
			});
		}
		// Début Fonction Groupe ML/PL	
		vm.save_visite_domicile = function(groupe_mlpl,suppression) {
			vm.disable_button = true ;
			var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };
			var id_mng = 0 ;
			if (!vm.nouvelle_element) {
				var id_mng = vm.selectedItem.id ;
			}       
			var datas = $.param(
                    {    
                      supprimer:suppression,
                      id: id_mng ,
                      id_groupe_ml_pl: groupe_mlpl.id_groupe_ml_pl,
                      numero: groupe_mlpl.numero,
                      date_visite1: formatDateBDD(groupe_mlpl.date_visite1),
                      menage_id: groupe_mlpl.menage_id,
                      objet_visite: groupe_mlpl.objet_visite,
                      nom_prenom_mlpl: groupe_mlpl.nom_prenom_mlpl,
                      date_visite2: formatDateBDD(groupe_mlpl.date_visite2),
                      resultat_visite: groupe_mlpl.resultat_visite,
                      recommandation: groupe_mlpl.recommandation,
                    });
			apiFactory.add("visite_domicile/index",datas, config).success(function (data) {
				vm.affichage_masque = false ;
				vm.disable_button = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
				if (vm.nouvelle_element) {
					var mng={
						id : data.response ,
						id_groupe_ml_pl: groupe_mlpl.id_groupe_ml_pl,
						numero: groupe_mlpl.numero,
						date_visite1: formatDateListe(groupe_mlpl.date_visite1),
						menage_id: groupe_mlpl.menage_id,
						objet_visite: groupe_mlpl.objet_visite,
						nom_prenom_mlpl: groupe_mlpl.nom_prenom_mlpl,
						date_visite2: formatDateListe(groupe_mlpl.date_visite2),
						resultat_visite: groupe_mlpl.resultat_visite,
						recommandation: groupe_mlpl.recommandation,
						NumeroEnregistrement: groupe_mlpl.NumeroEnregistrement,
						nomchefmenage: groupe_mlpl.nomchefmenage,
					}
					vm.all_visite_domicile.push(mng) ;
				} else {
					if(parseInt(suppression)==0) {
						
					} else {
						vm.affichage_masque_liste_mlpl = false ;
						vm.selectedItem.date_visite1 =  vm.filtre.date_visite1 ;
						vm.selectedItem.id_groupe_ml_pl = vm.filtre.id_groupe_ml_pl  ;
						vm.selectedItem.numero = vm.filtre.numero  ;
						vm.selectedItem.menage_id = vm.filtre.menage_id  ;
						vm.selectedItem.objet_visite = vm.filtre.objet_visite  ;
						vm.selectedItem.nom_prenom_mlpl = vm.filtre.nom_prenom_mlpl  ;
						vm.selectedItem.date_visite2 = vm.filtre.date_visite2  ;
						vm.selectedItem.resultat_visite = vm.filtre.resultat_visite  ;
						vm.selectedItem.recommandation = vm.filtre.recommandation  ;
						vm.selectedItem.NumeroEnregistrement = vm.filtre.NumeroEnregistrement  ;
						vm.selectedItem.nomchefmenage = vm.filtre.nomchefmenage  ;
						vm.selectedItem={};
					}	
  				}      
			}).error(function (data) {
				vm.disable_button = false ;
				console.log('erreur '+data);
				vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
			}); 
		}
		vm.selection= function (item)  {
			if ((!vm.affiche_load)&&(!vm.affichage_masque))  {
				vm.selectedItem = item;
			}       
		}
		$scope.$watch('vm.selectedItem', function() {
			if (!vm.all_visite_domicile) return;
			vm.all_visite_domicile.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
		})
		vm.ajouter_visite_domicile = function() {
			vm.nouvelle_element = true ;
			vm.affichage_masque = true ;
			vm.selectedItem = {} ;
			vm.filtre.date_visite1 = new Date();
			vm.filtre.menage_id = "" ;
			vm.filtre.objet_visite = "" ;
			vm.filtre.nom_prenom_mlpl = "" ;
			vm.filtre.date_visite2 = new Date() ;
			vm.filtre.resultat_visite = "" ;
			vm.filtre.recommandation = "" ;
			vm.filtre.numero = null ;
		}
		vm.modifier = function()  {
			vm.nouvelle_element = false ;
			vm.essai={};
			vm.filtre.date_visite1 = new Date(vm.selectedItem.date_visite1);
			vm.filtre.id_groupe_ml_pl = vm.selectedItem.id_groupe_ml_pl ;
			vm.filtre.numero = vm.selectedItem.numero ;
			vm.filtre.menage_id = vm.selectedItem.menage_id ;
			vm.filtre.objet_visite = vm.selectedItem.objet_visite ;
			vm.filtre.nom_prenom_mlpl = vm.selectedItem.nom_prenom_mlpl ;
			vm.filtre.date_visite2 = new Date(vm.selectedItem.date_visite2) ;
			vm.filtre.resultat_visite = vm.selectedItem.resultat_visite ;
			vm.filtre.recommandation = vm.selectedItem.recommandation ;
			vm.filtre.NumeroEnregistrement = vm.selectedItem.NumeroEnregistrement ;
			vm.filtre.nomchefmenage = vm.selectedItem.nomchefmenage ;
			vm.affichage_masque = true ;
		}
		vm.annuler = function () {
			vm.nouvelle_element = false ;
			vm.affichage_masque = false ;
			vm.selectedItem={};
		}
		vm.supprimerVisite_domicile = function() {
			vm.nouvelle_element = false ;
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('ok')
                .cancel('annuler');

			$mdDialog.show(confirm).then(function() {           
				save_visite_domicile(vm.selectedItem,1);
			}, function() {
            //alert('rien');
			});
        };	  
		
		vm.modifier_membre_menage =function(item) {
			vm.all_menages.forEach(function(mng) {
				if(parseInt(mng.id)==parseInt(vm.filtre.menage_id)) {
					// Affectation direct et non pas par paramètre : DANGEREUX
					vm.filtre.menage_id = mng.id; 
					vm.filtre.NumeroEnregistrement=mng.NumeroEnregistrement;
					vm.filtre.nomchefmenage=mng.nomchefmenage;
					vm.filtre.nom_conjoint=mng.nom_conjoint;
					vm.filtre.Addresse=mng.Addresse;
					vm.filtre.nombre_enfant_non_scolarise=mng.nombre_enfant_non_scolarise;
					vm.filtre.nombre_enfant_moins_six_ans=mng.nombre_enfant_moins_six_ans;
					vm.filtre.nombre_enfant_scolarise=mng.nombre_enfant_scolarise;
					vm.nontrouvee=false;
				}
			});			
		}
		
		// Fin Fonction Groupe ML/PL
		
		// Début Fonction filtre par découpage admin et detail par groupe ML/PM	
		// Fin Fonction filtre par découpage admin et detail par groupe ML/PM	
		// DEBUT FONCTION UTILITAIRE
		vm.showAlert = function(titre,textcontent) {         
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(false)
            .parent(angular.element(document.body))
            .title(titre)
            .textContent(textcontent)
            .ariaLabel('Information')
            .ok('Fermer')
            .targetEvent()
          );
        } 
		function formatDateBDD(dat) {
			if (dat) {
				var date = new Date(dat);
				var mois = date.getMonth()+1;
				var dates = (date.getFullYear()+"-"+mois+"-"+date.getDate());
				return dates;
			}          
		}
		vm.formatDateListe = function (dat) {
			if (dat) {
				var date = new Date(dat);
				var mois = date.getMonth()+1;
				var dates = (date.getDate()+"-"+mois+"-"+date.getFullYear());
				return dates;
			}          
		}
		vm.affichage_sexe_int = function(sexe_int) {      
			switch (sexe_int) {
				case '1':
					return "Homme" ;
					break;
				case '0':
					return "Femme" ;
					break;
				default:
					return "Non identifier"
					break;
			}
		}
		// FIN FONCTION UTILITAIRE

    }
})();

(function ()
{
    'use strict';
    angular
        .module('app.pfss.reporting.reporting_menage_beneficiaire')
        .controller('ReportingmenagebeneficiaireController', ReportingmenagebeneficiaireController);

    /** @ngInject */
    function ReportingmenagebeneficiaireController(apiFactory, $state, $mdDialog, $scope,$cookieStore,apiUrlReporting,$location) {
		var vm = this;
	   vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        responsive: true
      };

      vm.menage_column = [{titre:"Ile"},{titre:"Région"},{titre:"Commune"},{titre:"Village"},{titre:"Zip"},{titre:"Vague"},{titre:"Sous-projet"},{titre:"Inscrit"},{titre:"Préseléctionné"},{titre:"Bénéficiaire"},{titre:"Bén apte"},{titre:"Bén Inapte"}];
      //initialisation variable
        vm.affiche_load = false ;
        vm.selectedItem = {} ;
        vm.selectedItem_individu = {} ;
		
        vm.reponse_individu = {} ;
        vm.all_individus = [] ;
        vm.all_beneficiaires = [] ;
        vm.all_sous_projet = [] ;
        vm.all_lienparental = [] ;
        vm.all_annee = [] ;
        vm.all_etape = [] ;
        vm.all_agex = [] ;
		vm.all_agep=[];
		vm.all_vague=[];
		vm.all_zip=[];

        vm.nouvelle_element = false ;
        vm.nouvelle_element_individu = false ;
        vm.affichage_masque = false ;
        vm.affichage_masque_individu = false ;
        vm.date_now = new Date() ;
		vm.filtre={};
		
        vm.disable_button = false ;
		
        vm.id_user_cookies = $cookieStore.get('id');
		apiFactory.getOne("utilisateurs/index",vm.id_user_cookies).then(function(result) { 
			vm.user = result.data.response;
			apiFactory.getAll("region/index").then(function(result) { 
				vm.all_region = result.data.response;    
			});
			apiFactory.getAll("sous_projet/index").then(function(result) { 
				vm.all_sous_projet = result.data.response;    
			});
			apiFactory.getAll("annee/index").then(function(result) { 
				vm.all_annee = result.data.response;    
			});
			apiFactory.getAll("agent_ex/index").then(function(result) { 
				vm.all_agex= result.data.response;    
			});
			apiFactory.getAll("phaseexecution/index").then(function(result) { 
				vm.all_etape = result.data.response;    
			});
			apiFactory.getAll("agence_p/index").then(function(result) { 
				vm.all_agep= result.data.response;    
			});
			apiFactory.getAll("vague/index").then(function(result) { 
				vm.all_vague= result.data.response;    
			});
			apiFactory.getAll("zip/index").then(function(result) { 
				vm.all_zip= result.data.response;    
			});
	  
		});
         apiFactory.getAll("ile/index").then(function(result)
        { 
          vm.all_ile = result.data.response;              
        });
		// utilitaire
		vm.affiche_sexe = function(parametre) {
			if(parametre==0) {
				return "F";
			} else if(parametre==1){
				return "H";
			} else {
				return "";
			}
        };

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
		vm.filtrer = function()	{
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("reporting/index","etat","menage_beneficiaire",
						"etat_export_excel",99,
						"titre_etat","MENAGE BENEFICIAIRE",
						"village_id",vm.filtre.village_id,
						"commune_id",vm.filtre.id_commune,
						"region_id",vm.filtre.id_region,
						"ile_id",vm.filtre.id_ile,
						"vague",vm.filtre.vague,
						"zip",vm.filtre.zip,
						"id_sous_projet",vm.filtre.id_sous_projet).then(function(result) { 
				if(result.data.response.length==0) {
					$mdDialog.show(
						$mdDialog.alert()
						.parent(angular.element(document.querySelector('#popupContainer')))
						.clickOutsideToClose(false)
						.parent(angular.element(document.body))
						.title("INFORMATION")
						.textContent('Aucun ménage bénéficiaire pour le filtre choisi !.')
						.ariaLabel('Information')
						.ok('Fermer')
						.targetEvent()					
					);
				}
					vm.all_beneficiaires = result.data.response;    
					vm.affiche_load = false ;
			});
		}
		vm.export_excel = function() {
			vm.affiche_load = true ;
			vm.erreur=false;
			vm.erreur2=false;
			var repertoire = "tableau_de_bord/" ;
			apiFactory.getAPIgeneraliserREST("reporting/index","etat","menage_beneficiaire",
						"etat_export_excel",1,
						"titre_etat","MENAGE BENEFICIAIRE",
						"village_id",vm.filtre.village_id,
						"commune_id",vm.filtre.id_commune,
						"region_id",vm.filtre.id_region,
						"ile_id",vm.filtre.id_ile,
						"vague",vm.filtre.vague,
						"zip",vm.filtre.zip,
						"id_sous_projet",vm.filtre.id_sous_projet).then(function(result) { 
						vm.status =  result.data.status ;
						if(vm.status)  {
							var nom_file=result.data.nom_file;
							window.location = apiUrlReporting + nom_file; 
							vm.affiche_load =false; 
						} else {
							vm.erreur=true;
							vm.affiche_load =false;
							var message="ERREUR";
							vm.showAlert('Export ménage bénéficiaire en excel',message);
						}                      
			});
		}
		vm.selection= function (item)  {
			if ((!vm.affiche_load)&&(!vm.affichage_masque))  {
				vm.selectedItem = item;
			}       
		}
		$scope.$watch('vm.selectedItem', function() {
			if (!vm.all_beneficiaires) return;
			vm.all_beneficiaires.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
		})
		//FIN CHECK BOK MULTISELECT
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
		vm.modifierVillage = function(filtre) {
			vm.filtre.vague=null;
			vm.filtre.zip=null;
			vm.all_village.forEach(function(vil) {
				if(parseInt(vil.id)==parseInt(vm.filtre.village_id)) {
					vm.filtre.village = vil.Village; 
					vm.filtre.vague=vil.vague;
					vm.filtre.zip=vil.id_zip;
					vm.nontrouvee=false;
				}
			});			
		}
	}
  })();

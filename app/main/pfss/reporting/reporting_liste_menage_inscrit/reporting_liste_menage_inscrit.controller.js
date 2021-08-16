(function ()
{
    'use strict';
    angular
        .module('app.pfss.reporting.reporting_liste_menage_inscrit')
        .controller('ReportinglistemenageController', ReportinglistemenageController);

    /** @ngInject */
    function ReportinglistemenageController(apiFactory, $state, $mdDialog, $scope,$cookieStore,$location,apiUrlbase,apiUrlReporting) {
		var vm = this;
	   vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        responsive: true
      };
      vm.menage_column = [{titre:"Ile"},{titre:"Préfecture"},{titre:"Commune"},{titre:"Village"},{titre:"Sous-Projet"},
	  {titre:"Identifiant"},{titre:"Chef Ménage"},{titre:"Sexe"},{titre:"Conjoint"},{titre:"Sexe"},
      {titre:"Adresse"}];
      //initialisation variable
        vm.affiche_load = false ;
        vm.affiche_export = false ;
        vm.selectedItem = {} ;
		  vm.apiUrlbase=apiUrlbase; 		
        vm.all_menages = [] ;
        vm.all_sous_projet = [] ;
		vm.all_zip = [];
		vm.all_vague = [];
        vm.nouvelle_element = false ;
        vm.affichage_masque = false ;
        vm.disable_button = false ;
		vm.filtre={};		
		// Choix sous_projet selon url et affichage titre au niveau onglet
		vm.loc = $location ;
		vm.url=vm.loc.path();
      //initialisation variable

      //test check radio button
      //chargement clé etrangère et données de bases
        vm.id_user_cookies = $cookieStore.get('id');
		apiFactory.getOne("utilisateurs/index",vm.id_user_cookies).then(function(result) { 
			vm.user = result.data.response;
			apiFactory.getAll("region/index").then(function(result) { 
				vm.all_region = result.data.response;    
			});
			apiFactory.getAll("sous_projet/index").then(function(result) { 
				vm.all_sous_projet = result.data.response;    
			});
			apiFactory.getAll("zip/index").then(function(result) { 
				vm.all_zip = result.data.response;    
			});
			apiFactory.getAll("vague/index").then(function(result) { 
				vm.all_vague = result.data.response;    
			});
	  
		});
         apiFactory.getAll("ile/index").then(function(result)
        { 
          vm.all_ile = result.data.response;    
          
        });
         apiFactory.getAll("lienparental/index").then(function(result)
        { 
          vm.all_lienparental = result.data.response;    
          
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
		if(vm.url=="/reporting/liste-menage-inscrit") {
			vm.titre_onglet=' inscrit';
			vm.etat='liste_menage_inscrit';
			vm.titre_etat='LISTE MENAGE INSCRIT';
			vm.message_plus=' inscrit';
		}
		if(vm.url=="/reporting/liste-menage-preselectionne") {
			vm.titre_onglet=' préseléctionné';
			vm.etat='liste_menage_preselectionne';
			vm.titre_etat='LISTE MENAGE PRESELECTIONNE';
			vm.message_plus=' préseléctionné';
		}
		if(vm.url=="/reporting/liste-menage-beneficiaire") {
			vm.titre_onglet=' bénéficiaire';
			vm.etat='liste_menage_beneficiaire';
			vm.titre_etat='LISTE MENAGE BENEFICIAIRE';
			vm.message_plus=' bénéficiaire';
		}
		if(vm.url=="/reporting/liste-menage-sorti") {
			vm.titre_onglet=' sorti';
			vm.etat='liste_menage_sorti';
			vm.titre_etat='LISTE MENAGE SORTI';
			vm.message_plus=' sorti';
		}
		if(vm.url=="/reporting/liste-menage-inapte") {
			vm.titre_onglet=' inapte';
			vm.etat='liste_menage_inapte';
			vm.titre_etat='LISTE MENAGE INAPTE';
			vm.message_plus=' inapte';
		}
      	// utilitaire
     vm.filtre_region = function()  {
        apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",vm.filtre.id_ile).then(function(result) { 
          vm.all_region = result.data.response;   
          vm.filtre.id_region = null ; 
          vm.filtre.id_commune = null ; 
          vm.filtre.village_id = null ; 
        });
      }
      vm.filtre_commune = function()  {
        apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtre.id_region).then(function(result) { 
          vm.all_commune = result.data.response; 
          vm.filtre.id_commune = null ; 
          vm.filtre.village_id = null ; 
        });
      }
      vm.filtre_village = function()  {
        apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",vm.filtre.id_commune).then(function(result) { 
          vm.all_village = result.data.response;    
          vm.filtre.village_id = null ; 
        
        });
      }
		vm.filtrer = function()	{
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("reporting/index","etat",vm.etat,
						"etat_export_excel",99,
						"titre_etat",vm.titre_etat,
						"village_id",vm.filtre.village_id,
						"commune_id",vm.filtre.id_commune,
						"region_id",vm.filtre.id_region,
						"ile_id",vm.filtre.id_ile,
						"vague",vm.filtre.vague,
						"zip",vm.filtre.zip,
						"id_sous_projet",vm.filtre.id_sous_projet).then(function(result) { 
				if(result.data.response.length==0) {
					var mes='Aucun ménage' + vm.message_plus+' pour le filtre choisi. Merci !.'
					vm.showAlert("INFORMATION",mes);     
				}
					vm.all_menages = result.data.response;    
					vm.affiche_load = false ;
			});		
		}
		vm.export_excel = function() {
			vm.affiche_export = true ;
			vm.erreur=false;
			vm.erreur2=false;
			var repertoire = "tableau_de_bord/" ;
			apiFactory.getAPIgeneraliserREST("reporting/index","etat",vm.etat,
						"etat_export_excel",1,
						"titre_etat",vm.titre_etat,
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
							vm.affiche_export =false; 
						} else {
							vm.erreur=true;
							vm.affiche_export =false;
							var message="ERREUR";
							vm.showAlert('Export ménage bénéficiaire en excel',message);
						}                      
			});
		}
		vm.modifierSousProjet = function(filtre) {
			vm.all_sous_projet.forEach(function(ssp) {
				if(parseInt(ssp.id)==parseInt(vm.filtre.id_sous_projet)) {
					vm.filtre.sous_projet = ssp.description; 
					vm.nontrouvee=false;
				}
			});			
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
		vm.selection= function (item)  {
			if ((!vm.affiche_load)&&(!vm.affichage_masque))  {
				vm.selectedItem_individu = {} ;//raz individu_selected
				vm.selectedItem = item;
			}       
		}
		$scope.$watch('vm.selectedItem', function() {
			if (!vm.all_menages) return;
			vm.all_menages.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
		})
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
	}
  })();

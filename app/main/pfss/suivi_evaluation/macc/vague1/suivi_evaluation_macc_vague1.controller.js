(function ()
{
    'use strict';
    angular
        .module('app.pfss.suivi_evaluation.suivi_evaluation_macc.vague1')
        .controller('Suivievaluationmaccvague1Controller', Suivievaluationmaccvague1Controller);

    /** @ngInject */
    function Suivievaluationmaccvague1Controller(apiFactory, $state, $mdDialog, $http, $scope,$location,$cookieStore,apiUrl,apiUrlExcel,apiUrlExcelimport) {
		var vm = this;
	   vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        responsive: true
      };
        vm.dtOptions_new =
        {
            dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple_numbers',
            retrieve:'true',
            order:[] 
        };

      vm.suivi_column = [{titre:"Ile"},{titre:"Prefecture"},{titre:"Commune"},{titre:"Zip"},{titre:"Village"},{titre:"Popula° RGPH 2017"},
	  {titre:"Nb bénéf"},{titre:"Mise en place ML/P/"},{titre:"Statut"},{titre:"Date réalisa°"},{titre:"Nb ML élu"},{titre:"Date rétard"},{titre:"Cause rétard"}];
	  
	  vm.suivi_column_arse = [{titre:"Troisième paiement"},{titre:"Statut"},{titre:"Réalisa°"},{titre:"Mén payé"},{titre:"Mén exclus"},{titre:"Date rétard"},{titre:"Cause rétard"}];	  
	  
      vm.statut_evaluation = [{titre:"réalisé",statut:"réalisé"},{titre:"en cours",statut:"en cours"},{titre:"suspendu",statut:"suspendu"},{titre:"non réalisé",statut:"non réalisé"}];
      //initialisation variable
		vm.fichier="";
        vm.affiche_load = false ;
        vm.selectedItem = {} ;
        vm.selectedItem_individu = {} ;
		
        vm.reponse_individu = {} ;
        vm.all_suivi = [] ;
        vm.all_beneficiaires = [] ;
        vm.all_fiche_presence = [] ;
        vm.all_sous_projet = [] ;
        vm.all_lienparental = [] ;
		vm.all_etatpresence =[];
        vm.all_annee = [] ;
        vm.all_etape = [] ;
        vm.all_agex = [] ;
        vm.all_agep = [] ;
        vm.all_zip = [] ;
		vm.all_titre_affiche_ong =[];
		vm.all_titre_affiche_ml =[];
		vm.all_titre_affiche_realisation_ebe =[];
		vm.all_valeur_affiche =[];
        vm.filtre = {} ;
		vm.id_sous_projet =1;
        vm.nouvelle_element = false ;
        vm.nouvelle_element_individu = false ;
        vm.affichage_masque = false ;
        vm.affichage_masque_individu = false ;
        vm.date_now = new Date() ;
		vm.actualise=false;
        vm.disable_button = false ;
		vm.affichage_masque=false;
 		vm.loc = $location ;
		vm.url=vm.loc.path();
		
		if(vm.url=='/suivi-evaluation/act/vague1') {
			vm.titre_sous_projet =" ACT";
			vm.titre_vague = "Vague 1";
			vm.filtre.vague = 1;
			vm.filtre.id_sous_projet = 1;
			vm.filtre.type_suivi="ACT";
		} 
		if(vm.url=='/suivi-evaluation/act/vague2') {
			vm.titre_sous_projet =" ACT";
			vm.titre_vague = "Vague 2";
			vm.filtre.vague = 2;
			vm.filtre.id_sous_projet = 1;
			vm.filtre.type_suivi="ACT";
		}
		if(vm.url=='/suivi-evaluation/act/vague3') {
			vm.titre_sous_projet =" ACT";
			vm.titre_vague = "Vague 3";
			vm.filtre.vague = 3;
			vm.filtre.id_sous_projet = 1;
			vm.filtre.type_suivi="ACT";
		}
		if(vm.url=='/suivi-evaluation/arse/vague1') {
			vm.titre_sous_projet =" ARSE";
			vm.titre_vague = "Vague 1";
			vm.filtre.vague = 1;
			vm.filtre.id_sous_projet = 2;
			vm.filtre.type_suivi="ARSE";
		} 
		if(vm.url=='/suivi-evaluation/arse/vague2') {
			vm.titre_sous_projet =" ARSE";
			vm.titre_vague = "Vague 2";
			vm.filtre.vague = 2;
			vm.filtre.id_sous_projet = 2;
			vm.filtre.type_suivi="ARSE";
		}
		if(vm.url=='/suivi-evaluation/arse/vague3') {
			vm.titre_sous_projet =" ARSE";
			vm.titre_vague = "Vague 3";
			vm.filtre.vague = 3;
			vm.filtre.id_sous_projet = 2;
			vm.filtre.type_suivi="ARSE";
		}
		if(vm.url=='/suivi-evaluation/covid-19/vague1') {
			vm.titre_sous_projet =" COVID-19";
			vm.titre_vague = "Vague 1";
			vm.filtre.vague = 1;
			vm.filtre.id_sous_projet = 4;
			vm.filtre.type_suivi="COVID";
		} 
		if(vm.url=='/suivi-evaluation/covid-19/vague2') {
			vm.titre_sous_projet =" COVID-19";
			vm.titre_vague = "Vague 2";
			vm.filtre.vague = 2;
			vm.filtre.id_sous_projet = 4;
			vm.filtre.type_suivi="COVID";
		}
		if(vm.url=='/suivi-evaluation/covid-19/vague3') {
			vm.titre_sous_projet =" COVID-19";
			vm.titre_vague = "Vague 3";
			vm.filtre.vague = 3;
			vm.filtre.id_sous_projet = 4;
			vm.filtre.type_suivi="COVID";
		}
		if(vm.url=='/suivi-evaluation/macc/vague1') {
			vm.titre_sous_projet =" MACC";
			vm.titre_vague = "Vague 1";
			vm.filtre.vague = 1;
			vm.filtre.id_sous_projet = 4;
			vm.filtre.type_suivi="MACC";
		}
		if(vm.url=='/suivi-evaluation/macc/vague2') {
			vm.titre_sous_projet =" MACC";
			vm.titre_vague = "Vague 2";
			vm.filtre.vague = 1;
			vm.filtre.id_sous_projet = 4;
			vm.filtre.type_suivi="MACC";
		}
		if(vm.url=='/suivi-evaluation/macc/vague3') {
			vm.titre_sous_projet =" MACC";
			vm.titre_vague = "Vague 3";
			vm.filtre.vague = 1;
			vm.filtre.id_sous_projet = 4;
			vm.filtre.type_suivi="MACC";
		}
        vm.id_user_cookies = $cookieStore.get('id');
		apiFactory.getOne("utilisateurs/index",vm.id_user_cookies).then(function(result) { 
			vm.user = result.data.response;
			apiFactory.getAll("sous_projet/index").then(function(result) { 
				vm.all_sous_projet = result.data.response;    
			});
			apiFactory.getAll("annee/index").then(function(result) { 
				vm.all_annee = result.data.response;    
			});
			apiFactory.getAll("agent_ex/index").then(function(result) { 
				vm.all_agex= result.data.response;    
			});
			apiFactory.getAll("agence_p/index").then(function(result) { 
				vm.all_agep= result.data.response; 
			});
			apiFactory.getAll("zip/index").then(function(result) { 
				vm.all_zip= result.data.response; 
			});
			apiFactory.getAPIgeneraliserREST("phaseexecution/index","cle_etrangere",vm.id_sous_projet).then(function(result) {
				vm.all_etape = result.data.response;    
			});
	  
		});
         apiFactory.getAll("ile/index").then(function(result)
        { 
          vm.all_ile = result.data.response;    
          vm.all_ile_detail = result.data.response;    
          
        });
     vm.filtre_region = function()
      {
        apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",vm.filtre.id_ile).then(function(result)
        { 
          vm.all_region = result.data.response;   
          vm.filtre.id_region = null ; 
          vm.filtre.id_commune = null ; 
          vm.filtre.village_id = null ; 
		  vm.actualise=false;
          
        });

      }

      vm.filtre_commune = function()
      {
        apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtre.id_region).then(function(result)
        { 
          vm.all_commune = result.data.response; 
          vm.filtre.id_commune = null ; 
          vm.filtre.village_id = null ; 
		  vm.actualise=false;
          
        });
      }
      vm.filtre_village = function()
      {
        apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",vm.filtre.id_commune).then(function(result)
        { 
          vm.all_village = result.data.response;    
          vm.filtre.village_id = null ;
			vm.actualise=false;
          
          
        });
      }
		vm.filtrer = function()	{
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("suivi_evaluation/index","titre",1).then(function(result1) { 
				vm.all_titre_affiche_ong = result1.data.response.titre_et_valeur_ong; 
				vm.all_titre_affiche_ml = result1.data.response.titre_et_valeur_ml; 
				vm.all_titre_affiche_realisation_ebe = result1.data.response.titre_et_valeur_realisation_ebe; 
				console.log(vm.all_titre_affiche_ong);
				console.log(vm.all_titre_affiche_ml);
				apiFactory.getAPIgeneraliserREST("suivi_evaluation/index","vague",vm.filtre.vague,"type_suivi",vm.filtre.type_suivi).then(function(result) { 
					if(result.data.response.length==0) {
						$mdDialog.show(
							$mdDialog.alert()
							.parent(angular.element(document.querySelector('#popupContainer')))
							.clickOutsideToClose(false)
							.parent(angular.element(document.body))
							.title("INFORMATION")
							.textContent("Aucun enregistrement pour le filtre choisi !.")
							.ariaLabel('Information')
							.ok('Fermer')
							.targetEvent()					
						);
					}
						vm.actualise=true;
						vm.all_suivi = result.data.response; 
						console.log(vm.all_suivi);	
						vm.affiche_load = false ;
				});
			});
		}
		// FIN POUR IMPORT ETAT	
		vm.export_excel = function() {
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("requete_export/index",
                                                "id_ile",vm.filtre.id_ile,
                                                "id_region",vm.filtre.id_region,                                               
                                                "id_commune",vm.filtre.id_commune,
                                                "village_id",vm.filtre.village_id,
                                                "id_sous_projet",vm.filtre.id_sous_projet,
                                                "agex_id",vm.filtre.agex_id,
                                                "id_annee",vm.filtre.id_annee,
                                                "etape_id",vm.filtre.etape_id,
                                                "fiche_presence",1,
                                                "export",1
                                                ).then(function(result) {               
					vm.status =  result.data.status ;
					if(vm.status)  {
						var ile =	result.data.ile;
						var region =result.data.region;
						var commune =result.data.commune;
						var village =result.data.village;
						var nom_ile =result.data.nom_ile;
						var microprojet =result.data.microprojet;
						var nom_agex =result.data.nom_agex;
						var date_edition=result.data.date_edition;
						var chemin=result.data.chemin;
						var name_file1=result.data.name_file1;
						var name_file2=result.data.name_file2;
						// Ménage Apte
						window.location = apiUrlExcel + chemin + name_file1;  
						window.location = apiUrlExcelimport + chemin + name_file2;  
						// Ménage INAPTE
						if(result.data.fichier3=="OK") {
							var name_file3=result.data.name_file3;
							window.location = apiUrlExcel + chemin + name_file3; 
						}
						if(result.data.fichier4=="OK") {
							var name_file4=result.data.name_file4;
							window.location = apiUrlExcelimport + chemin + name_file4;  
						}
						vm.affiche_load =false; 
					} else {
						vm.affiche_load =false;
						var message=result.data.message;
						vm.showAlert('Export en excel',message);
					}                      
			});
		}
		vm.selection= function (item)  {
			vm.selectedItem = item;
		}
		$scope.$watch('vm.selectedItem', function() {
			if (!vm.all_suivi) return;
			vm.all_suivi.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
		})
		vm.modifier = function()  {
			vm.affiche_load=true; 
			vm.filtre.population_rgph_2017 = parseInt(vm.selectedItem.population_rgph_2017);
			vm.filtre.menage_beneficiaire = parseInt(vm.selectedItem.menage_beneficiaire);
			if(vm.selectedItem.debut_mise_en_place_mere_leader)
			vm.filtre.debut_mise_en_place_mere_leader = new Date(vm.selectedItem.debut_mise_en_place_mere_leader);
			if(vm.selectedItem.fin_mise_en_place_mere_leader)
			vm.filtre.fin_mise_en_place_mere_leader = new Date(vm.selectedItem.fin_mise_en_place_mere_leader);
			vm.filtre.statut_mise_en_place_ml = vm.selectedItem.statut_mise_en_place_ml;
			if(vm.selectedItem.date_realisation_mise_en_place_ml)
			vm.filtre.date_realisation_mise_en_place_ml = new Date(vm.selectedItem.date_realisation_mise_en_place_ml);
			vm.filtre.nombre_mere_leader_elu = parseInt(vm.selectedItem.nombre_mere_leader_elu);
			if(vm.selectedItem.date_retard_mise_en_place_ml)
			vm.filtre.date_retard_mise_en_place_ml = new Date(vm.selectedItem.date_retard_mise_en_place_ml);
			vm.filtre.cause_retard_mise_en_place_ml = vm.selectedItem.cause_retard_mise_en_place_ml;
			vm.affiche_load=false;
			vm.affichage_masque=true;
		}	
		vm.annuler= function (item)  {
			vm.affichage_masque=false;
			vm.selectedItem={};
		}
		vm.save_suivi_evaluation = function(item) {
			vm.disable_button = true ;
			var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };
				vm.test_id = item.id 
			var datas = $.param(
                    {    
						supprimer:0,
						id: item.id ,
						type_suivi: vm.filtre.type_suivi,
						population_rgph_2017: item.population_rgph_2017,
						debut_mise_en_place_mere_leader: item.debut_mise_en_place_mere_leader,                                                 
						fin_mise_en_place_mere_leader: item.fin_mise_en_place_mere_leader,                                                 
						statut_mise_en_place_ml: item.statut_mise_en_place_ml,                                                 
						date_realisation_mise_en_place_ml: formatDateBDD(item.date_realisation_mise_en_place_ml),                                                 
						date_retard_mise_en_place_ml: formatDateBDD(item.date_retard_mise_en_place_ml),                                                 
						cause_retard_mise_en_place_ml: item.cause_retard_mise_en_place_ml,                                                 
						
                    });

			apiFactory.add("suivi_evaluation/index",datas, config).success(function (data) {
				if(vm.test_id ==0) {
					vm.selectedItem.id=data.response;
				}
				vm.disable_button = false ;
				vm.showAlert("Information",'Enregistrement réussi!');
			}).error(function (data) {
				vm.disable_button = false ;
				vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
			}); 
		}
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
		vm.modifierVillage = function() {
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
		vm.formatMillier = function (nombre) 
		{
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
	}
  })();

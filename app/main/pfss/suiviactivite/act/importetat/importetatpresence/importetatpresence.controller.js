(function ()
{
    'use strict';
    angular
        .module('app.pfss.suiviactivite.suivi_act.importetat.importetatpresence')
        .directive('customOnChange', function() {
			return {
				restrict: 'A',
				link: function (scope, element, attrs) {
					var onChangeHandler = scope.$eval(attrs.customOnChange);
					element.bind('change', onChangeHandler);
				}
			};
		})
        .directive('fileModel', ['$parse', function ($parse) {
			return {
				restrict: 'A',
				link: function(scope, element, attrs) {
					var model = $parse(attrs.fileModel);
					var modelSetter = model.assign;        
					element.bind('change', function(){
						scope.$apply(function(){
							modelSetter(scope, element[0].files[0]);
							// console.log(element[0].files[0]);
						});
					});
				}
			};
		}])
		.service('fileUpload', ['$http', function ($http) {
			this.uploadFileToUrl = function(file, uploadUrl){
				var fd = new FormData();
				var rep='test';
				fd.append('file', file);
				$http.post(uploadUrl, fd,{
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				}).success(function(){
				}).error(function(){
				});
			}
		}])
        .controller('ImportetatpresenceController', ImportetatpresenceController);

    /** @ngInject */
    function ImportetatpresenceController(apiFactory, $state, $mdDialog, $http, $scope,$cookieStore,apiUrl,apiUrlExcel,apiUrlExcelimport) {
		var vm = this;
	   vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        responsive: true
      };

      vm.menage_column = [{titre:"N° Ident"},{titre:"Chef ménage"},{titre:"Travailleur principal"},{titre:"Nb jour"},{titre:"Travailleur remplacant"},{titre:"Nb jour"}];
      vm.liste_presence_column = [{titre:"Ile"},{titre:"Région"},{titre:"Commune"},{titre:"ZIP"},{titre:"Village"},{titre:"Début"}
	  ,{titre:"Fin"},{titre:"Nb jour"},{titre:"Payé le"},{titre:"Sous projet"},{titre:"Agex"},{titre:"Année"},{titre:"Etape"}];
      //initialisation variable
		vm.fichier="";
        vm.affiche_load = false ;
        vm.selectedItem = {} ;
        vm.selectedItem_individu = {} ;
		
        vm.reponse_individu = {} ;
        vm.all_individus = [] ;
        vm.all_beneficiaires = [] ;
        vm.all_fiche_presence = [] ;
        vm.all_sous_projet = [] ;
        vm.all_lienparental = [] ;
        vm.all_annee = [] ;
        vm.all_etape = [] ;
        vm.all_agex = [] ;

        vm.nouvelle_element = false ;
        vm.nouvelle_element_individu = false ;
        vm.affichage_masque = false ;
        vm.affichage_masque_individu = false ;
        vm.date_now = new Date() ;
		vm.filtredetail ={};
		vm.filtredetail.id_sous_projet=1;
        vm.disable_button = false ;
      //initialisation variable

      //test check radio button

      //fin test check radio button
      //chargement clé etrangère et données de bases
        vm.id_user_cookies = $cookieStore.get('id');
		apiFactory.getOne("utilisateurs/index",vm.id_user_cookies).then(function(result) { 
			vm.user = result.data.response;
			apiFactory.getAll("region/index").then(function(result) { 
				vm.all_region = result.data.response;    
				vm.all_region_detail = result.data.response;    
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
			apiFactory.getAPIgeneraliserREST("phaseexecution/index","cle_etrangere",1).then(function(result) {
				vm.all_etape =result.data.response;    
			});	  
		});
         apiFactory.getAll("ile/index").then(function(result)
        { 
          vm.all_ile = result.data.response;    
          vm.all_ile_detail = result.data.response;    
          
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
		// Upload fichier excel bénéficiaire
		$scope.uploadFile = function(event){
			var files = event.target.files;
			vm.myFile=files;  
			vm.monfichier = vm.myFile[0].name;
		};
		// Upload fichier excel bénéficiaire
 		vm.uploadFile = function (item,suppression) {
			var file =vm.myFile[0];
			var repertoire = "importexcel/";
			var uploadUrl = apiUrl + "upload_fichier/upload_file";
			var name = $scope.name;
			var fd = new FormData();
			fd.append('file', file);
			fd.append('repertoire',repertoire);
			fd.append('id_ile',vm.filtre.id_ile);
			fd.append('id_region',vm.filtre.id_region);
			fd.append('id_commune',vm.filtre.id_commune);
			fd.append('village_id',vm.filtre.village_id);
			if(file) { 
				var upl=   $http.post(uploadUrl, fd, {
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				}).success(function(data){
					vm.fichier=data["nom_fichier"];
					vm.repertoire=data["repertoire"];
					if(data["reponse"]=="OK") {
						vm.Importer_etat_presence();
					} else {
						vm.showAlert("INFORMATION","Erreur lors de  l'importation du fichier.Merci");
					}	
				}).error(function(){
					// console.log("Rivotra");
				});
			} else {
				// vm.sauverDocument(item,0);
			}
		}

      	// utilitaire
	// DEBUT POUR IMPORT ETAT	
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
			apiFactory.getAPIgeneraliserREST("requete_export/index","liste_fiche_presence",1).then(function(result) { 
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
					vm.all_fiche_presence = result.data.response;    
					vm.affiche_load = false ;
			});
		}
		// FIN POUR IMPORT ETAT	
	// DEBUT POUR DETAIL ETAT DEJA IMPORTES
     vm.filtre_region_detail = function()
      {
        apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",vm.filtredetail.id_ile).then(function(result)
        { 
          vm.all_region_detail = result.data.response;   
          vm.filtredetail.id_region = null ; 
          vm.filtredetail.id_commune = null ; 
          vm.filtredetail.village_id = null ; 
          
        });

      }

      vm.filtre_commune_detail = function()
      {
        apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtredetail.id_region).then(function(result)
        { 
          vm.all_commune_detail = result.data.response; 
          vm.filtredetail.id_commune = null ; 
          vm.filtredetail.village_id = null ; 
          
        });
      }
      vm.filtre_village_detail = function()
      {
        apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",vm.filtredetail.id_commune).then(function(result)
        { 
          vm.all_village_detail = result.data.response;    
          vm.filtredetail.village_id = null ; 
          
          
        });
      }
		vm.filtrer_detail = function()	{
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("requete_export/index","liste_etat_presence",1,
																	"village_id",vm.filtredetail.village_id,
																	"id_sous_projet",vm.filtredetail.id_sous_projet,
																	"agex_id",vm.filtredetail.agex_id,
																	"id_annee",vm.filtredetail.id_annee,
																	"etape_id",vm.filtredetail.etape_id).then(function(result) { 
				if(result.data.response.length==0) {
					$mdDialog.show(
						$mdDialog.alert()
						.parent(angular.element(document.querySelector('#popupContainer')))
						.clickOutsideToClose(false)
						.parent(angular.element(document.body))
						.title("INFORMATION")
						.textContent('Aucun état de présence pour le filtre choisi !.')
						.ariaLabel('Information')
						.ok('Fermer')
						.targetEvent()					
					);
				}
					vm.all_fiche_presence = result.data.response;    
					vm.affiche_load = false ;
			});
		}
		// FIN POUR DETAIL ETAT DEJA IMPORTES
	
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
		vm.Importer_etat_presence= function () {
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("requete_import/index",
                                                "id_ile",vm.filtre.id_ile,
                                                "id_region",vm.filtre.id_region,                                               
                                                "id_commune",vm.filtre.id_commune,
                                                "village_id",vm.filtre.village_id,
                                                "observation",vm.filtre.observation,
                                                "etat_presence",1,
                                                "importation",1,
                                                "nomfichier",vm.fichier,
                                                "chemin",vm.repertoire
                                                ).then(function(result) {               
					vm.status =  result.data.status ;
					if(vm.status)  {
						vm.all_beneficiaires = result.data.fiche_presencemenage;
						vm.all_fiche_presence.push(result.data.fiche_presence);
						vm.affiche_load =false; 
						vm.showAlert('Importation etat de présence en excel',"Les données sont insérées dans la base de données. Merci !");
					} else {
						vm.affiche_load =false;
						var ret = result.data.retour;
						var mess = "";
						if(ret.deja_importe >"") {
							mess=mess + ret.deja_importe;
						}
						if(ret.erreur_annee >"") {
							mess=mess + ret.erreur_annee;
						}
						if(ret.erreur_date >"") {
							mess=mess + ret.erreur_date;
						}
						if(ret.erreur_etape >"") {
							mess=mess + ret.erreur_etape;
						}
						if(ret.erreur_microprojet >"") {
							mess=mess + ret.erreur_microprojet;
						}
						if(ret.erreur_nbjour >"") {
							mess=mess + ret.erreur_nbjour;
						}
						vm.showAlert('Import en excel',mess);
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
			if (!vm.all_fiche_presence) return;
			vm.all_fiche_presence.forEach(function(item) {
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
	}
  })();

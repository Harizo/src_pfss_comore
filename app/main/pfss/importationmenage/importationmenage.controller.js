(function ()
{
    'use strict';
    angular
        .module('app.pfss.importationmenage')
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
        .controller('ImportationmenageController', ImportationmenageController);

    /** @ngInject */
    function ImportationmenageController(apiFactory, $state, $mdDialog, $http, $scope,$cookieStore,apiUrl,apiUrlExcel,apiUrlExcelimport,apiUrlbase) {
		var vm = this;
	   vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        responsive: true
      };

      vm.menage_column = [{titre:"Point insc"},{titre:"N° Enreg"},{titre:"Identif ménage"},{titre:"Chef ménage"},{titre:"Sexe"},{titre:"Conjoint"},{titre:"Sexe"},{titre:"Date inscription"},{titre:"Score"},{titre:"Rang"},{titre:"Statut"}];
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
        vm.sous_projet = [] ;
 
        vm.nouvelle_element = false ;
        vm.nouvelle_element_individu = false ;
        vm.affichage_masque = false ;
        vm.affichage_masque_individu = false ;
        vm.date_now = new Date() ;

        vm.disable_button = false ;
		vm.ancien_sous_projet=null;
		vm.nouveau_sous_projet=null;
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
			var repertoire = "importmenage/";
			var uploadUrl = apiUrl + "upload_fichier/upload_fichier";
			var name = $scope.name;
			var fd = new FormData();
			fd.append('file', file);
			fd.append('repertoire',repertoire);
			if(file) { 
				var upl=   $http.post(uploadUrl, fd, {
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				}).success(function(data){
					vm.fichier=data["nom_fichier"];
					vm.repertoire=data["repertoire"];
					if(data["reponse"]=="OK") {
						vm.Controler_menage();
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
	
		vm.Controler_menage= function () {
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("importation_menage/index",
                                                "nomfichier",vm.fichier,
                                                "chemin",vm.repertoire,
                                                "controle",1,
												"id_sous_projet",vm.filtre.id_sous_projet
                                                ).then(function(result) {               
					vm.status =  result.data.status ;
					if(vm.status)  {
						vm.affiche_load = true ;
						vm.Importer_menage();
					} else {
						vm.retour =result.data.retour;
						var mess = "LES ERREURS SONT : "; 
						if(parseInt(vm.retour.erreur_sous_projet) >0) {
							mess=mess  + "Activité sous-projet = " + vm.retour.erreur_sous_projet;
						}
						 mess="Télécharger le fichier puis corriger les erreurs : VOIR LES CELLULES COLORES EN ROUGE";
						vm.affiche_load =false;
						vm.showAlert('ERREUR Import en excel',mess);
						window.location = apiUrlbase + vm.repertoire + vm.fichier;
					}                      
			});			
		}
		vm.Importer_menage= function () {
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("importation_menage/index",
                                                "nomfichier",vm.fichier,
                                                "chemin",vm.repertoire,
                                                "import",1,
												"id_sous_projet",vm.filtre.id_sous_projet
                                                ).then(function(result) {   
					vm.status =  result.data.status ;
					if(vm.status)  {
						vm.affiche_load =false; 
						vm.all_beneficiaires=result.data.menage;
						vm.sous_projet=result.data.sous_projet;
						vm.nom_ile=result.data.nom_ile;
						vm.nom_prefecture=result.data.nom_prefecture;
						vm.nom_commune=result.data.nom_commune;
						vm.nom_village=result.data.nom_village;
						vm.showAlert('Importation ménage',"Les données sont insérées dans la base de données. Merci !");															
					} else {
						var mess="";
						vm.retour =result.data.retour;
						 mess="Télécharger le fichier puis corriger les erreurs : VOIR LES CELLULES COLORES EN ROUGE";
						vm.affiche_load =false;
						vm.showAlert('ERREUR Import en excel',mess);
						window.location = apiUrlbase + vm.repertoire + vm.fichier;
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
		vm.modifierSousProjet = function(filtre) {
			vm.all_sous_projet.forEach(function(ssp) {
				if(parseInt(ssp.id)==parseInt(vm.filtre.id_sous_projet)) {
					vm.filtre.sous_projet = ssp.description; 
					vm.nouveau_sous_projet= ssp.description;
					if(!vm.ancien_sous_projet) {
						vm.ancien_sous_projet =ssp.description; 
					} else {
						if(vm.ancien_sous_projet!=vm.nouveau_sous_projet) {
							vm.monfichier=null;
						}
					}
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
		vm.Controler_vague_zip= function () {
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("importation_menage/index",
                                                "controle",1,
												"vague",1
                                                ).then(function(result) {               
					vm.status =  result.data.status ;
					if(vm.status)  {
						vm.affiche_load = true ;
						vm.Importer_vague();
					} else {
						vm.retour =result.data.retour;
						 var mess="Télécharger le fichier puis corriger les erreurs : VOIR LES CELLULES COLORES EN ROUGE";
						vm.affiche_load =false;
						vm.showAlert('ERREUR Import en excel',mess);
						window.location = apiUrlbase + 'vague/' + 'vague_zip.xlsx';
					}                      
			});			
		}
		vm.Importer_vague = function() {
			apiFactory.getAPIgeneraliserREST("importation_menage/index",
                                                "import",1,
												"vague",1
                                                ).then(function(result) {   
					vm.status =  result.data.status ;
					if(vm.status)  {
						vm.affiche_load =false; 
						vm.showAlert('Importation vague et ZIP',"Les données sont mise à jour dans la base de données. Merci !");															
					} else {
						var mess="";
						vm.retour =result.data.retour;
						 mess="Télécharger le fichier puis corriger les erreurs : VOIR LES CELLULES COLORES EN ROUGE";
						vm.affiche_load =false;
						vm.showAlert('ERREUR Import en excel',mess);
						window.location = apiUrlbase + 'vague/' + 'vague_zip.xlsx';
					}                      
			});			
		}
	}
  })();

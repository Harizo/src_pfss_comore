(function ()
{
    'use strict';
    angular
        .module('app.pfss.suiviactivite.suivi_arse.paiement1.etat_paiement')
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
        .controller('EtatpaiementController', EtatpaiementController);

    /** @ngInject */			
    function EtatpaiementController(apiFactory, $state, $mdDialog, $http, $scope,$cookieStore,apiUrlExcel,apiUrlExcelimport,$location,apiUrl,apiUrlbase) {
		var vm = this;
	   vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        responsive: true
      };

      vm.detail_etat_presence_column = [{titre:"N° Ident"},{titre:"Chef ménage"},{titre:"Travailleur principal"},{titre:"Mont à payer"},{titre:"Travailleur remplacant"},{titre:"Mont à payer"}];
      //initialisation variable
        vm.affiche_load = false ;
		vm.affiche_resultat=false;
        vm.selectedItem = {} ;
        vm.selectedItem_individu = {} ;
		
        vm.reponse_individu = {} ;
        vm.all_individus = [] ;
        vm.all_etatpresence = [] ;
        vm.all_sous_projet = [] ;
        vm.all_lienparental = [] ;
        vm.all_annee = [] ;
        vm.all_etape = [] ;
        vm.all_agex = [] ;
        vm.all_agep = [] ;
        vm.all_menage_beneficiaire = [] ;

        vm.nouvelle_element = false ;
        vm.nouvelle_element_individu = false ;
        vm.affichage_masque = false ;
        vm.affichage_masque_individu = false ;
        vm.date_now = new Date() ;

        vm.disable_button = false ;
		vm.actualise = false ; 
		// Choix sous_projet selon url et affichage titre au niveau onglet
		vm.filtre={};
		vm.loc = $location ;
		vm.url=vm.loc.path();
		vm.filtre.id_sous_projet=2;
		if(vm.url=='/suivi-activite/arse/premier-paiement/etat-paiement-1') {
			vm.filtre.titre =" Premier Tranche";
			vm.filtre.numero_tranche =1;
			apiFactory.getAPIgeneraliserREST("phaseexecution/index","id",1).then(function(result) {
				vm.filtre.montant_a_payer = parseInt(result.data.response.indemnite);
				vm.filtre.pourcentage= parseInt(result.data.response.pourcentage);
				vm.filtre.tranche= result.data.response.Phase;
			});
		} else if(vm.url=='/suivi-activite/arse/deuxieme-paiement/etat-paiement-2') {
			vm.filtre.titre =" Deuxième Tranche"
			apiFactory.getAPIgeneraliserREST("phaseexecution/index","id",2).then(function(result) {
				vm.filtre.montant_a_payer = parseInt(result.data.response.indemnite);
				vm.filtre.pourcentage= parseInt(result.data.response.pourcentage);
				vm.filtre.tranche= result.data.response.Phase;
			});
		} else if(vm.url=='/suivi-activite/arse/troisieme-paiement/etat-paiement-3') {
			vm.filtre.titre =" Troisième Tranche";
			apiFactory.getAPIgeneraliserREST("phaseexecution/index","id",3).then(function(result) {
				vm.filtre.montant_a_payer = parseInt(result.data.response.indemnite);
				vm.filtre.pourcentage= parseInt(result.data.response.pourcentage);
				vm.filtre.tranche= result.data.response.Phase;
			});
		}		
  		// Upload fichier excel bénéficiaire
		// Upload fichier excel bénéficiaire
		$scope.uploadFile = function(event){
			var files = event.target.files;
			vm.myFile=files;  
			vm.monfichier = vm.myFile[0].name;
		};
		// Upload fichier excel bénéficiaire
 		vm.uploadFile = function (item) {
			var file =vm.myFile[0];
			var repertoire = "importexcel";
			var uploadUrl = apiUrl + "upload_fichier/upload_paiement";
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
						vm.Controler_import_paiement_arse();
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
			apiFactory.getAll("annee/index").then(function(result) { 
				vm.all_annee = result.data.response;    
			});
			apiFactory.getAll("agent_ex/index").then(function(result) { 
				vm.all_agex= result.data.response;    
			});
			apiFactory.getAll("agence_p/index").then(function(result) { 
				vm.all_agep= result.data.response;    
			});
			apiFactory.getAll("phaseexecution/index").then(function(result) { 
				vm.all_etape = result.data.response;    
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
			vm.actualise = false ; 
        });

      }

      vm.filtre_commune = function()
      {
        apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtre.id_region).then(function(result)
        { 
			vm.all_commune = result.data.response; 
			vm.filtre.id_commune = null ; 
			vm.filtre.village_id = null ; 
			vm.actualise = false ;          
        });
      }
      vm.filtre_village = function()
      {
        apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",vm.filtre.id_commune).then(function(result)
        { 
			vm.all_village = result.data.response;    
			vm.filtre.village_id = null ; 
			vm.actualise = false ;        
        });
      }
		vm.filtrer = function()	{
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("requete_export/index","fiche_paiement_arse",1,"village_id",vm.filtre.village_id,"id_sous_projet",vm.filtre.id_sous_projet).then(function(result) { 
				if(result.data.response.length==0) {
					$mdDialog.show(
						$mdDialog.alert()
						.parent(angular.element(document.querySelector('#popupContainer')))
						.clickOutsideToClose(false)
						.parent(angular.element(document.body))
						.title("INFORMATION")
						.textContent("Aucune liste de ménage bénéficiaire pour le filtre choisi !.")
						.ariaLabel('Information')
						.ok('Fermer')
						.targetEvent()					
					);
				}
					vm.all_menage_beneficiaire = result.data.response;    
					vm.affiche_load = false ;
					vm.actualise = true ;
			});
		}
		vm.export_excel = function() {
			vm.affiche_load = true ;
			vm.all_menage_beneficiaire.forEach(function(lie) {
				if(parseInt(lie.id)==parseInt(vm.filtre.id_fichepresence)) {
					vm.filtre.id_sous_projet=lie.id_sous_projet;
					vm.filtre.agex_id=lie.agex_id;
					vm.filtre.id_annee=lie.id_annee;
					vm.filtre.etape_id=lie.etape_id;
				}
			});			
			var repertoire = "tableau_de_bord/" ;
			apiFactory.getAPIgeneraliserREST("requete_export/index",
                                                "id_ile",vm.filtre.id_ile,
                                                "id_region",vm.filtre.id_region,                                               
                                                "id_commune",vm.filtre.id_commune,
                                                "village_id",vm.filtre.village_id,
                                                "id_sous_projet",vm.filtre.id_sous_projet,
												"titre",vm.filtre.titre,
                                                "pourcentage",vm.filtre.pourcentage,
                                                "agep_id",vm.filtre.agep_id,
                                                "fiche_paiement_arse",1,
                                                "montant_a_payer",vm.filtre.montant_a_payer,
                                                "export",1
                                                ).then(function(result) {               
					vm.status =  result.data.status ;
					if(vm.status)  {
						// console.log(result.data.response);
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
						/*Ménage Apte*/
						if(result.data.fichier=="OK") {
							var name_file=result.data.name_file;
							window.location = apiUrlExcel + chemin + name_file; 
						}	
						vm.affiche_load =false; 
					} else {
						vm.affiche_load =false;
						console.log(result.data);
						var message=result.data.message;
						var message=result.data.nom_file;
						vm.showAlert('Export en excel',message);
					}                      
			});
		}
		vm.selection= function (item)  {
			if ((!vm.affiche_load)&&(!vm.affichage_masque))  {
				vm.selectedItem = item;
			}       
		}
		$scope.$watch('vm.selectedItem', function() {
			if (!vm.all_menage_beneficiaire) return;
			vm.all_menage_beneficiaire.forEach(function(item) {
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
		vm.Controler_import_paiement_arse= function () {
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("requete_import/index",
                                                "nomfichier",vm.fichier,
                                                "chemin",vm.repertoire,
                                                "controle",1,
												"id_sous_projet",2
                                                ).then(function(result) {               
					vm.status =  result.data.reponse ;
					if(vm.status)  {
						vm.affiche_load = true ;
						// vm.Importer_paiement_arse();
					} else {
						vm.retour =result.data.retour;
						var mess="Télécharger le fichier puis corriger les erreurs : VOIR LES CELLULES COLORES EN ROUGE";
						vm.affiche_load =false;
						vm.showAlert('ERREUR Import en excel',mess);
						window.location = apiUrlbase + result.data.chemin + result.data.nomfichier;
					}                      
			});			
		}
		vm.Importer_paiement_arse= function () {
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
		
	}
  })();

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

      vm.detail_etat_presence_column = [{titre:"N° Ident"},{titre:"Chef ménage"},{titre:"Recepteur principal"},{titre:"Mont payé"},{titre:"Recepteur suppléant"},{titre:"Mont payé"},{titre:"Total"}];
      vm.liste_paiement_column = [{titre:"Ile"},{titre:"Préfecture"},{titre:"Commune"},{titre:"Village"},{titre:"Date paiement"},{titre:"Tranche"},{titre:"Total à payer"},{titre:"Total payé"},{titre:"Payé ppal"},{titre:"Payé suppl"}];
      //initialisation variable
        vm.affiche_load = false ;
		vm.affiche_resultat=false;
        vm.selectedItem = {} ;
        vm.selectedItem_individu = {} ;
		vm.selectedItemPaiement = {} ;
        vm.reponse_individu = {} ;
        vm.all_individus = [] ;
        vm.all_etatpresence = [] ;
        vm.all_etat_paiement = [] ;
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
		
		if(vm.url=='/suivi-activite/arse/premier-paiement/etat-paiement-1') {
			vm.filtre.titre =" Premier Tranche";
			vm.filtre.numero_tranche =1;
			vm.filtre.id_sous_projet=2;
			vm.filtre.sous_projet=" ARSE";
			vm.filtre.etape_id=1;
			apiFactory.getAPIgeneraliserREST("phaseexecution/index","id",1).then(function(result) {
				vm.filtre.montant_a_payer = parseInt(result.data.response[0].indemnite);
				vm.filtre.pourcentage= parseInt(result.data.response[0].pourcentage);
				vm.filtre.tranche= result.data.response[0].Phase;
				vm.filtre.affiche_titre=" Premier Tranche de " + result.data.response.pourcentage + "%";
			});
		}
		if(vm.url=='/suivi-activite/arse/deuxieme-paiement/etat-paiement-2') {
			vm.filtre.titre =" Deuxième Tranche"
			vm.filtre.numero_tranche =2;
			vm.filtre.id_sous_projet=2;
			vm.filtre.sous_projet=" ARSE";
			vm.filtre.etape_id=2;
			apiFactory.getAPIgeneraliserREST("phaseexecution/index","id",2).then(function(result) {
				vm.filtre.montant_a_payer = parseInt(result.data.response[0].indemnite);
				vm.filtre.pourcentage= parseInt(result.data.response[0].pourcentage);
				vm.filtre.tranche= result.data.response[0].Phase;
				vm.filtre.affiche_titre=" Deuxième Tranche de " + result.data.response.pourcentage + "%";
			});
		}
		if(vm.url=='/suivi-activite/arse/troisieme-paiement/etat-paiement-3') {
			vm.filtre.titre =" Troisième Tranche";
			vm.filtre.numero_tranche =3;
			vm.filtre.id_sous_projet=2;
			vm.filtre.sous_projet=" ARSE";
			vm.filtre.etape_id=3;
			apiFactory.getAPIgeneraliserREST("phaseexecution/index","id",3).then(function(result) {
				vm.filtre.montant_a_payer = parseInt(result.data.response[0].indemnite);
				vm.filtre.pourcentage= parseInt(result.data.response[0].pourcentage);
				vm.filtre.tranche= result.data.response[0].Phase;
				vm.filtre.affiche_titre=" Troisième Tranche de " + result.data.response.pourcentage + "%";
			});
		}		
		if(vm.url=='/suivi-activite/covid/premier-paiement/etat-paiement-1') {
			vm.filtre.titre =" Premier Tranche";
			vm.filtre.affiche_titre=" Premier Tranche";
			vm.filtre.numero_tranche =1;
			vm.filtre.id_sous_projet=4;
			vm.filtre.sous_projet=" COVID-19";
			vm.filtre.etape_id=6;
			apiFactory.getAPIgeneraliserREST("phaseexecution/index","id",6).then(function(result) {
				vm.filtre.montant_a_payer = parseInt(result.data.response[0].indemnite);
				vm.filtre.pourcentage= parseInt(result.data.response[0].pourcentage);
				vm.filtre.tranche= result.data.response[0].Phase;
			});
		}
		if(vm.url=='/suivi-activite/covid/deuxieme-paiement/etat-paiement-2') {
			vm.filtre.titre =" Deuxième Tranche";
			vm.filtre.affiche_titre =" Deuxième Tranche";
			vm.filtre.numero_tranche =2;
			vm.filtre.id_sous_projet=4;
			vm.filtre.sous_projet=" COVID-19";
			vm.filtre.etape_id=7;
			apiFactory.getAPIgeneraliserREST("phaseexecution/index","id",7).then(function(result) {
				vm.filtre.montant_a_payer = parseInt(result.data.response[0].indemnite);
				vm.filtre.pourcentage= parseInt(result.data.response[0].pourcentage);
				vm.filtre.tranche= result.data.response[0].Phase;
			});
		}
		if(vm.url=='/suivi-activite/covid/troisieme-paiement/etat-paiement-3') {
			vm.filtre.titre =" Troisième Tranche";
			vm.filtre.affiche_titre =" Troisième Tranche";
			vm.filtre.numero_tranche =3;
			vm.filtre.id_sous_projet=4;
			vm.filtre.sous_projet=" COVID-19";
			vm.filtre.etape_id=8;
			apiFactory.getAPIgeneraliserREST("phaseexecution/index","id",8).then(function(result) {
				vm.filtre.montant_a_payer = parseInt(result.data.response[0].indemnite);
				vm.filtre.pourcentage= parseInt(result.data.response[0].pourcentage);
				vm.filtre.tranche= result.data.response[0].Phase;
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
			apiFactory.getAPIgeneraliserREST("phaseexecution/index","cle_etrangere",vm.filtre.id_sous_projet).then(function(result) {
				vm.all_etape = result.data.response;    
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
			apiFactory.getAPIgeneraliserREST("fiche_paiement/index","ile_id",vm.filtredetail.ile_id,
																	"id_region",vm.filtredetail.id_region,
																	"id_commune",vm.filtredetail.id_commune,
																	"village_id",vm.filtredetail.village_id,
																	"id_sous_projet",vm.filtre.id_sous_projet,
																	"etape_id",vm.filtredetail.etape_id).then(function(result) { 
				if(result.data.response.length==0) { 
					vm.showAlert("INFORMATION",'Aucun état de paiement pour le filtre choisi !.');
				}
					vm.all_etat_paiement = result.data.response;    
					vm.affiche_load = false ;
			});
		}
		// FIN POUR DETAIL ETAT DEJA IMPORTES
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
		vm.selectionpaiement= function (item)  {
			if ((!vm.affiche_load))  {
				vm.selectedItemPaiement = item;
			}       
		}
		$scope.$watch('vm.selectedItemPaiement', function() {
			if (!vm.all_etat_paiement) return;
			vm.all_etat_paiement.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemPaiement.$selected = true;
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
				var jour =date.getDate();
				if(parseInt(jour) <10)
					jour='0' + jour;
				if(parseInt(mois) <10)
					mois='0' + mois;
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
			// Controler le choix du village,la tranche par rapport au fichier excel
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("requete_import/index",
                                                "nomfichier",vm.fichier,
                                                "chemin",vm.repertoire,
                                                "controle",1,
												"id_sous_projet",vm.filtre.id_sous_projet,
												"id_village",vm.filtre.village_id,
												"choix_village",vm.filtre.village,
												"numero_tranche",vm.filtre.numero_tranche,
												"libelle_tranche",vm.filtre.titre,
												"pourcentage",vm.filtre.pourcentage,
												"etape_id",vm.filtre.etape_id
                                                ).then(function(result) {               
					vm.status =  result.data.status ;
					if(vm.status)  {
						vm.affiche_load =false;
						// Après controle sans erreur detecté => place à l'importation dans la BDD
						vm.Importer_paiement_arse();
					} else {
						vm.deja_importe=result.data.retour.deja_importe;
						vm.village_different=result.data.retour.village_different;
						vm.tranche_different=result.data.retour.tranche_different;
						vm.sous_projet_different=result.data.retour.sous_projet_different;
						if(vm.deja_importe.length >0 || vm.village_different.length >0 || vm.tranche_different.length >0 || vm.sous_projet_different.length >0) {
							if(vm.deja_importe.length >0) {
								vm.showAlert('ERREUR IMPORTATION',vm.deja_importe);
							}	
							if(vm.village_different.length >0) {
								vm.showAlert('ERREUR IMPORTATION',vm.village_different);
							}	
							if(vm.tranche_different.length >0) {
								vm.showAlert('ERREUR IMPORTATION',vm.tranche_different);
							}	
							if(vm.sous_projet_different.length >0) {
								vm.showAlert('ERREUR IMPORTATION',vm.sous_projet_different);
							}	
							vm.affiche_load =false;
						} else {
							vm.retour =result.data.retour;
							var mess="Télécharger le fichier puis corriger les erreurs : VOIR LES CELLULES COLORES EN ROUGE";
							vm.affiche_load =false;
							vm.showAlert('ERREUR Import en excel',mess);
							window.location = apiUrlbase + result.data.chemin + result.data.nomfichier;
						}	
					}                      
			});			
		}
		vm.Importer_paiement_arse= function () {
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("requete_import/index",
                                                "nomfichier",vm.fichier,
                                                "chemin",vm.repertoire,
                                                "controle",2,
												"id_sous_projet",vm.filtre.id_sous_projet,
												"etape_id",vm.filtre.etape_id
                                                ).then(function(result) {   
					vm.status =  result.data.status ;
					if(vm.status)  {
						vm.affiche_load =false; 
						vm.all_menage_beneficiaire=result.data.menage;
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
		vm.modifierVillageDetail = function() {
			vm.filtredetail.vague=null;
			vm.filtredetail.zip=null;
			vm.all_village.forEach(function(vil) {
				if(parseInt(vil.id)==parseInt(vm.filtredetail.village_id)) {
					vm.filtredetail.village = vil.Village; 
					vm.filtredetail.vague=vil.vague;
					vm.filtredetail.zip=vil.id_zip;
					vm.nontrouvee=false;
				}
			});			
		}
		
	}
  })();

(function ()
{
    'use strict';
    angular
        .module('app.pfss.suiviactivite.suivi_arse.paiement1.fiche_recepteur')
        .controller('FicherecepteurController', FicherecepteurController);

    /** @ngInject */
    function FicherecepteurController(apiFactory, $state, $mdDialog, $scope,$cookieStore,apiUrlExcel,apiUrlExcelimport,$location) {
		var vm = this;
	   vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        responsive: true
      };

      vm.menage_column = [{titre:"N° Ident"},{titre:"Chef ménage"},{titre:"Recepteur principal"},{titre:"Date naissance"},{titre:"Sexe"},{titre:"Recepteur suppléant"},{titre:"Date naissance"},{titre:"Sexe"}];
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

        vm.nouvelle_element = false ;
        vm.nouvelle_element_individu = false ;
        vm.affichage_masque = false ;
        vm.affichage_masque_individu = false ;
        vm.date_now = new Date() ;
		vm.filtre={};
		
        vm.disable_button = false ;
		
		vm.loc = $location ;
		vm.url=vm.loc.path();
		if(vm.url=='/suivi-activite/arse/premier-fiche-recepteur/fiche-recepteur-1') {
			vm.filtre.titre =" Premier Tranche";
			vm.filtre.numero_tranche =1;
			vm.filtre.sous_projet=" ARSE";
			vm.filtre.etape_id=1;
			vm.filtre.id_sous_projet=2; //ARSE
			apiFactory.getAPIgeneraliserREST("phaseexecution/index","id",1).then(function(result) {
				vm.filtre.montant_a_payer = parseInt(result.data.response[0].indemnite);
				vm.filtre.pourcentage= parseInt(result.data.response[0].pourcentage);
				vm.filtre.tranche= result.data.response[0].Phase;
			});
		}
		if(vm.url=='/suivi-activite/arse/deuxieme-fiche-recepteur/fiche-recepteur-2') {
			vm.filtre.titre =" Deuxième Tranche";
			vm.filtre.numero_tranche =2;
			vm.filtre.sous_projet=" ARSE";
			vm.filtre.etape_id=1;
			vm.filtre.id_sous_projet=2; //ARSE
			apiFactory.getAPIgeneraliserREST("phaseexecution/index","id",2).then(function(result) {
				vm.filtre.montant_a_payer = parseInt(result.data.response[0].indemnite);
				vm.filtre.pourcentage= parseInt(result.data.response[0].pourcentage);
				vm.filtre.tranche= result.data.response[0].Phase;
			});
		}
		if(vm.url=='/suivi-activite/arse/troisieme-fiche-recepteur/fiche-recepteur-3') {
			vm.filtre.titre =" Troisième Tranche";
			vm.filtre.numero_tranche =3;
			vm.filtre.sous_projet=" ARSE";
			vm.filtre.etape_id=1;
			vm.filtre.id_sous_projet=2; //ARSE
			apiFactory.getAPIgeneraliserREST("phaseexecution/index","id",3).then(function(result) {
				vm.filtre.montant_a_payer = parseInt(result.data.response[0].indemnite);
				vm.filtre.pourcentage= parseInt(result.data.response[0].pourcentage);
				vm.filtre.tranche= result.data.response[0].Phase;
			});
		}
		if(vm.url=='/suivi-activite/covid/premier-fiche-recepteur/fiche-recepteur-1') {
			vm.filtre.titre =" Premier Tranche";
			vm.filtre.numero_tranche =1;
			vm.filtre.sous_projet=" COVID-19";
			vm.filtre.etape_id=6;
			vm.filtre.id_sous_projet=4; //COVID
			apiFactory.getAPIgeneraliserREST("phaseexecution/index","id",6).then(function(result) {
				vm.filtre.montant_a_payer = parseInt(result.data.response[0].indemnite);
				vm.filtre.pourcentage= parseInt(result.data.response[0].pourcentage);
				vm.filtre.tranche= result.data.response[0].Phase;
			});
		}
		if(vm.url=='/suivi-activite/covid/deuxieme-fiche-recepteur/fiche-recepteur-2') {
			vm.filtre.titre =" Deuxième Tranche";
			vm.filtre.numero_tranche =2;
			vm.filtre.sous_projet=" COVID-19";
			vm.filtre.etape_id=7;
			vm.filtre.id_sous_projet=4; //COVID
			apiFactory.getAPIgeneraliserREST("phaseexecution/index","id",7).then(function(result) {
				vm.filtre.montant_a_payer = parseInt(result.data.response[0].indemnite);
				vm.filtre.pourcentage= parseInt(result.data.response[0].pourcentage);
				vm.filtre.tranche= result.data.response[0].Phase;
			});
		}
		if(vm.url=='/suivi-activite/covid/troisieme-fiche-recepteur/fiche-recepteur-3') {
			vm.filtre.titre =" Troisième Tranche";
			vm.filtre.numero_tranche =3;
			vm.filtre.sous_projet=" COVID-19";
			vm.filtre.etape_id=8;
			vm.filtre.id_sous_projet=4; //COVID
			apiFactory.getAPIgeneraliserREST("phaseexecution/index","id",8).then(function(result) {
				vm.filtre.montant_a_payer = parseInt(result.data.response[0].indemnite);
				vm.filtre.pourcentage= parseInt(result.data.response[0].pourcentage);
				vm.filtre.tranche= result.data.response[0].Phase;
			});
		}
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
			apiFactory.getAPIgeneraliserREST("requete_export/index","fiche_recepteur",1,"village_id",vm.filtre.village_id,"id_sous_projet",vm.filtre.id_sous_projet).then(function(result) { 
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
			apiFactory.getAPIgeneraliserREST("requete_export/index",
                                                "id_ile",vm.filtre.id_ile,
                                                "id_region",vm.filtre.id_region,                                               
                                                "id_commune",vm.filtre.id_commune,
                                                "village_id",vm.filtre.village_id,
                                                "id_sous_projet",vm.filtre.id_sous_projet,
                                                "fiche_recepteur",1,												
												"titre",vm.filtre.titre,
												"numero_tranche",vm.filtre.numero_tranche,
												"pourcentage",vm.filtre.pourcentage,
                                                "agep_id",vm.filtre.agep_id,
                                                "montant_a_payer",vm.filtre.montant_a_payer,
                                                "etape_id",vm.filtre.etape_id,
                                                "export",1
                                                ).then(function(result) {               
						vm.status =  result.data.status ;
						if(vm.status)  {
							var date_edition=result.data.date_edition;
							var chemin=result.data.chemin;
							var name_file=result.data.name_file;
							// Ménage Apte
							window.location = apiUrlExcel + chemin + name_file;  
							vm.affiche_load =false; 
						} else {
							vm.erreur=true;
							vm.affiche_load =false;
							var message=result.data.message;
							vm.showAlert('Export Fiche recepteru en excel',message);
						}                      
						apiFactory.getAPIgeneraliserREST("requete_export/index",
															"id_ile",vm.filtre.id_ile,
															"id_region",vm.filtre.id_region,                                               
															"id_commune",vm.filtre.id_commune,
															"village_id",vm.filtre.village_id,
															"id_sous_projet",vm.filtre.id_sous_projet,
															"titre",vm.filtre.titre,
															"numero_tranche",vm.filtre.numero_tranche,
															"pourcentage",vm.filtre.pourcentage,
															"agep_id",vm.filtre.agep_id,
															"fiche_paiement_arse",1,
															"montant_a_payer",vm.filtre.montant_a_payer,
															"etape_id",vm.filtre.etape_id,
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

(function ()
{
    'use strict';
    angular
        .module('app.pfss.suiviactivite.suivi_covid.paiement1.etat_paiement')
        .controller('EtatpaiementcovidController', EtatpaiementcovidController);

    /** @ngInject */
    function EtatpaiementcovidController(apiFactory, $state, $mdDialog, $scope,$cookieStore,apiUrlExcel,apiUrlExcelimport) {
		var vm = this;
	   vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        responsive: true
      };

      vm.detail_etat_presence_column = [{titre:"N° Ident"},{titre:"Chef ménage"},{titre:"Travailleur principal"},{titre:"Nb jour"},{titre:"Mont à payer"},{titre:"Travailleur remplacant"},{titre:"Nb jour"},{titre:"Mont à payer"}];
      //initialisation variable
        vm.affiche_load = false ;
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
        vm.all_detail_etatpresence = [] ;

        vm.nouvelle_element = false ;
        vm.nouvelle_element_individu = false ;
        vm.affichage_masque = false ;
        vm.affichage_masque_individu = false ;
        vm.date_now = new Date() ;

        vm.disable_button = false ;
		vm.actualise = false ; 
      //initialisation variable

      //test check radio button

      //fin test check radio button
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
			apiFactory.getAPIgeneraliserREST("requete_export/index","fiche_paiement",1,"village_id",vm.filtre.village_id,"id_sous_projet",vm.filtre.id_sous_projet).then(function(result) { 
				if(result.data.response.length==0) {
					$mdDialog.show(
						$mdDialog.alert()
						.parent(angular.element(document.querySelector('#popupContainer')))
						.clickOutsideToClose(false)
						.parent(angular.element(document.body))
						.title("INFORMATION")
						.textContent("Aucune liste d'état de présence pour le filtre choisi !.")
						.ariaLabel('Information')
						.ok('Fermer')
						.targetEvent()					
					);
				}
					vm.all_etatpresence = result.data.response;    
					vm.affiche_load = false ;
					vm.actualise = true ;
			});
		}
		vm.get_detail_etat_presence =function(id_fichepresence) {
			vm.affiche_load = true ;
			apiFactory.getAPIgeneraliserREST("requete_export/index","detail_etat_presence",1,"id_fichepresence",id_fichepresence).then(function(result) { 
				if(result.data.response.length==0) {
					$mdDialog.show(
						$mdDialog.alert()
						.parent(angular.element(document.querySelector('#popupContainer')))
						.clickOutsideToClose(false)
						.parent(angular.element(document.body))
						.title("INFORMATION")
						.textContent('Aucun détail pour le filtre choisi !.')
						.ariaLabel('Information')
						.ok('Fermer')
						.targetEvent()					
					);
				}
					vm.all_detail_etatpresence = result.data.response;    
					vm.affiche_load = false ;
			});		
		}
		vm.export_excel = function() {
			vm.affiche_load = true ;
			vm.all_detail_etatpresence.forEach(function(lie) {
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
												"id_fichepresence",vm.filtre.id_fichepresence,
                                                "indemnite",vm.filtre.indemnite,
                                                "agep_id",vm.filtre.agep_id,
                                                "detail_etat_presence",1,
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
						if(result.data.fichier1=="OK") {
							window.location = apiUrlExcel + chemin + name_file1; 
						}	
						if(result.data.fichier2=="OK") {						
							window.location = apiUrlExcelimport + chemin + name_file2;  
						}	
						/*Ménage INAPTE*/
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
			if (!vm.all_detail_etatpresence) return;
			vm.all_detail_etatpresence.forEach(function(item) {
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
		vm.getTotalTravailleur = function(){
			var total = 0;
			if(vm.all_detail_etatpresence.length >0) {
				for(var i=0;i < vm.all_detail_etatpresence.length;i++) {
					var product = vm.all_detail_etatpresence[i];
					total += parseFloat(product.travailleurpresent) * vm.filtre.indemnite;
				}
			}	
			return total;
		}		
		vm.getTotalSuppleant = function(){
			var total = 0;
			if(vm.all_detail_etatpresence.length >0) {
				for(var i=0;i < vm.all_detail_etatpresence.length;i++) {
					var product = vm.all_detail_etatpresence[i];
					total += parseFloat(product.suppliantpresent) * vm.filtre.indemnite;
				}
			}	
			return total;
		}		
		
	}
  })();

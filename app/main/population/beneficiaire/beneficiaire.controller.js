(function ()
{
    'use strict';

    angular
        .module('app.population.beneficiaire')
        .controller('BeneficiaireController', BeneficiaireController);

    /** @ngInject */
    function BeneficiaireController($scope, $mdDialog, apiFactory,$state)
    {
        var vm = this;
        vm.ajout = ajout ;
        vm.insert_in_base_individu = insert_in_base_individu ;
        var NouvelItem=false;
        var NouvelItemIndividu=false;
        var currentItem;
        var currentItemIndividu;
        var nomvl='';
        var nomsitep='';
		vm.titrebeneficiaire="Ajout Régistre bénéficiaire";
		vm.titreindividu="Ajout Individu";
        vm.selectedItem = {} ;
        vm.selectedItemIndividu = {} ;
        vm.allpersonnel = [] ;
        vm.allbeneficiaire = [] ;
        vm.allindividu = [] ;
        vm.alltypebeneficiaire = [] ;
        vm.allzone = [] ;
        vm.allregion = [] ;
        vm.alldistrict = [] ;
        vm.allcommune = [] ;
        vm.allfokontany = [] ;

		vm.selectedItemTypelogement = {} ;     
		vm.selectedItemOccupationlogement = {} ;     
		vm.selectedItemRevetementtoit = {} ;     
		vm.selectedItemRevetementsol = {} ;
		vm.selectedItemRevetementmur = {} ;     
		vm.selectedItemSourceeclairage = {} ;     
		vm.selectedItemCombustible = {} ;     
		vm.selectedItemToilette = {} ;     
		vm.selectedItemSourceeau = {} ;     
		vm.selectedItemBienequipement = {} ;     
		vm.selectedItemMoyenproduction = {} ;     
		vm.selectedItemSourcerevenu = {} ;     
		vm.selectedItemElevage = {} ;     
		vm.selectedItemCulture = {} ;     
		vm.selectedItemAliment = {} ;     
		vm.selectedItemStrategiealimentaire = {} ;     
		vm.selectedItemProblememenage = {} ;     
		vm.selectedItemStrategierevenu = {} ;     
		vm.selectedItemActiviterecoursmenage = {} ;     
		vm.selectedItemServicebeneficie = {} ;     
		vm.selectedItemInfrastructure = {} ;     
		vm.selectedItemSourceobtentionaliment = {} ;     
		
		vm.allRecordsTypelogement = [] ;     
		vm.allRecordsOccupationlogement = [] ;     
		vm.allRecordsRevetementtoit = [] ;    
		vm.allRecordsRevetementsol = [] ;     
		vm.allRecordsRevetementmur = [] ;     
		vm.allRecordsSourceeclairage = [] ;     
		vm.allRecordsCombustible = [] ;     
		vm.allRecordsToilette = [] ;     
		vm.allRecordsSourceeau = [] ;     
		vm.allRecordsBienequipement = [] ;     
		vm.allRecordsMoyenproduction = [] ;     
		vm.allRecordsSourcerevenu = [] ;     
		vm.allRecordsElevage = [] ;     
		vm.allRecordsCulture = [] ;     
		vm.allRecordsAliment = [] ;     
		vm.allRecordsStrategiealimentaire = [] ;     
		vm.allRecordsProblememenage = [] ;     
		vm.allRecordsStrategierevenu = [] ;     
		vm.allRecordsActiviterecoursmenage = [] ;     
		vm.allRecordsServicebeneficie = [] ;     
		vm.allRecordsInfrastructure = [] ;     
		vm.allRecordsSourceobtentionaliment = [] ;     
		vm.allRecordsHandicapmoteur = [] ;
		vm.allRecordsHandicapmental = [] ;
		vm.allRecordsHandicapauditif = [] ;
		vm.allRecordsHandicapparole = [] ;
		vm.allRecordsHandicapvisuel = [] ;
		vm.allRecordsLiendeparente = [] ;
		vm.allRecordsTypeecole = [] ;
		vm.allRecordsNiveaudeclasse = [] ;
		vm.allRecordsLangue = [] ;
		vm.allRecordsUsageservicemedical = [] ;
 
		vm.Listesourceeclairage = [];
		vm.Listecombustible = [];
		vm.Listetoilette = [];
		vm.Listesourceeau = [];
		vm.Listebiensequipement = [];
		
		vm.Listemoyenproduction = [];
		vm.Listesourcerevenu = [];
		vm.Listetypeelevage = [];
		vm.Listetypeculture = [];
		vm.Listealiment = [];
		
		vm.Listestrategiealimentaire = [];
		vm.Listeproblemesurrevenu = [];
		vm.Listeactivitederecours= [];
        //variale affichage bouton nouveau
        vm.afficherboutonnouveau = 1 ;
        vm.afficherboutonnouveauIndividu = 1 ;

        //variable cache masque de saisie
        vm.affichageMasque = 0 ;
        vm.affichageMasqueIndividu = 0 ;

        vm.sexes = ("Homme;Femme").split(';').map(function (state)
        {
            return {sexe: state};
        });
        //style
		vm.dtOptions = {
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple',
			autoWidth: false,
			responsive: true
		};
		//col table
		vm.personnel_column = [{titre:"Code unique"},{titre:"Nom & Pénom"},{titre:"Date naissance"},{titre:"Date d'inscription"},{titre:"Type bénéf."}]; // ,{titre:"Fokontany"}
		vm.membre_column = [{titre:"Nom & Pénom"},{titre:"Date naissance"},{titre:"Date d'inscription"},{titre:"Type bénéf."},{titre:"Fokontany"}];
		vm.individu_column = [{titre:"Code"},{titre:"Nom & Pénom"},{titre:"Date naissance"},{titre:"C.I.N"},{titre:"Sexe"},{titre:"Ecole/Langue"},{titre:"Handicap"}];
		apiFactory.getTable("enquete_menage/index","type_eclairage").then(function(result){
			vm.allRecordsSourceeclairage = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","revetement_mur").then(function(result){
			vm.allRecordsRevetementmur = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","revetement_sol").then(function(result){
			vm.allRecordsRevetementsol = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","occupation_logement").then(function(result){
			vm.allRecordsOccupationlogement = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","type_logement").then(function(result){
			vm.allRecordsTypelogement = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","type_culture").then(function(result){
			vm.allRecordsCulture = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","type_elevage").then(function(result){
			vm.allRecordsElevage = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","source_revenu").then(function(result){
			vm.allRecordsSourcerevenu = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","type_moyen_production").then(function(result){
			vm.allRecordsMoyenproduction = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","type_bien_equipement").then(function(result){
			vm.allRecordsBienequipement = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","source_eau").then(function(result){
			vm.allRecordsSourceeau = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","toilette").then(function(result){
			vm.allRecordsToilette = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","combustible").then(function(result){
			vm.allRecordsCombustible = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","infrastructure").then(function(result){
			vm.allRecordsInfrastructure = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","service_beneficie").then(function(result){
			vm.allRecordsServicebeneficie = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","type_engagement_activite").then(function(result){
			vm.allRecordsActiviterecoursmenage = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","type_strategie_face_probleme").then(function(result){
			vm.allRecordsStrategierevenu = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","type_probleme").then(function(result){
			vm.allRecordsProblememenage = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","type_difficulte_alimentaire").then(function(result){
			vm.allRecordsStrategiealimentaire = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","type_aliment").then(function(result){
			vm.allRecordsAliment = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","source_obtention_aliment").then(function(result){
			vm.allRecordsSourceobtentionaliment = result.data.response;
		});    
		apiFactory.getAll("region/index").then(function(result) {
			vm.allregion= result.data.response;
		});
		apiFactory.getAll("fokontany/index").then(function(result) {
			vm.listefokontany= result.data.response;
			apiFactory.getAll("type_beneficiaire/index").then(function(result){
				vm.alltypebeneficiaire = result.data.response;
				console.log(vm.alltypebeneficiaire);
			});
		});
		apiFactory.getAll("menage/index").then(function(result){
			vm.allbeneficiaire = result.data.response;
			console.log(vm.allbeneficiaire);
		});
		apiFactory.getAll("individu/index").then(function(result){
			vm.allindividu = result.data.response;
			console.log(vm.allindividu);
		});
		
		apiFactory.getTable("enquete_menage/index","handicap_moteur").then(function(result){
			vm.allRecordsHandicapmoteur = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","handicap_mental").then(function(result){
			vm.allRecordsHandicapmental = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","handicap_auditif").then(function(result){
			vm.allRecordsHandicapauditif = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","handicap_parole").then(function(result){
			vm.allRecordsHandicapparole = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","handicap_visuel").then(function(result){
			vm.allRecordsHandicapvisuel = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","liendeparente").then(function(result){
			vm.allRecordsLiendeparente = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","niveau_de_classe").then(function(result){
			vm.allRecordsNiveaudeclasse = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","langue").then(function(result){
			vm.allRecordsLangue = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","type_ecole").then(function(result){
			vm.allRecordsTypeecole = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","type_usage_service_medical").then(function(result){
			vm.allRecordsUsageservicemedical = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","type_ecole").then(function(result){
			vm.allRecordsTypeecole = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","niveau_de_classe").then(function(result){
			vm.allRecordsNiveaudeclasse = result.data.response;
		});    
		apiFactory.getTable("enquete_menage/index","langue").then(function(result){
			vm.allRecordsLangue = result.data.response;
		});    
		vm.filtre_district = function() {
			apiFactory.getAPIgeneraliserREST("district/index","cle_etrangere",vm.filtre.id_region).then(function(result) { 
				vm.alldistrict = result.data.response;
			});
		}
		vm.filtre_commune = function() {
			apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtre.id_district).then(function(result) { 
				vm.allcommune = result.data.response;              
			});
		}
		vm.filtre_fokontany = function() {
			apiFactory.getAPIgeneraliserREST("fokontany/index","cle_etrangere",vm.filtre.id_commune).then(function(result) { 
				vm.allfokontany = result.data.response;              
			});
		}
		vm.toggle = function (item, list) {
			var idx = list.indexOf(item);
			if (idx > -1) list.splice(idx, 1);
			else list.push(item);
			console.log(vm.Listemoyenproduction);
			console.log(vm.Listesourcerevenu);
		};

		vm.exists = function (item, list) {
			return list.indexOf(item) > -1;
		};
        //Debut
        function ajout(beneficiaire,suppression) {
            if (NouvelItem==false) {
                test_existance (beneficiaire,suppression); 
            } else {
              
                insert_in_base(beneficiaire,suppression);
            }                                        
        }
        function test_existance (item,suppression) {          
            if (suppression!=1) {
                vm.allbeneficiaire.forEach(function(indic) {               
                  if (indic.id==item.id) {
                      insert_in_base(item,suppression);
                      vm.affichageMasque = 0 ;
                     }
                     else {
                    vm.affichageMasque = 0 ;
                    }
                  
                });
            } else {        
				insert_in_base(item,suppression);
			} 
        } 
        function insert_in_base(beneficiaire,suppression) {
            //add
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            var getId = 0;
            if (NouvelItem==false) {
               getId = vm.selectedItem.id; 
            } 
            var datas = $.param({
                    id:getId,
                    supprimer:suppression,
                    code: beneficiaire.code,
                    nom: beneficiaire.nom,
                    prenom: beneficiaire.prenom,
                    cin: beneficiaire.cin,
                    chef_menage: beneficiaire.chef_menage,
                    adresse: beneficiaire.adresse,
                    date_naissance: beneficiaire.date_naissance,
                    profession: beneficiaire.profession,
                    situation_matrimoniale: beneficiaire.situation_matrimoniale,
                    sexe: beneficiaire.sexe,
                    date_inscription: beneficiaire.date_inscription,
                    revenu_mensuel: beneficiaire.revenu_mensuel,
                    depense_mensuel: beneficiaire.depense_mensuel,
                    id_fokontany: beneficiaire.id_fokontany,
                    id_type_beneficiaire: beneficiaire.id_type_beneficiaire,
            });  
            //factory
            apiFactory.add("menage/index",datas, config).success(function (data) {
				if (NouvelItem == false) {                 
                    // Update or delete: id exclu                    
                    if(suppression==0) { 
						vm.selectedItem.code=beneficiaire.code;
						vm.selectedItem.nom=beneficiaire.nom;                 
						vm.selectedItem.prenom=beneficiaire.prenom;                 
						vm.selectedItem.cin=beneficiaire.cin; 
						vm.selectedItem.chef_menage=beneficiaire.chef_menage;
						vm.selectedItem.adresse=beneficiaire.adresse;
						vm.selectedItem.date_naissance=beneficiaire.date_naissance;
						vm.selectedItem.profession=beneficiaire.profession; 
						vm.selectedItem.situation_matrimoniale=beneficiaire.situation_matrimoniale;  
						vm.selectedItem.sexe=beneficiaire.sexe; 
						vm.selectedItem.date_inscription=beneficiaire.date_inscription; 
						vm.selectedItem.revenu_mensuel=beneficiaire.revenu_mensuel; 
						vm.selectedItem.depense_mensuel=beneficiaire.depense_mensuel; 
						vm.selectedItem.id_fokontany=beneficiaire.fokontany; 
						vm.selectedItem.id_type_beneficiaire=beneficiaire.id_type_beneficiaire; 
						vm.selectedItem.fokontany=beneficiaire.fokontany; 
						vm.selectedItem.type_beneficiaire=beneficiaire.type_beneficiaire; 
						vm.afficherboutonModifSupr = 0 ;
						vm.afficherboutonnouveau = 1 ;
						vm.selectedItem.$selected = false;
						vm.selectedItem ={};
						console.log(beneficiaire);
                    } else {                      
						vm.allbeneficiaire = vm.allbeneficiaire.filter(function(obj) {
							return obj.id !== currentItem.id;
						});
                    }
				} else {                               
                    var item = {
						code: beneficiaire.code,
						nom: beneficiaire.nom,
						prenom:beneficiaire.prenom,
						cin: beneficiaire.cin,
						chef_menage: beneficiaire.chef_menage,
						adresse: beneficiaire.adresse,
						date_naissance: beneficiaire.date_naissance,
						profession: beneficiaire.profession,
						situation_matrimoniale: beneficiaire.situation_matrimoniale,
						sexe: beneficiaire.sexe,
						date_inscription: beneficiaire.date_inscription,
						revenu_mensuel: beneficiaire.revenu_mensuel,
						depense_mensuel: beneficiaire.depense_mensuel,
						id_fokontany: beneficiaire.id_fokontany,
						id_type_beneficiaire: beneficiaire.id_type_beneficiaire,
						fokontany: beneficiaire.fokontany,
						type_beneficiaire: beneficiaire.type_beneficiaire,
						id:String(data.response) ,
					};
					vm.allbeneficiaire.push(item); 
                    NouvelItem=false;
				}
                  vm.affichageMasque = 0 ;
			})
        }
        //Fin
		function test_sexe(stp) {
			switch (stp) {
				case "1": {
					return 1 ;
					break ;
				}
				case "0": {
					return 0 ;
					break ;
				}
			}
		}
		function formatDate(date) {
			var mois = date.getMonth()+1;
			var dateSQL = (date.getFullYear()+"/"+mois+"/"+date.getDate());
			return dateSQL;
		}
		function parseDate(date) {
			var d = moment(date, 'YYYY-MM-DD', true);
			return d.isValid() ? d.toDate() : new Date(NaN);
		}
        function affichage_sexe(stp) {
            var s = (stp);          
            switch (s) {
                case "1": {
                    return "Homme" ;
                    break ;
                }
                case "0": {
                    return "Femme" ;
                    break ;
                }
                default: {
                  return "???" ;
                  break;
                }                          
            }
        }
		function affichage_editsexe(stp) {
            var s = (stp);         
            switch (s) {
                case "1": {
                    return 1 ;
                    break ;
                }
                case "0":  {
                    return 0 ;
                    break ;
                }
                default: {
                  return "???" ;
                  break;
                }                        
            }
        }
		//Début bénéficiaire
		vm.selection= function (item) {     
            vm.selectedItem = item;
            vm.nouvelItem = item;
            currentItem = JSON.parse(JSON.stringify(vm.selectedItem));       
            vm.afficherboutonModifSupr = 1 ;
            vm.affichageMasque = 0 ;
            vm.afficherboutonnouveau = 1 ;
            NouvelItem=false;
        };
        $scope.$watch('vm.selectedItem', function() {
			if (!vm.allbeneficiaire) return;
			vm.allbeneficiaire.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
        });
        vm.ajouter = function () {
			vm.titrebeneficiaire="Ajout Régistre bénéficiaire";
			vm.selectedItem.$selected = false;
			vm.affichageMasque = 1 ;
			vm.beneficiaire.code='';
			vm.beneficiaire.nom='';
			vm.beneficiaire.prenom='';
			vm.beneficiaire.cin='';
			vm.beneficiaire.chef_menage=0;
			vm.beneficiaire.adresse='';
			vm.beneficiaire.date_naissance='';
			vm.beneficiaire.profession='';
			vm.beneficiaire.situation_matrimoniale='';
			vm.beneficiaire.sexe='';
			vm.beneficiaire.date_inscription='';
			vm.beneficiaire.revenu_mensuel='';
			vm.beneficiaire.depense_mensuel='';
			vm.beneficiaire.id_fokontany='';
			vm.beneficiaire.id_type_beneficiaire='';
			NouvelItem = true ;
        };
        vm.annuler = function() {
			vm.selectedItem = {} ;
			vm.selectedItem.$selected = false;
			vm.affichageMasque = 0 ;
			vm.afficherboutonnouveau = 1 ;
			vm.afficherboutonModifSupr = 0 ;
			NouvelItem = false;
        };
		vm.modifier = function() {
			vm.titrebeneficiaire="Modification Régistre bénéficiaire";
			NouvelItem = false ;
			vm.affichageMasque = 1 ;
			vm.beneficiaire.code = vm.selectedItem.code ;
			vm.beneficiaire.nom = vm.selectedItem.nom ;
			vm.beneficiaire.prenom=vm.selectedItem.prenom;
			vm.beneficiaire.cin = vm.selectedItem.cin ;
			if(vm.selectedItem.chef_menage) {
				vm.beneficiaire.chef_menage=parseInt(vm.selectedItem.chef_menage);
			}
			vm.beneficiaire.adresse = vm.selectedItem.adresse ;
			if(vm.selectedItem.date_naissance) {
				vm.beneficiaire.date_naissance=new Date(vm.selectedItem.date_naissance);
			}
			vm.beneficiaire.profession = vm.selectedItem.profession ;
			vm.beneficiaire.situation_matrimoniale = vm.selectedItem.situation_matrimoniale ;
			vm.beneficiaire.sexe = vm.selectedItem.sexe ;
			if(vm.selectedItem.date_inscription) {
				vm.beneficiaire.date_inscription=new Date(vm.selectedItem.date_inscription);
			}
			if(vm.selectedItem.revenu_mensuel) {
				vm.beneficiaire.revenu_mensuel=parseFloat(vm.selectedItem.revenu_mensuel);
			}
			if(vm.selectedItem.depense_mensuel) {
				vm.beneficiaire.depense_mensuel=parseFloat(vm.selectedItem.depense_mensuel);
			}
			vm.beneficiaire.id_fokontany = vm.selectedItem.id_fokontany ;
			vm.beneficiaire.id_type_beneficiaire = vm.selectedItem.id_type_beneficiaire ;
			vm.beneficiaire.id = vm.selectedItem.id ;
			vm.afficherboutonModifSupr = 0;
			vm.afficherboutonnouveau = 0;  
        };
		vm.supprimer = function() {
			NouvelItem = false ;
			vm.affichageMasque = 0 ;
			vm.afficherboutonModifSupr = 0 ;
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('ok')
                .cancel('annuler');

			$mdDialog.show(confirm).then(function() {           
				ajout(vm.selectedItem,1);
			}, function() {
            //alert('rien');
			});
        };		
		//Début individu
        function insert_in_base_individu(individu,suppression) {
            //add
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            var getId = 0;
            if (NouvelItemIndividu==false) {
               getId = vm.selectedItemIndividu.id; 
            } 
            var datas = $.param({
                    id:getId,
                    supprimer:suppression,
                    id_menage:individu.id_menage,
                    code: individu.code,
                    nom: individu.nom,
                    prenom: individu.prenom,
                    cin: individu.cin,
                    date_naissance: individu.date_naissance,
                    sexe: individu.sexe,
                    id_handicap_visuel: individu.id_handicap_visuel,
                    id_handicap_parole: individu.id_handicap_parole,
                    id_handicap_auditif: individu.id_handicap_auditif,
                    id_handicap_mental: individu.id_handicap_mental,
                    id_handicap_moteur: individu.id_handicap_moteur,
                    id_type_ecole: individu.id_type_ecole,
                    id_niveau_de_classe: individu.id_niveau_de_classe,
                    id_langue: individu.id_langue,
            });  
            //factory
            apiFactory.add("individu/index",datas, config).success(function (data) {
				if (NouvelItem == false) {                 
                    // Update or delete: id exclu                    
                    if(suppression==0) { 
						vm.selectedItemIndividu.id_menage=individu.id_menage;
						vm.selectedItemIndividu.code=individu.code;
						vm.selectedItemIndividu.nom=individu.nom;                 
						vm.selectedItemIndividu.prenom=individu.prenom;                 
						vm.selectedItemIndividu.cin=individu.cin; 
						vm.selectedItemIndividu.date_naissance=individu.date_naissance;
						vm.selectedItemIndividu.handicap_visuel=individu.handicap_visuel;
						vm.selectedItemIndividu.id_handicap_visuel=individu.id_handicap_visuel;
						vm.selectedItemIndividu.handicap_parole=individu.handicap_parole;
						vm.selectedItemIndividu.id_handicap_parole=individu.id_handicap_parole;
						vm.selectedItemIndividu.handicap_auditif=individu.handicap_auditif;
						vm.selectedItemIndividu.id_handicap_auditif=individu.id_handicap_auditif;
						vm.selectedItemIndividu.id_handicap_mental=individu.id_handicap_mental;
						vm.selectedItemIndividu.handicap_mental=individu.handicap_mental;
						vm.selectedItemIndividu.handicap_moteur=individu.handicap_moteur;
						vm.selectedItemIndividu.id_handicap_moteur=individu.id_handicap_moteur;
						vm.selectedItemIndividu.type_ecole=individu.type_ecole;
						vm.selectedItemIndividu.id_type_ecole=individu.id_type_ecole;
						vm.selectedItemIndividu.id_niveau_de_classe=individu.id_niveau_de_classe;
						vm.selectedItemIndividu.niveau_de_classe=individu.niveau_de_classe;
						vm.selectedItemIndividu.id_langue=individu.id_langue;
						vm.selectedItemIndividu.langue=individu.langue;
						vm.selectedItem.sexe=individu.sexe; 
						vm.afficherboutonModifSuprIndividu = 0 ;
						vm.afficherboutonnouveauIndividu = 1 ;
						vm.selectedItemIndividu.$selected = false;
						vm.selectedItemIndividu ={};
						console.log(individu);
                    } else {                      
						vm.allindividu = vm.allindividu.filter(function(obj) {
							return obj.id !== currentItemIndividu.id;
						});
                    }
				} else {                               
                    var item = {
						id_menage: individu.id_menage,
						code: individu.code,
						nom: individu.nom,
						prenom:individu.prenom,
						cin: individu.cin,
						date_naissance: individu.date_naissance,
						sexe: individu.sexe,
						handicap_visuel: individu.ihandicap_visuel,
						id_handicap_visuel: individu.id_handicap_visuel,
						handicap_parole: individu.handicap_parole,
						id_handicap_parole: individu.id_handicap_parole,
						handicap_auditif: individu.handicap_auditif,
						id_handicap_auditif: individu.id_handicap_auditif,
						handicap_mental: individu.handicap_mental,
						id_handicap_mental: individu.id_handicap_mental,
						handicap_moteur: individu.handicap_moteur,
						id_handicap_moteur: individu.id_handicap_moteur,
						id_type_ecole: individu.id_type_ecole,
						id_niveau_de_classe: individu.id_niveau_de_classe,
						id_langue: individu.id_langue,
						id:String(data.response) ,
					};
					vm.allindividu.push(item); 
                    NouvelItemIndividu=false;
				}
                  vm.affichageMasqueIndividu = 0 ;
			})
        }
		vm.selectionIndividu= function (item) {     
            vm.selectedItemIndividu = item;
            currentItemIndividu = JSON.parse(JSON.stringify(vm.selectedItemIndividu));       
            vm.afficherboutonModifSuprIndividu = 1 ;
            vm.affichageMasqueIndividu = 0 ;
            vm.afficherboutonnouveauIndividu = 1 ;
            NouvelItemIndividu=false;
        };
        $scope.$watch('vm.selectedItemIndividu', function() {
			if (!vm.allindividu) return;
			vm.allindividu.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemIndividu.$selected = true;
        });
        vm.ajouterIndividu = function () {
			vm.titreindividu="Ajout Individu";
			vm.selectedItemIndividu.$selected = false;
			vm.affichageMasqueIndividu = 1 ;
			vm.individu.id_menage=vm.selectedItem.id;
			vm.individu.code='';
			vm.individu.nom='';
			vm.individu.prenom='';
			vm.individu.cin='';
			vm.individu.date_naissance='';
			vm.individu.sexe='';
			vm.individu.id_handicap_auditif=null;
			vm.individu.id_handicap_mental=null;
			vm.individu.id_handicap_moteur=null;
			vm.individu.id_handicap_parole=null;
			vm.individu.id_handicap_visuel=null;
			vm.individu.id_type_ecole=null;
			vm.individu.id_niveau_de_classe=null;
			vm.individu.id_langue=null;
			NouvelItemIndividu = true ;
        };
        vm.annulerIndividu = function() {
			vm.selectedItemIndividu = {} ;
			vm.selectedItemIndividu.$selected = false;
			vm.affichageMasqueIndividu = 0 ;
			vm.afficherboutonnouveauIndividu = 1 ;
			vm.afficherboutonModifSuprIndividu = 0 ;
			NouvelItemIndividu = false;
        };
		vm.modifierIndividu = function() {
			vm.titreindividu="Modification Individu";
			NouvelItemIndividu = false ;
			vm.affichageMasqueIndividu = 1 ;
			vm.individu.id_menage = vm.selectedItemIndividu.id_menage ;
			vm.individu.code = vm.selectedItemIndividu.code ;
			vm.individu.nom = vm.selectedItemIndividu.nom ;
			vm.individu.prenom=vm.selectedItemIndividu.prenom;
			vm.individu.cin = vm.selectedItemIndividu.cin ;
			if(vm.selectedItemIndividu.date_naissance) {
				vm.individu.date_naissance=new Date(vm.selectedItemIndividu.date_naissance);
			}
			if(vm.selectedItemIndividu.id_handicap_visuel) {
				vm.individu.id_handicap_visuel=parseInt(vm.selectedItemIndividu.id_handicap_visuel);
			}
			if(vm.selectedItemIndividu.id_handicap_parole) {
				vm.individu.id_handicap_parole=parseInt(vm.selectedItemIndividu.id_handicap_parole);
			}
			if(vm.selectedItemIndividu.id_handicap_auditif) {
				vm.individu.id_handicap_auditif=parseInt(vm.selectedItemIndividu.id_handicap_auditif);
			}
			if(vm.selectedItemIndividu.id_handicap_mental) {
				vm.individu.id_handicap_mental=parseInt(vm.selectedItemIndividu.id_handicap_mental);
			}
			if(vm.selectedItemIndividu.id_handicap_moteur) {
				vm.individu.id_handicap_moteur=parseInt(vm.selectedItemIndividu.id_handicap_moteur);
			}
			if(vm.selectedItemIndividu.id_type_ecole) {
				vm.individu.id_type_ecole=parseInt(vm.selectedItemIndividu.id_type_ecole);
			}
			if(vm.selectedItemIndividu.id_niveau_de_classe) {
				vm.individu.id_niveau_de_classe=parseInt(vm.selectedItemIndividu.id_niveau_de_classe);
			}
			if(vm.selectedItemIndividu.id_langue) {
				vm.individu.id_langue=parseInt(vm.selectedItemIndividu.id_langue);
			}
			vm.individu.sexe = vm.selectedItemIndividu.sexe ;
			vm.individu.id = vm.selectedItemIndividu.id ;
			vm.afficherboutonModifSuprIndividu = 0;
			vm.afficherboutonnouveauIndividu = 0;  
        };
		vm.supprimerIndividu = function() {
			NouvelItemIndividu = false ;
			vm.affichageMasqueIndividu = 0 ;
			vm.afficherboutonModifSuprIndividu = 0 ;
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('ok')
                .cancel('annuler');

			$mdDialog.show(confirm).then(function() {           
				ajout(vm.selectedItemIndividu,1);
			}, function() {
            //alert('rien');
			});
        };		
        vm.modifierFokontany = function (item) { 
			vm.nontrouvee=true;
			vm.listefokontany.forEach(function(fkt) {
				if(fkt.id==item.id_fokontany) {
					vm.beneficiaire.id_fokontany = fkt.id; 
					vm.beneficiaire.fokontany=[];
					var itemss = {
						id: fkt.id,
						fokontany: fkt.code,
						id_commune: fkt.id_commune,
						code: fkt.code,
					};
					vm.beneficiaire.fokontany.push(itemss);
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.beneficiaire.id_fokontany = ''; 
					vm.beneficiaire.fokontany=[];
			}
		}
        vm.modifierTypeBeneficiaire = function (item) { 
			vm.nontrouvee=true;
			vm.alltypebeneficiaire.forEach(function(benef) {
				if(benef.id==item.id_type_beneficiaire) {
					vm.beneficiaire.id_type_beneficiaire = benef.id; 
					vm.beneficiaire.type_beneficiaire=[];
					var itemss = {
						id: benef.id,
						code: benef.code,
						description: benef.description,
					};
					vm.beneficiaire.type_beneficiaire.push(itemss);
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.beneficiaire.id_type_beneficiaire = ''; 
					vm.beneficiaire.type_beneficiaire=[];
			}
		}
        vm.modifierHandicapvisuel = function (item) { 
			vm.nontrouvee=true;
			vm.allRecordsHandicapvisuel.forEach(function(benef) {
				if(benef.id==item.id_handicap_visuel) {
					vm.individu.id_handicap_visuel = benef.id; 
					vm.individu.handicap_visuel=[];
					var itemss = {
						id: benef.id,
						code: benef.code,
						description: benef.description,
					};
					vm.individu.handicap_visuel.push(itemss);
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.individu.id_handicap_visuel = ''; 
					vm.individu.handicap_visuel=[];
			}
		}
        vm.modifierHandicapparole = function (item) { 
			vm.nontrouvee=true;
			vm.allRecordsHandicapparole.forEach(function(benef) {
				if(benef.id==item.id_handicap_parole) {
					vm.individu.id_handicap_parole = benef.id; 
					vm.individu.handicap_parole=[];
					var itemss = {
						id: benef.id,
						code: benef.code,
						description: benef.description,
					};
					vm.individu.handicap_parole.push(itemss);
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.individu.id_handicap_parole = ''; 
					vm.individu.handicap_parole=[];
			}
		}
        vm.modifierHandicapauditif = function (item) { 
			vm.nontrouvee=true;
			vm.allRecordsHandicapauditif.forEach(function(benef) {
				if(benef.id==item.id_handicap_auditif) {
					vm.individu.id_handicap_auditif = benef.id; 
					vm.individu.handicap_auditif=[];
					var itemss = {
						id: benef.id,
						code: benef.code,
						description: benef.description,
					};
					vm.individu.handicap_auditif.push(itemss);
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.individu.id_handicap_auditif = ''; 
					vm.individu.handicap_auditif=[];
			}
		}
        vm.modifierHandicapmental = function (item) { 
			vm.nontrouvee=true;
			vm.allRecordsHandicapmental.forEach(function(benef) {
				if(benef.id==item.id_handicap_mental) {
					vm.individu.id_handicap_mental = benef.id; 
					vm.individu.handicap_mental=[];
					var itemss = {
						id: benef.id,
						code: benef.code,
						description: benef.description,
					};
					vm.individu.handicap_mental.push(itemss);
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.individu.id_handicap_mental = ''; 
					vm.individu.handicap_mental=[];
			}
		}
        vm.modifierHandicapmoteur = function (item) { 
			vm.nontrouvee=true;
			vm.allRecordsHandicapmoteur.forEach(function(benef) {
				if(benef.id==item.id_handicap_moteur) {
					vm.individu.id_handicap_moteur = benef.id; 
					vm.individu.handicap_moteur=[];
					var itemss = {
						id: benef.id,
						code: benef.code,
						description: benef.description,
					};
					vm.individu.handicap_moteur.push(itemss);
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.individu.id_handicap_moteur = ''; 
					vm.individu.handicap_moteur=[];
			}
		}
        vm.modifierTypeecole = function (item) { 
			vm.nontrouvee=true;
			vm.allRecordsTypeecole.forEach(function(benef) {
				if(benef.id==item.id_type_ecole) {
					vm.individu.id_type_ecole = benef.id; 
					vm.individu.type_ecole=[];
					var itemss = {
						id: benef.id,
						code: benef.code,
						description: benef.description,
					};
					vm.individu.type_ecole.push(itemss);
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.individu.id_type_ecole = ''; 
					vm.individu.type_ecole=[];
			}
		}
        vm.modifierNiveaudeclasse = function (item) { 
			vm.nontrouvee=true;
			vm.allRecordsNiveaudeclasse.forEach(function(benef) {
				if(benef.id==item.id_niveau_de_classe) {
					vm.individu.id_niveau_de_classe = benef.id; 
					vm.individu.niveau_de_classe=[];
					var itemss = {
						id: benef.id,
						code: benef.code,
						description: benef.description,
					};
					vm.individu.niveau_de_classe.push(itemss);
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.individu.id_niveau_de_classe = ''; 
					vm.individu.niveau_de_classe=[];
			}
		}
        vm.modifierLangue = function (item) { 
			vm.nontrouvee=true;
			vm.allRecordsLangue.forEach(function(benef) {
				if(benef.id==item.id_langue) {
					vm.individu.id_langue = benef.id; 
					vm.individu.langue=[];
					var itemss = {
						id: benef.id,
						code: benef.code,
						description: benef.description,
					};
					vm.individu.langue.push(itemss);
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.individu.id_langue = ''; 
					vm.individu.langue=[];
			}
		}
    }
})();

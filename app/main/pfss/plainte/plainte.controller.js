(function ()
{
    'use strict';
    angular
        .module('app.pfss.plainte')
		// Directive et service pour upload fichier excel intervention
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
							console.log(element[0].files[0]);
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
				console.log(file);
				$http.post(uploadUrl, fd,{
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				}).success(function(){
					console.log('tafa');
				}).error(function(){
					console.log('Rivotra');
				});
			}
		}])
        .controller('PlainteController', PlainteController);
    /** @ngInject */
    function PlainteController(apiFactory, $state, $scope,$cookieStore, $mdDialog,DTOptionsBuilder,apiUrl,$http,fileUpload,apiUrlbase,apiUrlrecommandation,serveur_central)  {
		// Déclaration variable
        var vm = this;
        var NouvelItem=false;
        var currentItem;
        var typeact="";
        var NouvelPlainteItem=false;
        var  currentPlainteItem;
		vm.serveur_central =serveur_central;
        vm.selectedPlainteItem={};
        vm.myFile={};
        vm.parent_courant={};
        vm.etat="";
        vm.fichier="";
		vm.directoryName='';
        vm.typeact={};
        vm.selectedItem = {} ;
        vm.selectedcourant={};
        vm.ajout = ajout ;
        //variale affichage bouton nouveau
        vm.afficherboutonnouveau = 1 ;
        //variable cache masque de saisie
        //fin pour les sous tâches
        vm.allActivite = [] ;
        vm.allPlainte = [] ;
        vm.allParent = [] ;
        vm.ListeParent = [] ;
		vm.all_type_plainte=[];
		vm.all_resultat_plainte=[];
		vm.allProtection_sociale =[];
		vm.affiche_load=false;
		vm.saisie={};
		vm.affichage_masque=false;
        // Data
        vm.dtOptions = {
        dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth : false,
        responsive: true
        };
        // vm.activite_col = [{"titre":"Type de document"}];
        vm.col_plainte = [{"titre":"Village"},{"titre":"Cellule"},{"titre":"Type"},{"titre":"Résultat"},{"titre":"Objet"},{"titre":"Date dépot"},{"titre":"Réf"},{"titre":"Nom"},{"titre":"Adresse"},{"titre":"Date résolution"}];           
        var id_user = $cookieStore.get('id');
		vm.utilisateur_id = id_user;
		console.log(vm.utilisateur_id);
		// Début Récupération données référentielles
        apiFactory.getOne("utilisateurs/index", id_user).then(function(result) {
			vm.nomutilisateur = result.data.response.prenom + ' ' + result.data.response.nom;
        });  
        apiFactory.getAll("type_plainte/index").then(function(result) {
			vm.all_type_plainte = result.data.response;
        });  
        apiFactory.getAll("resultat_plainte/index").then(function(result) {
			vm.all_resultat_plainte = result.data.response;
        });  
		apiFactory.getAll("protection_sociale/index").then(function(result){
			vm.allProtection_sociale = result.data.response;
		});    
        apiFactory.getAll("ile/index").then(function(result)
        { 
          vm.all_ile = result.data.response;    
          
        });	
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
		vm.filtrer = function()
      {
        vm.affiche_load = true ;
      	apiFactory.getAPIgeneraliserREST("plainte/index","cle_etrangere",vm.filtre.village_id).then(function(result)
        { 
          vm.allPlainte = result.data.response;    
          vm.affiche_load = false ;
		  console.log(vm.allPlainte);
        });
      }

		// apiFactory.getAll("plainte/index").then(function(result) {
			// vm.allPlainte = result.data.response;
		// });               
		// Fin Récupération données référentielles
		// Message box : alert, information
        vm.showAlert = function(titre,textcontent) {
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(false)
                .parent(angular.element(document.body))
                .title(titre)
                .textContent(textcontent)
                .ariaLabel('Alert Dialog Demo')
                .ok('Fermer')
                .targetEvent()
            );
        } 
		// Fonction Insertion,modif,suppression table
        function ajout(activite,suppression) {
            if (NouvelItem==false) {
                insert_in_base(activite,suppression); 
            } else {
                insert_in_base(activite,suppression);
            }
        }
        function insert_in_base(activite,suppression) {         
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
                supprimer:vm.saisie.supprimer,
                id:getId,
                id_serveur_centrale:vm.saisie.id_serveur_centrale,
                menage_id:vm.saisie.menage_id,
                activite_id:vm.saisie.activite_id,
                cellulederecours_id:vm.saisie.cellulederecours_id,
                typeplainte_id:vm.saisie.typeplainte_id,
                solution_id:vm.saisie.solution_id,
                village_id:vm.saisie.village_id,
                programme_id:vm.saisie.programme_id,
                datedepot:vm.saisie.datedepot,
                reference:vm.saisie.reference,
                Objet:vm.saisie.Objet,
                nomplaignant:vm.saisie.nomplaignant,
                adresseplaignant:vm.saisie.adresseplaignant,
                responsableenregistrement:vm.saisie.responsableenregistrement,
                mesureprise:vm.saisie.mesureprise,
                dateresolution:vm.saisie.dateresolution,
                statut:vm.saisie.statut,
                a_ete_modifie:vm.saisie.a_ete_modifie,
                supprime:vm.saisie.supprime,
                userid:vm.saisie.userid,
                datemodification:vm.saisie.datemodification,
            });
            //factory
            apiFactory.add("plainte/index",datas, config).success(function (data) {
                if (NouvelItem == false) {
                    // Update or delete: id exclu                  
                    if(suppression==0) {
                        vm.afficherboutonModifSupr = 0 ;
                        vm.afficherboutonnouveau = 1 ;
                } else {
                    var item = {						
						id:String(data.response),
						id_serveur_centrale:vm.saisie.id_serveur_centrale,
						menage_id:vm.saisie.menage_id,
						activite_id:vm.saisie.activite_id,
						cellulederecours_id:vm.saisie.cellulederecours_id,
						typeplainte_id:vm.saisie.typeplainte_id,
						solution_id:vm.saisie.solution_id,
						village_id:vm.saisie.village_id,
						programme_id:vm.saisie.programme_id,
						datedepot:vm.saisie.datedepot,
						reference:vm.saisie.reference,
						Objet:vm.saisie.Objet,
						nomplaignant:vm.saisie.nomplaignant,
						adresseplaignant:vm.saisie.adresseplaignant,
						responsableenregistrement:vm.saisie.responsableenregistrement,
						mesureprise:vm.saisie.mesureprise,
						dateresolution:vm.saisie.dateresolution,
						statut:vm.saisie.statut,
						a_ete_modifie:vm.saisie.a_ete_modifie,
						supprime:vm.saisie.supprime,
						userid:vm.saisie.userid,
						datemodification:vm.saisie.datemodification,
                    };     
                    vm.allPlainte.push(item);
                }
              }
            }).error(function (data) {                  
                vm.showAlert('Erreur de saisie','Veuillez saisir les champs manquants !');
            });              
        }  
      //*****************************************************************     
		// Clic sur un item plainte
        vm.selectionPlainte= function (item) {
            vm.selectedPlainteItem = item;
            currentPlainteItem = JSON.parse(JSON.stringify(vm.selectedPlainteItem));
        };
		// $watch pour sélectionner ou désélectionner automatiquement un item plainte
        $scope.$watch('vm.selectedPlainteItem', function() {
			if (!vm.selectedPlainteItem) return;
			vm.allPlainte.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedPlainteItem.$selected = true;
        });
		// Upload fichier attaché envoyé par l'utilisateur
		$scope.uploadFile = function(event){
			var files = event.target.files;
			vm.myFile=files;               
		};
		// Ajout d'un nouvel item plainte
        vm.ajouterPlainte = function () {
            vm.selectedPlainteItem.$selected = false;
            NouvelPlainteItem = true ;
				vm.saisie.supprimer=0;
				vm.saisie.id=0;
				vm.saisie.id_serveur_centrale=null;
				vm.saisie.menage_id=null;
				vm.saisie.activite_id=null;
				vm.saisie.cellulederecours_id=null;
				vm.saisie.typeplainte_id=null;
				vm.saisie.solution_id=null;
                vm.saisie.village_id=null;
                vm.saisie.programme_id=null;
                vm.saisie.Objet=null;
				vm.saisie.datedepot=new Date();		
				vm.saisie.reference=null;		
				vm.saisie.nomplaignant=null;		
				vm.saisie.adresseplaignant=null;		
				vm.saisie.responsableenregistrement=null;		
				vm.saisie.mesureprise=null;	
				vm.saisie.dateresolution=null;		
				vm.saisie.statut=null;		
				vm.saisie.a_ete_modifie=0;		
				vm.saisie.supprime=0;		
				vm.saisie.userid=null;		
				vm.saisie.datemodification=null;		
			vm.affichage_masque=true;
		}
		// Annulation modification d'un item  plainte
		vm.annulerPlainte = function(item) {
			vm.selectedPlainteItem={};
			vm.selectedPlainteItem.$selected = false;
			NouvelPlainteItem = false;
			vm.affichage_masque=false;
        };
		// Suppression d'un item plainte
		vm.supprimerPlainte = function(item) {
            vm.selectedptaItem=item;
            var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('ok')
                .cancel('annuler');
            $mdDialog.show(confirm).then(function() {
				vm.sauverPlainte(vm.selectedPlainteItem,1);
            }, function() {
             //alert('rien');
            });
        };
		// Modification d'un item plainte
		vm.modifierPlainte = function() {
 				// vm.saisie.supprimer=0;
				vm.saisie.id=vm.selectedPlainteItem.id;
				vm.saisie.id_serveur_centrale=vm.selectedPlainteItem.id_serveur_centrale;
				vm.saisie.menage_id=vm.selectedPlainteItem.menage_id;
				vm.saisie.activite_id=vm.selectedPlainteItem.activite_id;
				if(vm.selectedPlainteItem.cellulederecours_id) { 
					vm.saisie.cellulederecours_id=parseInt(vm.selectedPlainteItem.cellulederecours_id);
				} 
				if(vm.selectedPlainteItem.cellulederecours_id) { 
					vm.saisie.typeplainte_id=parseInt(vm.selectedPlainteItem.typeplainte_id);
				}	
				vm.saisie.solution_id=vm.selectedPlainteItem.solution_id;
                vm.saisie.village_id=vm.filtre.village_id;
                vm.saisie.programme_id=vm.selectedPlainteItem.programme_id;
                vm.saisie.Objet=vm.selectedPlainteItem.Objet;
				if(vm.selectedPlainteItem.datedepot) { 
					vm.saisie.datedepot=new Date(vm.selectedPlainteItem.datedepot);	
				}				
				vm.saisie.reference=vm.selectedPlainteItem.reference;		
				vm.saisie.nomplaignant=vm.selectedPlainteItem.nomplaignant;		
				vm.saisie.adresseplaignant=vm.selectedPlainteItem.adresseplaignant;		
				vm.saisie.responsableenregistrement=vm.selectedPlainteItem.responsableenregistrement;		
				vm.saisie.mesureprise=vm.selectedPlainteItem.mesureprise;	
				if(vm.selectedPlainteItem.dateresolution) { 
					vm.saisie.dateresolution=new Date(vm.selectedPlainteItem.dateresolution);
				}	
				if(vm.selectedPlainteItem.statut) { 
					vm.saisie.statut=parseInt(vm.selectedPlainteItem.statut);		
				}	
				vm.saisie.a_ete_modifie=0;		
				vm.saisie.supprime=0;		
				vm.saisie.userid=vm.selectedPlainteItem.userid;		
				if(vm.selectedPlainteItem.datemodification) { 
					vm.saisie.datemodification=new Date(vm.selectedPlainteItem.datemodification);	
				}	
            NouvelPlainteItem = false ;
			vm.affichage_masque=true;
        };
		// Sauvegarde dans la BDD la liste des documents
		vm.sauverPlainte = function (item,suppression) {
			console.log(JSON.stringify(vm.selectedPlainteItem));
			var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            var getId = 0;
			var modifie=0;
            if (NouvelPlainteItem==false) {
               getId = vm.selectedPlainteItem.id; 
			   modifie=1;
            } 
			
			// var rep = apiUrlbase + apiUrlrecommandation + vm.site.toLowerCase()  ;
			var rep = apiUrlbase + apiUrlrecommandation ;
			vm.directoryName=rep;
            var datas = $.param({
                supprimer:suppression,
                id:getId,
                id_serveur_centrale: vm.saisie.id_serveur_centrale,
                menage_id: vm.saisie.menage_id,            
                activite_id: vm.saisie.activite_id,            
                cellulederecours_id: vm.saisie.cellulederecours_id,            
                typeplainte_id: vm.saisie.typeplainte_id,            
                solution_id: vm.saisie.solution_id,            
                village_id: vm.filtre.village_id,            
                programme_id: vm.saisie.programme_id,            
                Objet: vm.saisie.Objet,            
                datedepot: vm.saisie.datedepot,            
                reference: vm.saisie.reference,            
                nomplaignant: vm.saisie.nomplaignant,            
                adresseplaignant: vm.saisie.adresseplaignant,            
                responsableenregistrement: vm.saisie.responsableenregistrement,            
                mesureprise: vm.saisie.mesureprise,            
                dateresolution: vm.saisie.dateresolution,            
                statut: vm.saisie.statut,            
                a_ete_modifie: modifie,            
                supprime: 0,            
                userid: vm.saisie,            
                datemodification: vm.saisie.datemodification,             				
           });
            apiFactory.add("plainte/index",datas, config).success(function (data) {
                if (NouvelPlainteItem == false) {
                    vm.selectedPlainteItem.nom_fichier=vm.fichier;
                    if(suppression==0) {
						vm.selectedPlainteItem.id=getId;
						vm.selectedPlainteItem.id_serveur_centrale= vm.saisie.id_serveur_centrale;
						vm.selectedPlainteItem.menage_id= vm.saisie.menage_id;            
						vm.selectedPlainteItem.activite_id= vm.saisie.activite_id;          
						vm.selectedPlainteItem.cellulederecours_id= vm.saisie.cellulederecours_id;           
						vm.selectedPlainteItem.code= vm.saisie.code;           
						vm.selectedPlainteItem.typeplainte_id= vm.saisie.typeplainte_id;  
						vm.selectedPlainteItem.type_plainte= vm.saisie.type_plainte;  
						vm.selectedPlainteItem.solution_id= vm.saisie.solution_id;      
						vm.selectedPlainteItem.resultat_plainte= vm.saisie.resultat_plainte;      
						vm.selectedPlainteItem.village_id= vm.filtre.village_id;          
						vm.selectedPlainteItem.programme_id= vm.saisie.programme_id;            
						vm.selectedPlainteItem.Objet= vm.saisie.Objet;            
						vm.selectedPlainteItem.datedepot= vm.saisie.datedepot            
						vm.selectedPlainteItem.reference= vm.saisie.reference;            
						vm.selectedPlainteItem.nomplaignant= vm.saisie.nomplaignant;            
						vm.selectedPlainteItem.adresseplaignant= vm.saisie.adresseplaignant;           
						vm.selectedPlainteItem.responsableenregistrement= vm.saisie.responsableenregistrement;            
						vm.selectedPlainteItem.mesureprise= vm.saisie.mesureprise;           
						vm.selectedPlainteItem.dateresolution= vm.saisie.dateresolution;            
						vm.selectedPlainteItem.statut= vm.saisie.statut;            
						vm.selectedPlainteItem.a_ete_modifie= modifie;            
						vm.selectedPlainteItem.supprime= 0;           
						vm.selectedPlainteItem.userid= vm.utilisateur_id;           
						vm.selectedPlainteItem.datemodification= vm.saisie.datemodification;            									
						vm.selectedPlainteItem.$selected = false;
						vm.selectedPlainteItem ={};
                    } else {    
						vm.allPlainte = vm.allPlainte.filter(function(obj) {
							return obj.id !== currentPlainteItem.id;
						});         
                    }
                } else {
                    NouvelPlainteItem=false;
					vm.selectedPlainteItem.id=data.response;
					vm.selectedPlainteItem.nom_fichier=vm.fichier;
					var item = {
						id:String(data.response) ,
						id_serveur_centrale:vm.saisie.id_serveur_centrale,
						menage_id:vm.saisie.menage_id,
						activite_id:vm.saisie.activite_id,
						cellulederecours_id:vm.saisie.cellulederecours_id,
						code:vm.saisie.code,
						typeplainte_id:vm.saisie.typeplainte_id,
						type_plainte:vm.saisie.type_plainte,
						solution_id:vm.saisie.solution_id,
						resultat_plainte:vm.saisie.resultat_plainte,
						village_id:vm.filtre.village_id,
						programme_id:vm.saisie.programme_id,
						Objet:vm.saisie.Objet,
						datedepot:vm.saisie.datedepot,
						reference:vm.saisie.reference,
						nomplaignant:vm.saisie.nomplaignant,
						adresseplaignant:vm.saisie.adresseplaignant,
						responsableenregistrement:vm.saisie.responsableenregistrement,
						mesureprise:vm.saisie.mesureprise,
						dateresolution:vm.saisie.dateresolution,
						statut:vm.saisie.statut,
						a_ete_modifie:0,
						supprime:0,
						userid:vm.utilisateur_id,
						datemodification:vm.saisie.datemodification,
					}
       				vm.allPlainte.unshift(item) ;
					vm.selectedPlainteItem ={};
					
                }
				vm.disable=false;
            }).error(function (data) {
                alert('Erreur');
            }); 
        }      
		// Upload fichier
 		vm.uploadFile = function (item,suppression) {
			console.log(JSON.stringify(item));
			var file =vm.myFile[0];
			var repertoire = apiUrlrecommandation;
			var uploadUrl = apiUrl + "uploadfichier/save_recommandation";
			var name = $scope.name;
			var fd = new FormData();
			fd.append('file', file);
			fd.append('repertoire',repertoire);
			if(file) { 
				var upl=   $http.post(uploadUrl, fd, {
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				}).success(function(data){
					console.log('upload success');
					console.log(data);
					vm.fichier=data[1];
					vm.sauverPlainte(item,0);
				}).error(function(){
				});
			} else {
				vm.sauverPlainte(item,0);
			}
		}
		// Récupération fichier dans le serveur
		vm.exportfichier = function(item) {
			var bla = $.post(apiUrl + "Uploadfichier/prendre_fichier",{
						nom_fichier : item.nom_fichier,
						repertoire: item.repertoire
					},function(data) {   
						console.log('Repertoire=' + data);
						window.location = data;
					});
		}
		vm.modifierCPS= function(item) {
		}
		vm.modifierCPS = function (item) { 
			vm.nontrouvee=true;
			vm.allProtection_sociale.forEach(function(ax) {
				if(parseInt(ax.id)==parseInt(item.cellulederecours_id)) {
					vm.saisie.cellulederecours_id = ax.id; 
					vm.saisie.code=ax.Code;
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.saisie.cellulederecours_id = null; 
					vm.saisie.code='';
			}
		}
		vm.modifierTP = function (item) { 
			vm.nontrouvee=true;
			vm.all_type_plainte.forEach(function(ax) {
				if(parseInt(ax.id)==parseInt(item.typeplainte_id)) {
					vm.saisie.typeplainte_id = ax.id; 
					vm.saisie.type_plainte=ax.TypePlainte;
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.saisie.typeplainte_id = null; 
					vm.saisie.type_plainte='';
			}
		}
		vm.modifierSOLUTION = function (item) { 
			vm.nontrouvee=true;
			vm.all_resultat_plainte.forEach(function(ax) {
				if(parseInt(ax.id)==parseInt(item.solution_id)) {
					vm.saisie.solution_id = ax.id; 
					vm.saisie.resultat_plainte=ax.libelle;
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.saisie.solution_id = null; 
					vm.saisie.resultat_plainte='';
			}
		}
		
    }
})();
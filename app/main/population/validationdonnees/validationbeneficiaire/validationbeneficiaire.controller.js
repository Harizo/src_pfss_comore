(function ()
{
    'use strict';
    angular
        .module('app.pfss.validationdonnees.validationbeneficiaire')
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
				// console.log(file);
				$http.post(uploadUrl, fd,{
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				}).success(function(){
					// console.log('tafa');
				}).error(function(){
					// console.log('Rivotra');
				});
			}
		}])
        .controller('ValidationbeneficiaireController', ValidationbeneficiaireController);
    /** @ngInject */
    function ValidationbeneficiaireController(apiFactory, $state, $scope,$cookieStore, $mdDialog,DTOptionsBuilder,apiUrl,$http,fileUpload,apiUrlbase,apiUrlvalidationbeneficiaire)  {
		// Déclaration variable
        var vm = this;
        var NouvelItem=false;
        var currentItem;
        var typeact="";
        var NouveldonneesavaliderItem=0;
        var  currentdepenseItem;
        vm.selectedListedonneesavaliderItem={};
        vm.myFile={};
        vm.parent_courant={};
        vm.etat="";
        vm.fichier="";
		vm.repertoire="";
		vm.directoryName='';
        vm.typeact={};
        vm.selectedItem = {} ;
        vm.selectedcourant={};
        vm.ajout = ajout ;
		vm.repertoire_complet="";
        //variale affichage bouton nouveau
        vm.afficherboutonnouveau = 1 ;
        //variable cache masque de saisie
        vm.affichageMasque = 0 ;
        //pour les sous tâches
        vm.affichageMasquestache = 0 ;
        //fin pour les sous tâches
        vm.allActivite = [] ;
        vm.Listevalidationbeneficiaire = [] ;
        vm.allParent = [] ;
        vm.ListeParent = [] ;
		vm.monfichier ='';
		vm.region="";
		vm.district="";
		vm.commune="";
		vm.fokontany="";
		vm.intervention="";
		vm.date_inscription="";
		vm.affiche_load=false;
        // Data
        vm.dtOptions = {
        dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth : false,
        responsive: true
        };
        // vm.activite_col = [{"titre":"Type de document"}];
        vm.tdr_coldetail = [{"titre":"Acteur"},{"titre":"Fichier"},{"titre":"Date d'envoi"},{"titre":"Utilisateur"},{"titre":"Action"}];           
        vm.colonne_donnees_a_validees = [{"titre":"Acteur"},{"titre":"Fichier"},{"titre":"Date d'envoi"},{"titre":"Utilisateur"},{"titre":"Date intégration"},{"titre":"Validateur"},{"titre":"Actions"}];           
        var id_user = $cookieStore.get('id');
		vm.id_utilisateur = id_user;
		vm.adresse_mail =$cookieStore.get('email');
		// Filtrer résultat si utilisateur n'a pas le droit(roles) ADMIN
		vm.roles=$cookieStore.get('roles');
		vm.filtrer_resultat=true;
		for (var i = 0; i < vm.roles.length; i++) {
			if(vm.roles[i]=="ADMIN") {
				vm.filtrer_resultat=false;
			}          
		}									
		// Début Récupération données référentielles
        apiFactory.getOne("utilisateurs/index", id_user).then(function(result) {
			vm.nomutilisateur = result.data.response.prenom + ' ' + result.data.response.nom;
			vm.raisonsociale = result.data.response.raison_sociale;
			apiFactory.getAPIgeneraliser("listevalidationbeneficiaire/index","donnees_validees",Number(0),"id_utilisateur",vm.id_utilisateur).then(function(result) {
				vm.Listevalidationbeneficiaire = result.data.response;
				if(vm.filtrer_resultat) {
					vm.Listevalidationbeneficiaire = vm.Listevalidationbeneficiaire.filter(function(obj) {
						return obj.id_utilisateur == vm.id_utilisateur;
					});					
				}
			});               
        });   
		// Fin Récupération données référentielles	
			//add historique : Consultation menu validation bénéficiaire
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var datas = $.param({
				action:"Consultation : Menu validation bénéficiaire",
				id_utilisateur:vm.id_utilisateur
			});
			//factory
			apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
			});	
		// Formatage affichage date			
		function formatDate(date) {
			var mois = date.getMonth()+1;
			var dateSQL = (date.getFullYear()+ "/"+ mois + "/" + date.getDate());
			// var dateSQL = (date.getFullYear()+"-"+mois+"-"+date.getDate() + ' ' + date.getHours + ':' + date.getMinutes + ':' + date.getSeconds );
			return dateSQL;

		}
		// Parsing date pour la BDD
		function parseDate(date) {
			var d = moment(date, 'YYYY-MM-DD', true);
			return d.isValid() ? d.toDate() : new Date(NaN);
		}
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
		// Fonction Insertion,modif,suppression table validation_beneficiaire
        function ajout(activite,suppression) {
            if (NouvelItem==false) {
               // test_existance (activite,suppression);
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
                supprimer:suppression,
                id:getId,
                resume: activite.resume,
                donnees_validees: activite.donnees_validees,            
                nom_fichier: activite.nom_fichier,
                date_reception: activite.date_reception,
                date_validation: null,
                repertoire: activite.repertoire,
                site_id:vm.site_id,
                id_utilisateur:id_user,
                id_utilisateur_validation:null,
            });
            //factory
            apiFactory.add("listevalidationbeneficiaire/index",datas, config).success(function (data) {
                if (NouvelItem == false) {
                    // Update or delete: id exclu                  
                    if(suppression==0) {
                        vm.afficherboutonModifSupr = 0 ;
                        vm.afficherboutonnouveau = 1 ;
                } else {
                    var item = {
                        num_tdr: activite.num_tdr,
                        projet: activite.projet,
                        objectif: activite.objectif,
                        id:String(data.response) ,
                        date_tdr:activite.date_tdr,
                        site_id:vm.site_id 
                    };     
                    vm.allActivite.push(item);
                    vm.activite.num_tdr='';
                    vm.activite.projet='';
                    vm.activite.objectif='';
                    vm.activite.date_tdr='';                    
                }
                  vm.affichageMasque = 0 ;
              }
            }).error(function (data) {                  
                vm.showAlert('Erreur de saisie','Veuillez saisir les champs manquants !');
            });              
        }  
      //*****************************************************************     
		// Clic sur un item 
        vm.selectionDocument= function (item) {
            vm.selectedListedonneesavaliderItem = item;
            currentdepenseItem = JSON.parse(JSON.stringify(vm.selectedListedonneesavaliderItem));
        };
		// $watch pour sélectionner ou désélectionner automatiquement un item 
        $scope.$watch('vm.selectedListedonneesavaliderItem', function() {
			if (!vm.selectedListedonneesavaliderItem) return;
			vm.Listevalidationbeneficiaire.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedListedonneesavaliderItem.$selected = true;
        });
		$scope.uploadFile = function(event){
			var files = event.target.files;
			vm.myFile=files;  
			// console.log(vm.myFile[0].name);	
			vm.monfichier = vm.myFile[0].name;
		};
        vm.ajouterDocument = function () {
            vm.selectedListedonneesavaliderItem.$selected = false;
            NouveldonneesavaliderItem = 1 ;
			var items = {
				$edit: true,
				$selected:true,
				supprimer:0,
				resume:'',
				url:'',
				validation:0,
				fait:0,
				date_reception:new Date,
				date_validation:null,
				nom_fichier:'',
                id_utilisateur:id_user,
                id_utilisateur_validation:null,
                donnees_validees:0,
				id:0,
				nomutilisateur:vm.nomutilisateur,		
				nomutilisateurvalidation:null,		
				raisonsociale:vm.raisonsociale		
			};
			vm.Listevalidationbeneficiaire.push(items);
			vm.afficherboutonnouveau=0;
		}
		vm.annulerDocument = function(item) {
			vm.afficherboutonnouveau=1;
			if (!item.id) {
				vm.Listevalidationbeneficiaire.pop();
				vm.selectedListedonneesavaliderItem.$edit = false;
				return;
			}          
			vm.selectedListedonneesavaliderItem.resume=vm.resume;
			vm.selectedListedonneesavaliderItem.url=vm.url;
			vm.selectedListedonneesavaliderItem.validation=vm.validation;
			vm.selectedListedonneesavaliderItem.nom_fichier=vm.fichier;
			vm.selectedListedonneesavaliderItem.date_reception=vm.date_reception;
			vm.selectedListedonneesavaliderItem.$selected = false;
			NouveldonneesavaliderItem = 0;
			item.$edit=false; 
			vm.disable=false;
        };
		vm.supprimerDocument = function(item) {
            if(id_user!=item.id_utilisateur && parseInt(id_user)!=1) {
                vm.showAlert("Information","Vous n'avez pas le droit de supprimer ce document !. Merci");
                return;
            }
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
				vm.sauverDocument(vm.selectedListedonneesavaliderItem,1);
            }, function() {
             //alert('rien');
            });
        };
		vm.modifierDocument = function(item) {
            if(id_user!=item.id_utilisateur && parseInt(id_user)!=1) {
                vm.showAlert("Information","Vous n'avez pas le droit de modifier ce document !. Merci");
                return;
            }   
            vm.resume=item.resume;
            vm.url=item.url;
            vm.validation=item.validation;
            vm.fichier=item.nom_fichier;
            vm.date_reception=item.date_reception;
            vm.fait=item.fait;
			currentdepenseItem = JSON.parse(JSON.stringify(vm.selectedListedonneesavaliderItem));
			item.date_reception = new Date(item.date_reception);
			vm.Listevalidationbeneficiaire.forEach(function(it) {
				it.$selected = false;
				it.$edit = false;
			});
            NouveldonneesavaliderItem = 0 ;
			vm.selectedListedonneesavaliderItem.$selected = true;             
            item.$edit = true;  
			item.$selected = true; 
			vm.selectedListedonneesavaliderItem = item;     
			vm.selectedListedonneesavaliderItem.$edit = true;                  
			vm.afficherboutonnouveau=0;
        };
		vm.sauverDocument = function (item,suppression) {
			vm.affiche_load=true;
			var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            var getId = 0;
            if (NouveldonneesavaliderItem==0) {
               getId = vm.selectedListedonneesavaliderItem.id; 
            } 
			if(suppression==1) {
				var date_temporaire = vm.selectedListedonneesavaliderItem.date_reception;
			} else {
				var date_temporaire = formatDate(vm.selectedListedonneesavaliderItem.date_reception);
			}
			// var rep = apiUrlbase + apiUrlvalidationbeneficiaire + vm.site.toLowerCase()  ;
			var rep = apiUrlbase + apiUrlvalidationbeneficiaire ;
			vm.directoryName=rep;
            var datas = $.param({
                supprimer:suppression,
                id:getId,
                donnees_validees: 0,            
                nom_fichier: vm.fichier,
                repertoire: vm.repertoire,
                date_reception: date_temporaire,
                date_validation: null,
                id_utilisateur:id_user,
                id_utlisateur_validation:null
            });
            apiFactory.add("listevalidationbeneficiaire/index",datas, config).success(function (data) {
                if (NouveldonneesavaliderItem == 0) {
                    vm.selectedListedonneesavaliderItem.nom_fichier=vm.fichier;
                    vm.selectedListedonneesavaliderItem.repertoire=vm.repertoire;
                    if(suppression==0) {
                      vm.selectedListedonneesavaliderItem.$selected = false;
					  vm.selectedListedonneesavaliderItem.$edit=false;
                      vm.selectedListedonneesavaliderItem ={};
                    } else {    
						vm.Listevalidationbeneficiaire = vm.Listevalidationbeneficiaire.filter(function(obj) {
							return obj.id !== currentdepenseItem.id;
						});         
                    }
					//add historique : Validation bénéficiaire : 
					var actions ="Modification envoi fichier bénéficiaire à valider : fichier " + vm.raisonsociale + " " + vm.repertoire + vm.fichier;
					var config = {
						headers : {
							'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
						}
					};
					var datas = $.param({
						action:actions,
						id_utilisateur:vm.id_utilisateur
					});
					//factory
					apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
					});									
                } else {
                    NouveldonneesavaliderItem=0;
					vm.selectedListedonneesavaliderItem.id=data.response[0].id;
					vm.selectedListedonneesavaliderItem.date_reception=data.response[0].date_reception;
					vm.selectedListedonneesavaliderItem.nom_fichier=vm.fichier;
					vm.selectedListedonneesavaliderItem.repertoire=vm.repertoire;
					vm.repertoire_complet ==vm.repertoire;
                }
				// Envoi email pour signaler qu'aucune erreur a été détéctée
				var repertoire = apiUrlvalidationbeneficiaire;
				var uploadUrl = apiUrl + "validationbeneficiaire/envoyer_mail_validation_donnees";
				var name = $scope.name;
				var fd = new FormData();
				fd.append('id_utilisateur',vm.id_utilisateur);
				fd.append('adresse_mail',vm.adresse_mail);
				fd.append('region',vm.region);
				fd.append('district',vm.district);
				fd.append('commune',vm.commune);
				fd.append('fokontany',vm.fokontany);
				fd.append('intervention',vm.intervention);
				fd.append('date_inscription',vm.date_inscription);
				var upl=   $http.post(uploadUrl, fd, {
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				}).success(function(data){
					if(parseInt(data)==1) {
						// Aucune erreur détectée => Sauvegarde dans la liste de validation bénéficiaire
						vm.showAlert("INFORMATION","Un email a été envoyé à votre adresse : " + vm.adresse_mail + " .Merci.A bientôt");
					} else {
						vm.showAlert("INFORMATION","Une erreur s'est produite lors de l'envoi d'un email vers votre adresse : " + vm.adresse_mail + " .Veuillez vérifier votre adresse e-mail si correct.Merci");
					}						
				}).error(function(){
					vm.showAlert("INFORMATION","Une erreur s'est produite lors de l'envoi d'un email vers votre adresse : " + vm.adresse_mail + " .Veuillez vérifier votre adresse e-mail si correct.Merci");
				});
				vm.selectedListedonneesavaliderItem.$edit=false;
				vm.selectedListedonneesavaliderItem.$selected=false;
				vm.selectedListedonneesavaliderItem={};
				vm.afficherboutonnouveau=1;
				vm.disable=false;
            }).error(function (data) {
                alert('Erreur');
            }); 
			vm.affiche_load=false;
        }      
        function test_existance (item,suppression) {          
            if (suppression!=1) {
                insert_in_base(item,suppression);                                   
            } else {
              insert_in_base(item,suppression);
            }  
        } 
 		vm.uploadFile = function (item,suppression) {
			vm.affiche_load=true;
			var file =vm.myFile[0];
			// console.log('file is ' );
			// console.dir(file);
			var repertoire = apiUrlvalidationbeneficiaire;
			// var bt = vm.site.toLowerCase() + '/';
			var uploadUrl = apiUrl + "validationbeneficiaire/upload_validationdonneesbeneficiaire";
			var name = $scope.name;
			// console.log(name);
			var fd = new FormData();
			fd.append('file', file);
			fd.append('repertoire',repertoire);
			fd.append('raison_sociale',vm.raisonsociale);
			fd.append('adresse_mail',vm.adresse_mail);
			fd.append('id_utilisateur',vm.id_utilisateur);
			if(file) { 
				vm.affiche_load=true;
				var upl=   $http.post(uploadUrl, fd, {
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				}).success(function(data){
					vm.erreur_titre =0;
					vm.fichier=data["nom_fichier"];
					vm.repertoire=data["repertoire"];
					if(data["reponse"]=="OK") {
						vm.region=data["region"];
						vm.district=data["district"];
						vm.commune=data["commune"];
						vm.fokontany=data["fokontany"];
						vm.intervention=data["intervention"];
						vm.date_inscription=data["date_inscription"];
						// Aucune erreur détectée => Sauvegarde dans la liste de validation bénéficiaire
						vm.affiche_load=true;
						vm.sauverDocument(item,0);
						var actions ="Envoi fichier bénéficiaire à valider : fichier " + vm.raisonsociale + " " + vm.repertoire + vm.fichier;
						vm.showAlert("INFORMATION","Le fichier à importer ne contient pas des erreurs.Merci de votre collaboration.A bientôt");
					} else {
						vm.erreur_titre = data["erreur_titre"];
						if(parseInt(vm.erreur_titre) >0) {
							var actions ="Simulation bénéficiaire : ERREUR FORMAT DE FICHIER";
							vm.showAlert("ERREUR DE FORMAT BENEFICIAIRE","Le format du fichier à importer est incorrect.Veuillez récupérer dans le menu Canevas formaté le format du fichier convenu.Merci");
						} else {
							var actions ="Envoi fichier bénéficiaire à valider avec " + data["nombre_erreur"] + "erreur(s) : fichier " + vm.raisonsociale + " " + vm.repertoire + vm.fichier +"(non sauvegardé)";
							vm.showAlert("INFORMATION","Il y a des erreurs dans le fichier à importer.Veuillez consulter votre e-mail et corriger les données marquées en rouge.Merci");
							window.location = apiUrlbase+"/" + vm.repertoire + vm.fichier ;
						}	
						// Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
						vm.Listevalidationbeneficiaire = vm.Listevalidationbeneficiaire.filter(function(obj) {
							return parseInt(obj.id) !== 0;
						});  
						vm.afficherboutonnouveau=1;
						vm.selectedListedonneesavaliderItem.$edit=false;
					}						
					vm.affiche_load=false;
					//add historique : Validation bénéficiaire : 
					var config = {
						headers : {
							'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
						}
					};
					var datas = $.param({
						action:actions,
						id_utilisateur:vm.id_utilisateur
					});
					//factory
					apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
					});	
					vm.affiche_load=false;
				}).error(function(){
					// console.log("Rivotra");
				});
			} else {
				vm.sauverDocument(item,0);
			}
		}
		vm.exportfichier = function(item) {
			var rep = apiUrlbase + item.repertoire;
			var bla = $.post(apiUrl + "uploadfichier/prendre_fichier",{
						nom_fichier : item.nom_fichier,
						repertoire: rep,
						email :vm.adresse_mail,
					},function(data) {   
						window.location = data;
					});
		}
    }
})();
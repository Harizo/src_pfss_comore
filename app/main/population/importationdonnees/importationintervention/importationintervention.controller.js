(function ()
{
    'use strict';
    angular
        .module('app.population.importationdonnees.importationintervention')
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
				$http.post(uploadUrl, fd,{
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				}).success(function(){
				}).error(function(){
				});
			}
		}])
        .controller('ImportationinterventionController', ImportationinterventionController);
    /** @ngInject */
    function ImportationinterventionController(apiFactory, $state, $scope,$cookieStore, $mdDialog,DTOptionsBuilder,apiUrl,$http,fileUpload,apiUrlbase,apiUrlvalidationintervention)  {
		// Déclaration variable
        var vm = this;
        var NouvelItem=false;
        var currentItem;
        var typeact="";
        var NouveldonneesavaliderItem=0;
        var  currentdepenseItem;
        vm.selectedListedonneesavaliderItem={};
        vm.selectedItemInterventionValidees={};
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
        //variale affichage bouton nouveau
        vm.afficherboutonnouveau = 1 ;
        //variable cache masque de saisie
        vm.affichageMasque = 0 ;
        //pour les sous tâches
        vm.affichageMasquestache = 0 ;
        //fin pour les sous tâches
        vm.allActivite = [] ;
        vm.Listevalidationintervention=[];
		vm.Listeinterventionvalidees=[];
        vm.allParent = [] ;
        vm.ListeParent = [] ;
		vm.monfichier ='';
		vm.affiche_load=false;
        // Data
        vm.dtOptions = {
        dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth : false,
        responsive: true
        };
        // vm.activite_col = [{"titre":"Type de document"}];
        vm.colonne_validation = [{"titre":"Acteur"},{"titre":"Fichier"},{"titre":"Date d'envoi"},{"titre":"Utilisateur"},{"titre":"Action"}];           
        vm.colonne_donnees_validees = [{"titre":"Acteur"},{"titre":"Fichier"},{"titre":"Date d'envoi"},{"titre":"Utilisateur"},{"titre":"Date intégration"},{"titre":"Validateur"}];           
        var id_user = $cookieStore.get('id');
		vm.id_utilisateur = id_user;
		vm.adresse_mail =$cookieStore.get('email');
		// Début Récupération données référentielles
        apiFactory.getOne("utilisateurs/index", id_user).then(function(result) {
			vm.nomutilisateur = result.data.response.prenom + ' ' + result.data.response.nom;
			vm.raisonsociale = result.data.response.raison_sociale;
			apiFactory.getAPIgeneraliser("listevalidationintervention/index","etat",10).then(function(result) {
				vm.Listevalidationintervention = result.data.response;
			});               
			apiFactory.getAPIgeneraliser("listevalidationintervention/index","etat",20).then(function(result) {
				vm.Listeinterventionvalidees = result.data.response;
			});               
        });  
		// Fin Récupération données référentielles
			//add historique : Consultation menu importation bénéficiaire
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var datas = $.param({
				action:"Consultation : Menu importation bénéficiaire",
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
 		// Fonction Insertion,modif,suppression table liste_validation_beneficiaire
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
            apiFactory.add("listevalidationintervention/index",datas, config).success(function (data) {
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
		// Clic sur un item liste_validation_intervention
        vm.selectionInterventionValidees= function (item) {             
            vm.selectedItemInterventionValidees = item;
        };
		// $watch pour sélectionner ou désélectionner automatiquement un item liste_validation_intervention
        $scope.$watch('vm.selectedItemInterventionValidees', function() {
            if (!vm.Listeinterventionvalidees) return;
            vm.Listeinterventionvalidees.forEach(function(item) {
                item.$selected = false;
            });
            vm.selectedItemInterventionValidees.$selected = true;
        });
        // Ajout d'un nouvel item liste_validation_intervention
        vm.ajouter = function () {
            vm.affichageMasque = 0 ;
            NouvelItem = true ;
		    var items = {
				$edit: true,
				$selected:true,
				supprimer:0,
				id:0,
				libelle: '',
				id_utilisateur:id_user
			};
			vm.allActivite.push(items);
        };
		// Annulation modification d'un item liste_validation_intervention
        vm.annuler = function() {            
			vm.selectedItem.$selected = false;
			vm.affichageMasque = 0 ;
			vm.afficherboutonnouveau = 1 ;
			vm.afficherboutonModifSupr = 0 ;
			if (!item.id) {
				vm.selectedItem.depense.pop();
				return;
			}          
			item.$selected=false; 
			item.$edit=false; 
			NouvelItem = false;            
			// Restaurer les valeurs
			item.libelle = currentItem.libelle;
        };
		// Modification d'un item liste_validation_intervention
        vm.modifier = function(item) {                    
                NouvelItem = false ;
				item.$selected=true,
				item.$edit=true;
        };
		// Suppression d'un item liste_validation_intervention
        vm.supprimer = function() {
            vm.afficherboutonModifSupr = 0 ;
            vm.affichageMasque = 0 ;
			var rep = response.data;                
			var confirm = $mdDialog.confirm()
				.title('Confirmation de suppression')
				.textContent(vm.qui)
				.ariaLabel('Lucky day')
				.clickOutsideToClose(false)
				.parent(angular.element(document.body))
				.ok('supprimer')
				.cancel('annuler');
			$mdDialog.show(confirm).then(function() {
				   ajout(vm.selectedItem,1);
			}, function() {
			});
        };   
		// Clic sur un item liste_validation_beneficiaire   données déjà vlidées     
        vm.selectionListedonneesavalider= function (item) {
            vm.selectedListedonneesavaliderItem = item;
            currentdepenseItem = JSON.parse(JSON.stringify(vm.selectedListedonneesavaliderItem));
        };
		// $watch pour sélectionner ou désélectionner automatiquement un item liste_validation_intervention
        $scope.$watch('vm.selectedListedonneesavaliderItem', function() {
			if (!vm.selectedListedonneesavaliderItem) return;
			vm.Listevalidationintervention.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedListedonneesavaliderItem.$selected = true;
        });
		// Upload fichier excel intervention
		$scope.uploadFile = function(event){
			var files = event.target.files;
			vm.myFile=files;  
			vm.monfichier = vm.myFile[0].name;
		};
		// Upload fichier excel  intervention
 		vm.uploadFile = function (item,suppression) {
			var file =vm.myFile[0];
			var repertoire = apiUrlvalidationintervention;
			var uploadUrl = apiUrl + "validationintervention/upload_validationdonneesintervention";
			var name = $scope.name;
			var fd = new FormData();
			fd.append('file', file);
			fd.append('repertoire',repertoire);
			fd.append('raison_sociale',vm.raisonsociale);
			if(file) { 
				var upl=   $http.post(uploadUrl, fd, {
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				}).success(function(data){
					vm.fichier=data["nom_fichier"];
					vm.repertoire=data["repertoire"];
					if(data["reponse"]!="OK") {
						// Sauvegarde dans la BDD
						vm.sauverDocument(item,0);
						vm.showAlert("INFORMATION","Le fichier à importer ne contient pas des erreurs.Merci de votre collaboration.A bientôt");
					} else {
						vm.showAlert("INFORMATION","Il y a des erreurs dans le fichier à importer.Veuillez consulter votre e-mail et corriger les données marquées en rouge.Merci");
						// Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
						vm.Listevalidationintervention = vm.Listevalidationintervention.filter(function(obj) {
							return parseInt(obj.id) !== 0;
						});         						
					}	
				}).error(function(){
					// console.log("Rivotra");
				});
			} else {
				vm.sauverDocument(item,0);
			}
		}
		// Boite de dialogue pour confirmer si l'utilisateur veut importer le fichier excel
        vm.ConfirmerImportIntervention = function(donnees) {
			var confirm = $mdDialog.confirm()
                .title("Vous-êtes en train d'importer cet enregistrement.Continuer ?")
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('Continuer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				vm.importerintervention(donnees);
			}, function() {
			});
        }
		// Importation fichier excel intervention dans la BDD
		vm.importerintervention = function(item) {
			vm.affiche_load=true;
			var bla = $.post(apiUrl + "importationintervention/importer_donnees_intervention",{
						nom_fichier : item.nom_fichier,
						repertoire: item.repertoire,
						id_liste_validation_intervention:item.id,
						id_utilisateur:vm.id_utilisateur,
						id:item.id
					},function(data) {  
						console.log(data);
						// window.location = data;
						// Actualisation liste validation bénéficiaire
						vm.Listevalidationintervention =[];
						vm.Listeinterventionvalidees =[];
						apiFactory.getAPIgeneraliser("listevalidationintervention/index","etat",10).then(function(result) {
							vm.Listevalidationintervention = result.data.response;
						});               
						apiFactory.getAPIgeneraliser("listevalidationintervention/index","etat",20).then(function(result) {
							vm.Listeinterventionvalidees = result.data.response;
						});               
						//add historique : Intégration bénéficiaire : 
						var actions ="Intégration bénéficiaire : fichier " + item.raisonsociale + "  " + item.repertoire + item.nom_fichier;
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
						vm.showAlert("INFORMATION","Les données sont intégrées dans la base de données.Merci !");						
						// Envoi email pour signaler qu'aucune erreur a été détéctée
						var repertoire = apiUrlvalidationintervention;
						var uploadUrl = apiUrl + "importationintervention/envoyer_mail_integration_donnees";
						var name = $scope.name;
						var fd = new FormData();
						fd.append('id_utilisateur',vm.id_utilisateur);
						fd.append('adresse_mail',vm.adresse_mail);
						fd.append('region',data["region"]);
						fd.append('district',data["district"]);
						fd.append('commune',data["commune"]);
						fd.append('fokontany',data["fokontany"]);
						fd.append('intervention',data["intervention"]);
						fd.append('date_inscription',data["date_inscription"]);
						fd.append('id_liste_validation_intervention',item.id);
						var upl=   $http.post(uploadUrl, fd, {
							transformRequest: angular.identity,
							headers: {'Content-Type': undefined}
						}).success(function(data){
							var reponse =data["reponse"];
							var adresse_mail_proprietaire =data["email"];
							var adresse_mail_hote =data["email_hote"];
							if(parseInt(reponse)==1) {
								// Aucune erreur détectée => Sauvegarde dans la liste de validation bénéficiaire
								vm.showAlert("INFORMATION","Un email a été envoyé à l'adresse : " + adresse_mail_proprietaire + " .En copie : " + adresse_mail_hote + " .Merci.");
							} else {
								vm.showAlert("INFORMATION","Une erreur s'est produite lors de l'envoi d'un email vers : " + adresse_mail_proprietaire +  " .En copie : " + adresse_mail_hote + " .Veuillez vérifier l'adresse e-mail si correct.Merci");
							}						
						}).error(function(){
							vm.showAlert("INFORMATION","Une erreur s'est produite lors de l'envoi d'un email vers l'acteur.Veuillez vérifier l'adresse e-mail si correct.Merci");
						});	
						vm.affiche_load=false;
					});
		}
    }
})();
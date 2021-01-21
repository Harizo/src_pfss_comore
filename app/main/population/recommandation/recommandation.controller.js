(function ()
{
    'use strict';
    angular
        .module('app.population.recommandation')
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
        .controller('RecommandationController', RecommandationController);
    /** @ngInject */
    function RecommandationController(apiFactory, $state, $scope,$cookieStore, $mdDialog,DTOptionsBuilder,apiUrl,$http,fileUpload,apiUrlbase,apiUrlrecommandation)  {
		// Déclaration variable
        var vm = this;
        var NouvelItem=false;
        var currentItem;
        var typeact="";
        var NouveldepenseItem=false;
        var  currentdepenseItem;
        vm.selectedDocumentItem={};
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
        vm.allRecommandation = [] ;
        vm.allParent = [] ;
        vm.ListeParent = [] ;
        // Data
        vm.dtOptions = {
        dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth : false,
        responsive: true
        };
        // vm.activite_col = [{"titre":"Type de document"}];
        vm.tdr_coldetail = [{"titre":"Resumé"},{"titre":"Url"},{"titre":"Fichier"},{"titre":"Date"},{"titre":"Validation"},{"titre":"Fait"},{"titre":"Action"}];           
        var id_user = $cookieStore.get('id');
		vm.utilisateur_id = id_user;
		console.log(vm.utilisateur_id);
		// Début Récupération données référentielles
        apiFactory.getOne("utilisateurs/index", id_user).then(function(result) {
			vm.nomutilisateur = result.data.response.prenom + ' ' + result.data.response.nom;
			apiFactory.getAll("listerecommandation/index").then(function(result) {
				vm.allRecommandation = result.data.response;
			});               
        });     
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
                url: activite.url,            
                nom_fichier: activite.nom_fichier,
                date_upload: activite.date_upload,
                repertoire: activite.repertoire,
                site_id:vm.site_id,
                utilisateur_id:id_user,
            });
            //factory
            apiFactory.add("listerecommandation/index",datas, config).success(function (data) {
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
              }
            }).error(function (data) {                  
                vm.showAlert('Erreur de saisie','Veuillez saisir les champs manquants !');
            });              
        }  
      //*****************************************************************     
		// Clic sur un item recommandation
        vm.selectionDocument= function (item) {
            vm.selectedDocumentItem = item;
            currentdepenseItem = JSON.parse(JSON.stringify(vm.selectedDocumentItem));
        };
		// $watch pour sélectionner ou désélectionner automatiquement un item recommandation
        $scope.$watch('vm.selectedDocumentItem', function() {
			if (!vm.selectedItem.document) return;
			vm.allRecommandation.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedDocumentItem.$selected = true;
        });
		// Upload fichier attaché envoyé par l'utilisateur
		$scope.uploadFile = function(event){
			var files = event.target.files;
			vm.myFile=files;               
		};
		// Ajout d'un nouvel item recommandation
        vm.ajouterDocument = function () {
            vm.selectedDocumentItem.$selected = false;
            NouveldepenseItem = true ;
			var items = {
				$edit: true,
				$selected:true,
				supprimer:0,
				resume:'',
				url:'',
				validation:0,
				fait:0,
				date_upload:new Date(),
				nom_fichier:'',
                site:vm.site,
                site_id:vm.site_id,
                utilisateur_id:id_user,
				nomutilisateur:vm.nomutilisateur		
			};
			vm.allRecommandation.push(items);
		}
		// Annulation modification d'un item  recommandation
		vm.annulerDocument = function(item) {
			if (!item.id) {
				vm.allRecommandation.pop();
				return;
			}          
			vm.selectedDocumentItem.resume=vm.resume;
			vm.selectedDocumentItem.url=vm.url;
			vm.selectedDocumentItem.validation=vm.validation;
			vm.selectedDocumentItem.nom_fichier=vm.fichier;
			vm.selectedDocumentItem.date_upload=vm.date_upload;
			vm.selectedDocumentItem.fait=vm.fait;
			vm.selectedDocumentItem.$selected = false;
			NouveldepenseItem = false;
			item.$edit=false; 
			vm.disable=false;
        };
		// Suppression d'un item recommandation
		vm.supprimerDocument = function(item) {
            if(id_user!=item.utilisateur_id && parseInt(id_user)!=1) {
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
				vm.sauverDocument(vm.selectedDocumentItem,1);
            }, function() {
             //alert('rien');
            });
        };
		// Modification d'un item recommandation
		vm.modifierDocument = function(item) {
            if(id_user!=item.utilisateur_id && parseInt(id_user)!=1) {
                vm.showAlert("Information","Vous n'avez pas le droit de modifier ce document !. Merci");
                return;
            }   
            vm.resume=item.resume;
            vm.url=item.url;
            vm.validation=item.validation;
            vm.fichier=item.nom_fichier;
            vm.date_upload=item.date_upload;
            vm.fait=item.fait;
			currentdepenseItem = JSON.parse(JSON.stringify(vm.selectedDocumentItem));
			item.date_upload = new Date(item.date_upload);
			vm.allRecommandation.forEach(function(it) {
				it.$selected = false;
				it.$edit = false;
			});
            NouveldepenseItem = false ;
			vm.selectedDocumentItem.$selected = true;             
            item.$edit = true;  
			item.$selected = true; 
			vm.selectedDocumentItem = item;     
			vm.selectedDocumentItem.$edit = true;                  
        };
		// Sauvegarde dans la BDD la liste des documents
		vm.sauverDocument = function (item,suppression) {
			console.log(JSON.stringify(vm.selectedDocumentItem));
			var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            var getId = 0;
            if (NouveldepenseItem==false) {
               getId = vm.selectedDocumentItem.id; 
            } 
			
			// var rep = apiUrlbase + apiUrlrecommandation + vm.site.toLowerCase()  ;
			var rep = apiUrlbase + apiUrlrecommandation ;
			vm.directoryName=rep;
            var datas = $.param({
                supprimer:suppression,
                id:getId,
                resume: vm.selectedDocumentItem.resume,
                url: vm.selectedDocumentItem.url,            
                validation: vm.selectedDocumentItem.validation,            
                fait: vm.selectedDocumentItem.fait,            
                nom_fichier: vm.fichier,
                date_upload: vm.selectedDocumentItem.date_upload,
                repertoire: rep,
                site_id:null,
                utilisateur_id:id_user
            });
            apiFactory.add("listerecommandation/index",datas, config).success(function (data) {
                if (NouveldepenseItem == false) {
                    console.log('modifier');
                    console.log(vm.selectedDocumentItem.date_upoload);
                    vm.selectedDocumentItem.nom_fichier=vm.fichier;
                    if(suppression==0) {
                      vm.selectedDocumentItem.$selected = false;
					  vm.selectedDocumentItem.$edit=false;
					  // repertoire : à écraser chaque fois au cas où l'utilisateur change le nom du type de document dans DDB type document
					  vm.selectedDocumentItem.repertoire=vm.directoryName;
                      vm.selectedDocumentItem ={};
                    } else {    
						vm.allRecommandation = vm.allRecommandation.filter(function(obj) {
							return obj.id !== currentdepenseItem.id;
						});         
                    }
                } else {
                    NouveldepenseItem=false;
					vm.selectedDocumentItem.id=data.response;
					vm.selectedDocumentItem.nom_fichier=vm.fichier;
                }
				// vm.item.$selected=false;
				// vm.item.$edit=false;
				vm.selectedDocumentItem.$edit=false;
				vm.selectedDocumentItem.$selected=false;
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
					vm.sauverDocument(item,0);
				}).error(function(){
				});
			} else {
				vm.sauverDocument(item,0);
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
    }
})();
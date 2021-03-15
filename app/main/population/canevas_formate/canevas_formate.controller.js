(function ()
{
    'use strict';
    angular
        .module('app.pfss.canevas_formate')
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
        .controller('CanevasformateController', CanevasformateController);
    /** @ngInject */
    function CanevasformateController(apiFactory, $state, $scope,$cookieStore, $mdDialog,DTOptionsBuilder,apiUrl,$http,fileUpload,apiUrlbase,apiUrlcanevasformate)  {
		// Déclaration variable
        var vm = this;
        var NouvelItem=false;
        var currentItem;
        var typeact="";
        var NouveldocumentItem=false;
        var  currentdocumentItem;
		vm.disable=false;
        vm.selectedDocumentItem={};
        vm.myFile={};
        vm.fichier="";
		vm.directoryName='';
        vm.typeact={};
        vm.selectedItem = {} ;
        vm.selectedcourant={};
        //variale affichage bouton nouveau
        vm.afficherboutonnouveau = 1 ;
        vm.allCanevasformate = [] ;
        // Data
        vm.dtOptions = {
        dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth : false,
        responsive: true
        };
        // vm.activite_col = [{"titre":"Type de document"}];
        vm.titre_canevas_formate = [{"titre":"Resumé"},{"titre":"Fichier"},{"titre":"Date"},{"titre":"Utilisateur"},{"titre":"Action"}];           
        var id_user = $cookieStore.get('id');
		vm.id_utilisateur = id_user;

		vm.affichage_load = true ;
		// Début Récupération données référentielles
        apiFactory.getOne("utilisateurs/index", id_user).then(function(result) {
			vm.nomutilisateur = result.data.response.prenom + ' ' + result.data.response.nom;
			apiFactory.getAll("listecanevasformate/index").then(function(result) 
			{
				vm.allCanevasformate = result.data.response;
				vm.affichage_load = false ;
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
      //*****************************************************************     
		// Clic sur un item canevas formate
        vm.selectionDocument= function (item) {
            vm.selectedDocumentItem = item;
            currentdocumentItem = JSON.parse(JSON.stringify(vm.selectedDocumentItem));
        };
		// $watch pour sélectionner ou désélectionner automatiquement un item canevas formate
        $scope.$watch('vm.selectedDocumentItem', function() {
			if (!vm.selectedItem.document) return;
			vm.allCanevasformate.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedDocumentItem.$selected = true;
        });
		// Upload fichier attaché envoyé par l'utilisateur
		$scope.uploadFile = function(event){
			var files = event.target.files;
			vm.myFile=files;               
		};
		// Ajout d'un nouvel item canevas formate
        vm.ajouterDocument = function () {
            vm.selectedDocumentItem.$selected = false;
            NouveldocumentItem = true ;
			var items = {
				$edit: true,
				$selected:true,
				supprimer:0,
				resume:'',
				date_upload:new Date(),
				nom_fichier:'',
                id_utilisateur:id_user,
				nomutilisateur:vm.nomutilisateur		
			};
			vm.allCanevasformate.push(items);
		}
		// Annulation modification d'un item  canevas formate
		vm.annulerDocument = function(item) {
			if (!item.id) {
				vm.allCanevasformate.pop();
				return;
			}          
			vm.selectedDocumentItem.resume=vm.resume;
			vm.selectedDocumentItem.url=vm.url;
			vm.selectedDocumentItem.validation=vm.validation;
			vm.selectedDocumentItem.nom_fichier=vm.fichier;
			vm.selectedDocumentItem.date_upload=vm.date_upload;
			vm.selectedDocumentItem.fait=vm.fait;
			vm.selectedDocumentItem.$selected = false;
			NouveldocumentItem = false;
			item.$edit=false; 
			vm.disable=false;
        };
		// Suppression d'un item canevas formate
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
				vm.sauverDocument(vm.selectedDocumentItem,1);
            }, function() {
             //alert('rien');
            });
        };
		// Modification d'un item canevas formate
		vm.modifierDocument = function(item) {
            if(id_user!=item.id_utilisateur && parseInt(id_user)!=1) {
                vm.showAlert("Information","Vous n'avez pas le droit de modifier ce document !. Merci");
                return;
            }   
            vm.resume=item.resume;
            vm.url=item.url;
            vm.validation=item.validation;
            vm.fichier=item.nom_fichier;
            vm.date_upload=item.date_upload;
            vm.fait=item.fait;
			currentdocumentItem = JSON.parse(JSON.stringify(vm.selectedDocumentItem));
			item.date_upload = new Date(item.date_upload);
			vm.allCanevasformate.forEach(function(it) {
				it.$selected = false;
				it.$edit = false;
			});
            NouveldocumentItem = false ;
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
            if (NouveldocumentItem==false) {
               getId = vm.selectedDocumentItem.id; 
            } 
			
			// var rep = apiUrlbase + apiUrlcanevasformate + vm.site.toLowerCase()  ;
			var rep = apiUrlbase + apiUrlcanevasformate ;
			vm.directoryName=rep;
            var datas = $.param({
                supprimer:suppression,
                id:getId,
                resume: vm.selectedDocumentItem.resume,
                nom_fichier: vm.fichier,
                date_upload: vm.selectedDocumentItem.date_upload,
                repertoire: rep,
                id_utilisateur:vm.id_utilisateur
            });
            apiFactory.add("listecanevasformate/index",datas, config).success(function (data) {
                if (NouveldocumentItem == false) {
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
						vm.allCanevasformate = vm.allCanevasformate.filter(function(obj) {
							return obj.id !== currentdocumentItem.id;
						});         
                    }
                } else {
                    NouveldocumentItem=false;
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
			var repertoire = apiUrlcanevasformate;
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
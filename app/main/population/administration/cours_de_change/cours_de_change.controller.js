(function ()
{
    'use strict';
	// Historique de navigation de chaque utilisateur
    angular
        .module('app.population.administration.cours_de_change')
        .controller('CoursdechangeController', CoursdechangeController);

    /** @ngInject */
    function CoursdechangeController(apiFactory, $location, $mdDialog, $scope,$cookieStore,$rootScope,DTOptionsBuilder,apiUrl,$http)
    {      	
      	var vm    = this;
		vm.selectedItem={};
		vm.affiche_load=false;
      	vm.filtre = {};
		vm.valeur_saisie_cours=[];
		vm.alldevise=[];
      	vm.filtre.date_debut = new Date() ;
      	vm.filtre.date_fin = new Date() ;
      	vm.date_now 	   = new Date() ;
      	vm.id_utilisateur  = $cookieStore.get('id');
        // vm.titre_saisie_cours=[{titre:"Date"},{titre:"USD"},{titre:"EURO"}];
        // vm.titre_saisie_cours=[];
        //style
	    vm.dtOptions = {
	      	dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
	      	pagingType: 'simple',
	      	autoWidth: false,
	      	responsive: true
	    };

	    //add historique
		var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
		var datas = $.param({
			action:"Consultation : Cours de change",
			id_utilisateur:vm.id_utilisateur
		});
		//factory
		apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
		});
		apiFactory.getAPIgeneraliserREST("cours_de_change/index","requete_titre",Number(10)).then(function(result) {
			vm.titre_saisie_cours=[];
			vm.titre_saisie_cours =result.data.response;
			vm.Filtrer();
			
		});
    	apiFactory.getAll("cours_de_change/index").then(function(result)  {
	        vm.allcoursdechange = result.data.response;
	    });
    	apiFactory.getAll("devise/index").then(function(result)  {
	        vm.alldevise = result.data.response;
			$rootScope.listedevise=vm.alldevise;
	    });
		vm.selectioncours= function (item) {     
            vm.selectedItem = item;
        };
        $scope.$watch('vm.selectedItem', function() {
			if (!vm.valeur_saisie_cours) return;
			vm.valeur_saisie_cours.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
        });
		$rootScope.ajoutersaisiecours=function(liste_cours,date_cours) {
			date_cours=new Date(date_cours);			
			vm.date_cours_base_de_donnees=vm.converDateBasededonnees(date_cours);
			vm.date_cours_affichage=vm.converDateAffiche(date_cours);
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			// Envoi (post) une seule fois fois
			// Stocker dans une variable text : txtTmp les valeurs du tableau => variable indicé
			// Après on utilise la fonction eval pour transformer le format de données afin de pouvoir le poster
			var txtTmp="";
			txtTmp += "date_cours" +":\"" + vm.date_cours_base_de_donnees + "\",";	
			txtTmp += "nombre_devise" +":\"" + liste_cours.length + "\",";	
			for(var i=0;i < liste_cours.length;i++) {
				txtTmp += "id_devise_" + i +":\"" + liste_cours[i].id + "\",";	
				txtTmp += "cours_" + i +":\"" + liste_cours[i].cours + "\",";	
			}
			txtTmp = txtTmp.replace(new RegExp('\'', 'g'),'\\\'');
			txtTmp = txtTmp.replace(new RegExp('(\r\n|\r|\n)', 'g'),'');
			var donnees = $.param(eval('({' + txtTmp + '})'));
			apiFactory.add("cours_de_change/index",donnees, config).success(function (data) {
				if(parseInt(data.response.nombre_mise_a_jour) > 0 ) {
					// Il se peut que les valeurs saisie sont déja dans la BDD (sans rafraichissement avant saisie)
					// Alors la mise à jour de la liste affichée : écraser valeur ou insérer dans la liste si non trouvé
					if(vm.valeur_saisie_cours.length >0) {
						var trouvee = false;
						// Recherche valeur à écraser
						for(var i=0;i < vm.valeur_saisie_cours.length;i++) {
							if(vm.valeur_saisie_cours[i].date==vm.date_cours_affichage) {
								// vm.valeur_saisie_cours[i] = [];
								vm.valeur_saisie_cours[i] = data.response.donnees[0];
								// Break
								i=vm.valeur_saisie_cours.length;
								trouvee = true;
							}							
						}
						if(trouvee==false) {
							// sans rafraichissement avant saisie : hors date
							vm.valeur_saisie_cours.push(data.response.donnees[0]);
						}
					} else {
						// sans rafraichissement avant saisie : non affiché dans la liste
						vm.valeur_saisie_cours=data.response.donnees;
					}
				} else {
					// Nouvelle date => insérer dans la liste
					if(vm.valeur_saisie_cours.length >0) {
						vm.valeur_saisie_cours.push(data.response.donnees[0]);
					} else {
						vm.valeur_saisie_cours=data.response.donnees;
					}	
				}
			});	
		}			
  		vm.Filtrer = function() {
			vm.cliquable=0;
			vm.afficher=0;
			vm.affiche_load=true;			
			vm.valeur_saisie_cours =[];
			apiFactory.getAPIgeneraliserREST("cours_de_change/index","requete_titre",Number(20)).then(function(result) {
				vm.titre_valeur_cours =result.data.response;
				
				apiFactory.getAPIgeneraliserREST("cours_de_change/index","requete_donnees_croisee",Number(10),"date_debut",moment(vm.filtre.date_debut).format('YYYY-MM-DD'),"date_fin",moment(vm.filtre.date_fin).format('YYYY-MM-DD')).then(function(result) {
					vm.valeur_saisie_cours =result.data.response;
					vm.affiche_load=false;
				
				});
			});	
		}	
	    //convertion date format
	    vm.converDateAffiche = function(dat) {
	    	var date_final= moment(new Date(dat)).format('DD/MM/YYYY');   
	    	return date_final;	
	    }
	    vm.converDateBasededonnees = function(dat) {
	    	var date_final= moment(new Date(dat)).format('YYYY-MM-DD');	    
	    	return date_final;	
	    }
		// Début Fonction concernant la fenetre modal
		$scope.showTabDialog = function(ev,id) {
			if(!id) return;
			$mdDialog.show({
			  controller: DialogController,
			  templateUrl: 'app/main/population/administration/cours_de_change/ShowTabDialog.html',
			  parent: angular.element(document.body),
			  targetEvent: ev,
			  clickOutsideToClose:false
			}).then(function(listedevise,date_cours) {
			}, function() {
				$scope.status = 'You cancelled the dialog.';
			});
		};
		//Debut Fonction fenêtre modal
		function DialogController($scope, $mdDialog,DTOptionsBuilder) {
			$scope.dtOptions = {
				dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
				pagingType: 'simple',
				autoWidth: false,
				responsive: true 
			};
			$scope.dtOptions = DTOptionsBuilder.newOptions().withDisplayLength(25).withOption('bLengthChange', false);
			$scope.titre_cols =[{"titre":"Devise"},{"titre":"Cours (Ar)"}];
			$scope.date_max=vm.date_now;
			$scope.date_cours=vm.filtre.date_fin;
			// Initialisation valeur date et valeur cours de change par devise
			$scope.listedevise=vm.alldevise;
			for(var i=0;i< $scope.listedevise.length;i++) {
				$scope.listedevise[i].cours=null;
			} 
			$scope.hide = function() {
				$mdDialog.hide();
			};
			$scope.cancel = function() {
				$mdDialog.cancel();
			};
			$scope.answer = function(reponse,date_saisie) {
				$rootScope.reponse=reponse;
				$rootScope.date_saisie=date_saisie;
			
				$rootScope.ajoutersaisiecours($rootScope.reponse,$rootScope.date_saisie);
				$mdDialog.hide();
			};
		}
    }
})();

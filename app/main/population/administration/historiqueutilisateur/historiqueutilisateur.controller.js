(function ()
{
    'use strict';
	// Historique de navigation de chaque utilisateur
    angular
        .module('app.population.administration.historiqueutilisateur')
        .controller('HistoriqueutilisateurController', HistoriqueutilisateurController);

    /** @ngInject */
    function HistoriqueutilisateurController(apiFactory, $location, $mdDialog, $scope,$cookieStore)
    {      	
      	var vm    = this;
      	vm.filtre = {};
      	vm.filtre.date_fin = new Date() ;
      	vm.date_now 	   = new Date() ;
      	vm.allhistorique   = [] ;
      	vm.id_utilisateur  = $cookieStore.get('id');
      	vm.affiche_load    = false ;

        
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
			action:"Consultation : Historique utilisateur",
			id_utilisateur:vm.id_utilisateur
		});
		//factory
		apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
		});
	    
	    vm.historique_column = [/*{titre: "Utilisateur"},*/{titre: "Action"},{titre: "Date"}]; //col table
    	
	    //recuperation historique
    	apiFactory.getAll("utilisateurs/index").then(function(result)
	    {
	        vm.allutilisateur = result.data.response;
	    });


    	//recuperation donnée filtré
	    vm.analyse_filtre = function(filtre)
	    {
	    	vm.affiche_load = true ;
	    	var date_fin= moment(filtre.date_fin).format('YYYY-MM-DD HH:mm');
	    	var date_debut= moment(filtre.date_debut).format('YYYY-MM-DD');

	        apiFactory.getAPIgeneraliserREST("historique_utilisateur/index","menu","filtrehistorique",
	          	"date_debut",date_debut,"date_fin",date_fin,"id_utilisateur",filtre.id_utilisateur).then(function(result)
	        {
	            vm.affiche_load = false ;
	            vm.allhistorique  = result.data.response;
	            var utilisateur = vm.allutilisateur.filter(function(obj)
	            {
					return obj.id == filtre.id_utilisateur;
				});
	            //add historique
				var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
				var datas = $.param({
					action:"Consultation : Historique utilisateur de nom de "+ utilisateur[0].nom,
					id_utilisateur:vm.id_utilisateur
				});
				//factory
				apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
				});
	        });

	        
	    }
	    //convertion date format
	    vm.converDate = function(dat)
	    {
	    	var date_final= moment(new Date(dat)).format('DD/MM/YYYY HH:mm');
	    
	    	return date_final;	
	    }
	    vm.sauvegarde_historique = function(filtre)  {
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var datas = $.param({
				date_debut:moment(filtre.date_debut).format('YYYY-MM-DD'),
				date_fin:moment(filtre.date_debut).format('YYYY-MM-DD'),
				id_utilisateur:vm.id_utilisateur,      
				sauvegarde: 1,
			});       
			//factory historique_utilisateur
			apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
				vm.action="Sauvegarde historique utilisateur du : " + moment(filtre.date_debut).format('DD/MM/YYYY') + " au : " + moment(filtre.date_fin).format('DD/MM/YYYY');
				//add historique
				var config = {
					headers : {
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
					}
				};
				var datas = $.param({
					action:vm.action,
					id_utilisateur:vm.id_utilisateur
				});
				//factory
				apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
				});				
			}).error(function (data) {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
		}
    }
})();

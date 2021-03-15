(function ()
{
    'use strict';

    angular
        .module('app.pfss.administration.profil')
        .controller('ProfilController', ProfilController);

    /** @ngInject */
    function ProfilController(apiFactory, $location, $mdDialog, $scope, $cookieStore,apiUrl,$rootScope,$http)//, uploadService)
    {
		var vm = this;
     

		var id_user = $cookieStore.get('id');

        vm.etat_load = false ;
		// Récupération des informations concenrnant un utilisateur
  		apiFactory.getOne("utilisateurs/index", id_user).then(function(result)  
	      {
	        vm.user = result.data.response;
	        vm.profil = {} ;
	        vm.profil.nom = vm.user.nom ;
	        vm.profil.prenom = vm.user.prenom ;
	        vm.profil.email = vm.user.email ;
	      });

  		vm.ajout = function(profil)
  		{ 
            vm.etat_load = true ;		
  			var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };

            var datas = $.param(
            {
            	profil:1,
                id:vm.user.id,      
                nom: profil.nom,
                prenom: profil.prenom,
                email: profil.email,
                password: profil.mdp
                
            });
			// Mise à jour compte utilisateur
            apiFactory.add("utilisateurs/index",datas, config)
                .success(function (data) 
                {
                    vm.etat_load = false ;
                    var confirm = $mdDialog.confirm()
                        .title('Mis à jour du compte avec succès!')
                        .textContent('Votre nouveau mot de passe est : '+profil.mdp)
                        .ariaLabel('Lucky day')
                        .clickOutsideToClose(true)
                        .parent(angular.element(document.body))
                        .ok('ok');
                    $mdDialog.show(confirm).then(function() {
                                       
                    }, function() {
                    //alert('rien');
                    });

                });
  		}        
    }
})();

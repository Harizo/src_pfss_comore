(function ()
{
    'use strict';
	// Premier login d'un utilisateur
    angular
        .module('app.population.auth.firstlogin')
        .controller('FirstloginController', FirstloginController);

    /** @ngInject */
    function FirstloginController($rootScope, $mdDialog, apiFactory, loginService) {
		var vm = this;
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
		//enregistrer
		vm.enregistrer = enregistrer;
		function enregistrer(data) {
			if(data.password==data.confirm_password) {
				loginService.first_login(data);
			} else {
				vm.showAlert("INFORMATION","Non concordance entre Mot de passe et confirmation mot de passe !.Veuillez corriger.Merci");
			}
		}

    }
})();

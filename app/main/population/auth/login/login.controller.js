(function ()
{
    'use strict';

    angular
        .module('app.population.auth.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController($rootScope, apiFactory, loginService,$mdDialog)
    {
      var vm = this;

      $rootScope.etat_load = false ;
      $rootScope.afficher_deconnecte_compte = false ;

     

      //enregistrer
      vm.enregistrer = enregistrer;

      function enregistrer(data)
      {
        $rootScope.etat_load = true ;
		  // Connexion à l'application
         loginService.sing_in(data);
      }

      vm.deconnecter_autre_compte = function(data_html)
      {
        $mdDialog.show({
                template           : '<md-dialog>' +
                '  <md-dialog-content><h1 class="md-warn-fg" translate="LOGIN.load_titre">titre</h1><div><pre translate="LOGIN.load_corps">corps</pre></div></md-dialog-content>' +
                '  </md-dialog-actions>' +
                '</md-dialog>',
                parent             : angular.element('body'),
                //targetEvent        : ev,
                clickOutsideToClose: false
              });

        apiFactory.getParamsDynamic("mail/index?actif=5&courriel="+data_html.email).then(function(data) 
        {
            if (data.data == 0) 
            {
              alert("email non envoyé,veuillez réessayer!");
            }
            else
            {
              $rootScope.afficher_deconnecte_compte = false ;
              alert("email envoyé!");
            }
            $mdDialog.hide();
        });
      }

    }
})();

(function ()
{
    'use strict';
	// Mot de passe oublié : réinitialisation mot de passe
    angular
        .module('app.population.auth.forgot-password')
        .controller('ForgotPasswordController', ForgotPasswordController);

    /** @ngInject */
    function ForgotPasswordController(apiFactory, $location, $mdDialog,$cookieStore)
    {
      var vm = this;
      vm.send = send;

      function send(email, ev)
      {
		  // Récupération d'un utilisateur par e-mail en entrée
        apiFactory.getParamsDynamic("utilisateurs/index?courriel="+email)
          .success(function(result) {

            if(result.status == false)
            {
              vm.email_exist = 0;
            }
            else
            {
              /*$cookieStore.put('etat_reset',1);
              $cookieStore.put('crl',email);*/
              vm.email_exist = 1;

              $mdDialog.show({
                template           : '<md-dialog>' +
                '  <md-dialog-content><h1 class="md-warn-fg" translate="FORGOTPASSWORD.loading.titre">titre</h1><div><pre translate="FORGOTPASSWORD.loading.msg">corps</pre></div></md-dialog-content>' +
                '  </md-dialog-actions>' +
                '</md-dialog>',
                parent             : angular.element('body'),
                targetEvent        : ev,
                clickOutsideToClose: false
              });

              apiFactory.getParamsDynamic("mail/index?actif=2&courriel="+result.response.email+"&token="+result.response.token).then(function() {
                //$location.path('/auth/login');
                $mdDialog.hide();
              });
            }


          });
      }
    }
})();

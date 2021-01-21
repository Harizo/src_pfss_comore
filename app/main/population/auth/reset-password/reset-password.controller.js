(function ()
{
    'use strict';

    angular
        .module('app.population.auth.reset-password')
        .controller('ResetPasswordController', ResetPasswordController);

    /** @ngInject */
    function ResetPasswordController(apiFactory, $stateParams, $location,$cookieStore)
    {
      var vm = this;
      vm.form = {};



      vm.reinit = reinit;

      /*if ($cookieStore.get('etat_reset') == 1) 
      {
          $cookieStore.remove('etat_reset');
      }

      if ($cookieStore.get('crl')) 
      {

        vm.form.email = $cookieStore.get('crl') ;

        $cookieStore.remove('crl');
      }*/

      function reinit(utilisateur)
      {
        /*apiFactory.getParamsDynamic("utilisateurs/index?courriel="+utilisateur.email)
        .success(function(result) 
        {*/
          // Réinitialisation mot de passe  
          apiFactory.getParamsDynamic('utilisateurs/index?reinitpwd='+utilisateur.passwordConfirm+'&reinitpwdtoken='+$stateParams.token)
          //apiFactory.getParamsDynamic('utilisateurs/index?courriel_reset='+utilisateur.email+'&reinitpwd='+utilisateur.passwordConfirm+'&reinitpwdtoken='+result.response.token)
          .success(function() {
          $location.path('/auth/login');

          });
        //});
      };
    }
})();

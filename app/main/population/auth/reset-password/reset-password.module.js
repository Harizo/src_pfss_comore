(function ()
{
    'use strict';

    angular
        .module('app.pfss.auth.reset-password', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_auth_reset-password', {
            url      : '/auth/resetpassword?token',
            views    : {
                'main@'                                : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pfss_auth_reset-password': {
                    templateUrl: 'app/main/pfss/auth/reset-password/reset-password.html',
                    controller : 'ResetPasswordController as vm'
                }
            },
            bodyClass: 'reset-password',
            data : {
              authorizer : false,
              permitted : ["USER"],
              page: "Réinitialisation mot de passe"
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pfss/auth/reset-password');
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.population.auth.forgot-password', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_auth_forgot-password', {
            url      : '/auth/forgot-password',
            views    : {
                'main@'                                 : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.population_auth_forgot-password': {
                    templateUrl: 'app/main/population/auth/forgot-password/forgot-password.html',
                    controller : 'ForgotPasswordController as vm'
                }
            },
            bodyClass: 'forgot-password',
            data : {
              authorizer : false,
              permitted : ["USER"],
              page: "Mot de passe oublié"
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/population/auth/forgot-password');
    }

})();

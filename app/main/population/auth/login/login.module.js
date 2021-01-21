(function ()
{
    'use strict';

    angular
        .module('app.population.auth.login', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider)
    {
        // State
        $stateProvider.state('app.population_auth_login', {
            url      : '/auth/login',
            views    : {
                'main@'                       : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.population_auth_login': {
                    templateUrl: 'app/main/population/auth/login/login.html',
                    controller : 'LoginController as vm'
                }
            },
            bodyClass: 'login',
            data : {
              authorizer : false,
              permitted : ["USER"],
              page: "Authentification"
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/population/auth/login');
    }

})();

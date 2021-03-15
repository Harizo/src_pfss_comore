(function ()
{
    'use strict';

    angular
        .module('app.pfss.auth.firstlogin', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_auth_first_login', {
            url      : '/auth/firstlogin',
            views    : {
                'main@'                       : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pfss_auth_first_login': {
                    templateUrl: 'app/main/pfss/auth/firstlogin/firstlogin.html',
                    controller : 'FirstloginController as vm'
                }
            },
            bodyClass: 'firstlogin',
            data : {
              authorizer : false,
              permitted : ["USER"],
              page: "Modif MDP par défaut"
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pfss/auth/firstlogin');
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.population.auth.lock', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_auth_lock', {
            url      : '/auth/lock',
            views    : {
                'main@'                      : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.population_auth_lock': {
                    templateUrl: 'app/main/population/auth/lock/lock.html',
                    controller : 'LockController as vm'
                }
            },
            bodyClass: 'lock',
            data : {
              authorizer : false,
              permitted : ["USER"],
              page: "Activation"
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/population/auth/lock');
    }

})();

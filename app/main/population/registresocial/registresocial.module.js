(function ()
{
    'use strict';

    angular
        .module('app.population.registresocial', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_registresocial', {
            url      : '/registresocial',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/population/registresocial/registresocial.html',
                    controller : 'RegistresocialController as vm'
                }
            },
            bodyClass: 'registresocial',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Régistre social"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('population.registresocial', {
            title: 'Régistre social',
            icon  : 'icon-swap-horizontal',
            state: 'app.population_registresocial',
			  weight: 3
        });
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.population.importdecoupage.decoupagefokontany', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_importdecoupage_decoupagefokontany', {
            url      : '/importdecoupage/import-fokontany',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/population/importdecoupage/decoupagefokontany/decoupagefokontany.html',
                    controller : 'DecoupagefokontanyController as vm'
                }
            },
            bodyClass: 'decoupagefokontany',
            data : {
              authorizer : true,
              permitted : ["ADMIN","VLD"],
              page: "Import-Fokontany"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('population.importdecoupage.decoupagefokontany', {
            title: 'Fokontany',
            icon  : 'icon-swap-horizontal',
            state: 'app.population_importdecoupage_decoupagefokontany',
			weight: 4
        });
    }

})();

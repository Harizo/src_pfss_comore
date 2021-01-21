(function ()
{
    'use strict';

    angular
        .module('app.population.importdecoupage.decoupagedistrict', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_importdecoupage_decoupagedistrict', {
            url      : '/importdecoupage/import-district',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/population/importdecoupage/decoupagedistrict/decoupagedistrict.html',
                    controller : 'DecoupagedistrictController as vm'
                }
            },
            bodyClass: 'decoupagedistrict',
            data : {
              authorizer : true,
              permitted : ["ADMIN","VLD"],
              page: "Import-District"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('population.importdecoupage.decoupagedistrict', {
            title: 'District',
            icon  : 'icon-swap-horizontal',
            state: 'app.population_importdecoupage_decoupagedistrict',
			weight: 2
        });
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.population.importdecoupage.exportdecoupage', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_importdecoupage_exportdecoupage', {
            url      : '/importdecoupage/export-decoupage',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/population/importdecoupage/exportdecoupage/exportdecoupage.html',
                    controller : 'ExportdecoupageController as vm'
                }
            },
            bodyClass: 'exportdecoupage',
            data : {
              authorizer : true,
              permitted : ["ADMIN","VLD"],
              page: "Export-Découpage"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('population.importdecoupage.exportdecoupage', {
            title: 'Export-Découpage',
            icon  : 'icon-swap-horizontal',
            state: 'app.population_importdecoupage_exportdecoupage',
			weight: 5
        });
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.pfss.importdecoupage.exportdecoupage', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_importdecoupage_exportdecoupage', {
            url      : '/importdecoupage/export-decoupage',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/importdecoupage/exportdecoupage/exportdecoupage.html',
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
        msNavigationServiceProvider.saveItem('pfss.importdecoupage.exportdecoupage', {
            title: 'Export-Découpage',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_importdecoupage_exportdecoupage',
			weight: 5
        });
    }

})();

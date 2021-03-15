(function ()
{
    'use strict';

    angular
        .module('app.pfss.importdecoupage.decoupagedistrict', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_importdecoupage_decoupagedistrict', {
            url      : '/importdecoupage/import-district',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/importdecoupage/decoupagedistrict/decoupagedistrict.html',
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
        msNavigationServiceProvider.saveItem('pfss.importdecoupage.decoupagedistrict', {
            title: 'District',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_importdecoupage_decoupagedistrict',
			weight: 2
        });
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.pfss.importdecoupage.decoupagefokontany', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_importdecoupage_decoupagefokontany', {
            url      : '/importdecoupage/import-fokontany',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/importdecoupage/decoupagefokontany/decoupagefokontany.html',
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
        msNavigationServiceProvider.saveItem('pfss.importdecoupage.decoupagefokontany', {
            title: 'Fokontany',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_importdecoupage_decoupagefokontany',
			weight: 4
        });
    }

})();

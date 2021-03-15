(function ()
{
    'use strict';

    angular
        .module('app.pfss.importdecoupage.decoupageregion', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_importdecoupage_decoupageregion', {
            url      : '/importdecoupage/import-region',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/importdecoupage/decoupageregion/decoupageregion.html',
                    controller : 'DecoupageregionController as vm'
                }
            },
            bodyClass: 'decoupageregion',
            data : {
              authorizer : true,
              permitted : ["ADMIN","VLD"],
              page: "Import-Région"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.importdecoupage.decoupageregion', {
            title: 'Région',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_importdecoupage_decoupageregion',
			weight: 1
        });
    }

})();

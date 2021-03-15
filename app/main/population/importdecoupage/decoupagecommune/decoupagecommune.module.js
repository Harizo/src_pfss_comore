(function ()
{
    'use strict';

    angular
        .module('app.pfss.importdecoupage.decoupagecommune', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_importdecoupage_decoupagecommune', {
            url      : '/importdecoupage/import-commune',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/importdecoupage/decoupagecommune/decoupagecommune.html',
                    controller : 'DecoupagecommuneController as vm'
                }
            },
            bodyClass: 'decoupagecommune',
            data : {
              authorizer : true,
              permitted : ["ADMIN","VLD"],
              page: "Import-Commune"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.importdecoupage.decoupagecommune', {
            title: 'Commune',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_importdecoupage_decoupagecommune',
			weight: 3
        });
    }

})();

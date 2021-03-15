(function ()
{
    'use strict';

    angular
        .module('app.pfss.importdecoupage.importcoordonneescommune', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_importdecoupage_importcoordonneescommune', {
            url      : '/importdecoupage/import-Coordonnées-commune',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/importdecoupage/importcoordonneescommune/importcoordonneescommune.html',
                    controller : 'ImportcoordonneescommuneController as vm'
                }
            },
            bodyClass: 'importcoordonneescommune',
            data : {
              authorizer : true,
              permitted : ["ADMIN","VLD"],
              page: "Import-Coordonnées-commune"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.importdecoupage.importcoordonneescommune', {
            title: 'Import coordonnées commune',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_importdecoupage_importcoordonneescommune',
			weight: 6
        });
    }

})();

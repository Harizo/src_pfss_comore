(function ()
{
    'use strict';

    angular
        .module('app.pfss.mereleaderpereleader.visitedomicile', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_visitedomicile', {
            url      : '/mere-leader-pere-leader/visite-a-domicile',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/mereleaderpereleader/visitedomicile/visitedomicile.html',
                    controller : 'VisitedomicileController as vm'
                }
            },
            bodyClass: 'visitedomicile',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Visite à domicile"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.mereleaderpereleader.visitedomicile', {
            title: 'Visite à domicile',
            icon  : 'icon-tile-four',
            state: 'app.pfss_visitedomicile',
			weight:3,
        });
    }

})();

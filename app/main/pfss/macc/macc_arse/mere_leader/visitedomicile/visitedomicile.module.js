(function ()
{
    'use strict';

    angular
        .module('app.pfss.macc.macc_arse.mere_leader.visitedomicile', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_visitedomicile', {
            url      : '/mere-leader-pere-leader/visite-a-domicile',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/macc/macc_arse/mere_leader/visitedomicile/visitedomicile.html',
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
        msNavigationServiceProvider.saveItem('pfss.macc.macc_arse.mere_leader.visitedomicile', {
            title: 'Visite à domicile',
            icon  : 'icon-tile-four',
            state: 'app.pfss_visitedomicile',
			weight:3,
        });
    }

})();

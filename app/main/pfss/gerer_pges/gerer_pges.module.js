(function ()
{
    'use strict';

    angular
        .module('app.pfss.gerer_pges', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_gerer_pges', {
            url      : '/gerer_pges',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/gerer_pges/gerer_pges.html',
                    controller : 'Gerer_pgesController as vm'
                }
            },
            bodyClass: 'gerer_pges',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Gérer PGES"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.gerer_pges', {
            title: 'Gérer PGES',
            icon  : 'icon-data',
            state: 'app.pfss_gerer_pges',
			weight:8,
        });
    }

})();

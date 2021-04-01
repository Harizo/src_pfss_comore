(function ()
{
    'use strict';

    angular
        .module('app.pfss.contrat_ugp_agex', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_contrat_ugp_agex', {
            url      : '/contrat-ugp-agex',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/contrat_ugp_agex/contrat_ugp_agex.html',
                    controller : 'contrat_ugp_agexController as vm'
                }
            },
            bodyClass: 'contratugpagex',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Contrat ugp/agex"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.contrat_ugp_agex', {
            title: 'Gérer AGEX',
            icon  : 'icon-tile-four',
            state: 'app.pfss_contrat_ugp_agex',
			weight:8,
        });
    }

})();

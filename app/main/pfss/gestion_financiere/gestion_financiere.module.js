(function ()
{
    'use strict';

    angular
        .module('app.pfss.gestion_financiere', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_gestion_financiere', {
            url      : '/gestion-financiere',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/gestion_financiere/gestion_financiere.html',
                    controller : 'gestion_financiereController as vm'
                }
            },
            bodyClass: 'gestion_financiere',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Suivi budgétaire"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.gestion_financiere', {
            title: 'Suivi budgétaire',//gestion financiere ntable
            icon  : 'icon-nfc-variant',
            state: 'app.pfss_gestion_financiere',
			weight:8
        });
    }

})();

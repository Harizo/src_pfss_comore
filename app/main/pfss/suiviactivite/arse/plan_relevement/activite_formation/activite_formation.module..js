(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_arse.plan_relevement.activite_formation', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suivi_arse_plan_relevementactivite_formation', {
            url      : '/suivi-activite/arse/plan-relevement/activite-formation-choisie',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/arse/plan_relevement/activite_formation/activite_formation.html',
                    controller : 'ActiviteformationController as vm'
                }
            },
            bodyClass: 'suivi_arse_plan_relevementactivite_formation',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Activité/Formation choisie"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.plan_relevement.activite_formation', {
            title: 'Activité/Formation choisie',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suivi_arse_plan_relevementactivite_formation',
			weight: 1
        });
    }

})();

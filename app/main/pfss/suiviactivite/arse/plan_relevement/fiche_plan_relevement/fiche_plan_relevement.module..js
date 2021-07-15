(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_arse.plan_relevement.fiche_plan_relevement', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suivi_arse_plan_relevementfiche_plan_relevement', {
            url: '/suivi-activite/arse/plan-relevement/fiche-plan-relevement',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/arse/plan_relevement/fiche_plan_relevement/fiche_plan_relevement.html',
                    controller : 'ficheplanrelevementController as vm'
                }
            },
            bodyClass: 'suivi_arse_plan_relevementfiche_plan_relevement',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Fiche plan de relèvement"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.suivi_technique.fiche_plan_relevement', {
            title: 'Fiche plan relèvement',
            icon  : 'icon-newspaper',
            state: 'app.pfss_suivi_arse_plan_relevementfiche_plan_relevement',
			weight: 4
        });
    }

})();

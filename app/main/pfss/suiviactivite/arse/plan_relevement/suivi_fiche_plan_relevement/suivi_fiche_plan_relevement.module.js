(function () {
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_arse.plan_relevement.suivi_fiche_plan_relevement', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider) {
        // State
        $stateProvider.state('app.pfss_suivi_arse_plan_relevementsuivi_fiche_plan_relevement', {
            url: '/suivi-activite/arse/plan-relevement/suivi-fiche-prelevement',
            views: {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/arse/plan_relevement/suivi_fiche_plan_relevement/suivi_fiche_plan_relevement.html',
                    controller: 'suivi_fiche_plan_relevementController as vm'
                }
            },
            bodyClass: 'suivi_arse_plan_relevementsuivi_fiche_plan_relevement',
            data: {
                authorizer: true,
                permitted: ["USER", "PERSONNEL", "ADMIN"],
                page: "Suivi Fiche plan de relèvement"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.suivi_technique.suivi_fiche_plan_relevement', {
            title: 'Suivi Fiche plan relèvement',
            icon: 'icon-newspaper',
            state: 'app.pfss_suivi_arse_plan_relevementsuivi_fiche_plan_relevement',
            weight: 4
        });
    }

})();

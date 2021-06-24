(function () {
    'use strict';

    angular
        .module('app.pfss.act.fiche_travailleur', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider) {
        // State
        $stateProvider.state('app.pfss_act_fiche_travailleur', {
            url: '/act/fiche-travailleur',
            views: {
                'content@app': {
                    templateUrl: 'app/main/pfss/act/fiche_travailleur/fiche_travailleur.html',
                    controller: 'fiche_travailleurController as vm'
                }
            },
            bodyClass: 'fiche_travailleur',
            data: {
                authorizer: true,
                permitted: ["USER", "PERSONNEL", "ADMIN"],
                page: "Fiche travailleur"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.act.fiche_travailleur', {
            title: 'Fiche travailleur',
            icon: 'icon-swap-horizontal',
            state: 'app.pfss_act_fiche_travailleur',
            weight: 1
        });
    }

})();

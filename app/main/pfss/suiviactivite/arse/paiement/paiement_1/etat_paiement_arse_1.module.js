(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_arse.paiement_arse.paiement_arse_1', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suivi_arse_paiement1_etat_paiement', {
            url      : '/suivi-activite/arse/etat-paiement/premier-paiement',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/arse/paiement/paiement_1/etat_paiement_arse_1.html',
                    controller : 'EtatpaiementController as vm'
                }
            },
            bodyClass: 'suivi_arse_paiement1_etat_paiement',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "ARSE Premier paiement"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.paiement_arse.paiement_arse_1', {
            title: 'Premier paiement',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suivi_arse_paiement1_etat_paiement',
			weight: 1
        });
    }

})();

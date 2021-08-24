(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_arse.paiement_arse.paiement_arse_3', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suivi_arse_paiement3_etat_paiement', {
            url      : '/suivi-activite/arse/etat-paiement/troisieme-paiement',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/arse/paiement/paiement_1/etat_paiement_arse_1.html',
                    controller : 'EtatpaiementController as vm'
                }
            },
            bodyClass: 'suivi_arse_paiement3_etat_paiement',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "ARSE Troisième paiement"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.paiement_arse.paiement_arse_3', {
            title: 'Troisième paiement',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suivi_arse_paiement3_etat_paiement',
			weight: 3
        });
    }

})();

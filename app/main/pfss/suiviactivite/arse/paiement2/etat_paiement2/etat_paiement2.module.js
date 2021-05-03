(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_arse.paiement2.etat_paiement2', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suivi_arse_paiement2_etat_paiement2', {
            url      : '/suivi-activite/arse/deuxieme-paiement/etat-paiement',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/arse/paiement1/etat_paiement/etat_paiement.html',
                    controller : 'EtatpaiementController as vm'
                }
            },
            bodyClass: 'suivi_arse_paiement2_etat_paiement2',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Etat de paiement"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.paiement2.etat_paiement2', {
            title: 'Etat de paiement',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suivi_arse_paiement2_etat_paiement2',
			weight: 2
        });
    }

})();

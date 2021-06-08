(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_arse.paiement3.etat_paiement3', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suivi_arse_paiement3_etat_paiement3', {
            url      : '/suivi-activite/arse/troisieme-paiement/etat-paiement-3',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/arse/paiement1/etat_paiement/etat_paiement.html',
                    controller : 'EtatpaiementController as vm'
                }
            },
            bodyClass: 'suivi_arse_paiement3_etat_paiement3',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Etat de paiement"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.paiement3.etat_paiement3', {
            title: 'Etat de paiement',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suivi_arse_paiement3_etat_paiement3',
			weight: 3
        });
    }

})();

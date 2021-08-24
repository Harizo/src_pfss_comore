(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_covid.paiement_covid.paiement_covid_3', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suivi_covid_paiement3_etat_paiement', {
            url      : '/suivi-activite/arse/etat-paiement/troisieme-paiement',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/arse/paiement/paiement_1/etat_paiement_arse_1.html',
                    controller : 'EtatpaiementController as vm'
                }
            },
            bodyClass: 'suivi_covid_paiement3_etat_paiement',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "COVID Troisième paiement"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_covid.paiement_covid.paiement_covid_3', {
            title: 'Troisième paiement',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suivi_covid_paiement3_etat_paiement',
			weight: 3
        });
    }

})();

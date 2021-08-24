(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_covid.paiement_covid.paiement_covid_2', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suivi_covid_paiement2_etat_paiement', {
            url      : '/suivi-activite/covid/etat-paiement/deuxieme-paiement',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/arse/paiement/paiement_1/etat_paiement_arse_1.html',
                    controller : 'EtatpaiementController as vm'
                }
            },
            bodyClass: 'suivi_covid_paiement2_etat_paiement',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "COVID Deuxième paiement"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_covid.paiement_covid.paiement_covid_2', {
            title: 'Deuxième paiement',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suivi_covid_paiement2_etat_paiement',
			weight: 2
        });
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_covid.paiement1.etat_paiement', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suivi_covid_paiement1_etat_paiement', {
            url      : '/suivi-activite/covid/premier-paiement/etat-paiement-1',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/arse/paiement1/etat_paiement/etat_paiement.html',
                    controller : 'EtatpaiementController as vm'
                }
            },
            bodyClass: 'suivi_covid_paiement1_etat_paiement',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Etat de paiement"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_covid.paiement1.etat_paiement', {
            title: 'Etat de paiement',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suivi_covid_paiement1_etat_paiement',
			weight: 2
        });
    }

})();

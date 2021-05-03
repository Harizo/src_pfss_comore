(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_covid.paiement2.etat_paiement2', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suivi_covid_paiement2_etat_paiement2', {
            url      : '/suivi-activite/covid/premier-paiement/etat-paiement',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/covid/paiement2/etat_paiement2/etat_paiement2.html',
                    controller : 'Etatpaiement2Controller as vm'
                }
            },
            bodyClass: 'suivi_covid_paiement2_etat_paiement2',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Etat de paiement"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_covid.paiement2.etat_paiement2', {
            title: 'Etat de paiement',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suivi_covid_paiement2_etat_paiement2',
			weight: 2
        });
    }

})();

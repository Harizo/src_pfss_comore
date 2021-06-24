(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_covid.paiement2.fiche_recepteur2', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {  
        // State
        $stateProvider.state('app.pfss_suivi_covid_paiement2_fiche_recepteur2', {
            url      : '/suivi-activite/covid/deuxieme-fiche-recepteur/fiche-recepteur-2',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/arse/paiement1/fiche_recepteur/fiche_recepteur.html',
                    controller : 'FicherecepteurController as vm'
                }
            },
            bodyClass: 'suivi_covid_paiement2_fiche_recepteur2',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Fiche récepteur 2"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_covid.paiement2.fiche_recepteur2', {
            title: 'Fiche récepteur',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suivi_covid_paiement2_fiche_recepteur2',
			weight: 1
        });
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_arse.paiement3.fiche_recepteur3', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suivi_arse_paiement3_fiche_recepteur3', {
            url      : '/suivi-activite/arse/troisieme-fiche-recepteur-paiement/fiche-recepteur',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/arse/paiement3/fiche_recepteur3/fiche_recepteur3.html',
                    controller : 'Ficherecepteur3Controller as vm'
                }
            },
            bodyClass: 'suivi_arse_paiement3_fiche_recepteur3',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Fiche récepteur 3"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.paiement3.fiche_recepteur3', {
            title: 'Fiche récepteur',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suivi_arse_paiement3_fiche_recepteur3',
			weight: 1
        });
    }

})();

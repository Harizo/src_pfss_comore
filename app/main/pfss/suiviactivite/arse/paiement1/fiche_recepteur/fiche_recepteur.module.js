(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_arse.paiement1.fiche_recepteur', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suivi_arse_paiement1_fiche_recepteur', {
            url      : '/suivi-activite/arse/premier-fiche-recepteur/fiche-recepteur-1',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/arse/paiement1/fiche_recepteur/fiche_recepteur.html',
                    controller : 'FicherecepteurController as vm'
                }
            },
            bodyClass: 'suivi_arse_paiement1_fiche_recepteur',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Fiche récepteur"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.paiement1.fiche_recepteur', {
            title: 'Fiche récepteur',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suivi_arse_paiement1_fiche_recepteur',
			weight: 1
        });
    }

})();

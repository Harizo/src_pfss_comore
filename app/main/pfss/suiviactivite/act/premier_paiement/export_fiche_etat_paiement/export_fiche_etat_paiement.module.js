(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_act.premier_paiement.export_fiche_etat_paiement', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suiviactivite_act_export_fiche_etat_paiement', {
            url      : '/suivi-activite/act/premier-paiement/export-fiche-etat-de-paiement',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/act/premier_paiement/export_fiche_etat_paiement/export_fiche_etat_paiement.html',
                    controller : 'Export_fiche_etat_paiementController as vm'
                }
            },
            bodyClass: 'export_fich_eetat_paiement',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Fiche paiement ACT"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_act.premier_paiement.export_fiche_etat_paiement', {
            title: 'Fiche/Etat de paiement',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suiviactivite_act_export_fiche_etat_paiement',
			weight: 3
        });
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_act.premier_paiement.export_fiche_etat_presence', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suiviactivite_fiche_etat_presence', {
            url      : '/suivi-activite/act/premier-paiement/export-fiche-de-presence',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/act/premier_paiement/export_fiche_etat_presence/export_fiche_etat_presence.html',
                    controller : 'Export_fiche_etat_presenceController as vm'
                }
            },
            bodyClass: 'export_fiche_etat_presence',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Fiche présence ACT"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_act.premier_paiement.export_fiche_etat_presence', {
            title: 'Fiche/Etat de présence',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suiviactivite_fiche_etat_presence',
			weight: 1
        });
    }

})();

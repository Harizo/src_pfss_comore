(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_act.premier_paiement.import_etat_presence', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suiviactivite_act_import_etat_presence', {
            url      : '/suivi-activite/act/premier-paiement/enregistrer-etat-de-presence',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/act/premier_paiement/import_etat_presence/import_etat_presence.html',
                    controller : 'Import_etat_presenceController as vm'
                }
            },
            bodyClass: 'import_etat_presence',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Enregistrer état de présence"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_act.premier_paiement.import_etat_presence', {
            title: 'Enregistrer Etat de présence',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suiviactivite_act_import_etat_presence',
			weight: 2
        });
    }

})();

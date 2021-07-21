(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_act.deuxieme_paiement.import_etat_paiement', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suiviactivite_act_import_etat_paiement2', {
            url      : '/suivi-activite/act/deuxieme-paiement/enregistrer-etat-de-paiement',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/act/premier_paiement/import_etat_paiement/import_etat_paiement.html',
                    controller : 'Import_etat_paiementController as vm'
                }
            },
            bodyClass: 'import_etat_paiement',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Import état paiement"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_act.deuxieme_paiement.import_etat_paiement', {
            title: 'Enregistrer Etat de paiement',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suiviactivite_act_import_etat_paiement2',
			weight: 4
        });
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_act.importetat.importetatpaiement', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suiviactivite_act_importetatpaiement', {
            url      : '/suivi-activite/act/import-etat/import-etat-de-paiement',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/act/importetat/importetatpaiement/importetatpaiement.html',
                    controller : 'ImportetatpaiementController as vm'
                }
            },
            bodyClass: 'importetatpaiement',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Import état paiement"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_act.importetat.importetatpaiement', {
            title: 'Import Etat de paiement ACT',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suiviactivite_act_importetatpaiement',
			weight: 2
        });
    }

})();

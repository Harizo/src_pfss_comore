(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.importetat.importetatpaiement', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suiviactivite_importetatpaiement', {
            url      : '/suivi-activite/import-etat/import-etat-de-paiement',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/importetat/importetatpaiement/importetatpaiement.html',
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
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.importetat.importetatpaiement', {
            title: 'Import Etat de paiement',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suiviactivite_importetatpaiement',
			weight: 2
        });
    }

})();

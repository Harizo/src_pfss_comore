(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.exportficheetat.exportficheetatpaiement', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suiviactivite_exportficheetatpaiement', {
            url      : '/suivi-activite/export-fiche-etat/fiche-etat-de-paiement',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/exportficheetat/exportficheetatpaiement/exportficheetatpaiement.html',
                    controller : 'ExportficheetatpaiementController as vm'
                }
            },
            bodyClass: 'exportficheetatpaiement',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Fiche présence"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.exportficheetat.exportficheetatpaiement', {
            title: 'Fiche/Etat de paiement',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suiviactivite_exportficheetatpaiement',
			weight: 2
        });
    }

})();

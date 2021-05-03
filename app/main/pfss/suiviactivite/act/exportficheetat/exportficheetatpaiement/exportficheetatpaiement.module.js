(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_act.exportficheetat.exportficheetatpaiement', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suiviactivite_act_exportficheetatpaiement', {
            url      : '/suivi-activite/act/export-fiche-etat/fiche-etat-de-paiement',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/act/exportficheetat/exportficheetatpaiement/exportficheetatpaiement.html',
                    controller : 'ExportficheetatpaiementController as vm'
                }
            },
            bodyClass: 'exportficheetatpaiement',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Fiche présence ACT"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_act.exportficheetat.exportficheetatpaiement', {
            title: 'Fiche/Etat de paiement ACT',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suiviactivite_act_exportficheetatpaiement',
			weight: 2
        });
    }

})();

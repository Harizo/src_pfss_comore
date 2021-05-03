(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_act.exportficheetat.exportficheetatpresence', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suiviactivite_ficheetatpresence', {
            url      : '/suivi-activite/act/fiche-de-presence',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/act/exportficheetat/exportficheetatpresence/exportficheetatpresence.html',
                    controller : 'ExportficheetatpresenceController as vm'
                }
            },
            bodyClass: 'exportficheetatpresence',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Fiche présence ACT"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_act.exportficheetat.exportficheetatpresence', {
            title: 'Fiche/Etat de présence ACT',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suiviactivite_ficheetatpresence',
			weight: 1
        });
    }

})();

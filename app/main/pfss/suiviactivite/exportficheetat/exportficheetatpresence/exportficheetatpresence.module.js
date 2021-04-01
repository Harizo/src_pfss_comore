(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.exportficheetat.exportficheetatpresence', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suiviactivite_ficheetatpresence', {
            url      : '/suivi-activite/fiche-de-presence',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/exportficheetat/exportficheetatpresence/exportficheetatpresence.html',
                    controller : 'ExportficheetatpresenceController as vm'
                }
            },
            bodyClass: 'exportficheetatpresence',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Fiche présence"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.exportficheetat.exportficheetatpresence', {
            title: 'Fiche/Etat de présence',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suiviactivite_ficheetatpresence',
			weight: 1
        });
    }

})();

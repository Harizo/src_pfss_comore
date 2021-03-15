(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.fichepresence', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suiviactivite_fichepresence', {
            url      : '/suivi-activite/fiche-de-presence',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/fichepresence/fichepresence.html',
                    controller : 'FichepresenceController as vm'
                }
            },
            bodyClass: 'fichepresence',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Fiche présence"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.fichepresence', {
            title: 'Fiche de présence',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suiviactivite_fichepresence',
			weight: 1
        });
    }

})();

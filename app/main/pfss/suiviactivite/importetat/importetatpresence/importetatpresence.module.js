(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.importetat.importetatpresence', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suiviactivite_importetatpresence', {
            url      : '/suivi-activite/import-etat/import-etat-de-presence',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/importetat/importetatpresence/importetatpresence.html',
                    controller : 'ImportetatpresenceController as vm'
                }
            },
            bodyClass: 'importetatpresence',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Import état de présence"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.importetat.importetatpresence', {
            title: 'Import Etat de présence',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suiviactivite_importetatpresence',
			weight: 1
        });
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_act.importetat.importetatpresence', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suiviactivite_act_importetatpresence', {
            url      : '/suivi-activite/act/import-etat/import-etat-de-presence',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/act/importetat/importetatpresence/importetatpresence.html',
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
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_act.importetat.importetatpresence', {
            title: 'Import Etat de présence ACT',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suiviactivite_act_importetatpresence',
			weight: 1
        });
    }

})();

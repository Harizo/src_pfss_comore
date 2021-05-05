(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_arse.formation_technique.fiche_presence_formation', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suivi_arse_formation_technique_fiche_presence_formation', {
            url      : '/suivi-activite/arse/formation-technique-de-base/fiche-presence',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/arse/formation_technique/fiche_presence_formation/fiche_presence_formation.html',
                    controller : 'FichepresenceformationController as vm'
                }
            },
            bodyClass: 'suivi_arse_formation_technique_fiche_presence_formation',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Fiche présence formation"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.formation_technique.fiche_presence_formation', {
            title: 'Fiche de présence',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suivi_arse_formation_technique_fiche_presence_formation',
			weight: 1
        });
    }

})();

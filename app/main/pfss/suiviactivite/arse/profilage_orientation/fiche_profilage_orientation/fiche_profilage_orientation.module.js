(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_arse.profilage_orientation.fiche_profilage_orientation', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suivi_arse_profilage_orientation_fiche_profilage_orientation', {
            url      : '/suivi-activite/arse/profilage-orientation/fiche-profilage-orientation',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/arse/profilage_orientation/fiche_profilage_orientation/fiche_profilage_orientation.html',
                    controller : 'Fiche_profilage_orientationController as vm'
                }
            },
            bodyClass: 'arse_profilage_orientation_fiche_profilage_orientation',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Fiche profilage orientation"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.profilage_orientation.fiche_profilage_orientation', {
            title: 'Fiche profilage orientation',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suivi_arse_profilage_orientation_fiche_profilage_orientation',
			weight: 1
        });
    }

})();

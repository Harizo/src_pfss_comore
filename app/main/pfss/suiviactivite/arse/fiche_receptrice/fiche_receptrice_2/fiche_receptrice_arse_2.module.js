(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_arse.fiche_receptrice.fiche_receptrice_2', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suivi_arse_fiche_receptrice_fiche_receptrice_2', {
            url      : '/suivi-activite/arse/fiche-receptrice/deuxieme-fiche-receptrice',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/arse/fiche_receptrice/fiche_receptrice_1/fiche_receptrice_arse_1.html',
                    controller : 'FicherecepteurController as vm'
                }
            },
            bodyClass: 'suivi_arse_fiche_receptrice_fiche_receptrice_2',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "ARSE Fiche réceptrice 2"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.fiche_receptrice.fiche_receptrice_2', {
            title: 'Fiche réceptrice 2',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suivi_arse_fiche_receptrice_fiche_receptrice_2',
			weight: 2
        });
    }

})();

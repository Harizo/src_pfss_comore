(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_arse.fiche_receptrice.fiche_receptrice_1', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suivi_arse_fiche_receptrice_fiche_receptrice_1', {
            url      : '/suivi-activite/arse/fiche-receptrice/premier-fiche-receptrice',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/arse/fiche_receptrice/fiche_receptrice_1/fiche_receptrice_arse_1.html',
                    controller : 'FicherecepteurController as vm'
                }
            },
            bodyClass: 'suivi_arse_fiche_receptrice_fiche_receptrice_1',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "ARSE Fiche réceptrice 1"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.fiche_receptrice.fiche_receptrice_1', {
            title: 'Fiche réceptrice 1',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suivi_arse_fiche_receptrice_fiche_receptrice_1',
			weight: 1
        });
    }

})();

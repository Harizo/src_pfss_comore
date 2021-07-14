(function ()
{
    'use strict';

    angular
        .module('app.pfss.macc.macc_arse.sensibilisation_espace_bien_etre.fiche_supervision_ebe_arse', [])        
        .config(config);
        var vs = {};
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_macc_macc_arse_sensibilisation_espace_bien_etre_fiche_supervision_ebe_arse', {
            url      : '/arse/fiche_supervision_ebe',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/macc/macc_arse/fiche_supervision_formation_ebe/fiche_supervision_formation_ebe.html',
                    controller : 'Fiche_supervision_formation_ebeController as vm'
                }
            },
            bodyClass: 'fiche_supervision_ebe',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "fiche_supervision ML arse"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.macc.macc_arse.sensibilisation_espace_bien_etre.fiche_supervision_ebe_arse', {
            title: 'Supervision formation EBE',
            icon  : 'icon-lumx',
            state: 'app.pfss_macc_macc_arse_sensibilisation_espace_bien_etre_fiche_supervision_ebe_arse',
			weight:1
        });
    }
    

})();

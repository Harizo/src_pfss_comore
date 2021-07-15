(function ()
{
    'use strict';

    angular
        .module('app.pfss.macc.macc_arse.formation_mere_leader.fiche_supervision_ml_arse', [])        
        .config(config);
        var vs = {};
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_macc_macc_arse_formation_mere_leader_fiche_supervision_ml_arse', {
            url      : '/arse/fiche_supervision_formation_ml',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/macc/macc_arse/fiche_supervision_formation_ml_cps/fiche_supervision_formation_ml_cps.html',
                    controller : 'Fiche_supervision_formation_ml_cpsController as vm'
                }
            },
            bodyClass: 'fiche_supervision_formation_ml',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Supervision formation ML/CPS"
            },
            id_sous_projet: 2,
            type_sous_projet: 'ARSE'
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.macc.macc_arse.formation_mere_leader.fiche_supervision_ml_arse', {
            title: 'Supervision formation ML/CPS',
            icon  : 'icon-lumx',
            state: 'app.pfss_macc_macc_arse_formation_mere_leader_fiche_supervision_ml_arse',
			weight:1
        });
    }
    

})();

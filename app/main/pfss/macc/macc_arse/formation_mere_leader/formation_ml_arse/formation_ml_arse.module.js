(function ()
{
    'use strict';

    angular
        .module('app.pfss.macc.macc_arse.formation_mere_leader.formation_ml_arse', [])        
        .config(config);
        var vs = {};
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_macc_macc_arse_formation_mere_leader_formation_ml_arse', {
            url      : '/arse/formation_ml',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/formation_ml/formation_ml.html',
                    controller : 'Formation_mlController as vm'
                }
            },
            bodyClass: 'contratagep_arse',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Formation ML arse"
            },
            id_sous_projet: 2,
            type_sous_projet: 'ARSE'
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.macc.macc_arse.formation_mere_leader.formation_ml_arse', {
            title: 'Formation ML',
            icon  : 'icon-lumx',
            state: 'app.pfss_macc_macc_arse_formation_mere_leader_formation_ml_arse',
			weight:2
        });
    }
    

})();

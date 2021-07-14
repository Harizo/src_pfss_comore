(function ()
{
    'use strict';

    angular
        .module('app.pfss.macc.macc_arse.sensibilisation_espace_bien_etre.planning_ebe_arse', [])        
        .config(config);
        var vs = {};
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_macc_macc_arse_sensibilisation_espace_bien_etre_planning_ebe_arse', {
            url      : '/arse/planning_ebe',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/planning_ebe/planning_ebe.html',
                    controller : 'Planning_ebeController as vm'
                }
            },
            bodyClass: 'contratagep_arse',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Planning ML arse"
            },
            id_sous_projet: 2,
            type_sous_projet: 'ARSE'
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.macc.macc_arse.sensibilisation_espace_bien_etre.planning_ebe_arse', {
            title: 'Planning EBE ARSE',
            icon  : 'icon-lumx',
            state: 'app.pfss_macc_macc_arse_sensibilisation_espace_bien_etre_planning_ebe_arse',
			weight:2
        });
    }
    

})();

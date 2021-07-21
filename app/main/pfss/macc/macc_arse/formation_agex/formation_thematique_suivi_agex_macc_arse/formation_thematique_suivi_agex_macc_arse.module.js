(function ()
{
    'use strict';

    angular
        .module('app.pfss.macc.macc_arse.formation_agex.formation_thematique_suivi_agex_macc_arse', [])        
        .config(config);
        var vs = {};
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_macc_macc_arse_formation_agex_formation_thematique_suivi_agex_macc_arse', {
            url      : '/arse/formation_thematique_suivi_agex_macc',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/formation_thematique_suivi_agex_macc/formation_thematique_suivi_agex_macc.html',
                    controller : 'Formation_thematique_suivi_agex_maccController as vm'
                }
            },
            bodyClass: 'formation_thematique_suivi_agex_macc_arse',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Suivi de formation AGEX"
            },
            id_sous_projet: 2,
            type_sous_projet: 'ARSE'
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.macc.macc_arse.formation_agex.formation_thematique_suivi_agex_macc_arse', {
            title: 'Suivi de Formation AGEX',
            icon  : 'icon-lumx',
            state: 'app.pfss_macc_macc_arse_formation_agex_formation_thematique_suivi_agex_macc_arse',
			weight:2
        });
    }
    

})();

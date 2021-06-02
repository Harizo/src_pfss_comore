(function ()
{
    'use strict';

    angular
        .module('app.pfss.macc.macc_arse.formation_agex.formation_thematique_agex_arse', [])        
        .config(config);
        var vs = {};
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_macc_macc_arse_formation_agex_formation_thematique_agex_arse', {
            url      : '/arse/formation_thematique_agex',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/formation_thematique_agex/formation_thematique_agex.html',
                    controller : 'Formation_thematique_agexController as vm'
                }
            },
            bodyClass: 'formation_thematique_agex_arse',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Thematique de formation AGEX"
            },
            id_sous_projet: 2,
            type_sous_projet: 'ARSE'
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.macc.macc_arse.formation_agex.formation_thematique_agex_arse', {
            title: 'Thematique de Formation AGEX',
            icon  : 'icon-data',
            state: 'app.pfss_macc_macc_arse_formation_agex_formation_thematique_agex_arse',
			weight:1
        });
    }
    

})();

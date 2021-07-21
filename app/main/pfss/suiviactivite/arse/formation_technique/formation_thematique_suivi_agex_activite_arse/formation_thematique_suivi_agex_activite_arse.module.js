(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_arse.formation_technique.formation_thematique_suivi_agex_activite_arse', [])        
        .config(config);
        var vs = {};
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suivi_arse_formation_technique_formation_thematique_suivi_agex_activite_arse', {
            url      : '/suivi-activite/arse/formation-technique-de-base/formation_thematique_suivi_agex_activite',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/formation_thematique_suivi_agex_activite/formation_thematique_suivi_agex_activite.html',
                    controller : 'Formation_thematique_suivi_agex_activiteController as vm'
                }
            },
            bodyClass: 'formation_thematique_suivi_agex_activite_arse',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Suivi de formation AGEX"
            },
            id_sous_projet: 2,
            type_sous_projet: 'ARSE'
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.formation_technique.formation_thematique_suivi_agex_activite_arse', {
            title: 'Suivi de Formation AGEX',
            icon  : 'icon-lumx',
            state: 'app.pfss_suivi_arse_formation_technique_formation_thematique_suivi_agex_activite_arse',
			weight:2
        });
    }
    

})();

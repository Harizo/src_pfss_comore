(function ()
{
    'use strict';

    angular
        .module('app.pfss.formation_thematique_suivi_agex_activite', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_formation_thematique_suivi_agex_activite', {
            url      : '/formation_thematique_suivi_agex_activite',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/formation_thematique_suivi_agex_activite/formation_thematique_suivi_agex_activite.html',
                    controller : 'Formation_thematique_suivi_agex_activiteController as vm'
                }
            },
            bodyClass: 'formation_thematique_suivi_agex_activite',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Formation suivi agex"
            },
            id_sous_projet: 2,
            type_sous_projet: 'ARSE'
        });

        // Navigation
       /* msNavigationServiceProvider.saveItem('pfss.formation_thematique_suivi_agex_activite', {
            title: 'Suivi formation AGEX',
            icon  : 'icon-data',
            state: 'app.pfss_formation_thematique_suivi_agex_activite',
			weight:8
        });*/
    }

})();

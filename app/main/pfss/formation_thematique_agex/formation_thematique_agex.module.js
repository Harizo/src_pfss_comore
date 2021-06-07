(function ()
{
    'use strict';

    angular
        .module('app.pfss.formation_thematique_agex', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_formation_thematique_agex', {
            url      : '/formation_thematique_agex',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/formation_thematique_agex/formation_thematique_agex.html',
                    controller : 'Formation_thematique_agexController as vm'
                }
            },
            bodyClass: 'formation_thematique_agex',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Formation ml"
            }
        });

        // Navigation
       /* msNavigationServiceProvider.saveItem('pfss.formation_thematique_agex', {
            title: 'Gérer AGEP',
            icon  : 'icon-data',
            state: 'app.pfss_formation_thematique_agex',
			weight:8,
            hidden: function()
            {
                    return true;
            }
        });*/
    }

})();

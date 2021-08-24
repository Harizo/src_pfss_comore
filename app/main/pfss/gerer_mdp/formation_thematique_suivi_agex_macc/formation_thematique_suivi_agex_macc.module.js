(function ()
{
    'use strict';

    angular
        .module('app.pfss.formation_thematique_suivi_agex_macc', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_formation_thematique_suivi_agex_macc', {
            url      : '/formation_thematique_suivi_agex_macc',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/formation_thematique_suivi_agex_macc/formation_thematique_suivi_agex_macc.html',
                    controller : 'Formation_thematique_suivi_agex_maccController as vm'
                }
            },
            bodyClass: 'formation_thematique_suivi_agex_macc',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Formation suivi agex"
            }
        });

        // Navigation
       /* msNavigationServiceProvider.saveItem('pfss.formation_thematique_suivi_agex_macc', {
            title: 'Gérer AGEP',
            icon  : 'icon-data',
            state: 'app.pfss_formation_thematique_suivi_agex_macc',
			weight:8,
            hidden: function()
            {
                    return true;
            }
        });*/
    }

})();

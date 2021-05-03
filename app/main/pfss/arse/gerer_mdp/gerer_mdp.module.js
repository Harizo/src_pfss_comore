(function ()
{
    'use strict';

    angular
        .module('app.pfss.arse.gerer_mdp', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_arse_gerer_mdp', {
            url      : '/arse-gerer-mpd',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/gerer_mdp/gerer_mdp.html',
                    controller : 'gerer_mdpController as vm'
                }
            },
            bodyClass: 'gerer_mdp',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Gérer MDP"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.arse.gerer_mdp', {
            title: 'Gérer Mémoire descriptive du projet',
            icon  : 'icon-tile-four',
            state: 'app.pfss_arse_gerer_mdp',
			weight:8,
        });
    }

})();

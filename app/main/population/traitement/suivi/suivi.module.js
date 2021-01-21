(function ()
{
    'use strict';

    angular
        .module('app.population.traitement.suivi', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_traitement_enquete_suivi', {
            url      : '/traitement/suivi',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/population/traitement/suivi/suivi.html',
                    controller : 'SuiviController as vm'
                }
            },
            bodyClass: 'suivi',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "suivi"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('population.traitement.suivi', {
            title: 'Suivi',
            icon  : 'icon-swap-horizontal',
            state: 'app.population_traitement_enquete_suivi',
            weight: 2
        });
    }

})();

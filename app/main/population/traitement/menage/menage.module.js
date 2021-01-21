(function ()
{
    'use strict';

    angular
        .module('app.population.traitement.menage', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_traitement_enquete_menage', {
            url      : '/traitement/enquete-menage-individu',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/population/traitement/menage/menage.html',
                    controller : 'MenageController as vm'
                }
            },
            bodyClass: 'menage',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Ménage"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('population.traitement.menage', {
            title: 'Enquêtes',
            icon  : 'icon-swap-horizontal',
            state: 'app.population_traitement_enquete_menage',
			weight: 1
        });
    }

})();

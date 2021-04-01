(function ()
{
    'use strict';

    angular
        .module('app.pfss.traitement.menagepreselectionne', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_traitement_menagepreselectionne', {
            url      : '/traitement/menage-preselectionne',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/traitement/menagepreselectionne/menagepreselectionne.html',
                    controller : 'MenagepreselectionneController as vm'
                }
            },
            bodyClass: 'menagepreselectionne',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Ménage préselectionné"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.traitement.menagemenagepreselectionne', {
            title: 'Ménage préselectionné',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_traitement_menagepreselectionne',
			weight: 2
        });
    }

})();

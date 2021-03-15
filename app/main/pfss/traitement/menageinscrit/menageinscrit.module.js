(function ()
{
    'use strict';

    angular
        .module('app.pfss.traitement.menageinscrit', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_traitement_menageinscrit', {
            url      : '/traitement/menage-inscrit',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/traitement/menageinscrit/menageinscrit.html',
                    controller : 'MenageinscritController as vm'
                }
            },
            bodyClass: 'menageinscrit',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Ménage inscrit"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.traitement.menageinscrit', {
            title: 'Ménage inscrit',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_traitement_menageinscrit',
			weight: 1
        });
    }

})();

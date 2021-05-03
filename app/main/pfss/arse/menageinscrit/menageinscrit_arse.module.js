(function ()
{
    'use strict';

    angular
        .module('app.pfss.arse.menageinscrit_arse', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_arse_menageinscrit_arse', {
            url      : '/arse/menage-inscrit-arse',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/act/menageinscrit/menageinscrit.html',
                    controller : 'MenageinscritController as vm'
                }
            },
            bodyClass: 'menageinscrit_arse',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Ménage inscrit ARSE"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.arse.menageinscrit_arse', {
            title: 'Ménage Inscrit',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_arse_menageinscrit_arse',
			weight: 1
        });
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.pfss.act.menageinscrit_act', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_act_menageinscrit_act', {
            url      : '/act/menage-inscrit-act',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/act/menageinscrit/menageinscrit.html',
                    controller : 'MenageinscritController as vm'
                }
            },
            bodyClass: 'menageinscrit_act',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Ménage inscrit ACT"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.act.menageinscrit_act', {
            title: 'Ménage inscrit',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_act_menageinscrit_act',
			weight: 1
        });
    }

})();

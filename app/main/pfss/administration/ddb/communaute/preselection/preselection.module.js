(function ()
{
    'use strict';

    angular
        .module('app.pfss.communaute.preselection', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_communaute_preselection', {
            url      : '/communaute/preselection',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/communaute/preselection/preselection.html',
                    controller : 'PreselectionController as vm'
                }
            },
            bodyClass: 'preselection',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "preselection"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.communaute.preselection', {
            title: 'preselection',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_communaute_preselection',
            weight: 2
        });
    }

})();

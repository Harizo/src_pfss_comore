(function ()
{
    'use strict';

    angular
        .module('app.pfss.mereleaderpereleader.ddbmlpl', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_ddb_mlpl', {
            url      : '/mere-leader-pere-leader/donnees-referentielles',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/mereleaderpereleader/ddbmlpl/ddbmlpl.html',
                    controller : 'DdbmlplController as vm'
                }
            },
            bodyClass: 'ddbmlpl',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Données référentielles"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.mereleaderpereleader.ddbmlpl', {
            title: 'Données référentielles',
            icon  : 'icon-tile-four',
            state: 'app.pfss_ddb_mlpl',
			weight:1,
        });
    }

})();

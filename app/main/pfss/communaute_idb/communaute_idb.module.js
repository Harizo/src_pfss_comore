(function ()
{
    'use strict';

    angular
        .module('app.pfss.communaute_idb', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_communaute_idb', {
            url      : '/communaute_idb',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/communaute_idb/communaute_idb.html',
                    controller : 'Communaute_idbController as vm'
                }
            },
            bodyClass: 'communaute_idb',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Communaute_idb"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.communaute_idb', {
            title: 'Communaute / IDB',
            icon  : 'icon-tile-four',
            state: 'app.pfss_communaute_idb',
			weight:2,
        });
    }

})();

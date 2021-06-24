(function ()
{
    'use strict';

    angular
        .module('app.pfss.macc.macc_arse.mere_leader.fsdr', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_fsdr', {
            url      : '/mere-leader-pere-leader/fsdr',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/macc/macc_arse/mere_leader/fsdr/fsdr.html',
                    controller : 'fsdrController as vm'
                }
            },
            bodyClass: 'fsdr',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Fiche supervision DR"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.macc.macc_arse.mere_leader.fsdr', {
            title: 'Fiche Supérvision Dir Rég',
            icon  : 'icon-tile-four',
            state: 'app.pfss_fsdr',
			weight:2,
        });
    }

})();

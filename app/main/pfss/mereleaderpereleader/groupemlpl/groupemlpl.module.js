(function ()
{
    'use strict';

    angular
        .module('app.pfss.mereleaderpereleader.groupemlpl', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_groupe_mlpl', {
            url      : '/mere-leader-pere-leader/groupe-ml-pl',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/mereleaderpereleader/groupemlpl/groupemlpl.html',
                    controller : 'GroupemlplController as vm'
                }
            },
            bodyClass: 'groupemlpl',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Groupe ML/PL"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.mereleaderpereleader.groupemlpl', {
            title: 'Groupe ML/PL',
            icon  : 'icon-tile-four',
            state: 'app.pfss_groupe_mlpl',
			weight:2,
        });
    }

})();

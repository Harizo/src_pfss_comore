(function ()
{
    'use strict';

    angular
        .module('app.pfss.enquete.menages', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.comores_enquete_menage', {
            url      : '/enquete/menage',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/enquete/menage/menage.html',
                    controller : 'MenagesController as vm'
                }
            },
            bodyClass: 'menages',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "menage"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.enquete.menages', {
            title: 'Enquêtes',
            icon  : 'icon-swap-horizontal',
            state: 'app.comores_enquete_menage',
			weight: 1
        });
    }

})();

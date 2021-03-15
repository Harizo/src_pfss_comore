(function ()
{
    'use strict';

    angular
        .module('app.pfss.communaute.inscription', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_communaute_inscription', {
            url      : '/communaute/inscription',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/communaute/inscription/inscription.html',
                    controller : 'InscriptionController as vm'
                }
            },
            bodyClass: 'inscription',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "inscription"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.communaute.inscription', {
            title: 'inscription',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_communaute_inscription',
            weight: 1
        });
    }

})();

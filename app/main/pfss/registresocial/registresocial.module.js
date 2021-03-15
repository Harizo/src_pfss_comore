(function ()
{
    'use strict';

    angular
        .module('app.pfss.registresocial', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_registresocial', {
            url      : '/registresocial',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/registresocial/registresocial.html',
                    controller : 'RegistresocialController as vm'
                }
            },
            bodyClass: 'registresocial',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Régistre social"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.registresocial', {
            title: 'Régistre social',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_registresocial',
			  weight: 3
        });
    }

})();

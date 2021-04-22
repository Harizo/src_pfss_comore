(function ()
{
    'use strict';

    angular
        .module('app.pfss.importationmenage', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_importationmenage', {
            url      : '/Importation-de-menage',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/importationmenage/importationmenage.html',
                    controller : 'ImportationmenageController as vm'
                }
            },
            bodyClass: 'importationmenage',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Importation ménage"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.importationmenage', {
            title: 'Importation ménage',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_importationmenage',
			weight: 15
        });
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.pfss.enquete.individus', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.comores_enquete_individu', {
            url      : '/enquete/individu',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/enquete/individu/individu.html',
                    controller : 'IndividusController as vm'
                }
            },
            bodyClass: 'individus',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "individu"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('comores.enquete.individu', {
            title: 'Suivi',
            icon  : 'icon-swap-horizontal',
            state: 'app.comores_enquete_individu',
            weight: 2
        });
    }

})();

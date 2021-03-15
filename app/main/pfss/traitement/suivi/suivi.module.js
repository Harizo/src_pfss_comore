(function ()
{
    'use strict';

    angular
        .module('app.pfss.traitement.suivi', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_traitement_enquete_suivi', {
            url      : '/traitement/suivi',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/traitement/suivi/suivi.html',
                    controller : 'SuiviController as vm'
                }
            },
            bodyClass: 'suivi',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "suivi"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.traitement.suivi', {
            title: 'Suivi',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_traitement_enquete_suivi',
            weight: 2
        });
    }

})();

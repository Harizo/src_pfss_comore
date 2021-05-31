(function ()
{
    'use strict';

    angular
        .module('app.pfss.formation_ml', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_formation_ml', {
            url      : '/formation_ml',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/formation_ml/formation_ml.html',
                    controller : 'Formation_mlController as vm'
                }
            },
            bodyClass: 'formation_ml',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Formation ml"
            }
        });

        // Navigation
       /* msNavigationServiceProvider.saveItem('pfss.formation_ml', {
            title: 'Gérer AGEP',
            icon  : 'icon-data',
            state: 'app.pfss_formation_ml',
			weight:8,
            hidden: function()
            {
                    return true;
            }
        });*/
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.pfss.planning_ebe', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_planning_ebe', {
            url      : '/planning_ebe',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/planning_ebe/planning_ebe.html',
                    controller : 'Planning_ebeController as vm'
                }
            },
            bodyClass: 'planning_ebe',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "planning EBE"
            }
        });

        // Navigation
       /* msNavigationServiceProvider.saveItem('pfss.planning_ebe', {
            title: 'Gérer AGEP',
            icon  : 'icon-data',
            state: 'app.pfss_planning_ebe',
			weight:8,
            hidden: function()
            {
                    return true;
            }
        });*/
    }

})();

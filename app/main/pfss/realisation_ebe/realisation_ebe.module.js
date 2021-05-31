(function ()
{
    'use strict';

    angular
        .module('app.pfss.realisation_ebe', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_realisation_ebe', {
            url      : '/realisation_ebe',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/realisation_ebe/realisation_ebe.html',
                    controller : 'Realisation_ebeController as vm'
                }
            },
            bodyClass: 'realisation_ebe',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Realisation EBE"
            }
        });

        // Navigation
       /* msNavigationServiceProvider.saveItem('pfss.realisation_ebe', {
            title: 'Gérer AGEP',
            icon  : 'icon-data',
            state: 'app.pfss_realisation_ebe',
			weight:8,
            hidden: function()
            {
                    return true;
            }
        });*/
    }

})();

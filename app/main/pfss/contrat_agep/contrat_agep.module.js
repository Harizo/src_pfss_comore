(function ()
{
    'use strict';

    angular
        .module('app.pfss.contrat_agep', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_contrat_agep', {
            url      : '/contrat_agep',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/contrat_agep/contrat_agep.html',
                    controller : 'Contrat_agepController as vm'
                }
            },
            bodyClass: 'contratagep',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Contrat agep"
            }
        });

        // Navigation
       /* msNavigationServiceProvider.saveItem('pfss.contrat_agep', {
            title: 'Gérer AGEP',
            icon  : 'icon-data',
            state: 'app.pfss_contrat_agep',
			weight:8,
            hidden: function()
            {
                    return true;
            }
        });*/
    }

})();

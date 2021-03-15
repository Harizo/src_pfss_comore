(function ()
{
    'use strict';

    angular
        .module('app.pfss.contratconsultant', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_contrat_consultant', {
            url      : '/contrat-consultant',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/contratconsultant/contratconsultant.html',
                    controller : 'ContratconsultantController as vm'
                }
            },
            bodyClass: 'contrat',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Contrat consultant"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.contratconsultant', {
            title: 'Contrat consultant',
            icon  : 'icon-tile-four',
            state: 'app.pfss_contrat_consultant',
			weight:8,
        });
    }

})();

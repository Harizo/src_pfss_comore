(function ()
{
    'use strict';

    angular
        .module('app.pfss.arse.menagepreselectionne_arse', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_arse_menagepreselectionne_arse', {
            url      : '/arse/menage-preselectionne-arse',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/act/menagepreselectionne/menagepreselectionne.html',
                    controller : 'MenagepreselectionneController as vm'
                }
            },
            bodyClass: 'menagepreselectionne_arse',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Ménage présélectionné ARSE"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.arse.menagepreselectionne_arse', {
            title: 'Ménage présélectionné',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_arse_menagepreselectionne_arse',
			weight: 2
        });
    }

})();

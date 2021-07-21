(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_arse.suivi_evaluation.informationmereleader', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suiviactivite_suivi_arse_suivievaluation_informationml', {
            url      : '/suiviactivite/arse/suivi-evaluation/information-mere-leader',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/arse/suivi_evaluation/informationmereleader/informationmereleader.html',
                    controller : 'InformationmereleaderController as vm'
                }
            },
            bodyClass: 'pfss_suiviactivite_suivi_arse_suivievaluation_informationml',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Information ML"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.suivi_evaluation.informationmereleader', {
            title: 'Information ML',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suiviactivite_suivi_arse_suivievaluation_informationml',
			weight: 2
        });
    }

})();

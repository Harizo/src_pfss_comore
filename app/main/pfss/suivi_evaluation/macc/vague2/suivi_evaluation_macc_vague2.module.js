(function ()
{
    'use strict';

    angular
        .module('app.pfss.suivi_evaluation.suivi_evaluation_macc.vague2', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suivievaluation_macc_vague2', {
            url      : '/suivi-evaluation/macc/vague2',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suivi_evaluation/macc/vague1/suivi_evaluation_macc_vague1.html',
                    controller : 'Suivievaluationmaccvague1Controller as vm'
                }
            },
            bodyClass: 'suivi_evaluation_macc_vague2',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Suivi évaluation MACC vague 2"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suivi_evaluation.suivi_evaluation_macc.vague2', {
            title: 'Vague 2',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suivievaluation_macc_vague2',
			weight: 2
        });
    }

})();

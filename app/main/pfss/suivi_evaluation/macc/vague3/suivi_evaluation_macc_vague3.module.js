(function ()
{
    'use strict';

    angular
        .module('app.pfss.suivi_evaluation.suivi_evaluation_macc.vague3', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suivievaluation_macc_vague3', {
            url      : '/suivi-evaluation/macc/vague3',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suivi_evaluation/macc/vague1/suivi_evaluation_macc_vague1.html',
                    controller : 'Suivievaluationmaccvague1Controller as vm'
                }
            },
            bodyClass: 'suivi_evaluation_macc_vague3',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Suivi évaluation MACC vague 3"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suivi_evaluation.suivi_evaluation_macc.vague3', {
            title: 'Vague 3',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suivievaluation_macc_vague3',
			weight: 3
        });
    }

})();

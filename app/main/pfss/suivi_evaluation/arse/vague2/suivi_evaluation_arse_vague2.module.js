(function ()
{
    'use strict';

    angular
        .module('app.pfss.suivi_evaluation.suivi_evaluation_arse.vague2', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suivievaluation_arse_vague2', {
            url      : '/suivi-evaluation/arse/vague2',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suivi_evaluation/act/vague1/suivi_evaluation_act_vague1.html',
                    controller : 'Suivievaluationactvague1Controller as vm'
                }
            },
            bodyClass: 'suivi_evaluation_arse_vague2',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Suivi évaluation ARSE vague 2"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suivi_evaluation.suivi_evaluation_arse.vague2', {
            title: 'Vague 2',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suivievaluation_arse_vague2',
			weight: 2
        });
    }

})();

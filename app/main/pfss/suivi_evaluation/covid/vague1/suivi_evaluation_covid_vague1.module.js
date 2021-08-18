(function ()
{
    'use strict';

    angular
        .module('app.pfss.suivi_evaluation.suivi_evaluation_covid.vague1', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suivievaluation_covid_vague1', {
            url      : '/suivi-evaluation/covid-19/vague1',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suivi_evaluation/act/vague1/suivi_evaluation_act_vague1.html',
                    controller : 'Suivievaluationactvague1Controller as vm'
                }
            },
            bodyClass: 'suivi_evaluation_covid_vague1',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Suivi évaluation COVID-19 vague 1"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suivi_evaluation.suivi_evaluation_covid.vague1', {
            title: 'Vague 1',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suivievaluation_covid_vague1',
			weight: 1
        });
    }

})();

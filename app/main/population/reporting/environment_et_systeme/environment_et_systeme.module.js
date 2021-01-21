(function ()
{
    'use strict';

    angular
        .module('app.population.reporting.environment_et_systeme', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_reporting_environment_et_systeme', {
            url      : '/reporting/environment_et_systeme',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/population/reporting/environment_et_systeme/environment_et_systeme.html',
                    controller : 'Environment_et_systemeController as vm'
                }
            },
            bodyClass: 'environment_et_systeme',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "environment_et_systeme"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('population.reporting.environment_et_systeme', {
            title: 'Tableau de bord',
            icon  : 'icon-chart-line',
            state: 'app.population_reporting_environment_et_systeme',
            weight: 1
        });
    }

})();
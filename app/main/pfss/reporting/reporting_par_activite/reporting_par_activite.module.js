(function ()
{
    'use strict';

    angular
        .module('app.pfss.reporting.reporting_par_activite', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_reporting_reporting_par_activite', {
            url      : '/reporting/par-activite',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/reporting/reporting_par_activite/reporting_par_activite.html',
                    controller : 'ReportingparactiviteController as vm'
                }
            },
            bodyClass: 'reporting_par_activite',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Rep Ménage bénéficiaire"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.reporting.reporting_par_activite', {
            title: 'Par Activité/Sexe',
            icon  : 'icon-chart-line',
            state: 'app.pfss_reporting_reporting_par_activite',
            weight: 2
        });
    }

})();
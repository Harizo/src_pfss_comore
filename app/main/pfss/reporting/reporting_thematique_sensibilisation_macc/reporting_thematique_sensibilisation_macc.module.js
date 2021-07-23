(function ()
{
    'use strict';

    angular
        .module('app.pfss.reporting.reporting_thematique_sensibilisation_macc', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_reporting_reporting_thematique_sensibilisation_macc', {
            url      : '/reporting/liste-thematique-sensibilisation-macc',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/reporting/reporting_thematique_sensibilisation_macc/reporting_thematique_sensibilisation_macc.html',
                    controller : 'ReportingthematiquesensibilisationmaccController as vm'
                }
            },
            bodyClass: 'reporting_thematique_sensibilisation_macc',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Sensibilisation MACC"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.reporting.reporting_thematique_sensibilisation_macc', {
            title: 'Thématique sensibilisation MACC',
            icon  : 'icon-chart-line',
            state: 'app.pfss_reporting_reporting_thematique_sensibilisation_macc',
            weight: 4
        });
    }

})();
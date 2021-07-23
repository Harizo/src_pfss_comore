(function ()
{
    'use strict';

    angular
        .module('app.pfss.reporting.reporting_menage_beneficiaire', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_reporting_reporting_menage_beneficiaire', {
            url      : '/reporting/menage-beneficiaire',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/reporting/reporting_menage_beneficiaire/reporting_menage_beneficiaire.html',
                    controller : 'ReportingmenagebeneficiaireController as vm'
                }
            },
            bodyClass: 'reporting_menage_beneficiaire',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Rep Ménage bénéficiaire"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.reporting.reporting_menage_beneficiaire', {
            title: 'Ménage bénéficiaire',
            icon  : 'icon-chart-line',
            state: 'app.pfss_reporting_reporting_menage_beneficiaire',
            weight: 1
        });
    }

})();
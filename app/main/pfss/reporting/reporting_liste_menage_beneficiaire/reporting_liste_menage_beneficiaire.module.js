(function ()
{
    'use strict';

    angular
        .module('app.pfss.reporting.reporting_liste_menage_beneficiaire', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_reporting_menage_beneficiaire', {
            url      : '/reporting/liste-menage-beneficiaire',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/reporting/reporting_liste_menage_inscrit/reporting_liste_menage_inscrit.html',
                    controller : 'ReportinglistemenageController as vm'
                }
            },
            bodyClass: 'reporting_menage_beneficiaire',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Reporting Ménage bénéficiaire"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.reporting.reporting_liste_menage_beneficiaire', {
            title: 'Liste ménage bénéficiaire',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_reporting_menage_beneficiaire',
			weight: 8
        });
    }

})();

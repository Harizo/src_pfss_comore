(function ()
{
    'use strict';

    angular
        .module('app.pfss.reporting.reporting_liste_menage_inapte', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_reporting_menage_inapte', {
            url      : '/reporting/liste-menage-inapte',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/reporting/reporting_liste_menage_inscrit/reporting_liste_menage_inscrit.html',
                    controller : 'ReportinglistemenageController as vm'
                }
            },
            bodyClass: 'reporting_menage_inapte',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Reporting Ménage inapte"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.reporting.reporting_liste_menage_inapte', {
            title: 'Liste ménage inapte',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_reporting_menage_inapte',
			weight: 10
        });
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.pfss.reporting.reporting_liste_menage_inscrit', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_reporting_menage_inscrit', {
            url      : '/reporting/liste-menage-inscrit',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/reporting/reporting_liste_menage_inscrit/reporting_liste_menage_inscrit.html',
                    controller : 'ReportinglistemenageController as vm'
                }
            },
            bodyClass: 'reporting_menage_inscrit',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Reporting Ménage inscrit"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.reporting.reporting_liste_menage_inscrit', {
            title: 'Liste ménage inscrit',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_reporting_menage_inscrit',
			weight: 5
        });
    }

})();

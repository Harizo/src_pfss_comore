(function ()
{
    'use strict';

    angular
        .module('app.pfss.reporting.reporting_liste_menage_sorti', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_reporting_menage_sorti', {
            url      : '/reporting/liste-menage-sorti',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/reporting/reporting_liste_menage_inscrit/reporting_liste_menage_inscrit.html',
                    controller : 'ReportinglistemenageController as vm'
                }
            },
            bodyClass: 'reporting_menage_sorti',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Reporting Ménage sorti"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.reporting.reporting_liste_menage_sorti', {
            title: 'Liste ménage sorti',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_reporting_menage_sorti',
			weight: 9
        });
    }

})();

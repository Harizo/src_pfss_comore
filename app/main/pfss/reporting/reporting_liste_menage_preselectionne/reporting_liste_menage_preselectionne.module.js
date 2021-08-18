(function ()
{
    'use strict';

    angular
        .module('app.pfss.reporting.reporting_liste_menage_preselectionne', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_reporting_menage_preselectionne', {
            url      : '/reporting/liste-menage-preselectionne',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/reporting/reporting_liste_menage_inscrit/reporting_liste_menage_inscrit.html',
                    controller : 'ReportinglistemenageController as vm'
                }
            },
            bodyClass: 'reporting_menage_preselectionne',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Reporting Ménage préseléctionné"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.reporting.reporting_liste_menage_preselectionne', {
            title: 'Liste ménage préseléctionné',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_reporting_menage_preselectionne',
			weight: 7
        });
    }

})();

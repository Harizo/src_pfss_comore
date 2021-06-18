(function ()
{
    'use strict';

    angular
        .module('app.pfss.reporting.reporting', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_reporting_reporting', {
            url      : '/reporting/reporting',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/reporting/reporting/reporting.html',
                    controller : 'reportingController as vm'
                }
            },
            bodyClass: 'reporting',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "reporting"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.reporting.reporting', {
            title: 'Tableau de bord',
            icon  : 'icon-chart-line',
            state: 'app.pfss_reporting_reporting',
            weight: 1
        });
    }

})();
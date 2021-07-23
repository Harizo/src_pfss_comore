(function ()
{
    'use strict';

    angular
        .module('app.pfss.reporting.reporting_thematique_formation_arse', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_reporting_reporting_thematique_formation_arse', {
            url      : '/reporting/liste-thematique-formation-arse',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/reporting/reporting_thematique_formation_arse/reporting_thematique_formation_arse.html',
                    controller : 'ReportingthematiqueformationarseController as vm'
                }
            },
            bodyClass: 'reporting_thematique_formation_arse',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Rep Ménage bénéficiaire"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.reporting.reporting_thematique_formation_arse', {
            title: 'Thématique formation ARSE',
            icon  : 'icon-chart-line',
            state: 'app.pfss_reporting_reporting_thematique_formation_arse',
            weight: 3
        });
    }

})();
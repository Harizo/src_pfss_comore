(function ()
{
    'use strict';

    angular
        .module('app.pfss.tmnccovid.menagepreselectionne_covid', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_covid_menagepreselectionne_covid', {
            url      : '/covid/menage-preselectionne-covid-19',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/act/menagepreselectionne/menagepreselectionne.html',
                    controller : 'MenagepreselectionneController as vm'
                }
            },
            bodyClass: 'menagepreselectionne_covid',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Ménage présélectionné COVID"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.tmnccovid.menagepreselectionne_covid', {
            title: 'Ménage présélectionné',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_covid_menagepreselectionne_covid',
			weight: 2
        });
    }

})();

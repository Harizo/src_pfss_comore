(function ()
{
    'use strict';

    angular
        .module('app.pfss.tmnccovid.menageinscrit_covid', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_covid_menageinscrit_covid', {
            url      : '/covid/menage-inscrit-covid-19',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/act/menageinscrit/menageinscrit.html',
                    controller : 'MenageinscritController as vm'
                }
            },
            bodyClass: 'menageinscrit_covid',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Ménage inscrit COVID"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.tmnccovid.menageinscrit_covid', {
            title: 'Ménage Inscrit',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_covid_menageinscrit_covid',
			weight: 1
        });
    }

})();

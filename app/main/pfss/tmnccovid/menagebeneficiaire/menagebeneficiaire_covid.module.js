(function ()
{
    'use strict';

    angular
        .module('app.pfss.tmnccovid.menagebeneficiaire_covid', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_covid_menagebeneficiaire_covid', {
            url      : '/covid/menage-beneficiaire-covid-19',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/act/menagebeneficiaire/menagebeneficiaire.html',
                    controller : 'MenagebeneficiaireController as vm'
                }
            },
            bodyClass: 'menagebeneficiaire_covid',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Ménage bénéficiaire COVID"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.tmnccovid.menagebeneficiaire_covid', {
            title: 'Ménage bénéficiaire',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_covid_menagebeneficiaire_covid',
			weight: 3
        });
    }

})();

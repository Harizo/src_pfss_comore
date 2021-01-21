(function ()
{
    'use strict';

    angular
        .module('app.population.beneficiaire', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_beneficiaire', {
            url      : '/beneficiaire',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/population/beneficiaire/beneficiaire.html',
                    controller : 'BeneficiaireController as vm'
                }
            },
            bodyClass: 'beneficiaire',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Bénéficiaire"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('population.beneficiaire', {
            title: 'Bénéficiaire',
            icon  : 'icon-swap-horizontal',
            state: 'app.population_beneficiaire',
			  weight: 5
        });
    }

})();

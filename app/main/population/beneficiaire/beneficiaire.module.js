(function ()
{
    'use strict';

    angular
        .module('app.pfss.beneficiaire', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_beneficiaire', {
            url      : '/beneficiaire',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/beneficiaire/beneficiaire.html',
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
        msNavigationServiceProvider.saveItem('pfss.beneficiaire', {
            title: 'Bénéficiaire',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_beneficiaire',
			  weight: 5
        });
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.pfss.communaute.beneficiaire', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_communaute_beneficiaire', {
            url      : '/communaute/beneficiaire',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/communaute/beneficiaire/beneficiaire.html',
                    controller : 'BeneficiaireController as vm'
                }
            },
            bodyClass: 'beneficiaire',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "beneficiaire"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.communaute.beneficiaire', {
            title: 'beneficiaire',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_communaute_beneficiaire',
            weight: 3
        });
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.pfss.arse.menagebeneficiaire_arse', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_arse_menagebeneficiaire_arse', {
            url      : '/arse/menage-beneficiaire-arse',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/act/menagebeneficiaire/menagebeneficiaire.html',
                    controller : 'MenagebeneficiaireController as vm'
                }
            },
            bodyClass: 'menagebeneficiaire_arse',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Ménage bénéficiaire ARSE"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.arse.menagebeneficiaire_arse', {
            title: 'Ménage bénéficiaire',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_arse_menagebeneficiaire_arse',
			weight: 3
        });
    }

})();

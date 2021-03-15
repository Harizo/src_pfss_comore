(function ()
{
    'use strict';

    angular
        .module('app.pfss.traitement.menagebeneficiaire', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_traitement_menagebeneficiaire', {
            url      : '/traitement/menage-beneficiaire',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/traitement/menagebeneficiaire/menagebeneficiaire.html',
                    controller : 'MenagebeneficiaireController as vm'
                }
            },
            bodyClass: 'menagebeneficiaire',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Ménage bénéficiaire"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.traitement.menagebeneficiaire', {
            title: 'Ménage bénéficiaire',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_traitement_menagebeneficiaire',
			weight: 3
        });
    }

})();

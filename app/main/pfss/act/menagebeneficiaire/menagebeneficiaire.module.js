(function ()
{
    'use strict';

    angular
        .module('app.pfss.act.menagebeneficiaire_act', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_act_menagebeneficiaire_act', {
            url      : '/act/menage-beneficiaire-act',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/act/menagebeneficiaire/menagebeneficiaire.html',
                    controller : 'MenagebeneficiaireController as vm'
                }
            },
            bodyClass: 'menagebeneficiaire_act',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Ménage bénéficiaire ACT"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.act.menagebeneficiaire_act', {
            title: 'Ménage bénéficiaire',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_act_menagebeneficiaire_act',
			weight: 3
        });
    }

})();

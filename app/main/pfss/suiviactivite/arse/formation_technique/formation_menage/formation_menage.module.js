(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_arse.formation_technique.formation_menage', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suivi_arse_formation_technique_formation_menage', {
            url      : '/suivi-activite/arse/formation-technique-de-base/fiche-presence',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/arse/formation_technique/formation_menage/formation_menage.html',
                    controller : 'formationmenagesController as vm'
                }
            },
            bodyClass: 'suivi_arse_formation_technique_formation_menage',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONsNEL","ADMIN"],
              page: "Formation ménage"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.formation_technique.formation_menage', {
            title: 'Formation des ménages',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_suivi_arse_formation_technique_formation_menage',
			weight: 1
        });
    }

})();

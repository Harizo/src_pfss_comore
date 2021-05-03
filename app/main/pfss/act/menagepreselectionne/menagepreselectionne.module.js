(function ()
{
    'use strict';

    angular
        .module('app.pfss.act.menagepreselectionne_act', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_act_menagepreselectionne_act', {
            url      : '/act/menage-preselectionne-act',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/act/menagepreselectionne/menagepreselectionne.html',
                    controller : 'MenagepreselectionneController as vm'
                }
            },
            bodyClass: 'menagepreselectionne_act',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Ménage préselectionné ACT"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.act.menagepreselectionne_act', {
            title: 'Ménage préselectionné',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_act_menagepreselectionne_act',
			weight: 2
        });
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.pfss.macc.macc_arse.mere_leader.rapportmensuelmlpl', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_rapportmensuelmlpl', {
            url      : '/mere-leader-pere-leader/rapport-mensuel',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/macc/macc_arse/mere_leader/rapportmensuelmlpl/rapportmensuelmlpl.html',
                    controller : 'RapportmensuelmlplController as vm'
                }
            },
            bodyClass: 'rapportmensuelmlpl',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Rapport mensuel"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.macc.macc_arse.mere_leader.rapportmensuelmlpl', {
            title: 'Rapport mensuel',
            icon  : 'icon-tile-four',
            state: 'app.pfss_rapportmensuelmlpl',
			weight:4,
        });
    }

})();

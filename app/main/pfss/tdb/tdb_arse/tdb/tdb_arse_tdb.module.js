(function ()
{
    'use strict';

    angular
        .module('app.pfss.tdb.tdb_arse.tdb_arse_tdb', [])
        .config(config);

    /** @ngInject */
   function config($stateProvider,  $translatePartialLoaderProvider, msNavigationServiceProvider)  {
        $stateProvider.state('app.pfss_tableau_de_bord_arse_tdb', {
            url      : '/tableaudebord/arse/tableau-de-bord',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/tdb/tdb_act/tdb/tdb_act_tdb.html',
                    controller : 'TableaudebordController as vm'
                }
            },
            bodyClass: 'tdb_arse_tdb',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "TDB-ARSE"
            }
        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.tdb.tdb_arse.tdb_arse_tdb', {
            title : 'Tableau de bord',
            icon  : 'icon-apps',
            state  : 'app.pfss_tableau_de_bord_arse_tdb',
            weight: 2
        });
    }

})();

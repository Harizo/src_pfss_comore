(function ()
{
    'use strict';

    angular
        .module('app.pfss.tdb.tdb_macc.tdb_macc_tdb', [])
        .config(config);

    /** @ngInject */
   function config($stateProvider,  $translatePartialLoaderProvider, msNavigationServiceProvider)  {
        $stateProvider.state('app.pfss_tableau_de_bord_macc_tdb', {
            url      : '/tableaudebord/macc/tableau-de-bord',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/tdb/tdb_act/tdb/tdb_act_tdb.html',
                    controller : 'TableaudebordController as vm'
                }
            },
            bodyClass: 'tdb_macc_tdb',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "TDB-MACC"
            }
        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.tdb.tdb_macc.tdb_macc_tdb', {
            title : 'Tableau de bord',
            icon  : 'icon-apps',
            state  : 'app.pfss_tableau_de_bord_macc_tdb',
            weight: 2
        });
    }

})();

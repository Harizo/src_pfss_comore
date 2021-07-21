(function ()
{
    'use strict';

    angular
        .module('app.pfss.tdb.tdb_macc.tdb_macc_objectif', [])
        .config(config);

    /** @ngInject */
   function config($stateProvider,  $translatePartialLoaderProvider, msNavigationServiceProvider)  {
        $stateProvider.state('app.pfss_tableau_de_bord_macc_objectif', {
            url      : '/tableaudebord/macc/objectif',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/tdb/tdb_act/objectif/tdb_act_objectif.html',
                    controller : 'ObjectifTableaudebordController as vm'
                }
            },
            bodyClass: 'tdb_macc_objectif',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "TDB-Objectif-MACC"
            }
        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.tdb.tdb_macc.tdb_macc_objectif', {
            title : 'Objectif',
            icon  : 'icon-apps',
            state  : 'app.pfss_tableau_de_bord_macc_objectif',
            weight: 1
        });
    }

})();

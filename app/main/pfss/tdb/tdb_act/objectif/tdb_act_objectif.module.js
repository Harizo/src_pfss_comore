(function ()
{
    'use strict';

    angular
        .module('app.pfss.tdb.tdb_act.tdb_act_objectif', [])
        .config(config);

    /** @ngInject */
   function config($stateProvider,  $translatePartialLoaderProvider, msNavigationServiceProvider)  {
        $stateProvider.state('app.pfss_tableau_de_bord_act_objectif', {
            url      : '/tableaudebord/act/objectif',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/tdb/tdb_act/objectif/tdb_act_objectif.html',
                    controller : 'ObjectifTableaudebordController as vm'
                }
            },
            bodyClass: 'tdb_act_objectif',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "TDB-Objectif-ACT"
            }
        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.tdb.tdb_act.tdb_act_objectif', {
            title : 'Objectif',
            icon  : 'icon-apps',
            state  : 'app.pfss_tableau_de_bord_act_objectif',
            weight: 1
        });
    }

})();

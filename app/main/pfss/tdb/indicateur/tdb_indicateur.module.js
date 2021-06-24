(function ()
{
    'use strict';

    angular
        .module('app.pfss.tdb.tdb_indicateur', [])
        .config(config);

    /** @ngInject */
   function config($stateProvider,  $translatePartialLoaderProvider, msNavigationServiceProvider)  {
        $stateProvider.state('app.pfss_tableau_de_bord_indicateur', {
            url      : '/tableaudebord/indicateur',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/tdb/indicateur/tdb_indicateur.html',
                    controller : 'TableaudebordindicateurController as vm'
                }
            },
            bodyClass: 'tdb_indicateur',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "TDB-Indicateur"
            }
        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.tdb.tdb_indicateur', {
            title : 'Indicateur',
            icon  : 'icon-apps',
            state  : 'app.pfss_tableau_de_bord_indicateur',
            weight: 1
        });
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.pfss.tdb.tdb_arse.tdb_arse_objectif', [])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        

        

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.tdb.tdb_arse.tdb_arse_objectif', {
            title : 'Objectif',
            icon  : 'icon-apps',
            weight: 1
        });
    }

})();

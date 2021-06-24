(function ()
{
    'use strict';

    angular
        .module('app.pfss.tdb.tdb_macc.tdb_macc_objectif', [])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        

        

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.tdb.tdb_macc.tdb_macc_objectif', {
            title : 'Objectif',
            icon  : 'icon-apps',
            weight: 1
        });
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.pfss.tdb.tdb_arse', [
			'app.pfss.tdb.tdb_arse.tdb_arse_objectif',
			'app.pfss.tdb.tdb_arse.tdb_arse_tdb',
		])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        

        

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.tdb.tdb_arse', {
            title : "ARSE",
            icon  : 'icon-apps',
            weight: 2
        });
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.pfss.tdb.tdb_macc', [
			'app.pfss.tdb.tdb_macc.tdb_macc_objectif',
			'app.pfss.tdb.tdb_macc.tdb_macc_tdb',
		])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        

        

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.tdb.tdb_macc', {
            title : "Mesure d'accompagnement",
            icon  : 'icon-apps',
            weight: 4
        });
    }

})();

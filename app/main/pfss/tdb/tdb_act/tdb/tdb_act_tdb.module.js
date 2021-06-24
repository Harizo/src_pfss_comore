(function ()
{
    'use strict';

    angular
        .module('app.pfss.tdb.tdb_act.tdb_act_tdb', [])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        

        

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.tdb.tdb_act.tdb_act_tdb', {
            title : 'Tableau de bord',
            icon  : 'icon-apps',
            weight: 2
        });
    }

})();

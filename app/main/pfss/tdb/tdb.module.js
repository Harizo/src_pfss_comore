(function ()
{
    'use strict';

    angular
        .module('app.pfss.tdb', [
            'app.pfss.tdb.tdb_act',
           'app.pfss.tdb.tdb_arse',
           'app.pfss.tdb.tdb_macc',
           'app.pfss.tdb.tdb_indicateur',
        ])


        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        

        

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.tdb', {
            title : 'Tableau de bord',
            icon  : 'icon-apps',
            weight: 17
        });
    }

})();

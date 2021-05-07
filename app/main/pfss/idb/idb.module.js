(function ()
{
    'use strict';

    angular
        .module('app.pfss.idb', [
            'app.pfss.idb.contrat_agep_idb',            
            'app.pfss.idb.gerer_pges_idb',            
            'app.pfss.idb.communaute_idb',
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        

        

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.idb', {
            title : 'IDB',
            icon  : 'icon-apps',
            weight: 6
        });
    }

})();

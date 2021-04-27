(function ()
{
    'use strict';

    angular
        .module('app.pfss.idb', [])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        

        

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.idb', {
            title : 'IDB',
            icon  : 'icon-apps',
            state : 'app.pfss_idb',
            weight: 1
        });
    }

})();

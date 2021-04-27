(function ()
{
    'use strict';

    angular
        .module('app.pfss.arse', [])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        

        

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.arse', {
            title : 'ARSE',
            icon  : 'icon-apps',
            state : 'app.pfss_arse',
           
            weight: 1
        });
    }

})();

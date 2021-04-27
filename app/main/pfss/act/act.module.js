(function ()
{
    'use strict';

    angular
        .module('app.pfss.act', [])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        

        

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.act', {
            title : 'ACT',
            icon  : 'icon-apps',
            state : 'app.pfss_act',
            weight: 1
        });
    }

})();

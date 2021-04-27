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
            weight: 1
        });
    }

})();

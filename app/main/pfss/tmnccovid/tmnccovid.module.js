(function ()
{
    'use strict';

    angular
        .module('app.pfss.tmnccovid', [])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        

        

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.tmnccovid', {
            title : 'TMNC-COVID19',
            icon  : 'icon-apps',
            state : 'app.pfss_tmnccovid',
            weight: 1
        });
    }

})();

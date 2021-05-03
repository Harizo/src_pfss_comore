(function ()
{
    'use strict';

    angular
        .module('app.pfss.act', [
           'app.pfss.act.menageinscrit_act',
           'app.pfss.act.menagepreselectionne_act',
           'app.pfss.act.menagebeneficiaire_act',
		   ])
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

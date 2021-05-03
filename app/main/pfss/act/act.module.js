(function ()
{
    'use strict';

    angular
        .module('app.pfss.act', [
            'app.pfss.act.contrat_agep_act',            
            'app.pfss.act.gerer_pges_act',
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

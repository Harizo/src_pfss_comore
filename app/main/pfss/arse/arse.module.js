(function ()
{
    'use strict';

    angular
        .module('app.pfss.arse', [

            'app.pfss.arse.gerer_mdp',

           'app.pfss.arse.menageinscrit_arse',
           'app.pfss.arse.menagepreselectionne_arse',
           'app.pfss.arse.menagebeneficiaire_arse',
            'app.pfss.arse.contrat_agep_arse',
            //'app.pfss.arse.gerer_pges_arse',
        ])

        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        

        

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.arse', {
            title : 'ARSE',
            icon  : 'icon-apps',
            weight: 3
        });
    }

})();

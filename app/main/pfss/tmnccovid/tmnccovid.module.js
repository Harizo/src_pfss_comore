(function ()
{
    'use strict';

    angular
        .module('app.pfss.tmnccovid', [
           'app.pfss.tmnccovid.menageinscrit_covid',
           'app.pfss.tmnccovid.menagepreselectionne_covid',
           'app.pfss.tmnccovid.menagebeneficiaire_covid',
            'app.pfss.tmnccovid.contrat_agep_tmnccovid',            
            //'app.pfss.tmnccovid.gerer_pges_tmnccovid',
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        

        

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.tmnccovid', {
            title : 'TMNC-COVID19',
            icon  : 'icon-apps',
            weight: 5
        });
    }

})();

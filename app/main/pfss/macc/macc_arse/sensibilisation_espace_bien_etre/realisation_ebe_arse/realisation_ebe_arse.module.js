(function ()
{
    'use strict';

    angular
        .module('app.pfss.macc.macc_arse.sensibilisation_espace_bien_etre.realisation_ebe_arse', [])        
        .config(config);
        var vs = {};
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_macc_macc_arse_sensibilisation_espace_bien_etre_realisation_ebe_arse', {
            url      : '/arse/realisation_ebe',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/realisation_ebe/realisation_ebe.html',
                    controller : 'Realisation_ebeController as vm'
                }
            },
            bodyClass: 'contratagep_arse',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Formation ML arse"
            },
            id_sous_projet: 2,
            type_sous_projet: 'ARSE'
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.macc.macc_arse.sensibilisation_espace_bien_etre.realisation_ebe_arse', {
            title: 'Réalisation EBE ARSE',
            icon  : 'icon-lumx',
            state: 'app.pfss_macc_macc_arse_sensibilisation_espace_bien_etre_realisation_ebe_arse',
			weight:3
        });
    }
    

})();

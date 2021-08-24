(function ()
{
    'use strict';
    angular
        .module('app.pfss.suiviactivite.suivi_arse', [	
            'app.pfss.suiviactivite.suivi_arse.activite_choisis_menage'	,
			'app.pfss.suiviactivite.suivi_arse.paiement_arse',
			'app.pfss.suiviactivite.suivi_arse.profilage_orientation',
			'app.pfss.suiviactivite.suivi_arse.plan_relevement',
			'app.pfss.suiviactivite.suivi_arse.formation_technique',
			'app.pfss.suiviactivite.suivi_arse.suivi_technique',
			'app.pfss.suiviactivite.suivi_arse.fiche_receptrice',
			'app.pfss.suiviactivite.suivi_arse.suivi_evaluation',
			'app.pfss.suiviactivite.suivi_arse.theme_formation',
			'app.pfss.suiviactivite.suivi_arse.carte_beneficiaire',
            ])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse', {
            title : 'ARSE',
            icon  : 'icon-data',
            weight: 1,
        });
    }
    function testPermission(loginService,$cookieStore,apiFactory)
    {
        var id_user = $cookieStore.get('id');
       
        var permission = [];
        if (id_user > 0) 
        {
            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
                var permission = user.roles;
                var permissions = ["TTM"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;
            });
        }     
    }
})();

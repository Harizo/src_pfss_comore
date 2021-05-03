(function ()
{
    'use strict';
    angular
        .module('app.pfss.suiviactivite.suivi_arse', [		
			'app.pfss.suiviactivite.suivi_arse.paiement1',
			'app.pfss.suiviactivite.suivi_arse.profilage_orientation',
			'app.pfss.suiviactivite.suivi_arse.plan_relevement',
			'app.pfss.suiviactivite.suivi_arse.formation_technique',
			'app.pfss.suiviactivite.suivi_arse.paiement2',
			'app.pfss.suiviactivite.suivi_arse.suivi_technique',
			'app.pfss.suiviactivite.suivi_arse.paiement3',
			'app.pfss.suiviactivite.suivi_arse.suivi_evaluation',
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

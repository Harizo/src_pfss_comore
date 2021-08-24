(function ()
{
    'use strict';
    angular
        .module('app.pfss.suiviactivite.suivi_arse.paiement_arse', [			
			'app.pfss.suiviactivite.suivi_arse.paiement_arse.paiement_arse_1',
			'app.pfss.suiviactivite.suivi_arse.paiement_arse.paiement_arse_2',
			'app.pfss.suiviactivite.suivi_arse.paiement_arse.paiement_arse_3',
		])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.paiement_arse', {
            title : ' Etats de paiements',
            icon  : 'icon-data',
            weight: 2,
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

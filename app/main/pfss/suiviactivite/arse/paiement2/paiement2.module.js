(function ()
{
    'use strict';
    angular
        .module('app.pfss.suiviactivite.suivi_arse.paiement2', [			
			'app.pfss.suiviactivite.suivi_arse.paiement2.fiche_recepteur2',
			'app.pfss.suiviactivite.suivi_arse.paiement2.etat_paiement2',
		])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.paiement2', {
            title : 'Deuxième paiement',
            icon  : 'icon-data',
            weight: 6,
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

(function ()
{
    'use strict';
    angular
        .module('app.pfss.suiviactivite.suivi_covid.fiche_receptrice', [			
			'app.pfss.suiviactivite.suivi_covid.fiche_receptrice.fiche_receptrice_1',
			'app.pfss.suiviactivite.suivi_covid.fiche_receptrice.fiche_receptrice_2',
			'app.pfss.suiviactivite.suivi_covid.fiche_receptrice.fiche_receptrice_3',
		])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_covid.fiche_receptrice', {
            title : 'Fiches réceptrices',
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

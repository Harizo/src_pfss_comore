(function ()
{
    'use strict';
    angular
        .module('app.pfss.macc.macc_arse.formation_agex', [	
            'app.pfss.macc.macc_arse.formation_agex.formation_thematique_agex_arse',
            'app.pfss.macc.macc_arse.formation_agex.formation_thematique_suivi_agex_macc_arse'		
            ])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.macc.macc_arse.formation_agex', {
            title : "Formation dex AGEX",
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

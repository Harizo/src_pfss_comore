(function ()
{
    'use strict';
    angular
        .module('app.pfss.macc.macc_arse.formation_mere_leader', [	
            'app.pfss.macc.macc_arse.formation_mere_leader.formation_ml_arse'		
            ])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.macc.macc_arse.formation_mere_leader', {
            title : "Formation mère leader",
            icon  : 'icon-data',
            weight: 3,
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

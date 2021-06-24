(function ()
{
    'use strict';
    angular
        .module('app.pfss.macc.macc_arse.sensibilisation_espace_bien_etre', [	
            'app.pfss.macc.macc_arse.sensibilisation_espace_bien_etre.realisation_ebe_arse',
            'app.pfss.macc.macc_arse.sensibilisation_espace_bien_etre.planning_ebe_arse'		
            ])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.macc.macc_arse.sensibilisation_espace_bien_etre', {
            title : "Sensibilisation EBE",
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

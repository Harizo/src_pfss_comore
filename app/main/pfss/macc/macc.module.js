(function ()
{
    'use strict';
    angular
        .module('app.pfss.macc', [	
			'app.pfss.macc.macc_arse',
			'app.pfss.macc.macc_act',
			'app.pfss.macc.macc_tmnccovid',
            ])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.macc', {
            title : "Mesure d'accompagnement",
            icon  : 'icon-data',
            weight: 8,
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

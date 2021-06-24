(function ()
{
    'use strict';
    angular
        .module('app.pfss.macc.macc_arse.mere_leader', [	
			'app.pfss.macc.macc_arse.mere_leader.ddbmlpl',
			'app.pfss.macc.macc_arse.mere_leader.groupemlpl',
			'app.pfss.macc.macc_arse.mere_leader.rapportmensuelmlpl',
			'app.pfss.macc.macc_arse.mere_leader.visitedomicile',
            'app.pfss.macc.macc_arse.mere_leader.fsdr'
            ])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.macc.macc_arse.mere_leader', {
            title : "Mère leader",
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

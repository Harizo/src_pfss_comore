(function ()
{
    'use strict';
    angular
        .module('app.pfss.suiviactivite.suivi_idb', [	
			'app.pfss.suiviactivite.suivi_idb.etude_technique',
			'app.pfss.suiviactivite.suivi_idb.dossier_technique_projet',
			'app.pfss.suiviactivite.suivi_idb.pges',
			'app.pfss.suiviactivite.suivi_idb.execution_travaux',
			'app.pfss.suiviactivite.suivi_idb.reception_provisoire',
			'app.pfss.suiviactivite.suivi_idb.reception_definitive',
            ])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_idb', {
            title : 'IDB',
            icon  : 'icon-data',
            weight: 4,
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

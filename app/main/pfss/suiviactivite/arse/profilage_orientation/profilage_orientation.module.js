(function ()
{
    'use strict';
    angular
        .module('app.pfss.suiviactivite.suivi_arse.profilage_orientation', [
            'app.pfss.suiviactivite.suivi_arse.profilage_orientation.fiche_profilage_orientation'			
            ])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.profilage_orientation', {
            title : 'Profilage orientation',
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

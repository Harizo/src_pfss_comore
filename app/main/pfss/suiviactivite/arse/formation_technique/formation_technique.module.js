(function ()
{
    'use strict';
    angular
        .module('app.pfss.suiviactivite.suivi_arse.formation_technique', [	
				'app.pfss.suiviactivite.suivi_arse.formation_technique.fiche_presence_formation',
				'app.pfss.suiviactivite.suivi_arse.formation_technique.formation_thematique_agex_activite_arse',
				'app.pfss.suiviactivite.suivi_arse.formation_technique.formation_thematique_suivi_agex_activite_arse',
            ])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.formation_technique', {
            title : 'Formation technique de base',
            icon  : 'icon-data',
            weight: 5,
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

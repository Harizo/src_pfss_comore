(function ()
{
    'use strict';
    angular
        .module('app.pfss.suivi_evaluation.suivi_evaluation_arse', [	
			'app.pfss.suivi_evaluation.suivi_evaluation_arse.vague1',	
			'app.pfss.suivi_evaluation.suivi_evaluation_arse.vague2',	
			'app.pfss.suivi_evaluation.suivi_evaluation_arse.vague3',	
            ])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.suivi_evaluation.suivi_evaluation_arse', {
            title : 'ARSE',
            icon  : 'icon-data',
            weight: 1,
        });
    }
    function testPermission(loginService,$cookieStore,apiFarseory)
    {
        var id_user = $cookieStore.get('id');
       
        var permission = [];
        if (id_user > 0) 
        {
            apiFarseory.getOne("utilisateurs/index", id_user).then(function(result) 
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

(function ()
{
    'use strict';
    angular
        .module('app.pfss.suivi_evaluation.suivi_evaluation_act', [	
			'app.pfss.suivi_evaluation.suivi_evaluation_act.vague1',	
			'app.pfss.suivi_evaluation.suivi_evaluation_act.vague2',	
			'app.pfss.suivi_evaluation.suivi_evaluation_act.vague3',	
            ])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.suivi_evaluation.suivi_evaluation_act', {
            title : 'ACT',
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

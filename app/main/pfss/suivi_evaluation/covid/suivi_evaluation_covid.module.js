(function ()
{
    'use strict';
    angular
        .module('app.pfss.suivi_evaluation.suivi_evaluation_covid', [	
			'app.pfss.suivi_evaluation.suivi_evaluation_covid.vague1',	
			'app.pfss.suivi_evaluation.suivi_evaluation_covid.vague2',	
			'app.pfss.suivi_evaluation.suivi_evaluation_covid.vague3',	
            ])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.suivi_evaluation.suivi_evaluation_covid', {
            title : 'COVID-19',
            icon  : 'icon-data',
            weight: 3,
        });
    }
    function testPermission(loginService,$cookieStore,apiFcovidory)
    {
        var id_user = $cookieStore.get('id');
       
        var permission = [];
        if (id_user > 0) 
        {
            apiFcovidory.getOne("utilisateurs/index", id_user).then(function(result) 
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

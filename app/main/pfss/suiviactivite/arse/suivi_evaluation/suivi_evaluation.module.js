(function ()
{
    'use strict';
    angular
        .module('app.pfss.suiviactivite.suivi_arse.suivi_evaluation', [	
			'app.pfss.suiviactivite.suivi_arse.suivi_evaluation.questionnairemereleader',
			'app.pfss.suiviactivite.suivi_arse.suivi_evaluation.informationmereleader'
            ])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.suivi_evaluation', {
            title : 'Suivi et évaluation',
            icon  : 'icon-data',
            weight: 9,
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

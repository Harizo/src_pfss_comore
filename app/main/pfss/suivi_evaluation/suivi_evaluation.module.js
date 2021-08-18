(function ()
{
    'use strict';

    angular
        .module('app.pfss.suivi_evaluation', [			
 			'app.pfss.suivi_evaluation.suivi_evaluation_arse',
			'app.pfss.suivi_evaluation.suivi_evaluation_act',
			'app.pfss.suivi_evaluation.suivi_evaluation_covid',
            ])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.suivi_evaluation', {
            title : 'Suivi évaluation',
            icon  : 'icon-data',
            weight: 21,
            // hidden: function()
            // {
                    // return vs;
            // }
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

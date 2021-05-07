(function ()
{
    'use strict';

    angular
        .module('app.pfss.mereleaderpereleader', [			
           'app.pfss.mereleaderpereleader.ddbmlpl',
           'app.pfss.mereleaderpereleader.groupemlpl',
           'app.pfss.mereleaderpereleader.visitedomicile',
           'app.pfss.mereleaderpereleader.rapportmensuelmlpl',
            ])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.mereleaderpereleader', {
            title : 'Mère leader pèreleader',
            icon  : 'icon-data',
            weight: 11,
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

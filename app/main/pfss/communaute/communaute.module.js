(function ()
{
    'use strict';

    angular
        .module('app.pfss.communaute', [			
           'app.pfss.communaute.inscription',
           'app.pfss.communaute.preselection',
           'app.pfss.communaute.beneficiaire'
            ])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.communaute', {
            title : 'Communaute',
            icon  : 'icon-data',
            weight: 4,
            /*hidden: function()
            {
                    return vs;
            }*/
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

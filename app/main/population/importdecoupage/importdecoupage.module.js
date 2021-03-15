(function ()
{
    'use strict';

    angular
        .module('app.pfss.importdecoupage', [			
           // 'app.pfss.importdecoupage.decoupageregion',
           // 'app.pfss.importdecoupage.decoupagedistrict',
           // 'app.pfss.importdecoupage.decoupagecommune',
           // 'app.pfss.importdecoupage.decoupagefokontany',
           'app.pfss.importdecoupage.exportdecoupage',
           'app.pfss.importdecoupage.importcoordonneescommune',
            ])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.importdecoupage', {
            title : 'Import découpage admin',
            icon  : 'icon-data',
            weight: 9,
            hidden: function()
            {
                    return vs;
            }
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
                var permissions = ["VLD"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();

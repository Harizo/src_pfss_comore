(function ()
{
    'use strict';

    angular
        .module('app.population.importdecoupage', [			
           // 'app.population.importdecoupage.decoupageregion',
           // 'app.population.importdecoupage.decoupagedistrict',
           // 'app.population.importdecoupage.decoupagecommune',
           // 'app.population.importdecoupage.decoupagefokontany',
           'app.population.importdecoupage.exportdecoupage',
           'app.population.importdecoupage.importcoordonneescommune',
            ])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('population.importdecoupage', {
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

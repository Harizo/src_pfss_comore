(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.exportficheetat', [			
           'app.pfss.suiviactivite.exportficheetat.exportficheetatpresence',
           'app.pfss.suiviactivite.exportficheetat.exportficheetatpaiement',
            ])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.exportficheetat', {
            title : 'Export Fiche/Etat',
            icon  : 'icon-data',
            weight: 1,
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

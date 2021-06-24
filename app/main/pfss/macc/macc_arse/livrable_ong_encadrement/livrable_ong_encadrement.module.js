(function ()
{
    'use strict';
    angular
        .module('app.pfss.macc.macc_arse.livrable_ong_encadrement', [])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider,$stateProvider)
    {   
         // State
         $stateProvider.state('app.pfss_macc_macc_arse_livrable_ong_encadrement', {
            url      : '/macc_arse/livrable_ong_encadrement',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/macc/macc_arse/livrable_ong_encadrement/livrable_ong_encadrement.html',
                    controller : 'Livrable_ong_encadrementController as vm'
                }
            },
            bodyClass: 'livrable_ong_encadrement',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "livrable ong encadrement"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.macc.macc_arse.livrable_ong_encadrement', {
            title : "Livrable ONG d'encadrement",
            icon  : 'icon-data',
            state:'app.pfss_macc_macc_arse_livrable_ong_encadrement',
            weight: 7,
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

(function ()
{
    'use strict';

    angular
        .module('app.pfss.ddb_adm.gerer_pac', [])
        .run(testPermission)
        .config(config);
        var vs ;


    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_ddb_gerer_pac', {
            url      : '/donnees-de-base/type-gerer_pac',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/administration/ddb/gerer_pac/gerer_pac.html',
                    controller : 'Gerer_pacController as vm'
                }
            },
            bodyClass: 'gerer_pac',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Gérer PAC"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.administration.ddb_adm.gerer_pac', {
            title: "Gérer PAC",
            icon  : 'icon-square-inc',
            state: 'app.pfss_ddb_gerer_pac',
            weight: 8
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
                var permissions =   [
                                        "SPR_ADM",
                                        "ACT_TYP"
                                    ];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();

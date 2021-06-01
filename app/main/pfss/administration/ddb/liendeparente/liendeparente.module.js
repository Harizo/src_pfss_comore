(function ()
{
    'use strict';

    angular
        .module('app.pfss.ddb_adm.liendeparente', [])
        .run(testPermission)
        .config(config);
        var vs ;


    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_ddb_liendeparente', {
            url      : '/donnees-de-base/lien-de-parente',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/administration/ddb/liendeparente/liendeparente.html',
                    controller : 'LiendeparenteController as vm'
                }
            },
            bodyClass: 'liendeparente',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Lien de parenté"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.administration.ddb_adm.liendeparente', {
            title: "Lien de parenté",
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_ddb_liendeparente',
            weight: 15,
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

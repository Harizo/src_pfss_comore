(function ()
{
    'use strict';

    angular
        .module('app.pfss.ddb_adm.composante', [])
        .run(testPermission)
        .config(config);
        var vs ;


    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_ddb_composante', {
            url      : '/donnees-de-base/composante',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/administration/ddb/composante/composante.html',
                    controller : 'ComposanteController as vm'
                }
            },
            bodyClass: 'composante',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "composante"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.administration.ddb_adm.composante', {
            title: "composante",
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_ddb_composante',
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

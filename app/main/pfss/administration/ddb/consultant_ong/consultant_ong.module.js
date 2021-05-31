(function ()
{
    'use strict';

    angular
        .module('app.pfss.ddb_adm.consultant_ong', [])
        .run(testPermission)
        .config(config);
        var vs ;


    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_ddb_consultant_ong', {
            url      : '/donnees-de-base/consultant_ong',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/administration/ddb/consultant_ong/consultant_ong.html',
                    controller : 'Consultant_ongController as vm'
                }
            },
            bodyClass: 'consultant_ong',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "consultant_ong"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.administration.ddb_adm.consultant_ong', {
            title: "consultant",
            icon  : 'icon-view-quilt',
            state: 'app.pfss_ddb_consultant_ong',
            weight: 9,
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

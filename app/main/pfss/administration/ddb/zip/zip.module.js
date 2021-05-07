(function ()
{
    'use strict';

    angular
        .module('app.pfss.ddb_adm.zip', [])
        .run(testPermission)
        .config(config);
        var vs ;


    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_ddb_zip', {
            url      : '/donnees-de-base/zip',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/administration/ddb/zip/zip.html',
                    controller : 'ZipController as vm'
                }
            },
            bodyClass: 'zip',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "zip"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.administration.ddb_adm.zip', {
            title: "Milieu/Vague/ZIP",
            icon  : 'icon-view-quilt',
            state: 'app.pfss_ddb_zip',
            weight: 7
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

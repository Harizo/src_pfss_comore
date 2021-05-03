(function ()
{
    'use strict';

    angular
        .module('app.pfss.ddb_adm.type_infrastructure', [])
        .run(testPermission)
        .config(config);
        var vs ;


    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_ddb_type_infrastructure', {
            url      : '/donnees-de-base/type-infrastructure',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/administration/ddb/type_infrastructure/type_infrastructure.html',
                    controller : 'Type_infrastructureController as vm'
                }
            },
            bodyClass: 'type_infrastructure',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Type infrastructure"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.administration.ddb_adm.type_infrastructure', {
            title: "Type Infrastructure,AGR et ACT",
            icon  : 'icon-yelp',
            state: 'app.pfss_ddb_type_infrastructure',
            weight: 5
            // hidden: function()
            // {
                    //return vs;
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

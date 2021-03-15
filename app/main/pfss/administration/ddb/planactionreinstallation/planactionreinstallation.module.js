(function ()
{
    'use strict';

    angular
        .module('app.pfss.ddb_adm.planactionreinstallation', [])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_ddb_ddbplanactionreinstallation', {
            url      : '/donnees-de-base/plan-action-reinstallation',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/administration/ddb/planactionreinstallation/planactionreinstallation.html',
                    controller : 'PlanactionreinstallationController as vm'
                }
            },
            bodyClass: 'ddbplanactionreinstallation',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Plan-action"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.administration.ddb_adm.ddbplanactionreinstallation', {
            title: "Plan action réinstallation",
            icon  : 'icon-map-marker-circle',
            state: 'app.pfss_ddb_ddbplanactionreinstallation',
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
                                        "VAR_INT"
                                    ];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();

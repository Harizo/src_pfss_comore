(function ()
{
    'use strict';

    angular
        .module('app.pfss.ddb_adm.plan_action_reinstallation', [])
        .run(testPermission)
        .config(config);
        var vs ;


    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_ddb_plan_action_reinstallation', {
            url      : '/donnees-de-base/plan_action_reinstallation',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/administration/ddb/plan_action_reinstallation/plan_action_reinstallation.html',
                    controller : 'plan_action_reinstallationController as vm'
                }
            },
            bodyClass: 'plan_action_reinstallation',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "plan_action_reinstallation"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.administration.ddb_adm.Plan_action_reinstallation', {
            title: "Plan action réinstallation",
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_ddb_plan_action_reinstallation',
            weight: 11,
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




(function ()
{
    'use strict';

    angular
        .module('app.pfss.suivi_evaluation.suivi_evaluation_planning.planning_ddb', [])
        .run(testPermission)
        .config(config);
        var vs ;


    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_planning_ddb', {
            url      : '/suiv-evaluation/planning/ddb',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suivi_evaluation/planning/planning_ddb/planning_ddb.html',
                    controller : 'PlanningddbController as vm'
                }
            },
            bodyClass: 'planning_ddb',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "DDB Planning"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suivi_evaluation.suivi_evaluation_planning.planning_ddb', {
            title: "DDB Planning",
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_planning_ddb',
			weigth : 1
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

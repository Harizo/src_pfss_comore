(function ()
{
    'use strict';

    angular
        .module('app.pfss.ddb_adm.phase_execution', [])
        //.run(testPermission)
        .config(config);
        var vs ;


    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_ddb_phase_execution', {
            url      : '/donnees-de-base/phase_execution',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/administration/ddb/phase_execution/phase_execution.html',
                    controller : 'phase_executionController as vm'
                }
            },
            bodyClass: 'phase_execution',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "phase_execution"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.administration.ddb_adm.phase_execution', {
            title: "Phase d'exécution et Année",
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_ddb_phase_execution',
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




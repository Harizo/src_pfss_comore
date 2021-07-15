(function ()
{
    'use strict';

    angular
        .module('app.pfss.ddb_adm.type_infrastructure_agr', [])
        .run(testPermission)
        .config(config);
        var vs ;


    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_ddb_type_infrastructure_agr', {
            url      : '/donnees-de-base/type_infrastructure_agr',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/administration/ddb/type_infrastructure_agr/type_infrastructure_agr.html',
                    controller : 'type_infrastructure_agrController as vm'
                }
            },
            bodyClass: 'type_infrastructure_agr',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Type_activité-ARSE-ACT"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.administration.ddb_adm.type_infrastructure_agr', {
            title: "Type de l'activité, ARSE, ACT",
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_ddb_type_infrastructure_agr',
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




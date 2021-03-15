(function ()
{
    'use strict';

    angular
        .module('app.pfss.ddb_adm.variable', [])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_ddb_ddbvariable', {
            url      : '/donnees-de-base/reponse',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/administration/ddb/variable/variable.html',
                    controller : 'VariableController as vm'
                }
            },
            bodyClass: 'ddbvariable',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "ddbvariable"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.administration.ddb_adm.ddbvariable', {
            title: "Réponse/Ménage",
            icon  : 'icon-map-marker-circle',
            state: 'app.pfss_ddb_ddbvariable',
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

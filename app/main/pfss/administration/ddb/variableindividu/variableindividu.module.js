(function ()
{
    'use strict';

    angular
        .module('app.pfss.ddb_adm.variableindividu', [])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_ddb_ddbvariableindividu', {
            url      : '/donnees-de-base/reponse-individu',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/administration/ddb/variableindividu/variableindividu.html',
                    controller : 'VariableindividuController as vm'
                }
            },
            bodyClass: 'ddbvariableindividu',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "ddbvariableindividu"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.administration.ddb_adm.ddbvariableindividu', {
            title: "Réponse/individu",
            icon  : 'icon-map-marker-circle',
            state: 'app.pfss_ddb_ddbvariableindividu',
			weight: 6,
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

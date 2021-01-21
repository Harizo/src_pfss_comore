(function ()
{
    'use strict';

    angular
        .module('app.population.ddb_adm.projet', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_ddb_ddbprojet', {
            url      : '/donnees-de-base/programme',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/population/administration/ddb/ddbprojet/ddbprojet.html',
                    controller : 'DdbprojetController as vm'
                }
            },
            bodyClass: 'ddbprojet',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "DDB-Programme"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('population.administration.ddb_adm.ddbprojet', {
            title: "Variables programme",
            icon  : 'icon-swap-horizontal',
            state: 'app.population_ddb_ddbprojet',
            hidden: function()
            {
                    return vs;
            }
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
                                        "PROG"
                                    ];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();

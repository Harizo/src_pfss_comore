(function ()
{
    'use strict';

    angular
        .module('app.population.ddb_adm.acteurs', [])
        .run(testPermission)
        .config(config);
        var vs ;


    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_ddb_acteurs', {
            url      : '/donnees-de-base/acteurs',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/population/administration/ddb/acteurs/acteurs.html',
                    controller : 'ActeursController as vm'
                }
            },
            bodyClass: 'acteurs',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Acteurs-Type transfert"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('population.administration.ddb_adm.acteurs', {
            title: "Acteurs/Type transfert",
            icon  : 'icon-swap-horizontal',
            state: 'app.population_ddb_acteurs',
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
                                        "ACT_TYP"
                                    ];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();

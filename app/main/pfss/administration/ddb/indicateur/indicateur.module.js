(function ()
{
    'use strict';

    angular
        .module('app.pfss.ddb_adm.indicateur', [])
        .run(testPermission)
        .config(config);
        var vs ;


    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_ddb_indicateur', {
            url      : '/donnees-de-base/type-indicateur',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/administration/ddb/indicateur/indicateur.html',
                    controller : 'IndicateurController as vm'
                }
            },
            bodyClass: 'indicateur',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Indicateur"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.administration.ddb_adm.indicateur', {
            title: "Indicateur",
            icon  : 'icon-square-inc',
            state: 'app.pfss_ddb_indicateur',
            weight: 8,
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

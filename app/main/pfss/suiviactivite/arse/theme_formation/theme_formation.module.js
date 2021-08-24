(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_arse.theme_formation', [])
        .run(testPermission)
        .config(config);
        var vs ;


    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suiviactivite_suivi_arse_theme_formation', {
            url      : '/suivi-activite/arse/theme-formation',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/arse/theme_formation/theme_formation.html',
                    controller : 'ThemeformationController as vm'
                }
            },
            bodyClass: 'indicateur',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Thème-Formation"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.theme_formation', {
            title: "Thème-Formation",
            icon  : 'icon-square-inc',
            state: 'app.pfss_suiviactivite_suivi_arse_theme_formation',
            weight: 6
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

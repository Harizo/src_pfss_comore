(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_arse.activite_choisis_menage', [])
        .run(testPermission)
        .config(config);
        var vs ;


    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suiviactivite_suivi_arse_activite_choisis_menage', {
            url      : '/suivi-activite/arse/theme-formation',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/suiviactivite/arse/activite_choisis_menage/activite_choisis_menage.html',
                    controller : 'actchoisisController as vm'
                }
            },
            bodyClass: 'indicateur',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Activités choisis"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.activite_choisis_menage', {
            title: "Activités ménages",
            icon  : 'icon-square-inc',
            state: 'app.pfss_suiviactivite_suivi_arse_activite_choisis_menage',
            weight: 1
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

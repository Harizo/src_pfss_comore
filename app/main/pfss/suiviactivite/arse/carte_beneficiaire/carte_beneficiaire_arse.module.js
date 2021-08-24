(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_arse.carte_beneficiaire', [])
        .run(testPermission)
        .config(config);
        var vs ;


    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suiviactivite_suivi_arse_carte_beneficiaire', {
            url      : '/suivi-activite/arse/carte-beneficiaire',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/act/menagebeneficiaire/menagebeneficiaire.html',
                    controller : 'MenagebeneficiaireController as vm'
                }
            },
            bodyClass: 'suiviactivite_suivi_arse_carte_beneficiaire',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Carte bénéficiaire"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.theme_formation', {
            title: "Carte bénéficiaire",
            icon  : 'icon-square-inc',
            state: 'app.pfss_suiviactivite_suivi_arse_carte_beneficiaire',
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

(function ()
{
    'use strict';

    angular
        .module('app.pfss.traitement.decaissement', [])
        .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_saisie_decaissement', {
            url      : '/traitement/décaissement',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/traitement/decaissement/decaissement.html',
                    controller : 'DecaissementController as vm'
                }
            },
            bodyClass: 'decaissement',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Décaissement"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.decaissement', {
            title: 'Suivi Décaissement',
            icon  : 'icon-cash',
            state: 'app.pfss_saisie_decaissement',
			weight: 8,
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
        if (id_user) 
        {
            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
                var permission = user.roles;
                var permissions =   [
                                        "SPR_ADM",
                                        "SUI_DEC"
                                    ];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;
              

            });
        }
     
    }

})();

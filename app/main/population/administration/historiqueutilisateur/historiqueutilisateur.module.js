(function ()
{
    'use strict';

    angular
        .module('app.pfss.administration.historiqueutilisateur', [])              
        .run(testPermission)        
        .config(config);
        var vs ;
    
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_admin_historiqueutilisateur', {
            url      : '/administration/historiqueutilisateur',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/administration/historiqueutilisateur/historiqueutilisateur.html',
                    controller : 'HistoriqueutilisateurController as vm'
                }
            },
            bodyClass: 'historiqueutilisateur',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Historique_utilisateur"
            }
        });

        

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.administration.historiqueutilisateur', {
            title: 'Historique utilisateur',
            icon  : 'icon-package-variant',
            state: 'app.pfss_admin_historiqueutilisateur',
            hidden: function()
            {
                    return vs;
            },
			weight: 3
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
                                        "SPR_ADM",//administration
                                        
                                        "HIS_USER"//fin administration
                                        
                                    ];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;
              

            });
        }
     
    }

})();

(function ()
{
    'use strict';

    angular
        .module('app.population.administration.groupe_user', [])
        .run(notification)        
        .config(config);
        var vs = {};
        var affichage;
    
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_admin_groupe_user', {
            url      : '/administration/groupe_user',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/population/administration/groupe_user/groupe_user.html',
                    controller : 'Groupe_userController as vm'
                }
            },
            bodyClass: 'groupe_user',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Gestion_groupe_user"
            }
        });

        

        // Navigation
        msNavigationServiceProvider.saveItem('population.administration.groupe_user', {
            title: "Groupes d'utilisateurs",
            icon  : 'icon-account-multiple',
            state: 'app.population_admin_groupe_user',
            hidden:function()
            {
                    return affichage;
            },
			weight: 1
        });
    }

    function notification($cookieStore,apiFactory,$interval,loginService)
    {
        var id_user = $cookieStore.get('id');
       
        
        

        

        if (id_user > 0) 
        {
            var permission = [];
            
            apiFactory.getUserByEnabled("utilisateurs",Number(1)).then(function(result) 
            {
                var x = result.data.response;
                vs.content = x ;
                vs.color = '#F44336' ;

            });

            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {

                //**************************************************
                /*$interval(function(){apiFactory.getUserByEnabled("utilisateurs",Number(1)).then(function(result) 
                {
                    var resultat = result.data.response;

                    if (vs.content != resultat) 
                    {
                        vs.content = resultat ;
                    };
                    
                

                });},15000) ;*/
                //**************************************************
                var user = result.data.response;
               

                var permission = user.roles;
                var permissions =   [
                                        "SPR_ADM",
                                        "GRP_USER"
                                    ];
                affichage =  loginService.gestionMenu(permissions,permission);        
                

            });
        }
     
    }

})();

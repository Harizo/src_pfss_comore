(function ()
{
    'use strict';

    angular
        .module('app.population.administration.cours_de_change', [])              
        .run(testPermission)        
        .config(config);
        var vs ;
    
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_admin_cours_de_change', {
            url      : '/administration/cours-devise',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/population/administration/cours_de_change/cours_de_change.html',
                    controller : 'CoursdechangeController as vm'
                }
            },
            bodyClass: 'cours_de_change',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Cours-de-change"
            }
        });

        

        // Navigation
        msNavigationServiceProvider.saveItem('population.administration.cours_de_change', {
            title: 'Cours de change',
            icon  : 'icon-currency-eur',
            state: 'app.population_admin_cours_de_change',
			weight: 5,
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
                                        "SPR_ADM",//administration
                                        "CR_CHANGE"
                                    ];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;
              

            });
        }
     
    }

})();
